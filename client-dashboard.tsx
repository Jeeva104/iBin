import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, Lock, User } from 'lucide-react-native';

const CREDENTIALS = {
  client: { username: 'CLIENT@2000', password: 'Client@2004' },
  admin: { username: 'ADMIN@2000', password: 'Admin@2004' },
};

export default function Login() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const role = params.role as string;

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    if (!username || !password) {
      Alert.alert('Error', 'Please enter both username and password');
      return;
    }

    if (
      username === CREDENTIALS.client.username &&
      password === CREDENTIALS.client.password
    ) {
      router.replace('/client-dashboard');
    } else if (
      username === CREDENTIALS.admin.username &&
      password === CREDENTIALS.admin.password
    ) {
      router.replace('/admin-dashboard');
    } else {
      Alert.alert('Error', 'Invalid credentials. Please try again.');
    }
  };

  return (
    <LinearGradient colors={['#2E7D32', '#4CAF50', '#66BB6A']} style={styles.container}>
      <View style={styles.content}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color="#FFFFFF" />
          <Text style={styles.backText}>Back to Landing</Text>
        </TouchableOpacity>

        <View style={styles.formContainer}>
          <Text style={styles.title}>
            {role === 'admin' ? 'Admin Login' : 'Client Login'}
          </Text>

          <View style={styles.inputContainer}>
            <View style={styles.iconWrapper}>
              <User size={20} color="#2E7D32" />
            </View>
            <TextInput
              style={styles.input}
              placeholder="Username"
              placeholderTextColor="#999"
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputContainer}>
            <View style={styles.iconWrapper}>
              <Lock size={20} color="#2E7D32" />
            </View>
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#999"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
            />
          </View>

          <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            <Text style={styles.loginButtonText}>Login</Text>
          </TouchableOpacity>

          <View style={styles.credentialsHint}>
            <Text style={styles.hintTitle}>Test Credentials:</Text>
            <Text style={styles.hintText}>Client: CLIENT@2000 / Client@2004</Text>
            <Text style={styles.hintText}>Admin: ADMIN@2000 / Admin@2004</Text>
          </View>
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
    padding: 20,
    paddingTop: 60,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  backText: {
    color: '#FFFFFF',
    fontSize: 16,
    marginLeft: 8,
  },
  formContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 32,
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    marginBottom: 16,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  iconWrapper: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: '#333',
  },
  loginButton: {
    backgroundColor: '#2E7D32',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  credentialsHint: {
    marginTop: 24,
    padding: 16,
    backgroundColor: '#F0F7F0',
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  hintTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2E7D32',
    marginBottom: 8,
  },
  hintText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
});
