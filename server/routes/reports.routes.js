const express = require('express');
const router = express.Router();
const reportsController = require('../controllers/reports.controller');
const { authenticateToken } = require('../middleware/auth');

// All routes are protected
router.use(authenticateToken);

// GET /api/reports/daily-log/:id - Generate single daily log PDF
router.get('/daily-log/:id', reportsController.generateDailyLogReport);

// GET /api/reports/daily-logs - Generate multiple daily logs PDF
router.get('/daily-logs', reportsController.generateDailyLogsReport);

// GET /api/reports/equipment - Generate equipment PDF
router.get('/equipment', reportsController.generateEquipmentReport);

// GET /api/reports/materials - Generate materials PDF
router.get('/materials', reportsController.generateMaterialsReport);

// GET /api/reports/inspections - Generate inspections PDF
router.get('/inspections', reportsController.generateInspectionsReport);

module.exports = router;