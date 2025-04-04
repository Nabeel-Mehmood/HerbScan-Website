// models/User.js
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  blocked: { type: Boolean, default: false },
  age: { type: Number, default: null },
  contact: { type: String, default: '' },
  bio: { type: String, default: '' },
  profileImage: { type: String, default: 'default_profile.jpg' }
});

module.exports = mongoose.model('User', UserSchema);
