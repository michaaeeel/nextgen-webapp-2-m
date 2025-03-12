
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CourseForm from "@/components/CourseForm";

const CourseCreatePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = (courseData) => {
    // Get existing courses or initialize empty array
    const existingCourses = JSON.parse(localStorage.getItem('courses') || '[]');
    
    // Create new course with ID, dates, and instructor info
    const newCourse = {
      id: Date.now().toString(),
      ...courseData,
      instructorId: user.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      enrolledStudents: [],
    };
    
    // Save to localStorage
    localStorage.setItem('courses', JSON.stringify([...existingCourses, newCourse]));
    
    // Show success message
    toast({
      title: "Course Created",
      description: "Your new course has been created successfully.",
    });
    
    // Navigate back to courses list
    navigate('/instructor-dashboard/courses');
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
