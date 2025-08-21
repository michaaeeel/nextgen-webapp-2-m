/**
 * Generates a secure random password that meets the following criteria:
 * - At least 12 characters long
 * - Contains uppercase and lowercase letters
 * - Contains numbers
 * - Contains special characters
 */
export const generatePassword = () => {
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const numbers = '0123456789';
  const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';
  
  const allChars = uppercase + lowercase + numbers + symbols;
  
  // Use crypto-secure random number generation
  const getRandomChar = (chars) => {
    const array = new Uint32Array(1);
    crypto.getRandomValues(array);
    return chars[array[0] % chars.length];
  };
  
  const getSecureRandom = (max) => {
    const array = new Uint32Array(1);
    crypto.getRandomValues(array);
    return array[0] % max;
  };
  
  // Ensure at least one of each type
  let password = 
    getRandomChar(uppercase) +
    getRandomChar(lowercase) +
    getRandomChar(numbers) +
    getRandomChar(symbols);
    
  // Add 8 more random characters
  for (let i = 0; i < 8; i++) {
    password += getRandomChar(allChars);
  }
  
  // Secure shuffle using Fisher-Yates algorithm
  const passwordArray = password.split('');
  for (let i = passwordArray.length - 1; i > 0; i--) {
    const j = getSecureRandom(i + 1);
    [passwordArray[i], passwordArray[j]] = [passwordArray[j], passwordArray[i]];
  }
  
  return passwordArray.join('');
};