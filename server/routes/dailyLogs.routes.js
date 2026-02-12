const express = require('express');
const router = express.Router();
const dailyLogsController = require('../controllers/dailyLogs.controller');

// GET /api/daily-logs/stats - Get statistics
router.get('/stats', dailyLogsController.getStats);

// GET /api/daily-logs/monthly-summary - Get monthly summary
router.get('/monthly-summary', dailyLogsController.getMonthlySummary);

// GET /api/daily-logs - Get all daily logs (with optional filters)
router.get('/', dailyLogsController.getAll);

// GET /api/daily-logs/:id - Get daily log by ID
router.get('/:id', dailyLogsController.getById);

// POST /api/daily-logs - Create new daily log
router.post('/', dailyLogsController.create);

// PUT /api/daily-logs/:id - Update daily log
router.put('/:id', dailyLogsController.update);

// DELETE /api/daily-logs/:id - Delete daily log
router.delete('/:id', dailyLogsController.delete);

module.exports = router;