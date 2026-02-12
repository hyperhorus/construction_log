const express = require('express');
const router = express.Router();
const timeTrackingController = require('../controllers/timeTracking.controller');

// GET /api/time-tracking/stats - Get statistics
router.get('/stats', timeTrackingController.getStats);

// GET /api/time-tracking - Get all time entries (with optional filters)
router.get('/', timeTrackingController.getAll);

// GET /api/time-tracking/:id - Get time entry by ID
router.get('/:id', timeTrackingController.getById);

// POST /api/time-tracking - Create new time entry
router.post('/', timeTrackingController.create);

// PUT /api/time-tracking/:id - Update time entry
router.put('/:id', timeTrackingController.update);

// DELETE /api/time-tracking/:id - Delete time entry
router.delete('/:id', timeTrackingController.delete);

module.exports = router;