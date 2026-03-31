import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../slices/authSlice.js';
import { authAPI } from '../services/api.js';
import './Header.css';

export function Header() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Logout API error:', error);
    }

    // Clear local state regardless of API response
    dispatch(logout());
    navigate('/login');
  };

  return (
    <header className="header">
      <div className="header-content">
        <h1>Microblog</h1>
        <div className="header-right">
          {user && <span className="user-info">Welcome, {user.username}!</span>}
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
