
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { X } from "lucide-react";

const CourseAssignmentForm = ({ 
  assignment, 
  index, 
  onAssignmentChange, 
  onRemoveAssignment 
}) => {
  return (
    <Card key={index} className="p-4 relative">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={() => onRemoveAssignment(index)}
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
            onChange={(e) => onAssignmentChange(index, 'title', e.target.value)}
            placeholder="Create a simple HTML page"
          />
        </div>
        <div>
          <Label htmlFor={`assignment-description-${index}`}>Assignment Description</Label>
          <Textarea
            id={`assignment-description-${index}`}
            value={assignment.description}
            onChange={(e) => onAssignmentChange(index, 'description', e.target.value)}
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
            onChange={(e) => onAssignmentChange(index, 'dueDate', e.target.value)}
          />
        </div>
      </div>
    </Card>
  );
};

export default CourseAssignmentForm;
