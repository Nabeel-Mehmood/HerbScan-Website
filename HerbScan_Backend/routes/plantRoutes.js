// routes/plantRoutes.js
const express = require('express');
const router = express.Router();
const { getPlants, createPlant, updatePlant, deletePlant } = require('../controllers/plantController');
const authMiddleware = require('../middleware/authMiddleware');

// GET /api/plants – get all plants (accessible to admin)
router.get('/', authMiddleware(['admin']), getPlants);

// POST /api/plants – create a new plant (admin only)
router.post('/', authMiddleware(['admin']), createPlant);

// PUT /api/plants/:id – update a plant by MongoDB _id (admin only)
router.put('/:id', authMiddleware(['admin']), updatePlant);

// DELETE /api/plants/:id – delete a plant by _id (admin only)
router.delete('/:id', authMiddleware(['admin']), deletePlant);

module.exports = router;
