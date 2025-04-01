// server.js
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');
const session = require('express-session');
require('dotenv').config();

connectDB();

const authRoutes = require('./routes/authRoutes');
const app = express();

// If you use a proxy (e.g. Create React App proxy), trust it.
app.set('trust proxy', 1);

app.use(cors({
  origin: 'http://localhost:3000', // Adjust to your frontend origin.
  credentials: true,
}));

app.use(express.json());

// Session settings with rolling enabled so that the cookie expiration refreshes on each request.
app.use(session({
  secret: process.env.SESSION_SECRET || 'your_default_session_secret',
  resave: false,
  saveUninitialized: false,
  rolling: true,
  cookie: {
    maxAge: 3600000, // 1 hour in milliseconds.
    secure: false,   // Set true in production if using HTTPS.
    sameSite: 'lax'
  }
}));

// Mount the auth routes.
app.use('/api/auth', authRoutes);

// Serve static files in production.
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'build')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
  });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
