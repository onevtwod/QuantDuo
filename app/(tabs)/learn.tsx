import React from 'react';
import { StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { BlurView } from 'expo-blur';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import Layout from '@/constants/Layout';
import { useColorScheme } from '@/hooks/useColorScheme';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useModules } from '@/context/ModuleContext';

// Define the module type
interface Module {
  id: string;
  title: string;
  description: string;
  lessons: Lesson[];
  progress: number;
  icon: string;
  color: string;
}

// Define the lesson type
interface Lesson {
  id: string;
  title: string;
  duration: string;
  completed: boolean;
  locked: boolean;
}

export default function LearnScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const router = useRouter();
  
  // Use the modules context instead of local state
  const { modules } = useModules();

  const handleLessonPress = (lessonId: string, locked: boolean) => {
    if (!locked) {
      router.push(`/lesson/${lessonId}`);
    }
  };

  const handleViewAllLessons = (moduleId: string) => {
    // Navigate to module detail screen
    router.push(`/module/${moduleId}`);
  };

  // Render a module card
  const renderModuleCard = (module: Module) => {
    return (
      <TouchableOpacity
        key={module.id}
        style={[styles.moduleCard, { borderColor: colors.border }]}
        onPress={() => handleViewAllLessons(module.id)}
      >
        <ThemedView style={styles.moduleHeader}>
          <ThemedView style={[styles.moduleIconContainer, { backgroundColor: module.color }]}>
            <IconSymbol name={module.icon} size={24} color="#FFFFFF" />
          </ThemedView>
          <ThemedView style={styles.moduleProgress}>
            <ThemedView 
              style={[
                styles.progressBar, 
                { 
                  backgroundColor: colors.border,
                  width: '100%'
                }
              ]}
            >
              <ThemedView 
                style={[
                  styles.progressFill, 
                  { 
                    backgroundColor: module.color,
                    width: `${module.progress * 100}%`
                  }
                ]} 
              />
            </ThemedView>
            <ThemedText style={styles.progressText}>{Math.round(module.progress * 100)}%</ThemedText>
          </ThemedView>
        </ThemedView>
        
        <ThemedText style={styles.moduleTitle}>{module.title}</ThemedText>
        <ThemedText style={styles.moduleDescription}>{module.description}</ThemedText>
        
        <ThemedView style={styles.lessonsList}>
          {module.lessons.slice(0, 3).map((lesson, index) => (
            <TouchableOpacity 
              key={lesson.id}
              style={[
                styles.lessonItem, 
                { 
                  opacity: lesson.locked ? 0.5 : 1,
                  borderBottomWidth: index === 2 ? 0 : 1,
                  borderBottomColor: colors.border
                }
              ]}
              disabled={lesson.locked}
              onPress={() => handleLessonPress(lesson.id, lesson.locked)}
            >
              <ThemedView style={styles.lessonInfo}>
                <ThemedText style={styles.lessonTitle}>{lesson.title}</ThemedText>
                <ThemedText style={styles.lessonDuration}>{lesson.duration}</ThemedText>
              </ThemedView>
              {lesson.completed ? (
                <IconSymbol name="checkmark.circle.fill" size={20} color={module.color} />
              ) : lesson.locked ? (
                <IconSymbol name="lock.fill" size={20} color={colors.icon} />
              ) : (
                <IconSymbol name="play.circle.fill" size={20} color={module.color} />
              )}
            </TouchableOpacity>
          ))}
        </ThemedView>
        
        {module.lessons.length > 3 && (
          <TouchableOpacity 
            style={styles.viewAllButton}
            onPress={() => handleViewAllLessons(module.id)}
          >
            <ThemedText style={styles.viewAllText}>View all {module.lessons.length} lessons</ThemedText>
            <IconSymbol name="chevron.right" size={16} color={colors.tint} />
          </TouchableOpacity>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: 'Learn',
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
        <ThemedView style={styles.streakContainer}>
          <ThemedView style={[styles.streakCard, { backgroundColor: colors.card }]}>
            <ThemedView style={styles.streakInfo}>
              <IconSymbol name="flame.fill" size={32} color="#FF9800" />
              <ThemedView>
                <ThemedText style={styles.streakCount}>7</ThemedText>
                <ThemedText style={styles.streakLabel}>Day Streak</ThemedText>
              </ThemedView>
            </ThemedView>
            <ThemedText style={styles.streakMessage}>Keep learning to maintain your streak!</ThemedText>
          </ThemedView>
        </ThemedView>

        <ThemedText style={styles.sectionTitle}>Continue Learning</ThemedText>
        
        {modules.map(renderModuleCard)}
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
  streakContainer: {
    marginBottom: 24,
  },
  streakCard: {
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  streakInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
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
  streakMessage: {
    fontSize: 14,
    opacity: 0.8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  moduleCard: {
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 24,
    overflow: 'hidden',
  },
  moduleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  moduleIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  moduleProgress: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '70%',
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    flex: 1,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    marginLeft: 8,
    width: 36,
    textAlign: 'right',
  },
  moduleTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    paddingHorizontal: 16,
    marginBottom: 4,
  },
  moduleDescription: {
    fontSize: 14,
    opacity: 0.7,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  lessonsList: {
    borderTopWidth: 1,
    borderTopColor: '#DFE1E6',
  },
  lessonItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  lessonInfo: {
    flex: 1,
  },
  lessonTitle: {
    fontSize: 14,
    marginBottom: 4,
  },
  lessonDuration: {
    fontSize: 12,
    opacity: 0.7,
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: '#DFE1E6',
  },
  viewAllText: {
    fontSize: 14,
    marginRight: 4,
  },
}); 