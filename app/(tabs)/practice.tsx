import React, { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, TouchableOpacity, Dimensions, View, Modal, TextInput, Alert } from 'react-native';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import { BlurView } from 'expo-blur';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import Layout from '@/constants/Layout';
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
  const params = useLocalSearchParams();
  
  // Initialize activeTab state, checking for params from navigation
  const [activeTab, setActiveTab] = useState<'strategies' | 'challenges'>(
    params.activeTab === 'challenges' ? 'challenges' : 'strategies'
  );
  
  // Add state for the new strategy modal
  const [isNewStrategyModalVisible, setIsNewStrategyModalVisible] = useState(false);
  const [newStrategyName, setNewStrategyName] = useState('');
  const [newStrategyDescription, setNewStrategyDescription] = useState('');
  
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

  // Handle navigation to strategy details
  const handleStrategyPress = (strategyId: string) => {
    router.push(`/strategy/${strategyId}`);
  };

  // Handle navigation to challenge details
  const handleChallengePress = (challengeId: string) => {
    router.push(`/challenge/${challengeId}`);
  };

  // Handle creating a new strategy
  const handleCreateStrategy = () => {
    if (!newStrategyName.trim()) {
      Alert.alert('Error', 'Please enter a strategy name');
      return;
    }

    // Create a new strategy object
    const newStrategy = {
      id: `strat-${Date.now()}`,
      name: newStrategyName,
      description: newStrategyDescription || 'No description provided',
      performance: {
        returns: 0,
        sharpe: 0,
        drawdown: 0,
        winRate: 0
      },
      tags: ['New', 'Custom']
    };

    // Add the new strategy to the list
    setStrategies(prev => [newStrategy, ...prev]);
    
    // Reset form and close modal
    setNewStrategyName('');
    setNewStrategyDescription('');
    setIsNewStrategyModalVisible(false);
    
    // Navigate to the new strategy's detail page
    router.push(`/strategy/${newStrategy.id}`);
  };

  // Handle importing a strategy - replaced with mock implementation
  const handleImportStrategy = () => {
    Alert.alert(
      'Import Strategy',
      'Select a strategy file to import',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Choose File',
          onPress: () => {
            // Mock file selection - in a real app, this would use document picker
            setTimeout(() => {
              Alert.alert(
                'Strategy Import',
                'Would you like to import "example_strategy.json"?',
                [
                  { text: 'Cancel', style: 'cancel' },
                  {
                    text: 'Import',
                    onPress: () => {
                      // Create mock imported strategy
                      const newStrategyId = `strat-import-${Date.now()}`;
                      const newStrategy = {
                        id: newStrategyId,
                        name: 'Imported Strategy',
                        description: 'This strategy was imported from a file',
                        performance: {
                          returns: 8.5,
                          sharpe: 1.2,
                          drawdown: 12.3,
                          winRate: 55
                        },
                        tags: ['Imported', 'Custom']
                      };
                      
                      // Add to strategies list
                      setStrategies(prev => [newStrategy, ...prev]);
                      Alert.alert('Success', 'Strategy imported successfully');
                      
                      // Navigate to the new strategy
                      router.push(`/strategy/${newStrategyId}`);
                    }
                  }
                ]
              );
            }, 500); // Simulate file selection delay
          }
        }
      ]
    );
  };

  // Render a strategy card
  const renderStrategyCard = (strategy: Strategy) => {
    return (
      <TouchableOpacity
        key={strategy.id}
        style={[styles.strategyCard, { borderColor: colors.border, backgroundColor: colors.card }]}
        onPress={() => handleStrategyPress(strategy.id)}
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
        onPress={() => handleChallengePress(challenge.id)}
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
                onPress={() => setIsNewStrategyModalVisible(true)}
              >
                <IconSymbol name="plus" size={20} color="#FFFFFF" />
                <ThemedText style={styles.actionButtonText}>New Strategy</ThemedText>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.actionButton, { backgroundColor: colors.card, borderColor: colors.border, borderWidth: 1 }]}
                onPress={handleImportStrategy}
              >
                <IconSymbol name="arrow.down.doc.fill" size={20} color={colors.tint} />
                <ThemedText style={[styles.actionButtonText, { color: colors.text }]}>Import</ThemedText>
              </TouchableOpacity>
            </ThemedView>
            
            {strategies.map(renderStrategyCard)}
            
            <TouchableOpacity 
              style={[styles.templateCard, { borderColor: colors.border, backgroundColor: colors.card }]}
              onPress={() => router.push('/strategy/templates')}
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

      {/* New Strategy Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isNewStrategyModalVisible}
        onRequestClose={() => setIsNewStrategyModalVisible(false)}
      >
        <ThemedView style={styles.modalOverlay}>
          <ThemedView style={[styles.modalContent, { backgroundColor: colors.card }]}>
            <ThemedText style={styles.modalTitle}>Create New Strategy</ThemedText>
            
            <ThemedText style={styles.modalLabel}>Strategy Name</ThemedText>
            <TextInput
              style={[styles.modalInput, { backgroundColor: colors.background, color: colors.text, borderColor: colors.border }]}
              value={newStrategyName}
              onChangeText={setNewStrategyName}
              placeholder="Enter strategy name"
              placeholderTextColor={colors.text + '50'}
            />
            
            <ThemedText style={styles.modalLabel}>Description (optional)</ThemedText>
            <TextInput
              style={[styles.modalInput, { backgroundColor: colors.background, color: colors.text, borderColor: colors.border, height: 100 }]}
              value={newStrategyDescription}
              onChangeText={setNewStrategyDescription}
              placeholder="Describe your strategy"
              placeholderTextColor={colors.text + '50'}
              multiline
              textAlignVertical="top"
            />
            
            <ThemedView style={styles.modalButtonContainer}>
              <TouchableOpacity 
                style={[styles.modalButton, { borderColor: colors.border }]}
                onPress={() => setIsNewStrategyModalVisible(false)}
              >
                <ThemedText style={styles.modalButtonText}>Cancel</ThemedText>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.modalButton, { backgroundColor: colors.tint }]}
                onPress={handleCreateStrategy}
              >
                <ThemedText style={[styles.modalButtonText, { color: '#FFFFFF' }]}>Create</ThemedText>
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
    paddingBottom: Layout.SAFE_BOTTOM_PADDING,
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
  // New modal styles
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '85%',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  modalLabel: {
    alignSelf: 'flex-start',
    marginBottom: 8,
    fontSize: 14,
  },
  modalInput: {
    width: '100%',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 10,
  },
  modalButton: {
    borderRadius: 8,
    padding: 12,
    width: '48%',
    alignItems: 'center',
    borderWidth: 1,
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 