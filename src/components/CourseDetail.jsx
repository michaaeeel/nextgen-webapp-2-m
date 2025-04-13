
import React from "react";
import { useCourses } from "@/contexts/CourseContext";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
import CourseModulesSection from "./CourseModulesSection";
import CourseAssignmentsSection from "./CourseAssignmentsSection";
import EnrolledStudentsList from "./EnrolledStudentsList";
import { useQuery } from "@tanstack/react-query";
import { getEnrolledStudents } from "@/services/enrollmentService";

const CourseDetail = ({ courseId, isAdmin = false }) => {
  const { getCourse, toggleCoursePublishStatus, deleteCourse } = useCourses();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = React.useState("overview");
  const [isDeleting, setIsDeleting] = React.useState(false);
  
  const course = getCourse(courseId);
  
  // Get enrolled students count
  const { data: enrolledStudents = [] } = useQuery({
    queryKey: ['enrolledStudents', courseId],
    queryFn: () => getEnrolledStudents(courseId),
    enabled: !!courseId
  });
  
  if (!course) {
    return <div>Loading course details...</div>;
  }

  const handleEdit = () => {
    if (isAdmin) {
      navigate(`/admin-dashboard/courses/${courseId}/edit`);
    } else {
      navigate(`/instructor-dashboard/courses/${courseId}/edit`);
    }
  };

  const handleTogglePublish = async () => {
    try {
      await toggleCoursePublishStatus(courseId);
      toast({
        title: course.is_published ? "Course Unpublished" : "Course Published",
        description: `The course is now ${course.is_published ? 'unpublished' : 'published'}.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "There was an error updating the course status.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this course? This action cannot be undone.")) {
      return;
    }
    
    setIsDeleting(true);
    
    try {
      await deleteCourse(courseId);
      toast({
        title: "Course Deleted",
        description: "The course has been deleted successfully.",
      });
      if (isAdmin) {
        navigate('/admin-dashboard/courses');
      } else {
        navigate('/instructor-dashboard/courses');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "There was an error deleting the course.",
        variant: "destructive",
      });
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Course header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">{course.title}</h1>
          {course.instructor_name && isAdmin && (
            <p className="text-muted-foreground mt-1">
              Instructor: {course.instructor_name}
            </p>
          )}
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={handleEdit}>
            Edit Course
          </Button>
          
          <Button 
            variant={course.is_published ? "default" : "secondary"}
            onClick={handleTogglePublish}
          >
            {course.is_published ? "Unpublish" : "Publish"}
          </Button>
          
          <Button 
            variant="destructive" 
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete Course"}
          </Button>
        </div>
      </div>
      
      {/* Course tabs */}
      <Tabs 
        defaultValue="overview" 
        value={activeTab} 
        onValueChange={setActiveTab} 
        className="space-y-4"
      >
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="modules">Modules</TabsTrigger>
          <TabsTrigger value="assignments">Assignments</TabsTrigger>
          <TabsTrigger value="students">Students ({enrolledStudents.length})</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-4">
              <div className="p-6 bg-card rounded-lg border">
                <h2 className="text-xl font-semibold mb-2">Description</h2>
                <p className="text-muted-foreground">
                  {course.description || "No description provided."}
                </p>
              </div>
              
              {course.learning_objectives && (
                <div className="p-6 bg-card rounded-lg border">
                  <h2 className="text-xl font-semibold mb-2">Learning Objectives</h2>
                  <div className="text-muted-foreground">
                    {course.learning_objectives}
                  </div>
                </div>
              )}
            </div>
            
            <div className="space-y-4">
              <div className="p-6 bg-card rounded-lg border">
                <h2 className="text-xl font-semibold mb-2">Course Details</h2>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Level:</span>
                    <span className="font-medium capitalize">{course.level || "Not specified"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Category:</span>
                    <span className="font-medium capitalize">{course.category || "Not specified"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Duration:</span>
                    <span className="font-medium">{course.duration || "Not specified"}</span>
                  </div>
                  {course.price !== undefined && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Price:</span>
                      <span className="font-medium">${course.price}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Status:</span>
                    <span className={`font-medium ${course.is_published ? "text-green-600" : "text-amber-600"}`}>
                      {course.is_published ? "Published" : "Draft"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="modules">
          <CourseModulesSection 
            courseId={courseId} 
            modules={course.modules || []} 
            isEditable={false}
          />
        </TabsContent>
        
        <TabsContent value="assignments">
          <CourseAssignmentsSection 
            courseId={courseId} 
            assignments={course.assignments || []} 
            isEditable={false}
          />
        </TabsContent>
        
        <TabsContent value="students">
          <EnrolledStudentsList courseId={courseId} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CourseDetail;
