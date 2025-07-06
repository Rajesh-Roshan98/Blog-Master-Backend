const Blog = require('../model/blogModel');
const { dbConnect } = require('../config/dbConnect'); // ✅ Add DB connection import

// Create Blog
exports.createBlog = async (req, res) => {
  try {
    await dbConnect(); // ✅ Ensure DB connection

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
      author: req.user._id
    });

    return res.status(201).json({
      success: true,
      message: "Blog created successfully"
    });

  } catch (e) {
    console.error("Create blog error:", e);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

// Get blogs of logged-in user
exports.getMyBlogs = async (req, res) => {
  try {
    await dbConnect();

    const blogs = await Blog.find({ author: req.user._id }).sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      data: blogs
    });
  } catch (e) {
    console.error("Fetch my blogs error:", e);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch blogs"
    });
  }
};

// Get all blogs
exports.getBlogs = async (req, res) => {
  try {
    await dbConnect();

    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: blogs });
  } catch (err) {
    console.error("Fetch all blogs error:", err);
    res.status(500).json({ success: false, message: "Failed to fetch all blogs" });
  }
};
