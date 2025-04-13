
import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getEnrolledStudents, unenrollFromCourse } from "@/services/enrollmentService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, UserIcon, Mail, Clock, UserMinus } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const EnrolledStudentsList = ({ courseId }) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [studentToUnenroll, setStudentToUnenroll] = React.useState(null);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  
  const { 
    data: students = [],
    isLoading,
    error
  } = useQuery({
    queryKey: ['enrolledStudents', courseId],
    queryFn: () => getEnrolledStudents(courseId),
    enabled: !!courseId
  });

  const unenrollMutation = useMutation({
    mutationFn: (enrollmentId) => unenrollFromCourse(enrollmentId),
    onSuccess: () => {
      toast({
        title: "Student unenrolled successfully",
        description: "The student has been removed from this course.",
      });
      queryClient.invalidateQueries({ queryKey: ['enrolledStudents', courseId] });
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      setIsDialogOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to unenroll student. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleUnenroll = (student) => {
    setStudentToUnenroll(student);
    setIsDialogOpen(true);
  };

  const confirmUnenroll = () => {
    if (studentToUnenroll) {
      unenrollMutation.mutate(studentToUnenroll.enrollmentId);
    }
  };

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
              <TableHead>Actions</TableHead>
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
                <TableCell>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={() => handleUnenroll(student)}
                  >
                    <UserMinus className="h-4 w-4 mr-1" />
                    Unenroll
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
      
      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Unenroll Student</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to unenroll {studentToUnenroll?.first_name} {studentToUnenroll?.last_name} from this course?
              This action cannot be undone and the student will lose access to the course materials.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmUnenroll}
              className="bg-destructive hover:bg-destructive/90"
            >
              Unenroll
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
};

export default EnrolledStudentsList;
