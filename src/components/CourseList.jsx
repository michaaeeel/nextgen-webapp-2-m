
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, Edit, Users, BookOpen, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const CourseList = ({ courses, onEdit, onView }) => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">My Courses</h2>
        <Button onClick={() => navigate('/instructor-dashboard/courses/new')} className="flex items-center gap-2">
          <PlusCircle size={16} />
          Create New Course
        </Button>
      </div>

      {courses.length === 0 ? (
        <Card className="p-6 text-center">
          <p className="text-muted-foreground mb-4">You haven't created any courses yet.</p>
          <Button onClick={() => navigate('/instructor-dashboard/courses/new')}>Create Your First Course</Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {courses.map((course) => (
            <Card key={course.id} className="overflow-hidden">
              <CardHeader className="pb-3">
                <CardTitle className="text-xl font-semibold">{course.title}</CardTitle>
              </CardHeader>
              <CardContent className="pb-3">
                <p className="text-muted-foreground text-sm line-clamp-2 mb-4">{course.description}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge variant="outline" className="flex items-center gap-1">
                    <BookOpen className="h-3 w-3" />
                    {course.modules.length} Modules
                  </Badge>
                  <Badge variant="outline" className="flex items-center gap-1">
                    <FileText className="h-3 w-3" />
                    {course.assignments.length} Assignments
                  </Badge>
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    {course.enrolledStudents?.length || 0} Students
                  </Badge>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between gap-2 pt-3 border-t">
                <Button variant="outline" size="sm" onClick={() => onView(course.id)}>
                  View Details
                </Button>
                <Button variant="secondary" size="sm" onClick={() => onEdit(course.id)} className="flex items-center gap-1">
                  <Edit size={14} />
                  Edit Course
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
