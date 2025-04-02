
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Users, BookOpen, FileText } from "lucide-react";

const DashboardStats = ({ courses }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium">Total Students</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-muted-foreground" />
            <span className="text-3xl font-bold">
              {courses.reduce((total, course) => total + (course.enrolledStudents?.length || 0), 0)}
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-2">Across all your courses</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium">Active Courses</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-muted-foreground" />
            <span className="text-3xl font-bold">{courses.length}</span>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            {courses.length === 0 
              ? 'No courses created yet' 
              : `${courses.length} courses available`}
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium">Total Content</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-muted-foreground" />
            <span className="text-3xl font-bold">
              {courses.reduce((total, course) => {
                const modules = course.modules?.length || 0;
                const assignments = course.assignments?.length || 0;
                return total + modules + assignments;
              }, 0)}
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-2">Modules and assignments</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardStats;
