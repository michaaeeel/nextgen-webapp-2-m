
/**
 * Validates if a given URL is a valid YouTube URL
 * @param {string} url - The URL to validate
 * @returns {boolean} - Whether the URL is valid
 */
export const isValidYoutubeUrl = (url) => {
  if (!url) return true; // Empty URLs are allowed
  const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/;
  return youtubeRegex.test(url);
};
