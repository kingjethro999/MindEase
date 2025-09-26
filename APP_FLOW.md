Based on the document, here are the exercises, gamifications, and streaks:

## **Breathing Exercises**
- Box Breathing (4-4-4-4 method)
- 4-7-8 Relaxation Breath
- Diaphragmatic (Deep Belly Breathing)

## **Mindfulness Practices**
- Guided Meditation (5-10 min sessions)
- Body Scan (Progressive Relaxation)
- 5-4-3-2-1 Grounding Exercise

## **Journaling Prompts**
- Gratitude Journal
- Thought Reframing (CBT-inspired)

## **Sleep & Relaxation Tools**
- Sleep Sounds (White Noise & Nature Library)
- Bedtime Meditations (Guided Audio)
- Progressive Muscle Relaxation
- Gentle Stretch Routines (bedtime yoga)

## **Stress-Relief Games**
- Bubble Pop Calm
- Breathing Sync Game
- Soothing Puzzle

## **Gamification & Badges**
- **Focused Breather** (Box Breathing completion)
- **Sleep Ready** (4-7-8 before bedtime)
- **Calm Explorer** (5 meditation completions)
- **Sleep Helper** (3 nights of Body Scan)
- **Grounded Hero** (3+ grounding sessions)
- **Gratitude Keeper** (7 days of gratitude journaling)
- **Resilience Builder** (5 reframing exercises)
- **Resilience Warrior** (complete full resilience module)
- **Calm Master** 
- **Stress-Buster** (game achievements)

## **Streaks**
- Daily mood check-in streak
- 7-day Mood Log Streak
- Meditation completion streaks
- Body Scan night streaks
- Gratitude journaling streaks
- Exercise completion streaks
- Game playing streaks

## **Additional Engagement**
- Weekly reports with insights
- Daily affirmations
- Daily reminders
- Progress tracking for all exercises
- Score/progress saving for games


Based on your database schema, here are the exercises, gamifications, and streaks that match your existing structure:

## **Exercises (activity_type in user_progress_backup)**
- `breathing_exercise` - Box Breathing, 4-7-8, Diaphragmatic
- `meditation` - Guided Meditation, Body Scan, 5-4-3-2-1 Grounding
- `journaling` - Gratitude Journal, Thought Reframing
- `sleep_tools` - Sleep Sounds, Bedtime Meditations, Progressive Muscle Relaxation
- `game_session` - Bubble Pop Calm, Breathing Sync Game, Soothing Puzzle

## **Gamification & Badges (badge_type in user_achievements)**
- `mood_streak_7` - 7-day Mood Log Streak
- `mood_streak_30` - 30-day Mood Log Streak
- `breathing_master` - Focused Breather (multiple breathing completions)
- `meditation_explorer` - Calm Explorer (5+ meditation sessions)
- `sleep_helper` - Sleep Ready (consistent sleep tool usage)
- `grounding_hero` - Grounded Hero (3+ grounding sessions)
- `gratitude_keeper` - Gratitude Keeper (7+ gratitude entries)
- `resilience_builder` - Resilience Builder (5+ reframing exercises)
- `stress_buster` - Game achievements
- `wellness_warrior` - Complete multiple activity types
- `consistency_champion` - Cross-activity streaks

## **Streaks (tracked via user_progress_backup)**
- Daily mood logging streaks
- Breathing exercise completion streaks  
- Meditation session streaks
- Journaling entry streaks
- Sleep tool usage streaks
- Game playing streaks
- Cross-activity consistency streaks

## **Activity Details (JSONB in activity_details column)**
- Exercise type and duration
- Game scores and levels
- Journal word count
- Sleep tool preferences
- Mood intensity patterns
- Completion rates

This structure allows you to track all the PRD activities while leveraging your existing `user_progress_backup` table for streaks and `user_achievements` for badges.