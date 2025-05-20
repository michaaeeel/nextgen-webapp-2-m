
import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useRBAC } from "../contexts/RBACContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import StudentManagement from "@/components/StudentManagement";
import { 
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator
} from "@/components/ui/breadcrumb";
import { Link } from "react-router-dom";

const InstructorStudentsPage = () => {
  const { user, isAuthenticated } = useAuth();
  const { userRole } = useRBAC();

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/signin" />;
  }

  // Redirect non-instructors to student dashboard
  if (!['admin', 'instructor'].includes(userRole)) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="py-32">
        <div className="container mx-auto px-6">
          <div className="max-w-7xl mx-auto">
            <Breadcrumb className="mb-8">
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink as={Link} to="/instructor-dashboard">
                    Instructor Dashboard
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink>Students Management</BreadcrumbLink>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>

            <div className="mb-8">
              <h1 className="text-3xl font-bold">Student Management</h1>
              <p className="text-muted-foreground">Manage students enrolled in your courses</p>
            </div>
            
            <StudentManagement instructorId={user.id} />
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default InstructorStudentsPage;
