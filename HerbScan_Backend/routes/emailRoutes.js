// routes/emailRoutes.js
const express = require('express');
const router = express.Router();
const { getEmails, createEmail, deleteEmail } = require('../controllers/emailController');
const authMiddleware = require('../middleware/authMiddleware');

// GET /api/emails – get all emails (admin only)
router.get('/', authMiddleware(['admin']), getEmails);

// POST /api/emails – create a new email (open to all)
router.post('/', createEmail);

// DELETE /api/emails/:id – delete an email by id (admin only)
router.delete('/:id', authMiddleware(['admin']), deleteEmail);

module.exports = router;
