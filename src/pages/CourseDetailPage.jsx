
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from "../contexts/AuthContext";
import { useQuery } from '@tanstack/react-query';
import { fetchCourseById } from '@/services/courseService';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CourseDetail from "@/components/CourseDetail";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const CourseDetailPage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Fetch course data
  const { 
    data: course, 
    isLoading,
    error
  } = useQuery({
    queryKey: ['course', courseId],
    queryFn: () => fetchCourseById(courseId)
  });

  const handleEdit = (courseId) => {
    navigate(`/instructor-dashboard/courses/${courseId}/edit`);
  };
  
  const handleBack = () => {
    navigate('/instructor-dashboard/courses');
  };

  // Check if the current user is the instructor of this course
  const isInstructor = course && user && course.instructor_id === user.id;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="py-32">
          <div className="container mx-auto px-6 text-center">
            Loading...
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  if (error || !course) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="py-32">
          <div className="container mx-auto px-6 text-center">
            <h1 className="text-3xl font-bold mb-4">Course Not Found</h1>
            <p className="mb-6">The course you're looking for doesn't exist or has been removed.</p>
            <Button onClick={handleBack}>
              Back to Courses
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // If not the instructor of this course, redirect or show unauthorized
  if (!isInstructor) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="py-32">
          <div className="container mx-auto px-6 text-center">
            <h1 className="text-3xl font-bold mb-4">Unauthorized</h1>
            <p className="mb-6">You don't have permission to view this course.</p>
            <Button onClick={handleBack}>
              Back to Courses
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Convert snake_case database fields to camelCase for component props
  const formattedCourse = {
    id: course.id,
    title: course.title,
    description: course.description,
    coverImage: course.cover_image,
    price: course.price,
    discountPrice: course.discount_price,
    category: course.category,
    level: course.level,
    isPublished: course.is_published,
    instructorId: course.instructor_id,
    instructorName: course.instructor_name,
    modules: course.modules || [],
    assignments: course.assignments || [],
    enrolledStudents: course.enrolled_students || [],
    createdAt: course.created_at,
    updatedAt: course.updated_at
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="py-32">
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto">
            <Button 
              variant="ghost" 
              className="mb-6 flex items-center gap-2"
              onClick={handleBack}
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Courses
            </Button>
            <CourseDetail course={formattedCourse} onEdit={handleEdit} />
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default CourseDetailPage;
