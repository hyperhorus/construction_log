const express = require('express');
const router = express.Router();
const photosController = require('../controllers/photos.controller');

// GET /api/photos/stats - Get statistics
router.get('/stats', photosController.getStats);

// GET /api/photos - Get all photos (with optional filters)
router.get('/', photosController.getAll);

// GET /api/photos/:id - Get photo by ID
router.get('/:id', photosController.getById);

// POST /api/photos - Create new photo
router.post('/', photosController.create);

// PUT /api/photos/:id - Update photo
router.put('/:id', photosController.update);

// DELETE /api/photos/:id - Delete photo
router.delete('/:id', photosController.delete);

module.exports = router;