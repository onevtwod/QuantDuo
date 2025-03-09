import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  Alert,
  TouchableOpacity,
  Platform,
  Modal
} from 'react-native';
import { Stack, router } from 'expo-router';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';

import { Colors } from '../../constants/Colors';
import Layout from '../../constants/Layout';
import { useColorScheme } from '../../hooks/useColorScheme';
import { ThemedView } from '../../components/ThemedView';
import { ThemedText } from '../../components/ThemedText';
import { IconSymbol } from '../../components/ui/IconSymbol';

interface Session {
  id: string;
  device: string;
  location: string;
  lastActive: string;
  isCurrentSession: boolean;
}

export default function PrivacySecurityScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  
  // State for privacy settings
  const [isProfilePublic, setIsProfilePublic] = useState(false);
  const [showActivityStatus, setShowActivityStatus] = useState(true);
  const [showRankInLeaderboard, setShowRankInLeaderboard] = useState(true);
  const [allowStrategySharing, setAllowStrategySharing] = useState(true);
  
  // State for security settings
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);
  const [useFingerprint, setUseFingerprint] = useState(false);
  const [loginNotifications, setLoginNotifications] = useState(true);
  const [securityAlerts, setSecurityAlerts] = useState(true);
  
  // State for data export/delete modal
  const [dataActionModal, setDataActionModal] = useState<'export' | 'delete' | null>(null);
  
  // State for permission settings
  const [permissions, setPermissions] = useState({
    camera: true,
    notifications: true,
    location: false,
    contacts: false,
  });
  
  // Blocked users
  const [blockedUsers, setBlockedUsers] = useState([
    { id: 'user1', name: 'Alex Johnson' },
    { id: 'user2', name: 'Jordan Smith' },
  ]);
  
  // Active sessions
  const [activeSessions, setActiveSessions] = useState<Session[]>([
    {
      id: 'session1',
      device: 'iPhone 13 Pro',
      location: 'New York, USA',
      lastActive: 'Now',
      isCurrentSession: true
    },
    {
      id: 'session2',
      device: 'Windows PC',
      location: 'New York, USA',
      lastActive: '2 hours ago',
      isCurrentSession: false
    },
    {
      id: 'session3',
      device: 'iPad Pro',
      location: 'Boston, USA',
      lastActive: '3 days ago',
      isCurrentSession: false
    }
  ]);
  
  // Toggle permission
  const togglePermission = (permission: keyof typeof permissions) => {
    setPermissions(prev => ({
      ...prev,
      [permission]: !prev[permission]
    }));
  };
  
  // Handle setup 2FA
  const handle2FASetup = () => {
    if (is2FAEnabled) {
      Alert.alert(
        'Disable 2FA',
        'Are you sure you want to disable two-factor authentication? This will make your account less secure.',
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Disable', 
            style: 'destructive',
            onPress: () => setIs2FAEnabled(false) 
          }
        ]
      );
    } else {
      Alert.alert(
        'Enable 2FA',
        'Setting up two-factor authentication will add an extra layer of security to your account. Continue?',
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Set Up', 
            onPress: () => {
              // This would navigate to a 2FA setup flow in a real app
              setTimeout(() => {
                setIs2FAEnabled(true);
                Alert.alert('Success', '2FA has been successfully enabled for your account');
              }, 1000);
            }
          }
        ]
      );
    }
  };
  
  // Handle data export
  const handleDataExport = () => {
    setDataActionModal('export');
  };
  
  // Handle data deletion
  const handleDataDeletion = () => {
    setDataActionModal('delete');
  };
  
  // Handle session logout
  const handleSessionLogout = (sessionId: string) => {
    if (activeSessions.find(s => s.id === sessionId)?.isCurrentSession) {
      Alert.alert('Error', 'You cannot log out of your current session here. Use the logout button in the profile menu instead.');
      return;
    }
    
    Alert.alert(
      'Log Out Session',
      'Are you sure you want to log out this device?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Log Out',
          style: 'destructive',
          onPress: () => {
            setActiveSessions(prev => prev.filter(session => session.id !== sessionId));
            Alert.alert('Success', 'Device has been logged out');
          }
        }
      ]
    );
  };
  
  // Handle user unblock
  const handleUnblockUser = (userId: string) => {
    Alert.alert(
      'Unblock User',
      'Are you sure you want to unblock this user? They will be able to see your content and interact with you again.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Unblock',
          onPress: () => {
            setBlockedUsers(prev => prev.filter(user => user.id !== userId));
            Alert.alert('Success', 'User has been unblocked');
          }
        }
      ]
    );
  };
  
  // Confirm data export
  const confirmDataExport = () => {
    // In a real app, this would trigger a backend job to export user data
    setTimeout(() => {
      setDataActionModal(null);
      Alert.alert(
        'Data Export Initiated',
        'Your data export has been initiated. You will receive an email with your data within 24 hours.'
      );
    }, 1000);
  };
  
  // Confirm account deletion
  const confirmAccountDeletion = () => {
    // In a real app, this would schedule account deletion after a grace period
    setTimeout(() => {
      setDataActionModal(null);
      Alert.alert(
        'Account Deletion Scheduled',
        'Your account has been scheduled for deletion. It will be permanently deleted after 30 days. You can cancel this by logging in during this period.'
      );
    }, 1000);
  };
  
  return (
    <ThemedView style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Privacy & Security',
          headerShown: true,
          headerTransparent: true,
          headerBlurEffect: colorScheme === 'dark' ? 'dark' : 'light',
          headerTintColor: colors.text,
          headerLeft: () => (
            <TouchableOpacity 
              onPress={() => router.back()} 
              style={styles.backButton}
            >
              <IconSymbol name="chevron.left" size={24} color={colors.text} />
            </TouchableOpacity>
          ),
          headerBackground: () => (
            <BlurView
              intensity={80}
              style={StyleSheet.absoluteFill}
              tint={colorScheme === 'dark' ? 'dark' : 'light'}
            />
          ),
        }}
      />
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Data Controls Section */}
        <ThemedView style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Data Controls</ThemedText>
          <ThemedText style={styles.sectionDescription}>
            Manage your data and privacy
          </ThemedText>
          
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={handleDataExport}
          >
            <ThemedView style={styles.actionButtonContent}>
              <IconSymbol name="arrow.down.doc.fill" size={20} color={colors.tint} />
              <ThemedView style={styles.actionTextContainer}>
                <ThemedText style={styles.actionButtonTitle}>Export Your Data</ThemedText>
                <ThemedText style={styles.actionButtonDescription}>
                  Download a copy of your data including profile, activity, and strategies
                </ThemedText>
              </ThemedView>
            </ThemedView>
            <IconSymbol name="chevron.right" size={16} color={colors.text} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={handleDataDeletion}
          >
            <ThemedView style={styles.actionButtonContent}>
              <IconSymbol name="trash.fill" size={20} color={colors.loss} />
              <ThemedView style={styles.actionTextContainer}>
                <ThemedText style={styles.actionButtonTitle}>Delete Your Data</ThemedText>
                <ThemedText style={styles.actionButtonDescription}>
                  Permanently delete your account and all associated data
                </ThemedText>
              </ThemedView>
            </ThemedView>
            <IconSymbol name="chevron.right" size={16} color={colors.text} />
          </TouchableOpacity>
        </ThemedView>
        
        {/* Security Section */}
        <ThemedView style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Account Security</ThemedText>
          <ThemedText style={styles.sectionDescription}>
            Keep your account secure
          </ThemedText>
          
          <TouchableOpacity 
            style={styles.settingItem}
            onPress={handle2FASetup}
          >
            <ThemedView style={styles.settingContent}>
              <ThemedText style={styles.settingTitle}>Two-Factor Authentication</ThemedText>
              <ThemedText style={styles.settingDescription}>
                {is2FAEnabled 
                  ? 'Enabled - Your account is protected with an additional security layer' 
                  : 'Disabled - Add an extra layer of security to your account'}
              </ThemedText>
            </ThemedView>
            <ThemedView style={[
              styles.statusBadge, 
              { backgroundColor: is2FAEnabled ? colors.profit + '20' : colors.loss + '20' }
            ]}>
              <ThemedText style={[
                styles.statusText,
                { color: is2FAEnabled ? colors.profit : colors.loss }
              ]}>
                {is2FAEnabled ? 'ON' : 'OFF'}
              </ThemedText>
            </ThemedView>
          </TouchableOpacity>
          
          <ThemedView style={styles.settingItem}>
            <ThemedView style={styles.settingContent}>
              <ThemedText style={styles.settingTitle}>Biometric Login</ThemedText>
              <ThemedText style={styles.settingDescription}>
                Use Face ID or fingerprint to log in securely
              </ThemedText>
            </ThemedView>
            <Switch
              value={useFingerprint}
              onValueChange={setUseFingerprint}
              trackColor={{ false: '#767577', true: colors.tint + '80' }}
              thumbColor={useFingerprint ? colors.tint : '#f4f3f4'}
            />
          </ThemedView>
          
          <ThemedView style={styles.settingItem}>
            <ThemedView style={styles.settingContent}>
              <ThemedText style={styles.settingTitle}>Login Notifications</ThemedText>
              <ThemedText style={styles.settingDescription}>
                Get notified when someone logs into your account
              </ThemedText>
            </ThemedView>
            <Switch
              value={loginNotifications}
              onValueChange={setLoginNotifications}
              trackColor={{ false: '#767577', true: colors.tint + '80' }}
              thumbColor={loginNotifications ? colors.tint : '#f4f3f4'}
            />
          </ThemedView>
          
          <ThemedView style={styles.settingItem}>
            <ThemedView style={styles.settingContent}>
              <ThemedText style={styles.settingTitle}>Security Alerts</ThemedText>
              <ThemedText style={styles.settingDescription}>
                Receive alerts for suspicious account activity
              </ThemedText>
            </ThemedView>
            <Switch
              value={securityAlerts}
              onValueChange={setSecurityAlerts}
              trackColor={{ false: '#767577', true: colors.tint + '80' }}
              thumbColor={securityAlerts ? colors.tint : '#f4f3f4'}
            />
          </ThemedView>
        </ThemedView>
        
        {/* Active Sessions */}
        <ThemedView style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Active Sessions</ThemedText>
          <ThemedText style={styles.sectionDescription}>
            Manage devices where you're currently logged in
          </ThemedText>
          
          {activeSessions.map(session => (
            <ThemedView key={session.id} style={styles.sessionItem}>
              <ThemedView style={styles.sessionIcon}>
                <IconSymbol 
                  name={session.device.toLowerCase().includes('iphone') 
                    ? "iphone" 
                    : session.device.toLowerCase().includes('ipad')
                    ? "ipad"
                    : "desktopcomputer"
                  } 
                  size={20} 
                  color={colors.text} 
                />
              </ThemedView>
              <ThemedView style={styles.sessionContent}>
                <ThemedText style={styles.sessionDevice}>{session.device}</ThemedText>
                <ThemedText style={styles.sessionDetails}>
                  {session.location} • {session.lastActive}
                  {session.isCurrentSession && ' • Current Session'}
                </ThemedText>
              </ThemedView>
              {!session.isCurrentSession && (
                <TouchableOpacity 
                  style={styles.logoutButton}
                  onPress={() => handleSessionLogout(session.id)}
                >
                  <ThemedText style={styles.logoutText}>Log Out</ThemedText>
                </TouchableOpacity>
              )}
            </ThemedView>
          ))}
        </ThemedView>
        
        {/* Privacy Settings */}
        <ThemedView style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Privacy Settings</ThemedText>
          <ThemedText style={styles.sectionDescription}>
            Control who can see your profile and activity
          </ThemedText>
          
          <ThemedView style={styles.settingItem}>
            <ThemedView style={styles.settingContent}>
              <ThemedText style={styles.settingTitle}>Public Profile</ThemedText>
              <ThemedText style={styles.settingDescription}>
                Allow anyone to view your profile and strategies
              </ThemedText>
            </ThemedView>
            <Switch
              value={isProfilePublic}
              onValueChange={setIsProfilePublic}
              trackColor={{ false: '#767577', true: colors.tint + '80' }}
              thumbColor={isProfilePublic ? colors.tint : '#f4f3f4'}
            />
          </ThemedView>
          
          <ThemedView style={styles.settingItem}>
            <ThemedView style={styles.settingContent}>
              <ThemedText style={styles.settingTitle}>Activity Status</ThemedText>
              <ThemedText style={styles.settingDescription}>
                Show when you're active on the platform
              </ThemedText>
            </ThemedView>
            <Switch
              value={showActivityStatus}
              onValueChange={setShowActivityStatus}
              trackColor={{ false: '#767577', true: colors.tint + '80' }}
              thumbColor={showActivityStatus ? colors.tint : '#f4f3f4'}
            />
          </ThemedView>
          
          <ThemedView style={styles.settingItem}>
            <ThemedView style={styles.settingContent}>
              <ThemedText style={styles.settingTitle}>Show in Leaderboards</ThemedText>
              <ThemedText style={styles.settingDescription}>
                Include your profile in public leaderboards
              </ThemedText>
            </ThemedView>
            <Switch
              value={showRankInLeaderboard}
              onValueChange={setShowRankInLeaderboard}
              trackColor={{ false: '#767577', true: colors.tint + '80' }}
              thumbColor={showRankInLeaderboard ? colors.tint : '#f4f3f4'}
            />
          </ThemedView>
          
          <ThemedView style={styles.settingItem}>
            <ThemedView style={styles.settingContent}>
              <ThemedText style={styles.settingTitle}>Strategy Sharing</ThemedText>
              <ThemedText style={styles.settingDescription}>
                Allow others to view and fork your strategies
              </ThemedText>
            </ThemedView>
            <Switch
              value={allowStrategySharing}
              onValueChange={setAllowStrategySharing}
              trackColor={{ false: '#767577', true: colors.tint + '80' }}
              thumbColor={allowStrategySharing ? colors.tint : '#f4f3f4'}
            />
          </ThemedView>
        </ThemedView>
        
        {/* Blocked Users */}
        <ThemedView style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Blocked Users</ThemedText>
          <ThemedText style={styles.sectionDescription}>
            Manage users who can't interact with you
          </ThemedText>
          
          {blockedUsers.length > 0 ? (
            blockedUsers.map(user => (
              <ThemedView key={user.id} style={styles.blockedUserItem}>
                <ThemedText style={styles.blockedUserName}>{user.name}</ThemedText>
                <TouchableOpacity 
                  style={styles.unblockButton}
                  onPress={() => handleUnblockUser(user.id)}
                >
                  <ThemedText style={styles.unblockText}>Unblock</ThemedText>
                </TouchableOpacity>
              </ThemedView>
            ))
          ) : (
            <ThemedText style={styles.emptyListText}>You haven't blocked any users</ThemedText>
          )}
        </ThemedView>
        
        {/* App Permissions */}
        <ThemedView style={styles.section}>
          <ThemedText style={styles.sectionTitle}>App Permissions</ThemedText>
          <ThemedText style={styles.sectionDescription}>
            Manage what the app can access on your device
          </ThemedText>
          
          {Object.entries(permissions).map(([key, value]) => (
            <ThemedView key={key} style={styles.settingItem}>
              <ThemedView style={styles.settingContent}>
                <ThemedText style={styles.settingTitle}>
                  {key.charAt(0).toUpperCase() + key.slice(1)}
                </ThemedText>
                <ThemedText style={styles.settingDescription}>
                  {key === 'camera' 
                    ? 'Access to camera for profile photos' 
                    : key === 'notifications'
                    ? 'Send you push notifications'
                    : key === 'location'
                    ? 'Access to your location data'
                    : 'Access to your contacts list'}
                </ThemedText>
              </ThemedView>
              <Switch
                value={value}
                onValueChange={() => togglePermission(key as keyof typeof permissions)}
                trackColor={{ false: '#767577', true: colors.tint + '80' }}
                thumbColor={value ? colors.tint : '#f4f3f4'}
              />
            </ThemedView>
          ))}
        </ThemedView>
        
        {/* Save Button */}
        <TouchableOpacity
          style={[styles.saveButton, { backgroundColor: colors.tint }]}
          onPress={() => Alert.alert('Success', 'Your privacy and security settings have been saved')}
        >
          <ThemedText style={styles.saveButtonText}>Save Changes</ThemedText>
        </TouchableOpacity>
      </ScrollView>
      
      {/* Data Action Modal (Export or Delete) */}
      <Modal
        visible={dataActionModal !== null}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setDataActionModal(null)}
      >
        <ThemedView style={styles.modalOverlay}>
          <ThemedView style={[styles.modalContainer, { backgroundColor: colors.card }]}>
            <ThemedText style={styles.modalTitle}>
              {dataActionModal === 'export' ? 'Export Your Data' : 'Delete Your Account'}
            </ThemedText>
            
            <ThemedText style={styles.modalDescription}>
              {dataActionModal === 'export' 
                ? 'We will prepare a complete export of your data. This includes your profile information, account activity, strategies, and lessons progress. You will receive an email with a download link within 24 hours.'
                : 'This action will permanently delete your account after a 30-day grace period. During this time, you can log in to cancel the deletion. After 30 days, all your data will be permanently removed and cannot be recovered.'}
            </ThemedText>
            
            {dataActionModal === 'delete' && (
              <ThemedView style={styles.warningBox}>
                <IconSymbol name="exclamationmark.triangle.fill" size={20} color="#FFC107" />
                <ThemedText style={styles.warningText}>
                  This action is irreversible after the 30-day grace period.
                </ThemedText>
              </ThemedView>
            )}
            
            <ThemedView style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton, { borderColor: colors.border }]}
                onPress={() => setDataActionModal(null)}
              >
                <ThemedText style={styles.cancelButtonText}>Cancel</ThemedText>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[
                  styles.modalButton, 
                  styles.confirmButton, 
                  { 
                    backgroundColor: dataActionModal === 'export' 
                      ? colors.tint 
                      : colors.loss 
                  }
                ]}
                onPress={dataActionModal === 'export' ? confirmDataExport : confirmAccountDeletion}
              >
                <ThemedText style={styles.confirmButtonText}>
                  {dataActionModal === 'export' ? 'Export Data' : 'Delete Account'}
                </ThemedText>
              </TouchableOpacity>
            </ThemedView>
          </ThemedView>
        </ThemedView>
      </Modal>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backButton: {
    padding: 8,
    marginLeft: 8,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 100, // Space for the header
    paddingBottom: Layout.SAFE_BOTTOM_PADDING,
    paddingHorizontal: 16,
  },
  section: {
    marginBottom: 24,
    backgroundColor: 'rgba(150, 150, 150, 0.1)',
    borderRadius: 12,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  sectionDescription: {
    fontSize: 14,
    opacity: 0.7,
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(150, 150, 150, 0.2)',
  },
  settingContent: {
    flex: 1,
    paddingRight: 16,
  },
  settingTitle: {
    fontSize: 16,
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    opacity: 0.7,
  },
  actionButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(150, 150, 150, 0.2)',
  },
  actionButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  actionTextContainer: {
    marginLeft: 12,
    flex: 1,
  },
  actionButtonTitle: {
    fontSize: 16,
    marginBottom: 4,
  },
  actionButtonDescription: {
    fontSize: 14,
    opacity: 0.7,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  sessionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(150, 150, 150, 0.2)',
  },
  sessionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(150, 150, 150, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  sessionContent: {
    flex: 1,
  },
  sessionDevice: {
    fontSize: 16,
    marginBottom: 4,
  },
  sessionDetails: {
    fontSize: 14,
    opacity: 0.7,
  },
  logoutButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: 'rgba(150, 150, 150, 0.2)',
  },
  logoutText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  blockedUserItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(150, 150, 150, 0.2)',
  },
  blockedUserName: {
    fontSize: 16,
  },
  unblockButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: 'rgba(150, 150, 150, 0.2)',
  },
  unblockText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  emptyListText: {
    fontSize: 14,
    opacity: 0.7,
    fontStyle: 'italic',
    textAlign: 'center',
    paddingVertical: 16,
  },
  saveButton: {
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 16,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '85%',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  modalDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
    textAlign: 'center',
  },
  warningBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 193, 7, 0.1)',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  warningText: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
    color: '#FFC107',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 8,
  },
  cancelButton: {
    borderWidth: 1,
  },
  cancelButtonText: {
    fontWeight: 'bold',
  },
  confirmButton: {
  },
  confirmButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
}); 