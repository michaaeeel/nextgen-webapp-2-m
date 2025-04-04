export const invitationEmailTemplate = (firstName, inviteUrl, tempPassword) => ({
  subject: 'Invitation to Join as Instructor',
  html: `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Welcome to NextGEN Learning Platform</h2>
      <p>Hello ${firstName},</p>
      <p>You've been invited to join our platform as an instructor. Here are your login credentials:</p>
      
      <div style="background: #f9fafb; padding: 16px; border-radius: 8px; margin: 24px 0;">
        <p style="margin: 0;"><strong>Temporary Password:</strong> ${tempPassword}</p>
      </div>
      
      <a href="${inviteUrl}" 
         style="display: inline-block; background: #0066cc; color: white; 
                padding: 12px 24px; text-decoration: none; border-radius: 6px;">
        Accept Invitation
      </a>
      
      <p style="color: #666; margin-top: 24px;">
        This invitation will expire in 7 days. Please set up your account before then.
      </p>
    </div>
  `
});