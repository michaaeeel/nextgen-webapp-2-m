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
  
  if (requiredRole === 'admin') {
    hasAccess = userRole === 'admin';
  } else if (requiredRole === 'instructor') {
    hasAccess = ['admin', 'instructor'].includes(userRole);
  } else if (requiredRole === 'student') {
    hasAccess = ['admin', 'instructor', 'student'].includes(userRole);
  }
  
  return hasAccess ? children : fallback;
};

export default RoleBasedElement;
