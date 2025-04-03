// controllers/emailController.js
const Email = require('../models/Email');

const getEmails = async (req, res) => {
  try {
    const emails = await Email.find({});
    res.json(emails);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createEmail = async (req, res) => {
  try {
    const { name, sender, message } = req.body;
    if (!name || !sender || !message) {
      return res.status(400).json({ error: "All fields are required." });
    }
    const newEmail = new Email({ name, sender, message });
    await newEmail.save();
    res.status(201).json(newEmail);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteEmail = async (req, res) => {
  try {
    const emailId = req.params.id;
    const deletedEmail = await Email.findByIdAndDelete(emailId);
    if (!deletedEmail) {
      return res.status(404).json({ error: "Email not found" });
    }
    res.json({ message: "Email deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getEmails, createEmail, deleteEmail };
