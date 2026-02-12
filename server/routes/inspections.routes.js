const express = require('express');
const router = express.Router();
const inspectionsController = require('../controllers/inspections.controller');

// GET /api/inspections/stats - Get statistics
router.get('/stats', inspectionsController.getStats);

// GET /api/inspections - Get all inspections (with optional filters)
router.get('/', inspectionsController.getAll);

// GET /api/inspections/:id - Get inspection by ID
router.get('/:id', inspectionsController.getById);

// POST /api/inspections - Create new inspection
router.post('/', inspectionsController.create);

// PUT /api/inspections/:id - Update inspection
router.put('/:id', inspectionsController.update);

// DELETE /api/inspections/:id - Delete inspection
router.delete('/:id', inspectionsController.delete);

module.exports = router;