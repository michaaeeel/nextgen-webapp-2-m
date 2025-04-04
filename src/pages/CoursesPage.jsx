
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCourses } from '@/contexts/CourseContext';
import { useAuth } from "../contexts/AuthContext";
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

const CoursesPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { courses, deleteCourse, loading } = useCourses();
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const { toast } = useToast();

  // Filter courses for the current instructor
  const instructorCourses = React.useMemo(() => {
    return courses.filter(course => course.instructor_id === user?.id);
  }, [courses, user?.id]);

  const handleCreateCourse = () => {
    navigate('/instructor-dashboard/courses/new');
  };

  const handleViewCourse = (courseId) => {
    navigate(`/instructor-dashboard/courses/${courseId}`);
  };

  const handleEditCourse = (courseId) => {
    navigate(`/instructor-dashboard/courses/${courseId}/edit`);
  };

  const handleDeleteCourse = (courseId) => {
    setSelectedCourseId(courseId);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteCourse(selectedCourseId);
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

  // Convert snake_case database fields to camelCase for component props
  const formattedCourses = instructorCourses.map(course => ({
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
  }));

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="py-32">
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">My Courses</h1>
            <Button onClick={handleCreateCourse} className="flex items-center gap-2">
              <PlusCircle className="h-4 w-4" />
              Create Course
            </Button>
          </div>
          
          {loading ? (
            <div className="text-center py-8">Loading courses...</div>
          ) : formattedCourses.length === 0 ? (
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
              courses={formattedCourses} 
              onView={handleViewCourse}
              onEdit={handleEditCourse}
              onDelete={handleDeleteCourse}
              isAdmin={true}
              createUrl='/instructor-dashboard/courses/new'
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

export default CoursesPage;
