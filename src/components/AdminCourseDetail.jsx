import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCourses } from "@/contexts/CourseContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Edit, ChevronLeft, User, Calendar, BookOpen, FileText, Trash2, EyeOff, Eye, Youtube } from "lucide-react";

const AdminCourseDetail = ({ course, onEdit, onDelete }) => {
  const navigate = useNavigate();
  const { toggleCoursePublishStatus } = useCourses();

  const handleTogglePublish = () => {
    toggleCoursePublishStatus(course.id);
  };

  // Function to extract YouTube video ID from URL
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

  if (!course) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Course not found</p>
        <Button className="mt-4" onClick={() => navigate('/admin-dashboard/courses')}>
          Back to Courses
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => navigate('/admin-dashboard/courses')}>
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">{course.title}</h1>
        </div>
        <div className="flex items-center gap-3">
          <Button onClick={() => onEdit(course.id)} className="flex items-center gap-2">
            <Edit size={16} />
            Edit Course
          </Button>
          <Button onClick={handleTogglePublish} variant="outline" className="flex items-center gap-2">
            {course.published ? (
              <>
                <EyeOff size={16} />
                Unpublish
              </>
            ) : (
              <>
                <Eye size={16} />
                Publish
              </>
            )}
          </Button>
          <Button onClick={onDelete} variant="destructive" className="flex items-center gap-2">
            <Trash2 size={16} />
            Delete
          </Button>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium mb-2">Course Status</h3>
        <div className="flex items-center gap-2">
          <span className={`px-2 py-1 rounded-full text-xs ${course.published ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
            {course.published ? 'Published' : 'Draft'}
          </span>
        </div>
      </div>
      
      <Tabs defaultValue="modules" className="w-full">
        <TabsList>
          <TabsTrigger value="modules" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Modules
          </TabsTrigger>
          <TabsTrigger value="assignments" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Assignments
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="modules" className="space-y-4 mt-4">
          {course.modules && course.modules.length > 0 ? (
            course.modules.map((module, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-lg">{module.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p>{module.description}</p>
                  
                  {module.youtubeUrl && getYoutubeEmbedUrl(module.youtubeUrl) && (
                    <div className="mt-4">
                      <h4 className="text-sm font-medium flex items-center gap-2 mb-2">
                        <Youtube className="h-4 w-4" /> Video Content
                      </h4>
                      <div className="aspect-w-16 aspect-h-9 mt-1 rounded overflow-hidden">
                        <iframe
                          src={getYoutubeEmbedUrl(module.youtubeUrl)}
                          title={`YouTube video for ${module.title}`}
                          className="w-full h-56 border-0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        ></iframe>
                      </div>
                    </div>
                  )}
                  
                  {module.content && (
                    <div className="mt-4">
                      <h4 className="text-sm font-medium flex items-center gap-2 mb-2">
                        <FileText className="h-4 w-4" /> Text Content
                      </h4>
                      <div className="p-4 bg-gray-50 rounded-md">
                        <p className="whitespace-pre-wrap">{module.content}</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          ) : (
            <p className="text-muted-foreground">No modules found for this course.</p>
          )}
        </TabsContent>
        
        <TabsContent value="assignments" className="space-y-4 mt-4">
          {course.assignments && course.assignments.length > 0 ? (
            course.assignments.map((assignment, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-lg">{assignment.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{assignment.description}</p>
                  {assignment.dueDate && (
                    <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>Due: {new Date(assignment.dueDate).toLocaleDateString()}</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          ) : (
            <p className="text-muted-foreground">No assignments found for this course.</p>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminCourseDetail;
