
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import { useNavigate } from "react-router-dom";

const CoursesList = ({ courses, handleCreateCourse }) => {
  const navigate = useNavigate();
  
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>My Courses</CardTitle>
            <CardDescription>Manage your current courses and create new ones</CardDescription>
          </div>
          <Button onClick={() => navigate('/instructor-dashboard/courses')} variant="outline">
            View All Courses
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {courses.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-muted-foreground mb-4">You haven't created any courses yet.</p>
            <Button onClick={handleCreateCourse}>Create Your First Course</Button>
          </div>
        ) : (
          <div className="space-y-6">
            {courses.slice(0, 3).map((course) => (
              <div key={course.id} className="p-4 border rounded-lg flex justify-between items-center">
                <div>
                  <h3 className="font-medium">{course.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {course.enrolledStudents?.length || 0} enrolled students
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => navigate(`/instructor-dashboard/courses/${course.id}`)}
                  >
                    View
                  </Button>
                  <Button 
                    variant="secondary" 
                    size="sm" 
                    onClick={() => navigate(`/instructor-dashboard/courses/${course.id}/edit`)}
                    className="flex items-center gap-1"
                  >
                    <Edit size={14} />
                    Edit
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full" 
          onClick={handleCreateCourse}
        >
          Create New Course
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CoursesList;
