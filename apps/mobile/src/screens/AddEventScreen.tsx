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
import { useTheme } from '../context/ThemeContext';

const API_BASE = 'http://10.0.2.2:3000/api';

export default function AddEventScreen() {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const { colors } = useTheme();

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

  const createEvent = async () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter an event title');
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
          eventTime: date.toISOString(),
        }),
      });

      if (response.ok) {
        Alert.alert('Success', 'Event created successfully!');
        setTitle('');
        setDate(new Date());
      } else {
        Alert.alert('Error', 'Failed to create event');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to create event');
    }
  };

  const formatDateTime = (date: Date) => {
    return date.toLocaleString();
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.form}>
        <Text style={[styles.label, { color: colors.text }]}>Event Title</Text>
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
              color: colors.text,
            }
          ]}
          value={title}
          onChangeText={setTitle}
          placeholder="e.g., Bake sourdough bread"
          placeholderTextColor={colors.subtext}
        />

        <Text style={[styles.label, { color: colors.text }]}>Date & Time</Text>
        <TouchableOpacity 
          style={[
            styles.dateButton,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
            }
          ]} 
          onPress={() => setShowDatePicker(true)}
        >
          <Text style={[styles.dateText, { color: colors.text }]}>
            {formatDateTime(date)}
          </Text>
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
  },
  form: {
    padding: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 20,
  },
  dateButton: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
  },
  dateText: {
    fontSize: 16,
  },
  dateTimeButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
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
  button: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});