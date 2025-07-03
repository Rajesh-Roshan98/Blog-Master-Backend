const express = require('express');
require('dotenv').config();
const { dbConnect } = require('./config/dbConnect');
const blogRoutes = require('./routes/blogRoutes');
const authRoutes = require('./routes/authRoutes');
const contactRoutes = require('./routes/contactRoutes');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;


app.use(cors({
  origin: ['http://localhost:5174', 'http://localhost:3000'], 
  credentials: true
}));

app.use(cookieParser());
app.use(express.json());

dbConnect();


app.use('/api/blogs', blogRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/contact', contactRoutes);

app.listen(port, () => {
  console.log(`🚀 Server is running on http://localhost:${port}`);
});
