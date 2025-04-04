
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchCourseById } from '@/services/courseService';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { ArrowLeft, BookOpen, FileText, Clock } from 'lucide-react';
import { format } from 'date-fns';

const StudentCourseViewPage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
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
          <div className="container mx-auto px-6">
            <div className="max-w-6xl mx-auto">
              <div className="text-center py-12">Loading course...</div>
            </div>
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
          <div className="container mx-auto px-6">
            <div className="max-w-6xl mx-auto">
              <div className="text-center py-12">
                <h2 className="text-2xl font-bold mb-4">Course Not Found</h2>
                <p className="mb-6">The course you're looking for doesn't exist or you don't have access.</p>
                <Button onClick={() => navigate('/dashboard')}>
                  Return to Dashboard
                </Button>
              </div>
            </div>
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
          <div className="max-w-6xl mx-auto">
            {/* Navigation */}
            <div className="mb-8">
              <Button 
                variant="ghost" 
                className="flex items-center gap-2"
                onClick={() => navigate('/dashboard')}
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Dashboard
              </Button>
            </div>
            
            {/* Course Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-4">{course.title}</h1>
              
              <div className="flex flex-wrap gap-3 mb-6">
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
              
              <div className="flex flex-col md:flex-row md:items-center gap-4 text-muted-foreground mb-6">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  <span>{course.modules?.length || 0} Modules</span>
                </div>
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  <span>{course.assignments?.length || 0} Assignments</span>
                </div>
                {course.instructor_name && (
                  <div>
                    <span className="font-medium">Instructor:</span> {course.instructor_name}
                  </div>
                )}
              </div>
              
              <p className="text-lg">{course.description}</p>
            </div>
            
            {/* Course Content */}
            <Tabs defaultValue="modules" className="mt-8">
              <TabsList className="w-full md:w-auto">
                <TabsTrigger value="modules">Course Content</TabsTrigger>
                <TabsTrigger value="assignments">Assignments</TabsTrigger>
                <TabsTrigger value="resources">Resources</TabsTrigger>
              </TabsList>
              
              {/* Modules Tab */}
              <TabsContent value="modules" className="mt-6">
                <h2 className="text-2xl font-semibold mb-4">Course Modules</h2>
                
                {!course.modules || course.modules.length === 0 ? (
                  <div className="bg-muted p-6 rounded-lg text-center">
                    <p>No modules available for this course yet.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {course.modules.map((module, index) => (
                      <Card key={index}>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-xl">
                            Module {index + 1}: {module.title}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-muted-foreground mb-3">{module.description}</p>
                          
                          {module.content && (
                            <div className="mt-4">
                              <h4 className="font-medium mb-2">Content:</h4>
                              <div className="text-sm text-muted-foreground">{module.content}</div>
                            </div>
                          )}
                          
                          {module.video_url && (
                            <div className="mt-4">
                              <h4 className="font-medium mb-2">Video:</h4>
                              <div className="aspect-video rounded-md overflow-hidden bg-black">
                                <iframe
                                  width="100%"
                                  height="100%"
                                  src={module.video_url}
                                  title={module.title}
                                  frameBorder="0"
                                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                  allowFullScreen
                                ></iframe>
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>
              
              {/* Assignments Tab */}
              <TabsContent value="assignments" className="mt-6">
                <h2 className="text-2xl font-semibold mb-4">Assignments</h2>
                
                {!course.assignments || course.assignments.length === 0 ? (
                  <div className="bg-muted p-6 rounded-lg text-center">
                    <p>No assignments available for this course yet.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {course.assignments.map((assignment, index) => (
                      <Card key={index}>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-xl">
                            {assignment.title}
                          </CardTitle>
                          {assignment.due_date && (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Clock className="h-4 w-4" />
                              <span>Due: {format(new Date(assignment.due_date), 'PPP')}</span>
                            </div>
                          )}
                        </CardHeader>
                        <CardContent>
                          <p className="text-muted-foreground mb-4">{assignment.description}</p>
                          <Button>Submit Assignment</Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>
              
              {/* Resources Tab */}
              <TabsContent value="resources" className="mt-6">
                <h2 className="text-2xl font-semibold mb-4">Course Resources</h2>
                
                {!course.resources || course.resources.length === 0 ? (
                  <div className="bg-muted p-6 rounded-lg text-center">
                    <p>No additional resources available for this course yet.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {course.resources.map((resource, index) => (
                      <Card key={index}>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg">{resource.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-muted-foreground mb-3">{resource.description}</p>
                          {resource.url && (
                            <Button variant="outline" asChild>
                              <a href={resource.url} target="_blank" rel="noopener noreferrer">
                                Access Resource
                              </a>
                            </Button>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
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
