
import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchAllCourses } from "@/services/courseService";
import { enrollInCourse } from "@/services/enrollmentService";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useDisclosure } from "@/hooks/use-disclosure";
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

const CoursesAndPricing = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedCourse, setSelectedCourse] = React.useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Fetch published courses
  const { data: courses = [], isLoading } = useQuery({
    queryKey: ['publishedCourses'],
    queryFn: async () => {
      const allCourses = await fetchAllCourses();
      return allCourses.filter(course => course.is_published);
    },
  });

  // Enroll mutation
  const enrollMutation = useMutation({
    mutationFn: ({ userId, courseId }) => enrollInCourse(userId, courseId),
    onSuccess: () => {
      // Invalidate enrolled courses query
      queryClient.invalidateQueries(['enrolledCourses', user?.id]);
      toast({
        title: "Enrollment Successful",
        description: "You have successfully enrolled in the course.",
      });
      // In a real app, this would redirect to Stripe
      // For now, we'll just close the dialog
      onClose();
    },
    onError: (error) => {
      toast({
        title: "Enrollment Failed",
        description: error.message || "There was an error enrolling in the course.",
        variant: "destructive",
      });
    },
  });

  const handleEnrollClick = (course) => {
    if (!isAuthenticated) {
      // Redirect to sign in if not authenticated
      navigate("/signin", { state: { from: "/courses" } });
      return;
    }

    // Set the selected course and open confirmation dialog
    setSelectedCourse(course);
    onOpen();
  };

  const confirmEnrollment = () => {
    if (!selectedCourse || !user) return;
    
    enrollMutation.mutate({ 
      userId: user.id, 
      courseId: selectedCourse.id 
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow py-16 px-6">
        <div className="container mx-auto max-w-6xl">
          <h1 className="text-3xl md:text-4xl font-bold mb-10 text-left">
            Courses and Pricing
          </h1>
          
          {isLoading ? (
            <div className="text-center py-10">Loading courses...</div>
          ) : courses.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-xl text-muted-foreground">No courses available at the moment.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
                <Card key={course.id} className="flex flex-col overflow-hidden h-full">
                  <div className="w-full h-40 bg-gray-100 overflow-hidden">
                    {course.cover_image ? (
                      <img 
                        src={course.cover_image} 
                        alt={course.title} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        No image
                      </div>
                    )}
                  </div>
                  
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xl font-semibold line-clamp-1">
                      {course.title}
                    </CardTitle>
                    {course.instructor_name && (
                      <p className="text-sm text-muted-foreground">
                        Instructor: {course.instructor_name}
                      </p>
                    )}
                  </CardHeader>
                  
                  <CardContent className="pb-4 flex-grow">
                    <p className="text-muted-foreground text-sm line-clamp-3 mb-4">
                      {course.description}
                    </p>
                    
                    <div className="flex flex-wrap gap-2 mt-2">
                      {course.category && (
                        <Badge variant="secondary" className="capitalize">
                          {course.category}
                        </Badge>
                      )}
                      {course.level && (
                        <Badge variant="outline" className="capitalize">
                          {course.level}
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                  
                  <CardFooter className="pt-2 border-t">
                    <div className="w-full flex justify-between items-center">
                      <span className="text-xl font-bold">
                        ${course.price || 99}
                      </span>
                      <Button 
                        onClick={() => handleEnrollClick(course)}
                        disabled={enrollMutation.isPending}
                      >
                        {enrollMutation.isPending ? "Enrolling..." : "Enroll Now"}
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
      
      {/* Enrollment Confirmation Dialog */}
      <AlertDialog open={isOpen} onOpenChange={onClose}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Enrollment</AlertDialogTitle>
            <AlertDialogDescription>
              {selectedCourse && (
                <>
                  Are you sure you want to enroll in <strong>{selectedCourse.title}</strong>?
                  <p className="mt-2">
                    Price: ${selectedCourse.price || 99}
                  </p>
                  <p className="mt-4 text-sm text-muted-foreground">
                    Note: This is a demo. In a production environment, this would redirect to a payment page.
                  </p>
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmEnrollment}>
              {enrollMutation.isPending ? "Processing..." : "Confirm Enrollment"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default CoursesAndPricing;
