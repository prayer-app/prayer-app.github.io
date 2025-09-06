// Shared storage utilities for both PWA and React Native
// This will be platform-agnostic and can be extended for different storage backends

const STORAGE_KEYS = {
  PRAYERS: 'prayers',
  PRAISES: 'praises',
  SETTINGS: 'settings',
  NOTIFICATIONS: 'notifications'
};

// Platform detection
const isReactNative = typeof navigator === 'undefined' || navigator.product === 'ReactNative';
const isWeb = typeof window !== 'undefined' && typeof localStorage !== 'undefined';

// Storage interface
let storageInterface = null;

if (isReactNative) {
  // React Native AsyncStorage will be imported dynamically
  storageInterface = {
    async getItem(key) {
      const AsyncStorage = require('@react-native-async-storage/async-storage').default;
      return await AsyncStorage.getItem(key);
    },
    async setItem(key, value) {
      const AsyncStorage = require('@react-native-async-storage/async-storage').default;
      return await AsyncStorage.setItem(key, value);
    },
    async removeItem(key) {
      const AsyncStorage = require('@react-native-async-storage/async-storage').default;
      return await AsyncStorage.removeItem(key);
    }
  };
} else if (isWeb) {
  // Web localStorage
  storageInterface = {
    async getItem(key) {
      return localStorage.getItem(key);
    },
    async setItem(key, value) {
      localStorage.setItem(key, value);
    },
    async removeItem(key) {
      localStorage.removeItem(key);
    }
  };
}

// Initialize storage
export const initializeStorage = () => {
  if (!storageInterface) {
    console.warn('Storage interface not available for this platform');
    return;
  }
  
  // Initialize default settings if they don't exist
  getSettings().then(settings => {
    if (!settings) {
      const defaultSettings = {
        notifications: {
          enabled: false,
          followupReminders: true,
          dailyReminders: true,
          weeklySummaries: false,
          sound: true,
          vibration: true
        },
        theme: 'light',
        language: 'en'
      };
      saveSettings(defaultSettings);
    }
  });
};

// Prayer storage functions
export const getPrayers = async () => {
  try {
    const prayers = await storageInterface.getItem(STORAGE_KEYS.PRAYERS);
    return prayers ? JSON.parse(prayers) : [];
  } catch (error) {
    console.error('Error getting prayers:', error);
    return [];
  }
};

export const savePrayers = async (prayers) => {
  try {
    await storageInterface.setItem(STORAGE_KEYS.PRAYERS, JSON.stringify(prayers));
  } catch (error) {
    console.error('Error saving prayers:', error);
  }
};

// Praise storage functions
export const getPraises = async () => {
  try {
    const praises = await storageInterface.getItem(STORAGE_KEYS.PRAISES);
    return praises ? JSON.parse(praises) : [];
  } catch (error) {
    console.error('Error getting praises:', error);
    return [];
  }
};

export const savePraises = async (praises) => {
  try {
    await storageInterface.setItem(STORAGE_KEYS.PRAISES, JSON.stringify(praises));
  } catch (error) {
    console.error('Error saving praises:', error);
  }
};

// Settings storage functions
export const getSettings = async () => {
  try {
    const settings = await storageInterface.getItem(STORAGE_KEYS.SETTINGS);
    return settings ? JSON.parse(settings) : null;
  } catch (error) {
    console.error('Error getting settings:', error);
    return null;
  }
};

export const saveSettings = async (settings) => {
  try {
    await storageInterface.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  } catch (error) {
    console.error('Error saving settings:', error);
  }
};

// Data export function
export const exportData = async () => {
  try {
    const prayers = await getPrayers();
    const praises = await getPraises();
    const settings = await getSettings();
    
    return {
      prayers,
      praises,
      settings,
      exportDate: new Date().toISOString(),
      version: '1.0.0'
    };
  } catch (error) {
    console.error('Error exporting data:', error);
    return null;
  }
};

// Reset database function
export const resetDatabase = async () => {
  try {
    await storageInterface.removeItem(STORAGE_KEYS.PRAYERS);
    await storageInterface.removeItem(STORAGE_KEYS.PRAISES);
    await storageInterface.removeItem(STORAGE_KEYS.SETTINGS);
    await storageInterface.removeItem(STORAGE_KEYS.NOTIFICATIONS);
  } catch (error) {
    console.error('Error resetting database:', error);
  }
}; 