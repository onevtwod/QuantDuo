import React, { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, TouchableOpacity, Dimensions, Image } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { BlurView } from 'expo-blur';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { IconSymbol } from '@/components/ui/IconSymbol';

// Define the lesson content type
interface LessonContent {
  id: string;
  title: string;
  moduleTitle: string;
  duration: string;
  sections: LessonSection[];
  quiz: QuizQuestion[];
}

// Define the lesson section type
interface LessonSection {
  type: 'text' | 'image' | 'code' | 'chart' | 'interactive' | 'video' | 'formula';
  content: string;
  caption?: string;
  codeLanguage?: string; // For code sections
  interactiveType?: 'drag-drop' | 'fill-blank' | 'slider'; // For interactive sections
  formulaLatex?: string; // For mathematical formulas
}

// Define the quiz question type
interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

// Mock lesson data - in a real app, this would come from an API or database
const lessonData: Record<string, LessonContent> = {
  'qb-1': {
    id: 'qb-1',
    title: 'Introduction to Quant Trading',
    moduleTitle: 'Quant Basics',
    duration: '5 min',
    sections: [
      {
        type: 'text',
        content: 'Quantitative trading (quant trading) is a method of executing trades using mathematical and statistical models to identify opportunities. Unlike traditional trading that relies on fundamental analysis or intuition, quant trading uses algorithms to make trading decisions.'
      },
      {
        type: 'image',
        content: 'https://via.placeholder.com/600x300?text=Quant+Trading+Overview',
        caption: 'Quantitative Trading Process Overview'
      },
      {
        type: 'text',
        content: 'Key components of quantitative trading include:\n\n• Data Collection: Gathering historical and real-time market data\n• Alpha Discovery: Finding signals that predict price movements\n• Strategy Development: Creating rules for entering and exiting trades\n• Backtesting: Testing strategies against historical data\n• Risk Management: Controlling exposure and potential losses\n• Execution: Implementing trades efficiently in the market'
      },
      {
        type: 'chart',
        content: 'line-chart',
        caption: 'Example of a simple moving average crossover strategy'
      },
      {
        type: 'text',
        content: 'Advantages of quantitative trading include:\n\n• Emotion-free trading decisions\n• Ability to analyze vast amounts of data\n• Backtesting capabilities to validate strategies\n• Systematic approach to market analysis\n• Scalability across multiple markets and instruments'
      },
      {
        type: 'code',
        content: 'import pandas as pd\nimport numpy as np\n\n# Example of a simple moving average calculation\ndef calculate_sma(prices, window):\n    return prices.rolling(window=window).mean()',
        caption: 'Simple Python code for calculating moving averages',
        codeLanguage: 'python'
      },
      {
        type: 'video',
        content: 'https://example.com/intro-quant-trading.mp4',
        caption: 'Introduction to Quantitative Trading Process'
      }
    ],
    quiz: [
      {
        question: 'What is the primary difference between quantitative trading and traditional trading?',
        options: [
          'Quantitative trading only works in stock markets',
          'Quantitative trading uses mathematical models instead of intuition',
          'Traditional trading is always more profitable',
          'Quantitative trading doesn\'t require any market knowledge'
        ],
        correctAnswer: 1,
        explanation: 'Quantitative trading relies on mathematical and statistical models to make trading decisions, while traditional trading often relies on fundamental analysis or trader intuition.'
      },
      {
        question: 'Which of the following is NOT a key component of quantitative trading?',
        options: [
          'Data Collection',
          'Alpha Discovery',
          'Emotional Analysis',
          'Backtesting'
        ],
        correctAnswer: 2,
        explanation: 'Emotional analysis is not part of quantitative trading. In fact, one of the advantages of quant trading is removing emotions from trading decisions.'
      },
      {
        question: 'What is backtesting in quantitative trading?',
        options: [
          'Running a strategy in reverse',
          'Testing strategies against historical data',
          'Analyzing competitor strategies',
          'Predicting future market movements'
        ],
        correctAnswer: 1,
        explanation: 'Backtesting involves testing a trading strategy against historical data to see how it would have performed in the past.'
      }
    ]
  },
  'qb-2': {
    id: 'qb-2',
    title: 'Statistics for Trading',
    moduleTitle: 'Quant Basics',
    duration: '10 min',
    sections: [
      {
        type: 'text',
        content: 'Statistical concepts form the foundation of quantitative trading. Understanding these concepts is crucial for developing robust trading strategies and properly interpreting market data.'
      },
      {
        type: 'formula',
        content: 'Standard Deviation',
        caption: 'A measure of volatility or risk in financial markets',
        formulaLatex: '\\sigma = \\sqrt{\\frac{1}{N}\\sum_{i=1}^{N}(x_i - \\mu)^2}'
      },
      {
        type: 'text',
        content: 'Key statistical concepts in trading include:\n\n• Mean and Variance: Measuring central tendency and dispersion\n• Standard Deviation: Quantifying market volatility\n• Correlation: Understanding relationships between assets\n• Skewness and Kurtosis: Analyzing return distributions\n• Statistical Significance: Validating trading hypotheses'
      },
      {
        type: 'image',
        content: 'https://via.placeholder.com/600x300?text=Normal+Distribution',
        caption: 'Normal distribution of returns and confidence intervals'
      },
      {
        type: 'code',
        content: 'import numpy as np\nimport scipy.stats as stats\n\n# Calculate key statistics for a returns series\ndef calculate_statistics(returns):\n    mean = np.mean(returns)\n    std_dev = np.std(returns)\n    skewness = stats.skew(returns)\n    kurtosis = stats.kurtosis(returns)\n    sharpe = mean / std_dev\n    \n    return {\n        "mean": mean,\n        "std_dev": std_dev,\n        "skewness": skewness,\n        "kurtosis": kurtosis,\n        "sharpe": sharpe\n    }',
        caption: 'Python code for calculating key statistics of returns',
        codeLanguage: 'python'
      },
      {
        type: 'chart',
        content: 'histogram',
        caption: 'Distribution of daily returns for S&P 500'
      },
      {
        type: 'interactive',
        content: 'Adjust the confidence interval to see how it affects the range of expected returns',
        interactiveType: 'slider',
        caption: 'Interactive confidence interval demonstration'
      }
    ],
    quiz: [
      {
        question: 'What does a high standard deviation in returns indicate?',
        options: [
          'Low volatility',
          'High volatility',
          'High returns',
          'Low returns'
        ],
        correctAnswer: 1,
        explanation: 'A high standard deviation indicates high volatility or dispersion in returns, meaning the investment is more risky.'
      },
      {
        question: 'What is the Sharpe ratio?',
        options: [
          'The ratio of winning trades to losing trades',
          'The ratio of return to risk (standard deviation)',
          'The ratio of long positions to short positions',
          'The ratio of portfolio beta to market beta'
        ],
        correctAnswer: 1,
        explanation: 'The Sharpe ratio measures risk-adjusted return by dividing excess return by the standard deviation of returns.'
      },
      {
        question: 'What does a positive skewness in returns distribution indicate?',
        options: [
          'The distribution has a longer left tail',
          'The distribution has a longer right tail',
          'The distribution is perfectly symmetrical',
          'The distribution has no outliers'
        ],
        correctAnswer: 1,
        explanation: 'Positive skewness indicates the distribution has a longer right tail, meaning there are more extreme positive returns than extreme negative returns.'
      }
    ]
  },
  'qb-3': {
    id: 'qb-3',
    title: 'Time Series Analysis',
    moduleTitle: 'Quant Basics',
    duration: '15 min',
    sections: [
      {
        type: 'text',
        content: 'Time series analysis is essential for quantitative trading as financial markets generate sequential data points ordered by time. Understanding how to analyze this data helps traders identify patterns and make predictions.'
      },
      {
        type: 'text',
        content: 'Key components of time series analysis include:\n\n• Trend: The long-term direction of the data\n• Seasonality: Regular patterns that repeat at predictable intervals\n• Cyclicality: Irregular patterns that don\'t have a fixed frequency\n• Noise: Random variations in the data'
      },
      {
        type: 'chart',
        content: 'time-series-decomposition',
        caption: 'Decomposition of a time series into trend, seasonality, and residual components'
      },
      {
        type: 'text',
        content: 'Common time series models used in quantitative trading include:\n\n• Moving Averages: Simple, weighted, or exponential\n• ARIMA (AutoRegressive Integrated Moving Average): For forecasting time series data\n• GARCH (Generalized AutoRegressive Conditional Heteroskedasticity): For modeling volatility\n• Kalman Filters: For state estimation in noisy environments'
      },
      {
        type: 'code',
        content: '# Example of calculating Exponential Moving Average (EMA) in Python\nimport pandas as pd\n\ndef calculate_ema(prices, span=20):\n    """Calculate Exponential Moving Average\n    \n    Args:\n        prices: List or array of price data\n        span: EMA period (default: 20)\n        \n    Returns:\n        Pandas Series containing EMA values\n    """\n    return pd.Series(prices).ewm(span=span, adjust=False).mean()',
        caption: 'Calculating Exponential Moving Average in Python'
      },
      {
        type: 'text',
        content: 'Stationarity is an important concept in time series analysis. A stationary time series has constant statistical properties over time, making it easier to model. Many financial time series are non-stationary and require transformation (like differencing) before analysis.'
      }
    ],
    quiz: [
      {
        question: 'What is the main difference between seasonality and cyclicality in time series?',
        options: [
          'Seasonality is only found in stock markets',
          'Cyclicality affects longer time periods',
          'Seasonality has regular, predictable intervals while cyclicality is irregular',
          'They are different terms for the same concept'
        ],
        correctAnswer: 2,
        explanation: 'Seasonality refers to patterns that repeat at regular, predictable intervals (like yearly or quarterly), while cyclicality refers to fluctuations that don\'t have a fixed frequency.'
      },
      {
        question: 'Why is stationarity important in time series analysis?',
        options: [
          'It makes the data more volatile',
          'It ensures constant statistical properties over time',
          'It guarantees profitable trading',
          'It eliminates the need for backtesting'
        ],
        correctAnswer: 1,
        explanation: 'A stationary time series has constant statistical properties over time (mean, variance, autocorrelation), making it easier to model and forecast.'
      },
      {
        question: 'Which of the following is NOT a common time series model used in quantitative trading?',
        options: [
          'Moving Averages',
          'ARIMA',
          'GARCH',
          'ANOVA'
        ],
        correctAnswer: 3,
        explanation: 'ANOVA (Analysis of Variance) is a statistical method for comparing means between groups, not a time series model. Moving Averages, ARIMA, and GARCH are all commonly used for time series analysis in trading.'
      }
    ]
  }
};

