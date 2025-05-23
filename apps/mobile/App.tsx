import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, Alert } from 'react-native';
import { useState } from 'react';

export default function App() {
  const [isLoaded, setIsLoaded] = useState(false);

  const handleTestApi = async () => {
    try {
      const apiUrl = 'http://10.0.2.2:3000/api/events';
      
      const response = await fetch(apiUrl);
      const events = await response.json();
      Alert.alert('API Test Success!', `Found ${events.length} events`);
    } catch (error) {
      Alert.alert('API Error', 'Could not connect to API');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recipe Scheduler</Text>
      <Text style={styles.subtitle}>Cooking Event Reminders</Text>
      
      <Button title="Test API Connection" onPress={handleTestApi} />
      
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
  },
});