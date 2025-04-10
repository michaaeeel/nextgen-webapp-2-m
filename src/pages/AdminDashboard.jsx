import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserPlus, UserCog, Book, Mail, PlusCircle } from "lucide-react";

const AdminDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="py-32">
        <div className="container mx-auto px-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            </div>
            
            <Tabs defaultValue="overview" onValueChange={setActiveTab} className="space-y-8">
              <TabsList className="grid grid-cols-3 gap-2">
                <TabsTrigger value="users">User Management</TabsTrigger>
                <TabsTrigger value="invitations">Invitations</TabsTrigger>
                <TabsTrigger value="courses">Course Management</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">User Management</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Link to="/admin-dashboard/users">
                        <Button className="w-full">
                          <UserCog className="mr-2 h-4 w-4" />
                          Manage Users
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Invite Users</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Link to="/admin-dashboard/invitations">
                        <Button className="w-full">
                          <UserPlus className="mr-2 h-4 w-4" />
                          Send Invites
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Courses</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Link to="/admin-dashboard/courses">
                        <Button className="w-full">
                          <Book className="mr-2 h-4 w-4" />
                          Manage Courses
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                </div>
                
                {/* Additional dashboard content */}
              </TabsContent>
              
              <TabsContent value="invitations">
                <div className="bg-card rounded-lg p-6 shadow-elegant">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-semibold">Instructor Invitations</h2>
                    <Link to="/admin-dashboard/invitations">
                      <Button>
                        <Mail className="mr-2 h-4 w-4" />
                        Manage Invitations
                      </Button>
                    </Link>
                  </div>
                  <p className="text-muted-foreground mb-4">
                    Send and manage email invitations to bring new instructors into the platform.
                    You can track pending, accepted, expired, and cancelled invitations.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Send Invitations</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground mb-4">
                          Invite new instructors by sending them an email with account setup instructions.
                        </p>
                        <Link to="/admin-dashboard/invitations">
                          <Button className="w-full">
                            <UserPlus className="mr-2 h-4 w-4" />
                            Send New Invitation
                          </Button>
                        </Link>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Track Invitations</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground mb-4">
                          View and manage all pending, accepted, expired, and cancelled invitations.
                        </p>
                        <Link to="/admin-dashboard/invitations">
                          <Button className="w-full">
                            <Mail className="mr-2 h-4 w-4" />
                            View All Invitations
                          </Button>
                        </Link>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Resend Invitations</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground mb-4">
                          Resend invitations to instructors who haven't accepted them yet.
                        </p>
                        <Link to="/admin-dashboard/invitations">
                          <Button className="w-full">
                            <Clipboard className="mr-2 h-4 w-4" />
                            Manage Pending Invites
                          </Button>
                        </Link>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="courses">
                <div className="bg-card rounded-lg p-6 shadow-elegant">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-semibold">Course Management</h2>
                    <Link to="/admin-dashboard/courses">
                      <Button>
                        <Book className="mr-2 h-4 w-4" />
                        View All Courses
                      </Button>
                    </Link>
                  </div>
                  <p className="text-muted-foreground mb-4">
                    Manage all courses on the platform. Create, edit, delete, and assign courses to instructors.
                    Monitor course content, enrollment, and performance.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Create Course</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground mb-4">
                          Create a new course and assign it to an instructor.
                        </p>
                        <Link to="/admin-dashboard/courses/new">
                          <Button className="w-full">
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Create New Course
                          </Button>
                        </Link>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Manage Courses</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground mb-4">
                          View, edit, and delete existing courses.
                        </p>
                        <Link to="/admin-dashboard/courses">
                          <Button className="w-full">
                            <Book className="mr-2 h-4 w-4" />
                            All Courses
                          </Button>
                        </Link>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Instructor Assignments</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground mb-4">
                          Assign courses to instructors or change instructors.
                        </p>
                        <Link to="/admin-dashboard/courses">
                          <Button className="w-full">
                            <UserCog className="mr-2 h-4 w-4" />
                            Manage Assignments
                          </Button>
                        </Link>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>
              
              {/* Other tab contents would be implemented here */}
            </Tabs>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default AdminDashboard;
