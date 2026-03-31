import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { likesAPI } from '../services/api.js';
import './Post.css';

export function Post({ post, onLikeChange, showReplies = false, onReplyClick }) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.like_count);
  const [loading, setLoading] = useState(false);

  const handleLike = async () => {
    setLoading(true);
    try {
      if (!liked) {
        await likesAPI.like(post.id);
        setLiked(true);
        setLikeCount(likeCount + 1);
        if (onLikeChange) onLikeChange(post.id, likeCount + 1);
      } else {
        await likesAPI.unlike(post.id);
        setLiked(false);
        setLikeCount(likeCount - 1);
        if (onLikeChange) onLikeChange(post.id, likeCount - 1);
      }
    } catch (error) {
      console.error('Like error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="post">
      <div className="post-header">
        <Link to={`/users/${post.username || post.user_id}`} className="post-author-link">
          <span className="post-author">@{post.username || post.user_id}</span>
        </Link>
        <span className="post-time">
          {new Date(post.created_at).toLocaleDateString()}
        </span>
      </div>
      <p className="post-content">{post.content}</p>
      <div className="post-actions">
        <button
          className={`action-btn ${liked ? 'liked' : ''}`}
          onClick={handleLike}
          disabled={loading}
        >
          ❤️ {likeCount}
        </button>
        {showReplies && (
          <button className="action-btn" onClick={() => onReplyClick?.(post.id)}>
            💬 {post.reply_count}
          </button>
        )}
      </div>
    </div>
  );
}
