const express = require('express');
const User = require('../models/user'); // User model for authentication
const Task = require('../models/task'); // Task model for task management
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();

// Middleware to verify JWT and attach user to the request
const authenticate = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify the JWT
    req.user = decoded; // Attach decoded user data to the request object
    next(); // Proceed to the next middleware
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// ==============================
// User Authentication Routes
// ==============================

// User Registration
// router.post('/register', async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     if (!email || !password) {
//       return res.status(400).json({ message: 'Please provide email and password' });
//     }

//     // Check if the user already exists
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res.status(400).json({ message: 'User already exists' });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10); // Hash the password
//     const newUser = new User({ email, password: hashedPassword });
//     await newUser.save();

//     res.status(201).json({
//       message: 'User registered successfully',
//       user: { id: newUser._id, email: newUser.email },
//     });
//   } catch (error) {
//     console.error('Error during registration:', error);
//     res.status(500).json({ message: 'Internal Server Error', error: error.message });
//   }
// });

// // User Login
// router.post('/login', async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     if (!email || !password) {
//       return res.status(400).json({ message: 'Please provide email and password' });
//     }

//     const user = await User.findOne({ email }); // Find user by email
//     if (!user || !(await bcrypt.compare(password, user.password))) {
//       return res.status(400).json({ message: 'Invalid email or password' });
//     }

//     // Generate JWT token
//     const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

//     res.status(200).json({
//       message: 'Login successful',
//       token,
//       user: { id: user._id, email: user.email },
//     });
//   } catch (error) {
//     console.error('Error during login:', error);
//     res.status(500).json({ message: 'Internal Server Error', error: error.message });
//   }
// });

// ==============================
// Task Management Routes
// ==============================

// Create a new task
router.post('/tasks', authenticate, async (req, res) => {
  const { title, description, priority, dueDate } = req.body;

  try {
    if (!title || !description) {
      return res.status(400).json({ message: 'Title and description are required' });
    }

    // Create new task and associate with the logged-in user
    const task = new Task({
      title,
      description,
      priority: priority || 'low', // Default to low priority
      dueDate: dueDate || new Date(),
      status: 'pending',
      user: req.user.userId, // Attach user ID from the decoded token
    });

    const savedTask = await task.save();
    res.status(201).json(savedTask); // Return the created task
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ message: 'Failed to create task', error: error.message });
  }
});

// Get all tasks for the logged-in user
router.get('/tasks', authenticate, async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user.userId }); // Fetch tasks for the logged-in user
    res.status(200).json(tasks); // Return the tasks
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ message: 'Failed to fetch tasks', error: error.message });
  }
});

// Update a task by ID
router.put('/tasks/:id', authenticate, async (req, res) => {
  const { id } = req.params;
  const { title, description, priority, status, dueDate } = req.body;

  try {
    const task = await Task.findOneAndUpdate(
      { _id: id, user: req.user.userId }, // Ensure task belongs to the logged-in user
      { title, description, priority, status, dueDate },
      { new: true } // Return the updated task
    );

    if (!task) {
      return res.status(404).json({ message: 'Task not found or unauthorized access' });
    }

    res.status(200).json(task); // Return the updated task
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ message: 'Failed to update task', error: error.message });
  }
});

// Delete a task by ID
router.delete('/tasks/:id', authenticate, async (req, res) => {
  const { id } = req.params;

  try {
    const task = await Task.findOneAndDelete({ _id: id, user: req.user.userId }); // Ensure task belongs to user

    if (!task) {
      return res.status(404).json({ message: 'Task not found or unauthorized access' });
    }

    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ message: 'Failed to delete task', error: error.message });
  }
});

module.exports = router;
