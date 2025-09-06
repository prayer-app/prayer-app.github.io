// Shared notification service for both PWA and React Native
// Platform-specific implementations will be handled separately

// Platform detection
const isReactNative = typeof navigator === 'undefined' || navigator.product === 'ReactNative';
const isWeb = typeof window !== 'undefined' && typeof Notification !== 'undefined';

// Default settings
const defaultSettings = {
  enabled: false,
  followupReminders: true,
  dailyReminders: true,
  weeklySummaries: false,
  sound: true,
  vibration: true
};

// Notification service class
class NotificationService {
  constructor() {
    this.settings = defaultSettings;
    this.isInitialized = false;
  }

  // Initialize the notification service
  async initialize() {
    if (this.isInitialized) return;

    try {
      if (isReactNative) {
        // React Native implementation
        await this.initializeReactNative();
      } else if (isWeb) {
        // Web implementation
        await this.initializeWeb();
      }
      
      this.isInitialized = true;
    } catch (error) {
      console.error('Failed to initialize notifications:', error);
    }
  }

  // Initialize React Native notifications
  async initializeReactNative() {
    try {
      // Import React Native specific modules
      const PushNotification = require('react-native-push-notification').default;
      const AsyncStorage = require('@react-native-async-storage/async-storage').default;
      
      // Configure push notifications
      PushNotification.configure({
        onRegister: function (token) {
          console.log('TOKEN:', token);
        },
        onNotification: function (notification) {
          console.log('NOTIFICATION:', notification);
        },
        permissions: {
          alert: true,
          badge: true,
          sound: true,
        },
        popInitialNotification: true,
        requestPermissions: true,
      });

      // Create notification channel for Android
      PushNotification.createChannel(
        {
          channelId: 'prayer-praise-channel',
          channelName: 'Prayer & Praise Notifications',
          channelDescription: 'Notifications for prayer follow-ups and daily reminders',
          playSound: true,
          soundName: 'default',
          importance: 4,
          vibrate: true,
        },
        (created) => console.log(`Channel created: ${created}`)
      );

      // Load settings from storage
      const settingsData = await AsyncStorage.getItem('notificationSettings');
      if (settingsData) {
        this.settings = { ...defaultSettings, ...JSON.parse(settingsData) };
      }
    } catch (error) {
      console.error('Error initializing React Native notifications:', error);
    }
  }

