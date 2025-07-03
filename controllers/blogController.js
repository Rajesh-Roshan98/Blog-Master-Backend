const Blog = require('../model/blogModel');


exports.createBlog = async (req, res) => {
  try {
    const { title, content, category } = req.body;

    if (!title || !content) {
      return res.status(400).json({
        success: false,
        message: "Title and content are required"
      });
    }

    await Blog.create({
      title,
      content,
      category,
      author: req.user._id // Set author to logged-in user
    });

    return res.status(201).json({
      success: true,
      message: "Blog created successfully"
    });

  } catch (e) {
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

// Get only blogs for the logged-in user
exports.getMyBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({ author: req.user._id }).sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      data: blogs
    });
  } catch (e) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch blogs"
    });
  }
};

exports.getBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: blogs });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to fetch all blogs" });
  }
};

