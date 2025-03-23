import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  fetchAllCourses,
  fetchCourseById,
  fetchCoursesByInstructor,
  createCourse as createCourseApi,
  updateCourse as updateCourseApi,
  deleteCourse as deleteCourseApi,
  toggleCoursePublishStatus as toggleCourseStatusApi,
  assignInstructorToCourse
} from '@/services/courseService';

const CourseContext = createContext(undefined);

export const CourseProvider = ({ children }) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Fetch all courses
  const {
    data: courses = [],
    isLoading: loading,
    error,
    refetch: loadCourses
  } = useQuery({
    queryKey: ['courses'],
    queryFn: fetchAllCourses,
    onError: (err) => {
      toast({
        title: "Error Loading Courses",
        description: err.message || "There was a problem loading the course data.",
        variant: "destructive",
      });
    }
  });

  // Create a new course
  const createCourseMutation = useMutation({
    mutationFn: createCourseApi,
    onSuccess: (newCourse) => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      toast({
        title: "Course Created",
        description: "The course has been created successfully.",
      });
      return newCourse;
    },
    onError: (err) => {
      toast({
        title: "Error Creating Course",
        description: err.message || "Failed to create the course.",
        variant: "destructive",
      });
      throw err;
    }
  });

  // Update an existing course
  const updateCourseMutation = useMutation({
    mutationFn: ({ courseId, courseData }) => updateCourseApi(courseId, courseData),
    onSuccess: (updatedCourse) => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      queryClient.invalidateQueries({ queryKey: ['course', updatedCourse.id] });
      toast({
        title: "Course Updated",
        description: "The course has been updated successfully.",
      });
      return updatedCourse;
    },
    onError: (err) => {
      toast({
        title: "Error Updating Course",
        description: err.message || "Failed to update the course.",
        variant: "destructive",
      });
      throw err;
    }
  });

  // Delete a course
  const deleteCourseMutation = useMutation({
    mutationFn: deleteCourseApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      toast({
        title: "Course Deleted",
        description: "The course has been deleted successfully.",
      });
      return true;
    },
    onError: (err) => {
      toast({
        title: "Error Deleting Course",
        description: err.message || "Failed to delete the course.",
        variant: "destructive",
      });
      throw err;
    }
  });

  // Toggle course publish status
  const togglePublishStatusMutation = useMutation({
    mutationFn: ({ courseId, currentStatus }) => toggleCourseStatusApi(courseId, currentStatus),
    onSuccess: (updatedCourse) => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      queryClient.invalidateQueries({ queryKey: ['course', updatedCourse.id] });
      toast({
        title: updatedCourse.is_published ? "Course Published" : "Course Unpublished",
        description: `The course is now ${updatedCourse.is_published ? 'published' : 'unpublished'}.`,
      });
      return updatedCourse;
    },
    onError: (err) => {
      toast({
        title: "Error Updating Course",
        description: err.message || "Failed to update the course status.",
        variant: "destructive",
      });
      throw err;
    }
  });

  // Assign instructor to course
  const assignInstructorMutation = useMutation({
    mutationFn: ({ courseId, instructorId, instructorName }) => 
      assignInstructorToCourse(courseId, instructorId, instructorName),
    onSuccess: (updatedCourse) => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      queryClient.invalidateQueries({ queryKey: ['course', updatedCourse.id] });
      toast({
        title: "Instructor Assigned",
        description: "The instructor has been assigned to the course.",
      });
      return updatedCourse;
    },
    onError: (err) => {
      toast({
        title: "Error Assigning Instructor",
        description: err.message || "Failed to assign the instructor to the course.",
        variant: "destructive",
      });
      throw err;
    }
  });

  // Get a single course by ID with React Query
  const getCourse = useCallback((courseId) => {
    // First check if we have it in cache
    const cachedCourses = queryClient.getQueryData(['courses']);
    if (cachedCourses) {
      const course = cachedCourses.find(course => course.id === courseId);
      if (course) return course;
    }
    
    // Otherwise fetch it specifically (don't wait for the result)
    queryClient.fetchQuery({
      queryKey: ['course', courseId],
      queryFn: () => fetchCourseById(courseId)
    });
    
    // Return null for now, component will re-render when data arrives
    return null;
  }, [queryClient]);

  // Get courses by instructor ID
  const getCoursesByInstructor = useCallback((instructorId) => {
    // First check if we have it in cache
    const cachedCourses = queryClient.getQueryData(['courses']);
    if (cachedCourses) {
      return cachedCourses.filter(course => course.instructor_id === instructorId);
    }
    
    // Otherwise fetch it specifically (don't wait for the result)
    queryClient.fetchQuery({
      queryKey: ['instructorCourses', instructorId],
      queryFn: () => fetchCoursesByInstructor(instructorId)
    });
    
    // Return empty array for now, component will re-render when data arrives
    return [];
  }, [queryClient]);

  // Create a course
  const createCourse = useCallback((courseData) => {
    return createCourseMutation.mutateAsync(courseData);
  }, [createCourseMutation]);

  // Update a course
  const updateCourse = useCallback((courseId, courseData) => {
    return updateCourseMutation.mutateAsync({ courseId, courseData });
  }, [updateCourseMutation]);

  // Delete a course
  const deleteCourse = useCallback((courseId) => {
    return deleteCourseMutation.mutateAsync(courseId);
  }, [deleteCourseMutation]);

  // Toggle course publish status
  const toggleCoursePublishStatus = useCallback((courseId) => {
    // Get current status
    const cachedCourses = queryClient.getQueryData(['courses']);
    const course = cachedCourses?.find(c => c.id === courseId);
    const currentStatus = course?.is_published || false;
    
    return togglePublishStatusMutation.mutateAsync({ courseId, currentStatus });
  }, [queryClient, togglePublishStatusMutation]);

  // Assign instructor to course
  const assignInstructor = useCallback((courseId, instructorId) => {
    // Get instructor name
    const users = queryClient.getQueryData(['users']);
    const instructor = users?.find(user => user.id === instructorId);
    const instructorName = instructor ? instructor.name : 'Unknown Instructor';
    
    return assignInstructorMutation.mutateAsync({ courseId, instructorId, instructorName });
  }, [queryClient, assignInstructorMutation]);

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
