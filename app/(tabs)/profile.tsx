import React, { useState } from 'react';
import { StyleSheet, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import { Stack, router } from 'expo-router';
import { BlurView } from 'expo-blur';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import Layout from '@/constants/Layout';
import { useColorScheme } from '@/hooks/useColorScheme';
import { IconSymbol } from '@/components/ui/IconSymbol';

// Mock user data
const userData = {
  name: 'Alex Trader',
  username: 'alextrader',
  level: 12,
  xp: 2450,
  xpToNextLevel: 3000,
  joinDate: 'March 2023',
  streak: 7,
  totalLessonsCompleted: 48,
  totalChallengesCompleted: 5,
  badges: [
    { id: 'badge-1', name: 'First Strategy', icon: 'chart.line.uptrend.xyaxis.circle.fill', color: '#4C9AFF', description: 'Created your first trading strategy' },
    { id: 'badge-2', name: 'Week Streak', icon: 'flame.circle.fill', color: '#FF9800', description: 'Maintained a 7-day learning streak' },
    { id: 'badge-3', name: 'Alpha Hunter', icon: 'magnifyingglass.circle.fill', color: '#00C853', description: 'Found your first alpha signal' },
    { id: 'badge-4', name: 'Quant Basics', icon: 'function.circle.fill', color: '#4C9AFF', description: 'Completed the Quant Basics module' },
  ],
  stats: [
    { name: 'Best Sharpe Ratio', value: '2.1' },
    { name: 'Best Return', value: '+18.7%' },
    { name: 'Strategies Created', value: '3' },
    { name: 'Challenges Completed', value: '5' },
  ]
};

export default function ProfileScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  
  // Calculate XP progress percentage
  const xpProgressPercent = (userData.xp / userData.xpToNextLevel) * 100;
  
  // Add handlers for settings buttons
  const handleAccountSettings = () => {
    router.push("/settings/account");
  };

  const handleNotifications = () => {
    router.push("/settings/notifications");
  };

  const handlePrivacySecurity = () => {
    router.push("/settings/privacy");
  };

  const handleHelpSupport = () => {
    router.push("/settings/help");
  };

  const handleLogout = () => {
    Alert.alert(
      'Log Out',
      'Are you sure you want to log out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Log Out', 
          style: 'destructive',
          onPress: () => {
            // In a real app, this would clear auth tokens and navigate to login
            Alert.alert('Logged Out', 'You have been successfully logged out.');
          }
        }
      ]
    );
  };
  
  return (
    <ThemedView style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: 'Profile',
          headerLargeTitle: true,
          headerTransparent: true,
          headerBlurEffect: colorScheme === 'dark' ? 'dark' : 'light',
          headerStyle: {
            backgroundColor: 'transparent',
          },
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
        {/* Profile Header */}
        <ThemedView style={[styles.profileHeader, { backgroundColor: colors.card }]}>
          <ThemedView style={styles.profileImageContainer}>
            <ThemedView style={[styles.profileImage, { backgroundColor: colors.tint }]}>
              <ThemedText style={styles.profileInitials}>
                {userData.name.split(' ').map(n => n[0]).join('')}
              </ThemedText>
            </ThemedView>
            <ThemedView style={[styles.levelBadge, { backgroundColor: colors.tint }]}>
              <ThemedText style={styles.levelText}>{userData.level}</ThemedText>
            </ThemedView>
          </ThemedView>
          
          <ThemedView style={styles.profileInfo}>
            <ThemedText style={styles.profileName}>{userData.name}</ThemedText>
            <ThemedText style={styles.profileUsername}>@{userData.username}</ThemedText>
            <ThemedText style={styles.profileJoinDate}>Member since {userData.joinDate}</ThemedText>
            
            <ThemedView style={styles.xpContainer}>
              <ThemedView style={styles.xpLabelContainer}>
                <ThemedText style={styles.xpLabel}>XP: {userData.xp}/{userData.xpToNextLevel}</ThemedText>
                <ThemedText style={styles.xpNextLevel}>Level {userData.level + 1}</ThemedText>
              </ThemedView>
              <ThemedView style={[styles.xpProgressBar, { backgroundColor: colors.border }]}>
                <ThemedView 
                  style={[
                    styles.xpProgressFill, 
                    { 
                      backgroundColor: colors.tint,
                      width: `${xpProgressPercent}%` 
                    }
                  ]} 
                />
              </ThemedView>
            </ThemedView>
          </ThemedView>
        </ThemedView>
        
        {/* Stats Section */}
        <ThemedView style={[styles.statsContainer, { backgroundColor: colors.card }]}>
          <ThemedText style={styles.sectionTitle}>Stats</ThemedText>
          <ThemedView style={styles.statsGrid}>
            {userData.stats.map((stat, index) => (
              <ThemedView key={index} style={styles.statItem}>
                <ThemedText style={styles.statValue}>{stat.value}</ThemedText>
                <ThemedText style={styles.statName}>{stat.name}</ThemedText>
              </ThemedView>
            ))}
          </ThemedView>
        </ThemedView>
        
        {/* Badges Section */}
        <ThemedView style={[styles.badgesContainer, { backgroundColor: colors.card }]}>
          <ThemedText style={styles.sectionTitle}>Badges</ThemedText>
          <ThemedView style={styles.badgesGrid}>
            {userData.badges.map(badge => (
              <ThemedView key={badge.id} style={styles.badgeItem}>
                <ThemedView style={styles.badgeIconContainer}>
                  <IconSymbol name={badge.icon as any} size={32} color={badge.color} />
                </ThemedView>
                <ThemedText style={styles.badgeName}>{badge.name}</ThemedText>
                <ThemedText style={styles.badgeDescription}>{badge.description}</ThemedText>
              </ThemedView>
            ))}
          </ThemedView>
        </ThemedView>
        
        {/* Settings Section - Updated with sub-menu indicators */}
        <ThemedView style={[styles.settingsContainer, { backgroundColor: colors.card }]}>
          <ThemedText style={styles.sectionTitle}>Settings</ThemedText>
          
          <TouchableOpacity 
            style={styles.settingsItem}
            onPress={handleAccountSettings}
            activeOpacity={0.7}
          >
            <ThemedView style={styles.settingsItemIcon}>
              <IconSymbol name="person.fill" size={20} color={colors.icon} />
            </ThemedView>
            <ThemedView style={styles.settingsItemContent}>
              <ThemedText style={styles.settingsItemText}>Account Settings</ThemedText>
              <ThemedText style={styles.settingsItemSubtext}>Profile, Email, Password</ThemedText>
            </ThemedView>
            <IconSymbol name="chevron.right" size={16} color={colors.icon} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.settingsItem}
            onPress={handleNotifications}
            activeOpacity={0.7}
          >
            <ThemedView style={styles.settingsItemIcon}>
              <IconSymbol name="bell.fill" size={20} color={colors.icon} />
            </ThemedView>
            <ThemedView style={styles.settingsItemContent}>
              <ThemedText style={styles.settingsItemText}>Notifications</ThemedText>
              <ThemedText style={styles.settingsItemSubtext}>Push, Email, Alerts</ThemedText>
            </ThemedView>
            <IconSymbol name="chevron.right" size={16} color={colors.icon} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.settingsItem}
            onPress={handlePrivacySecurity}
            activeOpacity={0.7}
          >
            <ThemedView style={styles.settingsItemIcon}>
              <IconSymbol name="lock.fill" size={20} color={colors.icon} />
            </ThemedView>
            <ThemedView style={styles.settingsItemContent}>
              <ThemedText style={styles.settingsItemText}>Privacy & Security</ThemedText>
              <ThemedText style={styles.settingsItemSubtext}>2FA, Data Controls, Privacy</ThemedText>
            </ThemedView>
            <IconSymbol name="chevron.right" size={16} color={colors.icon} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.settingsItem}
            onPress={handleHelpSupport}
            activeOpacity={0.7}
          >
            <ThemedView style={styles.settingsItemIcon}>
              <IconSymbol name="questionmark.circle.fill" size={20} color={colors.icon} />
            </ThemedView>
            <ThemedView style={styles.settingsItemContent}>
              <ThemedText style={styles.settingsItemText}>Help & Support</ThemedText>
              <ThemedText style={styles.settingsItemSubtext}>FAQs, Contact, Report Issues</ThemedText>
            </ThemedView>
            <IconSymbol name="chevron.right" size={16} color={colors.icon} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.settingsItem, { borderBottomWidth: 0 }]}
            onPress={handleLogout}
            activeOpacity={0.7}
          >
            <ThemedView style={styles.settingsItemIcon}>
              <IconSymbol name="arrow.right.square.fill" size={20} color={colors.loss} />
            </ThemedView>
            <ThemedText style={[styles.settingsItemText, { color: colors.loss }]}>Log Out</ThemedText>
          </TouchableOpacity>
        </ThemedView>
        
        <ThemedText style={styles.versionText}>QuantDuo v1.0.0</ThemedText>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 120,
    paddingBottom: Layout.SAFE_BOTTOM_PADDING,
    paddingHorizontal: 16,
    gap: 16,
  },
  profileHeader: {
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  profileImageContainer: {
    position: 'relative',
    marginRight: 16,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileInitials: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  levelBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  levelText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  profileUsername: {
    fontSize: 14,
    opacity: 0.7,
    marginBottom: 4,
  },
  profileJoinDate: {
    fontSize: 12,
    opacity: 0.5,
    marginBottom: 12,
  },
  xpContainer: {
    width: '100%',
  },
  xpLabelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  xpLabel: {
    fontSize: 12,
    opacity: 0.7,
  },
  xpNextLevel: {
    fontSize: 12,
    opacity: 0.7,
  },
  xpProgressBar: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  xpProgressFill: {
    height: '100%',
    borderRadius: 4,
  },
  statsContainer: {
    borderRadius: 16,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  statItem: {
    width: '50%',
    marginBottom: 16,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statName: {
    fontSize: 14,
    opacity: 0.7,
  },
  badgesContainer: {
    borderRadius: 16,
    padding: 16,
  },
  badgesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  badgeItem: {
    width: '48%',
    marginBottom: 16,
    alignItems: 'center',
  },
  badgeIconContainer: {
    marginBottom: 8,
  },
  badgeName: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
    textAlign: 'center',
  },
  badgeDescription: {
    fontSize: 12,
    opacity: 0.7,
    textAlign: 'center',
  },
  settingsContainer: {
    borderRadius: 16,
    padding: 16,
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  settingsItemIcon: {
    marginRight: 12,
    width: 24,
    alignItems: 'center',
  },
  settingsItemContent: {
    flex: 1,
  },
  settingsItemText: {
    fontSize: 16,
  },
  settingsItemSubtext: {
    fontSize: 12,
    opacity: 0.6,
    marginTop: 2,
  },
  versionText: {
    textAlign: 'center',
    fontSize: 12,
    opacity: 0.5,
    marginTop: 16,
  },
}); 