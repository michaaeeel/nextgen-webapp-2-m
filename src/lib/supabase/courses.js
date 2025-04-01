
import { supabase } from './client'

// Course management functions
export const createCourse = async (courseData) => {
  const { data, error } = await supabase
    .from('courses')
    .insert(courseData)
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
