
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const CourseBasicInfoForm = ({ formData, handleChange }) => {
  return (
    <>
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
    </>
  );
};

export default CourseBasicInfoForm;
