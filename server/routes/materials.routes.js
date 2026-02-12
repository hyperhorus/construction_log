const express = require('express');
const router = express.Router();
const materialsController = require('../controllers/materials.controller');

// GET /api/materials/stats - Get statistics
router.get('/stats', materialsController.getStats);

// GET /api/materials - Get all materials (with optional filters)
router.get('/', materialsController.getAll);

// GET /api/materials/:id - Get material by ID
router.get('/:id', materialsController.getById);

// POST /api/materials - Create new material
router.post('/', materialsController.create);

// PUT /api/materials/:id - Update material
router.put('/:id', materialsController.update);

// PATCH /api/materials/:id/quantity - Update quantity
router.patch('/:id/quantity', materialsController.updateQuantity);

// DELETE /api/materials/:id - Delete material
router.delete('/:id', materialsController.delete);

module.exports = router;