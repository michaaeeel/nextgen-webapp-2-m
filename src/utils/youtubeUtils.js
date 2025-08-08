
/**
 * Validates if a given URL is a valid YouTube URL
 * @param {string} url - The URL to validate
 * @returns {boolean} - Whether the URL is valid
 */
export const isValidvideoUrl = (url) => {
  if (!url) return true; // Empty URLs are allowed
  const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/;
  return youtubeRegex.test(url);
};

/**
 * Extracts and returns a YouTube embed URL from various YouTube URL formats
 * @param {string} url - The YouTube URL to convert
 * @returns {string|null} - The embed URL or null if invalid
 */
export const getYoutubeEmbedUrl = (url) => {
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
