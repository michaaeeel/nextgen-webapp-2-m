import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCourses } from "@/contexts/CourseContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Edit, ChevronLeft, User, Calendar, BookOpen, FileText, Trash2, UserCog, EyeOff, Eye } from "lucide-react";

const AdminCourseDetail = ({ course, onEdit, onDelete, onAssignInstructor }) => {
  const navigate = useNavigate();
  const { toggleCoursePublishStatus } = useCourses();

  const handleTogglePublish = () => {
    toggleCoursePublishStatus(course.id);
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
          <Button onClick={onAssignInstructor} variant="outline" className="flex items-center gap-2">
            <UserCog size={16} />
            Assign Instructor
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

      {/* ... rest of the component ... */}
      
      <div>
        <h3 className="text-sm font-medium mb-2">Course Status</h3>
        <div className="flex items-center gap-2">
          <span className={`px-2 py-1 rounded-full text-xs ${course.published ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
            {course.published ? 'Published' : 'Draft'}
          </span>
        </div>
      </div>
      
      {/* ... rest of the component ... */}
    </div>
  );
};

export default AdminCourseDetail; 