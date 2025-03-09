import React, { useState, useRef, useCallback } from 'react';
import { 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  FlatList, 
  TextInput, 
  RefreshControl, 
  Animated, 
  View,
  Pressable,
  Dimensions
} from 'react-native';
import { Stack, router } from 'expo-router';
import { BlurView } from 'expo-blur';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import Layout from '@/constants/Layout';
import { useColorScheme } from '@/hooks/useColorScheme';
import { IconSymbol } from '@/components/ui/IconSymbol';

// Interface for leaderboard user
interface LeaderboardUser {
  id: string;
  rank: number;
  name: string;
  points: number;
  avatar: string;
  isCurrentUser?: boolean;
  change?: number; // Weekly change in rank
  badges?: string[]; // Achievement badges
  level: number;
  friends?: boolean; // If the user is in friends list
  totalStrategies?: number;
  winRate?: number;
  activity?: {
    lessons: number;
    strategies: number;
    challenges: number;
  };
}

// Filter types
type TimeFilter = 'weekly' | 'monthly' | 'allTime';
type CategoryFilter = 'all' | 'learning' | 'strategies' | 'challenges' | 'friends';

export default function LeaderboardScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('weekly');
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [showUserDetail, setShowUserDetail] = useState<string | null>(null);
  
  // Animation values
  const scrollY = useRef(new Animated.Value(0)).current;
  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 50, 100],
    outputRange: [0, 0.5, 1],
    extrapolate: 'clamp',
  });
  
  // Mock data for the leaderboard - expanded from home screen
  const weeklyLeaderboard: LeaderboardUser[] = [
    { 
      id: 'user-1', 
      rank: 1, 
      name: 'Sarah K.', 
      points: 4850, 
      avatar: 'S', 
      change: 0, 
      badges: ['top_performer', 'challenge_master', 'streak_30'],
      level: 42,
      friends: true,
      totalStrategies: 8,
      winRate: 68,
      activity: {
        lessons: 12,
        strategies: 5,
        challenges: 3
      }
    },
    { 
      id: 'user-2', 
      rank: 2, 
      name: 'Michael T.', 
      points: 4720, 
      avatar: 'M', 
      change: 1,
      badges: ['strategy_expert', 'streak_20'],
      level: 39,
      totalStrategies: 12,
      winRate: 62,
      activity: {
        lessons: 8,
        strategies: 9,
        challenges: 1
      } 
    },
    { 
      id: 'user-3', 
      rank: 3, 
      name: 'Jessica L.', 
      points: 4580, 
      avatar: 'J', 
      change: -1,
      badges: ['quant_scholar'],
      level: 37,
      friends: true,
      totalStrategies: 5,
      winRate: 71,
      activity: {
        lessons: 15,
        strategies: 3,
        challenges: 2
      } 
    },
    { 
      id: 'user-4', 
      rank: 4, 
      name: 'You', 
      points: 4450, 
      avatar: 'A', 
      isCurrentUser: true, 
      change: 2,
      badges: ['streak_10', 'quick_learner'],
      level: 35,
      totalStrategies: 6,
      winRate: 58,
      activity: {
        lessons: 10,
        strategies: 6,
        challenges: 2
      } 
    },
    // ... rest of the weekly leaderboard users with additional fields
  ];
  
  const monthlyLeaderboard: LeaderboardUser[] = [
    // ... similar to weekly but with different rankings
    { 
      id: 'user-2', 
      rank: 1, 
      name: 'Michael T.', 
      points: 18560, 
      avatar: 'M',
      badges: ['strategy_expert', 'streak_20'],
      level: 39,
      totalStrategies: 12,
      winRate: 62,
      activity: {
        lessons: 32,
        strategies: 28,
        challenges: 6
      } 
    },
    { 
      id: 'user-1', 
      rank: 2, 
      name: 'Sarah K.', 
      points: 17980, 
      avatar: 'S',
      badges: ['top_performer', 'challenge_master', 'streak_30'],
      level: 42,
      friends: true,
      totalStrategies: 8,
      winRate: 68,
      activity: {
        lessons: 36,
        strategies: 15,
        challenges: 10
      } 
    },
    { 
      id: 'user-4', 
      rank: 3, 
      name: 'You', 
      points: 15640, 
      avatar: 'A', 
      isCurrentUser: true,
      badges: ['streak_10', 'quick_learner'],
      level: 35,
      totalStrategies: 6,
      winRate: 58,
      activity: {
        lessons: 35,
        strategies: 15,
        challenges: 8
      } 
    },
    // ... more users
  ];
  
  const allTimeLeaderboard: LeaderboardUser[] = [
    // ... all-time leaderboard with different rankings
    { 
      id: 'user-1', 
      rank: 1, 
      name: 'Michael T.', 
      points: 125720, 
      avatar: 'M',
      badges: ['strategy_expert', 'streak_20', 'veteran'],
      level: 39,
      totalStrategies: 12,
      winRate: 62,
      activity: {
        lessons: 154,
        strategies: 87,
        challenges: 32
      } 
    },
    // ... more users
  ];
  
  // Get the active leaderboard based on time filter
  const getActiveLeaderboard = () => {
    switch (timeFilter) {
      case 'weekly': return weeklyLeaderboard;
      case 'monthly': return monthlyLeaderboard;
      case 'allTime': return allTimeLeaderboard;
      default: return weeklyLeaderboard;
    }
  };
  
  // Apply category filter
  const applyCategoryFilter = (users: LeaderboardUser[]) => {
    switch (categoryFilter) {
      case 'learning':
        return users.slice().sort((a, b) => 
          (b.activity?.lessons || 0) - (a.activity?.lessons || 0)
        );
      case 'strategies':
        return users.slice().sort((a, b) => 
          (b.activity?.strategies || 0) - (a.activity?.strategies || 0)
        );
      case 'challenges':
        return users.slice().sort((a, b) => 
          (b.activity?.challenges || 0) - (a.activity?.challenges || 0)
        );
      case 'friends':
        return users.filter(user => user.friends || user.isCurrentUser);
      default:
        return users;
    }
  };
  
  // Filter leaderboard based on all active filters
  const getFilteredLeaderboard = () => {
    const baseLeaderboard = getActiveLeaderboard();
    const categoryFiltered = applyCategoryFilter(baseLeaderboard);
    
    if (searchQuery.trim() === '') {
      return categoryFiltered;
    }
    
    return categoryFiltered.filter(user => 
      user.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };
  
  const filteredLeaderboard = getFilteredLeaderboard();
  
  // Find the current user to highlight
  const currentUserIndex = filteredLeaderboard.findIndex(user => user.isCurrentUser);
  
  // Pull-to-refresh implementation
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    
    // Simulate a refresh
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);
  
  // Get badge icon and color
  const getBadgeInfo = (badgeId: string): { icon: any; color: string } => {
    switch (badgeId) {
      case 'top_performer':
        return { icon: 'crown.fill' as any, color: '#FFD700' };
      case 'challenge_master':
        return { icon: 'trophy.fill' as any, color: '#FF9800' };
      case 'streak_30':
        return { icon: 'flame.fill' as any, color: '#FF5722' };
      case 'streak_20':
        return { icon: 'flame.fill' as any, color: '#FF7043' };
      case 'streak_10':
        return { icon: 'flame.fill' as any, color: '#FF8A65' };
      case 'strategy_expert':
        return { icon: 'chart.line.uptrend.xyaxis' as any, color: '#4CAF50' };
      case 'quant_scholar':
        return { icon: 'book.fill' as any, color: '#2196F3' };
      case 'quick_learner':
        return { icon: 'bolt.fill' as any, color: '#FFC107' };
      case 'veteran':
        return { icon: 'star.fill' as any, color: '#9C27B0' };
      default:
        return { icon: 'rosette' as any, color: '#757575' };
    }
  };
  
  // Render a leaderboard item
  const renderLeaderboardItem = ({ item }: { item: LeaderboardUser }) => {
    return (
      <TouchableOpacity 
        style={[
          styles.leaderboardItem, 
          item.isCurrentUser && { backgroundColor: colors.tint + '15' }
        ]}
        onPress={() => setShowUserDetail(showUserDetail === item.id ? null : item.id)}
      >
        <ThemedView style={styles.rankContainer}>
          <ThemedText style={styles.rank}>#{item.rank}</ThemedText>
          {timeFilter === 'weekly' && item.change !== undefined && (
            <ThemedText style={[
              styles.rankChange,
              item.change > 0 ? { color: colors.profit } : 
              item.change < 0 ? { color: colors.loss } : { opacity: 0.5 }
            ]}>
              {item.change > 0 ? `+${item.change}` : item.change < 0 ? `${item.change}` : '--'}
            </ThemedText>
          )}
        </ThemedView>
        
        <ThemedView style={styles.userInfo}>
          <ThemedView 
            style={[
              styles.avatar, 
              { 
                backgroundColor: item.isCurrentUser ? colors.tint : colors.neutral 
              }
            ]}
          >
            <ThemedText style={styles.avatarText}>{item.avatar}</ThemedText>
          </ThemedView>
          <ThemedView style={styles.userDetails}>
            <ThemedText 
              style={[
                styles.userName,
                item.isCurrentUser && { fontWeight: 'bold' }
              ]}
            >
              {item.name}
            </ThemedText>
            <ThemedView style={styles.levelContainer}>
              <ThemedText style={styles.levelText}>Lvl {item.level}</ThemedText>
              {item.badges && item.badges.length > 0 && (
                <ThemedView style={styles.badgesContainer}>
                  {item.badges.slice(0, 2).map(badge => {
                    const { icon, color } = getBadgeInfo(badge);
                    return (
                      <ThemedView key={badge} style={[styles.badgeIcon, { backgroundColor: color + '20' }]}>
                        <IconSymbol name={icon} size={12} color={color} />
                      </ThemedView>
                    );
                  })}
                  {item.badges.length > 2 && (
                    <ThemedText style={styles.moreBadges}>+{item.badges.length - 2}</ThemedText>
                  )}
                </ThemedView>
              )}
              {item.friends && (
                <ThemedView style={styles.friendBadge}>
                  <IconSymbol name="person.2.fill" size={10} color={colors.tint} />
                </ThemedView>
              )}
            </ThemedView>
          </ThemedView>
        </ThemedView>
        
        <ThemedView style={styles.pointsContainer}>
          <ThemedText style={styles.points}>{item.points.toLocaleString()}</ThemedText>
          <ThemedText style={styles.pointsLabel}>
            {categoryFilter === 'learning' ? 'Lessons' : 
             categoryFilter === 'strategies' ? 'Strategies' :
             categoryFilter === 'challenges' ? 'Challenges' : 'Points'}
          </ThemedText>
        </ThemedView>
        
        <IconSymbol 
          name={showUserDetail === item.id ? "chevron.up" : "chevron.down"} 
          size={16} 
          color={colors.text} 
          style={styles.expandIcon}
        />
        
        {/* Expanded user details */}
        {showUserDetail === item.id && (
          <ThemedView style={styles.expandedDetails}>
            <ThemedView style={styles.activityContainer}>
              <ThemedView style={styles.activityItem}>
                <IconSymbol name="book.fill" size={16} color={colors.tint} />
                <ThemedText style={styles.activityValue}>{item.activity?.lessons || 0}</ThemedText>
                <ThemedText style={styles.activityLabel}>Lessons</ThemedText>
              </ThemedView>
              
              <ThemedView style={styles.activityItem}>
                <IconSymbol name="chart.line.uptrend.xyaxis" size={16} color={colors.tint} />
                <ThemedText style={styles.activityValue}>{item.activity?.strategies || 0}</ThemedText>
                <ThemedText style={styles.activityLabel}>Strategies</ThemedText>
              </ThemedView>
              
              <ThemedView style={styles.activityItem}>
                <IconSymbol name="trophy.fill" size={16} color={colors.tint} />
                <ThemedText style={styles.activityValue}>{item.activity?.challenges || 0}</ThemedText>
                <ThemedText style={styles.activityLabel}>Challenges</ThemedText>
              </ThemedView>
            </ThemedView>
            
            <ThemedView style={styles.statsContainer}>
              <ThemedView style={styles.statItem}>
                <ThemedText style={styles.statLabel}>Total Strategies</ThemedText>
                <ThemedText style={styles.statValue}>{item.totalStrategies}</ThemedText>
              </ThemedView>
              
              <ThemedView style={styles.statItem}>
                <ThemedText style={styles.statLabel}>Win Rate</ThemedText>
                <ThemedText style={styles.statValue}>{item.winRate}%</ThemedText>
              </ThemedView>
            </ThemedView>
            
            {item.badges && item.badges.length > 0 && (
              <ThemedView style={styles.badgesList}>
                <ThemedText style={styles.badgesTitle}>Badges</ThemedText>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.badgesScroll}>
                  {item.badges.map(badge => {
                    const { icon, color } = getBadgeInfo(badge);
                    const badgeName = badge
                      .split('_')
                      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                      .join(' ');
                    
                    return (
                      <ThemedView key={badge} style={styles.badgeItem}>
                        <ThemedView style={[styles.badgeIconLarge, { backgroundColor: color + '20' }]}>
                          <IconSymbol name={icon} size={24} color={color} />
                        </ThemedView>
                        <ThemedText style={styles.badgeName}>{badgeName}</ThemedText>
                      </ThemedView>
                    );
                  })}
                </ScrollView>
              </ThemedView>
            )}
            
            {!item.isCurrentUser && (
              <TouchableOpacity 
                style={[styles.actionButton, { backgroundColor: item.friends ? colors.loss : colors.tint }]}
                onPress={() => {
                  // In a real app, add/remove friend logic would go here
                }}
              >
                <IconSymbol 
                  name={item.friends ? "person.badge.minus" : "person.badge.plus"} 
                  size={16} 
                  color="#FFFFFF" 
                />
                <ThemedText style={styles.actionButtonText}>
                  {item.friends ? "Remove Friend" : "Add Friend"}
                </ThemedText>
              </TouchableOpacity>
            )}
          </ThemedView>
        )}
      </TouchableOpacity>
    );
  };
  
  return (
    <ThemedView style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Leaderboard',
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
      
      <ThemedView style={styles.content}>
        {/* Animated header background */}
        <Animated.View 
          style={[
            styles.headerBackground, 
            { 
              opacity: headerOpacity,
              backgroundColor: colors.background 
            }
          ]} 
        />
        
        {/* Time Filter Tabs */}
        <ThemedView style={[styles.timeFilterTabs, { backgroundColor: colors.card }]}>
          <TouchableOpacity 
            style={[
              styles.filterTab, 
              timeFilter === 'weekly' && { borderBottomColor: colors.tint, borderBottomWidth: 2 }
            ]}
            onPress={() => setTimeFilter('weekly')}
          >
            <ThemedText 
              style={[
                styles.filterTabText,
                timeFilter === 'weekly' && { color: colors.tint, fontWeight: 'bold' }
              ]}
            >
              Weekly
            </ThemedText>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.filterTab, 
              timeFilter === 'monthly' && { borderBottomColor: colors.tint, borderBottomWidth: 2 }
            ]}
            onPress={() => setTimeFilter('monthly')}
          >
            <ThemedText 
              style={[
                styles.filterTabText,
                timeFilter === 'monthly' && { color: colors.tint, fontWeight: 'bold' }
              ]}
            >
              Monthly
            </ThemedText>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.filterTab, 
              timeFilter === 'allTime' && { borderBottomColor: colors.tint, borderBottomWidth: 2 }
            ]}
            onPress={() => setTimeFilter('allTime')}
          >
            <ThemedText 
              style={[
                styles.filterTabText,
                timeFilter === 'allTime' && { color: colors.tint, fontWeight: 'bold' }
              ]}
            >
              All Time
            </ThemedText>
          </TouchableOpacity>
        </ThemedView>
        
        {/* Category Filter */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          style={styles.categoryFilterScroll}
          contentContainerStyle={styles.categoryFilterContainer}
        >
          <TouchableOpacity 
            style={[
              styles.categoryFilterButton,
              categoryFilter === 'all' && { backgroundColor: colors.tint }
            ]}
            onPress={() => setCategoryFilter('all')}
          >
            <ThemedText 
              style={[
                styles.categoryFilterText,
                categoryFilter === 'all' && { color: '#FFFFFF' }
              ]}
            >
              Overall
            </ThemedText>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.categoryFilterButton,
              categoryFilter === 'learning' && { backgroundColor: colors.tint }
            ]}
            onPress={() => setCategoryFilter('learning')}
          >
            <IconSymbol 
              name="book.fill" 
              size={14} 
              color={categoryFilter === 'learning' ? '#FFFFFF' : colors.text} 
            />
            <ThemedText 
              style={[
                styles.categoryFilterText,
                categoryFilter === 'learning' && { color: '#FFFFFF' }
              ]}
            >
              Learning
            </ThemedText>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.categoryFilterButton,
              categoryFilter === 'strategies' && { backgroundColor: colors.tint }
            ]}
            onPress={() => setCategoryFilter('strategies')}
          >
            <IconSymbol 
              name="chart.line.uptrend.xyaxis" 
              size={14} 
              color={categoryFilter === 'strategies' ? '#FFFFFF' : colors.text} 
            />
            <ThemedText 
              style={[
                styles.categoryFilterText,
                categoryFilter === 'strategies' && { color: '#FFFFFF' }
              ]}
            >
              Strategies
            </ThemedText>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.categoryFilterButton,
              categoryFilter === 'challenges' && { backgroundColor: colors.tint }
            ]}
            onPress={() => setCategoryFilter('challenges')}
          >
            <IconSymbol 
              name="trophy.fill" 
              size={14} 
              color={categoryFilter === 'challenges' ? '#FFFFFF' : colors.text} 
            />
            <ThemedText 
              style={[
                styles.categoryFilterText,
                categoryFilter === 'challenges' && { color: '#FFFFFF' }
              ]}
            >
              Challenges
            </ThemedText>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.categoryFilterButton,
              categoryFilter === 'friends' && { backgroundColor: colors.tint }
            ]}
            onPress={() => setCategoryFilter('friends')}
          >
            <IconSymbol 
              name="person.2.fill" 
              size={14} 
              color={categoryFilter === 'friends' ? '#FFFFFF' : colors.text} 
            />
            <ThemedText 
              style={[
                styles.categoryFilterText,
                categoryFilter === 'friends' && { color: '#FFFFFF' }
              ]}
            >
              Friends
            </ThemedText>
          </TouchableOpacity>
        </ScrollView>
        
        {/* Search Bar */}
        <ThemedView style={[styles.searchContainer, { backgroundColor: colors.card }]}>
          <IconSymbol name="magnifyingglass" size={16} color={colors.text} style={styles.searchIcon} />
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            placeholder="Search users..."
            placeholderTextColor={colors.text + '80'}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <IconSymbol name="xmark.circle.fill" size={16} color={colors.text} />
            </TouchableOpacity>
          )}
        </ThemedView>
        
        {/* Current Ranking Summary */}
        {currentUserIndex !== -1 && (
          <ThemedView style={[styles.currentRankContainer, { backgroundColor: colors.tint + '15' }]}>
            <ThemedText style={styles.currentRankText}>
              Your current ranking: <ThemedText style={styles.currentRankHighlight}>#{filteredLeaderboard[currentUserIndex].rank}</ThemedText>
            </ThemedText>
          </ThemedView>
        )}
        
        {/* Leaderboard List */}
        <Animated.FlatList
          data={filteredLeaderboard}
          renderItem={renderLeaderboardItem}
          keyExtractor={item => item.id}
          style={styles.leaderboardList}
          contentContainerStyle={styles.leaderboardContent}
          showsVerticalScrollIndicator={false}
          initialScrollIndex={currentUserIndex > 3 ? currentUserIndex - 2 : 0}
          getItemLayout={(data, index) => ({
            length: 80, // height of each item without expansion
            offset: 80 * index,
            index,
          })}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[colors.tint]}
              tintColor={colors.tint}
            />
          }
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: true }
          )}
          ListEmptyComponent={
            <ThemedView style={styles.emptyContainer}>
              <ThemedText style={styles.emptyText}>No users found</ThemedText>
            </ThemedView>
          }
        />
      </ThemedView>
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
  content: {
    flex: 1,
    paddingTop: 100, // Space for the header
  },
  headerBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 160,
  },
  timeFilterTabs: {
    flexDirection: 'row',
    marginHorizontal: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  filterTab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  filterTabText: {
    fontSize: 14,
  },
  categoryFilterScroll: {
    marginBottom: 16,
  },
  categoryFilterContainer: {
    paddingHorizontal: 16,
  },
  categoryFilterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 16,
    marginRight: 8,
    backgroundColor: 'rgba(150, 150, 150, 0.1)',
  },
  categoryFilterText: {
    fontSize: 14,
    marginLeft: 4,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginHorizontal: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 36,
    fontSize: 14,
  },
  currentRankContainer: {
    marginHorizontal: 16,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 16,
    alignItems: 'center',
  },
  currentRankText: {
    fontSize: 14,
  },
  currentRankHighlight: {
    fontWeight: 'bold',
  },
  leaderboardList: {
    flex: 1,
  },
  leaderboardContent: {
    paddingHorizontal: 16,
    paddingBottom: Layout.SAFE_BOTTOM_PADDING,
  },
  leaderboardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 8,
    borderRadius: 12,
    flexWrap: 'wrap',
  },
  rankContainer: {
    width: 40,
  },
  rank: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  rankChange: {
    fontSize: 12,
  },
  userInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    marginBottom: 2,
  },
  levelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  levelText: {
    fontSize: 12,
    opacity: 0.7,
    marginRight: 8,
  },
  badgesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badgeIcon: {
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 4,
  },
  moreBadges: {
    fontSize: 10,
    opacity: 0.7,
  },
  friendBadge: {
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: 6,
  },
  pointsContainer: {
    alignItems: 'flex-end',
    paddingRight: 16,
  },
  points: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  pointsLabel: {
    fontSize: 10,
    opacity: 0.7,
  },
  expandIcon: {
    position: 'absolute',
    right: 16,
    top: 20,
  },
  expandedDetails: {
    width: '100%',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(150, 150, 150, 0.2)',
  },
  activityContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  activityItem: {
    alignItems: 'center',
  },
  activityValue: {
    fontWeight: 'bold',
    fontSize: 16,
    marginTop: 4,
  },
  activityLabel: {
    fontSize: 12,
    opacity: 0.7,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    opacity: 0.7,
  },
  statValue: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  badgesList: {
    marginBottom: 16,
  },
  badgesTitle: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  badgesScroll: {
    flexDirection: 'row',
  },
  badgeItem: {
    alignItems: 'center',
    marginRight: 16,
    width: 70,
  },
  badgeIconLarge: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  badgeName: {
    fontSize: 12,
    textAlign: 'center',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 8,
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginLeft: 8,
  },
  emptyContainer: {
    padding: 24,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    opacity: 0.7,
  },
}); 