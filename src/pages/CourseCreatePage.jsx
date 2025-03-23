
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
      instructor_id: user.id,
      instructor_name: courseData.instructorName || user.name,
      modules: courseData.modules,
      assignments: courseData.assignments,
      enrolled_students: [],
      is_published: false
    };
    
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
