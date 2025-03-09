import React from 'react';
import { StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { BlurView } from 'expo-blur';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import Layout from '@/constants/Layout';
import { useColorScheme } from '@/hooks/useColorScheme';
import { IconSymbol } from '@/components/ui/IconSymbol';

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const router = useRouter();
  
  // Mock data for daily streak
  const streakDays = 7;
  
  // Mock data for next lesson
  const nextLesson = {
    id: 'qb-4',
    title: 'Probability Distributions',
    module: 'Quant Basics',
    duration: '12 min',
    progress: 0
  };
  
  // Mock data for market insights
  const marketInsights = [
    { id: 'insight-1', title: 'S&P 500 Volatility Spike', description: 'Market volatility increased by 15% this week', icon: 'chart.xyaxis.line', color: colors.warning },
    { id: 'insight-2', title: 'Tech Sector Momentum', description: 'Technology stocks showing strong momentum signals', icon: 'arrow.up.forward', color: colors.profit },
    { id: 'insight-3', title: 'Bond Yield Inversion', description: 'Treasury yield curve showing signs of inversion', icon: 'arrow.down.forward', color: colors.loss },
  ];
  
  // Mock data for leaderboard
  const leaderboard = [
    { rank: 1, name: 'Sarah K.', points: 4850, avatar: 'S' },
    { rank: 2, name: 'Michael T.', points: 4720, avatar: 'M' },
    { rank: 3, name: 'Jessica L.', points: 4580, avatar: 'J' },
    { rank: 4, name: 'You', points: 4450, avatar: 'A', isCurrentUser: true },
    { rank: 5, name: 'David R.', points: 4320, avatar: 'D' },
  ];

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: 'QuantDuo',
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
        {/* Streak Card */}
        <ThemedView style={[styles.streakCard, { backgroundColor: colors.card }]}>
          <ThemedView style={styles.streakHeader}>
            <ThemedView style={styles.streakInfo}>
              <IconSymbol name="flame.fill" size={32} color="#FF9800" />
              <ThemedView>
                <ThemedText style={styles.streakCount}>{streakDays}</ThemedText>
                <ThemedText style={styles.streakLabel}>Day Streak</ThemedText>
              </ThemedView>
            </ThemedView>
            <TouchableOpacity 
              style={[styles.continueButton, { backgroundColor: colors.tint }]}
              onPress={() => router.push('/(tabs)/learn')}
            >
              <ThemedText style={styles.continueButtonText}>Continue Learning</ThemedText>
            </TouchableOpacity>
          </ThemedView>
          
          <ThemedView style={styles.nextLessonContainer}>
            <ThemedText style={styles.nextLessonLabel}>Next Lesson:</ThemedText>
            <ThemedView style={styles.nextLesson}>
              <ThemedView style={styles.nextLessonInfo}>
                <ThemedText style={styles.nextLessonTitle}>{nextLesson.title}</ThemedText>
                <ThemedText style={styles.nextLessonModule}>{nextLesson.module} • {nextLesson.duration}</ThemedText>
              </ThemedView>
              <IconSymbol name="play.circle.fill" size={24} color={colors.tint} />
            </ThemedView>
          </ThemedView>
        </ThemedView>
        
        {/* Quick Actions */}
        <ThemedText style={styles.sectionTitle}>Quick Actions</ThemedText>
        <ThemedView style={styles.quickActionsGrid}>
          <TouchableOpacity 
            style={[styles.quickActionCard, { backgroundColor: colors.card }]}
            onPress={() => router.push('/(tabs)/learn')}
          >
            <ThemedView style={[styles.quickActionIcon, { backgroundColor: '#4C9AFF' }]}>
              <IconSymbol name="book.fill" size={24} color="#FFFFFF" />
            </ThemedView>
            <ThemedText style={styles.quickActionTitle}>Learn</ThemedText>
            <ThemedText style={styles.quickActionSubtitle}>Continue your lessons</ThemedText>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.quickActionCard, { backgroundColor: colors.card }]}
            onPress={() => router.push('/(tabs)/practice')}
          >
            <ThemedView style={[styles.quickActionIcon, { backgroundColor: '#00C853' }]}>
              <IconSymbol name="chart.line.uptrend.xyaxis" size={24} color="#FFFFFF" />
            </ThemedView>
            <ThemedText style={styles.quickActionTitle}>Practice</ThemedText>
            <ThemedText style={styles.quickActionSubtitle}>Build strategies</ThemedText>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.quickActionCard, { backgroundColor: colors.card }]}
            onPress={() => {
              // Navigate to practice tab with challenges selected
              router.push({
                pathname: '/(tabs)/practice',
                params: { activeTab: 'challenges' }
              });
            }}
          >
            <ThemedView style={[styles.quickActionIcon, { backgroundColor: '#FF9800' }]}>
              <IconSymbol name="trophy.fill" size={24} color="#FFFFFF" />
            </ThemedView>
            <ThemedText style={styles.quickActionTitle}>Challenges</ThemedText>
            <ThemedText style={styles.quickActionSubtitle}>Test your skills</ThemedText>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.quickActionCard, { backgroundColor: colors.card }]}
            onPress={() => router.push('/(tabs)/profile')}
          >
            <ThemedView style={[styles.quickActionIcon, { backgroundColor: '#9C27B0' }]}>
              <IconSymbol name="person.fill" size={24} color="#FFFFFF" />
            </ThemedView>
            <ThemedText style={styles.quickActionTitle}>Profile</ThemedText>
            <ThemedText style={styles.quickActionSubtitle}>View progress</ThemedText>
          </TouchableOpacity>
        </ThemedView>
        
        {/* Market Insights */}
        <ThemedText style={styles.sectionTitle}>Market Insights</ThemedText>
        <ThemedView style={styles.insightsContainer}>
          {marketInsights.map(insight => (
            <TouchableOpacity 
              key={insight.id}
              style={[styles.insightCard, { backgroundColor: colors.card }]}
            >
              <ThemedView style={[styles.insightIconContainer, { backgroundColor: insight.color + '20' }]}>
                <IconSymbol name={insight.icon} size={20} color={insight.color} />
              </ThemedView>
              <ThemedView style={styles.insightContent}>
                <ThemedText style={styles.insightTitle}>{insight.title}</ThemedText>
                <ThemedText style={styles.insightDescription}>{insight.description}</ThemedText>
              </ThemedView>
            </TouchableOpacity>
          ))}
        </ThemedView>
        
        {/* Leaderboard */}
        <ThemedText style={styles.sectionTitle}>Leaderboard</ThemedText>
        <ThemedView style={[styles.leaderboardCard, { backgroundColor: colors.card }]}>
          {leaderboard.map(user => (
            <ThemedView 
              key={user.rank} 
              style={[
                styles.leaderboardItem, 
                user.isCurrentUser && { backgroundColor: colors.tint + '15' }
              ]}
            >
              <ThemedText style={styles.leaderboardRank}>#{user.rank}</ThemedText>
              <ThemedView style={styles.leaderboardUser}>
                <ThemedView 
                  style={[
                    styles.leaderboardAvatar, 
                    { 
                      backgroundColor: user.isCurrentUser ? colors.tint : colors.neutral 
                    }
                  ]}
                >
                  <ThemedText style={styles.leaderboardAvatarText}>{user.avatar}</ThemedText>
                </ThemedView>
                <ThemedText 
                  style={[
                    styles.leaderboardName,
                    user.isCurrentUser && { fontWeight: 'bold' }
                  ]}
                >
                  {user.name}
                </ThemedText>
              </ThemedView>
              <ThemedText style={styles.leaderboardPoints}>{user.points}</ThemedText>
            </ThemedView>
          ))}
          <TouchableOpacity 
            style={styles.viewFullLeaderboard}
            onPress={() => router.push('/leaderboard')}
          >
            <ThemedText style={[styles.viewFullLeaderboardText, { color: colors.tint }]}>
              View Full Leaderboard
            </ThemedText>
          </TouchableOpacity>
        </ThemedView>
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
  },
  streakCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  streakHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  streakInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  streakCount: {
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 12,
  },
  streakLabel: {
    fontSize: 14,
    opacity: 0.7,
    marginLeft: 12,
  },
  continueButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  continueButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  nextLessonContainer: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
    paddingTop: 16,
  },
  nextLessonLabel: {
    fontSize: 14,
    opacity: 0.7,
    marginBottom: 8,
  },
  nextLesson: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  nextLessonInfo: {
    flex: 1,
  },
  nextLessonTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  nextLessonModule: {
    fontSize: 14,
    opacity: 0.7,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  quickActionCard: {
    width: '48%',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  quickActionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  quickActionSubtitle: {
    fontSize: 14,
    opacity: 0.7,
  },
  insightsContainer: {
    marginBottom: 24,
  },
  insightCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
  },
  insightIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  insightContent: {
    flex: 1,
  },
  insightTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  insightDescription: {
    fontSize: 12,
    opacity: 0.7,
  },
  leaderboardCard: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 24,
  },
  leaderboardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  leaderboardRank: {
    width: 40,
    fontSize: 14,
    fontWeight: 'bold',
  },
  leaderboardUser: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  leaderboardAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  leaderboardAvatarText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  leaderboardName: {
    fontSize: 14,
  },
  leaderboardPoints: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  viewFullLeaderboard: {
    padding: 12,
    alignItems: 'center',
  },
  viewFullLeaderboardText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
});
