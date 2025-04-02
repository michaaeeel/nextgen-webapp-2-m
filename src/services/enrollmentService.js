
import { supabase } from '@/lib/supabase';

// Enroll a student in a course
export const enrollInCourse = async (userId, courseId) => {
  // Check if already enrolled
  const { data: existingEnrollment, error: checkError } = await supabase
    .from('enrollments')
    .select('*')
    .eq('user_id', userId)
    .eq('course_id', courseId)
    .single();
    
  if (checkError && checkError.code !== 'PGSQL_ERROR_NO_DATA_FOUND') {
    throw new Error(`Failed to check enrollment: ${checkError.message}`);
  }
  
  if (existingEnrollment) {
    throw new Error('You are already enrolled in this course');
  }
  
  // Create new enrollment record
  const { data, error } = await supabase
    .from('enrollments')
    .insert({
      user_id: userId,
      course_id: courseId,
      enrolled_at: new Date().toISOString(),
      status: 'active',
      payment_status: 'completed' // In a real app with Stripe, this would be set after payment
    })
    .select()
    .single();
    
  if (error) {
    throw new Error(`Failed to enroll in course: ${error.message}`);
  }
  
  return data;
};

// Get all courses a student is enrolled in
export const getEnrolledCourses = async (userId) => {
  const { data, error } = await supabase
    .from('enrollments')
    .select(`
      *,
      course:courses(*)
    `)
    .eq('user_id', userId)
    .eq('status', 'active');
    
  if (error) {
    throw new Error(`Failed to fetch enrolled courses: ${error.message}`);
  }
  
  // Format the data to return just the courses with enrollment data
  return data.map(enrollment => ({
    ...enrollment.course,
    enrollmentId: enrollment.id,
    enrolledAt: enrollment.enrolled_at,
    status: enrollment.status,
    paymentStatus: enrollment.payment_status
  }));
};

// Get all students enrolled in a course
export const getEnrolledStudents = async (courseId) => {
  const { data, error } = await supabase
    .from('enrollments')
    .select(`
      *,
      student:profiles(id, first_name, last_name, email)
    `)
    .eq('course_id', courseId)
    .eq('status', 'active');
    
  if (error) {
    throw new Error(`Failed to fetch enrolled students: ${error.message}`);
  }
  
  // Format the data to return just the students with enrollment data
  return data.map(enrollment => ({
    ...enrollment.student,
    enrollmentId: enrollment.id,
    enrolledAt: enrollment.enrolled_at,
    status: enrollment.status,
    paymentStatus: enrollment.payment_status
  }));
};

// Unenroll a student from a course
export const unenrollFromCourse = async (enrollmentId) => {
  // We're not deleting the record, just setting status to "inactive"
  const { data, error } = await supabase
    .from('enrollments')
    .update({ 
      status: 'inactive',
      updated_at: new Date().toISOString()
    })
    .eq('id', enrollmentId)
    .select()
    .single();
    
  if (error) {
    throw new Error(`Failed to unenroll from course: ${error.message}`);
  }
  
  return data;
};
