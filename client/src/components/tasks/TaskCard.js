import React from 'react';

const priorityLabel = { high: 'High', medium: 'Med', low: 'Low' };
const statusLabel    = { todo: 'To Do', 'in-progress': 'In Progress', completed: 'Done' };

const isOverdue = task =>
  task.status !== 'completed' && new Date(task.dueDate) < new Date();

const formatDate = d =>
  new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

const TaskCard = ({ task, onEdit, onDelete, onToggle }) => {
  const overdue = isOverdue(task);

  return (
    <div
      className={`task-card${task.status === 'completed' ? ' completed-task' : ''}`}
      onClick={() => onEdit(task)}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem' }}>
        {/* Complete toggle */}
        <button
          className={`task-check${task.status === 'completed' ? ' checked' : ''}`}
          onClick={e => { e.stopPropagation(); onToggle(task); }}
          title={task.status === 'completed' ? 'Mark incomplete' : 'Mark complete'}
        >
          {task.status === 'completed' && '✓'}
        </button>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="task-title"
            style={{ textDecoration: task.status === 'completed' ? 'line-through' : 'none' }}>
            {task.title}
          </div>
          {task.description && (
            <div className="task-desc">{task.description}</div>
          )}

          <div className="task-meta">
            <span className={`badge-priority ${task.priority}`}>
              {priorityLabel[task.priority]}
            </span>
            <span className={`badge-status ${task.status}`}>
              {statusLabel[task.status]}
            </span>
            <span className="badge-category">{task.category}</span>
            <span className={`due-date${overdue ? ' overdue' : ''}`}>
              📅 {formatDate(task.dueDate)}{overdue ? ' · Overdue' : ''}
            </span>
          </div>
        </div>

        {/* Delete */}
        <button
          className="btn-icon danger"
          onClick={e => { e.stopPropagation(); onDelete(task._id); }}
          title="Delete task"
          style={{ flexShrink: 0 }}
        >
          🗑
        </button>
      </div>
    </div>
  );
};

export default TaskCard;
