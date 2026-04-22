import React, { useState, useEffect } from 'react';

const CATEGORIES = ['work', 'personal', 'study', 'health', 'other'];
const STATUSES   = [
  { value: 'todo',        label: 'To Do' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'completed',   label: 'Done' }
];

const toDateInput = iso => {
  if (!iso) return '';
  return new Date(iso).toISOString().split('T')[0];
};

const empty = {
  title: '', description: '', priority: 'medium',
  status: 'todo', dueDate: '', category: 'work', assignedTo: ''
};

const TaskForm = ({ task, onSave, onClose }) => {
  const [form, setForm]     = useState(empty);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (task) {
      setForm({
        title:       task.title       || '',
        description: task.description || '',
        priority:    task.priority    || 'medium',
        status:      task.status      || 'todo',
        dueDate:     toDateInput(task.dueDate),
        category:    task.category    || 'work',
        assignedTo:  task.assignedTo  || ''
      });
    } else {
      setForm(empty);
    }
    setErrors({});
  }, [task]);

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = 'Task title is required';
    if (!form.dueDate)      e.dueDate = 'Due date is required';
    return e;
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
    setErrors(er => ({ ...er, [name]: '' }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSaving(true);
    try {
      await onSave(form);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <h5>{task ? '✏️ Edit Task' : '➕ Add New Task'}</h5>

        <form onSubmit={handleSubmit} noValidate>
          {/* Title */}
          <div className="mb-3">
            <label>Task Title *</label>
            <input
              name="title" type="text"
              className={errors.title ? 'is-invalid' : ''}
              placeholder="Enter task title…"
              value={form.title} onChange={handleChange}
            />
            {errors.title && <div className="form-error">{errors.title}</div>}
          </div>

          {/* Description */}
          <div className="mb-3">
            <label>Description</label>
            <textarea
              name="description"
              placeholder="Describe the task (optional)…"
              value={form.description} onChange={handleChange}
            />
          </div>

          {/* Priority */}
          <div className="mb-3">
            <label>Priority</label>
            <div className="priority-group">
              {['low', 'medium', 'high'].map(p => (
                <button
                  key={p} type="button"
                  className={form.priority === p ? `active-${p}` : ''}
                  onClick={() => setForm(f => ({ ...f, priority: p }))}
                >
                  {p.charAt(0).toUpperCase() + p.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Due Date + Status row */}
          <div className="mb-3" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div>
              <label>Due Date *</label>
              <input
                name="dueDate" type="date"
                className={errors.dueDate ? 'is-invalid' : ''}
                value={form.dueDate} onChange={handleChange}
              />
              {errors.dueDate && <div className="form-error">{errors.dueDate}</div>}
            </div>
            <div>
              <label>Status</label>
              <select name="status" value={form.status} onChange={handleChange}>
                {STATUSES.map(s => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Category */}
          <div className="mb-3">
            <label>Category</label>
            <div className="category-group">
              {CATEGORIES.map(cat => (
                <label key={cat} className={form.category === cat ? 'selected' : ''}>
                  <input
                    type="radio" name="category" value={cat}
                    checked={form.category === cat}
                    onChange={handleChange}
                  />
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </label>
              ))}
            </div>
          </div>

          {/* Assigned To */}
          <div className="mb-3">
            <label>Assigned To</label>
            <input
              name="assignedTo" type="text"
              placeholder="e.g. John Doe"
              value={form.assignedTo} onChange={handleChange}
            />
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-outline-tf" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary-tf" disabled={saving}
              style={{ width: 'auto', padding: '0.55rem 1.5rem' }}>
              {saving ? 'Saving…' : task ? 'Update Task' : 'Save Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskForm;
