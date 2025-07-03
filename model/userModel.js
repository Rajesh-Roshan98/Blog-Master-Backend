const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: [true,"First name can't be empty"],
    trim: true,
  },
  middlename: {
    type: String,
    trim: true,
  },
  lastname: {
    type: String,
    required: [true,"Last name can't be empty"],
    trim: true,
  },
  email: {
    type: String,
    required: [true,"Email can't be empty"],
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: [true,"Password can't be empty"],
  },
  gender: {
    type: String,
    enum: ["Male","Female"],
    required: [true,"Please select a gender"],
  },
  avatar: {
    type: String,
    default: '', // URL to avatar image (Google or custom)
  },
  googleId: {
    type: String,
    default: '',
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model("User",userSchema);
