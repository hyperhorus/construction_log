const express = require('express');
const router = express.Router();
const permitsController = require('../controllers/permits.controller');

// GET /api/permits/stats
router.get('/stats', permitsController.getStats);

// GET /api/permits/project/:projectId
router.get('/project/:projectId', permitsController.getByProject);

// GET /api/permits
router.get('/', permitsController.getAll);

// GET /api/permits/:id
router.get('/:id', permitsController.getById);

// POST /api/permits
router.post('/', permitsController.create);

// PUT /api/permits/:id
router.put('/:id', permitsController.update);

// DELETE /api/permits/:id
router.delete('/:id', permitsController.delete);

module.exports = router;