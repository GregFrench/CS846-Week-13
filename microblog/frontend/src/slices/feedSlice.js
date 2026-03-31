import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  posts: [],
  loading: false,
  error: null,
  hasMore: true,
  offset: 0,
};

const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    addPost: (state, action) => {
      state.posts.unshift(action.payload);
    },
    setPosts: (state, action) => {
      state.posts = action.payload.posts;
      state.offset = action.payload.offset;
      state.hasMore = action.payload.hasMore;
    },
    appendPosts: (state, action) => {
      state.posts.push(...action.payload.posts);
      state.offset = action.payload.offset;
      state.hasMore = action.payload.hasMore;
    },
    updatePostLikes: (state, action) => {
      const post = state.posts.find((p) => p.id === action.payload.postId);
      if (post) {
        post.like_count = action.payload.likeCount;
      }
    },
    updatePostReplies: (state, action) => {
      const post = state.posts.find((p) => p.id === action.payload.postId);
      if (post) {
        post.reply_count = action.payload.replyCount;
      }
    },
  },
});

export const {
  setLoading,
  setError,
  addPost,
  setPosts,
  appendPosts,
  updatePostLikes,
  updatePostReplies,
} = feedSlice.actions;

export default feedSlice.reducer;
