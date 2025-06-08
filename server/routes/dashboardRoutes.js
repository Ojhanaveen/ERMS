const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Assignment = require('../models/Assignment');
const { verifyToken, requiremanager } = require('../middleware/authMiddleware');

router.get('/manager', verifyToken, requiremanager, async (req, res) => {
  try {
    const engineers = await User.find({ role: 'engineer' });

    const dashboardData = await Promise.all(engineers.map(async (engineer) => {
      const assignments = await Assignment.find({ engineer: engineer._id });
      const totalAllocation = assignments.reduce((sum, a) => sum + a.allocationPercentage, 0);
      const utilization = Math.round((totalAllocation / engineer.maxCapacity) * 100);

      return {
        id: engineer._id,
        name: engineer.name,
        skills: engineer.skills,
        department: engineer.department,
        maxCapacity: engineer.maxCapacity,
        currentAllocation: totalAllocation,
        utilization: `${utilization}%`,
        status: utilization > 100 ? 'Overloaded' : utilization < 50 ? 'Underutilized' : 'Optimal'
      };
    }));

    res.json(dashboardData);

  } catch (err) {
    console.error('Dashboard error:', err);
    res.status(500).json({ message: 'Dashboard fetch failed' });
  }
});

module.exports = router;
