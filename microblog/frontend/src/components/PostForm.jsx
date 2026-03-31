import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { postsAPI } from '../services/api.js';
import { addPost } from '../slices/feedSlice.js';
import './PostForm.css';

export function PostForm() {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const response = await postsAPI.createPost(content);
      dispatch(addPost(response.data.post));
      setContent('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create post');
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <form className="post-form" onSubmit={handleSubmit}>
      <textarea
        placeholder="What's happening!?"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        maxLength={280}
        disabled={loading}
      />
      <div className="post-form-footer">
        <span className="char-count">{content.length}/280</span>
        <button type="submit" disabled={!content.trim() || loading}>
          {loading ? 'Posting...' : 'Post'}
        </button>
      </div>
      {error && <p className="error">{error}</p>}
    </form>
  );
}
