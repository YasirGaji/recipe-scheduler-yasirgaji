import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { ThemeProvider, useTheme } from './src/context/ThemeContext';
import EventsScreen from './src/screens/EventsScreen';
import AddEventScreen from './src/screens/AddEventScreen';
import NotificationsScreen from './src/screens/NotificationsScreen';
import EventDetailScreen from './src/screens/EventDetailScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function EventsStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="EventsList" 
        component={EventsScreen}
        options={{ title: 'My Events' }}
      />
      <Stack.Screen 
        name="EventDetail" 
        component={EventDetailScreen}
        options={{ title: 'Edit Event' }}
      />
    </Stack.Navigator>
  );
}

function AppNavigator() {
  const { colors, isDark } = useTheme();

  return (
    <NavigationContainer
      theme={{
        dark: isDark,
        colors: {
          primary: colors.primary,
          background: colors.background,
          card: colors.card,
          text: colors.text,
          border: colors.border,
          notification: colors.primary,
        },
      }}
    >
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.subtext,
          tabBarStyle: { backgroundColor: colors.card },
          headerStyle: { backgroundColor: colors.card },
          headerTintColor: colors.text,
        }}
      >
        <Tab.Screen 
          name="Events" 
          component={EventsStack}
          options={{ headerShown: false }}
        />
        <Tab.Screen 
          name="Add" 
          component={AddEventScreen}
          options={{ title: 'Add Event' }}
        />
        <Tab.Screen 
          name="Settings" 
          component={NotificationsScreen}
          options={{ title: 'Settings' }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider>
        <AppNavigator />
        <StatusBar style="auto" />
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}