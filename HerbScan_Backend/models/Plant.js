// models/Plant.js
const mongoose = require('mongoose');

const PlantSchema = new mongoose.Schema({
  familyName: { type: String, required: true },
  subFamilyName: { type: String, required: true },
  tribeName: { type: String, required: true },
  botanicalName: { type: String, required: true },
  commonName: { type: String, required: true },
  regionalName: { type: String, required: true },
  agriculturalExistence: { type: String, required: true },
  seasonExistence: { type: String, required: true },
  medicinalProperties: { type: String, required: true },
  allergicProperties: { type: String, required: true }
});

module.exports = mongoose.model('Plant', PlantSchema);
