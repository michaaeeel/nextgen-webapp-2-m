
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createCourse as createCourseApi } from '@/services/courseService';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CourseForm from "@/components/CourseForm";

const CourseCreatePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Create course mutation
  const createCourseMutation = useMutation({
    mutationFn: createCourseApi,
    onSuccess: (newCourse) => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      queryClient.invalidateQueries({ queryKey: ['instructorCourses'] });
      
      toast({
        title: "Course Created",
        description: "Your new course has been created successfully.",
      });
      
      navigate(`/instructor-dashboard/courses/${newCourse.id}`);
    },
    onError: (err) => {
      toast({
        title: "Error Creating Course",
        description: err.message || "Failed to create course",
        variant: "destructive"
      });
    }
  });

  const handleSubmit = (courseData) => {
    // Map form data to match the database structure
    const newCourse = {
      title: courseData.title,
      description: courseData.description,
      cover_image: courseData.coverImage,
      price: courseData.price,
      discount_price: courseData.discountPrice || null,
      category: courseData.category,
      level: courseData.level,
      is_published: courseData.isPublished,
      modules: courseData.modules,
      assignments: courseData.assignments
    };
    
    // Instructor will be automatically set in the service
    createCourseMutation.mutate(newCourse);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="py-32">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-8">Create New Course</h1>
            <CourseForm onSubmit={handleSubmit} />
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default CourseCreatePage;
