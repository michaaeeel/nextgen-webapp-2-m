
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
// import { isValidvideoUrl } from '@/utils/youtubeUtils';
import CourseBasicInfoForm from './CourseBasicInfoForm';
import CourseModulesSection from './CourseModulesSection';
import CourseAssignmentsSection from './CourseAssignmentsSection';

// Define form validation schema
const formSchema = z.object({
  title: z.string().min(1, { message: 'Title is required' }),
  description: z.string().min(1, { message: 'Description is required' }),
  coverImage: z.string().min(1, { message: 'Cover image URL is required' }),
  price: z.coerce.number().min(0, { message: 'Price must be a positive number' }),
  discountPrice: z.coerce.number().min(0, { message: 'Discount price must be a positive number' }).optional().nullable(),
  category: z.string().min(1, { message: 'Category is required' }),
  level: z.enum(['beginner', 'intermediate', 'advanced']),
  isPublished: z.boolean().default(false),
});

const AdminCourseForm = ({ course, onSubmit, onCancel, isEditing = false }) => {
  const { toast } = useToast();
  
  // State for modules and assignments
  const [modules, setModules] = useState([{ 
    title: '', 
    description: '', 
    videoUrl: '',
    content: '', 
    lessons: [] 
  }]);
  
  const [assignments, setAssignments] = useState([
    { title: '', description: '', dueDate: '' }
  ]);
  
  // Initialize form with react-hook-form
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: course?.title || '',
      description: course?.description || '',
      coverImage: course?.coverImage || '',
      price: course?.price || '',
      discountPrice: course?.discountPrice || '',
      category: course?.category || '',
      level: course?.level || 'beginner',
      isPublished: course?.isPublished || false,
    },
  });

  // Load existing modules and assignments when editing
  useEffect(() => {
    if (course && isEditing) {
      if (course.modules && course.modules.length > 0) {
        setModules(course.modules);
      }
      
      if (course.assignments && course.assignments.length > 0) {
        setAssignments(course.assignments);
      }
    }
  }, [course, isEditing]);

  // Handlers for modules
  const handleModuleChange = (index, field, value) => {
    const updatedModules = [...modules];
    updatedModules[index][field] = value;
    setModules(updatedModules);
  };
  
  const addModule = () => {
    setModules([...modules, { 
      title: '', 
      description: '', 
      videoUrl: '',
      content: '', 
      lessons: [] 
    }]);
  };
  
  const removeModule = (index) => {
    const updatedModules = [...modules];
    updatedModules.splice(index, 1);
    setModules(updatedModules);
  };

  // Handlers for assignments
  const handleAssignmentChange = (index, field, value) => {
    const updatedAssignments = [...assignments];
    updatedAssignments[index][field] = value;
    setAssignments(updatedAssignments);
  };
  
  const addAssignment = () => {
    setAssignments([...assignments, { title: '', description: '', dueDate: '' }]);
  };
  
  const removeAssignment = (index) => {
    const updatedAssignments = [...assignments];
    updatedAssignments.splice(index, 1);
    setAssignments(updatedAssignments);
  };

  const handleFormSubmit = (data) => {
    try {      
      // Filter out empty modules and assignments
      const filteredModules = modules.filter(module => module.title.trim() !== '');
      const filteredAssignments = assignments.filter(assignment => assignment.title.trim() !== '');
      
      const courseData = {
        ...data,
        discountPrice: data.discountPrice || null,
        modules: filteredModules,
        assignments: filteredAssignments
      };
      
      onSubmit(courseData);
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to save course",
        variant: "destructive"
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
        <CourseBasicInfoForm form={form} />
        
        {/* Course Modules Section */}
        <div className="mt-8">
          <CourseModulesSection
            modules={modules}
            handleModuleChange={handleModuleChange}
            addModule={addModule}
            removeModule={removeModule}
          />
        </div>
        
        {/* Course Assignments Section */}
        <div className="mt-8">
          <CourseAssignmentsSection
            assignments={assignments}
            handleAssignmentChange={handleAssignmentChange}
            addAssignment={addAssignment}
            removeAssignment={removeAssignment}
          />
        </div>

        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button type="submit">
            {isEditing ? 'Update Course' : 'Create Course'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default AdminCourseForm;
