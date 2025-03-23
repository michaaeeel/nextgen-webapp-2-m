import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useRBAC } from "@/contexts/RBACContext";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { supabase, updateUserProfile } from "@/lib/supabase";
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
} from "@/components/ui/dialog";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  UserCog, 
  UserPlus, 
  Search, 
  Mail, 
  Calendar,
  Check,
  X
} from "lucide-react";

const UsersPage = () => {
  const { user } = useAuth();
  const { permissions } = useRBAC();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false);
  const [newRole, setNewRole] = useState("");
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const [inviteData, setInviteData] = useState({
    email: "",
    role: "student"
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      // Get all users from auth.users and join with profiles
      const { data: authUsers, error: authError } = await supabase
        .from('profiles')
        .select(`
          id,
          first_name,
          last_name,
          role,
          created_at,
          auth_user:id (email, last_sign_in_at, created_at, raw_user_meta_data)
        `)
        .order('created_at', { ascending: false });

      if (authError) throw authError;
      
      setUsers(authUsers || []);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast({
        title: "Error",
        description: "Failed to load users. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async () => {
    if (!selectedUser || !newRole) return;
    
    try {
      // Update in profiles table
      await updateUserProfile(selectedUser.id, { 
        role: newRole,
        last_role_change: new Date().toISOString(),
        role_change_by: user.id
      });
      
      // Update user metadata
      const { error: metadataError } = await supabase.auth.admin.updateUserById(
        selectedUser.id, 
        { user_metadata: { role: newRole } }
      );
      
      if (metadataError) throw metadataError;
      
      // Log the change to audit log
      await supabase
        .from('role_change_audit_log')
        .insert({
          user_id: selectedUser.id,
          changed_by: user.id,
          previous_role: selectedUser.role,
          new_role: newRole,
          reason: "Direct admin role change"
        });
      
      // Update the users array
      setUsers(users.map(u => 
        u.id === selectedUser.id ? { ...u, role: newRole } : u
      ));
      
      toast({
        title: "Role Updated",
        description: `User role has been updated to ${newRole}.`
      });
      
      setIsRoleDialogOpen(false);
    } catch (error) {
      console.error("Error updating role:", error);
      toast({
        title: "Role Update Failed",
        description: error.message || "Failed to update user role.",
        variant: "destructive"
      });
    }
  };

  const handleInviteUser = async () => {
    if (!inviteData.email || !inviteData.role) return;
    
    try {
      // Generate a unique token
      const token = crypto.randomUUID();
      const expires = new Date();
      expires.setDate(expires.getDate() + 7); // 7-day expiration
      
      await supabase
        .from('user_invitations')
        .insert({
          email: inviteData.email,
          role: inviteData.role,
          invited_by: user.id,
          token,
          expires_at: expires.toISOString()
        });
      
      // Here you would normally send an email with the invitation link
      // For now, we'll just show a success message with the token
      
      toast({
        title: "Invitation Sent",
        description: `Invitation has been created for ${inviteData.email}. Token: ${token}`,
      });
      
      setInviteData({ email: "", role: "student" });
      setInviteDialogOpen(false);
    } catch (error) {
      console.error("Error inviting user:", error);
      toast({
        title: "Invitation Failed",
        description: error.message || "Failed to create invitation.",
        variant: "destructive"
      });
    }
  };

  const filteredUsers = users.filter(user => {
    const searchLower = searchTerm.toLowerCase();
    const email = user.auth_user?.email?.toLowerCase() || '';
    const firstName = user.first_name?.toLowerCase() || '';
    const lastName = user.last_name?.toLowerCase() || '';
    
    return email.includes(searchLower) || 
           firstName.includes(searchLower) || 
           lastName.includes(searchLower) ||
           user.role?.toLowerCase().includes(searchLower);
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="py-32">
        <div className="container mx-auto px-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold">User Management</h1>
              
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="pl-10 w-[250px]"
                  />
                </div>
                
                {permissions.canInviteUsers && (
                  <Button onClick={() => setInviteDialogOpen(true)}>
                    <UserPlus className="mr-2 h-4 w-4" />
                    Invite User
                  </Button>
                )}
              </div>
            </div>
            
            {loading ? (
              <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : (
              <div className="bg-card rounded-lg shadow-elegant overflow-hidden">
                <Table>
                  <TableCaption>List of all system users</TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Last Login</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8">
                          No users found{searchTerm && ` matching "${searchTerm}"`}.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredUsers.map(userData => (
                        <TableRow key={userData.id}>
                          <TableCell className="font-medium">
                            {userData.first_name} {userData.last_name}
                          </TableCell>
                          <TableCell>{userData.auth_user?.email}</TableCell>
                          <TableCell>
                            <span className={`py-1 px-2 rounded-full text-xs font-medium ${
                              userData.role === 'admin' 
                                ? 'bg-red-100 text-red-800' 
                                : userData.role === 'instructor' 
                                ? 'bg-blue-100 text-blue-800' 
                                : 'bg-green-100 text-green-800'
                            }`}>
                              {userData.role}
                            </span>
                          </TableCell>
                          <TableCell>
                            {new Date(userData.created_at).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            {userData.auth_user?.last_sign_in_at 
                              ? new Date(userData.auth_user.last_sign_in_at).toLocaleDateString() 
                              : 'Never'}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setSelectedUser(userData);
                                setNewRole(userData.role);
                                setIsRoleDialogOpen(true);
                              }}
                              disabled={!permissions.canProcessRoleRequests}
                            >
                              <UserCog className="h-4 w-4" />
                              <span className="sr-only">Change Role</span>
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        </div>
      </main>
      
      {/* Role Change Dialog */}
      <Dialog open={isRoleDialogOpen} onOpenChange={setIsRoleDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change User Role</DialogTitle>
            <DialogDescription>
              Update the role for {selectedUser?.first_name} {selectedUser?.last_name}.
              This will change their permissions in the system.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="role" className="text-sm font-medium">
                Select Role
              </label>
              <Select value={newRole} onValueChange={setNewRole}>
                <SelectTrigger id="role">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="student">Student</SelectItem>
                  <SelectItem value="instructor">Instructor</SelectItem>
                  <SelectItem value="admin">Administrator</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRoleDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleRoleChange}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Invite User Dialog */}
      <Dialog open={inviteDialogOpen} onOpenChange={setInviteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invite New User</DialogTitle>
            <DialogDescription>
              Send an invitation to a new user. They will receive instructions to create an account.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email Address
              </label>
              <Input
                id="email"
                type="email"
                value={inviteData.email}
                onChange={e => setInviteData({...inviteData, email: e.target.value})}
                placeholder="user@example.com"
                required
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="invite-role" className="text-sm font-medium">
                Role
              </label>
              <Select 
                value={inviteData.role} 
                onValueChange={value => setInviteData({...inviteData, role: value})}
              >
                <SelectTrigger id="invite-role">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="student">Student</SelectItem>
                  <SelectItem value="instructor">Instructor</SelectItem>
                  <SelectItem value="admin">Administrator</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setInviteDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleInviteUser}>
              Send Invitation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Footer />
    </div>
  );
};

export default UsersPage; 