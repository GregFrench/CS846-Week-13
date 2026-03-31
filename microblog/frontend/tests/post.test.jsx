import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { store } from '../src/store.js';
import { Post } from '../src/components/Post.jsx';

describe('Post Component', () => {
  const mockPost = {
    id: '1',
    user_id: 'user-1',
    content: 'Test post content',
    like_count: 5,
    reply_count: 2,
    created_at: '2023-01-01T00:00:00Z',
  };

  it('renders post content', () => {
    render(
      <BrowserRouter>
        <Provider store={store}>
          <Post post={mockPost} />
        </Provider>
      </BrowserRouter>,
    );

    expect(screen.getByText('Test post content')).toBeInTheDocument();
  });

  it('displays like count', () => {
    render(
      <BrowserRouter>
        <Provider store={store}>
          <Post post={mockPost} />
        </Provider>
      </BrowserRouter>,
    );

    expect(screen.getByText(/5/)).toBeInTheDocument();
  });

  it('displays author username', () => {
    render(
      <BrowserRouter>
        <Provider store={store}>
          <Post post={mockPost} />
        </Provider>
      </BrowserRouter>,
    );

    expect(screen.getByText('@user-1')).toBeInTheDocument();
  });
});
