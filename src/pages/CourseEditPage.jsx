
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from "../contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CourseForm from "@/components/CourseForm";

const CourseEditPage = () => {
  const { courseId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get courses from localStorage
    const courses = JSON.parse(localStorage.getItem('courses') || '[]');
    const foundCourse = courses.find(c => c.id === courseId);
    
    if (foundCourse) {
      setCourse(foundCourse);
    }
    setLoading(false);
  }, [courseId]);

  const handleSubmit = (updatedCourseData) => {
    // Get existing courses
    const existingCourses = JSON.parse(localStorage.getItem('courses') || '[]');
    
    // Find and update the course
    const updatedCourses = existingCourses.map(c => {
      if (c.id === courseId) {
        return {
          ...c,
          ...updatedCourseData,
          updatedAt: new Date().toISOString(),
        };
      }
      return c;
    });
    
    // Save to localStorage
    localStorage.setItem('courses', JSON.stringify(updatedCourses));
    
    // Show success message
    toast({
      title: "Course Updated",
      description: "Your course has been updated successfully.",
    });
    
    // Navigate back to course detail
    navigate(`/instructor-dashboard/courses/${courseId}`);
  };

  if (loading) {
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

  if (!course) {
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

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="py-32">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-8">Edit Course</h1>
            <CourseForm course={course} onSubmit={handleSubmit} isEditing={true} />
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default CourseEditPage;
