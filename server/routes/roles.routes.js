const express = require('express');
const router = express.Router();
const rolesController = require('../controllers/roles.controller');

console.log('✅ roles.routes.js loaded'); // <--- add this

// GET /api/roles/stats
router.get('/stats', rolesController.getStats);

// GET /api/roles
router.get('/', rolesController.getAll);

// GET /api/roles/:id
router.get('/:id', rolesController.getById);

// POST /api/roles
router.post('/', rolesController.create);

// PUT /api/roles/:id
router.put('/:id', rolesController.update);

// DELETE /api/roles/:id
router.delete('/:id', rolesController.delete);

//test
router.get('/test', (req, res) => {
  res.json({ message: 'Roles route is working!' });
});

module.exports = router;