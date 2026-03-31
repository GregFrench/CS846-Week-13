import axios from 'axios';

const API_BASE_URL = '/api';

const client = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// Add token to requests
client.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle errors
client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  },
);

export const authAPI = {
  register: (username, email, password) =>
    client.post('/auth/register', { username, email, password }),
  login: (username, password) => client.post('/auth/login', { username, password }),
  logout: () => client.post('/auth/logout'),
};

export const postsAPI = {
  getFeed: (limit = 50, offset = 0) =>
    client.get('/posts', { params: { limit, offset } }),
  getPost: (postId) => client.get(`/posts/${postId}`),
  createPost: (content) => client.post('/posts', { content }),
  getUserPosts: (username, limit = 50, offset = 0) =>
    client.get(`/users/${username}/posts`, { params: { limit, offset } }),
};

export const likesAPI = {
  like: (postId) => client.post(`/posts/${postId}/likes`),
  unlike: (postId) => client.delete(`/posts/${postId}/likes`),
};

export const repliesAPI = {
  getReplies: (postId, limit = 50, offset = 0) =>
    client.get(`/posts/${postId}/replies`, { params: { limit, offset } }),
  createReply: (postId, content) =>
    client.post(`/posts/${postId}/replies`, { content }),
};

export const usersAPI = {
  getUser: (username) => client.get(`/users/${username}`),
};

export default client;
