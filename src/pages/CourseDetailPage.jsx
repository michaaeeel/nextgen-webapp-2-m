
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchCourseById } from '@/services/courseService';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CourseDetail from "@/components/CourseDetail";

const CourseDetailPage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  
  // Fetch course data
  const { 
    data: course, 
    isLoading 
  } = useQuery({
    queryKey: ['course', courseId],
    queryFn: () => fetchCourseById(courseId)
  });

  const handleEdit = (courseId) => {
    navigate(`/instructor-dashboard/courses/${courseId}/edit`);
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

  // Convert snake_case database fields to camelCase for component props
  const formattedCourse = course ? {
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
  } : null;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="py-32">
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto">
            <CourseDetail course={formattedCourse} onEdit={handleEdit} />
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default CourseDetailPage;
