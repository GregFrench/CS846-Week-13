import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api.js';
import { loginSuccess } from '../slices/authSlice.js';
import './Auth.css';

export function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await authAPI.login(username, password);
      dispatch(loginSuccess(response.data));
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h1>Login to Microblog</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={loading}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
          />
          <button type="submit" disabled={loading || !username || !password}>
            {loading ? 'Logging in...' : 'Log In'}
          </button>
        </form>
        {error && <p className="error">{error}</p>}
        <p className="auth-link">
          Don't have an account? <a href="/register">Sign up</a>
        </p>
      </div>
    </div>
  );
}

export function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await authAPI.register(username, email, password);
      dispatch(loginSuccess(response.data));
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h1>Create Account</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Username (3-30 chars)"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={loading}
            minLength="3"
            maxLength="30"
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
          />
          <input
            type="password"
            placeholder="Password (6+ chars)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            minLength="6"
          />
          <button type="submit" disabled={loading || !username || !email || !password}>
            {loading ? 'Creating...' : 'Sign Up'}
          </button>
        </form>
        {error && <p className="error">{error}</p>}
        <p className="auth-link">
          Already have an account? <a href="/login">Log in</a>
        </p>
      </div>
    </div>
  );
}
