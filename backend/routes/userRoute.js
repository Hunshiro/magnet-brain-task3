// routes/userRoutes.js
const express = require('express');
const { registerUser, loginUser } = require('../controllers/userController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Protected route example
router.get('/me', authMiddleware, (req, res) => {
  res.json(req.user);
});

module.exports = router;