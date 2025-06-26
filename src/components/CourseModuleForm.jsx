import React from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { X, Youtube, FileText } from "lucide-react";
import { getYoutubeEmbedUrl } from "@/utils/youtubeUtils";

const CourseModuleForm = ({ 
  module, 
  index, 
  onModuleChange, 
  onRemoveModule 
}) => {
  const handleCloudinaryUpload = () => {
    window.cloudinary.openUploadWidget(
      {
        cloudName: 'dlze4fct7', // replace with your Cloudinary cloud name
        uploadPreset: 'unsigned_videos', // replace with your unsigned upload preset
        sources: ['local', 'url', 'camera'],
        resourceType: 'video',
        multiple: false,
        maxFileSize: 500000000, // optional: limit file size (bytes)
      },
      (error, result) => {
        if (!error && result && result.event === "success") {
          // Store the uploaded video URL in module.videoUrl
          onModuleChange(index, 'videoUrl', result.info.secure_url);
        }
      }
    );
  };

  return (
    <Card key={index} className="p-4 relative">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={() => onRemoveModule(index)}
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
            onChange={(e) => onModuleChange(index, 'title', e.target.value)}
            placeholder="Getting Started with HTML"
          />
        </div>
        <div>
          <Label htmlFor={`module-description-${index}`}>Module Description</Label>
          <Textarea
            id={`module-description-${index}`}
            value={module.description}
            onChange={(e) => onModuleChange(index, 'description', e.target.value)}
            placeholder="Learn the basics of HTML structure..."
            rows={2}
          />
        </div>
        <div>
          <Label className="flex items-center gap-2">
            <Youtube size={16} /> Upload Video
          </Label>
          <Button type="button" onClick={handleCloudinaryUpload}>
            Upload Video
          </Button>
          {module.videoUrl && (
            <div className="mt-2">
              <Label>Video Preview</Label>
              <video
                src={module.videoUrl}
                controls
                className="w-full h-56 rounded"
              />
            </div>
          )}
        </div>
        
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
            onChange={(e) => onModuleChange(index, 'content', e.target.value)}
            placeholder="Enter detailed content or instructions for this module..."
            rows={4}
          />
        </div>
      </div>
    </Card>
  );
};

export default CourseModuleForm;
