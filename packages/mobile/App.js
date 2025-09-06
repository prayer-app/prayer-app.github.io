import React, { useState, useEffect, useCallback } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider as PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';

// Import shared business logic
import { 
  initializeStorage, 
  getPrayers, 
  savePrayers, 
  getPraises, 
  savePraises,
  generateUUID,
  formatDateForStorage
} from '@prayer-app/shared';

// Import notification service
import notificationService from '@prayer-app/shared/notifications';

// Import screens
import PrayerListScreen from './src/screens/PrayerListScreen';
import PraiseListScreen from './src/screens/PraiseListScreen';
import PrayerDetailsScreen from './src/screens/PrayerDetailsScreen';
import PraiseDetailsScreen from './src/screens/PraiseDetailsScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import AddPrayerScreen from './src/screens/AddPrayerScreen';
import AddPraiseScreen from './src/screens/AddPraiseScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Tab Navigator
function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Prayers') {
            iconName = 'prayer-times';
          } else if (route.name === 'Praises') {
            iconName = 'celebration';
          } else if (route.name === 'Settings') {
            iconName = 'settings';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tab.Screen name="Prayers" component={PrayerStackNavigator} />
      <Tab.Screen name="Praises" component={PraiseStackNavigator} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}

// Prayer Stack Navigator
function PrayerStackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#007AFF',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen 
        name="PrayerList" 
        component={PrayerListScreen} 
        options={{ title: 'Prayers' }}
      />
      <Stack.Screen 
        name="PrayerDetails" 
        component={PrayerDetailsScreen} 
        options={{ title: 'Prayer Details' }}
      />
      <Stack.Screen 
        name="AddPrayer" 
        component={AddPrayerScreen} 
        options={{ title: 'Add Prayer' }}
      />
    </Stack.Navigator>
  );
}

// Praise Stack Navigator
function PraiseStackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#34C759',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen 
        name="PraiseList" 
        component={PraiseListScreen} 
        options={{ title: 'Praises' }}
      />
      <Stack.Screen 
        name="PraiseDetails" 
        component={PraiseDetailsScreen} 
        options={{ title: 'Praise Details' }}
      />
      <Stack.Screen 
        name="AddPraise" 
        component={AddPraiseScreen} 
        options={{ title: 'Add Praise' }}
      />
    </Stack.Navigator>
  );
}

// Main App Component
function App() {
  const [prayers, setPrayers] = useState([]);
  const [praises, setPraises] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize app
  useEffect(() => {
    const initializeApp = async () => {
      try {
        await initializeStorage();
        await notificationService.initialize();
        
        const loadedPrayers = await getPrayers();
        const loadedPraises = await getPraises();
        
        setPrayers(loadedPrayers);
        setPraises(loadedPraises);
        
        // Schedule notifications
        if (notificationService.isEnabled()) {
          await notificationService.scheduleDailyReminders();
          await notificationService.scheduleFollowupReminders(loadedPrayers);
        }
      } catch (error) {
        console.error('Error initializing app:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeApp();
  }, []);

  // Prayer handlers
  const handleAddPrayer = useCallback(async (formData) => {
    const prayer = {
      id: generateUUID(),
      person: formData.person,
      prayer: formData.prayer,
      followups: [],
      is_answered: false,
      is_removed: false,
      is_archived: false
    };

    // Add follow-up if date is provided
    if (formData.followup_at) {
      const date = new Date(formData.followup_at);
      date.setHours(0, 0, 0, 0);
      prayer.followups.push({
        followup_at: formatDateForStorage(date),
        followedup_at: null,
        did_followup: false
      });
    }

    const updatedPrayers = [...prayers, prayer];
    setPrayers(updatedPrayers);
    await savePrayers(updatedPrayers);
    
    // Update notifications
    if (notificationService.isEnabled()) {
      await notificationService.scheduleFollowupReminders(updatedPrayers);
    }
  }, [prayers]);

  const handleUpdatePrayer = useCallback(async (prayerId, updates) => {
    const updatedPrayers = prayers.map(prayer => 
      prayer.id === prayerId ? { ...prayer, ...updates } : prayer
    );
    setPrayers(updatedPrayers);
    await savePrayers(updatedPrayers);
    
    // Update notifications
    if (notificationService.isEnabled()) {
      await notificationService.scheduleFollowupReminders(updatedPrayers);
    }
  }, [prayers]);

  const handleRemovePrayer = useCallback(async (prayerId) => {
    const updatedPrayers = prayers.map(prayer => 
      prayer.id === prayerId ? { ...prayer, is_removed: true } : prayer
    );
    setPrayers(updatedPrayers);
    await savePrayers(updatedPrayers);
  }, [prayers]);

  // Praise handlers
  const handleAddPraise = useCallback(async (praiseText) => {
    const praise = {
      id: Date.now(),
      text: praiseText,
      date: new Date().toISOString(),
    };

    const updatedPraises = [...praises, praise];
    setPraises(updatedPraises);
    await savePraises(updatedPraises);
  }, [praises]);

  const handleUpdatePraise = useCallback(async (praiseId, updates) => {
    const updatedPraises = praises.map(praise => 
      praise.id === praiseId ? { ...praise, ...updates } : praise
    );
    setPraises(updatedPraises);
    await savePraises(updatedPraises);
  }, [praises]);

  const handleRemovePraise = useCallback(async (praiseId) => {
    const updatedPraises = praises.filter(praise => praise.id !== praiseId);
    setPraises(updatedPraises);
    await savePraises(updatedPraises);
  }, [praises]);

  // Create context value for passing data to screens
  const appContext = {
    prayers,
    praises,
    isLoading,
    handleAddPrayer,
    handleUpdatePrayer,
    handleRemovePrayer,
    handleAddPraise,
    handleUpdatePraise,
    handleRemovePraise,
  };

  if (isLoading) {
    // You can add a loading screen here
    return null;
  }

  return (
    <SafeAreaProvider>
      <PaperProvider>
        <NavigationContainer>
          <TabNavigator />
        </NavigationContainer>
      </PaperProvider>
    </SafeAreaProvider>
  );
}

export default App; 