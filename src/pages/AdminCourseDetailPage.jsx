import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
  const { getCourse, deleteCourse, loading } = useCourses();
  const [course, setCourse] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  useEffect(() => {
    if (!loading) {
      const foundCourse = getCourse(courseId);
      setCourse(foundCourse);
    }
  }, [courseId, getCourse, loading]);

  const handleEdit = (courseId) => {
    navigate(`/admin-dashboard/courses/${courseId}/edit`);
  };

  const handleDelete = () => {
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    try {
      deleteCourse(courseId);
      // Navigate back after deletion
      navigate("/admin-dashboard/courses");
    } finally {
      setIsDeleteDialogOpen(false);
    }
  };

  const handleAssignInstructor = () => {
    navigate(`/admin-dashboard/courses/${courseId}/assign-instructor`);
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

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="py-32">
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto">
            <AdminCourseDetail 
              course={course} 
              onEdit={handleEdit} 
              onDelete={handleDelete}
              onAssignInstructor={handleAssignInstructor}
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