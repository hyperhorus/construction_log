const express = require('express');
const router = express.Router();
const safetyIncidentsController = require('../controllers/safetyIncidents.controller');

// GET /api/safety-incidents/stats
router.get('/stats', safetyIncidentsController.getStats);

// GET /api/safety-incidents/project/:projectId
router.get('/project/:projectId', safetyIncidentsController.getByProject);

// GET /api/safety-incidents
router.get('/', safetyIncidentsController.getAll);

// GET /api/safety-incidents/:id
router.get('/:id', safetyIncidentsController.getById);

// POST /api/safety-incidents
router.post('/', safetyIncidentsController.create);

// PUT /api/safety-incidents/:id
router.put('/:id', safetyIncidentsController.update);

// DELETE /api/safety-incidents/:id
router.delete('/:id', safetyIncidentsController.delete);

module.exports = router;