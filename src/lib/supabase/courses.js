
import { supabase } from './client'

// Course management functions
export const createCourse = async (courseData) => {
  // Get current user info
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

  // Add instructor info to course data
  const courseWithInstructor = {
    ...courseData,
    instructor_id: user.id,
    instructor_name: instructorName,
  };

  const { data, error } = await supabase
    .from('courses')
    .insert(courseWithInstructor)
    .select()
    .single()
  if (error) throw error
  return data
}

export const getCourses = async () => {
  const { data, error } = await supabase
    .from('courses')
    .select('*')
  if (error) throw error
  return data
}

export const enrollInCourse = async (userId, courseId) => {
  const { data, error } = await supabase
    .from('enrollments')
    .insert({ user_id: userId, course_id: courseId })
    .select()
    .single()
  if (error) throw error
  return data
}
