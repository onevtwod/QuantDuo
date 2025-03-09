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
  TextInput
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

interface NotificationSetting {
  id: string;
  title: string;
  description: string;
  enabled: boolean;
  category: 'platform' | 'updates' | 'social' | 'marketing';
}

interface NotificationChannel {
  id: string;
  title: string;
  description: string;
  enabled: boolean;
}

interface DndSchedule {
  enabled: boolean;
  startTime: string;
  endTime: string;
  days: {
    monday: boolean;
    tuesday: boolean;
    wednesday: boolean;
    thursday: boolean;
    friday: boolean;
    saturday: boolean;
    sunday: boolean;
  };
}

export default function NotificationsScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  
  // Notification settings
  const [notificationSettings, setNotificationSettings] = useState<NotificationSetting[]>([
    {
      id: 'lesson_reminders',
      title: 'Lesson Reminders',
      description: 'Reminders about upcoming and incomplete lessons',
      enabled: true,
      category: 'platform'
    },
    {
      id: 'strategy_alerts',
      title: 'Strategy Alerts',
      description: 'Alerts about your strategies performance',
      enabled: true,
      category: 'platform'
    },
    {
      id: 'challenge_updates',
      title: 'Challenge Updates',
      description: 'Updates about challenges you\'ve entered',
      enabled: true,
      category: 'updates'
    },
    {
      id: 'market_insights',
      title: 'Market Insights',
      description: 'Daily and weekly market insights',
      enabled: false,
      category: 'updates'
    },
    {
      id: 'friend_activity',
      title: 'Friend Activity',
      description: 'Actions and achievements from friends',
      enabled: true,
      category: 'social'
    },
    {
      id: 'leaderboard_changes',
      title: 'Leaderboard Changes',
      description: 'Updates on your leaderboard ranking',
      enabled: true,
      category: 'social'
    },
    {
      id: 'new_features',
      title: 'New Features',
      description: 'Announcements about new app features',
      enabled: true,
      category: 'marketing'
    },
    {
      id: 'promotions',
      title: 'Promotions',
      description: 'Special offers and promotions',
      enabled: false,
      category: 'marketing'
    },
  ]);
  
  // Notification channels
  const [channels, setChannels] = useState<NotificationChannel[]>([
    {
      id: 'push',
      title: 'Push Notifications',
      description: 'Receive notifications on your device',
      enabled: true
    },
    {
      id: 'email',
      title: 'Email Notifications',
      description: 'Receive notifications via email',
      enabled: true
    },
    {
      id: 'sms',
      title: 'SMS Notifications',
      description: 'Receive notifications via text message',
      enabled: false
    }
  ]);
  
  // Do Not Disturb schedule
  const [dndSchedule, setDndSchedule] = useState<DndSchedule>({
    enabled: false,
    startTime: '22:00',
    endTime: '07:00',
    days: {
      monday: true,
      tuesday: true,
      wednesday: true,
      thursday: true,
      friday: true,
      saturday: true,
      sunday: true
    }
  });
  
  // Toggle notification setting
  const toggleNotification = (id: string) => {
    setNotificationSettings(prev => 
      prev.map(setting => 
        setting.id === id 
          ? { ...setting, enabled: !setting.enabled } 
          : setting
      )
    );
  };
  
  // Toggle notification channel
  const toggleChannel = (id: string) => {
    setChannels(prev => 
      prev.map(channel => 
        channel.id === id 
          ? { ...channel, enabled: !channel.enabled } 
          : channel
      )
    );
  };
  
  // Toggle Do Not Disturb
  const toggleDnd = () => {
    setDndSchedule(prev => ({
      ...prev,
      enabled: !prev.enabled
    }));
  };
  
  // Toggle DND day
  const toggleDndDay = (day: keyof DndSchedule['days']) => {
    setDndSchedule(prev => ({
      ...prev,
      days: {
        ...prev.days,
        [day]: !prev.days[day]
      }
    }));
  };
  
  // Update DND time
  const updateDndTime = (type: 'startTime' | 'endTime', time: string) => {
    setDndSchedule(prev => ({
      ...prev,
      [type]: time
    }));
  };
  
  // Save notification preferences
  const savePreferences = () => {
    Alert.alert(
      'Save Preferences',
      'Your notification preferences have been saved',
      [{ text: 'OK' }]
    );
  };
  
  // Render notification settings grouped by category
  const renderNotificationSettings = (category: NotificationSetting['category']) => {
    const categorySettings = notificationSettings.filter(setting => setting.category === category);
    
    return categorySettings.map(setting => (
      <ThemedView key={setting.id} style={styles.settingItem}>
        <ThemedView style={styles.settingContent}>
          <ThemedText style={styles.settingTitle}>{setting.title}</ThemedText>
          <ThemedText style={styles.settingDescription}>{setting.description}</ThemedText>
        </ThemedView>
        <Switch
          value={setting.enabled}
          onValueChange={() => toggleNotification(setting.id)}
          trackColor={{ false: '#767577', true: colors.tint + '80' }}
          thumbColor={setting.enabled ? colors.tint : '#f4f3f4'}
        />
      </ThemedView>
    ));
  };
  
  return (
    <ThemedView style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Notifications',
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
        {/* Notification Channels */}
        <ThemedView style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Notification Channels</ThemedText>
          <ThemedText style={styles.sectionDescription}>
            Choose how you want to receive notifications
          </ThemedText>
          
          {channels.map(channel => (
            <ThemedView key={channel.id} style={styles.channelItem}>
              <ThemedView style={styles.channelContent}>
                <ThemedText style={styles.channelTitle}>{channel.title}</ThemedText>
                <ThemedText style={styles.channelDescription}>{channel.description}</ThemedText>
              </ThemedView>
              <Switch
                value={channel.enabled}
                onValueChange={() => toggleChannel(channel.id)}
                trackColor={{ false: '#767577', true: colors.tint + '80' }}
                thumbColor={channel.enabled ? colors.tint : '#f4f3f4'}
              />
            </ThemedView>
          ))}
        </ThemedView>
        
        {/* Do Not Disturb */}
        <ThemedView style={styles.section}>
          <ThemedView style={styles.sectionHeader}>
            <ThemedView>
              <ThemedText style={styles.sectionTitle}>Do Not Disturb</ThemedText>
              <ThemedText style={styles.sectionDescription}>
                Silence notifications during specific times
              </ThemedText>
            </ThemedView>
            <Switch
              value={dndSchedule.enabled}
              onValueChange={toggleDnd}
              trackColor={{ false: '#767577', true: colors.tint + '80' }}
              thumbColor={dndSchedule.enabled ? colors.tint : '#f4f3f4'}
            />
          </ThemedView>
          
          {dndSchedule.enabled && (
            <ThemedView style={styles.dndSchedule}>
              <ThemedView style={styles.timeSelector}>
                <ThemedText style={styles.timeLabel}>From</ThemedText>
                <TextInput
                  style={[styles.timeInput, { color: colors.text }]}
                  value={dndSchedule.startTime}
                  onChangeText={(text) => updateDndTime('startTime', text)}
                  placeholder="HH:MM"
                  keyboardType="numbers-and-punctuation"
                />
                <ThemedText style={styles.timeLabel}>To</ThemedText>
                <TextInput
                  style={[styles.timeInput, { color: colors.text }]}
                  value={dndSchedule.endTime}
                  onChangeText={(text) => updateDndTime('endTime', text)}
                  placeholder="HH:MM"
                  keyboardType="numbers-and-punctuation"
                />
              </ThemedView>
              
              <ThemedText style={styles.daysLabel}>Active on:</ThemedText>
              <ThemedView style={styles.daysContainer}>
                {(Object.keys(dndSchedule.days) as Array<keyof DndSchedule['days']>).map(day => (
                  <TouchableOpacity
                    key={day}
                    style={[
                      styles.dayButton,
                      dndSchedule.days[day] && { backgroundColor: colors.tint }
                    ]}
                    onPress={() => toggleDndDay(day)}
                  >
                    <ThemedText
                      style={[
                        styles.dayText,
                        dndSchedule.days[day] && { color: '#FFFFFF' }
                      ]}
                    >
                      {day.charAt(0).toUpperCase()}
                    </ThemedText>
                  </TouchableOpacity>
                ))}
              </ThemedView>
            </ThemedView>
          )}
        </ThemedView>
        
        {/* Platform Notifications */}
        <ThemedView style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Platform Notifications</ThemedText>
          <ThemedText style={styles.sectionDescription}>
            Notifications about your learning and strategies
          </ThemedText>
          {renderNotificationSettings('platform')}
        </ThemedView>
        
        {/* Updates & Insights */}
        <ThemedView style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Updates & Insights</ThemedText>
          <ThemedText style={styles.sectionDescription}>
            Notifications about challenges and market updates
          </ThemedText>
          {renderNotificationSettings('updates')}
        </ThemedView>
        
        {/* Social Notifications */}
        <ThemedView style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Social Notifications</ThemedText>
          <ThemedText style={styles.sectionDescription}>
            Notifications about friends and community
          </ThemedText>
          {renderNotificationSettings('social')}
        </ThemedView>
        
        {/* Marketing Notifications */}
        <ThemedView style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Marketing Notifications</ThemedText>
          <ThemedText style={styles.sectionDescription}>
            Notifications about features and promotions
          </ThemedText>
          {renderNotificationSettings('marketing')}
        </ThemedView>
        
        {/* Save Button */}
        <TouchableOpacity
          style={[styles.saveButton, { backgroundColor: colors.tint }]}
          onPress={savePreferences}
        >
          <ThemedText style={styles.saveButtonText}>Save Preferences</ThemedText>
        </TouchableOpacity>
      </ScrollView>
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
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  channelItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(150, 150, 150, 0.2)',
  },
  channelContent: {
    flex: 1,
    paddingRight: 16,
  },
  channelTitle: {
    fontSize: 16,
    marginBottom: 4,
  },
  channelDescription: {
    fontSize: 14,
    opacity: 0.7,
  },
  dndSchedule: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(150, 150, 150, 0.2)',
  },
  timeSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  timeLabel: {
    fontSize: 14,
    marginRight: 8,
  },
  timeInput: {
    borderWidth: 1,
    borderColor: 'rgba(150, 150, 150, 0.5)',
    borderRadius: 4,
    paddingVertical: 4,
    paddingHorizontal: 8,
    marginRight: 16,
    width: 80,
    fontSize: 14,
  },
  daysLabel: {
    fontSize: 14,
    marginBottom: 8,
  },
  daysContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dayButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(150, 150, 150, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayText: {
    fontSize: 12,
    fontWeight: 'bold',
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
}); 