const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Title can't be empty"],
    trim: true
  },
  content: {
    type: String,
    required: [true, "Content can't be empty"]
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, "Author is required"],
  },
  category: {
    type: String,
    trim: true
  },
}, {
  timestamps: true
});

module.exports = mongoose.model('Blog', blogSchema);
