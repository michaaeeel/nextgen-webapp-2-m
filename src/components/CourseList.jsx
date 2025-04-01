
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, BookOpen, Users, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import CourseOperations from './CourseOperations';

const CourseList = ({ 
  courses, 
  onView, 
  onEdit, 
  onDelete,
  isAdmin = false,
  createUrl = '/instructor-dashboard/courses/new'
}) => {
  const navigate = useNavigate();

  const handleCreateCourse = () => {
    navigate(createUrl);
  };

  // Remove the helper function that extracts first name since we now want to display full name
  
  return (
    <div className="space-y-6">
      {courses.length === 0 ? (
        <div className="text-center py-16 bg-muted rounded-lg">
          <h2 className="text-xl font-medium mb-2">No Courses Found</h2>
          <p className="text-muted-foreground mb-6">
            {isAdmin 
              ? "No courses have been created yet." 
              : "You haven't created any courses yet."}
          </p>
          <Button onClick={handleCreateCourse} className="flex items-center gap-2 mx-auto">
            <PlusCircle className="h-4 w-4" />
            Create {isAdmin ? "First Course" : "Your First Course"}
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <Card key={course.id} className="overflow-hidden">
              <div className="w-full h-40 bg-gray-100 overflow-hidden">
                {course.coverImage ? (
                  <img 
                    src={course.coverImage} 
                    alt={course.title} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    No image
                  </div>
                )}
              </div>
              
              <CardHeader className="pb-2 flex flex-row justify-between items-start">
                <div>
                  <CardTitle className="text-xl font-semibold line-clamp-1">{course.title}</CardTitle>
                  {isAdmin && course.instructorName && (
                    <p className="text-sm text-muted-foreground">
                      Instructor: {course.instructorName}
                    </p>
                  )}
                </div>
                <CourseOperations 
                  courseId={course.id}
                  onView={onView}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  isAdmin={isAdmin}
                />
              </CardHeader>
              
              <CardContent className="pb-3">
                <p className="text-muted-foreground text-sm line-clamp-2 mb-4">{course.description}</p>
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
                  <Badge 
                    variant={course.isPublished ? "success" : "secondary"}
                    className={course.isPublished ? "bg-green-500 hover:bg-green-600" : ""}
                  >
                    {course.isPublished ? "Published" : "Draft"}
                  </Badge>
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
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    {course.enrolledStudents?.length || 0} Students
                  </Badge>
                </div>
              </CardContent>
              
              <CardFooter className="pt-2 border-t">
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => onView(course.id)}
                >
                  View Details
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default CourseList;
