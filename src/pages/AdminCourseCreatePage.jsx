
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCourses } from '@/contexts/CourseContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useToast } from '@/components/ui/use-toast';
import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import AdminCourseForm from '@/components/AdminCourseForm';

const AdminCourseCreatePage = () => {
  const navigate = useNavigate();
  const { createCourse } = useCourses();
  const { toast } = useToast();

  const handleSubmit = (courseData) => {
    try {
      const createdCourse = createCourse(courseData);
      
      toast({
        title: "Success",
        description: "Course created successfully!",
      });
      
      navigate(`/admin-dashboard/courses/${createdCourse.id}`);
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to create course",
        variant: "destructive"
      });
    }
  };

  const handleCancel = () => {
    navigate('/admin-dashboard/courses');
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="py-32">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl font-bold">Create New Course</CardTitle>
                <CardDescription>
                  Enter the details for the new course
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <AdminCourseForm 
                  onSubmit={handleSubmit}
                  onCancel={handleCancel}
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

export default AdminCourseCreatePage;
