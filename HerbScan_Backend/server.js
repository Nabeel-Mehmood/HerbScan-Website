// server.js
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');
const session = require('express-session');
require('dotenv').config();

connectDB();

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const plantRoutes = require('./routes/plantRoutes');
const emailRoutes = require('./routes/emailRoutes');
const profileRoutes = require('./routes/profileRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const plantSearchRoutes = require('./routes/plantSearchRoutes');

const app = express();

app.set('trust proxy', 1);

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));

app.use(express.json());

app.use(session({
  secret: process.env.SESSION_SECRET || 'your_default_session_secret',
  resave: false,
  saveUninitialized: false,
  rolling: true,
  cookie: { 
    maxAge: 3600000,
    secure: false,
    sameSite: 'lax'
  }
}));

// Mount routes.
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/plants', plantRoutes);
app.use('/api/emails', emailRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/plants', plantSearchRoutes);

// Serve static files from the uploads folder.
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'build')));
  app.get('*', (req, res) => res.sendFile(path.join(__dirname, 'build', 'index.html')));
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
