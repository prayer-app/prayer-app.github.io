// Shared date utilities for both PWA and React Native
import { format, parseISO, isToday as dateFnsIsToday, differenceInDays } from 'date-fns';

// Generate UUID for prayer/praise IDs
export const generateUUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

// Format date for storage (ISO string)
export const formatDateForStorage = (date) => {
  if (typeof date === 'string') {
    return date;
  }
  return date.toISOString();
};

// Format date for display
export const formatDateForDisplay = (dateString, formatString = 'MMM dd, yyyy') => {
  try {
    const date = typeof dateString === 'string' ? parseISO(dateString) : dateString;
    return format(date, formatString);
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid date';
  }
};

// Check if date is today
export const isToday = (dateString) => {
  try {
    const date = typeof dateString === 'string' ? parseISO(dateString) : dateString;
    return dateFnsIsToday(date);
  } catch (error) {
    console.error('Error checking if date is today:', error);
    return false;
  }
};

// Check if date is past due
export const isPastDue = (dateString) => {
  try {
    const date = typeof dateString === 'string' ? parseISO(dateString) : dateString;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    date.setHours(0, 0, 0, 0);
    return date < today;
  } catch (error) {
    console.error('Error checking if date is past due:', error);
    return false;
  }
};

// Get days until date
export const getDaysUntil = (dateString) => {
  try {
    const date = typeof dateString === 'string' ? parseISO(dateString) : dateString;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    date.setHours(0, 0, 0, 0);
    return differenceInDays(date, today);
  } catch (error) {
    console.error('Error calculating days until date:', error);
    return 0;
  }
};

// Format relative time (e.g., "2 days ago", "in 3 days")
export const formatRelativeTime = (dateString) => {
  try {
    const daysUntil = getDaysUntil(dateString);
    
    if (daysUntil === 0) {
      return 'Today';
    } else if (daysUntil === 1) {
      return 'Tomorrow';
    } else if (daysUntil === -1) {
      return 'Yesterday';
    } else if (daysUntil > 0) {
      return `in ${daysUntil} day${daysUntil === 1 ? '' : 's'}`;
    } else {
      return `${Math.abs(daysUntil)} day${Math.abs(daysUntil) === 1 ? '' : 's'} ago`;
    }
  } catch (error) {
    console.error('Error formatting relative time:', error);
    return 'Unknown';
  }
};

// Get date for next follow-up (default to 7 days from now)
export const getNextFollowupDate = (daysFromNow = 7) => {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  date.setHours(0, 0, 0, 0);
  return formatDateForStorage(date);
};

// Validate date string
export const isValidDate = (dateString) => {
  try {
    const date = parseISO(dateString);
    return !isNaN(date.getTime());
  } catch (error) {
    return false;
  }
}; 