import React from 'react';
import { Navigate } from 'react-router-dom';

function ProtectedRoute({ role, requiredRole, children }) {
  const token = localStorage.getItem('token');
  
  // Check if user is authenticated
  if (!token) {
    return <Navigate to="/" replace />;
  }
  
  // Verify token is not expired
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Date.now() / 1000;
    
    if (payload.exp < currentTime) {
      // Token expired, clear storage and redirect
      localStorage.removeItem('token');
      localStorage.removeItem('userRole');
      return <Navigate to="/" replace />;
    }
  } catch (error) {
    // Invalid token, clear storage and redirect
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    return <Navigate to="/" replace />;
  }
  
  // Check if user role matches required role
  if (role !== requiredRole) {
    return <Navigate to="/" replace />;
  }
  
  return children;
}

export default ProtectedRoute;