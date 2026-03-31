import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { repliesAPI } from '../services/api.js';
import './Reply.css';

export function Reply({ reply }) {
  return (
    <div className="reply">
      <div className="reply-header">
        <Link to={`/users/${reply.username || reply.user_id}`} className="reply-author-link">
          <span className="reply-author">@{reply.username || reply.user_id}</span>
        </Link>
        <span className="reply-time">
          {new Date(reply.created_at).toLocaleDateString()}
        </span>
      </div>
      <p className="reply-content">{reply.content}</p>
    </div>
  );
}

export function ReplyForm({ postId, onReplySubmitted }) {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const response = await repliesAPI.createReply(postId, content);
      onReplySubmitted?.(response.data.reply);
      setContent('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create reply');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="reply-form" onSubmit={handleSubmit}>
      <textarea
        placeholder="Reply to this post..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        maxLength={280}
        disabled={loading}
      />
      <div className="reply-form-footer">
        <span className="char-count">{content.length}/280</span>
        <button type="submit" disabled={!content.trim() || loading}>
          {loading ? 'Replying...' : 'Reply'}
        </button>
      </div>
      {error && <p className="error">{error}</p>}
    </form>
  );
}
