import React, { createContext, useState, useContext, ReactNode } from 'react';

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

interface ModuleContextType {
  modules: Module[];
  completedLessons: string[];
  markLessonCompleted: (lessonId: string) => void;
  getModuleById: (moduleId: string) => Module | undefined;
}

const ModuleContext = createContext<ModuleContextType | undefined>(undefined);

// Initial modules data
const initialModules: Module[] = [
  {
    id: 'quant-basics',
    title: 'Quant Basics',
    description: 'Learn the fundamental concepts of quantitative trading',
    progress: 0.75,
    icon: 'function',
    color: '#4C9AFF',
    lessons: [
      { id: 'qb-1', title: 'Introduction to Quant Trading', duration: '5 min', completed: true, locked: false },
      { id: 'qb-2', title: 'Statistics for Trading', duration: '10 min', completed: true, locked: false },
      { id: 'qb-3', title: 'Time Series Analysis', duration: '15 min', completed: true, locked: false },
      { id: 'qb-4', title: 'Probability Distributions', duration: '12 min', completed: false, locked: false },
      { id: 'qb-5', title: 'Hypothesis Testing', duration: '10 min', completed: false, locked: true },
    ]
  },
  {
    id: 'financial-instruments',
    title: 'Financial Instruments',
    description: 'Master different financial instruments and markets',
    progress: 0.3,
    icon: 'chart.bar.fill',
    color: '#00C853',
    lessons: [
      { id: 'fi-1', title: 'Stocks and Indices', duration: '8 min', completed: true, locked: false },
      { id: 'fi-2', title: 'Options Basics', duration: '12 min', completed: false, locked: false },
      { id: 'fi-3', title: 'Futures Contracts', duration: '10 min', completed: false, locked: false },
      { id: 'fi-4', title: 'ETFs and Mutual Funds', duration: '8 min', completed: false, locked: true },
      { id: 'fi-5', title: 'Fixed Income Securities', duration: '15 min', completed: false, locked: true },
    ]
  },
  {
    id: 'alpha-signals',
    title: 'Alpha Signals',
    description: 'Discover and validate alpha signals in the market',
    progress: 0.1,
    icon: 'waveform.path.ecg',
    color: '#FF9800',
    lessons: [
      { id: 'as-1', title: 'What is Alpha?', duration: '5 min', completed: true, locked: false },
      { id: 'as-2', title: 'Factor Models', duration: '15 min', completed: false, locked: false },
      { id: 'as-3', title: 'Signal Processing', duration: '12 min', completed: false, locked: true },
      { id: 'as-4', title: 'Machine Learning for Signals', duration: '20 min', completed: false, locked: true },
      { id: 'as-5', title: 'Signal Validation', duration: '10 min', completed: false, locked: true },
    ]
  },
  {
    id: 'risk-management',
    title: 'Risk Management',
    description: 'Learn to manage risk in your trading strategies',
    progress: 0,
    icon: 'shield.fill',
    color: '#FF3D00',
    lessons: [
      { id: 'rm-1', title: 'Risk Metrics', duration: '10 min', completed: false, locked: true },
      { id: 'rm-2', title: 'Position Sizing', duration: '8 min', completed: false, locked: true },
      { id: 'rm-3', title: 'Portfolio Optimization', duration: '15 min', completed: false, locked: true },
      { id: 'rm-4', title: 'Drawdown Management', duration: '12 min', completed: false, locked: true },
      { id: 'rm-5', title: 'Risk-Adjusted Returns', duration: '10 min', completed: false, locked: true },
    ]
  },
];

export function ModuleProvider({ children }: { children: ReactNode }) {
  const [modules, setModules] = useState<Module[]>(initialModules);
  const [completedLessons, setCompletedLessons] = useState<string[]>(
    initialModules.flatMap(m => m.lessons).filter(l => l.completed).map(l => l.id)
  );

  // Mark a lesson as completed and update the module progress
  const markLessonCompleted = (lessonId: string) => {
    setCompletedLessons(prev => {
      if (prev.includes(lessonId)) {
        return prev;
      }
      return [...prev, lessonId];
    });

    setModules(prevModules => {
      return prevModules.map(module => {
        const lessonInModule = module.lessons.find(l => l.id === lessonId);
        
        if (lessonInModule) {
          // Create a new lessons array with the completed lesson updated
          const updatedLessons = module.lessons.map(lesson => {
            if (lesson.id === lessonId) {
              return { ...lesson, completed: true };
            }
            // If the lesson was locked but comes directly after the completed lesson, unlock it
            if (lesson.locked && !lesson.completed) {
              // Find the index of the completed lesson
              const completedIndex = module.lessons.findIndex(l => l.id === lessonId);
              // Find the index of the current lesson
              const currentIndex = module.lessons.findIndex(l => l.id === lesson.id);
              // If this is the next lesson after the completed one, unlock it
              if (currentIndex === completedIndex + 1) {
                return { ...lesson, locked: false };
              }
            }
            return lesson;
          });
          
          // Calculate the new progress value
          const completedCount = updatedLessons.filter(l => l.completed).length;
          const totalCount = updatedLessons.length;
          const newProgress = totalCount > 0 ? completedCount / totalCount : 0;
          
          // Return the updated module
          return {
            ...module,
            lessons: updatedLessons,
            progress: newProgress
          };
        }
        return module;
      });
    });
  };

  // Get a module by ID
  const getModuleById = (moduleId: string) => {
    return modules.find(m => m.id === moduleId);
  };

  const value = {
    modules,
    completedLessons,
    markLessonCompleted,
    getModuleById,
  };

  return <ModuleContext.Provider value={value}>{children}</ModuleContext.Provider>;
}

export function useModules() {
  const context = useContext(ModuleContext);
  if (context === undefined) {
    throw new Error('useModules must be used within a ModuleProvider');
  }
  return context;
}

export type { Module, Lesson }; 