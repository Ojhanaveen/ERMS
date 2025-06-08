const mongoose = require('mongoose');

const engineerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: false, // optional; remove if not needed
    trim: true,
    lowercase: true,
  },
  skills: {
    type: [String],
    default: [],
  },
  available: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Engineer', engineerSchema);
