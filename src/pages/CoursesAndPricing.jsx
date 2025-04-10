
import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { fetchAllCourses } from "@/services/courseService";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const CoursesAndPricing = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Fetch published courses
  const { data: courses = [], isLoading } = useQuery({
    queryKey: ['publishedCourses'],
    queryFn: async () => {
      const allCourses = await fetchAllCourses();
      return allCourses.filter(course => course.is_published);
    },
  });

  const handleEnrollClick = (course) => {
    // Navigate to the course enrollment page
    navigate(`/course-enrollment/${course.id}`);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow py-16 px-6">
        <div className="container mx-auto max-w-6xl">
          <h1 className="text-3xl md:text-4xl font-bold mb-10 text-left pt-10">
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
                      >
                        Enroll Now
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
    </div>
  );
};

export default CoursesAndPricing;
