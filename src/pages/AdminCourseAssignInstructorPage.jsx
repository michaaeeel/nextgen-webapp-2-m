import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCourses } from '@/contexts/CourseContext';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from '@/components/ui/label';
import { ChevronLeft, UserCheck } from "lucide-react";

const AdminCourseAssignInstructorPage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { getCourse, assignInstructor, loading } = useCourses();
  const { getAllUsers } = useAuth();
  const [course, setCourse] = useState(null);
  const [instructors, setInstructors] = useState([]);
  const [selectedInstructorId, setSelectedInstructorId] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    if (!loading) {
      const courseData = getCourse(courseId);
      if (courseData) {
        setCourse(courseData);
        setSelectedInstructorId(courseData.instructorId || '');
      } else {
        toast({
          title: "Error",
          description: "Course not found",
          variant: "destructive"
        });
        navigate('/admin-dashboard/courses');
      }

      // Get all instructors
      const users = getAllUsers();
      const instructorUsers = users.filter(user => user.role === 'instructor');
      setInstructors(instructorUsers);
    }
  }, [courseId, getCourse, getAllUsers, loading, navigate, toast]);

  const handleAssign = () => {
    try {
      assignInstructor(courseId, selectedInstructorId);
      
      toast({
        title: "Success",
        description: "Instructor assigned successfully!",
      });
      
      navigate(`/admin-dashboard/courses/${courseId}`);
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to assign instructor",
        variant: "destructive"
      });
    }
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
            <Button 
              onClick={() => navigate('/admin-dashboard/courses')}
            >
              Back to Courses
            </Button>
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
            <Button 
              variant="ghost" 
              className="mb-6 flex items-center"
              onClick={() => navigate(`/admin-dashboard/courses/${courseId}`)}
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back to Course
            </Button>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl font-bold">Assign Instructor</CardTitle>
                <CardDescription>
                  Assign an instructor to "{course.title}"
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="instructor">Select Instructor</Label>
                    <Select 
                      value={selectedInstructorId} 
                      onValueChange={setSelectedInstructorId}
                    >
                      <SelectTrigger id="instructor" className="w-full">
                        <SelectValue placeholder="Select an instructor" />
                      </SelectTrigger>
                      <SelectContent>
                        {instructors.length > 0 ? (
                          instructors.map(instructor => (
                            <SelectItem key={instructor.id} value={instructor.id}>
                              {instructor.name} ({instructor.email})
                            </SelectItem>
                          ))
                        ) : (
                          <SelectItem value="none" disabled>No instructors available</SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex justify-end space-x-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => navigate(`/admin-dashboard/courses/${courseId}`)}
                    >
                      Cancel
                    </Button>
                    <Button 
                      disabled={!selectedInstructorId}
                      onClick={handleAssign}
                      className="flex items-center gap-2"
                    >
                      <UserCheck className="h-4 w-4" />
                      Assign Instructor
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default AdminCourseAssignInstructorPage; 