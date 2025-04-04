
import { supabase, supabaseAdmin } from './client'
import { generatePassword } from '@/utils/passwords';
import { addDays } from '@/utils/dateUtils';
import crypto from 'crypto';

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
  try {
    // 1. First validate and get invitation
    const { data: invitation, error: fetchError } = await supabase
      .from('user_invitations')
      .select('*')
      .eq('token', token)
      .single();

    if (fetchError) throw fetchError;

    // 2. Create auth user with admin client
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: invitation.email,
      password: password,
      email_confirm: true, // Auto-confirm email
      user_metadata: {
        role: 'instructor',
        first_name: invitation.first_name,
        last_name: invitation.last_name
      }
    });

    if (authError) throw authError;

    // 3. Wait for auth session to be established
    const { data: { session }, error: sessionError } = await supabase.auth.signInWithPassword({
      email: invitation.email,
      password: password,
    });

    if (sessionError) throw sessionError;

    // 4. Create profile entry
    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .insert({
        id: authData.user.id,
        first_name: invitation.first_name,
        last_name: invitation.last_name,
        email: invitation.email,
        role: 'instructor',
        role_verified: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });

    if (profileError) throw profileError;

    // 5. Update invitation status last
    const { error: updateError } = await supabase
      .from('user_invitations')
      .update({
        status: 'accepted',
        accepted_at: new Date().toISOString(),
        user_id: authData.user.id
      })
      .eq('id', invitation.id);

    if (updateError) throw updateError;

    return { success: true, session };
  } catch (error) {
    console.error('Error in acceptInvitation:', error);
    throw error;
  }
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
