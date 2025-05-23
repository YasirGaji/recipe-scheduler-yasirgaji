import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';

const API_BASE = 'http://10.0.2.2:3000/api';

export default function AddEventScreen() {
  const [title, setTitle] = useState('');
  const [eventTime, setEventTime] = useState('');

  const createEvent = async () => {
    if (!title.trim() || !eventTime.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/events`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: title.trim(),
          eventTime: new Date(eventTime).toISOString(),
        }),
      });

      if (response.ok) {
        Alert.alert('Success', 'Event created successfully!');
        setTitle('');
        setEventTime('');
      } else {
        Alert.alert('Error', 'Failed to create event');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to create event');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.label}>Event Title</Text>
        <TextInput
          style={styles.input}
          value={title}
          onChangeText={setTitle}
          placeholder="e.g., Bake sourdough bread"
        />

        <Text style={styles.label}>Event Time</Text>
        <TextInput
          style={styles.input}
          value={eventTime}
          onChangeText={setEventTime}
          placeholder="YYYY-MM-DD HH:MM (e.g., 2025-05-23 19:00)"
        />

        <TouchableOpacity style={styles.button} onPress={createEvent}>
          <Text style={styles.buttonText}>Create Event</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  form: {
    padding: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: 'white',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});