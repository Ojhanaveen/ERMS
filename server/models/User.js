// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // Hashed password
  role: {
    type: String,
    enum: ['engineer', 'manager'],
    required: true
  },
  // Fields for engineers
  skills: [{ type: String }],
  seniority: {
    type: String,
    enum: ['junior', 'mid', 'senior']
  },
  maxCapacity: {
    type: Number,
    enum: [50, 100],
    default: 100
  },
  department: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
