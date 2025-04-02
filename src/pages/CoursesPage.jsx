
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../contexts/AuthContext";
import { useQuery } from '@tanstack/react-query';
import { fetchCoursesByInstructor } from '@/services/courseService';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CourseList from "@/components/CourseList";

const CoursesPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Fetch instructor's courses
  const { 
    data: courses = [],
    isLoading
  } = useQuery({
    queryKey: ['instructorCourses', user?.id],
    queryFn: () => fetchCoursesByInstructor(user.id),
    enabled: !!user?.id
  });

  const handleEdit = (courseId) => {
    navigate(`/instructor-dashboard/courses/${courseId}/edit`);
  };

  const handleView = (courseId) => {
    navigate(`/instructor-dashboard/courses/${courseId}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="py-32">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold mb-8">Manage Courses</h1>
            
            {isLoading ? (
              <div className="text-center">Loading courses...</div>
            ) : (
              <CourseList 
                courses={courses} 
                onEdit={handleEdit} 
                onView={handleView}
                createUrl="/instructor-dashboard/courses/new"
              />
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default CoursesPage;
