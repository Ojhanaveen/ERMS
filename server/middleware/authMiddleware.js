const jwt = require('jsonwebtoken');
const User = require('../models/User');
const JWT_SECRET = process.env.JWT_SECRET;

// ✅ Middleware: Verify Token
exports.verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Access denied: No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) return res.status(403).json({ message: 'User not found' });

    req.user = {
      id: user._id,
      email: user.email,
      name: user.name,
      role: user.role,
    };

    next();
  } catch (err) {
    console.error('JWT Error:', err.message);
    res.status(403).json({ message: 'Invalid or expired token' });
  }
};

// ✅ Manager role only
exports.requiremanager = (req, res, next) => {
  if (req.user.role !== 'manager') {
    return res.status(403).json({ message: 'Access denied: Managers only' });
  }
  next();
};

// ✅ Engineer role only
exports.requireEngineer = (req, res, next) => {
  if (req.user.role !== 'engineer') {
    return res.status(403).json({ message: 'Access denied: Engineers only' });
  }
  next();
};
