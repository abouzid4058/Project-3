import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';

const Signup = () => {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Full name is required';
    if (!form.email) e.email = 'Email is required';
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = 'Enter a valid email';
    if (!form.password) e.password = 'Password is required';
    else if (form.password.length < 8) e.password = 'Minimum 8 characters';
    if (!form.confirm) e.confirm = 'Please confirm your password';
    else if (form.confirm !== form.password) e.confirm = 'Passwords do not match';
    return e;
  };

  const handleChange = e => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
    setErrors(er => ({ ...er, [e.target.name]: '' }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    try {
      await signup(form.name, form.email, form.password);
      toast.success('Account created! Welcome to TaskFlow 🎉');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-logo">Task<span>Flow</span></div>
        <p className="auth-subtitle">Create your account — it's free</p>

        <form onSubmit={handleSubmit} noValidate>
          <div className="mb-3">
            <label htmlFor="name">Full Name</label>
            <input
              id="name" name="name" type="text"
              className={`form-control${errors.name ? ' is-invalid' : ''}`}
              placeholder="Jane Doe"
              value={form.name} onChange={handleChange} autoComplete="name"
            />
            {errors.name && <div className="form-error">{errors.name}</div>}
          </div>

          <div className="mb-3">
            <label htmlFor="email">Email Address</label>
            <input
              id="email" name="email" type="email"
              className={`form-control${errors.email ? ' is-invalid' : ''}`}
              placeholder="jane@example.com"
              value={form.email} onChange={handleChange} autoComplete="email"
            />
            {errors.email && <div className="form-error">{errors.email}</div>}
          </div>

          <div className="mb-3">
            <label htmlFor="password">Password</label>
            <input
              id="password" name="password" type="password"
              className={`form-control${errors.password ? ' is-invalid' : ''}`}
              placeholder="Min 8 characters"
              value={form.password} onChange={handleChange} autoComplete="new-password"
            />
            {errors.password && <div className="form-error">{errors.password}</div>}
          </div>

          <div className="mb-4">
            <label htmlFor="confirm">Confirm Password</label>
            <input
              id="confirm" name="confirm" type="password"
              className={`form-control${errors.confirm ? ' is-invalid' : ''}`}
              placeholder="Re-enter password"
              value={form.confirm} onChange={handleChange} autoComplete="new-password"
            />
            {errors.confirm && <div className="form-error">{errors.confirm}</div>}
          </div>

          <button type="submit" className="btn-primary-tf" disabled={loading}>
            {loading ? 'Creating account…' : 'Create Account'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '1.25rem', fontSize: '0.875rem', color: '#64748b' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#1a3a5c', fontWeight: 600 }}>Log In</Link>
        </p>
        <p style={{ textAlign: 'center', fontSize: '0.72rem', color: '#94a3b8', marginTop: '0.5rem' }}>
          By signing up you agree to our Terms of Service.
        </p>
      </div>
    </div>
  );
};

export default Signup;
