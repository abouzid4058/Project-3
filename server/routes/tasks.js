const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const { protect } = require('../middleware/auth');

// All routes protected
router.use(protect);

// @route   GET /api/tasks
// @desc    Get all tasks for current user
// @access  Private
router.get('/', async (req, res) => {
  try {
    const { status, priority, category, sort } = req.query;

    const filter = { user: req.user._id };
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (category) filter.category = category;

    let sortOption = { createdAt: -1 };
    if (sort === 'dueDate') sortOption = { dueDate: 1 };
    if (sort === 'priority') sortOption = { priority: -1 };

    const tasks = await Task.find(filter).sort(sortOption);

    // Summary stats
    const total = await Task.countDocuments({ user: req.user._id });
    const inProgress = await Task.countDocuments({ user: req.user._id, status: 'in-progress' });
    const completed = await Task.countDocuments({ user: req.user._id, status: 'completed' });
    const overdue = await Task.countDocuments({
      user: req.user._id,
      status: { $ne: 'completed' },
      dueDate: { $lt: new Date() }
    });

    res.json({
      success: true,
      tasks,
      stats: { total, inProgress, completed, overdue }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   POST /api/tasks
// @desc    Create a task
// @access  Private
router.post('/', async (req, res) => {
  try {
    const { title, description, priority, status, dueDate, category, assignedTo } = req.body;

    if (!title || !dueDate) {
      return res.status(400).json({ success: false, message: 'Title and due date are required' });
    }

    const task = await Task.create({
      user: req.user._id,
      title,
      description,
      priority,
      status,
      dueDate,
      category,
      assignedTo
    });

    res.status(201).json({ success: true, task });
  } catch (err) {
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({ success: false, message: messages[0] });
    }
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   GET /api/tasks/:id
// @desc    Get single task
// @access  Private
router.get('/:id', async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.user._id });
    if (!task) return res.status(404).json({ success: false, message: 'Task not found' });
    res.json({ success: true, task });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   PUT /api/tasks/:id
// @desc    Update a task
// @access  Private
router.put('/:id', async (req, res) => {
  try {
    let task = await Task.findOne({ _id: req.params.id, user: req.user._id });
    if (!task) return res.status(404).json({ success: false, message: 'Task not found' });

    const { title, description, priority, status, dueDate, category, assignedTo } = req.body;
    task = await Task.findByIdAndUpdate(
      req.params.id,
      { title, description, priority, status, dueDate, category, assignedTo, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );

    res.json({ success: true, task });
  } catch (err) {
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({ success: false, message: messages[0] });
    }
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   DELETE /api/tasks/:id
// @desc    Delete a task
// @access  Private
router.delete('/:id', async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.user._id });
    if (!task) return res.status(404).json({ success: false, message: 'Task not found' });

    await task.deleteOne();
    res.json({ success: true, message: 'Task deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
