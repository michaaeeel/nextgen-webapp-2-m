
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../contexts/AuthContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CourseList from "@/components/CourseList";

const CoursesPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  
  useEffect(() => {
    // Load courses from localStorage
    const allCourses = JSON.parse(localStorage.getItem('courses') || '[]');
    
    // Filter courses by instructor ID (if a user is logged in)
    if (user && user.id) {
      const instructorCourses = allCourses.filter(course => course.instructorId === user.id);
      setCourses(instructorCourses);
    }
  }, [user]);

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
            <CourseList courses={courses} onEdit={handleEdit} onView={handleView} />
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default CoursesPage;
