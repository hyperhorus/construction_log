const express = require('express');
const router = express.Router();
const subcontractorsController = require('../controllers/subcontractors.controller');

// GET /api/subcontractors/stats - Get statistics
router.get('/stats', subcontractorsController.getStats);

// GET /api/subcontractors - Get all subcontractors (with optional filters)
router.get('/', subcontractorsController.getAll);

// GET /api/subcontractors/:id - Get subcontractor by ID
router.get('/:id', subcontractorsController.getById);

// POST /api/subcontractors - Create new subcontractor
router.post('/', subcontractorsController.create);

// PUT /api/subcontractors/:id - Update subcontractor
router.put('/:id', subcontractorsController.update);

// DELETE /api/subcontractors/:id - Delete subcontractor
router.delete('/:id', subcontractorsController.delete);

module.exports = router;