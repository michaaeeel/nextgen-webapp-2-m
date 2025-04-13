
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchCourseById } from '@/services/courseService';
import { getEnrolledStudents } from '@/services/enrollmentService';
import { useCourses } from "@/contexts/CourseContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AdminCourseDetail from "@/components/AdminCourseDetail";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const AdminCourseDetailPage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { deleteCourse } = useCourses();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  // Fetch course data
  const { 
    data: course, 
    isLoading 
  } = useQuery({
    queryKey: ['course', courseId],
    queryFn: () => fetchCourseById(courseId)
  });

  // Fetch enrolled students
  const { data: enrolledStudents = [] } = useQuery({
    queryKey: ['enrolledStudents', courseId],
    queryFn: () => getEnrolledStudents(courseId),
    enabled: !!courseId
  });

  const handleEdit = (courseId) => {
    navigate(`/admin-dashboard/courses/${courseId}/edit`);
  };

  const handleDelete = () => {
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteCourse(courseId);
      // Navigate back after deletion
      navigate("/admin-dashboard/courses");
    } finally {
      setIsDeleteDialogOpen(false);
    }
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

  if (!course) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="py-32">
          <div className="container mx-auto px-6 text-center">
            <h1 className="text-2xl font-bold mb-4">Course Not Found</h1>
            <p className="mb-6">The course you're looking for doesn't exist or has been removed.</p>
            <button 
              onClick={() => navigate('/admin-dashboard/courses')}
              className="px-4 py-2 bg-primary text-white rounded-md"
            >
              Back to Courses
            </button>
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
    instructorId: course.instructor_id,
    instructorName: course.instructor_name,
    modules: course.modules || [],
    assignments: course.assignments || [],
    enrolledStudents: enrolledStudents,
    createdAt: course.created_at,
    updatedAt: course.updated_at
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="py-32">
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto">
            <AdminCourseDetail 
              course={formattedCourse} 
              onEdit={handleEdit} 
              onDelete={handleDelete}
            />
          </div>
        </div>
      </main>
      
      <Footer />

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              course and all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminCourseDetailPage;
