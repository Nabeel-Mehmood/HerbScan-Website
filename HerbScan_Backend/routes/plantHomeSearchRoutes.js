// HerbScan_Backend/routes/plantHomeSearchRoutes.js
const express = require('express');
const router = express.Router();
const Plant = require('../models/Plant');

// GET /api/plants/home/search?query=your_keyword
// Searches only in Family name, Tribe Name, Common Name, and Botanical Name.
router.get('/home/search', async (req, res) => {
  const query = req.query.query;
  if (!query) {
    return res.status(400).json({ error: "Query parameter is required." });
  }
  try {
    const regex = new RegExp(query, "i");
    const results = await Plant.find({
      $or: [
        { familyName: regex },
        { tribeName: regex },
        { commonName: regex },
        { botanicalName: regex }
      ]
    });
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
