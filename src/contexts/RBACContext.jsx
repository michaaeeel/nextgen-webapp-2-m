import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { checkPermission, supabase } from '@/lib/supabase';

const RBACContext = createContext(null);

export const getUserRole = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId || (await supabase.auth.getUser()).data.user?.id)
      .single();
    
    if (error) {
      // If profile doesn't exist yet, fall back to auth metadata
      const { data: { user } } = await supabase.auth.getUser();
      return user?.user_metadata?.role || 'student';
    }
    
    return data.role;
  } catch (error) {
    console.error('Error getting user role:', error);
    return 'student'; // Safe fallback
  }
};

export function RBACProvider({ children }) {
  const { user, isAuthenticated } = useAuth();
  const [userRole, setUserRole] = useState(null);
  const [permissions, setPermissions] = useState({
    canManageCourses: false,
    canInviteUsers: false,
    canProcessRoleRequests: false,
    canEnrollInCourses: false,
    canRemoveStudents: false
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUserRole = async () => {
      if (!isAuthenticated || !user) {
        setUserRole(null);
        setPermissions({
          canManageCourses: false,
          canInviteUsers: false,
          canProcessRoleRequests: false,
          canEnrollInCourses: false,
          canRemoveStudents: false
        });
        setLoading(false);
        return;
      }

      try {
        const role = await getUserRole(user.id);
        setUserRole(role);
        
        // Set permissions based on role
        const newPermissions = {
          canManageCourses: ['instructor', 'admin'].includes(role),
          canInviteUsers: role === 'admin',
          canProcessRoleRequests: role === 'admin',
          canEnrollInCourses: true, // All roles can enroll
          canRemoveStudents: ['instructor', 'admin'].includes(role)
        };
        
        setPermissions(newPermissions);
      } catch (error) {
        console.error('Error loading user role:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUserRole();
  }, [user, isAuthenticated]);

  const hasPermission = async (permission) => {
    if (!isAuthenticated) return false;
    
    // Handle built-in permissions from the state
    if (permission in permissions) {
      return permissions[permission];
    }
    
    // For custom permissions, check directly
    if (permission === 'admin') {
      return userRole === 'admin';
    } else if (permission === 'instructor') {
      return ['admin', 'instructor'].includes(userRole);
    } else if (permission === 'student') {
      return ['admin', 'instructor', 'student'].includes(userRole);
    }
    
    // If permission is not recognized
    return false;
  };

  const value = {
    userRole,
    permissions,
    hasPermission,
    loading
  };

  return <RBACContext.Provider value={value}>{children}</RBACContext.Provider>;
}

export const useRBAC = () => {
  const context = useContext(RBACContext);
  if (context === null) {
    throw new Error('useRBAC must be used within an RBACProvider');
  }
  return context;
};
