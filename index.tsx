import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal,
  TextInput,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  Bell,
  History,
  Settings,
  LogOut,
  AlertTriangle,
  Trash2,
  Download,
  ChevronDown,
} from 'lucide-react-native';
import CircularProgress from '@/components/CircularProgress';
import {
  Compartment,
  WasteBin,
  MOCK_BINS,
  updateCompartmentLevel,
  createHistoryEvent,
} from '@/utils/mockData';
import { scheduleNotification } from '@/utils/notifications';

export default function AdminDashboard() {
  const router = useRouter();
  const [selectedBin, setSelectedBin] = useState<WasteBin>(MOCK_BINS[0]);
  const [compartments, setCompartments] = useState<Compartment[]>(MOCK_BINS[0].compartments);
  const [notifications, setNotifications] = useState<string[]>([]);
  const [showBinSelector, setShowBinSelector] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [thresholds, setThresholds] = useState<{ [key: string]: number }>({
    plastic: 80,
    paper: 80,
    metal: 80,
    others: 80,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setCompartments((prev) =>
        prev.map((comp) => {
          const updated = updateCompartmentLevel(comp);

          if (updated.level > thresholds[comp.id] && comp.level <= thresholds[comp.id]) {
            const message = `${updated.name} reached ${Math.round(updated.level)}% capacity`;
            setNotifications((n) => [message, ...n.slice(0, 9)]);
            scheduleNotification('Waste Bin Alert', message);
          }

          if (updated.jam && !comp.jam) {
            const message = `Jam detected in ${updated.name} compartment`;
            setNotifications((n) => [message, ...n.slice(0, 9)]);
            scheduleNotification('Waste Bin Alert', message);
          }

          return { ...updated, threshold: thresholds[comp.id] };
        })
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [thresholds]);

  const emptyCompartment = (compartmentId: string) => {
    Alert.alert(
      'Empty Compartment',
      `Are you sure you want to empty the ${compartmentId} compartment?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Empty',
          style: 'destructive',
          onPress: () => {
            setCompartments((prev) =>
              prev.map((comp) =>
                comp.id === compartmentId ? { ...comp, level: 0, jam: false } : comp
              )
            );
            Alert.alert('Success', `${compartmentId} compartment has been emptied`);
          },
        },
      ]
    );
  };

  const exportReport = () => {
    const report = `
Smart Waste Bin Report
Generated: ${new Date().toLocaleString()}
Bin: ${selectedBin.name}

Compartment Status:
${compartments
  .map(
    (c) => `
${c.name}:
  - Fill Level: ${Math.round(c.level)}%
  - Threshold: ${c.threshold}%
  - Status: ${c.jam ? 'JAMMED' : c.level > c.threshold ? 'ABOVE THRESHOLD' : 'NORMAL'}
`
  )
  .join('')}
    `.trim();

    Alert.alert('Export Report', report, [{ text: 'OK' }]);
  };

  const changeBin = (bin: WasteBin) => {
    setSelectedBin(bin);
    setCompartments(bin.compartments);
    setShowBinSelector(false);
  };

  const saveSettings = () => {
    setCompartments((prev) =>
      prev.map((comp) => ({ ...comp, threshold: thresholds[comp.id] }))
    );
    setShowSettings(false);
    Alert.alert('Success', 'Settings saved successfully');
  };

  const getStatus = () => {
    const hasJam = compartments.some((c) => c.jam);
    const overThreshold = compartments.some((c) => c.level > c.threshold);

    if (hasJam) return { text: 'Jam Detected', color: '#F44336' };
    if (overThreshold) return { text: 'Attention Required', color: '#FF9800' };
    return { text: 'No Issues', color: '#4CAF50' };
  };

  const status = getStatus();

  const showNotifications = () => {
    if (notifications.length === 0) {
      Alert.alert('Notifications', 'No recent notifications');
    } else {
      Alert.alert(
        'Recent Notifications',
        notifications.slice(0, 5).join('\n\n'),
        [{ text: 'OK' }]
      );
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Admin Dashboard</Text>
          <TouchableOpacity
            style={styles.binSelector}
            onPress={() => setShowBinSelector(true)}
          >
            <Text style={styles.binSelectorText}>{selectedBin.name}</Text>
            <ChevronDown size={20} color="#2E7D32" />
          </TouchableOpacity>
          <View style={styles.statusContainer}>
            <View style={[styles.statusDot, { backgroundColor: status.color }]} />
            <Text style={[styles.statusText, { color: status.color }]}>{status.text}</Text>
          </View>
        </View>
        <View style={styles.headerButtons}>
          <TouchableOpacity style={styles.iconButton} onPress={showNotifications}>
            <Bell size={24} color="#2E7D32" />
            {notifications.length > 0 && <View style={styles.badge} />}
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton} onPress={() => router.push('/')}>
            <LogOut size={24} color="#2E7D32" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
        <View style={styles.gridContainer}>
          {compartments.map((comp) => (
            <View key={comp.id} style={styles.card}>
              <Text style={styles.cardTitle}>{comp.name}</Text>
              <CircularProgress
                percentage={comp.level}
                color={comp.color}
                size={90}
                strokeWidth={10}
              />
              {comp.jam && (
                <View style={styles.jamWarning}>
                  <AlertTriangle size={16} color="#F44336" />
                  <Text style={styles.jamText}>Jam</Text>
                </View>
              )}
              <Text style={styles.thresholdText}>Threshold: {comp.threshold}%</Text>
              <TouchableOpacity
                style={styles.emptyButton}
                onPress={() => emptyCompartment(comp.id)}
              >
                <Trash2 size={16} color="#FFFFFF" />
                <Text style={styles.emptyButtonText}>Empty</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => router.push('/history')}
          >
            <History size={20} color="#FFFFFF" />
            <Text style={styles.actionButtonText}>View History</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.secondaryButton]}
            onPress={() => setShowSettings(true)}
          >
            <Settings size={20} color="#2E7D32" />
            <Text style={[styles.actionButtonText, styles.secondaryButtonText]}>
              Adjust Thresholds
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.secondaryButton]}
            onPress={exportReport}
          >
            <Download size={20} color="#2E7D32" />
            <Text style={[styles.actionButtonText, styles.secondaryButtonText]}>
              Export Report
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <Modal
        visible={showBinSelector}
        transparent
        animationType="fade"
        onRequestClose={() => setShowBinSelector(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Waste Bin</Text>
            {MOCK_BINS.map((bin) => (
              <TouchableOpacity
                key={bin.id}
                style={[
                  styles.binOption,
                  selectedBin.id === bin.id && styles.binOptionSelected,
                ]}
                onPress={() => changeBin(bin)}
              >
                <Text
                  style={[
                    styles.binOptionText,
                    selectedBin.id === bin.id && styles.binOptionTextSelected,
                  ]}
                >
                  {bin.name}
                </Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setShowBinSelector(false)}
            >
              <Text style={styles.modalCloseButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        visible={showSettings}
        transparent
        animationType="fade"
        onRequestClose={() => setShowSettings(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Adjust Thresholds</Text>
            {compartments.map((comp) => (
              <View key={comp.id} style={styles.thresholdInput}>
                <Text style={styles.thresholdLabel}>{comp.name}:</Text>
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  value={thresholds[comp.id].toString()}
                  onChangeText={(text) => {
                    const value = parseInt(text) || 0;
                    setThresholds((prev) => ({ ...prev, [comp.id]: Math.min(100, value) }));
                  }}
                />
                <Text style={styles.thresholdUnit}>%</Text>
              </View>
            ))}
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.modalButton} onPress={saveSettings}>
                <Text style={styles.modalButtonText}>Save</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalCancelButton]}
                onPress={() => setShowSettings(false)}
              >
                <Text style={[styles.modalButtonText, styles.modalCancelButtonText]}>
                  Cancel
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  binSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    marginBottom: 4,
  },
  binSelectorText: {
    fontSize: 16,
    color: '#2E7D32',
    fontWeight: '500',
    marginRight: 4,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '500',
  },
  headerButtons: {
    flexDirection: 'row',
  },
  iconButton: {
    padding: 8,
    marginLeft: 8,
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#F44336',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  card: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  jamWarning: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    backgroundColor: '#FFEBEE',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 4,
  },
  jamText: {
    fontSize: 11,
    color: '#F44336',
    marginLeft: 4,
    fontWeight: '500',
  },
  thresholdText: {
    fontSize: 11,
    color: '#666',
    marginTop: 6,
  },
  emptyButton: {
    backgroundColor: '#F44336',
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  emptyButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  actionButtons: {
    marginTop: 8,
  },
  actionButton: {
    backgroundColor: '#2E7D32',
    borderRadius: 12,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  secondaryButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#2E7D32',
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  secondaryButtonText: {
    color: '#2E7D32',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 20,
    textAlign: 'center',
  },
  binOption: {
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    marginBottom: 12,
  },
  binOptionSelected: {
    backgroundColor: '#E8F5E9',
    borderColor: '#2E7D32',
  },
  binOptionText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
  },
  binOptionTextSelected: {
    color: '#2E7D32',
    fontWeight: '600',
  },
  modalCloseButton: {
    marginTop: 8,
    padding: 16,
  },
  modalCloseButtonText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  thresholdInput: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  thresholdLabel: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    width: 80,
    textAlign: 'center',
  },
  thresholdUnit: {
    fontSize: 16,
    color: '#666',
    marginLeft: 8,
  },
  modalButtons: {
    flexDirection: 'row',
    marginTop: 16,
  },
  modalButton: {
    flex: 1,
    backgroundColor: '#2E7D32',
    borderRadius: 8,
    padding: 16,
    marginHorizontal: 4,
  },
  modalCancelButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#E0E0E0',
  },
  modalButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  modalCancelButtonText: {
    color: '#666',
  },
});
