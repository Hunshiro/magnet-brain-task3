// routes/taskRoutes.js
const express = require('express');
const { 
  updateTaskStatus,
  createTask, 
  getTasks, 
  getTaskById,
  updateTask, 
  deleteTask 
} = require('../controllers/taskController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// All task routes are protected
router.use(authMiddleware);

router.post('/', createTask);
router.get('/', getTasks);
router.patch('/status/:id', updateTaskStatus);
router.get('/:id', getTaskById);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);

module.exports = router;