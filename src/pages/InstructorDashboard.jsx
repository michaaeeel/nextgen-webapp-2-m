
import React, { useState, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

// Import refactored components
import DashboardHeader from "@/components/instructor/DashboardHeader";
import DashboardStats from "@/components/instructor/DashboardStats";
import CoursePerformance from "@/components/instructor/CoursePerformance";
import RecentActivity from "@/components/instructor/RecentActivity";
import UpcomingDeadlines from "@/components/instructor/UpcomingDeadlines";
import CoursesList from "@/components/instructor/CoursesList";
import StudentManagement from "@/components/instructor/StudentManagement";

const InstructorDashboard = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [courses, setCourses] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Load instructor's courses from localStorage
    const allCourses = JSON.parse(localStorage.getItem('courses') || '[]');
    if (user && user.id) {
      const instructorCourses = allCourses.filter(course => course.instructorId === user.id);
      setCourses(instructorCourses);
    }
  }, [user]);

  // Redirect to login if not authenticated or if not an instructor
  if (!isAuthenticated) {
    return <Navigate to="/signin" />;
  }

  if (user.role !== "instructor") {
    return <Navigate to="/dashboard" />;
  }

  const handleCreateCourse = () => {
    navigate('/instructor-dashboard/courses/new');
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="py-32">
        <div className="container mx-auto px-6">
          <div className="max-w-7xl mx-auto">
            <DashboardHeader 
              user={user} 
              logout={logout} 
              handleCreateCourse={handleCreateCourse} 
            />
            
            <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="mb-8 grid w-full grid-cols-3 md:w-auto">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="courses">My Courses</TabsTrigger>
                <TabsTrigger value="students">Students</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="space-y-8">
                <DashboardStats courses={courses} />
                
                <CoursePerformance courses={courses} handleCreateCourse={handleCreateCourse} />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <RecentActivity />
                  <UpcomingDeadlines />
                </div>
              </TabsContent>
              
              <TabsContent value="courses" className="space-y-8">
                <CoursesList courses={courses} handleCreateCourse={handleCreateCourse} />
              </TabsContent>
              
              <TabsContent value="students" className="space-y-8">
                <StudentManagement />
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
