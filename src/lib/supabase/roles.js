
import { supabase } from './client'

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
