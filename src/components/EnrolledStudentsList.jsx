
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { getEnrolledStudents } from "@/services/enrollmentService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, UserIcon, Mail, Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

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
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Student</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Enrollment Date</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {students.map((student) => (
              <TableRow key={student.enrollmentId}>
                <TableCell>
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center mr-3">
                      <UserIcon className="h-4 w-4" />
                    </div>
                    <span className="font-medium">
                      {student.first_name} {student.last_name}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="flex items-center">
                  <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                  {student.email}
                </TableCell>
                <TableCell>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <CalendarIcon className="h-4 w-4 mr-1" />
                    {formatDistanceToNow(new Date(student.enrolledAt))} ago
                  </div>
                </TableCell>
                <TableCell>
                  <Badge className={student.status === 'active' ? 'bg-green-500' : 'bg-gray-500'}>
                    {student.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default EnrolledStudentsList;
