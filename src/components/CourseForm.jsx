
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import CourseBasicInfoForm from './CourseBasicInfoForm';
import CourseModulesSection from './CourseModulesSection';
import CourseAssignmentsSection from './CourseAssignmentsSection';
import { isValidYoutubeUrl } from '@/utils/youtubeUtils';

const CourseForm = ({ course, onSubmit, isEditing = false }) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    title: course?.title || '',
    description: course?.description || '',
    instructorName: course?.instructorName || '',
    modules: course?.modules || [{ 
      title: '', 
      description: '', 
      youtubeUrl: '',
      content: '', 
      lessons: [] 
    }],
    assignments: course?.assignments || [{ title: '', description: '', dueDate: '' }],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleModuleChange = (index, field, value) => {
    const updatedModules = [...formData.modules];
    updatedModules[index][field] = value;
    setFormData(prev => ({ ...prev, modules: updatedModules }));
  };

  const handleAssignmentChange = (index, field, value) => {
    const updatedAssignments = [...formData.assignments];
    updatedAssignments[index][field] = value;
    setFormData(prev => ({ ...prev, assignments: updatedAssignments }));
  };

  const addModule = () => {
    setFormData(prev => ({
      ...prev,
      modules: [...prev.modules, { 
        title: '', 
        description: '', 
        youtubeUrl: '',
        content: '', 
        lessons: [] 
      }]
    }));
  };

  const removeModule = (index) => {
    const updatedModules = [...formData.modules];
    updatedModules.splice(index, 1);
    setFormData(prev => ({ ...prev, modules: updatedModules }));
  };

  const addAssignment = () => {
    setFormData(prev => ({
      ...prev,
      assignments: [...prev.assignments, { title: '', description: '', dueDate: '' }]
    }));
  };

  const removeAssignment = (index) => {
    const updatedAssignments = [...formData.assignments];
    updatedAssignments.splice(index, 1);
    setFormData(prev => ({ ...prev, assignments: updatedAssignments }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.title || !formData.description || !formData.instructorName) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    // Validate YouTube URLs
    const invalidYoutubeUrls = formData.modules
      .filter(module => module.youtubeUrl && !isValidYoutubeUrl(module.youtubeUrl));
    
    if (invalidYoutubeUrls.length > 0) {
      toast({
        title: "Invalid YouTube URL",
        description: "Please enter valid YouTube URLs for all modules.",
        variant: "destructive",
      });
      return;
    }

    // Filter out empty modules and assignments
    const filteredData = {
      ...formData,
      modules: formData.modules.filter(module => module.title.trim() !== ''),
      assignments: formData.assignments.filter(assignment => assignment.title.trim() !== '')
    };
    
    onSubmit(filteredData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>{isEditing ? 'Edit Course' : 'Create New Course'}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <CourseBasicInfoForm 
            formData={formData} 
            handleChange={handleChange} 
          />
          
          <CourseModulesSection
            modules={formData.modules}
            handleModuleChange={handleModuleChange}
            addModule={addModule}
            removeModule={removeModule}
          />
          
          <CourseAssignmentsSection
            assignments={formData.assignments}
            handleAssignmentChange={handleAssignmentChange}
            addAssignment={addAssignment}
            removeAssignment={removeAssignment}
          />
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button type="button" variant="outline" onClick={() => navigate('/instructor-dashboard')}>
            Cancel
          </Button>
          <Button type="submit">
            {isEditing ? 'Update Course' : 'Create Course'}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
};

export default CourseForm;
