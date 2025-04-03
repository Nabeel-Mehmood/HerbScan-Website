// controllers/plantController.js
const Plant = require('../models/Plant');

const getPlants = async (req, res) => {
  try {
    const plants = await Plant.find({});
    res.json(plants);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createPlant = async (req, res) => {
  try {
    const {
      familyName,
      subFamilyName,
      tribeName,
      botanicalName,
      commonName,
      regionalName,
      agriculturalExistence,
      seasonExistence,
      medicinalProperties,
      allergicProperties
    } = req.body;

    const newPlant = new Plant({
      familyName,
      subFamilyName,
      tribeName,
      botanicalName,
      commonName,
      regionalName,
      agriculturalExistence,
      seasonExistence,
      medicinalProperties,
      allergicProperties
    });

    await newPlant.save();
    res.status(201).json(newPlant);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updatePlant = async (req, res) => {
  try {
    const plantId = req.params.id;
    const updateData = req.body;
    const updatedPlant = await Plant.findByIdAndUpdate(plantId, updateData, { new: true });
    if (!updatedPlant) {
      return res.status(404).json({ error: "Plant not found" });
    }
    res.json(updatedPlant);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deletePlant = async (req, res) => {
  try {
    const plantId = req.params.id;
    const deletedPlant = await Plant.findByIdAndDelete(plantId);
    if (!deletedPlant) {
      return res.status(404).json({ error: "Plant not found" });
    }
    res.json({ message: "Plant deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getPlants, createPlant, updatePlant, deletePlant };
