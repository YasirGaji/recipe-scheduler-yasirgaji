import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';

export default function NotificationsScreen() {
  const { isDark, toggleTheme, colors } = useTheme();

  const dynamicStyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    content: {
      padding: 20,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 10,
      color: colors.text,
    },
    subtitle: {
      fontSize: 16,
      color: colors.subtext,
      marginBottom: 30,
    },
    section: {
      marginBottom: 30,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 15,
      color: colors.text,
    },
    themeToggle: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: colors.card,
      padding: 16,
      borderRadius: 8,
      marginBottom: 20,
    },
    themeText: {
      fontSize: 16,
      color: colors.text,
    },
    mockNotification: {
      backgroundColor: colors.card,
      padding: 16,
      borderRadius: 8,
      marginBottom: 20,
      borderWidth: 1,
      borderColor: colors.border,
    },
    notificationTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      marginBottom: 4,
      color: colors.text,
    },
    notificationBody: {
      fontSize: 14,
      color: colors.text,
      marginBottom: 8,
    },
    notificationTime: {
      fontSize: 12,
      color: colors.subtext,
    },
    note: {
      fontSize: 14,
      color: colors.subtext,
      fontStyle: 'italic',
      textAlign: 'center',
    },
  });

  return (
    <ScrollView style={dynamicStyles.container}>
      <View style={dynamicStyles.content}>
        <Text style={dynamicStyles.title}>Settings & Notifications</Text>
        
        <View style={dynamicStyles.section}>
          <Text style={dynamicStyles.sectionTitle}>Appearance</Text>
          <View style={dynamicStyles.themeToggle}>
            <Text style={dynamicStyles.themeText}>
              Dark Mode {isDark ? 'On' : 'Off'}
            </Text>
            <Switch
              value={isDark}
              onValueChange={toggleTheme}
              trackColor={{ false: '#767577', true: '#007AFF' }}
              thumbColor={isDark ? '#f5dd4b' : '#f4f3f4'}
            />
          </View>
        </View>

        <View style={dynamicStyles.section}>
          <Text style={dynamicStyles.sectionTitle}>Recent Notifications</Text>
          <Text style={dynamicStyles.subtitle}>
            Push notifications will appear here when reminders are sent.
          </Text>
          
          <View style={dynamicStyles.mockNotification}>
            <Text style={dynamicStyles.notificationTitle}>Recipe Reminder</Text>
            <Text style={dynamicStyles.notificationBody}>
              Time to: Bake sourdough bread
            </Text>
            <Text style={dynamicStyles.notificationTime}>
              15 minutes ago
            </Text>
          </View>
          
          <Text style={dynamicStyles.note}>
            This is a mock notification. Real notifications will appear here
            when the worker service sends reminders.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}