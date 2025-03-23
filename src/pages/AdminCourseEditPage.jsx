
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCourses } from '@/contexts/CourseContext';
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
  const { getCourse, updateCourse, loading } = useCourses();
  const { toast } = useToast();
  const [course, setCourse] = useState(null);

  useEffect(() => {
    if (!loading) {
      const courseData = getCourse(courseId);
      if (courseData) {
        setCourse(courseData);
      } else {
        toast({
          title: "Error",
          description: "Course not found",
          variant: "destructive"
        });
        navigate('/admin-dashboard/courses');
      }
    }
  }, [courseId, getCourse, loading, navigate, toast]);

  const handleSubmit = (data) => {
    try {
      updateCourse(courseId, data);
      
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
                  course={course}
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
