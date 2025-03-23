
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCourses } from '@/contexts/CourseContext';
import { useQuery } from '@tanstack/react-query';
import { fetchCourseById } from '@/services/courseService';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import AdminCourseForm from '@/components/AdminCourseForm';

const AdminCourseEditPage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { updateCourse } = useCourses();
  const { toast } = useToast();
  
  // Fetch course data
  const { 
    data: course, 
    isLoading: loading, 
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
      navigate('/admin-dashboard/courses');
    }
  });

  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: "Course not found",
        variant: "destructive"
      });
      navigate('/admin-dashboard/courses');
    }
  }, [error, navigate, toast]);

  const handleSubmit = async (data) => {
    try {
      // Map form data to match the database structure
      const courseData = {
        title: data.title,
        description: data.description,
        cover_image: data.coverImage,
        price: data.price,
        discount_price: data.discountPrice || null,
        category: data.category,
        level: data.level,
        is_published: data.isPublished,
        modules: data.modules,
        assignments: data.assignments
      };
      
      await updateCourse(courseId, courseData);
      
      toast({
        title: "Success",
        description: "Course updated successfully!",
      });
      
      navigate(`/admin-dashboard/courses/${courseId}`);
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to update course",
        variant: "destructive"
      });
    }
  };

  const handleCancel = () => {
    navigate(`/admin-dashboard/courses/${courseId}`);
  };

  if (loading || !course) {
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

  // Map database fields to form field names
  const formData = {
    title: course.title,
    description: course.description,
    coverImage: course.cover_image,
    price: course.price,
    discountPrice: course.discount_price,
    category: course.category,
    level: course.level,
    isPublished: course.is_published,
    modules: course.modules || [],
    assignments: course.assignments || []
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="py-32">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl font-bold">Edit Course</CardTitle>
                <CardDescription>
                  Update the details for this course
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <AdminCourseForm 
                  course={formData}
                  onSubmit={handleSubmit}
                  onCancel={handleCancel}
                  isEditing={true}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default AdminCourseEditPage;
