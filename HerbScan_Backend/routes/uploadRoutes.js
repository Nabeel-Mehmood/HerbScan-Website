// routes/uploadRoutes.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const User = require('../models/User');
const authMiddleware = require('../middleware/authMiddleware');

// Configure storage for uploaded files.
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Make sure this folder exists
  },
  filename: function (req, file, cb) {
    // Use the logged in user's id (if available) plus timestamp for uniqueness.
    const userId = req.session && req.session.user ? req.session.user.id : 'unknown';
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, userId + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

const upload = multer({ storage, fileFilter });

// Protected endpoint that uploads an image and updates the user's profileImage field.
router.post('/', authMiddleware(['user', 'admin']), upload.single('profileImage'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  // Build the file URL.
  const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
  
  // Get the user id from the session.
  const userId = req.session.user.id;
  
  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profileImage: fileUrl },
      { new: true, runValidators: true }
    );
    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(201).json({ profileImage: updatedUser.profileImage });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
