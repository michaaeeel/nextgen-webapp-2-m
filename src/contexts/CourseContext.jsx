import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useToast } from "@/hooks/use-toast";

const CourseContext = createContext(undefined);

export const CourseProvider = ({ children }) => {
  const { toast } = useToast();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load courses from localStorage
  const loadCourses = useCallback(() => {
    setLoading(true);
    try {
      const storedCourses = JSON.parse(localStorage.getItem('courses') || '[]');
      setCourses(storedCourses);
      setError(null);
    } catch (err) {
      setError('Failed to load courses');
      toast({
        title: "Error Loading Courses",
        description: "There was a problem loading the course data.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // Initialize on mount
  useEffect(() => {
    loadCourses();
  }, [loadCourses]);

  // Create a new course
  const createCourse = useCallback((courseData) => {
    try {
      const newCourse = {
        id: Date.now().toString(),
        ...courseData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        enrolledStudents: [],
      };
      
      const updatedCourses = [...courses, newCourse];
      localStorage.setItem('courses', JSON.stringify(updatedCourses));
      setCourses(updatedCourses);
      
      toast({
        title: "Course Created",
        description: "The course has been created successfully.",
      });
      
      return newCourse;
    } catch (err) {
      toast({
        title: "Error Creating Course",
        description: "Failed to create the course.",
        variant: "destructive",
      });
      throw err;
    }
  }, [courses, toast]);

  // Update an existing course
  const updateCourse = useCallback((courseId, courseData) => {
    try {
      const updatedCourses = courses.map(course => {
        if (course.id === courseId) {
          return {
            ...course,
            ...courseData,
            updatedAt: new Date().toISOString(),
          };
        }
        return course;
      });
      
      localStorage.setItem('courses', JSON.stringify(updatedCourses));
      setCourses(updatedCourses);
      
      toast({
        title: "Course Updated",
        description: "The course has been updated successfully.",
      });
      
      return updatedCourses.find(course => course.id === courseId);
    } catch (err) {
      toast({
        title: "Error Updating Course",
        description: "Failed to update the course.",
        variant: "destructive",
      });
      throw err;
    }
  }, [courses, toast]);

  // Delete a course
  const deleteCourse = useCallback((courseId) => {
    try {
      const updatedCourses = courses.filter(course => course.id !== courseId);
      localStorage.setItem('courses', JSON.stringify(updatedCourses));
      setCourses(updatedCourses);
      
      toast({
        title: "Course Deleted",
        description: "The course has been deleted successfully.",
      });
      
      return true;
    } catch (err) {
      toast({
        title: "Error Deleting Course",
        description: "Failed to delete the course.",
        variant: "destructive",
      });
      throw err;
    }
  }, [courses, toast]);

  // Get a single course by ID
  const getCourse = useCallback((courseId) => {
    return courses.find(course => course.id === courseId) || null;
  }, [courses]);

  // Get courses by instructor ID
  const getCoursesByInstructor = useCallback((instructorId) => {
    return courses.filter(course => course.instructorId === instructorId);
  }, [courses]);

  // Toggle course publish status
  const toggleCoursePublishStatus = useCallback((courseId) => {
    try {
      const updatedCourses = courses.map(course => {
        if (course.id === courseId) {
          return {
            ...course,
            isPublished: !course.isPublished,
            updatedAt: new Date().toISOString(),
          };
        }
        return course;
      });
      
      localStorage.setItem('courses', JSON.stringify(updatedCourses));
      setCourses(updatedCourses);
      
      const course = updatedCourses.find(c => c.id === courseId);
      
      toast({
        title: course.isPublished ? "Course Published" : "Course Unpublished",
        description: `The course is now ${course.isPublished ? 'published' : 'unpublished'}.`,
      });
      
      return course;
    } catch (err) {
      toast({
        title: "Error Updating Course",
        description: "Failed to update the course status.",
        variant: "destructive",
      });
      throw err;
    }
  }, [courses, toast]);

  // Assign instructor to course
  const assignInstructor = useCallback((courseId, instructorId) => {
    try {
      // Get instructor name from users array
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const instructor = users.find(user => user.id === instructorId);
      const instructorName = instructor ? instructor.name : 'Unknown Instructor';

      const updatedCourses = courses.map(course => {
        if (course.id === courseId) {
          return {
            ...course,
            instructorId,
            instructorName,
            updatedAt: new Date().toISOString(),
          };
        }
        return course;
      });
      
      localStorage.setItem('courses', JSON.stringify(updatedCourses));
      setCourses(updatedCourses);
      
      toast({
        title: "Instructor Assigned",
        description: "The instructor has been assigned to the course.",
      });
      
      return updatedCourses.find(course => course.id === courseId);
    } catch (err) {
      toast({
        title: "Error Assigning Instructor",
        description: "Failed to assign the instructor to the course.",
        variant: "destructive",
      });
      throw err;
    }
  }, [courses, toast]);

  const value = {
    courses,
    loading,
    error,
    loadCourses,
    createCourse,
    updateCourse,
    deleteCourse,
    getCourse,
    getCoursesByInstructor,
    toggleCoursePublishStatus,
    assignInstructor,
  };

  return (
    <CourseContext.Provider value={value}>
      {children}
    </CourseContext.Provider>
  );
};

export const useCourses = () => {
  const context = useContext(CourseContext);
  if (context === undefined) {
    throw new Error('useCourses must be used within a CourseProvider');
  }
  return context;
};

export default CourseContext; 