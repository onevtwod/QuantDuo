import React, { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, Dimensions, View, TouchableOpacity, Alert } from 'react-native';
import { Stack, useLocalSearchParams, router } from 'expo-router';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import Layout from '@/constants/Layout';
import { useColorScheme } from '@/hooks/useColorScheme';
import { IconSymbol } from '@/components/ui/IconSymbol';

// Define the Strategy interface
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

// Mock strategy data (in a real app, this would come from a database or API)
const mockStrategies: Strategy[] = [
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
];

export default function StrategyDetailScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { id } = useLocalSearchParams();
  const [strategy, setStrategy] = useState<Strategy | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch strategy data
  useEffect(() => {
    // In a real app, fetch from API or database
    const fetchedStrategy = mockStrategies.find(s => s.id === id);
    
    if (fetchedStrategy) {
      setStrategy(fetchedStrategy);
    } else {
      // Handle case for new strategies (from create or import)
      if (id && typeof id === 'string' && (id.startsWith('strat-') || id.includes('import'))) {
        // Create a placeholder for new strategies
        setStrategy({
          id: id as string,
          name: id.includes('import') ? 'Imported Strategy' : 'New Strategy',
          description: 'This is a newly created strategy. Configure it to your needs.',
          performance: {
            returns: 0,
            sharpe: 0,
            drawdown: 0,
            winRate: 0
          },
          tags: ['New', 'Custom']
        });
      } else {
        // Strategy not found
        Alert.alert('Error', 'Strategy not found', [
          { text: 'OK', onPress: () => router.back() }
        ]);
      }
    }
    
    setLoading(false);
  }, [id]);

  if (loading || !strategy) {
    return (
      <ThemedView style={[styles.container, styles.loadingContainer]}>
        <ThemedText>Loading strategy...</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen
        options={{
          title: strategy.name,
          headerShown: true,
          headerTransparent: true,
          headerBlurEffect: colorScheme === 'dark' ? 'dark' : 'light',
          headerTintColor: colors.text,
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <IconSymbol name="chevron.left" size={24} color={colors.text} />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity onPress={() => Alert.alert('Edit', 'Edit strategy functionality')} style={styles.editButton}>
              <IconSymbol name="pencil" size={20} color={colors.text} />
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
        <ThemedView style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <ThemedText style={styles.description}>{strategy.description}</ThemedText>
          
          <ThemedView style={styles.tagsContainer}>
            {strategy.tags.map(tag => (
              <ThemedView key={tag} style={[styles.tag, { backgroundColor: colors.border }]}>
                <ThemedText style={styles.tagText}>{tag}</ThemedText>
              </ThemedView>
            ))}
          </ThemedView>
        </ThemedView>

        <ThemedText style={styles.sectionTitle}>Performance</ThemedText>
        <ThemedView style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <ThemedView style={styles.performanceGrid}>
            <ThemedView style={styles.performanceItem}>
              <ThemedText style={styles.performanceValue}>
                {strategy.performance.returns > 0 ? '+' : ''}{strategy.performance.returns}%
              </ThemedText>
              <ThemedText style={styles.performanceLabel}>Returns</ThemedText>
            </ThemedView>
            
            <ThemedView style={styles.performanceItem}>
              <ThemedText style={styles.performanceValue}>{strategy.performance.sharpe}</ThemedText>
              <ThemedText style={styles.performanceLabel}>Sharpe Ratio</ThemedText>
            </ThemedView>
            
            <ThemedView style={styles.performanceItem}>
              <ThemedText style={styles.performanceValue}>-{strategy.performance.drawdown}%</ThemedText>
              <ThemedText style={styles.performanceLabel}>Max Drawdown</ThemedText>
            </ThemedView>
            
            <ThemedView style={styles.performanceItem}>
              <ThemedText style={styles.performanceValue}>{strategy.performance.winRate}%</ThemedText>
              <ThemedText style={styles.performanceLabel}>Win Rate</ThemedText>
            </ThemedView>
          </ThemedView>
        </ThemedView>

        <ThemedText style={styles.sectionTitle}>Actions</ThemedText>
        <ThemedView style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => Alert.alert('Backtest', 'Run backtest on this strategy')}
          >
            <IconSymbol name="chart.bar.fill" size={20} color={colors.tint} />
            <ThemedText style={styles.actionButtonText}>Run Backtest</ThemedText>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => Alert.alert('Deploy', 'Deploy this strategy to paper trading')}
          >
            <IconSymbol name="paperplane.fill" size={20} color={colors.tint} />
            <ThemedText style={styles.actionButtonText}>Deploy to Paper Trading</ThemedText>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => Alert.alert('Export', 'Export this strategy')}
          >
            <IconSymbol name="arrow.up.doc.fill" size={20} color={colors.tint} />
            <ThemedText style={styles.actionButtonText}>Export Strategy</ThemedText>
          </TouchableOpacity>
        </ThemedView>

        <ThemedText style={styles.sectionTitle}>Code Editor</ThemedText>
        <TouchableOpacity 
          style={[styles.editorCard, { backgroundColor: colors.card, borderColor: colors.border }]}
          onPress={() => Alert.alert('Code Editor', 'Open the code editor to modify this strategy')}
        >
          <ThemedView style={styles.codePreview}>
            <ThemedText style={styles.codeText}>
              <ThemedText style={{ color: '#569CD6' }}>def</ThemedText> initialize(context):
            </ThemedText>
            <ThemedText style={styles.codeText}>    context.stocks = ['SPY', 'QQQ', 'IWM']</ThemedText>
            <ThemedText style={styles.codeText}>    context.lookback = 20</ThemedText>
            <ThemedText style={styles.codeText}></ThemedText>
            <ThemedText style={styles.codeText}>
              <ThemedText style={{ color: '#569CD6' }}>def</ThemedText> handle_data(context, data):
            </ThemedText>
            <ThemedText style={styles.codeText}>    # Strategy logic goes here</ThemedText>
            <ThemedText style={styles.codeText}>    pass</ThemedText>
          </ThemedView>
          <ThemedView style={styles.editorButtonWrapper}>
            <ThemedView style={[styles.editorButton, { backgroundColor: colors.tint }]}>
              <ThemedText style={styles.editorButtonText}>Open Code Editor</ThemedText>
            </ThemedView>
          </ThemedView>
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
  editButton: {
    padding: 8,
    marginRight: 8,
  },
  card: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
    marginBottom: 16,
    lineHeight: 22,
  },
  tagsContainer: {
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    marginTop: 8,
  },
  performanceGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  performanceItem: {
    width: '48%',
    alignItems: 'center',
    marginBottom: 16,
  },
  performanceValue: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  performanceLabel: {
    fontSize: 14,
    opacity: 0.7,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(150, 150, 150, 0.2)',
  },
  actionButtonText: {
    fontSize: 16,
    marginLeft: 12,
  },
  editorCard: {
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
    marginBottom: 20,
  },
  codePreview: {
    padding: 16,
    backgroundColor: '#1E1E1E',
  },
  codeText: {
    fontFamily: 'monospace',
    fontSize: 14,
    lineHeight: 20,
    color: '#D4D4D4',
  },
  editorButtonWrapper: {
    padding: 16,
    alignItems: 'center',
  },
  editorButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  editorButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
}); 