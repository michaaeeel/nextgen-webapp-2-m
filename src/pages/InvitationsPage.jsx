import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { supabase, sendInstructorInvitation, resendInvitation, cancelInvitation } from "@/lib/supabase";
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogPortal
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertCircle, 
  RefreshCw,
  Send,
  UserPlus,
  Trash2,
  Mail
} from "lucide-react";

const InvitationsPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("pending");
  const [invitations, setInvitations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showNewInviteDialog, setShowNewInviteDialog] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: ""
  });
  const [processingAction, setProcessingAction] = useState(false);
  
  useEffect(() => {
    fetchInvitations();
  }, [activeTab]);

  const fetchInvitations = async () => {
    setLoading(true);
    try {
      const status = activeTab;
      
      const { data, error } = await supabase
        .from('user_invitations')
        .select('*')
        .eq('status', status)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      setInvitations(data || []);
    } catch (error) {
      console.error("Error fetching invitations:", error);
      toast({
        title: "Error",
        description: "Failed to load invitations.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSendInvitation = async () => {
    if (!formData.email || !formData.firstName || !formData.lastName) {
      toast({
        title: "Missing Fields",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    setProcessingAction(true);
    try {
      console.log("Sending invitation to:", formData);
      // Use the helper function from supabase.js
      await sendInstructorInvitation(
        formData.email,
        formData.firstName,
        formData.lastName
      );
      
      toast({
        title: "Invitation Sent",
        description: `Invitation sent to ${formData.email}`,
      });
      
      // Reset form and refresh list
      setFormData({ email: "", firstName: "", lastName: "" });
      setShowNewInviteDialog(false);
      fetchInvitations();
    } catch (error) {
      console.error("Error sending invitation:", error);
      toast({
        title: "Failed to Send Invitation",
        description: error.message || "An unexpected error occurred.",
        variant: "destructive"
      });
    } finally {
      setProcessingAction(false);
    }
  };

  const handleResendInvitation = async (invitationId) => {
    setProcessingAction(true);
    try {
      // Use the helper function from supabase.js
      await resendInvitation(invitationId);
      
      toast({
        title: "Invitation Resent",
        description: "The invitation has been resent successfully.",
      });
      
      fetchInvitations();
    } catch (error) {
      console.error("Error resending invitation:", error);
      toast({
        title: "Failed to Resend",
        description: error.message || "An unexpected error occurred.",
        variant: "destructive"
      });
    } finally {
      setProcessingAction(false);
    }
  };

  const handleCancelInvitation = async (invitationId) => {
    setProcessingAction(true);
    try {
      // Use the helper function from supabase.js
      await cancelInvitation(invitationId);
      
      toast({
        title: "Invitation Cancelled",
        description: "The invitation has been cancelled.",
      });
      
      // Remove the invitation from the current list
      setInvitations(invitations.filter(inv => inv.id !== invitationId));
    } catch (error) {
      console.error("Error cancelling invitation:", error);
      toast({
        title: "Failed to Cancel",
        description: error.message || "An unexpected error occurred.",
        variant: "destructive"
      });
    } finally {
      setProcessingAction(false);
    }
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
  };

  const renderStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200">
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        );
      case 'accepted':
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
            <CheckCircle className="h-3 w-3 mr-1" />
            Accepted
          </Badge>
        );
      case 'expired':
        return (
          <Badge variant="outline" className="bg-orange-100 text-orange-800 border-orange-200">
            <AlertCircle className="h-3 w-3 mr-1" />
            Expired
          </Badge>
        );
      case 'cancelled':
        return (
          <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">
            <XCircle className="h-3 w-3 mr-1" />
            Cancelled
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="py-32">
        <div className="container mx-auto px-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold">Instructor Invitations</h1>
              
              <Dialog>
                <DialogTrigger asChild>
                  <Button>
                    <UserPlus className="mr-2 h-4 w-4" />
                    Send New Invitation
                  </Button>
                </DialogTrigger>
                <DialogPortal>
                  <DialogContent className="sm:max-w-[525px]">
                    <DialogHeader>
                      <DialogTitle>Send Instructor Invitation</DialogTitle>
                      <DialogDescription>
                        Send an invitation to a new instructor. They will receive an email with login instructions.
                      </DialogDescription>
                    </DialogHeader>
                    
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <label htmlFor="email" className="text-sm font-medium">
                          Email Address*
                        </label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="instructor@example.com"
                          required
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label htmlFor="firstName" className="text-sm font-medium">
                            First Name*
                          </label>
                          <Input
                            id="firstName"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleInputChange}
                            placeholder="John"
                            required
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <label htmlFor="lastName" className="text-sm font-medium">
                            Last Name*
                          </label>
                          <Input
                            id="lastName"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleInputChange}
                            placeholder="Doe"
                            required
                          />
                        </div>
                      </div>
                      
                      <div className="bg-blue-50 p-4 rounded-md text-sm">
                        <p className="text-blue-700 flex items-start">
                          <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                          <span>
                            The invited instructor will receive an email with a link to set up their account. 
                            A temporary password will be generated and included in the email. The invitation will expire in 7 days.
                          </span>
                        </p>
                      </div>
                    </div>
                    
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setShowNewInviteDialog(false)}>
                        Cancel
                      </Button>
                      <Button 
                        type="button"
                        onClick={handleSendInvitation}
                        disabled={processingAction}
                      >
                        {processingAction ? (
                          <>
                            <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                            Sending...
                          </>
                        ) : (
                          <>
                            <Send className="mr-2 h-4 w-4" />
                            Send Invitation
                          </>
                        )}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </DialogPortal>
              </Dialog>
            </div>
            
            <Tabs 
              defaultValue="pending" 
              value={activeTab}
              onValueChange={setActiveTab} 
              className="space-y-8"
            >
              <TabsList className="grid grid-cols-4 w-[500px]">
                <TabsTrigger value="pending">
                  <Clock className="h-4 w-4 mr-2" />
                  Pending
                </TabsTrigger>
                <TabsTrigger value="accepted">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Accepted
                </TabsTrigger>
                <TabsTrigger value="expired">
                  <AlertCircle className="h-4 w-4 mr-2" />
                  Expired
                </TabsTrigger>
                <TabsTrigger value="cancelled">
                  <XCircle className="h-4 w-4 mr-2" />
                  Cancelled
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value={activeTab}>
                {loading ? (
                  <div className="flex justify-center items-center py-20">
                    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
                  </div>
                ) : invitations.length === 0 ? (
                  <div className="bg-card rounded-lg shadow-elegant p-8 text-center">
                    <Mail className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-xl font-medium mb-2">No {activeTab} invitations</h3>
                    <p className="text-muted-foreground">
                      {activeTab === 'pending' 
                        ? "There are no pending invitations. Send a new invitation to add instructors." 
                        : `No invitations have been ${activeTab} yet.`}
                    </p>
                  </div>
                ) : (
                  <div className="bg-card rounded-lg shadow-elegant overflow-hidden">
                    <Table>
                      <TableCaption>
                        {activeTab === 'pending' 
                          ? 'Pending instructor invitations' 
                          : activeTab === 'accepted'
                          ? 'Accepted instructor invitations'
                          : activeTab === 'expired'
                          ? 'Expired instructor invitations'
                          : 'Cancelled instructor invitations'}
                      </TableCaption>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Email</TableHead>
                          <TableHead>Name</TableHead>
                          <TableHead>Sent Date</TableHead>
                          <TableHead>Expires</TableHead>
                          <TableHead>Invited By</TableHead>
                          {activeTab === 'pending' && <TableHead className="text-right">Actions</TableHead>}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {invitations.map(invitation => (
                          <TableRow key={invitation.id}>
                            <TableCell className="font-medium">
                              {invitation.email}
                            </TableCell>
                            <TableCell>
                              {invitation.first_name} {invitation.last_name}
                            </TableCell>
                            <TableCell>
                              {formatDateTime(invitation.created_at)}
                            </TableCell>
                            <TableCell>
                              {formatDateTime(invitation.expires_at)}
                            </TableCell>
                            <TableCell>
                              <span className="text-xs text-muted-foreground">
                                {invitation.invited_by}
                              </span>
                            </TableCell>
                            {activeTab === 'pending' && (
                              <TableCell className="text-right">
                                <div className="flex justify-end items-center space-x-2">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleResendInvitation(invitation.id)}
                                    disabled={processingAction}
                                    className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                  >
                                    <RefreshCw className="h-4 w-4 mr-1" />
                                    Resend
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleCancelInvitation(invitation.id)}
                                    disabled={processingAction}
                                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                  >
                                    <Trash2 className="h-4 w-4 mr-1" />
                                    Cancel
                                  </Button>
                                </div>
                              </TableCell>
                            )}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default InvitationsPage; 