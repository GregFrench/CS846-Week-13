import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { postsAPI, repliesAPI } from '../services/api.js';
import { setPosts } from '../slices/feedSlice.js';
import { Post } from './Post.jsx';
import { Reply, ReplyForm } from './Reply.jsx';
import { PostForm } from './PostForm.jsx';
import './Feed.css';

export function Feed() {
  const dispatch = useDispatch();
  const { posts, loading, hasMore } = useSelector((state) => state.feed);
  const [expandedPost, setExpandedPost] = useState(null);
  const [replies, setReplies] = useState({});

  useEffect(() => {
    loadFeed();
  }, []);

  const loadFeed = async () => {
    try {
      const response = await postsAPI.getFeed(50, 0);
      dispatch(
        setPosts({
          posts: response.data.posts,
          offset: 0,
          hasMore: response.data.posts.length === 50,
        }),
      );
    } catch (error) {
      console.error('Feed error:', error);
    }
  };

  const handleLoadReplies = async (postId) => {
    if (replies[postId]) {
      setExpandedPost(expandedPost === postId ? null : postId);
      return;
    }

    try {
      const response = await repliesAPI.getReplies(postId);
      setReplies({ ...replies, [postId]: response.data.replies });
      setExpandedPost(postId);
    } catch (error) {
      console.error('Load replies error:', error);
    }
  };

  const handleReplySubmitted = (postId, reply) => {
    setReplies({
      ...replies,
      [postId]: [...(replies[postId] || []), reply],
    });
  };

  return (
    <div className="feed">
      <PostForm />
      {posts.map((post) => (
        <div key={post.id}>
          <Post
            post={post}
            onReplyClick={handleLoadReplies}
            showReplies={true}
          />
          {expandedPost === post.id && (
            <div className="replies-section">
              {replies[post.id]?.map((reply) => (
                <Reply key={reply.id} reply={reply} />
              ))}
              <ReplyForm
                postId={post.id}
                onReplySubmitted={(reply) => handleReplySubmitted(post.id, reply)}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
