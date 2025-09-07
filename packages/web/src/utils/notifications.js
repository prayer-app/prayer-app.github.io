// Notification Service for Prayer & Praise App
class NotificationService {
  constructor() {
    this.isSupported = 'Notification' in window;
    this.permission = this.isSupported ? Notification.permission : 'denied';
    this.settings = this.loadSettings();
  }

  // Load notification settings from localStorage
  loadSettings() {
    const defaultSettings = {
      enabled: false,
      followupReminders: true,
      dailyReminders: true,
      weeklySummary: true,
      soundEnabled: true,
      vibrationEnabled: true,
      reminderTime: '09:00', // Default reminder time
      reminderDays: [1, 2, 3, 4, 5, 6, 0], // All days of week
      pushNotifications: false,
      pushToken: null
    };

    try {
      const saved = localStorage.getItem('notificationSettings');
      return saved ? { ...defaultSettings, ...JSON.parse(saved) } : defaultSettings;
    } catch (error) {
      console.error('Error loading notification settings:', error);
      return defaultSettings;
    }
  }

  // Save notification settings to localStorage
  saveSettings(settings) {
    try {
      this.settings = { ...this.settings, ...settings };
      localStorage.setItem('notificationSettings', JSON.stringify(this.settings));
    } catch (error) {
      console.error('Error saving notification settings:', error);
    }
  }

  // Request notification permission
  async requestPermission() {
    if (!this.isSupported) {
      throw new Error('Notifications not supported in this browser');
    }

    try {
      const permission = await Notification.requestPermission();
      this.permission = permission;
      return permission;
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      throw error;
    }
  }

  // Check if notifications are enabled and permitted
  isEnabled() {
    return this.settings.enabled && this.permission === 'granted';
  }

  // Send a web browser notification
  async sendNotification(title, options = {}) {
    if (!this.isEnabled()) {
      return false;
    }

    try {
      const defaultOptions = {
        icon: '/icons/icon.svg',
        badge: '/icons/icon.svg',
        tag: 'prayer-app',
        requireInteraction: false,
        silent: !this.settings.soundEnabled,
        vibrate: this.settings.vibrationEnabled ? [200, 100, 200] : [],
        data: {
          timestamp: Date.now(),
          app: 'prayer-app'
        }
      };

      const notification = new Notification(title, { ...defaultOptions, ...options });
      
      // Auto-close after 5 seconds if not requiring interaction
      if (!options.requireInteraction) {
        setTimeout(() => notification.close(), 5000);
      }

      return true;
    } catch (error) {
      console.error('Error sending notification:', error);
      return false;
    }
  }

  // Send follow-up reminder notification
  async sendFollowupReminder(prayer) {
    if (!this.settings.followupReminders) return false;

    const title = 'Prayer Follow-up Reminder';
    const body = `Time to follow up on your prayer for ${prayer.person}`;
    
    return this.sendNotification(title, {
      body,
      tag: `followup-${prayer.id}`,
      requireInteraction: true,
      actions: [
        {
          action: 'view',
          title: 'View Prayer',
          icon: '/icons/icon.svg'
        },
        {
          action: 'dismiss',
          title: 'Dismiss'
        }
      ]
    });
  }

  // Send daily reminder notification
  async sendDailyReminder() {
    if (!this.settings.dailyReminders) return false;

    const title = 'Daily Prayer & Praise Reminder';
    const body = 'Take a moment to pray and give thanks today.';
    
    return this.sendNotification(title, {
      body,
      tag: 'daily-reminder',
      requireInteraction: false
    });
  }

  // Send weekly summary notification
  async sendWeeklySummary(stats) {
    if (!this.settings.weeklySummary) return false;

    const title = 'Weekly Prayer & Praise Summary';
    const body = `This week: ${stats.prayers} prayers, ${stats.praises} praises, ${stats.followups} follow-ups completed.`;
    
    return this.sendNotification(title, {
      body,
      tag: 'weekly-summary',
      requireInteraction: false
    });
  }

  // Schedule daily reminders
  scheduleDailyReminders() {
    if (!this.settings.dailyReminders || !this.isEnabled()) return;

    // Clear existing reminders
    this.clearScheduledReminders('daily');

    const [hours, minutes] = this.settings.reminderTime.split(':');
    const reminderTime = new Date();
    reminderTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);

    // If time has passed today, schedule for tomorrow
    if (reminderTime <= new Date()) {
      reminderTime.setDate(reminderTime.getDate() + 1);
    }

    const timeUntilReminder = reminderTime.getTime() - Date.now();
    
    setTimeout(() => {
      this.sendDailyReminder();
      // Schedule next day's reminder
      this.scheduleDailyReminders();
    }, timeUntilReminder);
  }

  // Schedule follow-up reminders
  scheduleFollowupReminders(prayers) {
    if (!this.settings.followupReminders || !this.isEnabled()) return;

    // Clear existing follow-up reminders
    this.clearScheduledReminders('followup');

    prayers.forEach(prayer => {
      if (prayer.followups && prayer.followups.length > 0) {
        const latestFollowup = prayer.followups[prayer.followups.length - 1];
        
        if (!latestFollowup.did_followup && latestFollowup.followup_at) {
          const followupDate = new Date(latestFollowup.followup_at);
          const now = new Date();
          
          // If follow-up date is in the future
          if (followupDate > now) {
            const timeUntilFollowup = followupDate.getTime() - now.getTime();
            
            setTimeout(() => {
              this.sendFollowupReminder(prayer);
            }, timeUntilFollowup);
          }
        }
      }
    });
  }

  // Clear scheduled reminders
  clearScheduledReminders(type) {
    // This would typically use a more sophisticated scheduling system
    // For now, we'll rely on setTimeout which gets cleared on page reload
    console.log(`Cleared ${type} reminders`);
  }

  // Initialize push notifications (for mobile apps)
  async initializePushNotifications() {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      console.log('Push notifications not supported');
      return false;
    }

    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: this.urlBase64ToUint8Array(process.env.REACT_APP_VAPID_PUBLIC_KEY)
      });

      this.settings.pushToken = subscription;
      this.settings.pushNotifications = true;
      this.saveSettings(this.settings);

      return true;
    } catch (error) {
      console.error('Error initializing push notifications:', error);
      return false;
    }
  }

  // Convert VAPID key to Uint8Array
  urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  // Get current settings
  getSettings() {
    return { ...this.settings };
  }

  // Update settings
  updateSettings(newSettings) {
    this.saveSettings(newSettings);
    
    // Re-schedule reminders if settings changed
    if (newSettings.dailyReminders !== this.settings.dailyReminders) {
      if (newSettings.dailyReminders) {
        this.scheduleDailyReminders();
      } else {
        this.clearScheduledReminders('daily');
      }
    }
  }

  // Test notification
  async testNotification() {
    return this.sendNotification('Test Notification', {
      body: 'This is a test notification from your Prayer & Praise app.',
      requireInteraction: true
    });
  }
}

// Create singleton instance
const notificationService = new NotificationService();

export default notificationService; 