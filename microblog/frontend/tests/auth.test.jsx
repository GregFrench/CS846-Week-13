import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { store } from '../src/store.js';
import { Login, Register } from '../src/components/Auth.jsx';

describe('Auth Components', () => {
  it('renders login form', () => {
    render(
      <BrowserRouter>
        <Provider store={store}>
          <Login />
        </Provider>
      </BrowserRouter>,
    );

    expect(screen.getByPlaceholderText('Username')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
  });

  it('renders register form', () => {
    render(
      <BrowserRouter>
        <Provider store={store}>
          <Register />
        </Provider>
      </BrowserRouter>,
    );

    expect(screen.getByPlaceholderText(/Username/)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Email/)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Password/)).toBeInTheDocument();
  });
});
