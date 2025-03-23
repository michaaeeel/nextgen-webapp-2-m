
import React from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import CourseModuleForm from './CourseModuleForm';

const CourseModulesSection = ({ 
  modules, 
  handleModuleChange, 
  addModule, 
  removeModule 
}) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Label>Modules</Label>
        <Button 
          type="button" 
          variant="outline" 
          size="sm" 
          onClick={addModule} 
          className="flex items-center gap-1"
        >
          <Plus size={16} /> Add Module
        </Button>
      </div>
      {modules.map((module, index) => (
        <CourseModuleForm
          key={index}
          module={module}
          index={index}
          onModuleChange={handleModuleChange}
          onRemoveModule={removeModule}
        />
      ))}
    </div>
  );
};

export default CourseModulesSection;
