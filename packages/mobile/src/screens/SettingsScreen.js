import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import {
  List,
  Switch,
  Divider,
  Button,
  Text,
  Card,
  Title,
  Paragraph,
} from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';

// Import shared utilities
import { getSettings, saveSettings, resetDatabase, exportData } from '@prayer-app/shared';
import notificationService from '@prayer-app/shared/notifications';

const SettingsScreen = () => {
  const insets = useSafeAreaInsets();
  const [settings, setSettings] = useState({
    notifications: {
      enabled: false,
      followupReminders: true,
      dailyReminders: true,
      weeklySummaries: false,
      sound: true,
      vibration: true,
    },
    theme: 'light',
    language: 'en',
  });

  // Load settings on mount
  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const savedSettings = await getSettings();
      if (savedSettings) {
        setSettings(savedSettings);
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const updateSettings = async (newSettings) => {
    try {
      const updatedSettings = { ...settings, ...newSettings };
      setSettings(updatedSettings);
      await saveSettings(updatedSettings);
      
      // Update notification service settings
      if (newSettings.notifications) {
        await notificationService.updateSettings(newSettings.notifications);
        
        // Re-schedule notifications if enabled
        if (newSettings.notifications.enabled) {
          await notificationService.scheduleDailyReminders();
        }
      }
    } catch (error) {
      console.error('Error updating settings:', error);
    }
  };

  const handleNotificationToggle = async () => {
    if (!settings.notifications.enabled) {
      const permission = await notificationService.requestPermission();
      if (permission !== 'granted') {
        Alert.alert(
          'Permission Required',
          'Please enable notifications in your device settings to receive prayer reminders.',
          [{ text: 'OK' }]
        );
        return;
      }
    }
    
    updateSettings({
      notifications: {
        ...settings.notifications,
        enabled: !settings.notifications.enabled,
      },
    });
  };

  const handleTestNotification = async () => {
    try {
      await notificationService.sendTestNotification();
      Alert.alert('Success', 'Test notification sent!');
    } catch (error) {
      Alert.alert('Error', 'Failed to send test notification. Please check your notification settings.');
    }
  };

  const handleExportData = async () => {
    try {
      const data = await exportData();
      if (data) {
        // In a real app, you would share this data or save it to a file
        Alert.alert(
          'Data Exported',
          'Your data has been prepared for export. In a full implementation, this would be shared or saved to a file.',
          [{ text: 'OK' }]
        );
        console.log('Exported data:', data);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to export data.');
    }
  };

  const handleResetData = () => {
    Alert.alert(
      'Reset All Data',
      'This will permanently delete all your prayers, praises, and settings. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: async () => {
            try {
              await resetDatabase();
              Alert.alert('Success', 'All data has been reset.');
              // Reload settings to get defaults
              loadSettings();
            } catch (error) {
              Alert.alert('Error', 'Failed to reset data.');
            }
          },
        },
      ]
    );
  };

  return (
    <ScrollView 
      style={[styles.container, { paddingTop: insets.top }]}
      contentContainerStyle={styles.content}
    >
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.sectionTitle}>
            <Icon name="notifications" size={20} color="#007AFF" />
            {' '}Notifications
          </Title>
          <Paragraph style={styles.sectionDescription}>
            Configure how and when you receive prayer reminders
          </Paragraph>
        </Card.Content>
      </Card>

      <List.Section>
        <List.Item
          title="Enable Notifications"
          description="Receive prayer follow-up reminders and daily notifications"
          left={(props) => <List.Icon {...props} icon="notifications" />}
          right={() => (
            <Switch
              value={settings.notifications.enabled}
              onValueChange={handleNotificationToggle}
            />
          )}
        />
        
        {settings.notifications.enabled && (
          <>
            <List.Item
              title="Follow-up Reminders"
              description="Get notified when it's time to follow up on prayers"
              left={(props) => <List.Icon {...props} icon="schedule" />}
              right={() => (
                <Switch
                  value={settings.notifications.followupReminders}
                  onValueChange={(value) =>
                    updateSettings({
                      notifications: {
                        ...settings.notifications,
                        followupReminders: value,
                      },
                    })
                  }
                />
              )}
            />
            
            <List.Item
              title="Daily Reminders"
              description="Receive daily prayer time reminders"
              left={(props) => <List.Icon {...props} icon="today" />}
              right={() => (
                <Switch
                  value={settings.notifications.dailyReminders}
                  onValueChange={(value) =>
                    updateSettings({
                      notifications: {
                        ...settings.notifications,
                        dailyReminders: value,
                      },
                    })
                  }
                />
              )}
            />
            
            <List.Item
              title="Weekly Summaries"
              description="Get a weekly summary of your prayer activity"
              left={(props) => <List.Icon {...props} icon="assessment" />}
              right={() => (
                <Switch
                  value={settings.notifications.weeklySummaries}
                  onValueChange={(value) =>
                    updateSettings({
                      notifications: {
                        ...settings.notifications,
                        weeklySummaries: value,
                      },
                    })
                  }
                />
              )}
            />
            
            <List.Item
              title="Sound"
              description="Play sound with notifications"
              left={(props) => <List.Icon {...props} icon="volume-up" />}
              right={() => (
                <Switch
                  value={settings.notifications.sound}
                  onValueChange={(value) =>
                    updateSettings({
                      notifications: {
                        ...settings.notifications,
                        sound: value,
                      },
                    })
                  }
                />
              )}
            />
            
            <List.Item
              title="Vibration"
              description="Vibrate with notifications"
              left={(props) => <List.Icon {...props} icon="vibration" />}
              right={() => (
                <Switch
                  value={settings.notifications.vibration}
                  onValueChange={(value) =>
                    updateSettings({
                      notifications: {
                        ...settings.notifications,
                        vibration: value,
                      },
                    })
                  }
                />
              )}
            />
          </>
        )}
      </List.Section>

      <Divider />

      <List.Section>
        <List.Item
          title="Test Notification"
          description="Send a test notification to verify your settings"
          left={(props) => <List.Icon {...props} icon="send" />}
          onPress={handleTestNotification}
        />
      </List.Section>

      <Divider />

      <List.Section>
        <List.Item
          title="Export Data"
          description="Export all your prayers and praises"
          left={(props) => <List.Icon {...props} icon="file-download" />}
          onPress={handleExportData}
        />
        
        <List.Item
          title="Reset All Data"
          description="Permanently delete all data"
          left={(props) => <List.Icon {...props} icon="delete-forever" color="#f44336" />}
          onPress={handleResetData}
          titleStyle={{ color: '#f44336' }}
        />
      </List.Section>

      <Card style={styles.infoCard}>
        <Card.Content>
          <Title style={styles.infoTitle}>About Prayer & Praise</Title>
          <Paragraph style={styles.infoText}>
            Version 1.0.0{'\n'}
            A simple app to help you track prayer requests and give thanks for answered prayers.
          </Paragraph>
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    paddingBottom: 20,
  },
  card: {
    margin: 16,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  sectionDescription: {
    fontSize: 14,
    color: '#666',
  },
  infoCard: {
    margin: 16,
    marginTop: 8,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
});

export default SettingsScreen; 