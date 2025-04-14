import { supabase } from '@/lib/supabase';

export const enrollInCourse = async (userId, courseId) => {
  // Check if already enrolled
  const { data: existingEnrollment, error: checkError } = await supabase
    .from('user_course_enrollments')
    .select('id')
    .eq('user_id', userId)
    .eq('course_id', courseId)
    .eq('status', 'active')
    .single();

  if (existingEnrollment) {
    throw new Error('You are already enrolled in this course');
  }

  // Create enrollment record
  const { data: enrollment, error: enrollError } = await supabase
    .from('user_course_enrollments')
    .insert({
      user_id: userId,
      course_id: courseId,
      status: 'active',
      enrolled_at: new Date().toISOString()
    })
    .select()
    .single();

  if (enrollError) {
    throw new Error(`Failed to enroll in course: ${enrollError.message}`);
  }

  // Update enrolled_count in courses table
  const { error: updateError } = await supabase
    .rpc('increment_course_enrollment', {
      course_id: courseId
    });

  if (updateError) {
    // Rollback enrollment if count update fails
    await supabase
      .from('user_course_enrollments')
      .delete()
      .eq('id', enrollment.id);
    
    throw new Error(`Failed to update course enrollment count: ${updateError.message}`);
  }

  return enrollment;
};

// Get all courses a student is enrolled in
export const getEnrolledCourses = async (userId) => {
  const { data, error } = await supabase
    .from('user_course_enrollments')
    .select(`
      *,
      courses (*)
    `)
    .eq('user_id', userId)
    .eq('status', 'active')
    .order('enrolled_at', { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch enrolled courses: ${error.message}`);
  }

  return data.map(enrollment => ({
    ...enrollment.courses,
    enrollmentId: enrollment.id,
    enrolledAt: enrollment.enrolled_at,
    status: enrollment.status
  }));
};

// Get all students enrolled in a course
export const getEnrolledStudents = async (courseId) => {
  const { data, error } = await supabase
    .from('user_course_enrollments')
    .select(`
      *,
      profiles!inner (*)
    `)
    .eq('course_id', courseId)
    .eq('status', 'active')
    .order('enrolled_at', { ascending: false });

  if (error) {
    throw new Error('Failed to fetch enrolled students');
  }

  return data.map(enrollment => ({
    ...enrollment.profiles,
    enrollmentId: enrollment.id,
    enrolledAt: enrollment.enrolled_at,
    status: enrollment.status
  }));
};

// Unenroll from a course
export const unenrollFromCourse = async (enrollmentId) => {
  const { data, error } = await supabase
    .from('user_course_enrollments')
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
