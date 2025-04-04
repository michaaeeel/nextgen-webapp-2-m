
import React from 'react';
import { useParams, Navigate, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchCourseById } from '@/services/courseService';
import { useAuth } from "@/contexts/AuthContext";
import { useRBAC } from "@/contexts/RBACContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { BookOpen, FileText, Calendar, Clock, Award, ArrowLeft } from "lucide-react";

const StudentCourseViewPage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { userRole } = useRBAC();
  
  // Redirect non-students to their proper dashboard
  if (userRole === 'admin') {
    return <Navigate to="/admin-dashboard" />;
  } else if (userRole === 'instructor') {
    return <Navigate to="/instructor-dashboard" />;
  }
  
  // Fetch course data
  const { data: course, isLoading } = useQuery({
    queryKey: ['course', courseId],
    queryFn: () => fetchCourseById(courseId),
    enabled: !!courseId,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="py-32">
          <div className="container mx-auto px-6 text-center">
            <p>Loading course content...</p>
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
              onClick={() => navigate('/dashboard')}
              className="px-4 py-2 bg-primary text-white rounded-md"
            >
              Back to Dashboard
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
          <div className="max-w-5xl mx-auto">
            {/* Back Button */}
            <Button 
              variant="ghost" 
              onClick={() => navigate('/dashboard')} 
              className="mb-4 flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Button>
            
            {/* Course Header */}
            <div className="mb-8">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                <h1 className="text-3xl font-bold">{course.title}</h1>
                <div className="flex items-center gap-2 mt-2 md:mt-0">
                  {course.level && (
                    <Badge variant="outline" className="capitalize">
                      {course.level}
                    </Badge>
                  )}
                  {course.category && (
                    <Badge variant="secondary" className="capitalize">
                      {course.category}
                    </Badge>
                  )}
                </div>
              </div>
              
              <p className="text-muted-foreground">
                Instructor: {course.instructor_name || 'No instructor assigned'}
              </p>
            </div>
            
            {/* Course Cover Image */}
            {course.cover_image && (
              <div className="mb-8 rounded-lg overflow-hidden">
                <img 
                  src={course.cover_image} 
                  alt={course.title} 
                  className="w-full h-64 object-cover"
                />
              </div>
            )}
            
            {/* Course Description */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>About This Course</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{course.description}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-primary" />
                    <span>{course.modules?.length || 0} Modules</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    <span>{course.assignments?.length || 0} Assignments</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-primary" />
                    <span>Self-paced</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-primary" />
                    <span>Certificate on completion</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Course Content */}
            <Tabs defaultValue="modules">
              <TabsList className="w-full mb-6">
                <TabsTrigger value="modules" className="flex-1">Modules</TabsTrigger>
                <TabsTrigger value="assignments" className="flex-1">Assignments</TabsTrigger>
                <TabsTrigger value="resources" className="flex-1">Resources</TabsTrigger>
              </TabsList>
              
              {/* Modules Tab */}
              <TabsContent value="modules">
                <Card>
                  <CardHeader>
                    <CardTitle>Course Modules</CardTitle>
                    <CardDescription>
                      Work through these modules to learn the course material.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {!course.modules || course.modules.length === 0 ? (
                      <p className="text-center py-8 text-muted-foreground">
                        No modules available yet for this course.
                      </p>
                    ) : (
                      <div className="space-y-4">
                        {course.modules.map((module, index) => (
                          <div key={index} className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="font-medium">{index + 1}. {module.title}</h3>
                                <p className="text-sm text-muted-foreground mt-1">
                                  {module.description}
                                </p>
                              </div>
                              {module.video_url && (
                                <Button size="sm" variant="outline">
                                  Watch Video
                                </Button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* Assignments Tab */}
              <TabsContent value="assignments">
                <Card>
                  <CardHeader>
                    <CardTitle>Course Assignments</CardTitle>
                    <CardDescription>
                      Complete these assignments to test your knowledge.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {!course.assignments || course.assignments.length === 0 ? (
                      <p className="text-center py-8 text-muted-foreground">
                        No assignments available yet for this course.
                      </p>
                    ) : (
                      <div className="space-y-4">
                        {course.assignments.map((assignment, index) => (
                          <div key={index} className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="font-medium">{assignment.title}</h3>
                                <p className="text-sm text-muted-foreground mt-1">
                                  {assignment.description}
                                </p>
                                {assignment.due_date && (
                                  <div className="flex items-center gap-1 text-sm text-orange-600 mt-2">
                                    <Calendar className="h-3 w-3" />
                                    Due: {new Date(assignment.due_date).toLocaleDateString()}
                                  </div>
                                )}
                              </div>
                              <Button size="sm">
                                View Assignment
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* Resources Tab */}
              <TabsContent value="resources">
                <Card>
                  <CardHeader>
                    <CardTitle>Course Resources</CardTitle>
                    <CardDescription>
                      Additional materials to help you succeed in this course.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-center py-8 text-muted-foreground">
                      No additional resources available yet for this course.
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default StudentCourseViewPage;
