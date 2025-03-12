
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Edit, ChevronLeft, User, Calendar, BookOpen, FileText } from "lucide-react";

const CourseDetail = ({ course, onEdit }) => {
  const navigate = useNavigate();

  if (!course) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Course not found</p>
        <Button className="mt-4" onClick={() => navigate('/instructor-dashboard/courses')}>
          Back to Courses
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => navigate('/instructor-dashboard/courses')}>
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">{course.title}</h1>
        </div>
        <Button onClick={() => onEdit(course.id)} className="flex items-center gap-2">
          <Edit size={16} />
          Edit Course
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Course Overview</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-1">Description</h3>
            <p>{course.description}</p>
          </div>
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{course.instructorName}</span>
            </div>
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{course.modules.length} Modules</span>
            </div>
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{course.assignments.length} Assignments</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">Created {new Date(course.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="modules">
        <TabsList>
          <TabsTrigger value="modules">Modules</TabsTrigger>
          <TabsTrigger value="assignments">Assignments</TabsTrigger>
          <TabsTrigger value="students">Enrolled Students</TabsTrigger>
        </TabsList>
        
        <TabsContent value="modules" className="space-y-4 mt-4">
          {course.modules.length === 0 ? (
            <Card className="p-6">
              <p className="text-muted-foreground text-center">No modules have been added to this course yet.</p>
            </Card>
          ) : (
            course.modules.map((module, index) => (
              <Card key={index}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">
                    Module {index + 1}: {module.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-2">{module.description}</p>
                  {module.lessons && module.lessons.length > 0 ? (
                    <div className="mt-4">
                      <h4 className="text-sm font-medium mb-2">Lessons:</h4>
                      <ul className="space-y-1 pl-4">
                        {module.lessons.map((lesson, idx) => (
                          <li key={idx} className="text-sm">{lesson.title}</li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
        
        <TabsContent value="assignments" className="space-y-4 mt-4">
          {course.assignments.length === 0 ? (
            <Card className="p-6">
              <p className="text-muted-foreground text-center">No assignments have been added to this course yet.</p>
            </Card>
          ) : (
            course.assignments.map((assignment, index) => (
              <Card key={index}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{assignment.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-2">{assignment.description}</p>
                  {assignment.dueDate && (
                    <div className="flex items-center gap-2 mt-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Due: {new Date(assignment.dueDate).toLocaleDateString()}</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
        
        <TabsContent value="students" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Enrolled Students</CardTitle>
            </CardHeader>
            <CardContent>
              {course.enrolledStudents && course.enrolledStudents.length > 0 ? (
                <ul className="divide-y">
                  {course.enrolledStudents.map((student, index) => (
                    <li key={index} className="py-3 flex justify-between items-center">
                      <div>
                        <p className="font-medium">{student.name}</p>
                        <p className="text-sm text-muted-foreground">{student.email}</p>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Enrolled on {new Date(student.enrolledAt).toLocaleDateString()}
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted-foreground text-center py-6">No students are enrolled in this course yet.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CourseDetail;
