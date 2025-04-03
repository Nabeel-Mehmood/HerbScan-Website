// HerbScan_Backend/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const authMiddleware = require('../middleware/authMiddleware');

// GET /api/users – return only name and blocked status (admin only)
router.get('/', authMiddleware(['admin']), async (req, res) => {
  try {
    const users = await User.find({}, 'name blocked'); // Return only name and blocked status
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PATCH /api/users/:name/block – toggle block status using name as identifier (admin only)
router.patch('/:name/block', authMiddleware(['admin']), async (req, res) => {
  try {
    const user = await User.findOne({ name: req.params.name });
    if (!user)
      return res.status(404).json({ error: "User not found" });
    user.blocked = !user.blocked;
    await user.save();
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/users/:name – delete a user by name (admin only)
router.delete('/:name', authMiddleware(['admin']), async (req, res) => {
  try {
    const user = await User.findOneAndDelete({ name: req.params.name });
    if (!user)
      return res.status(404).json({ error: "User not found" });
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
