const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;

// Register new user
exports.register = async (req, res) => {
  try {
   
    const {
      name,
      email,
      password,
      role,
      skills,
      seniority,
      maxCapacity,
      department
    } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const userData = {
      name,
      email,
      password: hashedPassword,
      role,
      department,
    };

    if (role === 'engineer') {
      userData.skills = skills;
      userData.seniority = seniority;
      userData.maxCapacity = maxCapacity;
    }

    const user = new User(userData);
    await user.save();

    res.status(201).json({ message: 'User registered successfully' });

  } catch (err) {
    console.error('Registration Error:', err); // <-- log for debugging
    res.status(500).json({ message: 'Server error during registration' });
  }
};

// Login user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign(
      { id: user._id, role: user.role, },
      JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({ token, user: { id: user._id, name: user.name, role: user.role } });

  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
