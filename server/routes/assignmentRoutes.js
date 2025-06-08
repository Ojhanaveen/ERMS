const express = require('express');
const router = express.Router();
const Assignment = require('../models/Assignment');
const { verifyToken, requiremanager } = require('../middleware/authMiddleware');

// ✅ Create Assignment (Manager Only)
router.post('/assign', verifyToken, requiremanager, async (req, res) => {
  try {
    const { engineerId, projectId, allocationPercentage, startDate, endDate, role } = req.body;

    const existingAssignments = await Assignment.find({ engineerId });
    const totalAllocated = existingAssignments.reduce((sum, a) => sum + a.allocationPercentage, 0);

    if (totalAllocated + allocationPercentage > 100) {
      return res.status(400).json({ message: 'Engineer exceeds 100% allocation' });
    }

    const assignment = new Assignment({
      engineerId,
      projectId,
      allocationPercentage,
      startDate,
      endDate,
      role
    });

    await assignment.save();
    res.status(201).json({ message: 'Engineer assigned successfully', assignment });

  } catch (err) {
    console.error('Assignment error:', err);
    res.status(500).json({ message: 'Error assigning engineer' });
  }
});

// ✅ Get Assignments (Role-based)
router.get('/', verifyToken, async (req, res) => {
  try {
    const { role, id } = req.user;
    const { engineerId } = req.query;

    let assignments;

    if (role === 'manager') {
      assignments = await Assignment.find(engineerId ? { engineerId } : {})
        .populate('engineerId', 'name email')
        .populate('projectId', 'name');
    } else if (role === 'engineer') {
      assignments = await Assignment.find({ engineerId: id })
        .populate('projectId', 'name description startDate endDate');
    } else {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(assignments);
  } catch (err) {
    console.error('Assignment fetch error:', err);
    res.status(500).json({ message: 'Server error fetching assignments' });
  }
});

// ✅ Update Assignment (Manager only)
router.put('/:id', verifyToken, requiremanager, async (req, res) => {
  try {
    const updated = await Assignment.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'Assignment not found' });

    res.json({ message: 'Assignment updated successfully', assignment: updated });
  } catch (err) {
    console.error('Assignment update error:', err);
    res.status(500).json({ message: 'Error updating assignment' });
  }
});

// ✅ Delete Assignment (Manager only)
router.delete('/:id', verifyToken, requiremanager, async (req, res) => {
  try {
    const deleted = await Assignment.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Assignment not found' });

    res.json({ message: 'Assignment deleted successfully' });
  } catch (err) {
    console.error('Assignment delete error:', err);
    res.status(500).json({ message: 'Error deleting assignment' });
  }
});

module.exports = router;
