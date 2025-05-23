import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  Platform,
} from 'react-native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import type { Event } from '@recipe-scheduler/shared-types';

const API_BASE = 'http://10.0.2.2:3000/api';

interface Props {
  route: {
    params: {
      event: Event;
      onUpdate: () => void;
    };
  };
  navigation: {
    goBack: () => void;
  };
}

export default function EventDetailScreen({ route, navigation }: Props) {
  const { event, onUpdate } = route.params;
  
  const [title, setTitle] = useState(event.title);
  const [date, setDate] = useState(new Date(event.eventTime));
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const onDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  const onTimeChange = (event: DateTimePickerEvent, selectedTime?: Date) => {
    setShowTimePicker(false);
    if (selectedTime) {
      const newDate = new Date(date);
      newDate.setHours(selectedTime.getHours());
      newDate.setMinutes(selectedTime.getMinutes());
      setDate(newDate);
    }
  };

  const updateEvent = async () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter an event title');
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/events/${event.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: title.trim(),
          eventTime: date.toISOString(),
        }),
      });

      if (response.ok) {
        Alert.alert('Success', 'Event updated successfully!');
        onUpdate();
        navigation.goBack();
      } else {
        Alert.alert('Error', 'Failed to update event');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to update event');
    }
  };

  const deleteEvent = async () => {
    Alert.alert(
      'Delete Event',
      'Are you sure you want to delete this event?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await fetch(`${API_BASE}/events/${event.id}`, { method: 'DELETE' });
              onUpdate();
              navigation.goBack();
            } catch (error) {
              Alert.alert('Error', 'Failed to delete event');
            }
          },
        },
      ]
    );
  };

  const formatDateTime = (date: Date) => {
    return date.toLocaleString();
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

        <Text style={styles.label}>Date & Time</Text>
        <TouchableOpacity 
          style={styles.dateButton} 
          onPress={() => setShowDatePicker(true)}
        >
          <Text style={styles.dateText}>{formatDateTime(date)}</Text>
        </TouchableOpacity>

        <View style={styles.dateTimeButtons}>
          <TouchableOpacity 
            style={styles.smallButton} 
            onPress={() => setShowDatePicker(true)}
          >
            <Text style={styles.smallButtonText}>Change Date</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.smallButton} 
            onPress={() => setShowTimePicker(true)}
          >
            <Text style={styles.smallButtonText}>Change Time</Text>
          </TouchableOpacity>
        </View>

        {showDatePicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={onDateChange}
          />
        )}

        {showTimePicker && (
          <DateTimePicker
            value={date}
            mode="time"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={onTimeChange}
          />
        )}

        <TouchableOpacity style={styles.updateButton} onPress={updateEvent}>
          <Text style={styles.buttonText}>Update Event</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.deleteButton} onPress={deleteEvent}>
          <Text style={styles.buttonText}>Delete Event</Text>
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
  dateButton: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    backgroundColor: 'white',
    marginBottom: 10,
  },
  dateText: {
    fontSize: 16,
    color: '#333',
  },
  dateTimeButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  smallButton: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 6,
    flex: 0.48,
  },
  smallButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  updateButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 15,
  },
  deleteButton: {
    backgroundColor: '#ff4444',
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