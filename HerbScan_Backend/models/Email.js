// models/Email.js
const mongoose = require('mongoose');

const EmailSchema = new mongoose.Schema({
  name: { type: String, required: true },
  sender: { type: String, required: true },
  message: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Email', EmailSchema);
