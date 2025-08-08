import React, { useState } from 'react';
import axios from 'axios';

const VideoUploader = () => {
  const [videoUrl, setVideoUrl] = useState('');
  const [cloudinaryUrl, setCloudinaryUrl] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Replace with your own upload_preset if needed
    const CLOUDINARY_UPLOAD_PRESET = 'your-upload-preset';
    const CLOUDINARY_CLOUD_NAME = 'your-cloud-name';

    const formData = new FormData();
    formData.append('file', videoUrl);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

    try {
      const res = await axios.post(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/video/upload`,
        formData
      );
      setCloudinaryUrl(res.data.secure_url);
    } catch (err) {
      console.error('Upload failed', err);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="url"
          placeholder="Paste video URL (e.g. YouTube or direct link)"
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
          required
        />
        <button type="submit">Upload to Cloudinary</button>
      </form>

      {cloudinaryUrl && (
        <video width="640" height="360" controls autoPlay muted>
          <source src={cloudinaryUrl} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      )}
    </div>
  );
};

export default VideoUploader;
