import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCourses } from '@/contexts/CourseContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CourseList from '@/components/CourseList';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/components/ui/use-toast';

const AdminCoursesPage = () => {
  const navigate = useNavigate();
  const { courses, deleteCourse, loading } = useCourses();
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleCreateCourse = () => {
    navigate('/admin-dashboard/courses/create');
  };

  const handleViewCourse = (courseId) => {
    navigate(`/admin-dashboard/courses/${courseId}`);
  };

  const handleEditCourse = (courseId) => {
    navigate(`/admin-dashboard/courses/${courseId}/edit`);
  };

  const handleDeleteCourse = (courseId) => {
    setSelectedCourseId(courseId);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    try {
      deleteCourse(selectedCourseId);
      toast({
        title: "Success",
        description: "Course deleted successfully!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete course",
        variant: "destructive"
      });
    } finally {
      setIsDeleteDialogOpen(false);
      setSelectedCourseId(null);
    }
  };

  const handleAssignInstructor = (courseId) => {
    navigate(`/admin-dashboard/courses/${courseId}/assign-instructor`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="py-32">
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Courses Management</h1>
            <Button onClick={handleCreateCourse} className="flex items-center gap-2">
              <PlusCircle className="h-4 w-4" />
              Create Course
            </Button>
          </div>
          
          {loading ? (
            <div className="text-center py-8">Loading courses...</div>
          ) : courses.length === 0 ? (
            <div className="text-center py-16 bg-muted rounded-lg">
              <h2 className="text-xl font-medium mb-2">No Courses Found</h2>
              <p className="text-muted-foreground mb-6">
                You haven't created any courses yet. Get started by creating your first course.
              </p>
              <Button onClick={handleCreateCourse} className="flex items-center gap-2 mx-auto">
                <PlusCircle className="h-4 w-4" />
                Create Your First Course
              </Button>
            </div>
          ) : (
            <CourseList 
              courses={courses} 
              onView={handleViewCourse}
              onEdit={handleEditCourse}
              onDelete={handleDeleteCourse}
              onAssignInstructor={handleAssignInstructor}
              isAdmin={true}
            />
          )}
        </div>
      </main>
      
      <Footer />

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              course and all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminCoursesPage; 