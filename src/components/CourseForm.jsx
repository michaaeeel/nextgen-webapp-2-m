
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { X, Plus, Youtube, FileText } from "lucide-react";

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

  // YouTube URL validation
  const isValidYoutubeUrl = (url) => {
    if (!url) return true; // Empty URLs are allowed
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/;
    return youtubeRegex.test(url);
  };

  // Extract YouTube video ID from URL for preview
  const getYoutubeEmbedUrl = (url) => {
    if (!url) return null;
    
    let videoId = null;
    
    // Match youtube.com/watch?v=ID format
    const watchUrlMatch = url.match(/youtube\.com\/watch\?v=([^&]+)/);
    if (watchUrlMatch) videoId = watchUrlMatch[1];
    
    // Match youtu.be/ID format
    const shortUrlMatch = url.match(/youtu\.be\/([^?&]+)/);
    if (shortUrlMatch) videoId = shortUrlMatch[1];
    
    // Match youtube.com/embed/ID format
    const embedUrlMatch = url.match(/youtube\.com\/embed\/([^?&]+)/);
    if (embedUrlMatch) videoId = embedUrlMatch[1];
    
    return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>{isEditing ? 'Edit Course' : 'Create New Course'}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Course Title *</Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Introduction to Web Development"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Course Description *</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="A comprehensive introduction to web development fundamentals..."
              rows={4}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="instructorName">Instructor Name *</Label>
            <Input
              id="instructorName"
              name="instructorName"
              value={formData.instructorName}
              onChange={handleChange}
              placeholder="Prof. John Smith"
              required
            />
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label>Modules</Label>
              <Button type="button" variant="outline" size="sm" onClick={addModule} className="flex items-center gap-1">
                <Plus size={16} /> Add Module
              </Button>
            </div>
            {formData.modules.map((module, index) => (
              <Card key={index} className="p-4 relative">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeModule(index)}
                  className="absolute top-2 right-2 h-8 w-8"
                >
                  <X size={16} />
                </Button>
                <div className="space-y-3 mt-4">
                  <div>
                    <Label htmlFor={`module-title-${index}`}>Module Title</Label>
                    <Input
                      id={`module-title-${index}`}
                      value={module.title}
                      onChange={(e) => handleModuleChange(index, 'title', e.target.value)}
                      placeholder="Getting Started with HTML"
                    />
                  </div>
                  <div>
                    <Label htmlFor={`module-description-${index}`}>Module Description</Label>
                    <Textarea
                      id={`module-description-${index}`}
                      value={module.description}
                      onChange={(e) => handleModuleChange(index, 'description', e.target.value)}
                      placeholder="Learn the basics of HTML structure..."
                      rows={2}
                    />
                  </div>
                  <div>
                    <Label 
                      htmlFor={`module-youtube-${index}`}
                      className="flex items-center gap-2"
                    >
                      <Youtube size={16} /> YouTube Video URL
                    </Label>
                    <Input
                      id={`module-youtube-${index}`}
                      value={module.youtubeUrl || ''}
                      onChange={(e) => handleModuleChange(index, 'youtubeUrl', e.target.value)}
                      placeholder="https://www.youtube.com/watch?v=example"
                    />
                  </div>
                  
                  {module.youtubeUrl && getYoutubeEmbedUrl(module.youtubeUrl) && (
                    <div className="mt-2">
                      <Label>Video Preview</Label>
                      <div className="aspect-w-16 aspect-h-9 mt-1 rounded overflow-hidden">
                        <iframe
                          src={getYoutubeEmbedUrl(module.youtubeUrl)}
                          title={`YouTube video preview for ${module.title || 'module'}`}
                          className="w-full h-56 border-0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        ></iframe>
                      </div>
                    </div>
                  )}
                  
                  <div>
                    <Label 
                      htmlFor={`module-content-${index}`}
                      className="flex items-center gap-2"
                    >
                      <FileText size={16} /> Module Content
                    </Label>
                    <Textarea
                      id={`module-content-${index}`}
                      value={module.content || ''}
                      onChange={(e) => handleModuleChange(index, 'content', e.target.value)}
                      placeholder="Enter detailed content or instructions for this module..."
                      rows={4}
                    />
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label>Assignments</Label>
              <Button type="button" variant="outline" size="sm" onClick={addAssignment} className="flex items-center gap-1">
                <Plus size={16} /> Add Assignment
              </Button>
            </div>
            {formData.assignments.map((assignment, index) => (
              <Card key={index} className="p-4 relative">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeAssignment(index)}
                  className="absolute top-2 right-2 h-8 w-8"
                >
                  <X size={16} />
                </Button>
                <div className="space-y-3 mt-4">
                  <div>
                    <Label htmlFor={`assignment-title-${index}`}>Assignment Title</Label>
                    <Input
                      id={`assignment-title-${index}`}
                      value={assignment.title}
                      onChange={(e) => handleAssignmentChange(index, 'title', e.target.value)}
                      placeholder="Create a simple HTML page"
                    />
                  </div>
                  <div>
                    <Label htmlFor={`assignment-description-${index}`}>Assignment Description</Label>
                    <Textarea
                      id={`assignment-description-${index}`}
                      value={assignment.description}
                      onChange={(e) => handleAssignmentChange(index, 'description', e.target.value)}
                      placeholder="Create a webpage that includes basic HTML elements..."
                      rows={2}
                    />
                  </div>
                  <div>
                    <Label htmlFor={`assignment-duedate-${index}`}>Due Date</Label>
                    <Input
                      id={`assignment-duedate-${index}`}
                      type="date"
                      value={assignment.dueDate}
                      onChange={(e) => handleAssignmentChange(index, 'dueDate', e.target.value)}
                    />
                  </div>
                </div>
              </Card>
            ))}
          </div>
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
