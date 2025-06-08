const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/authMiddleware');
const User = require('../models/User');

// GET /api/users?page=1&limit=10&role=manager
router.get('/users', verifyToken, async (req, res) => {
  try {
    const { page = 1, limit = 10, role } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const userRole = req.user.role;
    const userId = req.user.id;

    let query = {};

    if (userRole === 'manager') {
      // manager can filter by role
      if (role) {
        query.role = role;
      }
    } else if (userRole === 'engineer') {
      // Engineers can only see themselves
      query._id = userId;
    } else {
      return res.status(403).json({ message: 'Access denied' });
    }

    const users = await User.find(query)
      .select('-password')
      .skip(skip)
      .limit(parseInt(limit));

    const total = await User.countDocuments(query);

    // Set total in header for frontend pagination use
    res.set('X-Total-Count', total);
    res.set('Access-Control-Expose-Headers', 'X-Total-Count');

    res.status(200).json(users);
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
