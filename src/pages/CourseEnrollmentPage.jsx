import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchCourseById } from '@/services/courseService';
import { enrollInCourse } from '@/services/enrollmentService';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from "sonner";
import { 
  Check, 
  Calendar, 
  Clock, 
  User, 
  BookOpen, 
  Award, 
  ChevronLeft,
  BarChart
} from 'lucide-react';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

const CourseEnrollmentPage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const queryClient = useQueryClient();
  
  const { data: course, isLoading } = useQuery({
    queryKey: ['course', courseId],
    queryFn: () => fetchCourseById(courseId),
    onError: () => {
      toast.error("Failed to load course details");
      navigate('/courses');
    }
  });

  const enrollMutation = useMutation({
    mutationFn: ({ userId, courseId }) => enrollInCourse(userId, courseId),
    onSuccess: (data) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries(['course', courseId]);
      queryClient.invalidateQueries(['enrolledCourses', user?.id]);
      
      toast.success("Successfully enrolled in course!");
      navigate(`/dashboard`);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to enroll in course");
      setIsProcessing(false);
    }
  });

  const handleEnroll = () => {
    if (!isAuthenticated) {
      toast.info("Please sign in to enroll");
      navigate('/signin', { state: { from: `/course-enrollment/${courseId}` } });
      return;
    }

    if (!user?.id) {
      toast.error("User information not available");
      return;
    }

    setIsProcessing(true);
    enrollMutation.mutate({ 
      userId: user.id, 
      courseId 
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="py-16 pt-10">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center py-12">Loading course details...</div>
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
        <main className="py-16 pt-10">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center py-12">
              <h1 className="text-2xl font-bold mb-4">Course Not Found</h1>
              <p className="mb-6">The course you're looking for doesn't exist or has been removed.</p>
              <Button onClick={() => navigate('/courses')}>
                Browse All Courses
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Extract course information
  const {
    title,
    description,
    instructor_name: instructorName,
    price = 99,
    category,
    level,
    modules = [],
    cover_image: coverImage,
    duration = "4 weeks"
  } = course;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="py-16 pt-10">
        <div className="container mx-auto px-4 md:px-6">
          {/* Back navigation */}
          <div className="mb-6">
            <Link to="/courses" className="text-sm flex items-center text-muted-foreground hover:text-foreground transition-colors">
              <ChevronLeft className="h-4 w-4 mr-1" /> Back to all courses
            </Link>
          </div>
          
          {/* Course details */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main content (2/3 width on large screens) */}
            <div className="lg:col-span-2 space-y-8">
              {/* Hero section */}
              <section>
                <h1 className="text-3xl md:text-4xl font-bold mb-4">{title}</h1>
                
                {/* Course metadata */}
                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6">
                  {category && (
                    <Badge variant="secondary" className="capitalize">
                      {category}
                    </Badge>
                  )}
                  {level && (
                    <div className="flex items-center gap-1">
                      <BarChart className="h-4 w-4" />
                      <span className="capitalize">{level} Level</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{duration}</span>
                  </div>
                  {instructorName && (
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      <span>{instructorName}</span>
                    </div>
                  )}
                </div>
                
                {/* Cover image */}
                <div className="relative w-full rounded-xl overflow-hidden mb-6 bg-muted h-64 md:h-96">
                  {coverImage ? (
                    <img 
                      src={coverImage} 
                      alt={title} 
                      className="w-full h-full object-cover" 
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                      No course image available
                    </div>
                  )}
                </div>
              </section>
              
              {/* Course description */}
              <section>
                <h2 className="text-2xl font-bold mb-4">About This Course</h2>
                <p className="text-base text-muted-foreground leading-relaxed">
                  {description || "No description available for this course."}
                </p>
              </section>
              
              {/* What you'll learn */}
              <section>
                <h2 className="text-2xl font-bold mb-4">What You'll Learn</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {/* Generate some mock learning outcomes based on the course title/description */}
                  {[
                    `Master the core concepts of ${title}`,
                    `Apply ${category || 'course'} principles to real-world problems`,
                    `Build comprehensive projects from scratch`,
                    `Understand best practices in ${category || 'this field'}`,
                    `Receive personalized feedback on your work`,
                    `Join a community of like-minded learners`
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-primary mt-0.5" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </section>
              
              {/* Course curriculum preview */}
              <section>
                <h2 className="text-2xl font-bold mb-4">Course Curriculum</h2>
                <div className="space-y-4">
                  {modules && modules.length > 0 ? (
                    modules.slice(0, 3).map((module, index) => (
                      <Card key={index}>
                        <CardContent className="p-4">
                          <h3 className="text-lg font-medium">{module.title}</h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            {module.description || "No description available"}
                          </p>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <p className="text-muted-foreground">
                      Curriculum details will be available soon.
                    </p>
                  )}
                  
                  {modules && modules.length > 3 && (
                    <p className="text-sm text-muted-foreground">
                      + {modules.length - 3} more modules available after enrollment
                    </p>
                  )}
                </div>
              </section>
              
              {/* Instructor information */}
              <section>
                <h2 className="text-2xl font-bold mb-4">Your Instructor</h2>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row items-start gap-4">
                      <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center">
                        <User className="h-10 w-10 text-muted-foreground" />
                      </div>
                      <div>
                        <h3 className="text-xl font-medium">{instructorName || "Course Instructor"}</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {category || "Subject"} Expert with 5+ years of teaching experience
                        </p>
                        <p className="mt-4 text-sm leading-relaxed">
                          Our instructor is passionate about teaching and has helped hundreds of students master {category || "this subject"}. 
                          With extensive industry experience, they bring real-world examples and practical knowledge to help you succeed.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </section>
            </div>
            
            {/* Sidebar - Enrollment card (1/3 width on large screens) */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <Card className="overflow-hidden">
                  <CardContent className="p-0">
                    {/* Pricing section */}
                    <div className="p-6 bg-primary/5">
                      <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-bold">${price}</span>
                        {/* Optional: Show original price if there's a discount */}
                        <span className="text-muted-foreground line-through">${Math.round(price * 1.3)}</span>
                        <span className="bg-primary/15 text-primary px-2 py-0.5 rounded-full text-xs font-medium">
                          30% off
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">Limited time offer</p>
                    </div>
                    
                    {/* Call to action */}
                    <div className="p-6 space-y-4">
                      <Button 
                        className="w-full py-6 text-lg" 
                        onClick={handleEnroll}
                        disabled={isProcessing}
                      >
                        {isProcessing ? "Processing..." : "Enroll Now"}
                      </Button>
                      
                      <p className="text-xs text-center text-muted-foreground">
                        30-day money-back guarantee, no questions asked
                      </p>
                    </div>
                    
                    <Separator />
                    
                    {/* Course includes */}
                    <div className="p-6 space-y-3">
                      <h4 className="font-medium">This course includes:</h4>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-center gap-2">
                          <BookOpen className="h-4 w-4 text-muted-foreground" />
                          <span>{modules?.length || 5} modules with detailed lessons</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span>{duration} of content</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span>Lifetime access</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Award className="h-4 w-4 text-muted-foreground" />
                          <span>Certificate of completion</span>
                        </li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default CourseEnrollmentPage;
