// Web-specific notification functions
// These replace the shared package notification dependencies for the web PWA

// Check if notifications are supported
function isNotificationSupported() {
  return 'Notification' in window;
}

// Check if notifications are enabled
export function isEnabled() {
  if (!isNotificationSupported()) {
    return false;
  }
  return Notification.permission === 'granted';
}

// Request notification permission
export function requestPermission() {
  if (!isNotificationSupported()) {
    return Promise.reject(new Error('Notifications not supported'));
  }
  
  return Notification.requestPermission();
}

// Initialize notifications
export function initializeNotifications() {
  if (!isNotificationSupported()) {
    console.warn('Notifications not supported in this browser');
    return Promise.resolve();
  }
  
  return requestPermission();
}

// Schedule daily reminders (web-specific implementation)
export function scheduleDailyReminders() {
  // Web notifications are not persistent, so we can't schedule them like mobile
  // This would typically be handled by a service worker or user interaction
  console.log('Daily reminders would be scheduled here in a real implementation');
  return Promise.resolve();
}

// Schedule followup reminders
export function scheduleFollowupReminders() {
  // Similar to daily reminders, this would be handled by service worker
  console.log('Followup reminders would be scheduled here in a real implementation');
  return Promise.resolve();
}

// Send test notification
export function sendTestNotification() {
  if (!isEnabled()) {
    return Promise.reject(new Error('Notifications not enabled'));
  }
  
  const notification = new Notification('Prayer & Praise', {
    body: 'This is a test notification!',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-192x192.png'
  });
  
  return Promise.resolve(notification);
}

// Default export for compatibility
export default {
  initializeNotifications,
  scheduleDailyReminders,
  scheduleFollowupReminders,
  sendTestNotification,
  isEnabled,
  requestPermission
};
