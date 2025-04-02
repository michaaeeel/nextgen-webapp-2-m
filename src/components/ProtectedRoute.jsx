import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useRBAC } from '@/contexts/RBACContext';

const ProtectedRoute = ({ children, requiredRole }) => {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const { userRole, loading: rbacLoading } = useRBAC();
  
  // Show loading indicator while checking auth and role
  if (authLoading || rbacLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }
  
  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/signin" />;
  }
  
  // If no specific role is required, just being authenticated is enough
  if (!requiredRole) {
    return children;
  }
  
  // Check if user has the required role
  let hasAccess = false;
  
  if (requiredRole === 'admin') {
    hasAccess = userRole === 'admin';
  } else if (requiredRole === 'instructor') {
    hasAccess = ['admin', 'instructor'].includes(userRole);
  } else if (requiredRole === 'student') {
    hasAccess = ['admin', 'instructor', 'student'].includes(userRole);
  }
  
  if (!hasAccess) {
    // Redirect to appropriate dashboard based on actual role
    if (userRole === 'admin') {
      return <Navigate to="/admin-dashboard" />;
    } else if (userRole === 'instructor') {
      return <Navigate to="/instructor-dashboard" />;
    } else {
      return <Navigate to="/dashboard" />;
    }
  }
  
  return children;
};

const InstructorRoute = ({ children }) => {
  const { user, isLoading } = useAuth();
  
  if (isLoading) return <LoadingSpinner />;
  
  if (!user || user.role !== 'instructor') {
    return <Navigate to="/login" />;
  }
  
  return children;
};

export default ProtectedRoute;
