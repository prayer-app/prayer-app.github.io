// Shared business logic for Prayer & Praise app
// This can be used by both PWA and React Native versions

export { 
  initializeStorage, 
  getPrayers, 
  savePrayers, 
  getPraises, 
  savePraises, 
  resetDatabase, 
  exportData 
} from './storage';

export { 
  generateUUID, 
  formatDateForStorage,
  formatDateForDisplay,
  isToday,
  isPastDue,
  getDaysUntil
} from './dateUtils';

export { 
  initializeNotifications,
  scheduleDailyReminders,
  scheduleFollowupReminders,
  sendTestNotification,
  isEnabled,
  requestPermission
} from './notifications';

// Shared constants
export const APP_NAME = 'Prayer & Praise';
export const APP_VERSION = '1.0.0';

// Shared types (for TypeScript-like documentation)
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