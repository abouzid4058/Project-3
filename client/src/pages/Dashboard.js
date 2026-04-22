import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import TaskCard from '../../components/tasks/TaskCard';
import TaskForm from '../../components/tasks/TaskForm';
import api from '../../utils/api';
import { toast } from 'react-toastify';

const today = new Date().toLocaleDateString('en-US', {
  weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
});

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [tasks, setTasks]       = useState([]);
  const [stats, setStats]       = useState({ total: 0, inProgress: 0, completed: 0, overdue: 0 });
  const [loading, setLoading]   = useState(true);
  const [editTask, setEditTask] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [quickTitle, setQuickTitle]   = useState('');
  const [quickDue,   setQuickDue]     = useState('');

  const fetchTasks = useCallback(async () => {
    try {
      const { data } = await api.get('/tasks');
      setTasks(data.tasks);
      setStats(data.stats);
    } catch {
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchTasks(); }, [fetchTasks]);

  const handleSave = async formData => {
    try {
      if (editTask) {
        const { data } = await api.put(`/tasks/${editTask._id}`, formData);
        setTasks(prev => prev.map(t => t._id === editTask._id ? data.task : t));
        toast.success('Task updated!');
      } else {
        const { data } = await api.post('/tasks', formData);
        setTasks(prev => [data.task, ...prev]);
        toast.success('Task created!');
      }
      setShowForm(false);
      setEditTask(null);
      fetchTasks();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save task');
    }
  };

  const handleDelete = async id => {
    if (!window.confirm('Delete this task?')) return;
    try {
      await api.delete(`/tasks/${id}`);
      setTasks(prev => prev.filter(t => t._id !== id));
      toast.success('Task deleted');
      fetchTasks();
    } catch {
      toast.error('Failed to delete task');
    }
  };

  const handleToggle = async task => {
    const newStatus = task.status === 'completed' ? 'todo' : 'completed';
    try {
      const { data } = await api.put(`/tasks/${task._id}`, { ...task, status: newStatus });
      setTasks(prev => prev.map(t => t._id === task._id ? data.task : t));
      fetchTasks();
    } catch {
      toast.error('Failed to update task');
    }
  };

  const handleQuickAdd = async e => {
    e.preventDefault();
    if (!quickTitle.trim() || !quickDue) {
      toast.warn('Please enter a title and due date');
      return;
    }
    try {
      const { data } = await api.post('/tasks', {
        title: quickTitle, dueDate: quickDue, priority: 'medium',
        status: 'todo', category: 'work'
      });
      setTasks(prev => [data.task, ...prev]);
      setQuickTitle('');
      setQuickDue('');
      toast.success('Task added!');
      fetchTasks();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add task');
    }
  };

  // Show only recent 5 incomplete tasks on dashboard
  const recentTasks = tasks.filter(t => t.status !== 'completed').slice(0, 5);

  if (loading) {
    return (
      <div className="spinner-wrap">
        <div className="spinner-border" style={{ color: '#1a3a5c' }} role="status" />
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      {/* Welcome Banner */}
      <div className="welcome-banner">
        <div>
          <h5>Welcome back, {user?.name?.split(' ')[0]}! 👋</h5>
          <small>📅 {today}</small>
        </div>
        <button
          className="btn-primary-tf"
          style={{ width: 'auto', padding: '0.5rem 1.25rem', fontSize: '0.85rem' }}
          onClick={() => { setEditTask(null); setShowForm(true); }}
        >
          + New Task
        </button>
      </div>

      {/* Stats */}
      <div className="row g-3 mb-4">
        {[
          { label: 'Total Tasks',  value: stats.total,      cls: '' },
          { label: 'In Progress',  value: stats.inProgress, cls: 'stat-inprogress' },
          { label: 'Completed',    value: stats.completed,  cls: 'stat-completed' },
          { label: 'Overdue',      value: stats.overdue,    cls: 'stat-overdue' }
        ].map(s => (
          <div className="col-6 col-md-3" key={s.label}>
            <div className={`stat-card ${s.cls}`}>
              <div className="stat-number">{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Grid */}
      <div className="row g-3">
        {/* Task List */}
        <div className="col-md-8">
          <div className="section-header">
            <h4>Active Tasks</h4>
            <button
              className="btn-outline-tf"
              style={{ fontSize: '0.8rem', padding: '0.3rem 0.85rem' }}
              onClick={() => navigate('/tasks')}
            >
              View All →
            </button>
          </div>

          {recentTasks.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">✅</div>
              <h6>All caught up!</h6>
              <p>No active tasks. Add one to get started.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {recentTasks.map(task => (
                <TaskCard
                  key={task._id}
                  task={task}
                  onEdit={t => { setEditTask(t); setShowForm(true); }}
                  onDelete={handleDelete}
                  onToggle={handleToggle}
                />
              ))}
            </div>
          )}
        </div>

        {/* Quick Add sidebar */}
        <div className="col-md-4">
          <div className="quick-add">
            <h6>⚡ Quick Add Task</h6>
            <form onSubmit={handleQuickAdd}>
              <input
                type="text"
                placeholder="Task title…"
                value={quickTitle}
                onChange={e => setQuickTitle(e.target.value)}
              />
              <input
                type="date"
                value={quickDue}
                onChange={e => setQuickDue(e.target.value)}
                style={{ marginBottom: '0.75rem' }}
              />
              <button type="submit">+ Add Task</button>
            </form>
          </div>

          {/* Completed count card */}
          {stats.completed > 0 && (
            <div className="stat-card stat-completed" style={{ marginTop: '1rem' }}>
              <div className="stat-number">{stats.completed}</div>
              <div className="stat-label">Tasks Completed 🎉</div>
            </div>
          )}
        </div>
      </div>

      {/* Task Modal */}
      {showForm && (
        <TaskForm
          task={editTask}
          onSave={handleSave}
          onClose={() => { setShowForm(false); setEditTask(null); }}
        />
      )}
    </div>
  );
};

export default Dashboard;
