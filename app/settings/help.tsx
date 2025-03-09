import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput,
  Linking,
  Platform
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

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
}

interface SystemStatus {
  service: string;
  status: 'operational' | 'degraded' | 'outage';
  message: string;
}

export default function HelpSupportScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  
  // State for search query
  const [searchQuery, setSearchQuery] = useState('');
  
  // State for expanded FAQ
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);
  
  // State for feedback form
  const [feedbackForm, setFeedbackForm] = useState({
    topic: '',
    description: '',
    email: '',
  });
  
  // State for selected support category
  const [supportCategory, setSupportCategory] = useState<string>('all');
  
  // FAQ Data
  const faqs: FAQ[] = [
    {
      id: 'faq1',
      question: 'How do I create a new strategy?',
      answer: 'To create a new strategy, go to the Practice tab and click on "New Strategy". You can then choose to start from scratch or use one of our templates.',
      category: 'strategies'
    },
    {
      id: 'faq2',
      question: 'How do I track my learning progress?',
      answer: 'Your learning progress is automatically tracked as you complete lessons and modules. You can view your progress in the Learn tab and on your Profile page.',
      category: 'learning'
    },
    {
      id: 'faq3',
      question: 'What are challenges?',
      answer: 'Challenges are timed competitions that test your knowledge and strategy-building skills. You can find them in the Practice tab under the Challenges section.',
      category: 'challenges'
    },
    {
      id: 'faq4',
      question: 'How do I reset my password?',
      answer: 'To reset your password, go to the login screen and tap on "Forgot Password". Follow the instructions sent to your email to create a new password.',
      category: 'account'
    },
    {
      id: 'faq5',
      question: 'Can I export my strategies?',
      answer: 'Yes! You can export your strategies by going to the strategy detail page and tapping on the "Export" button. Your strategy will be exported as a JSON file.',
      category: 'strategies'
    },
    {
      id: 'faq6',
      question: 'How do I earn points?',
      answer: 'You earn points by completing lessons, submitting strategies, winning challenges, and maintaining a daily streak. Your points determine your ranking on the leaderboard.',
      category: 'learning'
    },
  ];
  
  // System Status
  const systemStatus: SystemStatus[] = [
    {
      service: 'Learning Platform',
      status: 'operational',
      message: 'All systems operational'
    },
    {
      service: 'Strategy Backtesting',
      status: 'operational',
      message: 'All systems operational'
    },
    {
      service: 'User Authentication',
      status: 'operational',
      message: 'All systems operational'
    },
    {
      service: 'API Services',
      status: 'degraded',
      message: 'Experiencing intermittent slowdowns'
    }
  ];
  
  // Contact options
  const contactOptions = [
    {
      id: 'email',
      title: 'Email Support',
      description: 'Get help via email within 24 hours',
      icon: 'mail',
      action: () => Linking.openURL('mailto:support@quantduo.com')
    },
    {
      id: 'chat',
      title: 'Live Chat',
      description: 'Chat with our support team in real-time',
      icon: 'chatbubble-ellipses',
      action: () => Alert.alert('Live Chat', 'Live chat will be available in a future update.')
    },
    {
      id: 'faq',
      title: 'Knowledge Base',
      description: 'Browse our comprehensive help articles',
      icon: 'book',
      action: () => Alert.alert('Knowledge Base', 'Our full knowledge base will be available in a future update.')
    }
  ];
  
  // Filter FAQs based on search query and category
  const filteredFAQs = faqs.filter(faq => {
    const matchesSearch = 
      searchQuery === '' || 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesCategory = 
      supportCategory === 'all' || 
      faq.category === supportCategory;
      
    return matchesSearch && matchesCategory;
  });
  
  // Toggle FAQ expansion
  const toggleFAQ = (id: string) => {
    setExpandedFAQ(expandedFAQ === id ? null : id);
  };
  
  // Handle form input change
  const handleFormChange = (field: keyof typeof feedbackForm, value: string) => {
    setFeedbackForm(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  // Submit feedback
  const handleSubmitFeedback = () => {
    // Check if all required fields are filled
    if (!feedbackForm.topic || !feedbackForm.description) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }
    
    // In a real app, this would send the feedback to the server
    Alert.alert(
      'Feedback Submitted',
      'Thank you for your feedback! Our team will review it shortly.',
      [{ text: 'OK', onPress: () => {
        // Reset form
        setFeedbackForm({
          topic: '',
          description: '',
          email: '',
        });
      }}]
    );
  };
  
  return (
    <ThemedView style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Help & Support',
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
        {/* Search Bar */}
        <ThemedView style={[styles.searchContainer, { backgroundColor: colors.card }]}>
          <IconSymbol name="magnifyingglass" size={16} color={colors.text} style={styles.searchIcon} />
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            placeholder="Search help topics..."
            placeholderTextColor={colors.text + '50'}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <IconSymbol name="xmark.circle.fill" size={16} color={colors.text} />
            </TouchableOpacity>
          )}
        </ThemedView>
        
        {/* Quick Contact Options */}
        <ThemedView style={styles.contactOptionsContainer}>
          {contactOptions.map(option => (
            <TouchableOpacity 
              key={option.id}
              style={[styles.contactOption, { backgroundColor: colors.card }]}
              onPress={option.action}
            >
              <Ionicons name={option.icon as any} size={28} color={colors.tint} />
              <ThemedText style={styles.contactOptionTitle}>{option.title}</ThemedText>
              <ThemedText style={styles.contactOptionDescription}>{option.description}</ThemedText>
            </TouchableOpacity>
          ))}
        </ThemedView>
        
        {/* System Status */}
        <ThemedView style={styles.section}>
          <ThemedText style={styles.sectionTitle}>System Status</ThemedText>
          <ThemedText style={styles.sectionDescription}>
            Current status of our services
          </ThemedText>
          
          {systemStatus.map(service => (
            <ThemedView key={service.service} style={styles.statusItem}>
              <ThemedView style={styles.statusHeader}>
                <ThemedText style={styles.statusTitle}>{service.service}</ThemedText>
                <ThemedView 
                  style={[
                    styles.statusBadge, 
                    { 
                      backgroundColor: 
                        service.status === 'operational' ? colors.profit + '20' : 
                        service.status === 'degraded' ? colors.warning + '20' : 
                        colors.loss + '20' 
                    }
                  ]}
                >
                  <ThemedText 
                    style={[
                      styles.statusText,
                      { 
                        color: 
                          service.status === 'operational' ? colors.profit : 
                          service.status === 'degraded' ? colors.warning : 
                          colors.loss 
                      }
                    ]}
                  >
                    {service.status === 'operational' ? 'Operational' : 
                     service.status === 'degraded' ? 'Degraded' : 
                     'Outage'}
                  </ThemedText>
                </ThemedView>
              </ThemedView>
              
              <ThemedText style={styles.statusMessage}>{service.message}</ThemedText>
            </ThemedView>
          ))}
        </ThemedView>
        
        {/* FAQ Section */}
        <ThemedView style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Frequently Asked Questions</ThemedText>
          <ThemedText style={styles.sectionDescription}>
            Quick answers to common questions
          </ThemedText>
          
          {/* FAQ Categories */}
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false} 
            style={styles.categoriesScroll}
            contentContainerStyle={styles.categoriesContainer}
          >
            <TouchableOpacity 
              style={[
                styles.categoryButton,
                supportCategory === 'all' && { backgroundColor: colors.tint }
              ]}
              onPress={() => setSupportCategory('all')}
            >
              <ThemedText 
                style={[
                  styles.categoryText,
                  supportCategory === 'all' && { color: '#FFFFFF' }
                ]}
              >
                All
              </ThemedText>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.categoryButton,
                supportCategory === 'account' && { backgroundColor: colors.tint }
              ]}
              onPress={() => setSupportCategory('account')}
            >
              <ThemedText 
                style={[
                  styles.categoryText,
                  supportCategory === 'account' && { color: '#FFFFFF' }
                ]}
              >
                Account
              </ThemedText>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.categoryButton,
                supportCategory === 'learning' && { backgroundColor: colors.tint }
              ]}
              onPress={() => setSupportCategory('learning')}
            >
              <ThemedText 
                style={[
                  styles.categoryText,
                  supportCategory === 'learning' && { color: '#FFFFFF' }
                ]}
              >
                Learning
              </ThemedText>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.categoryButton,
                supportCategory === 'strategies' && { backgroundColor: colors.tint }
              ]}
              onPress={() => setSupportCategory('strategies')}
            >
              <ThemedText 
                style={[
                  styles.categoryText,
                  supportCategory === 'strategies' && { color: '#FFFFFF' }
                ]}
              >
                Strategies
              </ThemedText>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.categoryButton,
                supportCategory === 'challenges' && { backgroundColor: colors.tint }
              ]}
              onPress={() => setSupportCategory('challenges')}
            >
              <ThemedText 
                style={[
                  styles.categoryText,
                  supportCategory === 'challenges' && { color: '#FFFFFF' }
                ]}
              >
                Challenges
              </ThemedText>
            </TouchableOpacity>
          </ScrollView>
          
          {/* FAQ List */}
          {filteredFAQs.length > 0 ? (
            filteredFAQs.map(faq => (
              <TouchableOpacity 
                key={faq.id} 
                style={styles.faqItem}
                onPress={() => toggleFAQ(faq.id)}
              >
                <ThemedView style={styles.faqHeader}>
                  <ThemedText style={styles.faqQuestion}>{faq.question}</ThemedText>
                  <IconSymbol 
                    name={expandedFAQ === faq.id ? "chevron.up" : "chevron.down"} 
                    size={16} 
                    color={colors.text} 
                  />
                </ThemedView>
                
                {expandedFAQ === faq.id && (
                  <ThemedView style={styles.faqAnswer}>
                    <ThemedText style={styles.faqAnswerText}>{faq.answer}</ThemedText>
                  </ThemedView>
                )}
              </TouchableOpacity>
            ))
          ) : (
            <ThemedText style={styles.noResultsText}>
              No results found. Try a different search term or category.
            </ThemedText>
          )}
        </ThemedView>
        
        {/* Feedback Form */}
        <ThemedView style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Send Feedback</ThemedText>
          <ThemedText style={styles.sectionDescription}>
            Report an issue or suggest an improvement
          </ThemedText>
          
          <ThemedView style={styles.formField}>
            <ThemedText style={styles.formLabel}>Topic<ThemedText style={styles.requiredStar}>*</ThemedText></ThemedText>
            <TextInput
              style={[styles.formInput, { color: colors.text, borderColor: colors.border }]}
              value={feedbackForm.topic}
              onChangeText={(text) => handleFormChange('topic', text)}
              placeholder="What's this about?"
              placeholderTextColor={colors.text + '50'}
            />
          </ThemedView>
          
          <ThemedView style={styles.formField}>
            <ThemedText style={styles.formLabel}>Description<ThemedText style={styles.requiredStar}>*</ThemedText></ThemedText>
            <TextInput
              style={[
                styles.formInput, 
                styles.multilineInput, 
                { color: colors.text, borderColor: colors.border }
              ]}
              value={feedbackForm.description}
              onChangeText={(text) => handleFormChange('description', text)}
              placeholder="Provide details about your issue or suggestion"
              placeholderTextColor={colors.text + '50'}
              multiline
              numberOfLines={5}
              textAlignVertical="top"
            />
          </ThemedView>
          
          <ThemedView style={styles.formField}>
            <ThemedText style={styles.formLabel}>Email (Optional)</ThemedText>
            <TextInput
              style={[styles.formInput, { color: colors.text, borderColor: colors.border }]}
              value={feedbackForm.email}
              onChangeText={(text) => handleFormChange('email', text)}
              placeholder="For us to follow up with you"
              placeholderTextColor={colors.text + '50'}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </ThemedView>
          
          <TouchableOpacity 
            style={[styles.submitButton, { backgroundColor: colors.tint }]}
            onPress={handleSubmitFeedback}
          >
            <ThemedText style={styles.submitButtonText}>Submit Feedback</ThemedText>
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginBottom: 16,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 36,
    fontSize: 14,
  },
  contactOptionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  contactOption: {
    width: '31%',
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  contactOptionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 8,
    marginBottom: 4,
    textAlign: 'center',
  },
  contactOptionDescription: {
    fontSize: 12,
    opacity: 0.7,
    textAlign: 'center',
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
  statusItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(150, 150, 150, 0.2)',
  },
  statusHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  statusTitle: {
    fontSize: 16,
    fontWeight: 'bold',
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
  statusMessage: {
    fontSize: 14,
    opacity: 0.7,
  },
  categoriesScroll: {
    marginBottom: 16,
  },
  categoriesContainer: {
    paddingBottom: 8,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    marginRight: 8,
    backgroundColor: 'rgba(150, 150, 150, 0.2)',
  },
  categoryText: {
    fontSize: 14,
  },
  faqItem: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(150, 150, 150, 0.2)',
    paddingVertical: 12,
  },
  faqHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  faqQuestion: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
    paddingRight: 16,
  },
  faqAnswer: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(150, 150, 150, 0.2)',
  },
  faqAnswerText: {
    fontSize: 14,
    lineHeight: 20,
  },
  noResultsText: {
    fontSize: 14,
    opacity: 0.7,
    textAlign: 'center',
    paddingVertical: 16,
  },
  formField: {
    marginBottom: 16,
  },
  formLabel: {
    fontSize: 14,
    marginBottom: 8,
  },
  requiredStar: {
    color: '#FF3B30',
    fontWeight: 'bold',
  },
  formInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
  },
  multilineInput: {
    height: 120,
  },
  submitButton: {
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 