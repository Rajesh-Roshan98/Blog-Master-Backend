const express = require('express');
require('dotenv').config();
const { dbConnect } = require('../config/dbConnect');
const blogRoutes = require('../routes/blogRoutes');
const authRoutes = require('../routes/authRoutes');
const contactRoutes = require('../routes/contactRoutes');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const app = express();

// CORS Setup
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:3000',
    'https://rajesh-roshan98.github.io',
    'https://blog-master-frontend-beta.vercel.app'
  ],
  credentials: true
}));

app.use(cookieParser());
app.use(express.json());

// ✅ Middleware to ensure DB connection on every request (required for Vercel)
app.use(async (req, res, next) => {
  try {
    await dbConnect();
    next();
  } catch (err) {
    console.error("❌ DB connection error in middleware:", err.message);
    res.status(500).json({ success: false, message: 'Database connection failed' });
  }
});

// ✅ API Routes
app.use('/api/blogs', blogRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/contact', contactRoutes);

// ✅ Health check
app.get('/', (req, res) => {
  res.send('🚀 API is running!');
});

// ✅ Handle favicon requests
app.get('/favicon.ico', (req, res) => res.status(204).end());
app.get('/favicon.png', (req, res) => res.status(204).end());

// ✅ Vercel handler export
module.exports = (req, res) => {
  app(req, res);
};
