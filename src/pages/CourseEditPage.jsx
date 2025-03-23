
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from "../contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchCourseById, updateCourse as updateCourseApi } from '@/services/courseService';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CourseForm from "@/components/CourseForm";

const CourseEditPage = () => {
  const { courseId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Fetch course data
  const { 
    data: course, 
    isLoading, 
    error 
  } = useQuery({
    queryKey: ['course', courseId],
    queryFn: () => fetchCourseById(courseId),
    onError: (err) => {
      toast({
        title: "Error",
        description: err.message || "Failed to load course",
        variant: "destructive"
      });
      navigate('/instructor-dashboard/courses');
    }
  });

  // Update course mutation
  const updateCourseMutation = useMutation({
    mutationFn: (courseData) => updateCourseApi(courseId, courseData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      queryClient.invalidateQueries({ queryKey: ['course', courseId] });
      
      toast({
        title: "Course Updated",
        description: "Your course has been updated successfully.",
      });
      
      navigate(`/instructor-dashboard/courses/${courseId}`);
    },
    onError: (err) => {
      toast({
        title: "Error",
        description: err.message || "Failed to update course",
        variant: "destructive"
      });
    }
  });

  const handleSubmit = (updatedCourseData) => {
    // Map form data to match the database structure
    const courseData = {
      title: updatedCourseData.title,
      description: updatedCourseData.description,
      instructor_name: updatedCourseData.instructorName,
      modules: updatedCourseData.modules,
      assignments: updatedCourseData.assignments,
      instructor_id: user.id
    };
    
    updateCourseMutation.mutate(courseData);
  };

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
            <p className="mb-6">The course you're trying to edit doesn't exist.</p>
            <button 
              onClick={() => navigate('/instructor-dashboard/courses')}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md"
            >
              Back to Courses
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Check if this instructor is authorized to edit this course
  if (course.instructor_id !== user.id) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="py-32">
          <div className="container mx-auto px-6 text-center">
            <h1 className="text-3xl font-bold mb-4">Unauthorized</h1>
            <p className="mb-6">You don't have permission to edit this course.</p>
            <button 
              onClick={() => navigate('/instructor-dashboard/courses')}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md"
            >
              Back to Courses
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Map database fields to form field names for CourseForm
  const formData = {
    title: course.title,
    description: course.description,
    instructorName: course.instructor_name,
    modules: course.modules || [],
    assignments: course.assignments || []
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="py-32">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-8">Edit Course</h1>
            <CourseForm course={formData} onSubmit={handleSubmit} isEditing={true} />
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default CourseEditPage;
