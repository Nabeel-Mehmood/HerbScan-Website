// routes/profileRoutes.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const authMiddleware = require('../middleware/authMiddleware');
const bcrypt = require('bcryptjs');

// GET /api/profile - return current user's profile details
router.get('/', authMiddleware(['user', 'admin']), async (req, res) => {
  try {
    const { id } = req.session.user;
    const user = await User.findById(id, 'name email age contact bio profileImage');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/profile - update current user's profile details
router.put('/', authMiddleware(['user', 'admin']), async (req, res) => {
  try {
    const { name, email, age, contact, bio, profileImage } = req.body;
    const { id } = req.session.user;
    const updateData = { name, email, age, contact, bio, profileImage };
    Object.keys(updateData).forEach(key => updateData[key] === undefined && delete updateData[key]);
    const updatedUser = await User.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
    if (!updatedUser) return res.status(404).json({ error: 'User not found' });
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/profile/password - update current user's password
router.put('/password', authMiddleware(['user', 'admin']), async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const { id } = req.session.user;
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Old password is incorrect' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();
    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
