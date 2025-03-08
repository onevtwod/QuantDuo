import React, { useState } from 'react';
import { StyleSheet, ScrollView, TouchableOpacity, Dimensions, View } from 'react-native';
import { Stack } from 'expo-router';
import { BlurView } from 'expo-blur';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { IconSymbol } from '@/components/ui/IconSymbol';

// Mock data for strategies
interface Strategy {
  id: string;
  name: string;
  description: string;
  performance: {
    returns: number;
    sharpe: number;
    drawdown: number;
    winRate: number;
  };
  tags: string[];
}

// Mock data for challenges
interface Challenge {
  id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  reward: number;
  completed: boolean;
}

export default function PracticeScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [activeTab, setActiveTab] = useState<'strategies' | 'challenges'>('strategies');
  
  // Sample strategies data
  const [strategies, setStrategies] = useState<Strategy[]>([
    {
      id: 'strat-1',
      name: 'Mean Reversion ETF',
      description: 'A strategy that buys oversold ETFs and sells when they return to their mean',
      performance: {
        returns: 12.5,
        sharpe: 1.8,
        drawdown: 8.2,
        winRate: 62
      },
      tags: ['Mean Reversion', 'ETFs', 'Daily']
    },
    {
      id: 'strat-2',
      name: 'Momentum Stocks',
      description: 'Captures momentum in high-volume stocks with recent price breakouts',
      performance: {
        returns: 18.7,
        sharpe: 1.5,
        drawdown: 15.3,
        winRate: 58
      },
      tags: ['Momentum', 'Stocks', 'Weekly']
    },
    {
      id: 'strat-3',
      name: 'Volatility Arbitrage',
      description: 'Exploits differences between implied and realized volatility in options',
      performance: {
        returns: 9.2,
        sharpe: 2.1,
        drawdown: 5.8,
        winRate: 70
      },
      tags: ['Volatility', 'Options', 'Market Neutral']
    }
  ]);
  
  // Sample challenges data
  const [challenges, setChallenges] = useState<Challenge[]>([
    {
      id: 'chal-1',
      title: 'Build a Moving Average Crossover Strategy',
      description: 'Create a strategy using SMA and EMA crossovers that achieves a Sharpe ratio > 1.0',
      difficulty: 'beginner',
      reward: 100,
      completed: false
    },
    {
      id: 'chal-2',
      title: 'Optimize a Factor Model',
      description: 'Improve the given multi-factor model to reduce drawdown while maintaining returns',
      difficulty: 'intermediate',
      reward: 250,
      completed: false
    },
    {
      id: 'chal-3',
      title: 'Develop a Market Neutral Strategy',
      description: 'Create a strategy with near-zero beta to the S&P 500 while achieving positive returns',
      difficulty: 'advanced',
      reward: 500,
      completed: false
    },
    {
      id: 'chal-4',
      title: 'Pairs Trading Challenge',
      description: 'Identify and trade correlated pairs of stocks to profit from temporary price divergences',
      difficulty: 'intermediate',
      reward: 300,
      completed: true
    }
  ]);

  // Render a strategy card
  const renderStrategyCard = (strategy: Strategy) => {
    return (
      <TouchableOpacity
        key={strategy.id}
        style={[styles.strategyCard, { borderColor: colors.border, backgroundColor: colors.card }]}
        onPress={() => {/* Navigate to strategy details */}}
      >
        <ThemedText style={styles.strategyName}>{strategy.name}</ThemedText>
        <ThemedText style={styles.strategyDescription}>{strategy.description}</ThemedText>
        
        <ThemedView style={styles.performanceGrid}>
          <ThemedView style={styles.performanceItem}>
            <ThemedText style={styles.performanceValue}>
              {strategy.performance.returns > 0 ? '+' : ''}{strategy.performance.returns}%
            </ThemedText>
            <ThemedText style={styles.performanceLabel}>Returns</ThemedText>
          </ThemedView>
          
          <ThemedView style={styles.performanceItem}>
            <ThemedText style={styles.performanceValue}>{strategy.performance.sharpe}</ThemedText>
            <ThemedText style={styles.performanceLabel}>Sharpe</ThemedText>
          </ThemedView>
          
          <ThemedView style={styles.performanceItem}>
            <ThemedText style={styles.performanceValue}>-{strategy.performance.drawdown}%</ThemedText>
            <ThemedText style={styles.performanceLabel}>Max DD</ThemedText>
          </ThemedView>
          
          <ThemedView style={styles.performanceItem}>
            <ThemedText style={styles.performanceValue}>{strategy.performance.winRate}%</ThemedText>
            <ThemedText style={styles.performanceLabel}>Win Rate</ThemedText>
          </ThemedView>
        </ThemedView>
        
        <ThemedView style={styles.tagContainer}>
          {strategy.tags.map(tag => (
            <ThemedView key={tag} style={[styles.tag, { backgroundColor: colors.border }]}>
              <ThemedText style={styles.tagText}>{tag}</ThemedText>
            </ThemedView>
          ))}
        </ThemedView>
      </TouchableOpacity>
    );
  };

  // Render a challenge card
  const renderChallengeCard = (challenge: Challenge) => {
    const difficultyColors = {
      beginner: colors.profit,
      intermediate: colors.warning,
      advanced: colors.loss
    };
    
    return (
      <TouchableOpacity
        key={challenge.id}
        style={[styles.challengeCard, { 
          borderColor: colors.border, 
          backgroundColor: colors.card,
          opacity: challenge.completed ? 0.7 : 1
        }]}
        onPress={() => {/* Navigate to challenge details */}}
      >
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
      </TouchableOpacity>
    );
  };

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: 'Practice',
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
      
      <ThemedView style={[styles.tabBar, { backgroundColor: colors.card }]}>
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'strategies' && { borderBottomColor: colors.tint, borderBottomWidth: 2 }
          ]}
          onPress={() => setActiveTab('strategies')}
        >
          <ThemedText 
            style={[
              styles.tabText, 
              activeTab === 'strategies' && { color: colors.tint, fontWeight: 'bold' }
            ]}
          >
            My Strategies
          </ThemedText>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'challenges' && { borderBottomColor: colors.tint, borderBottomWidth: 2 }
          ]}
          onPress={() => setActiveTab('challenges')}
        >
          <ThemedText 
            style={[
              styles.tabText, 
              activeTab === 'challenges' && { color: colors.tint, fontWeight: 'bold' }
            ]}
          >
            Challenges
          </ThemedText>
        </TouchableOpacity>
      </ThemedView>
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {activeTab === 'strategies' ? (
          <>
            <ThemedView style={styles.actionButtonContainer}>
              <TouchableOpacity 
                style={[styles.actionButton, { backgroundColor: colors.tint }]}
                onPress={() => {/* Navigate to create strategy */}}
              >
                <IconSymbol name="plus" size={20} color="#FFFFFF" />
                <ThemedText style={styles.actionButtonText}>New Strategy</ThemedText>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.actionButton, { backgroundColor: colors.card, borderColor: colors.border, borderWidth: 1 }]}
                onPress={() => {/* Navigate to import strategy */}}
              >
                <IconSymbol name="arrow.down.doc.fill" size={20} color={colors.tint} />
                <ThemedText style={[styles.actionButtonText, { color: colors.text }]}>Import</ThemedText>
              </TouchableOpacity>
            </ThemedView>
            
            {strategies.map(renderStrategyCard)}
            
            <TouchableOpacity 
              style={[styles.templateCard, { borderColor: colors.border, backgroundColor: colors.card }]}
              onPress={() => {/* Navigate to templates */}}
            >
              <IconSymbol name="doc.on.doc.fill" size={32} color={colors.tint} />
              <ThemedText style={styles.templateTitle}>Strategy Templates</ThemedText>
              <ThemedText style={styles.templateDescription}>
                Browse pre-built strategies to customize and learn from
              </ThemedText>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <ThemedText style={styles.sectionTitle}>Alpha Discovery Challenges</ThemedText>
            <ThemedText style={styles.sectionDescription}>
              Complete challenges to earn points and unlock advanced features
            </ThemedText>
            
            {challenges.map(renderChallengeCard)}
          </>
        )}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabBar: {
    flexDirection: 'row',
    marginTop: 100,
    marginHorizontal: 16,
    borderRadius: 8,
    overflow: 'hidden',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  tabText: {
    fontSize: 14,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 16,
    paddingBottom: 40,
    paddingHorizontal: 16,
  },
  actionButtonContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginRight: 12,
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginLeft: 8,
  },
  strategyCard: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    marginBottom: 16,
  },
  strategyName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  strategyDescription: {
    fontSize: 14,
    opacity: 0.7,
    marginBottom: 16,
  },
  performanceGrid: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  performanceItem: {
    flex: 1,
    alignItems: 'center',
  },
  performanceValue: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  performanceLabel: {
    fontSize: 12,
    opacity: 0.7,
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginRight: 8,
    marginBottom: 4,
  },
  tagText: {
    fontSize: 12,
  },
  templateCard: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    marginTop: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  templateTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 8,
    marginBottom: 4,
  },
  templateDescription: {
    fontSize: 14,
    opacity: 0.7,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 14,
    opacity: 0.7,
    marginBottom: 16,
  },
  challengeCard: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    marginBottom: 16,
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
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  challengeDescription: {
    fontSize: 14,
    opacity: 0.7,
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
}); 