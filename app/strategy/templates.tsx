import React, { useState } from 'react';
import { StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Stack, router } from 'expo-router';
import { BlurView } from 'expo-blur';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import Layout from '@/constants/Layout';
import { useColorScheme } from '@/hooks/useColorScheme';
import { IconSymbol } from '@/components/ui/IconSymbol';

// Template interface
interface StrategyTemplate {
  id: string;
  name: string;
  description: string;
  complexity: 'basic' | 'intermediate' | 'advanced';
  tags: string[];
}

// Mock templates
const strategyTemplates: StrategyTemplate[] = [
  {
    id: 'template-1',
    name: 'Moving Average Crossover',
    description: 'A simple strategy that generates buy and sell signals based on moving average crossovers.',
    complexity: 'basic',
    tags: ['Technical', 'Trend Following', 'Beginner Friendly']
  },
  {
    id: 'template-2',
    name: 'RSI Mean Reversion',
    description: 'Uses the Relative Strength Index to identify overbought and oversold conditions.',
    complexity: 'basic',
    tags: ['Technical', 'Mean Reversion', 'Oscillator']
  },
  {
    id: 'template-3',
    name: 'Multi-Factor Ranking',
    description: 'Ranks assets based on multiple factors including value, momentum, and quality metrics.',
    complexity: 'intermediate',
    tags: ['Fundamental', 'Ranking', 'Multi-Factor']
  },
  {
    id: 'template-4',
    name: 'Volatility Breakout',
    description: 'Identifies breakouts from periods of low volatility to capture directional moves.',
    complexity: 'intermediate',
    tags: ['Technical', 'Volatility', 'Breakout']
  },
  {
    id: 'template-5',
    name: 'Statistical Arbitrage',
    description: 'Identifies pairs of related securities and trades their mean-reverting spread.',
    complexity: 'advanced',
    tags: ['Statistical', 'Mean Reversion', 'Market Neutral']
  },
  {
    id: 'template-6',
    name: 'Machine Learning Classifier',
    description: 'Uses a pre-trained machine learning model to classify market regimes and make predictions.',
    complexity: 'advanced',
    tags: ['Machine Learning', 'Classification', 'Regime Detection']
  }
];

export default function StrategyTemplatesScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedComplexity, setSelectedComplexity] = useState<string | null>(null);
  
  // Filter templates based on search query and selected complexity
  const filteredTemplates = strategyTemplates.filter(template => {
    const matchesSearch = 
      searchQuery === '' || 
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      
    const matchesComplexity = 
      selectedComplexity === null || 
      template.complexity === selectedComplexity;
      
    return matchesSearch && matchesComplexity;
  });
  
  const handleTemplateSelect = (template: StrategyTemplate) => {
    Alert.alert(
      'Use Template',
      `Would you like to create a new strategy using the ${template.name} template?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Create', 
          onPress: () => {
            // In a real app, we'd create a new strategy based on the template
            const newStrategyId = `strat-template-${Date.now()}`;
            // Navigate to the new strategy
            router.push(`/strategy/${newStrategyId}`);
          }
        }
      ]
    );
  };
  
  const complexityColors = {
    basic: colors.profit,
    intermediate: colors.warning,
    advanced: colors.loss
  };
  
  return (
    <ThemedView style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Strategy Templates',
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
        <ThemedText style={styles.headerText}>
          Start with a pre-built template to accelerate your strategy development
        </ThemedText>
        
        {/* Complexity filters */}
        <ThemedView style={styles.filterContainer}>
          <TouchableOpacity
            style={[
              styles.filterButton,
              selectedComplexity === null && { backgroundColor: colors.tint }
            ]}
            onPress={() => setSelectedComplexity(null)}
          >
            <ThemedText 
              style={[
                styles.filterText,
                selectedComplexity === null && { color: '#FFFFFF', fontWeight: 'bold' }
              ]}
            >
              All
            </ThemedText>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.filterButton,
              selectedComplexity === 'basic' && { backgroundColor: complexityColors.basic }
            ]}
            onPress={() => setSelectedComplexity(selectedComplexity === 'basic' ? null : 'basic')}
          >
            <ThemedText 
              style={[
                styles.filterText,
                selectedComplexity === 'basic' && { color: '#FFFFFF', fontWeight: 'bold' }
              ]}
            >
              Basic
            </ThemedText>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.filterButton,
              selectedComplexity === 'intermediate' && { backgroundColor: complexityColors.intermediate }
            ]}
            onPress={() => setSelectedComplexity(selectedComplexity === 'intermediate' ? null : 'intermediate')}
          >
            <ThemedText 
              style={[
                styles.filterText,
                selectedComplexity === 'intermediate' && { color: '#FFFFFF', fontWeight: 'bold' }
              ]}
            >
              Intermediate
            </ThemedText>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.filterButton,
              selectedComplexity === 'advanced' && { backgroundColor: complexityColors.advanced }
            ]}
            onPress={() => setSelectedComplexity(selectedComplexity === 'advanced' ? null : 'advanced')}
          >
            <ThemedText 
              style={[
                styles.filterText,
                selectedComplexity === 'advanced' && { color: '#FFFFFF', fontWeight: 'bold' }
              ]}
            >
              Advanced
            </ThemedText>
          </TouchableOpacity>
        </ThemedView>
        
        {/* Template cards */}
        {filteredTemplates.map(template => (
          <TouchableOpacity
            key={template.id}
            style={[styles.templateCard, { backgroundColor: colors.card, borderColor: colors.border }]}
            onPress={() => handleTemplateSelect(template)}
          >
            <ThemedView style={styles.templateHeader}>
              <ThemedText style={styles.templateName}>{template.name}</ThemedText>
              <ThemedView 
                style={[
                  styles.complexityBadge, 
                  { backgroundColor: complexityColors[template.complexity] }
                ]}
              >
                <ThemedText style={styles.complexityText}>
                  {template.complexity.charAt(0).toUpperCase() + template.complexity.slice(1)}
                </ThemedText>
              </ThemedView>
            </ThemedView>
            
            <ThemedText style={styles.templateDescription}>{template.description}</ThemedText>
            
            <ThemedView style={styles.tagsContainer}>
              {template.tags.map(tag => (
                <ThemedView key={tag} style={[styles.tag, { backgroundColor: colors.border }]}>
                  <ThemedText style={styles.tagText}>{tag}</ThemedText>
                </ThemedView>
              ))}
            </ThemedView>
            
            <TouchableOpacity
              style={[styles.useButton, { backgroundColor: colors.tint }]}
              onPress={() => handleTemplateSelect(template)}
            >
              <ThemedText style={styles.useButtonText}>Use Template</ThemedText>
            </TouchableOpacity>
          </TouchableOpacity>
        ))}
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
    paddingTop: 100,
    paddingBottom: Layout.SAFE_BOTTOM_PADDING,
    paddingHorizontal: 16,
  },
  backButton: {
    padding: 8,
    marginLeft: 8,
  },
  headerText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    opacity: 0.8,
  },
  filterContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    justifyContent: 'space-between',
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 16,
    backgroundColor: 'rgba(150, 150, 150, 0.1)',
  },
  filterText: {
    fontSize: 14,
  },
  templateCard: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    marginBottom: 16,
  },
  templateHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  templateName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  complexityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  complexityText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  templateDescription: {
    fontSize: 14,
    marginBottom: 12,
    lineHeight: 20,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
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
  useButton: {
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 8,
  },
  useButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
}); 