// authRoutes.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const ADMIN_EMAIL = 'admin@gmail.com';
const ADMIN_PASSWORD = 'admin@123';

// Admin Login Endpoint
router.post('/admin/login', (req, res) => {
  const { email, password } = req.body;
  if (email.toLowerCase() === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    req.session.user = {
      id: 'admin_session_id', // Fixed identifier for admin
      name: 'Admin',
      email: ADMIN_EMAIL,
      role: 'admin'
    };
    return req.session.save(err => {
      if (err) return res.status(500).json({ error: 'Session save error.' });
      return res.json({ user: req.session.user });
    });
  } else {
    return res.status(400).json({ error: 'Invalid admin credentials.' });
  }
});

// Regular User Signup Endpoint
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Disallow signup with admin email.
    if (email.toLowerCase() === ADMIN_EMAIL) {
      return res.status(400).json({ error: 'Admin cannot sign up. Please use admin login.' });
    }
    if (!email.endsWith('@gmail.com')) {
      return res.status(400).json({ error: 'Please use a valid Gmail address.' });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ error: 'User already exists.' });
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword, role: 'user' });
    await newUser.save();

    req.session.user = {
      id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      role: 'user'
    };

    req.session.save(err => {
      if (err) return res.status(500).json({ error: 'Session save error.' });
      return res.json({ user: req.session.user });
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Regular User Login Endpoint
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // For safety, reject admin login here.
    if (email.toLowerCase() === ADMIN_EMAIL) {
      return res.status(400).json({ error: 'Please use the admin login.' });
    }
    
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: 'User not found. Please sign up first.' });
    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Invalid credentials.' });
    
    req.session.user = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    };

    req.session.save(err => {
      if (err) return res.status(500).json({ error: 'Session save error.' });
      return res.json({ user: req.session.user });
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Session Verification Endpoint
router.get('/session', (req, res) => {
  if (req.session && req.session.user) {
    res.json({ user: req.session.user });
  } else {
    res.status(401).json({ error: 'No active session' });
  }
});

// Logout Endpoint
router.post('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) return res.status(500).json({ error: 'Logout error.' });
    res.clearCookie('connect.sid');
    res.json({ message: 'Logged out successfully.' });
  });
});

module.exports = router;
