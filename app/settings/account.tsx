import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
  Switch,
  Platform,
} from 'react-native';
import { Stack, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';
import Layout from '../../constants/Layout';
import { useColorScheme } from '../../hooks/useColorScheme';

interface ConnectedAccount {
  id: string;
  name: string;
  isConnected: boolean;
}

export default function AccountSettingsScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  
  const [name, setName] = useState('John Doe');
  const [username, setUsername] = useState('johndoe');
  const [email, setEmail] = useState('john.doe@example.com');
  const [phone, setPhone] = useState('+1 234 567 8900');
  const [connectedAccounts, setConnectedAccounts] = useState<ConnectedAccount[]>([
    { id: 'google', name: 'Google', isConnected: true },
    { id: 'apple', name: 'Apple', isConnected: false },
    { id: 'twitter', name: 'Twitter', isConnected: true },
  ]);

  const handleSaveChanges = () => {
    // Validate inputs
    if (!name || !username || !email) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    Alert.alert('Success', 'Your changes have been saved successfully');
  };

  const handleToggleAccount = (accountId: string) => {
    setConnectedAccounts(prev =>
      prev.map(account => {
        if (account.id === accountId) {
          if (account.isConnected) {
            Alert.alert(
              'Disconnect Account',
              `Are you sure you want to disconnect your ${account.name} account?`,
              [
                { text: 'Cancel', style: 'cancel' },
                {
                  text: 'Disconnect',
                  style: 'destructive',
                  onPress: () => {
                    setConnectedAccounts(prev =>
                      prev.map(acc =>
                        acc.id === accountId
                          ? { ...acc, isConnected: false }
                          : acc
                      )
                    );
                  },
                },
              ]
            );
            return account;
          }
          return { ...account, isConnected: true };
        }
        return account;
      })
    );
  };

  const handleChangePassword = () => {
    Alert.alert('Change Password', 'Navigating to password change screen...');
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to delete your account? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            Alert.alert(
              'Account Scheduled for Deletion',
              'Your account will be permanently deleted in 30 days. You can cancel this action by logging in during this period.'
            );
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Account Settings',
          headerStyle: {
            backgroundColor: '#fff',
          },
          headerShadowVisible: false,
        }}
      />
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Profile Information</Text>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Name</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Enter your name"
            />
          </View>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Username</Text>
            <TextInput
              style={styles.input}
              value={username}
              onChangeText={setUsername}
              placeholder="Enter your username"
            />
          </View>
        </View>

        {/* Contact Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Information</Text>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="Enter your email"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Phone</Text>
            <TextInput
              style={styles.input}
              value={phone}
              onChangeText={setPhone}
              placeholder="Enter your phone number"
              keyboardType="phone-pad"
            />
          </View>
        </View>

        {/* Connected Accounts */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Connected Accounts</Text>
          {connectedAccounts.map(account => (
            <View key={account.id} style={styles.accountItem}>
              <View style={styles.accountInfo}>
                <Ionicons
                  name={`logo-${account.id.toLowerCase()}` as any}
                  size={24}
                  color="#333"
                />
                <Text style={styles.accountName}>{account.name}</Text>
              </View>
              <Switch
                value={account.isConnected}
                onValueChange={() => handleToggleAccount(account.id)}
              />
            </View>
          ))}
        </View>

        {/* Security */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Security</Text>
          <TouchableOpacity
            style={styles.settingsItem}
            onPress={handleChangePassword}
          >
            <Text style={styles.settingsItemText}>Change Password</Text>
            <Ionicons
              name="chevron-forward"
              size={24}
              color="#333"
            />
          </TouchableOpacity>
        </View>

        {/* Account Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account Actions</Text>
          <TouchableOpacity
            style={[styles.settingsItem, styles.deleteAccount]}
            onPress={handleDeleteAccount}
          >
            <Text style={[styles.settingsItemText, styles.deleteText]}>
              Delete Account
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={handleSaveChanges}>
          <Text style={styles.saveButtonText}>Save Changes</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  section: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e1e1e1',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    color: '#333',
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    marginBottom: 8,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#e1e1e1',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
    color: '#333',
  },
  accountItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  accountInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  accountName: {
    marginLeft: 12,
    fontSize: 16,
    color: '#333',
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  settingsItemText: {
    fontSize: 16,
    color: '#333',
  },
  deleteAccount: {
    marginTop: 8,
  },
  deleteText: {
    color: '#FF3B30',
  },
  saveButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    margin: 16,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  scrollContent: {
    paddingTop: 100, // Space for the header
    paddingBottom: Layout.SAFE_BOTTOM_PADDING,
    paddingHorizontal: 16,
  },
}); 