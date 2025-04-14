
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getInstructorCourses } from "@/services/courseService";
import { getEnrolledStudents, unenrollFromCourse } from "@/services/enrollmentService";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { UserX, Users, Mail, CalendarIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";
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

const StudentManagement = ({ instructorId }) => {
  const { toast } = useToast();
  const [unenrollingStudent, setUnenrollingStudent] = useState(null);
  
  // Fetch all courses for the instructor
  const { 
    data: courses = [], 
    isLoading: coursesLoading,
    error: coursesError,
    refetch: refetchCourses
  } = useQuery({
    queryKey: ['instructorCourses', instructorId],
    queryFn: () => getInstructorCourses(instructorId),
    enabled: !!instructorId
  });

  // Function to handle unenrolling a student
  const handleUnenroll = async (enrollmentId) => {
    try {
      await unenrollFromCourse(enrollmentId);
      toast({
        title: "Student Unenrolled",
        description: "The student has been successfully unenrolled from the course.",
      });
      // Refetch courses to update UI
      refetchCourses();
      setUnenrollingStudent(null);
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to unenroll student",
        variant: "destructive",
      });
    }
  };

  if (coursesLoading) {
    return <div className="text-center py-8">Loading courses...</div>;
  }

  if (coursesError) {
    return <div className="text-destructive text-center py-8">Error loading courses: {coursesError.message}</div>;
  }

  if (!courses.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No Courses</CardTitle>
          <CardDescription>You don't have any courses yet.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            You need to create a course before you can manage students.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Accordion type="single" collapsible className="w-full">
        {courses.map((course) => (
          <CourseStudents 
            key={course.id} 
            course={course} 
            onUnenroll={(enrollmentId) => setUnenrollingStudent(enrollmentId)}
          />
        ))}
      </Accordion>

      <AlertDialog open={!!unenrollingStudent} onOpenChange={(open) => !open && setUnenrollingStudent(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Unenroll Student</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove the student from the course. They will no longer have access to course materials.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => handleUnenroll(unenrollingStudent)}
            >
              Unenroll
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

// Component to display students for a single course
const CourseStudents = ({ course, onUnenroll }) => {
  const { 
    data: students = [], 
    isLoading, 
    error 
  } = useQuery({
    queryKey: ['enrolledStudents', course.id],
    queryFn: () => getEnrolledStudents(course.id),
    enabled: !!course.id
  });

  return (
    <AccordionItem value={course.id}>
      <AccordionTrigger className="hover:no-underline">
        <div className="flex justify-between items-center w-full pr-4">
          <span>{course.title}</span>
          <Badge variant="outline" className="ml-2 flex items-center gap-1">
            <Users className="h-3 w-3" />
            {students.length} {students.length === 1 ? "Student" : "Students"}
          </Badge>
        </div>
      </AccordionTrigger>
      <AccordionContent>
        {isLoading ? (
          <div className="text-center py-4">Loading students...</div>
        ) : error ? (
          <div className="text-destructive text-center py-4">
            Error loading students: {error.message}
          </div>
        ) : students.length === 0 ? (
          <div className="text-muted-foreground text-center py-4">
            No students enrolled in this course.
          </div>
        ) : (
          <Card>
            <CardContent className="p-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Enrollment Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {students.map((student) => (
                    <TableRow key={student.enrollmentId}>
                      <TableCell className="font-medium">
                        {student.first_name} {student.last_name}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                          {student.email}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">
                          {student.role || "student"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center text-muted-foreground text-sm">
                          <CalendarIcon className="h-4 w-4 mr-1" />
                          {formatDistanceToNow(new Date(student.enrolledAt))} ago
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                          onClick={() => onUnenroll(student.enrollmentId)}
                        >
                          <UserX className="h-4 w-4 mr-1" />
                          Unenroll
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </AccordionContent>
    </AccordionItem>
  );
};

export default StudentManagement;
