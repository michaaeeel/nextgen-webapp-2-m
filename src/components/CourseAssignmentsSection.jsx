
import React from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import CourseAssignmentForm from './CourseAssignmentForm';

const CourseAssignmentsSection = ({ 
  assignments, 
  handleAssignmentChange, 
  addAssignment, 
  removeAssignment 
}) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Label>Assignments</Label>
        <Button 
          type="button" 
          variant="outline" 
          size="sm" 
          onClick={addAssignment} 
          className="flex items-center gap-1"
        >
          <Plus size={16} /> Add Assignment
        </Button>
      </div>
      {assignments.map((assignment, index) => (
        <CourseAssignmentForm
          key={index}
          assignment={assignment}
          index={index}
          onAssignmentChange={handleAssignmentChange}
          onRemoveAssignment={removeAssignment}
        />
      ))}
    </div>
  );
};

export default CourseAssignmentsSection;
