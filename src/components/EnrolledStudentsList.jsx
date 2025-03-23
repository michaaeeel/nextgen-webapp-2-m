
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { getEnrolledStudents } from "@/services/enrollmentService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarIcon, UserIcon } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

const EnrolledStudentsList = ({ courseId }) => {
  const { 
    data: students = [],
    isLoading,
    error
  } = useQuery({
    queryKey: ['enrolledStudents', courseId],
    queryFn: () => getEnrolledStudents(courseId),
    enabled: !!courseId
  });

  if (isLoading) {
    return <div className="text-center py-4">Loading enrolled students...</div>;
  }

  if (error) {
    return <div className="text-destructive text-center py-4">Error loading students: {error.message}</div>;
  }

  if (students.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Enrolled Students</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-muted-foreground text-center py-4">
            No students enrolled yet.
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Enrolled Students ({students.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {students.map((student) => (
            <div 
              key={student.id} 
              className="p-4 border rounded-md flex justify-between items-center"
            >
              <div className="flex items-center">
                <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center mr-3">
                  <UserIcon className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-medium">
                    {student.first_name} {student.last_name}
                  </h4>
                  <p className="text-sm text-muted-foreground">{student.email}</p>
                </div>
              </div>
              <div className="text-sm text-muted-foreground flex items-center">
                <CalendarIcon className="h-4 w-4 mr-1" />
                <span>Enrolled {formatDistanceToNow(new Date(student.enrolledAt))} ago</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default EnrolledStudentsList;
