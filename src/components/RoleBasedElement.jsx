
import React from 'react';
import { useRBAC } from '@/contexts/RBACContext';

const RoleBasedElement = ({ 
  requiredRole, 
  children, 
  fallback = null 
}) => {
  const { userRole, loading } = useRBAC();
  
  if (loading) return null;
  
  let hasAccess = false;
  
  // Add debugging
  console.log('RoleBasedElement - User role:', userRole, 'Required role:', requiredRole);
  
  if (requiredRole === 'admin') {
    hasAccess = userRole === 'admin';
  } else if (requiredRole === 'instructor') {
    hasAccess = ['admin', 'instructor'].includes(userRole);
  } else if (requiredRole === 'student') {
    hasAccess = ['admin', 'instructor', 'student'].includes(userRole);
  }
  
  // Ensure admins can access instructor elements
  if (requiredRole === 'instructor' && userRole === 'admin') {
    hasAccess = true;
  }
  
  return hasAccess ? children : fallback;
};

export default RoleBasedElement;
