import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>; // Optional loading spinner
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;