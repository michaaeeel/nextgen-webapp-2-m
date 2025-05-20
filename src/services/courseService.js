import { supabase } from '@/lib/supabase';

// Get all courses
export const fetchAllCourses = async () => {
  const { data, error } = await supabase
    .from('courses')
    .select('*');
    
  if (error) throw error;
  return data || [];
};

// Get a single course by ID
export const fetchCourseById = async (courseId) => {
  const { data, error } = await supabase
    .from('courses')
    .select('*')
    .eq('id', courseId)
    .single();
    
  if (error) throw error;
  return data;
};

// Get courses by instructor ID
export const fetchCoursesByInstructor = async (instructorId) => {
  const { data, error } = await supabase
    .from('courses')
    .select('*')
    .eq('instructor_id', instructorId);
    
  if (error) throw error;
  return data || [];
};

// Create a new course
export const createCourse = async (courseData) => {
  // Get current user info to set as instructor
  const { data: { user } } = await supabase.auth.getUser();
  
  // Get user profile to get name information
  const { data: userProfile } = await supabase
    .from('profiles')
    .select('first_name, last_name')
    .eq('id', user.id)
    .single();
  
  // Create instructor name from user profile
  const instructorName = userProfile 
    ? `${userProfile.first_name} ${userProfile.last_name}`
    : user.email;

  // Update course data with instructor information
  const courseWithInstructor = {
    ...courseData,
    instructor_id: user.id,
    instructor_name: instructorName,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from('courses')
    .insert(courseWithInstructor)
    .select()
    .single();
    
  if (error) throw error;
  return data;
};

// Update a course
export const updateCourse = async (courseId, courseData) => {
  const { data, error } = await supabase
    .from('courses')
    .update({
      ...courseData,
      updated_at: new Date().toISOString(),
    })
    .eq('id', courseId)
    .select()
    .single();
    
  if (error) throw error;
  return data;
};

// Delete a course
export const deleteCourse = async (courseId) => {
  const { error } = await supabase
    .from('courses')
    .delete()
    .eq('id', courseId);
    
  if (error) throw error;
  return true;
};

// Toggle course publish status
export const toggleCoursePublishStatus = async (courseId, currentStatus) => {
  const { data, error } = await supabase
    .from('courses')
    .update({
      is_published: !currentStatus,
      updated_at: new Date().toISOString(),
    })
    .eq('id', courseId)
    .select()
    .single();
    
  if (error) throw error;
  return data;
};

// Assign instructor to course
export const assignInstructorToCourse = async (courseId, instructorId, instructorName) => {
  const { data, error } = await supabase
    .from('courses')
    .update({
      instructor_id: instructorId,
      instructor_name: instructorName,
      updated_at: new Date().toISOString(),
    })
    .eq('id', courseId)
    .select()
    .single();
    
  if (error) throw error;
  return data;
};

// Function to get all courses for a specific instructor
export const getInstructorCourses = async (instructorId) => {
  const { data, error } = await supabase
    .from('courses')
    .select('*')
    .eq('instructor_id', instructorId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching instructor courses:', error);
    throw new Error('Failed to fetch instructor courses');
  }

  return data || [];
};
