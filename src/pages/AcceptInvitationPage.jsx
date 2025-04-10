import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase, validateInvitationToken } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, XCircle, Lock, Mail, User, Loader2 } from "lucide-react";

const AcceptInvitationPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(true);
  const [validatingToken, setValidatingToken] = useState(true);
  const [tokenValid, setTokenValid] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [invitation, setInvitation] = useState(null);
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [processingAction, setProcessingAction] = useState(false);

  useEffect(() => {
    const validateToken = async () => {
      try {
        const params = new URLSearchParams(location.search);
        const token = params.get("token");
        
        console.log('[AcceptInvitation] Validating token:', token);
        
        if (!token) {
          setErrorMessage("Invalid invitation link. No token provided.");
          setTokenValid(false);
          return;
        }
        
        const invitationData = await validateInvitationToken(token);
        console.log('[AcceptInvitation] Invitation data:', invitationData);
        
        setInvitation(invitationData);
        setTokenValid(true);
      } catch (error) {
        console.error("[AcceptInvitation] Token validation error:", error);
        setErrorMessage(error.message || "An error occurred while validating your invitation.");
        setTokenValid(false);
      }
    };
    validateToken();
  }, [location.search]);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleAcceptInvitation = async (e) => {
    e.preventDefault();
    
    console.log('[AcceptInvitation] Starting acceptance process');
    
    setProcessingAction(true);
    try {
      console.log('[AcceptInvitation] Updating user password');
      const { data: { user }, error: updateError } = await supabase.auth.updateUser({
        password: formData.password
      });

      if (updateError) throw updateError;
      console.log('[AcceptInvitation] Password updated successfully');

      console.log('[AcceptInvitation] Creating profile entry');
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: user.id,
          first_name: invitation.first_name,
          last_name: invitation.last_name,
          email: invitation.email,
          role: 'instructor',
          role_verified: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });

      if (profileError) throw profileError;
      console.log('[AcceptInvitation] Profile created successfully');

      console.log('[AcceptInvitation] Updating invitation status with token:', token);
      const params = new URLSearchParams(location.search);
      const token = params.get("token");

      const { data: inviteData, error: inviteError } = await supabase
        .from('user_invitations')
        .update({
          status: 'accepted',
          accepted_at: new Date().toISOString(),
          user_id: user.id  // Add this line to link the invitation to the user
        })
        .eq('token', token)  // Use token instead of email
        .select();

      if (inviteError) {
        console.error('[AcceptInvitation] Invitation update error:', inviteError);
        throw inviteError;
      }
      console.log('[AcceptInvitation] Invitation status updated successfully:', inviteData);

      toast({
        title: "Success!",
        description: "Your account has been set up successfully.",
      });

      navigate('/instructor-dashboard');
    } catch (error) {
      console.error("[AcceptInvitation] Error in acceptance process:", error);
      toast({
        title: "Error Setting Up Account",
        description: error.message || "An unexpected error occurred.",
        variant: "destructive"
      });
    } finally {
      setProcessingAction(false);
    }
  };
  
  if (loading || validatingToken) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto mb-4" />
          <h2 className="text-2xl font-semibold mb-2">Validating Invitation</h2>
          <p className="text-muted-foreground">Please wait while we validate your invitation...</p>
        </div>
      </div>
    );
  }
  
  if (!tokenValid) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <CardTitle className="text-2xl">Invalid Invitation</CardTitle>
            <CardDescription>{errorMessage}</CardDescription>
          </CardHeader>
          <CardFooter className="flex justify-center">
            <Button variant="outline" onClick={() => navigate("/")}>
              Return to Home
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
          <CardTitle className="text-2xl">Accept Invitation</CardTitle>
          <CardDescription>
            {invitation.first_name}, complete your account setup to join as an instructor.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAcceptInvitation} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <div className="flex items-center border rounded-md px-3 py-2 bg-muted text-muted-foreground">
                <Mail className="h-4 w-4 mr-2 opacity-70" />
                <span>{invitation.email}</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Name</label>
              <div className="flex items-center border rounded-md px-3 py-2 bg-muted text-muted-foreground">
                <User className="h-4 w-4 mr-2 opacity-70" />
                <span>{invitation.first_name} {invitation.last_name}</span>
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">
                Create Password*
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="pl-10"
                  placeholder="Your new password"
                  required
                />
              </div>
              <p className="text-sm text-muted-foreground">
                Must be at least 8 characters long.
              </p>
            </div>

            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="text-sm font-medium">
                Confirm Password*
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="pl-10"
                  placeholder="Confirm your password"
                  required
                />
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full" 
              disabled={processingAction}
            >
              {processingAction ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Setting Password...
                </>
              ) : (
                "Set Password & Continue"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AcceptInvitationPage;
