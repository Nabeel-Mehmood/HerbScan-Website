// routes/plantSearchRoutes.js
const express = require('express');
const router = express.Router();
const Plant = require('../models/Plant');

// GET /api/plants/search?query=your_keyword
// This endpoint will perform a case-insensitive search over all columns.
router.get('/search', async (req, res) => {
  const query = req.query.query;
  
  if (!query) {
    return res.status(400).json({ error: "Query parameter is required." });
  }
  
  try {
    // Create a case-insensitive regular expression with the provided query
    const regex = new RegExp(query, "i");
    
    // Search across multiple fields of the Plant model
    const results = await Plant.find({
      $or: [
        { familyName: regex },
        { subFamilyName: regex },
        { tribeName: regex },
        { botanicalName: regex },
        { commonName: regex },
        { regionalName: regex },
        { agriculturalExistence: regex },
        { seasonExistence: regex },
        { medicinalProperties: regex },
        { allergicProperties: regex }
      ]
    });
    
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
