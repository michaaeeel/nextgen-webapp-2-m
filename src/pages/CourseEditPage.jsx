
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from "../contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchCourseById, updateCourse } from '@/services/courseService';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CourseForm from "@/components/CourseForm";

const CourseEditPage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Fetch course data
  const { 
    data: course, 
    isLoading: isLoadingCourse,
    error: courseError
  } = useQuery({
    queryKey: ['course', courseId],
    queryFn: () => fetchCourseById(courseId)
  });

  // Create update mutation
  const updateCourseMutation = useMutation({
    mutationFn: (courseData) => updateCourse(courseId, courseData),
    onSuccess: (updatedCourse) => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      queryClient.invalidateQueries({ queryKey: ['course', courseId] });
      queryClient.invalidateQueries({ queryKey: ['instructorCourses'] });
      
      toast({
        title: "Course Updated",
        description: "The course has been updated successfully.",
      });
      
      navigate(`/instructor-dashboard/courses/${courseId}`);
    },
    onError: (err) => {
      toast({
        title: "Error Updating Course",
        description: err.message || "Failed to update course",
        variant: "destructive"
      });
    }
  });

  // Check if the current user is the instructor of this course
  const isInstructor = course && user && course.instructor_id === user.id;

  if (isLoadingCourse) {
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
  
  if (courseError || !course) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="py-32">
          <div className="container mx-auto px-6 text-center">
            <h1 className="text-3xl font-bold mb-4">Course Not Found</h1>
            <p className="mb-6">The course you're trying to edit doesn't exist or has been removed.</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // If not the instructor of this course, show unauthorized
  if (!isInstructor) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="py-32">
          <div className="container mx-auto px-6 text-center">
            <h1 className="text-3xl font-bold mb-4">Unauthorized</h1>
            <p className="mb-6">You don't have permission to edit this course.</p>
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
    modules: course.modules || [],
    assignments: course.assignments || [],
    enrolledStudents: course.enrolled_students || [],
  };

  const handleSubmit = (courseData) => {
    // Map form data to match the database structure
    const updatedCourse = {
      title: courseData.title,
      description: courseData.description,
      cover_image: courseData.coverImage,
      price: courseData.price,
      discount_price: courseData.discountPrice || null,
      category: courseData.category,
      level: courseData.level,
      is_published: courseData.isPublished,
      modules: courseData.modules,
      assignments: courseData.assignments,
      updated_at: new Date().toISOString()
    };
    
    updateCourseMutation.mutate(updatedCourse);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="py-32">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-8">Edit Course</h1>
            <CourseForm 
              course={formattedCourse} 
              onSubmit={handleSubmit} 
              isEditing={true} 
            />
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default CourseEditPage;
