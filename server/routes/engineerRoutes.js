const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { verifyToken, requiremanager } = require('../middleware/authMiddleware');

//  GET /api/engineers (filter by skills, department, seniority)
router.get('/', verifyToken, requiremanager, async (req, res) => {
  try {
    const { skills, department, seniority } = req.query;
    const query = { role: 'engineer' };

    if (skills) {
      const skillsArray = skills.split(',').map(s => s.trim());
      query.skills = { $all: skillsArray }; // engineer must have all skills
    }
    if (department) query.department = department;
    if (seniority) query.seniority = seniority;

    const engineers = await User.find(query).select('-password');
    res.json(engineers);
  } catch (err) {
    console.error('Error fetching engineers:', err);
    res.status(500).json({ message: 'Failed to fetch engineers' });
  }
});

// GET /api/engineers/:id/capacity (get engineer's capacity info)
router.get('/:id/capacity', verifyToken, requiremanager, async (req, res) => {
  try {
    const engineer = await User.findById(req.params.id).select('maxCapacity');
    if (!engineer) {
      return res.status(404).json({ message: 'Engineer not found' });
    }

    const Assignment = require('../models/Assignment');
    const assignments = await Assignment.find({ engineer: req.params.id });

    const used = assignments.reduce((acc, a) => acc + a.allocationPercentage, 0);
    const available = engineer.maxCapacity - used;

    res.json({
      maxCapacity: engineer.maxCapacity,
      used,
      available,
    });
  } catch (error) {
    console.error('Error fetching capacity:', error);
    res.status(500).json({ message: 'Failed to get capacity data' });
  }
});

module.exports = router;
