
import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { PlusCircle, Users, BookOpen, FileText, Clock } from "lucide-react";

const InstructorDashboard = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");

  // Sample data for the dashboard
  const courses = [
    { id: 1, title: "Introduction to Web Development", students: 87, progress: 100, status: "active" },
    { id: 2, title: "Advanced React Patterns", students: 54, progress: 70, status: "active" },
    { id: 3, title: "Database Design Fundamentals", students: 32, progress: 30, status: "draft" },
  ];

  // Redirect to login if not authenticated or if not an instructor
  if (!isAuthenticated) {
    return <Navigate to="/signin" />;
  }

  if (user.role !== "instructor") {
    return <Navigate to="/dashboard" />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="py-32">
        <div className="container mx-auto px-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
              <div>
                <h1 className="text-3xl font-bold">Instructor Dashboard</h1>
                <p className="text-muted-foreground">Welcome back, {user.name}</p>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" onClick={logout}>
                  Sign Out
                </Button>
                <Button className="flex items-center gap-2">
                  <PlusCircle size={16} />
                  Create New Course
                </Button>
              </div>
            </div>
            
            <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="mb-8 grid w-full grid-cols-3 md:w-auto">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="courses">My Courses</TabsTrigger>
                <TabsTrigger value="students">Students</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg font-medium">Total Students</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-2">
                        <Users className="h-5 w-5 text-muted-foreground" />
                        <span className="text-3xl font-bold">173</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">+12% from last month</p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg font-medium">Active Courses</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-2">
                        <BookOpen className="h-5 w-5 text-muted-foreground" />
                        <span className="text-3xl font-bold">3</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">2 courses in draft</p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg font-medium">Pending Assignments</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-2">
                        <FileText className="h-5 w-5 text-muted-foreground" />
                        <span className="text-3xl font-bold">24</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">Needs grading</p>
                    </CardContent>
                  </Card>
                </div>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Course Performance</CardTitle>
                    <CardDescription>Student enrollment and engagement across your courses</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {courses.map((course) => (
                        <div key={course.id} className="space-y-2">
                          <div className="flex justify-between">
                            <span className="font-medium">{course.title}</span>
                            <span className="text-muted-foreground text-sm">{course.students} students</span>
                          </div>
                          <Progress value={course.progress} className="h-2" />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Recent Activity</CardTitle>
                      <CardDescription>Latest actions from your students</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex gap-4 items-start">
                          <div className="rounded-full bg-secondary p-2">
                            <FileText className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="font-medium">Assignment Submitted</p>
                            <p className="text-sm text-muted-foreground">John Doe submitted "JavaScript Basics"</p>
                            <p className="text-xs text-muted-foreground flex items-center mt-1">
                              <Clock className="inline mr-1 h-3 w-3" /> 2 hours ago
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex gap-4 items-start">
                          <div className="rounded-full bg-secondary p-2">
                            <Users className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="font-medium">New Enrollment</p>
                            <p className="text-sm text-muted-foreground">Sarah Miller joined "Advanced React Patterns"</p>
                            <p className="text-xs text-muted-foreground flex items-center mt-1">
                              <Clock className="inline mr-1 h-3 w-3" /> 5 hours ago
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button variant="ghost" className="w-full">View All Activity</Button>
                    </CardFooter>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Upcoming Deadlines</CardTitle>
                      <CardDescription>Assignments due in the next week</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-medium">React Hooks Quiz</p>
                              <p className="text-sm text-muted-foreground">Advanced React Patterns</p>
                            </div>
                            <div className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs">
                              Tomorrow
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-medium">Final Project</p>
                              <p className="text-sm text-muted-foreground">Introduction to Web Development</p>
                            </div>
                            <div className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                              In 5 days
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button variant="ghost" className="w-full">View All Deadlines</Button>
                    </CardFooter>
                  </Card>
                </div>
              </TabsContent>
              
              <TabsContent value="courses" className="space-y-8">
                <Card>
                  <CardHeader>
                    <CardTitle>My Courses</CardTitle>
                    <CardDescription>Manage your current courses and create new ones</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {courses.map((course) => (
                        <div key={course.id} className="p-4 border rounded-lg flex justify-between items-center">
                          <div>
                            <h3 className="font-medium">{course.title}</h3>
                            <p className="text-sm text-muted-foreground">{course.students} enrolled students</p>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">Edit</Button>
                            <Button variant="secondary" size="sm">View</Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full">Create New Course</Button>
                  </CardFooter>
                </Card>
              </TabsContent>
              
              <TabsContent value="students" className="space-y-8">
                <Card>
                  <CardHeader>
                    <CardTitle>Student Management</CardTitle>
                    <CardDescription>View and manage students across all your courses</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <p className="text-center py-8">Student management functionality will be implemented in the next phase.</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default InstructorDashboard;
