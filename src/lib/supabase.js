import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Auth helper functions
export const signUp = async ({ email, password, ...metadata }) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: metadata,
    },
  })
  if (error) throw error
  return data
}

export const signIn = async ({ email, password }) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  if (error) throw error
  return data
}

export const signOut = async () => {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

export const resetPassword = async (email) => {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`,
  })
  if (error) throw error
}

// Course management functions
export const createCourse = async (courseData) => {
  const { data, error } = await supabase
    .from('courses')
    .insert(courseData)
    .select()
    .single()
  if (error) throw error
  return data
}

export const getCourses = async () => {
  const { data, error } = await supabase
    .from('courses')
    .select('*')
  if (error) throw error
  return data
}

export const enrollInCourse = async (userId, courseId) => {
  const { data, error } = await supabase
    .from('enrollments')
    .insert({ user_id: userId, course_id: courseId })
    .select()
    .single()
  if (error) throw error
  return data
}

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

// Role-related functions
export const requestRoleChange = async (userId, requestedRole, reason) => {
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', userId)
    .single();
    
  const { data, error } = await supabase
    .from('role_change_requests')
    .insert({
      user_id: userId,
      requested_by: (await supabase.auth.getUser()).data.user.id,
      current_role: profile.role,
      requested_role,
      reason
    })
    .select()
    .single();
    
  if (error) throw error;
  return data;
};

export const processRoleChangeRequest = async (requestId, approve, reason) => {
  const { data: request } = await supabase
    .from('role_change_requests')
    .select('*')
    .eq('id', requestId)
    .single();
    
  if (!request) throw new Error('Request not found');
  
  const status = approve ? 'approved' : 'rejected';
  const currentUser = (await supabase.auth.getUser()).data.user;
  
  // Update request status
  await supabase
    .from('role_change_requests')
    .update({
      status,
      processed_by: currentUser.id,
      processed_at: new Date().toISOString()
    })
    .eq('id', requestId);
    
  if (approve) {
    // Update user's role in profiles
    await supabase
      .from('profiles')
      .update({
        role: request.requested_role,
        last_role_change: new Date().toISOString(),
        role_change_by: currentUser.id
      })
      .eq('id', request.user_id);
      
    // Update user's role in auth metadata
    await supabase.auth.admin.updateUserById(request.user_id, {
      user_metadata: { role: request.requested_role }
    });
  }
  
  // Log the change to audit log
  await supabase
    .from('role_change_audit_log')
    .insert({
      user_id: request.user_id,
      changed_by: currentUser.id,
      previous_role: request.current_role,
      new_role: approve ? request.requested_role : request.current_role,
      reason,
      request_id: requestId
    });
    
  return { success: true };
};

export const inviteUser = async (email, role) => {
  // Generate a unique token
  const token = crypto.randomUUID();
  const expires = new Date();
  expires.setDate(expires.getDate() + 7); // 7-day expiration
  
  const { data, error } = await supabase
    .from('user_invitations')
    .insert({
      email,
      role,
      invited_by: (await supabase.auth.getUser()).data.user.id,
      token,
      expires_at: expires.toISOString()
    })
    .select()
    .single();
    
  if (error) throw error;
  
  // Here you would typically send an email with the invitation link
  // For now, we'll just return the token
  return { token, invitation: data };
};

export const getUserRole = async (userId) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', userId || (await supabase.auth.getUser()).data.user?.id)
    .single();
    
  if (error) throw error;
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