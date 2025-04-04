import { supabase } from '@/lib/supabase';

// Enroll a student in a course
export const enrollInCourse = async (userId, courseId) => {
  // Check if already enrolled
  const { data: course, error: courseError } = await supabase
    .from('courses')
    .select('enrolled_students')
    .eq('id', courseId)
    .single();

  if (courseError) {
    throw new Error('Failed to check enrollment status');
  }

  const enrolledStudents = course.enrolled_students || [];
  
  if (enrolledStudents.includes(userId)) {
    throw new Error('You are already enrolled in this course');
  }

  // Add user to enrolled_students array
  const { data, error } = await supabase
    .from('courses')
    .update({
      enrolled_students: [...enrolledStudents, userId],
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
  const { data: course, error: courseError } = await supabase
    .from('courses')
    .select('enrolled_students')
    .eq('id', courseId)
    .single();

  if (courseError) {
    throw new Error('Failed to fetch course');
  }

  if (!course.enrolled_students?.length) {
    return [];
  }

  // Fetch profiles for enrolled students
  const { data: students, error: studentsError } = await supabase
    .from('profiles')
    .select('id, first_name, last_name, email')
    .in('id', course.enrolled_students);

  if (studentsError) {
    throw new Error('Failed to fetch enrolled students');
  }

  return students.map(student => ({
    ...student,
    enrollmentId: student.id,
    enrolledAt: new Date().toISOString(), // You might want to store enrollment dates separately
    status: 'active'
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
