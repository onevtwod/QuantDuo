import React from 'react';
import { StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { BlurView } from 'expo-blur';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
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

export default function ModuleDetailScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  
  // Use the modules context
  const { getModuleById } = useModules();
  const module = getModuleById(id as string);

  const handleLessonPress = (lessonId: string, locked: boolean) => {
    if (!locked) {
      router.push(`/lesson/${lessonId}`);
    }
  };

  if (!module) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText>Module not found</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: '',
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
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <IconSymbol name="chevron.left" size={24} color={colors.tint} />
            </TouchableOpacity>
          ),
        }}
      />
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <ThemedView style={styles.moduleHeaderContainer}>
          <ThemedView style={[styles.moduleIconContainer, { backgroundColor: module.color }]}>
            <IconSymbol name={module.icon} size={32} color="#FFFFFF" />
          </ThemedView>
          <ThemedText style={styles.moduleTitle}>{module.title}</ThemedText>
          <ThemedText style={styles.moduleDescription}>{module.description}</ThemedText>
          
          <ThemedView style={styles.progressContainer}>
            <ThemedView 
              style={[
                styles.progressBar, 
                { 
                  backgroundColor: colors.border,
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
            <ThemedText style={styles.progressText}>{Math.round(module.progress * 100)}% Complete</ThemedText>
          </ThemedView>
        </ThemedView>

        <ThemedText style={styles.sectionTitle}>All Lessons</ThemedText>
        
        <ThemedView style={[styles.lessonsContainer, { borderColor: colors.border }]}>
          {module.lessons.map((lesson, index) => (
            <TouchableOpacity 
              key={lesson.id}
              style={[
                styles.lessonItem, 
                { 
                  opacity: lesson.locked ? 0.5 : 1,
                  borderBottomWidth: index === module.lessons.length - 1 ? 0 : 1,
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
    paddingBottom: 40,
    paddingHorizontal: 16,
  },
  moduleHeaderContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  moduleIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  moduleTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  moduleDescription: {
    fontSize: 16,
    textAlign: 'center',
    opacity: 0.7,
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  progressContainer: {
    width: '100%',
    marginBottom: 16,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    width: '100%',
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    opacity: 0.7,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  lessonsContainer: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
    marginBottom: 24,
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
    fontSize: 16,
    marginBottom: 4,
  },
  lessonDuration: {
    fontSize: 14,
    opacity: 0.7,
  },
}); 