export default function LessonScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [lesson, setLesson] = useState<LessonContent | null>(null);
  const [quizMode, setQuizMode] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);

  useEffect(() => {
    // In a real app, this would fetch data from an API
    if (id && typeof id === 'string' && lessonData[id]) {
      setLesson(lessonData[id]);
    }
  }, [id]);

  const handleStartQuiz = () => {
    setQuizMode(true);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setQuizCompleted(false);
    setCorrectAnswers(0);
  };

  const handleSelectAnswer = (index: number) => {
    setSelectedAnswer(index);
    setShowExplanation(true);
    
    if (lesson && index === lesson.quiz[currentQuestionIndex].correctAnswer) {
      setCorrectAnswers(prev => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    if (lesson && currentQuestionIndex < lesson.quiz.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      setQuizCompleted(true);
    }
  };

  const handleFinishLesson = () => {
    // In a real app, this would update the user's progress
    router.back();
  };

  if (!lesson) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText>Loading lesson...</ThemedText>
      </ThemedView>
    );
  }

  const renderLessonContent = () => {
    return (
      <ScrollView style={styles.lessonContentContainer}>
        {lesson.sections.map((section, index) => {
          switch (section.type) {
            case 'text':
              return (
                <ThemedView key={index} style={styles.textSection}>
                  <ThemedText style={styles.lessonText}>{section.content}</ThemedText>
                </ThemedView>
              );
            case 'image':
              return (
                <ThemedView key={index} style={styles.imageSection}>
                  <Image
                    source={{ uri: section.content }}
                    style={styles.lessonImage}
                    resizeMode="contain"
                  />
                  {section.caption && (
                    <ThemedText style={styles.imageCaption}>{section.caption}</ThemedText>
                  )}
                </ThemedView>
              );
            case 'code':
              return (
                <ThemedView key={index} style={[styles.codeSection, { backgroundColor: colors.card }]}>
                  <ThemedText style={styles.codeText}>{section.content}</ThemedText>
                  {section.caption && (
                    <ThemedText style={styles.codeCaption}>{section.caption}</ThemedText>
                  )}
                </ThemedView>
              );
            case 'chart':
              return (
                <ThemedView key={index} style={styles.chartSection}>
                  <ThemedView style={[styles.mockChart, { backgroundColor: colors.tint }]}>
                    <ThemedText style={styles.mockChartText}>{section.content}</ThemedText>
                  </ThemedView>
                  {section.caption && (
                    <ThemedText style={styles.chartCaption}>{section.caption}</ThemedText>
                  )}
                </ThemedView>
              );
            case 'interactive':
              return (
                <ThemedView key={index} style={[styles.interactiveSection, { backgroundColor: colors.card }]}>
                  <ThemedText style={styles.interactiveText}>{section.content}</ThemedText>
                  {section.caption && (
                    <ThemedText style={styles.interactiveCaption}>{section.caption}</ThemedText>
                  )}
                  {section.interactiveType === 'slider' && (
                    <ThemedView style={styles.mockSlider}>
                      <ThemedView style={[styles.mockSliderTrack, { backgroundColor: colors.border }]}>
                        <ThemedView style={[styles.mockSliderThumb, { backgroundColor: colors.tint }]} />
                      </ThemedView>
                    </ThemedView>
                  )}
                </ThemedView>
              );
            case 'video':
              return (
                <ThemedView key={index} style={styles.videoSection}>
                  <ThemedView style={[styles.mockVideo, { backgroundColor: colors.card }]}>
                    <IconSymbol name="play.fill" size={40} color={colors.tint} />
                  </ThemedView>
                  {section.caption && (
                    <ThemedText style={styles.videoCaption}>{section.caption}</ThemedText>
                  )}
                </ThemedView>
              );
            case 'formula':
              return (
                <ThemedView key={index} style={[styles.formulaSection, { backgroundColor: colors.card }]}>
                  <ThemedText style={styles.formulaTitle}>{section.content}</ThemedText>
                  <ThemedText style={styles.formulaText}>{section.formulaLatex}</ThemedText>
                  {section.caption && (
                    <ThemedText style={styles.formulaCaption}>{section.caption}</ThemedText>
                  )}
                </ThemedView>
              );
            default:
              return null;
          }
        })}
      </ScrollView>
    );
  };

  const renderQuiz = () => {
    if (quizCompleted) {
      const passThreshold = lesson.quiz.length * 0.7; // 70% to pass
      const passed = correctAnswers >= passThreshold;
      
      return (
        <ThemedView style={styles.quizCompletedContainer}>
          <IconSymbol 
            name={passed ? "checkmark.circle.fill" : "xmark.circle.fill"} 
            size={80} 
            color={passed ? colors.profit : colors.loss} 
          />
          <ThemedText style={styles.quizResultTitle}>
            {passed ? "Congratulations!" : "Keep Learning!"}
          </ThemedText>
          <ThemedText style={styles.quizResultText}>
            You got {correctAnswers} out of {lesson.quiz.length} questions correct.
          </ThemedText>
          <TouchableOpacity 
            style={[styles.finishButton, { backgroundColor: colors.tint }]}
            onPress={handleFinishLesson}
          >
            <ThemedText style={styles.finishButtonText}>Finish Lesson</ThemedText>
          </TouchableOpacity>
          {!passed && (
            <TouchableOpacity 
              style={[styles.retryButton, { borderColor: colors.tint }]}
              onPress={handleStartQuiz}
            >
              <ThemedText style={[styles.retryButtonText, { color: colors.tint }]}>Retry Quiz</ThemedText>
            </TouchableOpacity>
          )}
        </ThemedView>
      );
    }
    
    const currentQuestion = lesson.quiz[currentQuestionIndex];
    
    return (
      <ThemedView style={styles.quizContainer}>
        <ThemedView style={styles.progressContainer}>
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
                  backgroundColor: colors.tint,
                  width: `${((currentQuestionIndex + 1) / lesson.quiz.length) * 100}%`
                }
              ]} 
            />
          </ThemedView>
          <ThemedText style={styles.progressText}>
            Question {currentQuestionIndex + 1} of {lesson.quiz.length}
          </ThemedText>
        </ThemedView>
        
        <ThemedText style={styles.questionText}>{currentQuestion.question}</ThemedText>
        
        <ThemedView style={styles.optionsContainer}>
          {currentQuestion.options.map((option, index) => (
            <TouchableOpacity 
              key={index}
              style={[
                styles.optionButton,
                selectedAnswer !== null && { 
                  backgroundColor: index === currentQuestion.correctAnswer 
                    ? colors.profit + '20' 
                    : index === selectedAnswer 
                      ? colors.loss + '20' 
                      : 'transparent'
                },
                { borderColor: colors.border }
              ]}
              onPress={() => selectedAnswer === null && handleSelectAnswer(index)}
              disabled={selectedAnswer !== null}
            >
              <ThemedText style={styles.optionText}>{option}</ThemedText>
              {selectedAnswer !== null && index === currentQuestion.correctAnswer && (
                <IconSymbol name="checkmark.circle.fill" size={20} color={colors.profit} />
              )}
              {selectedAnswer !== null && index === selectedAnswer && index !== currentQuestion.correctAnswer && (
                <IconSymbol name="xmark.circle.fill" size={20} color={colors.loss} />
              )}
            </TouchableOpacity>
          ))}
        </ThemedView>
        
        {showExplanation && (
          <ThemedView style={[styles.explanationContainer, { backgroundColor: colors.card }]}>
            <ThemedText style={styles.explanationTitle}>Explanation:</ThemedText>
            <ThemedText style={styles.explanationText}>{currentQuestion.explanation}</ThemedText>
          </ThemedView>
        )}
        
        {selectedAnswer !== null && (
          <TouchableOpacity 
            style={[styles.nextButton, { backgroundColor: colors.tint }]}
            onPress={handleNextQuestion}
          >
            <ThemedText style={styles.nextButtonText}>
              {currentQuestionIndex < lesson.quiz.length - 1 ? 'Next Question' : 'See Results'}
            </ThemedText>
          </TouchableOpacity>
        )}
      </ThemedView>
    );
  };

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
        {!quizMode ? renderLessonContent() : renderQuiz()}
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
  moduleTitle: {
    fontSize: 16,
    opacity: 0.7,
    marginBottom: 8,
  },
  lessonTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  duration: {
    fontSize: 14,
    opacity: 0.7,
    marginBottom: 24,
  },
  textSection: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 24,
  },
  imageContainer: {
    marginBottom: 24,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 8,
  },
  caption: {
    fontSize: 14,
    opacity: 0.7,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  codeContainer: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 24,
  },
  code: {
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    fontSize: 14,
  },
  chartContainer: {
    marginBottom: 24,
  },
  placeholderChart: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  placeholderText: {
    fontSize: 16,
    opacity: 0.7,
  },
  quizButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 32,
  },
  quizButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  quizContainer: {
    paddingBottom: 40,
  },
  progressContainer: {
    marginBottom: 24,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    marginBottom: 8,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    opacity: 0.7,
    textAlign: 'right',
  },
  questionText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  optionsContainer: {
    marginBottom: 24,
  },
  optionButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 12,
  },
  optionText: {
    fontSize: 16,
    flex: 1,
  },
  explanationContainer: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 24,
  },
  explanationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  explanationText: {
    fontSize: 14,
    lineHeight: 20,
  },
  nextButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
  },
  nextButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  quizCompletedContainer: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  quizResultTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  quizResultText: {
    fontSize: 16,
    opacity: 0.7,
    marginBottom: 32,
  },
  finishButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
    width: '100%',
  },
  finishButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  retryButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    width: '100%',
  },
  retryButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  lessonContentContainer: {
    paddingTop: 100,
    paddingBottom: 40,
    paddingHorizontal: 16,
  },
  lessonText: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 24,
  },
  imageSection: {
    marginBottom: 24,
  },
  lessonImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 8,
  },
  imageCaption: {
    fontSize: 14,
    opacity: 0.7,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  codeSection: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 24,
  },
  codeText: {
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    fontSize: 14,
  },
  codeCaption: {
    fontSize: 14,
    opacity: 0.7,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  chartSection: {
    marginBottom: 24,
  },
  mockChart: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  mockChartText: {
    fontSize: 16,
    opacity: 0.7,
  },
  chartCaption: {
    fontSize: 14,
    opacity: 0.7,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  interactiveSection: {
    marginBottom: 24,
  },
  interactiveText: {
    fontSize: 16,
    lineHeight: 24,
  },
  interactiveCaption: {
    fontSize: 14,
    opacity: 0.7,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  mockSlider: {
    height: 20,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    marginTop: 8,
  },
  mockSliderTrack: {
    height: '100%',
    borderRadius: 10,
    backgroundColor: '#E0E0E0',
  },
  mockSliderThumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#000000',
    position: 'absolute',
    top: 0,
    left: 0,
  },
  videoSection: {
    marginBottom: 24,
  },
  mockVideo: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  videoCaption: {
    fontSize: 14,
    opacity: 0.7,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  formulaSection: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 24,
  },
  formulaTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  formulaText: {
    fontSize: 14,
    lineHeight: 20,
  },
  formulaCaption: {
    fontSize: 14,
    opacity: 0.7,
    fontStyle: 'italic',
    textAlign: 'center',
  },
}); 