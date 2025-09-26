import { router } from 'expo-router';
import { ArrowLeft, Lightbulb, Quote, Heart, Moon, Brain, Activity, Users, ChevronLeft, ChevronRight, Target } from 'lucide-react-native';
import React, { useState, useMemo } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '../../theme/theme';
import { motivationsData, Motivation } from '../../data/motivations';

export default function MotivationsScreen() {
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filters = [
    { id: 'all', label: 'All', icon: Quote },
    { id: 'mood', label: 'Mood', icon: Heart },
    { id: 'sleep', label: 'Sleep', icon: Moon },
    { id: 'support', label: 'Support', icon: Users },
    { id: 'mindful', label: 'Mindful', icon: Lightbulb },
    { id: 'stress', label: 'Stress', icon: Activity },
    { id: 'anxiety', label: 'Anxiety', icon: Brain },
  ];

  const filteredMotivations = useMemo(() => {
    if (selectedFilter === 'all') {
      return motivationsData;
    }
    return motivationsData.filter(motivation => motivation.category === selectedFilter);
  }, [selectedFilter]);

  const paginatedMotivations = useMemo(() => {
    if (selectedFilter === 'all') {
      const startIndex = (currentPage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      return filteredMotivations.slice(startIndex, endIndex);
    }
    return filteredMotivations.slice(0, itemsPerPage);
  }, [filteredMotivations, currentPage, selectedFilter]);

  const totalPages = Math.ceil(filteredMotivations.length / itemsPerPage);

  const handleFilterChange = (filterId: string) => {
    setSelectedFilter(filterId);
    setCurrentPage(1); // Reset to first page when filter changes
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Lightbulb size={24} color={theme.colors.primary} />
          <Text style={styles.headerTitle}>Motivations</Text>
        </View>
        <View style={styles.headerSpacer} />
      </View>

      {/* Filter Section */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.filterContainer}
        contentContainerStyle={styles.filterContent}
      >
        {filters.map((filter) => {
          const IconComponent = filter.icon;
          const isSelected = selectedFilter === filter.id;
          return (
            <TouchableOpacity
              key={filter.id}
              style={[
                styles.filterButton,
                isSelected && styles.filterButtonSelected
              ]}
              onPress={() => handleFilterChange(filter.id)}
            >
              <IconComponent 
                size={16} 
                color={isSelected ? 'white' : theme.colors.textSecondary} 
              />
              <Text style={[
                styles.filterText,
                isSelected && styles.filterTextSelected
              ]}>
                {filter.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.motivationsList}>
          {paginatedMotivations.map((motivation) => (
            <View key={motivation.id} style={styles.motivationCard}>
              <LinearGradient
                colors={['#FF6B35', '#4ECDC4', '#45B7D1']}
                style={styles.motivationGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <View style={styles.motivationHeader}>
                  <Target size={20} color="white" />
                  <Text style={styles.motivationLabel}>MOTIVATION</Text>
                </View>
                <Text style={styles.motivationText}>"{motivation.text}"</Text>
                {motivation.author && (
                  <Text style={styles.motivationAuthor}>- {motivation.author}</Text>
                )}
                <View style={styles.motivationFooter}>
                  <Text style={styles.keepGoingText}>Keep Going</Text>
              </View>
              </LinearGradient>
            </View>
          ))}
        </View>

        {/* Pagination - Only show for "All" filter */}
        {selectedFilter === 'all' && totalPages > 1 && (
          <View style={styles.pagination}>
            <TouchableOpacity
              style={[
                styles.paginationButton,
                currentPage === 1 && styles.paginationButtonDisabled
              ]}
              onPress={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft size={20} color={currentPage === 1 ? theme.colors.textLight : theme.colors.text} />
            </TouchableOpacity>
            
            <View style={styles.paginationInfo}>
              <Text style={styles.paginationText}>
                Page {currentPage} of {totalPages}
              </Text>
            </View>
            
            <TouchableOpacity
              style={[
                styles.paginationButton,
                currentPage === totalPages && styles.paginationButtonDisabled
              ]}
              onPress={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <ChevronRight size={20} color={currentPage === totalPages ? theme.colors.textLight : theme.colors.text} />
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  backButton: {
    padding: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.backgroundSecondary,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  headerTitle: {
    fontSize: theme.typography.fontSize.h3,
    fontWeight: theme.typography.fontWeight.bold as any,
    color: theme.colors.text,
  },
  headerSpacer: {
    width: 40,
  },
  filterContainer: {
    backgroundColor: theme.colors.backgroundSecondary,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    maxHeight: 50,
  },
  filterContent: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    gap: theme.spacing.xs,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.background,
    borderWidth: 1,
    borderColor: theme.colors.border,
    gap: theme.spacing.xs,
  },
  filterButtonSelected: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  filterText: {
    fontSize: theme.typography.fontSize.caption,
    fontWeight: theme.typography.fontWeight.medium as any,
    color: theme.colors.textSecondary,
  },
  filterTextSelected: {
    color: 'white',
  },
  content: {
    flex: 1,
    paddingHorizontal: theme.spacing.lg,
  },
  motivationsList: {
    paddingVertical: theme.spacing.lg,
    gap: theme.spacing.md,
  },
  motivationCard: {
    marginBottom: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
    ...theme.shadows.lg,
  },
  motivationGradient: {
    padding: theme.spacing.xl,
    borderRadius: theme.borderRadius.lg,
  },
  motivationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.lg,
  },
  motivationLabel: {
    fontSize: theme.typography.fontSize.caption,
    fontWeight: theme.typography.fontWeight.bold as any,
    color: 'white',
    letterSpacing: 1,
  },
  motivationText: {
    fontSize: theme.typography.fontSize.body,
    color: 'white',
    lineHeight: theme.typography.lineHeight.body + 4,
    marginBottom: theme.spacing.lg,
    textAlign: 'left',
  },
  motivationAuthor: {
    fontSize: theme.typography.fontSize.caption,
    color: 'white',
    opacity: 0.9,
    alignSelf: 'flex-end',
    fontWeight: theme.typography.fontWeight.medium as any,
    marginBottom: theme.spacing.md,
  },
  motivationFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  keepGoingText: {
    fontSize: theme.typography.fontSize.body,
    fontWeight: theme.typography.fontWeight.medium as any,
    color: 'white',
  },
  pagination: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.xl,
    gap: theme.spacing.lg,
  },
  paginationButton: {
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.backgroundSecondary,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  paginationButtonDisabled: {
    backgroundColor: theme.colors.backgroundLight,
    borderColor: theme.colors.border,
    opacity: 0.5,
  },
  paginationInfo: {
    paddingHorizontal: theme.spacing.md,
  },
  paginationText: {
    fontSize: theme.typography.fontSize.body,
    color: theme.colors.text,
    fontWeight: theme.typography.fontWeight.medium as any,
  },
});
