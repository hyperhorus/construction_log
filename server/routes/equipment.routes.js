const express = require('express');
const router = express.Router();
const equipmentController = require('../controllers/equipment.controller');

// GET /api/equipment/stats - Get statistics
router.get('/stats', equipmentController.getStats);

// GET /api/equipment - Get all equipment (with optional status filter)
router.get('/', equipmentController.getAll);

// GET /api/equipment/:id - Get equipment by ID
router.get('/:id', equipmentController.getById);

// POST /api/equipment - Create new equipment
router.post('/', equipmentController.create);

// PUT /api/equipment/:id - Update equipment
router.put('/:id', equipmentController.update);

// DELETE /api/equipment/:id - Delete equipment
router.delete('/:id', equipmentController.delete);

module.exports = router;