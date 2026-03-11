const express = require('express');
const router = express.Router();
const documentsController = require('../controllers/documents.controller');

// GET /api/documents/stats
router.get('/stats', documentsController.getStats);

// GET /api/documents/types
router.get('/types', documentsController.getDocTypeCounts);

// GET /api/documents/project/:projectId
router.get('/project/:projectId', documentsController.getByProject);

// GET /api/documents/type/:type
router.get('/type/:type', documentsController.getByType);

// GET /api/documents
router.get('/', documentsController.getAll);

// GET /api/documents/:id
router.get('/:id', documentsController.getById);

// POST /api/documents
router.post('/', documentsController.create);

// PUT /api/documents/:id
router.put('/:id', documentsController.update);

// DELETE /api/documents/:id
router.delete('/:id', documentsController.delete);

module.exports = router;