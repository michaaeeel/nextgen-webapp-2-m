
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useRBAC } from '@/contexts/RBACContext';

const ProtectedRoute = ({ children, requiredRole }) => {
  const { isAuthenticated, loading: authLoading } = useAuth();
  
  // Show loading indicator while checking auth
  if (authLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }
  
  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/signin" />;
  }
  
  // If authenticated, allow access to all routes regardless of role
  return children;
};

export default ProtectedRoute;
