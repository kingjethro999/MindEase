# Database Schema Alignment

## Overview
The exercises and gamification system has been updated to perfectly match the database schema in `constants/db.sql` for seamless sync backup functionality.

## Database Tables Alignment

### 1. `user_progress_backup` Table
**Purpose**: Tracks all user activities and progress
**Local Storage**: `exercise_completions` in AsyncStorage

#### Schema Mapping:
```sql
CREATE TABLE public.user_progress_backup (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    activity_type VARCHAR(50) NOT NULL, -- 'mood_log', 'breathing_exercise', 'meditation', 'journaling', 'game_session'
    activity_details JSONB, -- specific details about the activity
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    streak_count INTEGER DEFAULT 1,
    
    INDEX (user_id, activity_type, completed_at)
);
```

#### Local Interface:
```typescript
export interface ExerciseCompletion {
  id: string;
  userId: string;
  activityType: 'mood_log' | 'breathing_exercise' | 'meditation' | 'journaling' | 'game_session' | 'sleep_tools';
  activityDetails: {
    exerciseId?: string;
    exerciseTitle?: string;
    exerciseType?: string;
    duration?: number;
    intensity?: number;
    notes?: string;
    gameScore?: number;
    gameLevel?: number;
    journalWordCount?: number;
    sleepToolType?: string;
    moodIntensity?: number;
    triggers?: string[];
  };
  completedAt: string;
  streakCount: number;
  synced: boolean;
}
```

### 2. `user_achievements` Table
**Purpose**: Stores user badges and achievements
**Local Storage**: `user_achievements` in AsyncStorage

#### Schema Mapping:
```sql
CREATE TABLE public.user_achievements (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    badge_type VARCHAR(50) NOT NULL, -- 'mood_streak_7', 'calm_master', 'resilience_builder', etc.
    badge_name VARCHAR(100) NOT NULL,
    badge_description TEXT,
    earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(user_id, badge_type)
);
```

#### Local Interface:
```typescript
export interface UserAchievement {
  id: string;
  userId: string;
  badgeType: string; // 'mood_streak_7', 'calm_master', 'resilience_builder', etc.
  badgeName: string;
  badgeDescription: string;
  earnedAt: string;
  synced: boolean;
}
```

## Activity Types Mapping

### Database Activity Types → Exercise Categories

| Database `activity_type` | Exercise Categories | Examples |
|-------------------------|-------------------|----------|
| `breathing_exercise` | Box Breathing, 4-7-8, Diaphragmatic | Box Breathing (4-4-4-4), 4-7-8 Relaxation, Belly Breathing |
| `meditation` | Body Scan, Grounding, Mindfulness | Body Scan Meditation, 5-4-3-2-1 Grounding |
| `journaling` | Gratitude, CBT, Thought Reframing | Gratitude Journal, Thought Reframing |
| `sleep_tools` | Sleep Sounds, Bedtime Meditations | Sleep Sounds, Progressive Muscle Relaxation |
| `game_session` | Stress Relief Games | Bubble Pop Calm, Breathing Sync Game |
| `mood_log` | Mood Tracking | Daily mood check-ins |

## Achievement System Alignment

### Badge Types (matching database schema):

#### Mood Streak Achievements:
- `mood_streak_7` - Weekly Warrior (7-day mood streak)
- `mood_streak_30` - Monthly Master (30-day mood streak)

#### Breathing Exercise Achievements:
- `breathing_master` - Focused Breather (10 breathing exercises)
- `sleep_ready` - Sleep Ready (4-7-8 breathing at night)

#### Meditation Achievements:
- `meditation_explorer` - Calm Explorer (5 meditation sessions)
- `sleep_helper` - Sleep Helper (3 body scan sessions)
- `grounding_hero` - Grounded Hero (3 grounding exercises)

#### Journaling Achievements:
- `gratitude_keeper` - Gratitude Keeper (7 gratitude entries)
- `resilience_builder` - Resilience Builder (5 reframing exercises)

#### Game Achievements:
- `stress_buster` - Stress Buster (10 game sessions)

#### Cross-Activity Achievements:
- `wellness_warrior` - Wellness Warrior (3 different activity types)
- `consistency_champion` - Consistency Champion (7-day cross-activity streak)

## Data Flow for Sync Backup

### 1. Local Storage → Database Sync
When user enables backup in settings:

```typescript
// Sync exercise completions
const completions = await getExerciseCompletions();
const unsyncedCompletions = completions.filter(c => !c.synced);

for (const completion of unsyncedCompletions) {
  await supabase.from('user_progress_backup').insert({
    user_id: completion.userId,
    activity_type: completion.activityType,
    activity_details: completion.activityDetails,
    completed_at: completion.completedAt,
    streak_count: completion.streakCount
  });
  
  // Mark as synced
  completion.synced = true;
}
```

### 2. Database → Local Storage Sync
When user logs in on new device:

```typescript
// Fetch user progress from database
const { data: progressData } = await supabase
  .from('user_progress_backup')
  .select('*')
  .eq('user_id', userId);

// Save to local storage
await AsyncStorage.setItem('exercise_completions', JSON.stringify(progressData));
```

## Exercise Implementation

### Exercise Details Screen Updates:
- Maps exercise types to database `activity_type`
- Creates completion records matching database schema
- Tracks all activity details in JSONB format
- Calculates streaks based on completion history

### Gamification System Updates:
- Achievement checking based on completion history
- Streak calculation from completion data
- Experience points awarded per activity type
- Notification system for achievements and milestones

## Benefits of This Alignment

1. **Seamless Backup**: Local data structure matches database exactly
2. **No Data Loss**: All exercise data preserved during sync
3. **Cross-Device Sync**: Users can switch devices without losing progress
4. **Analytics Ready**: Data structure supports future analytics features
5. **Scalable**: Easy to add new activity types and achievements
6. **Offline-First**: Works completely offline, syncs when online

## Migration Path

When implementing the backup feature:

1. **Phase 1**: Local storage only (current implementation)
2. **Phase 2**: Add sync toggle in settings
3. **Phase 3**: Implement background sync
4. **Phase 4**: Add conflict resolution for edge cases

The current implementation is ready for Phase 2 with minimal changes needed.
