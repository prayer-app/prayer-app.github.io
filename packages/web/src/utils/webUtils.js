// Web-specific utility functions
// These replace the shared package dependencies for the web PWA

// Generate a simple UUID
export function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

// Format date for storage (ISO string)
export function formatDateForStorage(date = new Date()) {
  return date.toISOString();
}

// Format date for display
export function formatDateForDisplay(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

// Check if date is today
export function isToday(dateString) {
  const date = new Date(dateString);
  const today = new Date();
  return date.toDateString() === today.toDateString();
}

// Check if date is past due
export function isPastDue(dateString) {
  const date = new Date(dateString);
  const today = new Date();
  return date < today;
}

// Get days until a date
export function getDaysUntil(dateString) {
  const date = new Date(dateString);
  const today = new Date();
  const diffTime = date - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

// App constants
export const APP_NAME = 'Prayer & Praise';
export const APP_VERSION = '1.0.0';

// Status constants
export const PRAYER_STATUS = {
  ACTIVE: 'active',
  ANSWERED: 'answered',
  ARCHIVED: 'archived',
  REMOVED: 'removed'
};

export const NOTIFICATION_TYPES = {
  DAILY_REMINDER: 'daily_reminder',
  FOLLOWUP_REMINDER: 'followup_reminder',
  WEEKLY_SUMMARY: 'weekly_summary'
};
