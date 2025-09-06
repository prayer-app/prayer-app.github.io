import { formatInTimeZone, utcToZonedTime, zonedTimeToUtc } from 'date-fns-tz';
import { format } from 'date-fns';

const localTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

// Date handling functions
export function getTodayLocal() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
}

export function localToUTC(date) {
  // Create a new date object to avoid modifying the input
  const localDate = new Date(date);
  // Set the time to noon to avoid any date shifting
  localDate.setHours(12, 0, 0, 0);
  const utcDate = zonedTimeToUtc(localDate, localTimezone);
  return utcDate;
}

export function utcToLocal(utcDate) {
  // Create a new date object to avoid modifying the input
  const date = new Date(utcDate);
  // Set the time to noon to avoid any date shifting
  date.setHours(12, 0, 0, 0);
  const localDate = utcToZonedTime(date, localTimezone);
  return localDate;
}

// Helper Functions
export const formatDateForStorage = (date) => {
  if (!date) return null;
  try {
    // Convert to ISO string and store in UTC
    return date.toISOString();
  } catch (error) {
    console.error('Error formatting date:', error);
    return null;
  }
};

export const formatDateForDisplay = (dateString) => {
  if (!dateString) return '';
  try {
    const date = new Date(dateString);
    return format(date, 'MMM d, yyyy');
  } catch (error) {
    console.error('Error formatting date for display:', error);
    return '';
  }
};

// Format date to "SEPT 5th 2025" format for display
export function formatDate(dateString) {
  // Create a new date object to avoid modifying the input
  const date = new Date(dateString);
  // Set the time to noon to avoid any date shifting
  date.setHours(12, 0, 0, 0);
  const localDate = utcToLocal(date);
  const formattedDate = formatInTimeZone(localDate, localTimezone, 'MMM do yyyy');
  return formattedDate.toUpperCase();
}

// Generate UUID
export function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
} 