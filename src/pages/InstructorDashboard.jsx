
import React, { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useRBAC } from "../contexts/RBACContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, BookOpen, Users, FileText } from "lucide-react";
import { getUserProfile } from "@/lib/supabase/users";

const InstructorDashboard = () => {
  const { user, isAuthenticated } = useAuth();
  const { userRole } = useRBAC();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    if (user?.id) {
      getUserProfile(user.id)
        .then(data => setProfile(data))
        .catch(error => console.error('Error fetching profile:', error));
    }
  }, [user?.id]);

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/signin" />;
  }

  // Redirect non-instructors to student dashboard
  if (!['admin', 'instructor'].includes(userRole)) {
    return <Navigate to="/dashboard" />;
  }

  const handleCreateCourse = () => {
    navigate('/instructor-dashboard/courses/new');
  };

  const handleManageCourses = () => {
    navigate('/instructor-dashboard/courses');
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="py-32">
        <div className="container mx-auto px-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
              <div>
                <h1 className="text-3xl font-bold">Instructor Dashboard</h1>
                <p className="text-muted-foreground">Welcome back, {profile ? profile.first_name : 'Instructor'}</p>
              </div>
              <div className="flex gap-3">
                <Button className="flex items-center gap-2" onClick={handleCreateCourse}>
                  <PlusCircle size={16} />
                  Create New Course
                </Button>
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl">My Courses</CardTitle>
                    <BookOpen className="h-6 w-6 text-primary" />
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">Manage your courses, content, and student enrollments.</p>
                  <Button 
                    onClick={handleManageCourses} 
                    variant="outline"
                    className="w-full"
                  >
                    View My Courses
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl">Create Course</CardTitle>
                    <PlusCircle className="h-6 w-6 text-primary" />
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">Start a new course and create engaging learning content.</p>
                  <Button 
                    onClick={handleCreateCourse} 
                    className="w-full"
                  >
                    Create New Course
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl">Students</CardTitle>
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">View and manage students enrolled in your courses.</p>
                  <Button 
                    variant="outline"
                    className="w-full"
                    disabled
                  >
                    Coming Soon
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default InstructorDashboard;
