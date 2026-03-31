import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Post } from './Post.jsx';
import './UserProfile.css';

const UserProfile = ({ username }) => {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const params = useParams();
  const displayUsername = username || params.username;

  useEffect(() => {
    if (!displayUsername) {
      setError('No username provided');
      setLoading(false);
      return;
    }

    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/users/${displayUsername}`);
        if (!response.ok) {
          throw new Error('User not found');
        }
        const data = await response.json();
        setUser(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [displayUsername]);

  useEffect(() => {
    if (!displayUsername) return;

    const fetchUserPosts = async () => {
      try {
        const response = await fetch(`/api/users/${displayUsername}/posts`);
        if (!response.ok) {
          throw new Error('Failed to fetch posts');
        }
        const data = await response.json();
        setPosts(data.posts || []);
      } catch (err) {
        console.error('Error fetching posts:', err);
        setPosts([]);
      }
    };

    fetchUserPosts();
  }, [displayUsername]);

  if (loading) return <div className="user-profile"><p>Loading...</p></div>;
  if (error) return <div className="user-profile"><p>Error: {error}</p></div>;

  return (
    <div className="user-profile">
      <h1>{displayUsername}</h1>
      {user && (
        <div className="user-info">
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Member Since:</strong> {new Date(user.created_at).toLocaleDateString()}</p>
        </div>
      )}
      <div className="user-posts">
        <h2>Posts</h2>
        {posts.length === 0 ? (
          <p>No posts yet</p>
        ) : (
          <div className="posts-list">
            {posts.map((post) => (
              <Post key={post.id} post={post} showReplies={false} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export { UserProfile };
export default UserProfile;
