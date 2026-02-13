const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { authenticateToken } = require('../middleware/auth');

// POST /api/auth/register - Register new user
router.post('/register', authController.register);

// POST /api/auth/login - Login
router.post('/login', authController.login);

// GET /api/auth/me - Get current user (protected)
router.get('/me', authenticateToken, authController.getCurrentUser);

// POST /api/auth/change-password - Change password (protected)
router.post('/change-password', authenticateToken, authController.changePassword);

// POST /api/auth/logout - Logout
router.post('/logout', authenticateToken, authController.logout);

module.exports = router;