import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../src/slices/authSlice.js';
import feedReducer from '../src/slices/feedSlice.js';
import { UserProfile } from '../src/components/UserProfile.jsx';

describe('UserProfile Component', () => {
  let store;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        auth: authReducer,
        feed: feedReducer,
      },
    });

    // Mock fetch
    global.fetch = vi.fn();
  });

  it('renders user profile page', async () => {
    // Mock the API response
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        id: 1,
        username: 'testuser',
        email: 'testuser@example.com',
        created_at: '2024-01-01T00:00:00Z',
      }),
    });

    // Mock posts endpoint
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        posts: [],
        limit: 50,
        offset: 0,
      }),
    });

    render(
      <BrowserRouter>
        <Provider store={store}>
          <UserProfile username="testuser" />
        </Provider>
      </BrowserRouter>,
    );

    // Wait for the component to display the username in the heading
    const usernameHeading = await waitFor(() =>
      screen.getByRole('heading', { name: /testuser/i }),
    );

    expect(usernameHeading).toBeInTheDocument();
  });

  it('displays user information', async () => {
    // Mock the API response
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
        created_at: '2024-01-15T00:00:00Z',
      }),
    });

    // Mock posts endpoint
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        posts: [],
        limit: 50,
        offset: 0,
      }),
    });

    render(
      <BrowserRouter>
        <Provider store={store}>
          <UserProfile username="testuser" />
        </Provider>
      </BrowserRouter>,
    );

    // Wait for email to be displayed
    const emailElement = await waitFor(() =>
      screen.getByText(/test@example.com/i),
    );

    expect(emailElement).toBeInTheDocument();

    // Check that member date is displayed (just check the label and that date exists)
    expect(screen.getByText(/Member Since/i)).toBeInTheDocument();
    expect(screen.getByText(/\d+\/\d+\/\d+/)).toBeInTheDocument();
  });

  it('displays error message when user not found', async () => {
    // Mock the API response with an error
    global.fetch.mockResolvedValueOnce({
      ok: false,
      status: 404,
    });

    render(
      <BrowserRouter>
        <Provider store={store}>
          <UserProfile username="nonexistent" />
        </Provider>
      </BrowserRouter>,
    );

    // Wait for error message to be displayed
    const errorElement = await waitFor(() =>
      screen.getByText(/Error:/i),
    );

    expect(errorElement).toBeInTheDocument();
  });

  it('fetches user data from correct API endpoint', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
        created_at: '2024-01-01T00:00:00Z',
      }),
    });

    // Mock posts endpoint
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        posts: [],
        limit: 50,
        offset: 0,
      }),
    });

    render(
      <BrowserRouter>
        <Provider store={store}>
          <UserProfile username="testuser" />
        </Provider>
      </BrowserRouter>,
    );

    // Wait for component to fetch
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/users/testuser');
    });
  });

  it('shows loading state while fetching user data', () => {
    // Mock fetch with a delay
    global.fetch.mockImplementationOnce(
      () => new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            ok: true,
            json: async () => ({
              id: 1,
              username: 'testuser',
              email: 'test@example.com',
              created_at: '2024-01-01T00:00:00Z',
            }),
          });
        }, 100);
      }),
    );

    // Mock posts endpoint
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        posts: [],
        limit: 50,
        offset: 0,
      }),
    });

    render(
      <BrowserRouter>
        <Provider store={store}>
          <UserProfile username="testuser" />
        </Provider>
      </BrowserRouter>,
    );

    // Initially should show loading
    expect(screen.getByText(/Loading.../i)).toBeInTheDocument();
  });

  it('displays posts section for user', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
        created_at: '2024-01-01T00:00:00Z',
      }),
    });

    // Mock posts endpoint
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        posts: [],
        limit: 50,
        offset: 0,
      }),
    });

    render(
      <BrowserRouter>
        <Provider store={store}>
          <UserProfile username="testuser" />
        </Provider>
      </BrowserRouter>,
    );

    // Wait for posts section to appear
    const postsHeading = await waitFor(() =>
      screen.getByRole('heading', { name: /Posts/i }),
    );

    expect(postsHeading).toBeInTheDocument();
  });

  it('fetches and displays user posts', async () => {
    // Mock user profile response
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
        created_at: '2024-01-01T00:00:00Z',
      }),
    });

    // Mock user posts response
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        posts: [
          {
            id: 1,
            user_id: 1,
            username: 'testuser',
            content: 'First post',
            like_count: 5,
            reply_count: 2,
            created_at: '2024-01-10T00:00:00Z',
          },
          {
            id: 2,
            user_id: 1,
            username: 'testuser',
            content: 'Second post',
            like_count: 3,
            reply_count: 1,
            created_at: '2024-01-05T00:00:00Z',
          },
        ],
        limit: 50,
        offset: 0,
      }),
    });

    render(
      <BrowserRouter>
        <Provider store={store}>
          <UserProfile username="testuser" />
        </Provider>
      </BrowserRouter>,
    );

    // Wait for posts content to appear
    const firstPost = await waitFor(() =>
      screen.getByText(/First post/i),
    );

    expect(firstPost).toBeInTheDocument();
    expect(screen.getByText(/Second post/i)).toBeInTheDocument();
  });
});
