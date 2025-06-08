const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');
const { verifyToken } = require('../middleware/authMiddleware');

router.post('/register', register);
// Login route
router.post('/login', login);

//  Profile route (after login)
router.get('/profile', verifyToken, async (req, res) => {
  res.json(req.user); // user info attached by verifyToken middleware
});

module.exports = router;
