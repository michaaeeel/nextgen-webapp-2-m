import { createClient } from '@supabase/supabase-js'
import { generatePassword } from '@/utils/passwords';
import { addDays } from '@/utils/dateUtils';
import crypto from 'crypto'; // Add this for crypto.randomUUID()

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
const supabaseServiceKey = import.meta.env.VITE_SUPABASE_SERVICE_KEY

// Regular client for normal operations
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Admin client for privileged operations
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

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
  return data  // Add missing return
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

// Invitation management functions
export async function sendInstructorInvitation(email, firstName, lastName) {
  try {
    const inviteId = self.crypto.randomUUID();
    const currentUser = (await supabase.auth.getUser()).data.user;
    const tempPassword = generatePassword();
    const expiresAt = addDays(new Date(), 7);

    // Step 1: Create an entry in user_invitations (using regular client)
    const { data, error } = await supabase
      .from('user_invitations')
      .insert({
        email,
        first_name: firstName,
        last_name: lastName,
        role: 'instructor',
        invited_by: currentUser.id,
        token: inviteId,
        temp_password: tempPassword,
        expires_at: expiresAt.toISOString(),
        status: 'pending',
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;

    // Step 2: Send invite email using admin client
    const { error: inviteError } = await supabaseAdmin.auth.admin.inviteUserByEmail(email, {
      redirectTo: `${window.location.origin}/accept-invitation?token=${inviteId}`,
      data: {
        temp_password: tempPassword,
        role: 'instructor',
        first_name: firstName,
        last_name: lastName,
      },
    });

    if (inviteError) throw inviteError;

    return { success: true, invitation: data };
  } catch (error) {
    console.error('Error in sendInstructorInvitation:', error);
    throw error;
  }
}

export const resendInvitation = async (invitationId) => {
  // Get the invitation details
  const { data: invitation, error: fetchError } = await supabase
    .from('user_invitations')
    .select('*')
    .eq('id', invitationId)
    .single();
    
  if (fetchError) throw fetchError;
  
  // Generate new token and expiration date
  const token = crypto.randomUUID();
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);
  
  // Update the invitation with new token and expiration
  const { error: updateError } = await supabase
    .from('user_invitations')
    .update({
      token,
      expires_at: expiresAt.toISOString(),
      updated_at: new Date().toISOString()
    })
    .eq('id', invitationId);
    
  if (updateError) throw updateError;
  
  // Prepare invitation URL
  const inviteUrl = `${window.location.origin}/accept-invitation?token=${token}`;
  
  // Send email through Supabase Auth
  const { error: emailError } = await supabase.auth.resetPasswordForEmail(
    invitation.email,
    {
      redirectTo: inviteUrl,
      data: {
        invite_token: token,
        temp_password: invitation.temp_password
      }
    }
  );
  
  if (emailError) throw emailError;
  
  return { success: true };
};

export const cancelInvitation = async (invitationId) => {
  const { error } = await supabase
    .from('user_invitations')
    .update({
      status: 'cancelled',
      updated_at: new Date().toISOString()
    })
    .eq('id', invitationId);
    
  if (error) throw error;
  
  return { success: true };
};

export const validateInvitationToken = async (token) => {
  const { data, error } = await supabase
    .from('user_invitations')
    .select('*')
    .eq('token', token)
    .eq('status', 'pending')
    .single();
  
  if (error) throw error;
  
  // Check if invitation has expired
  const expiryDate = new Date(data.expires_at);
  if (expiryDate < new Date()) {
    // Update invitation status to expired
    await supabase
      .from('user_invitations')
      .update({ 
        status: 'expired',
        updated_at: new Date().toISOString()
      })
      .eq('id', data.id);
      
    throw new Error('This invitation has expired.');
  }
  
  return data;
};

export const acceptInvitation = async (token, password) => {
  // First update
  const { data: invitation, error: inviteError } = await supabase
    .from('user_invitations')
    .update({
      status: 'accepted',
      accepted_at: new Date().toISOString()
    })
    .eq('token', token)
    .select()
    .single();

  if (inviteError) throw inviteError;
  
  // Create auth user
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: invitation.email,
    password: password,
    options: {
      data: {
        role: 'instructor', // Explicitly set role in auth metadata
        first_name: invitation.first_name,
        last_name: invitation.last_name
      }
    }
  });
  
  if (authError) throw authError;
  
  // Create a profile entry
  const { error: profileError } = await supabase
    .from('profiles')
    .insert({
      id: authData.user.id,
      first_name: invitation.first_name,
      last_name: invitation.last_name,
      email: invitation.email,
      role: invitation.role,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    });
    
  if (profileError) throw profileError;
  
  return { success: true };
};

export const inviteUser = async (email, role) => {
  if (!email || !role) {
    throw new Error('Email and role are required');
  }
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
    .from('profiles')  // Should be 'profiles' table
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