import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, AlertTriangle, Info, AlertCircle } from 'lucide-react-native';
import { HistoryEvent, INITIAL_HISTORY, createHistoryEvent } from '@/utils/mockData';

export default function History() {
  const router = useRouter();
  const [events, setEvents] = useState<HistoryEvent[]>(INITIAL_HISTORY);

  useEffect(() => {
    const interval = setInterval(() => {
      const eventTypes: Array<{ type: 'warning' | 'info' | 'error'; message: string }> = [
        { type: 'warning', message: 'Plastic approaching capacity' },
        { type: 'info', message: 'Paper compartment emptied' },
        { type: 'error', message: 'Metal jam cleared' },
        { type: 'warning', message: 'Others reached 85%' },
        { type: 'info', message: 'System maintenance completed' },
      ];

      if (Math.random() > 0.7) {
        const randomEvent = eventTypes[Math.floor(Math.random() * eventTypes.length)];
        const compartments = ['Plastic', 'Paper', 'Metal', 'Others'];
        const compartment = compartments[Math.floor(Math.random() * compartments.length)];

        const newEvent = createHistoryEvent(compartment, randomEvent.message, randomEvent.type);
        setEvents((prev) => [newEvent, ...prev.slice(0, 49)]);
      }
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const getIcon = (type: string) => {
    switch (type) {
      case 'warning':
        return <AlertTriangle size={20} color="#FF9800" />;
      case 'error':
        return <AlertCircle size={20} color="#F44336" />;
      default:
        return <Info size={20} color="#2196F3" />;
    }
  };

  const getColor = (type: string) => {
    switch (type) {
      case 'warning':
        return '#FF9800';
      case 'error':
        return '#F44336';
      default:
        return '#2196F3';
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return date.toLocaleDateString();
  };

  const renderItem = ({ item }: { item: HistoryEvent }) => (
    <View style={styles.eventCard}>
      <View style={[styles.iconContainer, { backgroundColor: `${getColor(item.type)}20` }]}>
        {getIcon(item.type)}
      </View>
      <View style={styles.eventContent}>
        <View style={styles.eventHeader}>
          <Text style={styles.compartmentText}>{item.compartment}</Text>
          <Text style={styles.timeText}>{formatTime(item.timestamp)}</Text>
        </View>
        <Text style={styles.messageText}>{item.message}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color="#2E7D32" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Event History</Text>
        <View style={styles.placeholder} />
      </View>

      <FlatList
        data={events}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Info size={48} color="#999" />
            <Text style={styles.emptyText}>No events recorded yet</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    backgroundColor: '#FFFFFF',
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  placeholder: {
    width: 40,
  },
  listContent: {
    padding: 16,
  },
  eventCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  eventContent: {
    flex: 1,
  },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  compartmentText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  timeText: {
    fontSize: 12,
    color: '#999',
  },
  messageText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 80,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    marginTop: 16,
  },
});
