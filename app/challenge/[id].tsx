import React, { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, TouchableOpacity, Alert, Pressable, Image } from 'react-native';
import { Stack, useLocalSearchParams, router } from 'expo-router';
import { BlurView } from 'expo-blur';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import Layout from '@/constants/Layout';
import { useColorScheme } from '@/hooks/useColorScheme';
import { IconSymbol } from '@/components/ui/IconSymbol';

// Interface for challenge
interface Challenge {
  id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  reward: number;
  completed: boolean;
  instructions?: string[];
  requirements?: {
    description: string;
    completed: boolean;
  }[];
}

// Mock challenge data
const mockChallenges: Challenge[] = [
  {
    id: 'chal-1',
    title: 'Build a Moving Average Crossover Strategy',
    description: 'Create a strategy using SMA and EMA crossovers that achieves a Sharpe ratio > 1.0',
    difficulty: 'beginner',
    reward: 100,
    completed: false,
    instructions: [
      'Create a strategy that uses two moving averages - one fast (shorter period) and one slow (longer period).',
      'Generate buy signals when the fast MA crosses above the slow MA.',
      'Generate sell signals when the fast MA crosses below the slow MA.',
      'Backtest your strategy on at least 3 years of data using SPY or similar ETF.',
      'Optimize the MA periods to achieve a Sharpe ratio > 1.0'
    ],
    requirements: [
      { description: 'Implement both SMA and EMA crossover logic', completed: false },
      { description: 'Achieve Sharpe ratio > 1.0', completed: false },
      { description: 'Include proper position sizing logic', completed: false },
      { description: 'Document your strategy with comments', completed: false }
    ]
  },
  {
    id: 'chal-2',
    title: 'Optimize a Factor Model',
    description: 'Improve the given multi-factor model to reduce drawdown while maintaining returns',
    difficulty: 'intermediate',
    reward: 250,
    completed: false,
    instructions: [
      'Analyze the provided multi-factor model which currently has high drawdown.',
      'Identify which factors are contributing most to the drawdown risk.',
      'Optimize factor weights to reduce maximum drawdown while maintaining similar returns.',
      'Add at least one additional factor that helps with risk management.',
      'Document your changes and explain your reasoning.'
    ],
    requirements: [
      { description: 'Reduce max drawdown by at least 25%', completed: false },
      { description: 'Maintain at least 90% of original returns', completed: false },
      { description: 'Add at least one new factor', completed: false },
      { description: 'Provide statistical justification for changes', completed: false }
    ]
  },
  {
    id: 'chal-3',
    title: 'Develop a Market Neutral Strategy',
    description: 'Create a strategy with near-zero beta to the S&P 500 while achieving positive returns',
    difficulty: 'advanced',
    reward: 500,
    completed: false,
    instructions: [
      'Design a long-short equity strategy with balanced exposure.',
      'Implement hedging techniques to minimize market beta.',
      'Ensure the strategy has a beta of between -0.1 and 0.1 to SPY.',
      'Achieve positive returns over a 5-year backtest period.',
      'Maintain low correlation with major market indices.'
    ],
    requirements: [
      { description: 'Achieve beta between -0.1 and 0.1', completed: false },
      { description: 'Generate positive returns over 5 years', completed: false },
      { description: 'Maintain Sharpe ratio > 1.2', completed: false },
      { description: 'Keep correlation with S&P 500 below 0.3', completed: false }
    ]
  },
  {
    id: 'chal-4',
    title: 'Pairs Trading Challenge',
    description: 'Identify and trade correlated pairs of stocks to profit from temporary price divergences',
    difficulty: 'intermediate',
    reward: 300,
    completed: true,
    instructions: [
      'Develop an algorithm to identify highly correlated pairs of stocks within sectors.',
      'Implement statistical measures to detect temporary divergences between pairs.',
      'Create entry and exit logic based on mean reversion principles.',
      'Backtest your pairs trading strategy across multiple sectors.',
      'Implement risk management rules to handle correlation breakdowns.'
    ],
    requirements: [
      { description: 'Identify at least 5 tradable pairs', completed: true },
      { description: 'Implement cointegration testing', completed: true },
      { description: 'Create z-score based trading signals', completed: true },
      { description: 'Achieve positive returns with low drawdown', completed: true }
    ]
  }
];

