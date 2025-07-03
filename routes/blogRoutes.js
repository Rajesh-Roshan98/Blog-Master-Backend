const express = require('express');
const router = express.Router();
const { createBlog, getBlogs, getMyBlogs } = require('../controllers/blogController');
const { isAuthenticated } = require('../middlewares/authMiddleware');


router.post('/createblog', isAuthenticated, createBlog);
router.get('/myblogs', isAuthenticated, getMyBlogs);
router.get('/allblogs', getBlogs);

module.exports = router;
