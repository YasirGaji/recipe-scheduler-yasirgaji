import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import EventsScreen from './src/screens/EventsScreen';
import AddEventScreen from './src/screens/AddEventScreen';
import NotificationsScreen from './src/screens/NotificationsScreen';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: '#007AFF',
          headerStyle: { backgroundColor: '#f8f9fa' },
        }}
      >
        <Tab.Screen 
          name="Events" 
          component={EventsScreen}
          options={{ title: 'My Events' }}
        />
        <Tab.Screen 
          name="Add" 
          component={AddEventScreen}
          options={{ title: 'Add Event' }}
        />
        <Tab.Screen 
          name="Notifications" 
          component={NotificationsScreen}
          options={{ title: 'Notifications' }}
        />
      </Tab.Navigator>
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}