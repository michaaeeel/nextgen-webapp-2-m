
import { supabase, supabaseAdmin } from './client'

// User management functions
export const updateUserProfile = async (userId, updates) => {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single()
  if (error) throw error
  return data
}

export const getUserProfile = async (userId) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()
  if (error) throw error
  return data
}

export const getUserRole = async (userId) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', userId || (await supabase.auth.getUser()).data.user?.id)
    .single();
    
  if (error) throw error;
  if (!data) throw new Error('User profile not found');
  return data.role;
};

export const checkPermission = async (requiredRole, userId = null) => {
  const role = await getUserRole(userId);
  
  // Simple role hierarchy: admin > instructor > student
  if (requiredRole === 'student') {
    return ['student', 'instructor', 'admin'].includes(role);
  } else if (requiredRole === 'instructor') {
    return ['instructor', 'admin'].includes(role);
  } else if (requiredRole === 'admin') {
    return role === 'admin';
  }
  
  return false;
};

export const validateInstructorSession = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  if (session?.user?.user_metadata?.role !== 'instructor') {
    throw new Error('Unauthorized access');
  }
  return session;
};

export const ensureInstructorRole = async (userId) => {
  const { error } = await supabase
    .from('profiles')
    .update({ 
      role: 'instructor',
      role_verified: true 
    })
    .eq('id', userId);
    
  if (error) throw error;
  
  // Update auth metadata
  await supabase.auth.admin.updateUserById(userId, {
    user_metadata: { role: 'instructor' }
  });
};
