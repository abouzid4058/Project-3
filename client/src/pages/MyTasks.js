import React, { useState, useEffect, useCallback } from 'react';
import TaskCard from '../../components/tasks/TaskCard';
import TaskForm from '../../components/tasks/TaskForm';
import api from '../../utils/api';
import { toast } from 'react-toastify';

const TABS = [
  { key: 'all',         label: 'All' },
  { key: 'todo',        label: 'To Do' },
  { key: 'in-progress', label: 'In Progress' },
  { key: 'completed',   label: 'Completed' }
];

const MyTasks = ({ autoOpen = false }) => {
  const [tasks, setTasks]       = useState([]);
  const [loading, setLoading]   = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [priority,  setPriority]  = useState('');
  const [category,  setCategory]  = useState('');
  const [sort,      setSort]      = useState('createdAt');
  const [editTask,  setEditTask]  = useState(null);
  const [showForm,  setShowForm]  = useState(autoOpen);
  const [search,    setSearch]    = useState('');

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (activeTab !== 'all') params.status = activeTab;
      if (priority)            params.priority = priority;
      if (category)            params.category = category;
      if (sort)                params.sort = sort;

      const { data } = await api.get('/tasks', { params });
      setTasks(data.tasks);
    } catch {
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  }, [activeTab, priority, category, sort]);

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
    } catch {
      toast.error('Failed to delete');
    }
  };

  const handleToggle = async task => {
    const newStatus = task.status === 'completed' ? 'todo' : 'completed';
    try {
      const { data } = await api.put(`/tasks/${task._id}`, { ...task, status: newStatus });
      setTasks(prev => prev.map(t => t._id === task._id ? data.task : t));
    } catch {
      toast.error('Failed to update task');
    }
  };

  // Client-side search filter
  const filtered = tasks.filter(t =>
    !search || t.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="page-wrapper">
      {/* Header */}
      <div className="section-header mb-3">
        <h4>My Tasks</h4>
        <button
          className="btn-primary-tf"
          style={{ width: 'auto', padding: '0.45rem 1.1rem', fontSize: '0.85rem' }}
          onClick={() => { setEditTask(null); setShowForm(true); }}
        >
          + New Task
        </button>
      </div>

      {/* Search */}
      <input
        type="text"
        placeholder="🔍  Search tasks…"
        value={search}
        onChange={e => setSearch(e.target.value)}
        style={{
          width: '100%', border: '1.5px solid #e2e8f0', borderRadius: '8px',
          padding: '0.55rem 0.85rem', fontSize: '0.875rem', marginBottom: '1rem',
          fontFamily: 'inherit'
        }}
      />

      {/* Status Tabs */}
      <div className="task-tabs">
        {TABS.map(tab => (
          <button
            key={tab.key}
            className={activeTab === tab.key ? 'active' : ''}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Filter Bar */}
      <div className="filter-bar">
        <select value={priority} onChange={e => setPriority(e.target.value)}>
          <option value="">All Priorities</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>

        <select value={category} onChange={e => setCategory(e.target.value)}>
          <option value="">All Categories</option>
          {['work','personal','study','health','other'].map(c => (
            <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
          ))}
        </select>

        <select value={sort} onChange={e => setSort(e.target.value)}>
          <option value="createdAt">Newest First</option>
          <option value="dueDate">Due Date</option>
          <option value="priority">Priority</option>
        </select>

        {(priority || category) && (
          <button
            className="filter-btn"
            onClick={() => { setPriority(''); setCategory(''); }}
            style={{ color: '#dc2626' }}
          >
            ✕ Clear
          </button>
        )}
      </div>

      {/* Task List */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <div className="spinner-border" style={{ color: '#1a3a5c' }} role="status" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">{search ? '🔍' : '📋'}</div>
          <h6>{search ? 'No tasks match your search' : 'No tasks here'}</h6>
          <p>{search ? 'Try a different keyword.' : 'Add a task to get started!'}</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          {filtered.map(task => (
            <TaskCard
              key={task._id}
              task={task}
              onEdit={t => { setEditTask(t); setShowForm(true); }}
              onDelete={handleDelete}
              onToggle={handleToggle}
            />
          ))}
          <p style={{ textAlign: 'center', fontSize: '0.78rem', color: '#94a3b8', marginTop: '0.5rem' }}>
            {filtered.length} task{filtered.length !== 1 ? 's' : ''} shown
          </p>
        </div>
      )}

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

export default MyTasks;
