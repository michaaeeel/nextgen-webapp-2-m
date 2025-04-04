import { supabase } from '@/lib/supabase';

// Enroll a student in a course
export const enrollInCourse = async (userId, courseId) => {
  // Start a Supabase transaction
  const { data: { user } } = await supabase.auth.getUser();
  
  // Get user profile information
  const { data: userProfile, error: profileError } = await supabase
    .from('profiles')
    .select('first_name, last_name, email')
    .eq('id', userId)
    .single();

  if (profileError) {
    throw new Error('Failed to fetch user profile');
  }

  // Check if already enrolled via enrolled_students JSONB
  const { data: course, error: courseError } = await supabase
    .from('courses')
    .select('enrolled_students')
    .eq('id', courseId)
    .single();

  if (courseError) {
    throw new Error('Failed to check enrollment status');
  }

  const enrolledStudents = course.enrolled_students || [];
  const isAlreadyEnrolled = enrolledStudents.some(student => student.student_id === userId);

  if (isAlreadyEnrolled) {
    throw new Error('You are already enrolled in this course');
  }

  // Create new enrollment object
  const enrollmentData = {
    student_id: userId,
    first_name: userProfile.first_name,
    last_name: userProfile.last_name,
    email: userProfile.email,
    enrolled_at: new Date().toISOString(),
    status: 'active'
  };

  // Update the course's enrolled_students array
  const { data, error } = await supabase
    .from('courses')
    .update({
      enrolled_students: [...enrolledStudents, enrollmentData],
      updated_at: new Date().toISOString()
    })
    .eq('id', courseId)
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
