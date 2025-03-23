import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { supabase, processRoleChangeRequest } from "@/lib/supabase";
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
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertCircle, 
  UserCheck, 
  UserX
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

const RoleRequestsPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("pending");
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isProcessDialogOpen, setIsProcessDialogOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [processingAction, setProcessingAction] = useState(null); // 'approve' or 'reject'
  const [actionReason, setActionReason] = useState("");
  
  useEffect(() => {
    fetchRequests();
  }, [activeTab]);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const status = activeTab === 'pending' ? 'pending' : activeTab === 'approved' ? 'approved' : 'rejected';
      
      const { data, error } = await supabase
        .from('role_change_requests')
        .select(`
          *,
          user:user_id (
            email:auth_user!inner(email),
            first_name,
            last_name
          ),
          requester:requested_by (
            email:auth_user!inner(email),
            first_name,
            last_name
          ),
          processor:processed_by (
            email:auth_user!inner(email),
            first_name,
            last_name
          )
        `)
        .eq('status', status)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      setRequests(data || []);
    } catch (error) {
      console.error("Error fetching requests:", error);
      toast({
        title: "Error",
        description: "Failed to load role change requests.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenProcessDialog = (request, action) => {
    setSelectedRequest(request);
    setProcessingAction(action);
    setActionReason("");
    setIsProcessDialogOpen(true);
  };

  const handleProcessRequest = async () => {
    if (!selectedRequest || !processingAction) return;
    
    try {
      await processRoleChangeRequest(
        selectedRequest.id, 
        processingAction === 'approve', 
        actionReason
      );
      
      // Filter out the processed request from the list
      setRequests(prev => prev.filter(req => req.id !== selectedRequest.id));
      
      toast({
        title: processingAction === 'approve' ? "Request Approved" : "Request Rejected",
        description: processingAction === 'approve' 
          ? `User role has been updated to ${selectedRequest.requested_role}.`
          : "The role change request has been rejected."
      });
      
      setIsProcessDialogOpen(false);
    } catch (error) {
      console.error("Error processing request:", error);
      toast({
        title: "Process Failed",
        description: error.message || "Failed to process role change request.",
        variant: "destructive"
      });
    }
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
      case 'approved':
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
            <CheckCircle className="h-3 w-3 mr-1" />
            Approved
          </Badge>
        );
      case 'rejected':
        return (
          <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">
            <XCircle className="h-3 w-3 mr-1" />
            Rejected
          </Badge>
        );
      default:
        return null;
    }
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="py-32">
        <div className="container mx-auto px-6">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold mb-8">Role Change Requests</h1>
            
            <Tabs 
              defaultValue="pending" 
              value={activeTab}
              onValueChange={setActiveTab} 
              className="space-y-8"
            >
              <TabsList className="grid grid-cols-3 w-[400px]">
                <TabsTrigger value="pending">
                  <Clock className="h-4 w-4 mr-2" />
                  Pending
                </TabsTrigger>
                <TabsTrigger value="approved">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Approved
                </TabsTrigger>
                <TabsTrigger value="rejected">
                  <XCircle className="h-4 w-4 mr-2" />
                  Rejected
                </TabsTrigger>
              </TabsList>
              
              {['pending', 'approved', 'rejected'].map(tabValue => (
                <TabsContent key={tabValue} value={tabValue}>
                  {loading ? (
                    <div className="flex justify-center items-center py-20">
                      <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
                    </div>
                  ) : requests.length === 0 ? (
                    <div className="bg-card rounded-lg shadow-elegant p-8 text-center">
                      <AlertCircle className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                      <h3 className="text-xl font-medium mb-2">No {tabValue} requests</h3>
                      <p className="text-muted-foreground">
                        {tabValue === 'pending' 
                          ? "There are no pending role change requests to review." 
                          : `No role change requests have been ${tabValue} yet.`}
                      </p>
                    </div>
                  ) : (
                    <div className="bg-card rounded-lg shadow-elegant overflow-hidden">
                      <Table>
                        <TableCaption>
                          {tabValue === 'pending' 
                            ? 'Pending role change requests' 
                            : tabValue === 'approved'
                            ? 'Approved role change requests'
                            : 'Rejected role change requests'}
                        </TableCaption>
                        <TableHeader>
                          <TableRow>
                            <TableHead>User</TableHead>
                            <TableHead>Current Role</TableHead>
                            <TableHead>Requested Role</TableHead>
                            <TableHead>Requested By</TableHead>
                            <TableHead>Reason</TableHead>
                            <TableHead>Date</TableHead>
                            {tabValue !== 'pending' && <TableHead>Processed By</TableHead>}
                            {tabValue !== 'pending' && <TableHead>Processed Date</TableHead>}
                            {tabValue === 'pending' && <TableHead className="text-right">Actions</TableHead>}
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {requests.map(request => (
                            <TableRow key={request.id}>
                              <TableCell className="font-medium">
                                {request.user?.first_name} {request.user?.last_name}
                                <div className="text-xs text-muted-foreground">
                                  {request.user?.email?.email}
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge variant="outline" className={
                                  request.current_role === 'admin' 
                                    ? 'bg-red-50 text-red-700 border-red-100' 
                                    : request.current_role === 'instructor'
                                    ? 'bg-blue-50 text-blue-700 border-blue-100'
                                    : 'bg-green-50 text-green-700 border-green-100'
                                }>
                                  {request.current_role}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <Badge variant="outline" className={
                                  request.requested_role === 'admin' 
                                    ? 'bg-red-50 text-red-700 border-red-100' 
                                    : request.requested_role === 'instructor'
                                    ? 'bg-blue-50 text-blue-700 border-blue-100'
                                    : 'bg-green-50 text-green-700 border-green-100'
                                }>
                                  {request.requested_role}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                {request.requester?.first_name} {request.requester?.last_name}
                              </TableCell>
                              <TableCell className="max-w-xs truncate">
                                {request.reason || 'No reason provided'}
                              </TableCell>
                              <TableCell>
                                {formatDateTime(request.created_at)}
                              </TableCell>
                              {tabValue !== 'pending' && (
                                <TableCell>
                                  {request.processor?.first_name} {request.processor?.last_name}
                                </TableCell>
                              )}
                              {tabValue !== 'pending' && (
                                <TableCell>
                                  {formatDateTime(request.processed_at)}
                                </TableCell>
                              )}
                              {tabValue === 'pending' && (
                                <TableCell className="text-right">
                                  <div className="flex justify-end items-center space-x-2">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleOpenProcessDialog(request, 'approve')}
                                      className="text-green-600 hover:text-green-700 hover:bg-green-50"
                                    >
                                      <UserCheck className="h-4 w-4 mr-1" />
                                      Approve
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleOpenProcessDialog(request, 'reject')}
                                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                    >
                                      <UserX className="h-4 w-4 mr-1" />
                                      Reject
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
              ))}
            </Tabs>
          </div>
        </div>
      </main>
      
      {/* Process Request Dialog */}
      <Dialog open={isProcessDialogOpen} onOpenChange={setIsProcessDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {processingAction === 'approve' ? 'Approve' : 'Reject'} Role Change Request
            </DialogTitle>
            <DialogDescription>
              {processingAction === 'approve'
                ? `You are about to approve the role change from "${selectedRequest?.current_role}" to "${selectedRequest?.requested_role}" for ${selectedRequest?.user?.first_name} ${selectedRequest?.user?.last_name}.`
                : `You are about to reject the role change request for ${selectedRequest?.user?.first_name} ${selectedRequest?.user?.last_name}.`}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="reason" className="text-sm font-medium">
                Reason for {processingAction === 'approve' ? 'approval' : 'rejection'} (optional)
              </label>
              <Textarea
                id="reason"
                value={actionReason}
                onChange={e => setActionReason(e.target.value)}
                placeholder={`Provide a reason for ${processingAction === 'approve' ? 'approving' : 'rejecting'} this request...`}
                className="min-h-[100px]"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsProcessDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleProcessRequest}
              variant={processingAction === 'approve' ? 'default' : 'destructive'}
            >
              {processingAction === 'approve' ? 'Approve' : 'Reject'} Request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Footer />
    </div>
  );
};

export default RoleRequestsPage; 