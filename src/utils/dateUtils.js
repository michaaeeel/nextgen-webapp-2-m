/**
 * Adds the specified number of days to a given date
 * @param {Date} date - The starting date
 * @param {number} days - Number of days to add
 * @returns {Date} New date with added days
 */
export const addDays = (date, days) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};