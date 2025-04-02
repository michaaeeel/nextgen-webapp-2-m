
import React from 'react';
import { useRBAC } from '@/contexts/RBACContext';

const RoleBasedElement = ({ 
  requiredRole, 
  children, 
  fallback = null 
}) => {
  const { loading } = useRBAC();
  
  // Don't render anything while loading
  if (loading) return null;
  
  // Always show the children component regardless of role
  return children;
};

export default RoleBasedElement;
