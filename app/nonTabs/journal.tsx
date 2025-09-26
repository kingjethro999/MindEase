import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ArrowLeft, Plus, BookOpen, Calendar, Tag, Heart } from 'lucide-react-native';
import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  FlatList, 
  Animated,
  RefreshControl
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../../theme/theme';
import { useAuth } from '../../contexts/AuthContext';
import { getJournalEntries, JournalEntry } from '../../utils/offlineStorage';

export default function JournalScreen() {
  const { user } = useAuth();
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const fabScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    loadJournalEntries();
  }, []);

  const loadJournalEntries = async () => {
    try {
      setLoading(true);
      const entries = await getJournalEntries();
      // Sort by creation date (newest first)
      const sortedEntries = entries.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setJournalEntries(sortedEntries);
    } catch (error) {
      console.error('Error loading journal entries:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadJournalEntries();
    setRefreshing(false);
  };

  const handleNewEntry = () => {
    // Animate FAB press
    Animated.sequence([
      Animated.timing(fabScale, {
        toValue: 0.9,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(fabScale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    // Navigate to new entry
    router.push('/nonTabs/journalEntry');
  };

  const handleEntryPress = (entry: JournalEntry) => {
    router.push({
      pathname: '/nonTabs/journalEntry',
      params: {
        entryId: entry.id,
        title: entry.title,
        content: entry.content,
        mood: entry.mood || '',
        tags: entry.tags?.join(',') || ''
      }
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      return 'Today';
    } else if (diffDays === 2) {
      return 'Yesterday';
    } else if (diffDays <= 7) {
      return `${diffDays - 1} days ago`;
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
      });
    }
  };

  const getMoodColor = (mood?: string) => {
    const moodColors: { [key: string]: string } = {
      'happy': '#FF6B9D',
      'calm': '#4CAF50',
      'bored': '#9E9E9E',
      'tired': '#4ECDC4',
      'irritated': '#FF9800',
      'crying': '#9C27B0',
      'angry': '#F44336'
    };
    return moodColors[mood || ''] || theme.colors.primary;
  };

  const renderJournalEntry = ({ item }: { item: JournalEntry }) => {
    const preview = item.content.length > 100 
      ? item.content.substring(0, 100) + '...' 
      : item.content;

    return (
      <TouchableOpacity
        style={styles.entryCard}
        onPress={() => handleEntryPress(item)}
        activeOpacity={0.7}
      >
        <View style={styles.entryHeader}>
          <View style={styles.entryTitleContainer}>
            <Text style={styles.entryTitle} numberOfLines={1}>
              {item.title || 'Untitled Entry'}
            </Text>
            {item.mood && (
              <View style={[styles.moodIndicator, { backgroundColor: getMoodColor(item.mood) }]}>
                <Heart size={12} color="white" />
              </View>
            )}
          </View>
          <Text style={styles.entryDate}>{formatDate(item.createdAt)}</Text>
        </View>
        
        <Text style={styles.entryPreview} numberOfLines={3}>
          {preview}
        </Text>
        
        {item.tags && item.tags.length > 0 && (
          <View style={styles.tagsContainer}>
            {item.tags.slice(0, 3).map((tag, index) => (
              <View key={index} style={styles.tag}>
                <Tag size={10} color={theme.colors.primary} />
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
            {item.tags.length > 3 && (
              <Text style={styles.moreTagsText}>+{item.tags.length - 3} more</Text>
            )}
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <BookOpen size={80} color={theme.colors.textSecondary} />
      <Text style={styles.emptyTitle}>Your Journal Awaits</Text>
      <Text style={styles.emptyDescription}>
        Start writing your thoughts, feelings, and experiences.{'\n'}
        This is your safe space to express yourself.
      </Text>
      <TouchableOpacity style={styles.emptyButton} onPress={handleNewEntry}>
        <Plus size={20} color="white" />
        <Text style={styles.emptyButtonText}>Write Your First Entry</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.title}>My Journal</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Journal Entries List */}
      <View style={styles.content}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Loading your journal...</Text>
          </View>
        ) : journalEntries.length === 0 ? (
          renderEmptyState()
        ) : (
          <FlatList
            data={journalEntries}
            renderItem={renderJournalEntry}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor={theme.colors.primary}
                colors={[theme.colors.primary]}
              />
            }
          />
        )}
      </View>

      {/* Floating Action Button */}
      <Animated.View style={[styles.fab, { transform: [{ scale: fabScale }] }]}>
        <TouchableOpacity style={styles.fabButton} onPress={handleNewEntry}>
          <Plus size={24} color="white" />
        </TouchableOpacity>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  backButton: {
    padding: theme.spacing.sm,
  },
  title: {
    fontSize: theme.typography.fontSize.h2,
    fontWeight: theme.typography.fontWeight.bold as any,
    color: 'white',
  },
  headerSpacer: {
    width: theme.spacing.xxl,
  },
  content: {
    flex: 1,
    padding: theme.spacing.md,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: theme.typography.fontSize.body,
    color: 'rgba(255,255,255,0.7)',
  },
  listContainer: {
    paddingBottom: theme.spacing.xxl * 2, // Space for FAB
  },
  entryCard: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  entryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.sm,
  },
  entryTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: theme.spacing.sm,
  },
  entryTitle: {
    fontSize: theme.typography.fontSize.h3,
    fontWeight: theme.typography.fontWeight.bold as any,
    color: 'white',
    flex: 1,
  },
  moodIndicator: {
    width: theme.spacing.lg,
    height: theme.spacing.lg,
    borderRadius: theme.spacing.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: theme.spacing.sm,
  },
  entryDate: {
    fontSize: theme.typography.fontSize.caption,
    color: 'rgba(255,255,255,0.6)',
  },
  entryPreview: {
    fontSize: theme.typography.fontSize.body,
    color: 'rgba(255,255,255,0.8)',
    lineHeight: 20,
    marginBottom: theme.spacing.sm,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(78, 205, 196, 0.2)',
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.full,
    marginRight: theme.spacing.sm,
    marginBottom: theme.spacing.xs,
  },
  tagText: {
    fontSize: theme.typography.fontSize.caption,
    color: theme.colors.primary,
    marginLeft: theme.spacing.xs,
  },
  moreTagsText: {
    fontSize: theme.typography.fontSize.caption,
    color: 'rgba(255,255,255,0.6)',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xl,
  },
  emptyTitle: {
    fontSize: theme.typography.fontSize.h2,
    fontWeight: theme.typography.fontWeight.bold as any,
    color: 'white',
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    textAlign: 'center',
  },
  emptyDescription: {
    fontSize: theme.typography.fontSize.body,
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: theme.spacing.xl,
  },
  emptyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    gap: theme.spacing.sm,
  },
  emptyButtonText: {
    fontSize: theme.typography.fontSize.body,
    fontWeight: theme.typography.fontWeight.bold as any,
    color: 'white',
  },
  fab: {
    position: 'absolute',
    bottom: theme.spacing.xl,
    right: theme.spacing.xl,
  },
  fabButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});
