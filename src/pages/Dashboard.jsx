import React, { useState, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getEnrolledCourses, unenrollFromCourse } from "@/services/enrollmentService";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, FileText, AlertTriangle } from "lucide-react";
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
import { useRBAC } from "@/contexts/RBACContext";
import { getUserProfile } from "@/lib/supabase/users";

const Dashboard = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { userRole } = useRBAC();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedEnrollment, setSelectedEnrollment] = React.useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [profile, setProfile] = useState(null);

  // Add this useEffect to fetch profile data
  useEffect(() => {
    if (user?.id) {
      getUserProfile(user.id)
        .then(data => setProfile(data))
        .catch(error => console.error('Error fetching profile:', error));
    }
  }, [user?.id]);

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/signin" />;
  }

  // Redirect instructors to their dashboard
  if (userRole === "instructor") {
    return <Navigate to="/instructor-dashboard" />;
  }

  // Fetch enrolled courses
  const { 
    data: enrolledCourses = [], 
    isLoading 
  } = useQuery({
    queryKey: ['enrolledCourses', user.id],
    queryFn: () => getEnrolledCourses(user.id),
    enabled: !!user?.id
  });

  // Unenroll mutation
  const unenrollMutation = useMutation({
    mutationFn: (enrollmentId) => unenrollFromCourse(enrollmentId),
    onSuccess: () => {
      // Invalidate enrolled courses query
      queryClient.invalidateQueries(['enrolledCourses', user?.id]);
      toast({
        title: "Unenrolled Successfully",
        description: "You have been unenrolled from the course.",
      });
      onClose();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "There was an error unenrolling from the course.",
        variant: "destructive",
      });
    },
  });

  const handleUnenrollClick = (enrollment) => {
    setSelectedEnrollment(enrollment);
    onOpen();
  };

  const confirmUnenrollment = () => {
    if (!selectedEnrollment) return;
    unenrollMutation.mutate(selectedEnrollment.enrollmentId);
  };

  console.log({
    authUser: user,  // from useAuth()
    rbacRole: user.role, // from useAuth()
    profile: user?.user_metadata  // from auth user
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="py-32">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold">
                Welcome, {profile ? profile.first_name : 'User'}
              </h1>
              <button 
                onClick={logout}
                className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80 transition-colors"
              >
                Sign Out
              </button>
            </div>
            
            <div className="bg-card rounded-lg shadow-elegant p-8 mb-8">
              <h2 className="text-2xl font-semibold mb-4">Your Courses</h2>
              
              {isLoading ? (
                <div className="text-center py-4">Loading your courses...</div>
              ) : enrolledCourses.length === 0 ? (
                <div>
                  <p className="text-muted-foreground mb-4">You are not enrolled in any courses yet.</p>
                  <Button 
                    onClick={() => navigate("/courses")} 
                    className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
                  >
                    Browse Courses
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {enrolledCourses.map((course) => (
                    <Card key={course.id} className="overflow-hidden">
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
                      
                      <CardContent className="pb-3">
                        <p className="text-muted-foreground text-sm line-clamp-2 mb-4">
                          {course.description}
                        </p>
                        
                        <div className="flex flex-wrap gap-2 mb-2">
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
                        
                        <div className="flex flex-wrap gap-2 mt-3">
                          <Badge variant="outline" className="flex items-center gap-1">
                            <BookOpen className="h-3 w-3" />
                            {course.modules?.length || 0} Modules
                          </Badge>
                          <Badge variant="outline" className="flex items-center gap-1">
                            <FileText className="h-3 w-3" />
                            {course.assignments?.length || 0} Assignments
                          </Badge>
                        </div>
                      </CardContent>
                      
                      <CardFooter className="pt-2 border-t flex justify-between">
                        <Button 
                          variant="outline" 
                          className="w-3/4"
                          onClick={() => navigate(`/courses/${course.id}`)}
                        >
                          Go to Course
                        </Button>
                        <Button 
                          variant="ghost" 
                          className="text-destructive"
                          onClick={() => handleUnenrollClick(course)}
                        >
                          <AlertTriangle className="h-4 w-4" />
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
            </div>
            
            <div className="bg-card rounded-lg shadow-elegant p-8">
              <h2 className="text-2xl font-semibold mb-4">Account Information</h2>
              <div className="space-y-4">
                <div>
                  <span className="text-muted-foreground">Name:</span>
                  <span className="ml-2">
                    {profile ? `${profile.first_name} ${profile.last_name}` : 'Loading...'}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">Email:</span>
                  <span className="ml-2">{profile?.email || user?.email}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Role:</span>
                  <span className="ml-2 capitalize">{userRole}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
      
      {/* Unenrollment Confirmation Dialog */}
      <AlertDialog open={isOpen} onOpenChange={onClose}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Unenrollment</AlertDialogTitle>
            <AlertDialogDescription>
              {selectedEnrollment && (
                <>
                  Are you sure you want to unenroll from <strong>{selectedEnrollment.title}</strong>?
                  <p className="mt-4 text-sm text-muted-foreground">
                    This action cannot be undone. You will need to enroll again if you change your mind.
                  </p>
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmUnenrollment}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {unenrollMutation.isPending ? "Processing..." : "Unenroll"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Dashboard;
