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
  const { data, error } = await supabase
    .from('courses')
    .insert({
      ...courseData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
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
