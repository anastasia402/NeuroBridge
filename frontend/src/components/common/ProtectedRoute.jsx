import React from 'react';
import { Navigate } from 'react-router-dom';
import { isAuthenticated, getRole } from '../utils/authUtils';

const ProtectedRoute = ({ children, requiredRole }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && getRole() !== requiredRole) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;