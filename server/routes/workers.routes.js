const express = require('express');
const router = express.Router();
const workersController = require('../controllers/workers.controller');

// GET /api/workers/stats
router.get('/stats', workersController.getStats);

// GET /api/workers/roles
router.get('/roles', workersController.getCountByRole);

// GET /api/workers
router.get('/', workersController.getAll);

// GET /api/workers/:id
router.get('/:id', workersController.getById);

// POST /api/workers
router.post('/', workersController.create);

// PUT /api/workers/:id
router.put('/:id', workersController.update);

// PATCH /api/workers/:id/union_member - Update union member
//router.patch('/:id/union_member', workersController.updateUnionMember);
router.patch('/:id/union-member', workersController.updateUnionMember); // ✅ PATCH endpoint

// PATCH /api/workers/:id/name - Update name
router.patch('/:id/name-worker', workersController.updateName); // ✅ PATCH endpoint

// PATCH /api/workers/:id/role - Update role
router.patch('/:id/role-worker', workersController.updateRole); // ✅ PATCH endpoint

// DELETE /api/workers/:id
router.delete('/:id', workersController.delete);

module.exports = router;