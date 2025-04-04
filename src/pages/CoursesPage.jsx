
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../contexts/AuthContext";
import { useQuery } from '@tanstack/react-query';
import { fetchCoursesByInstructor } from '@/services/courseService';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CourseList from "@/components/CourseList";
import { Button } from "@/components/ui/button";
import { PlusCircle, AlertTriangle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const CoursesPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Fetch instructor's courses
  const { 
    data: coursesData = [],
    isLoading,
    error
  } = useQuery({
    queryKey: ['instructorCourses', user?.id],
    queryFn: () => fetchCoursesByInstructor(user.id),
    enabled: !!user?.id
  });

  // Sort courses: drafts first, then published courses
  const courses = React.useMemo(() => {
    return [...coursesData].sort((a, b) => {
      // Sort by publish status (drafts first)
      if (a.is_published !== b.is_published) {
        return a.is_published ? 1 : -1;
      }
      // If publish status is the same, sort by created date (newest first)
      return new Date(b.created_at) - new Date(a.created_at);
    });
  }, [coursesData]);

  const handleCreateCourse = () => {
    navigate('/instructor-dashboard/courses/new');
  };

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
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold">My Courses</h1>
              <Button 
                className="flex items-center gap-2" 
                onClick={handleCreateCourse}
              >
                <PlusCircle className="h-4 w-4" />
                Create Course
              </Button>
            </div>
            
            {error && (
              <Alert variant="destructive" className="mb-6">
                <AlertTriangle className="h-4 w-4 mr-2" />
                <AlertDescription>
                  Error loading courses: {error.message || "Something went wrong. Please try again."}
                </AlertDescription>
              </Alert>
            )}
            
            {isLoading ? (
              <div className="flex justify-center items-center py-16">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            ) : (
              <CourseList 
                courses={courses.map(course => ({
                  id: course.id,
                  title: course.title,
                  description: course.description,
                  coverImage: course.cover_image,
                  isPublished: course.is_published,
                  category: course.category,
                  level: course.level,
                  modules: course.modules || [],
                  assignments: course.assignments || [],
                  enrolledStudents: course.enrolled_students || [],
                  instructorName: course.instructor_name,
                  createdAt: course.created_at,
                  updatedAt: course.updated_at
                }))} 
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