export default function ChallengeDetailScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { id } = useLocalSearchParams();
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Get the challenge data
  useEffect(() => {
    const fetchedChallenge = mockChallenges.find(c => c.id === id);
    
    if (fetchedChallenge) {
      setChallenge(fetchedChallenge);
    } else {
      Alert.alert('Error', 'Challenge not found', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    }
    
    setLoading(false);
  }, [id]);
  
  if (loading || !challenge) {
    return (
      <ThemedView style={[styles.container, styles.loadingContainer]}>
        <ThemedText>Loading challenge...</ThemedText>
      </ThemedView>
    );
  }
  
  // Difficulty colors
  const difficultyColors = {
    beginner: colors.profit,
    intermediate: colors.warning,
    advanced: colors.loss
  };
  
  const handleStartChallenge = () => {
    if (challenge.completed) {
      Alert.alert('Challenge Completed', 'You have already completed this challenge!');
      return;
    }
    
    // Navigate to a challenge editor or implementation page
    Alert.alert('Start Challenge', 'Navigate to challenge implementation page');
  };
  
  return (
    <ThemedView style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Challenge Details',
          headerShown: true,
          headerTransparent: true,
          headerBlurEffect: colorScheme === 'dark' ? 'dark' : 'light',
          headerTintColor: colors.text,
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
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
        <ThemedView style={[styles.headerCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          {challenge.completed && (
            <ThemedView style={styles.completedBadge}>
              <IconSymbol name="checkmark" size={12} color="#FFFFFF" />
            </ThemedView>
          )}
          
          <ThemedView style={styles.challengeHeader}>
            <ThemedView 
              style={[
                styles.difficultyBadge, 
                { backgroundColor: difficultyColors[challenge.difficulty] }
              ]}
            >
              <ThemedText style={styles.difficultyText}>
                {challenge.difficulty.charAt(0).toUpperCase() + challenge.difficulty.slice(1)}
              </ThemedText>
            </ThemedView>
            
            <ThemedView style={styles.rewardBadge}>
              <IconSymbol name="star.fill" size={12} color="#FFD700" />
              <ThemedText style={styles.rewardText}>{challenge.reward}</ThemedText>
            </ThemedView>
          </ThemedView>
          
          <ThemedText style={styles.challengeTitle}>{challenge.title}</ThemedText>
          <ThemedText style={styles.challengeDescription}>{challenge.description}</ThemedText>
        </ThemedView>
        
        <ThemedText style={styles.sectionTitle}>Instructions</ThemedText>
        <ThemedView style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          {challenge.instructions?.map((instruction, index) => (
            <ThemedView key={index} style={styles.instructionItem}>
              <ThemedText style={styles.bulletPoint}>•</ThemedText>
              <ThemedText style={styles.instructionText}>{instruction}</ThemedText>
            </ThemedView>
          ))}
        </ThemedView>
        
        <ThemedText style={styles.sectionTitle}>Requirements</ThemedText>
        <ThemedView style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          {challenge.requirements?.map((requirement, index) => (
            <ThemedView key={index} style={styles.requirementItem}>
              <ThemedView 
                style={[
                  styles.checkBox, 
                  { 
                    backgroundColor: requirement.completed ? colors.profit : 'transparent',
                    borderColor: requirement.completed ? colors.profit : colors.border
                  }
                ]}
              >
                {requirement.completed && (
                  <IconSymbol name="checkmark" size={12} color="#FFFFFF" />
                )}
              </ThemedView>
              <ThemedText 
                style={[
                  styles.requirementText,
                  requirement.completed && { textDecorationLine: 'line-through', opacity: 0.7 }
                ]}
              >
                {requirement.description}
              </ThemedText>
            </ThemedView>
          ))}
        </ThemedView>
        
        <TouchableOpacity
          style={[
            styles.startButton,
            { 
              backgroundColor: challenge.completed ? colors.card : colors.tint,
              borderColor: challenge.completed ? colors.border : colors.tint,
              borderWidth: 1
            }
          ]}
          onPress={handleStartChallenge}
        >
          <ThemedText 
            style={[
              styles.startButtonText,
              { color: challenge.completed ? colors.text : '#FFFFFF' }
            ]}
          >
            {challenge.completed ? 'View Completed Challenge' : 'Start Challenge'}
          </ThemedText>
        </TouchableOpacity>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 100, // Space for the header
    paddingBottom: Layout.SAFE_BOTTOM_PADDING,
    paddingHorizontal: 16,
  },
  backButton: {
    padding: 8,
    marginLeft: 8,
  },
  headerCard: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    marginBottom: 20,
    position: 'relative',
  },
  challengeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  difficultyText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  rewardBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rewardText: {
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  challengeTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  challengeDescription: {
    fontSize: 16,
    lineHeight: 22,
  },
  completedBadge: {
    position: 'absolute',
    top: -8,
    right: -8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#00C853',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    marginTop: 8,
  },
  card: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    marginBottom: 20,
  },
  instructionItem: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  bulletPoint: {
    fontSize: 16,
    marginRight: 8,
  },
  instructionText: {
    fontSize: 16,
    lineHeight: 22,
    flex: 1,
  },
  requirementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  checkBox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  requirementText: {
    fontSize: 16,
    flex: 1,
  },
  startButton: {
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 30,
  },
  startButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 