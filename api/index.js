const express = require('express');
require('dotenv').config();
const { dbConnect } = require('../config/dbConnect');
const blogRoutes = require('../routes/blogRoutes');
const authRoutes = require('../routes/authRoutes');
const contactRoutes = require('../routes/contactRoutes');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const app = express();

app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000', 'https://rajesh-roshan98.github.io'],
  credentials: true
}));

app.use(cookieParser());
app.use(express.json());

dbConnect();

app.use('/api/blogs', blogRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/contact', contactRoutes);

// Root route for health check or friendly message
app.get('/', (req, res) => {
  res.send('API is running!');
});

// Handle favicon.ico requests with a 204 No Content
app.get('/favicon.ico', (req, res) => res.status(204).end());

module.exports = (req, res) => {
  app(req, res);
};
