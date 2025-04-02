
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";

const CoursePerformance = ({ courses, handleCreateCourse }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Course Performance</CardTitle>
        <CardDescription>Student enrollment across your courses</CardDescription>
      </CardHeader>
      <CardContent>
        {courses.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-muted-foreground mb-4">You haven't created any courses yet.</p>
            <Button onClick={handleCreateCourse}>Create Your First Course</Button>
          </div>
        ) : (
          <div className="space-y-6">
            {courses.map((course) => (
              <div key={course.id} className="space-y-2">
                <div className="flex justify-between">
                  <span className="font-medium">{course.title}</span>
                  <span className="text-muted-foreground text-sm">
                    {course.enrolledStudents?.length || 0} students
                  </span>
                </div>
                <Progress value={(course.enrolledStudents?.length || 0) * 10} className="h-2" />
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CoursePerformance;
