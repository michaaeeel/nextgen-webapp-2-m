import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserPlus, UserCog, Clipboard, Book } from "lucide-react";

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
              <TabsList className="grid grid-cols-4 gap-2">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="users">User Management</TabsTrigger>
                <TabsTrigger value="requests">Role Requests</TabsTrigger>
                <TabsTrigger value="courses">Course Management</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
                      <CardTitle className="text-lg">Role Requests</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Link to="/admin-dashboard/role-requests">
                        <Button className="w-full">
                          <Clipboard className="mr-2 h-4 w-4" />
                          Review Requests
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
