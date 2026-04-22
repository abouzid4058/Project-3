import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    toast.info('Logged out successfully');
    navigate('/login');
  };

  return (
    <nav className="navbar-taskflow">
      <div className="d-flex align-items-center justify-content-between w-100">
        {/* Brand */}
        <NavLink to="/dashboard" className="navbar-brand">
          Task<span>Flow</span>
        </NavLink>

        {/* Hamburger */}
        <button
          className="d-md-none btn-icon"
          style={{ color: '#fff' }}
          onClick={() => setOpen(o => !o)}
          aria-label="Toggle menu"
        >
          ☰
        </button>

        {/* Desktop Nav */}
        <div className={`d-none d-md-flex align-items-center gap-2`}>
          <NavLink to="/dashboard" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
            Dashboard
          </NavLink>
          <NavLink to="/tasks" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
            My Tasks
          </NavLink>
          <NavLink to="/tasks/new" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
            + Add Task
          </NavLink>
          <span className="nav-link" style={{ opacity: 0.7, fontSize: '0.82rem' }}>
            {user?.name}
          </span>
          <button className="btn-logout" onClick={handleLogout}>Logout</button>
        </div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="d-md-none" style={{ marginTop: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          <NavLink to="/dashboard" className="nav-link" onClick={() => setOpen(false)}>Dashboard</NavLink>
          <NavLink to="/tasks" className="nav-link" onClick={() => setOpen(false)}>My Tasks</NavLink>
          <NavLink to="/tasks/new" className="nav-link" onClick={() => setOpen(false)}>+ Add Task</NavLink>
          <button className="btn-logout" style={{ width: 'fit-content' }} onClick={() => { setOpen(false); handleLogout(); }}>
            Logout
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
