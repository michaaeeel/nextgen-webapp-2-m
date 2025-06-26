
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import CourseBasicInfoForm from './CourseBasicInfoForm';
import CourseModulesSection from './CourseModulesSection';
import CourseAssignmentsSection from './CourseAssignmentsSection';
import { isValidvideoUrl } from '@/utils/youtubeUtils';

// Define form schema with zod
const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  coverImage: z.string().optional(),
  price: z.coerce.number().min(0, "Price must be a positive number"),
  discountPrice: z.coerce.number().min(0, "Discount price must be a positive number").optional().nullable(),
  category: z.string().optional(),
  level: z.enum(["beginner", "intermediate", "advanced"]),
  isPublished: z.boolean().default(false),
  modules: z.array(
    z.object({
      title: z.string().min(1, "Module title is required"),
      description: z.string().optional(),
      videoUrl: z.string().optional().refine(val => !val || isValidvideoUrl(val), {
        message: "Please enter a valid YouTube URL"
      }),
      content: z.string().optional(),
      lessons: z.array(z.any()).default([])
    })
  ).min(1, "At least one module is required"),
  assignments: z.array(
    z.object({
      title: z.string().min(1, "Assignment title is required"),
      description: z.string().optional(),
      dueDate: z.string().optional()
    })
  ).default([])
});

const CourseForm = ({ course, onSubmit, isEditing = false }) => {
  const { toast } = useToast();
  const navigate = useNavigate();

  // Default values for the form
  const defaultValues = {
    title: course?.title || '',
    description: course?.description || '',
    coverImage: course?.coverImage || '',
    price: course?.price || 0,
    discountPrice: course?.discountPrice || null,
    category: course?.category || '',
    level: course?.level || 'beginner',
    isPublished: course?.isPublished || false,
    modules: course?.modules?.length > 0 ? course.modules : [{ 
      title: '', 
      description: '', 
      videoUrl: '',
      content: '', 
      lessons: [] 
    }],
    assignments: course?.assignments?.length > 0 ? course.assignments : [{ 
      title: '', 
      description: '', 
      dueDate: '' 
    }],
  };

  // Create form
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues
  });

  const handleModuleChange = (index, field, value) => {
    const currentModules = form.getValues('modules');
    currentModules[index][field] = value;
    form.setValue('modules', currentModules);
  };

  const addModule = () => {
    const currentModules = form.getValues('modules');
    form.setValue('modules', [
      ...currentModules,
      { title: '', description: '', videoUrl: '', content: '', lessons: [] }
    ]);
  };

  const removeModule = (index) => {
    const currentModules = form.getValues('modules');
    currentModules.splice(index, 1);
    form.setValue('modules', currentModules);
  };

  const handleAssignmentChange = (index, field, value) => {
    const currentAssignments = form.getValues('assignments');
    currentAssignments[index][field] = value;
    form.setValue('assignments', currentAssignments);
  };

  const addAssignment = () => {
    const currentAssignments = form.getValues('assignments');
    form.setValue('assignments', [
      ...currentAssignments,
      { title: '', description: '', dueDate: '' }
    ]);
  };

  const removeAssignment = (index) => {
    const currentAssignments = form.getValues('assignments');
    currentAssignments.splice(index, 1);
    form.setValue('assignments', currentAssignments);
  };

  const handleFormSubmit = (data) => {
    // Filter out empty modules and assignments
    const filteredData = {
      ...data,
      modules: data.modules.filter(module => module.title.trim() !== ''),
      assignments: data.assignments.filter(assignment => assignment.title.trim() !== '')
    };
    
    onSubmit(filteredData);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)}>
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>{isEditing ? 'Edit Course' : 'Create New Course'}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <CourseBasicInfoForm form={form} />
            
            <CourseModulesSection
              modules={form.getValues('modules')}
              handleModuleChange={handleModuleChange}
              addModule={addModule}
              removeModule={removeModule}
            />
            
            <CourseAssignmentsSection
              assignments={form.getValues('assignments')}
              handleAssignmentChange={handleAssignmentChange}
              addAssignment={addAssignment}
              removeAssignment={removeAssignment}
            />
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button type="button" variant="outline" onClick={() => navigate('/instructor-dashboard/courses')}>
              Cancel
            </Button>
            <Button type="submit">
              {isEditing ? 'Update Course' : 'Create Course'}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
};

export default CourseForm;
