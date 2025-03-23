
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { X, Youtube, FileText } from "lucide-react";

const CourseModuleForm = ({ 
  module, 
  index, 
  onModuleChange, 
  onRemoveModule 
}) => {
  // YouTube URL validation and embed URL generation
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
          <Label 
            htmlFor={`module-youtube-${index}`}
            className="flex items-center gap-2"
          >
            <Youtube size={16} /> YouTube Video URL
          </Label>
          <Input
            id={`module-youtube-${index}`}
            value={module.youtubeUrl || ''}
            onChange={(e) => onModuleChange(index, 'youtubeUrl', e.target.value)}
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
