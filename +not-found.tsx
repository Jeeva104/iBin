import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Recycle, Shield } from 'lucide-react-native';

export default function Landing() {
  const router = useRouter();

  return (
    <LinearGradient colors={['#2E7D32', '#4CAF50', '#66BB6A']} style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Recycle size={80} color="#FFFFFF" strokeWidth={2} />
        </View>

        <Text style={styles.title}>Smart Waste Bin Monitor</Text>
        <Text style={styles.subtitle}>
          Monitor your AI-powered waste bin with real-time segregation and alerts
        </Text>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => router.push('/login?role=client')}
          >
            <View style={styles.buttonContent}>
              <Recycle size={24} color="#2E7D32" strokeWidth={2} />
              <Text style={styles.buttonText}>Login as Client</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.adminButton]}
            onPress={() => router.push('/login?role=admin')}
          >
            <View style={styles.buttonContent}>
              <Shield size={24} color="#FFFFFF" strokeWidth={2} />
              <Text style={[styles.buttonText, styles.adminButtonText]}>Login as Admin</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Eco-Friendly • Smart • Efficient</Text>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  iconContainer: {
    marginBottom: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 100,
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 50,
    paddingHorizontal: 20,
    lineHeight: 24,
  },
  buttonContainer: {
    width: '100%',
    maxWidth: 350,
  },
  button: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    marginBottom: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  adminButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2E7D32',
    marginLeft: 12,
  },
  adminButtonText: {
    color: '#FFFFFF',
  },
  footer: {
    marginTop: 50,
  },
  footerText: {
    color: '#FFFFFF',
    fontSize: 14,
    opacity: 0.9,
  },
});
