const express = require('express');
const router = express.Router();
const issuesController = require('../controllers/issues.controller');

// GET /api/issues/stats - Get statistics
router.get('/stats', issuesController.getStats);

// GET /api/issues/project/:projectId - Get issues by project
router.get('/project/:projectId', issuesController.getByProject);

// GET /api/issues - Get all issues (with optional filters)
router.get('/', issuesController.getAll);

// GET /api/issues/:id - Get issue by ID
router.get('/:id', issuesController.getById);

// POST /api/issues - Create new issue
router.post('/', issuesController.create);

// PUT /api/issues/:id - Update issue
router.put('/:id', issuesController.update);

// DELETE /api/issues/:id - Delete issue
router.delete('/:id', issuesController.delete);

module.exports = router;