  // Initialize Web notifications
  async initializeWeb() {
    try {
      // Check if notifications are supported
      if (!('Notification' in window)) {
        console.warn('This browser does not support notifications');
        return;
      }

      // Load settings from localStorage
      const settingsData = localStorage.getItem('notificationSettings');
      if (settingsData) {
        this.settings = { ...defaultSettings, ...JSON.parse(settingsData) };
      }

      // Request permission if not granted
      if (Notification.permission === 'default') {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
          this.settings.enabled = true;
          this.saveSettings();
        }
      }
    } catch (error) {
      console.error('Error initializing web notifications:', error);
    }
  }

  // Save notification settings
  async saveSettings() {
    try {
      if (isReactNative) {
        const AsyncStorage = require('@react-native-async-storage/async-storage').default;
        await AsyncStorage.setItem('notificationSettings', JSON.stringify(this.settings));
      } else {
        localStorage.setItem('notificationSettings', JSON.stringify(this.settings));
      }
    } catch (error) {
      console.error('Error saving notification settings:', error);
    }
  }

  // Update settings
  async updateSettings(newSettings) {
    this.settings = { ...this.settings, ...newSettings };
    await this.saveSettings();
  }

  // Check if notifications are enabled
  isEnabled() {
    return this.settings.enabled;
  }

  // Request permission (web only)
  async requestPermission() {
    if (isWeb && 'Notification' in window) {
      const permission = await Notification.requestPermission();
      this.settings.enabled = permission === 'granted';
      await this.saveSettings();
      return permission;
    }
    return 'granted'; // React Native handles permissions differently
  }

  // Send a test notification
  async sendTestNotification() {
    if (!this.isEnabled()) return;

    try {
      if (isReactNative) {
        const PushNotification = require('react-native-push-notification').default;
        PushNotification.localNotification({
          channelId: 'prayer-praise-channel',
          title: 'Prayer & Praise',
          message: 'This is a test notification!',
          playSound: this.settings.sound,
          soundName: 'default',
          vibrate: this.settings.vibration,
        });
      } else {
        new Notification('Prayer & Praise', {
          body: 'This is a test notification!',
          icon: '/favicon.ico',
          badge: '/favicon.ico',
          tag: 'test-notification'
        });
      }
    } catch (error) {
      console.error('Error sending test notification:', error);
    }
  }

  // Schedule daily reminders
  async scheduleDailyReminders() {
    if (!this.isEnabled() || !this.settings.dailyReminders) return;

    try {
      if (isReactNative) {
        const PushNotification = require('react-native-push-notification').default;
        
        // Cancel existing daily reminders
        PushNotification.cancelLocalNotifications({ id: 'daily-reminder' });
        
        // Schedule new daily reminder for 9 AM
        PushNotification.localNotificationSchedule({
          id: 'daily-reminder',
          channelId: 'prayer-praise-channel',
          title: 'Daily Prayer Time',
          message: 'Take a moment to pray and give thanks today.',
          date: this.getNextDailyReminderTime(),
          repeatType: 'day',
          playSound: this.settings.sound,
          soundName: 'default',
          vibrate: this.settings.vibration,
        });
      } else {
        // Web implementation would use service workers
        // This is handled by the PWA service worker
      }
    } catch (error) {
      console.error('Error scheduling daily reminders:', error);
    }
  }

  // Schedule follow-up reminders
  async scheduleFollowupReminders(prayers) {
    if (!this.isEnabled() || !this.settings.followupReminders) return;

    try {
      if (isReactNative) {
        const PushNotification = require('react-native-push-notification').default;
        
        // Cancel existing follow-up reminders
        PushNotification.cancelLocalNotifications({ id: 'followup-reminder' });
        
        // Find prayers with upcoming follow-ups
        const upcomingFollowups = prayers
          .filter(prayer => !prayer.is_answered && !prayer.is_archived && !prayer.is_removed)
          .flatMap(prayer => 
            prayer.followups
              .filter(followup => !followup.did_followup && !followup.followedup_at)
              .map(followup => ({
                prayerId: prayer.id,
                prayerText: prayer.prayer,
                person: prayer.person,
                followupDate: followup.followup_at
              }))
          )
          .filter(followup => {
            const daysUntil = this.getDaysUntil(followup.followupDate);
            return daysUntil >= 0 && daysUntil <= 7; // Only schedule for next 7 days
          });

        // Schedule notifications for each follow-up
        upcomingFollowups.forEach((followup, index) => {
          const followupDate = new Date(followup.followupDate);
          followupDate.setHours(9, 0, 0, 0); // Set to 9 AM

          PushNotification.localNotificationSchedule({
            id: `followup-reminder-${followup.prayerId}-${index}`,
            channelId: 'prayer-praise-channel',
            title: 'Prayer Follow-up',
            message: `Time to follow up on your prayer for ${followup.person}`,
            date: followupDate,
            playSound: this.settings.sound,
            soundName: 'default',
            vibrate: this.settings.vibration,
            userInfo: {
              prayerId: followup.prayerId,
              type: 'followup-reminder'
            }
          });
        });
      } else {
        // Web implementation would use service workers
        // This is handled by the PWA service worker
      }
    } catch (error) {
      console.error('Error scheduling follow-up reminders:', error);
    }
  }

  // Get next daily reminder time (9 AM tomorrow)
  getNextDailyReminderTime() {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(9, 0, 0, 0);
    return tomorrow;
  }

  // Get days until date (helper function)
  getDaysUntil(dateString) {
    const date = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    date.setHours(0, 0, 0, 0);
    return Math.ceil((date - today) / (1000 * 60 * 60 * 24));
  }
}

// Export singleton instance
const notificationService = new NotificationService();

// Export functions for compatibility
export const initializeNotifications = () => notificationService.initialize();
export const scheduleDailyReminders = () => notificationService.scheduleDailyReminders();
export const scheduleFollowupReminders = (prayers) => notificationService.scheduleFollowupReminders(prayers);
export const sendTestNotification = () => notificationService.sendTestNotification();
export const isEnabled = () => notificationService.isEnabled();
export const requestPermission = () => notificationService.requestPermission();

export default notificationService; 