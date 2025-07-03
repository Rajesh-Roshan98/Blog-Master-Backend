const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true,
  },
  otp: {
    type: String,
    required: true,
  },
}, {
  timestamps: true 
});

module.exports = mongoose.model('Otp', otpSchema);
