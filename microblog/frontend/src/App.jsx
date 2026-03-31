import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { restoreAuth } from './slices/authSlice.js';
import { Header } from './components/Header.jsx';
import { Feed } from './components/Feed.jsx';
import { Login, Register } from './components/Auth.jsx';
import UserProfile from './components/UserProfile.jsx';
import './App.css';

function ProtectedRoute({ children, isAuthenticated, restoring }) {
  // Show nothing while restoring to prevent flash of login page
  if (restoring) {
    return <div className="loading">Loading...</div>;
  }
  return isAuthenticated ? children : <Navigate to="/login" />;
}

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated, restoring } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(restoreAuth());
  }, [dispatch]);

  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated} restoring={restoring}>
                <div className="main-layout">
                  <Header />
                  <Feed />
                </div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/users/:username"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated} restoring={restoring}>
                <div className="main-layout">
                  <Header />
                  <UserProfile />
                </div>
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
