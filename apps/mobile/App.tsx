import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { ThemeProvider } from './src/context/ThemeContext';
import EventsScreen from './src/screens/EventsScreen';
import AddEventScreen from './src/screens/AddEventScreen';
import NotificationsScreen from './src/screens/NotificationsScreen';
import EventDetailScreen from './src/screens/EventDetailScreen';
import type { RootStackParamList, TabParamList } from './src/types/navigation';

const Tab = createBottomTabNavigator<TabParamList>();
const Stack = createNativeStackNavigator<RootStackParamList>();

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

export default function App() {
  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <ThemeProvider>
          <NavigationContainer>
            <Tab.Navigator>
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
          <StatusBar style="auto" />
        </ThemeProvider>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}