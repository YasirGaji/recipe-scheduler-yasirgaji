import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import type { Event } from '@recipe-scheduler/shared-types';

const API_BASE = 'http://10.0.2.2:3000/api';

interface Props {
  navigation: {
    navigate: (screen: string, params?: any) => void;
  };
}

export default function EventsScreen({ navigation }: Props) {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);

  const loadEvents = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/events`);
      const data = await response.json();
      // Sort by eventTime (soonest first)
      const sortedEvents = data.sort((a: Event, b: Event) => 
        new Date(a.eventTime).getTime() - new Date(b.eventTime).getTime()
      );
      setEvents(sortedEvents);
    } catch (error) {
      Alert.alert('Error', 'Failed to load events');
    }
    setLoading(false);
  };

  useEffect(() => {
    loadEvents();
    // Set up focus listener to refresh when returning from detail screen
    const unsubscribe = navigation.addListener('focus', loadEvents);
    return unsubscribe;
  }, [navigation]);

  const deleteEvent = async (id: string) => {
    try {
      await fetch(`${API_BASE}/events/${id}`, { method: 'DELETE' });
      setEvents(events.filter(e => e.id !== id));
    } catch (error) {
      Alert.alert('Error', 'Failed to delete event');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    const isTomorrow = date.toDateString() === new Date(now.getTime() + 24 * 60 * 60 * 1000).toDateString();
    
    if (isToday) {
      return `Today, ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else if (isTomorrow) {
      return `Tomorrow, ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else {
      return date.toLocaleString();
    }
  };

  const renderRightActions = (eventId: string) => (
    <TouchableOpacity
      style={styles.deleteAction}
      onPress={() => deleteEvent(eventId)}
    >
      <Text style={styles.deleteActionText}>Delete</Text>
    </TouchableOpacity>
  );

  const renderEvent = ({ item }: { item: Event }) => (
    <Swipeable renderRightActions={() => renderRightActions(item.id)}>
      <TouchableOpacity
        style={styles.eventCard}
        onPress={() =>
          navigation.navigate('EventDetail', {
            event: item,
            onUpdate: loadEvents,
          })
        }
      >
        <Text style={styles.eventTitle}>{item.title}</Text>
        <Text style={styles.eventTime}>{formatDate(item.eventTime)}</Text>
        <Text style={styles.tapHint}>Tap to edit • Swipe left to delete</Text>
      </TouchableOpacity>
    </Swipeable>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={events}
        renderItem={renderEvent}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={loadEvents} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No events scheduled</Text>
            <Text style={styles.emptySubtext}>Add your first cooking event!</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  eventCard: {
    backgroundColor: 'white',
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 6,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#333',
  },
  eventTime: {
    fontSize: 14,
    color: '#007AFF',
    marginBottom: 4,
    fontWeight: '500',
  },
  tapHint: {
    fontSize: 12,
    color: '#999',
    fontStyle: 'italic',
  },
  deleteAction: {
    backgroundColor: '#ff4444',
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    marginVertical: 6,
    marginRight: 16,
    borderRadius: 8,
  },
  deleteActionText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
  },
});