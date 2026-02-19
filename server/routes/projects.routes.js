const express = require('express');
const router = express.Router();
const projectsController = require('../controllers/projects.controller');

// GET /api/projects/stats - Get statistics
router.get('/stats', projectsController.getStats);

// GET /api/projects/types - Get count by type
router.get('/types', projectsController.getCountByType);

// GET /api/projects/status/:status - Get projects by status
router.get('/status/:status', projectsController.getByStatus);

// GET /api/projects - Get all projects (with optional filters)
router.get('/', projectsController.getAll);

// GET /api/projects/:id - Get project by ID
router.get('/:id', projectsController.getById);

// POST /api/projects - Create new project
router.post('/', projectsController.create);

// PUT /api/projects/:id - Update project
router.put('/:id', projectsController.update);

// DELETE /api/projects/:id - Delete project
router.delete('/:id', projectsController.delete);

module.exports = router;