import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import authReducer, { loginSuccess, restoreAuth, logout } from '../src/slices/authSlice.js';
import App from '../src/App.jsx';

describe('Session Persistence', () => {
  let store;

  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    
    // Create a fresh store for each test
    store = configureStore({
      reducer: {
        auth: authReducer,
        feed: (state = { posts: [] }) => state,
      },
    });
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should persist authentication token in localStorage on login', () => {
    const mockUser = { id: 'user-123', username: 'testuser', email: 'test@example.com' };
    const mockToken = 'test-token-12345';

    store.dispatch(loginSuccess({ user: mockUser, token: mockToken }));

    expect(localStorage.getItem('token')).toBe(mockToken);
    expect(localStorage.getItem('user')).toBe(JSON.stringify(mockUser));
  });

  it('should persist authentication user in localStorage on login', () => {
    const mockUser = { id: 'user-123', username: 'testuser', email: 'test@example.com' };
    const mockToken = 'test-token-12345';

    store.dispatch(loginSuccess({ user: mockUser, token: mockToken }));

    const storedUser = JSON.parse(localStorage.getItem('user'));
    expect(storedUser.username).toBe('testuser');
    expect(storedUser.email).toBe('test@example.com');
  });

  it('should restore authentication state from localStorage on app reload', () => {
    const mockUser = { id: 'user-123', username: 'testuser', email: 'test@example.com' };
    const mockToken = 'test-token-12345';

    // Simulate user logging in
    store.dispatch(loginSuccess({ user: mockUser, token: mockToken }));

    // Verify data is in localStorage
    expect(localStorage.getItem('token')).toBe(mockToken);
    expect(localStorage.getItem('user')).toBe(JSON.stringify(mockUser));

    // Create new store (simulating page refresh)
    const newStore = configureStore({
      reducer: {
        auth: authReducer,
        feed: (state = { posts: [] }) => state,
      },
    });

    // Restore auth
    newStore.dispatch(restoreAuth());

    const state = newStore.getState();
    expect(state.auth.isAuthenticated).toBe(true);
    expect(state.auth.token).toBe(mockToken);
    expect(state.auth.user.username).toBe('testuser');
  });

  it('should clear localStorage on logout', () => {
    const mockUser = { id: 'user-123', username: 'testuser', email: 'test@example.com' };
    const mockToken = 'test-token-12345';

    // Login first
    store.dispatch(loginSuccess({ user: mockUser, token: mockToken }));
    expect(localStorage.getItem('token')).toBe(mockToken);

    // Logout
    store.dispatch(logout());

    expect(localStorage.getItem('token')).toBeNull();
    expect(localStorage.getItem('user')).toBeNull();
  });

  it('should not restore auth if no token exists', () => {
    const store = configureStore({
      reducer: {
        auth: authReducer,
        feed: (state = { posts: [] }) => state,
      },
    });

    store.dispatch(restoreAuth());

    const state = store.getState();
    expect(state.auth.isAuthenticated).toBe(false);
    expect(state.auth.token).toBeNull();
    expect(state.auth.user).toBeNull();
  });
});
