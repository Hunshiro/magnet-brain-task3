// controllers/taskController.js
const Task = require('../models/task');

exports.getTaskById = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the task by its ID and ensure it's associated with the logged-in user
    const task = await Task.findOne({ _id: id, user: req.user._id });

    if (!task) {
      return res.status(404).json({
        message: 'Task not found or you do not have permission to access this task.',
      });
    }

    res.json(task);
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching task by ID',
      error: error.message,
    });
  }
};

exports.createTask = async (req, res) => {
  try {
    const { title, description, status, priority, dueDate } = req.body;
    
    const task = new Task({
      title,
      description,
      status: status || 'pending',
      priority: priority || 'medium',
      dueDate,
      user: req.user._id
    });
    
    await task.save();
    
    res.status(201).json(task);
  } catch (error) {
    res.status(400).json({ 
      message: 'Error creating task', 
      error: error.message 
    });
  }
};

exports.getTasks = async (req, res) => {
  try {
    const { status, priority } = req.query;
    const filter = { user: req.user._id };
    
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    
    const tasks = await Task.find(filter)
      .sort({ createdAt: -1 });
    
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ 
      message: 'Error fetching tasks', 
      error: error.message 
    });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    const task = await Task.findOneAndUpdate(
      { _id: id, user: req.user._id }, 
      updates, 
      { new: true }
    );
    
    if (!task) {
      return res.status(404).json({ 
        message: 'Task not found' 
      });
    }
    
    res.json(task);
  } catch (error) {
    res.status(400).json({ 
      message: 'Error updating task', 
      error: error.message 
    });
  }
};

exports.updateTaskStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // Get the new status from the request body

    // Validate status value
    if (!status || !['pending', 'in-progress', 'completed'].includes(status)) {
      return res.status(400).json({
        message: 'Invalid status value. Please provide one of the following: pending, in-progress, completed.',
      });
    }

    // Find the task by ID and ensure it's associated with the logged-in user
    const task = await Task.findOneAndUpdate(
      { _id: id, user: req.user._id },
      { status }, // Update only the status field
      { new: true } // Return the updated task
    );

    if (!task) {
      return res.status(404).json({
        message: 'Task not found or you do not have permission to update this task.',
      });
    }

    res.json(task); // Return the updated task with new status
  } catch (error) {
    res.status(500).json({
      message: 'Error updating task status',
      error: error.message,
    });
  }
};
exports.deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    
    const task = await Task.findOneAndDelete({ 
      _id: id, 
      user: req.user._id 
    });
    
    if (!task) {
      return res.status(404).json({ 
        message: 'Task not found' 
      });
    }
    
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ 
      message: 'Error deleting task', 
      error: error.message 
    });
  }
};