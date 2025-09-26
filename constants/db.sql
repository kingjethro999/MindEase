-- MindEase Mental Wellness App - Supabase Database Schema
-- Optimized for offline-first approach with minimal cloud data

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enable RLS (Row Level Security)
ALTER DATABASE postgres SET "app.settings.jwt_secret" TO 'your-jwt-secret-here';

-- ============================================================================
-- USERS & PROFILES
-- ============================================================================

-- User profiles table (extends Supabase auth.users)
CREATE TABLE public.user_profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    username VARCHAR(50) UNIQUE,
    email VARCHAR(255),
    display_name VARCHAR(100),
    age_range VARCHAR(20) CHECK (age_range IN ('18-25', '26-35', '36-45', '46-55', '55+')),
    primary_goals TEXT[], -- ['reduce_anxiety', 'better_sleep', 'manage_depression', 'stress_relief']
    timezone VARCHAR(50) DEFAULT 'UTC',
    language_preference VARCHAR(10) DEFAULT 'en',
    notification_preferences JSONB DEFAULT '{"daily_reminder": true, "affirmations": true, "weekly_reports": true}',
    onboarding_completed BOOLEAN DEFAULT FALSE,
    premium_status BOOLEAN DEFAULT FALSE,
    premium_expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- OPTIONAL CLOUD SYNC FOR BACKUP (User can choose to sync or stay local)
-- ============================================================================

-- Mood entries backup (only if user opts for cloud backup)
CREATE TABLE public.mood_entries_backup (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    primary_mood VARCHAR(20) NOT NULL, -- 'happy', 'calm', 'neutral', 'anxious', 'sad', 'irritable', 'tired'
    mood_intensity INTEGER CHECK (mood_intensity >= 1 AND mood_intensity <= 5),
    notes TEXT,
    triggers TEXT[], -- ['work', 'family', 'relationships', 'health', 'money', 'sleep', 'other']
    energy_level VARCHAR(10) CHECK (energy_level IN ('low', 'normal', 'high')),
    sleep_quality VARCHAR(10) CHECK (sleep_quality IN ('poor', 'fair', 'good')),
    sleep_hours DECIMAL(3,1),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Ensure one mood entry per day per user
    UNIQUE(user_id, date)
);

-- User progress and achievements backup
CREATE TABLE public.user_progress_backup (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    activity_type VARCHAR(50) NOT NULL, -- 'mood_log', 'breathing_exercise', 'meditation', 'journaling', 'game_session'
    activity_details JSONB, -- specific details about the activity
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    streak_count INTEGER DEFAULT 1,
    
    INDEX (user_id, activity_type, completed_at)
);

-- User badges and achievements
CREATE TABLE public.user_achievements (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    badge_type VARCHAR(50) NOT NULL, -- 'mood_streak_7', 'calm_master', 'resilience_builder', etc.
    badge_name VARCHAR(100) NOT NULL,
    badge_description TEXT,
    earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(user_id, badge_type)
);

-- ============================================================================
-- APP CONFIGURATION & CONTENT MANAGEMENT
-- ============================================================================

-- Daily affirmations content
CREATE TABLE public.affirmations (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    content TEXT NOT NULL,
    category VARCHAR(50), -- 'general', 'anxiety', 'depression', 'stress', 'confidence'
    language VARCHAR(10) DEFAULT 'en',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Daily tips content
CREATE TABLE public.daily_tips (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    category VARCHAR(50), -- 'anxiety', 'depression', 'sleep', 'stress', 'general'
    language VARCHAR(10) DEFAULT 'en',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Learning modules content
CREATE TABLE public.learning_content (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    content_type VARCHAR(20) DEFAULT 'article', -- 'article', 'video', 'infographic'
    category VARCHAR(50), -- 'understanding_anxiety', 'coping_depression', 'thought_management', etc.
    order_index INTEGER DEFAULT 0,
    estimated_read_time INTEGER, -- in minutes
    language VARCHAR(10) DEFAULT 'en',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- ANALYTICS & INSIGHTS (Aggregated, Anonymous)
-- ============================================================================

-- Anonymous usage analytics (no personal data)
CREATE TABLE public.app_analytics (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    event_type VARCHAR(50) NOT NULL, -- 'mood_logged', 'exercise_completed', 'game_played'
    event_category VARCHAR(50),
    country_code VARCHAR(3), -- for regional insights
    app_version VARCHAR(20),
    occurred_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- PREMIUM SUBSCRIPTION MANAGEMENT
-- ============================================================================

-- Premium subscriptions
CREATE TABLE public.subscriptions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    subscription_type VARCHAR(20) CHECK (subscription_type IN ('monthly', 'yearly')),
    status VARCHAR(20) CHECK (status IN ('active', 'cancelled', 'expired')),
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE,
    cancelled_at TIMESTAMP WITH TIME ZONE,
    platform VARCHAR(20), -- 'android', 'ios'
    transaction_id VARCHAR(255) UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================

-- User profiles indexes
CREATE INDEX idx_user_profiles_email ON public.user_profiles(email);
CREATE INDEX idx_user_profiles_username ON public.user_profiles(username);

-- Mood entries indexes
CREATE INDEX idx_mood_entries_user_date ON public.mood_entries_backup(user_id, date DESC);
CREATE INDEX idx_mood_entries_date ON public.mood_entries_backup(date DESC);

-- Progress indexes
CREATE INDEX idx_user_progress_user_activity ON public.user_progress_backup(user_id, activity_type, completed_at DESC);

-- Content indexes
CREATE INDEX idx_affirmations_category_lang ON public.affirmations(category, language) WHERE is_active = TRUE;
CREATE INDEX idx_daily_tips_category_lang ON public.daily_tips(category, language) WHERE is_active = TRUE;
CREATE INDEX idx_learning_content_category_lang ON public.learning_content(category, language, order_index) WHERE is_active = TRUE;

-- Analytics indexes
CREATE INDEX idx_analytics_event_date ON public.app_analytics(event_type, occurred_at DESC);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- Enable RLS on all user tables
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mood_entries_backup ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_progress_backup ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- User profiles policies
CREATE POLICY "Users can view own profile" ON public.user_profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.user_profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.user_profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Mood entries policies
CREATE POLICY "Users can manage own mood entries" ON public.mood_entries_backup
    FOR ALL USING (auth.uid() = user_id);

-- Progress policies
CREATE POLICY "Users can manage own progress" ON public.user_progress_backup
    FOR ALL USING (auth.uid() = user_id);

-- Achievements policies
CREATE POLICY "Users can view own achievements" ON public.user_achievements
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "System can insert achievements" ON public.user_achievements
    FOR INSERT WITH CHECK (true); -- Allow system to award achievements

-- Subscriptions policies
CREATE POLICY "Users can view own subscriptions" ON public.subscriptions
    FOR SELECT USING (auth.uid() = user_id);

-- Public read access for content tables
CREATE POLICY "Anyone can read affirmations" ON public.affirmations
    FOR SELECT USING (is_active = TRUE);

CREATE POLICY "Anyone can read daily tips" ON public.daily_tips
    FOR SELECT USING (is_active = TRUE);

CREATE POLICY "Anyone can read learning content" ON public.learning_content
    FOR SELECT USING (is_active = TRUE);

-- ============================================================================
-- FUNCTIONS AND TRIGGERS
-- ============================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger for user_profiles updated_at
CREATE TRIGGER update_user_profiles_updated_at 
    BEFORE UPDATE ON public.user_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to handle user profile creation after signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.user_profiles (id, email)
    VALUES (NEW.id, NEW.email);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile when user signs up
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================================
-- SAMPLE DATA FOR TESTING
-- ============================================================================

-- Sample affirmations
INSERT INTO public.affirmations (content, category, language) VALUES
('You are stronger than your thoughts', 'general', 'en'),
('This feeling will pass, and you will be okay', 'anxiety', 'en'),
('You deserve peace and happiness', 'depression', 'en'),
('Take one breath at a time', 'stress', 'en'),
('You are capable of handling today''s challenges', 'confidence', 'en');

-- Sample daily tips
INSERT INTO public.daily_tips (title, content, category, language) VALUES
('Morning Breathing', 'Start your day with 2 minutes of deep breathing to center yourself', 'general', 'en'),
('Limit Caffeine', 'Try to limit caffeine after 2 PM to reduce anxiety and improve sleep', 'anxiety', 'en'),
('Gratitude Practice', 'Write down one thing you''re grateful for each morning', 'depression', 'en'),
('10-Minute Walk', 'A short walk can reduce stress hormones by up to 20%', 'stress', 'en'),
('Sleep Routine', 'Go to bed at the same time each night to improve sleep quality', 'sleep', 'en');

-- Sample learning content
INSERT INTO public.learning_content (title, content, category, order_index, estimated_read_time, language) VALUES
('Understanding Anxiety', 'Anxiety is a normal human response to stress, but when it becomes overwhelming...', 'understanding_anxiety', 1, 3, 'en'),
('What is Depression?', 'Depression is more than just feeling sad. It''s a serious mental health condition...', 'understanding_depression', 1, 4, 'en'),
('CBT Basics', 'Cognitive Behavioral Therapy teaches us that our thoughts, feelings, and behaviors are connected...', 'thought_management', 1, 5, 'en');

-- ============================================================================
-- VIEWS FOR EASY DATA ACCESS
-- ============================================================================

-- View for user dashboard data
CREATE VIEW public.user_dashboard AS
SELECT 
    up.id,
    up.display_name,
    up.primary_goals,
    up.premium_status,
    COUNT(DISTINCT meb.date) as mood_entries_count,
    COUNT(DISTINCT ua.badge_type) as badges_earned,
    MAX(meb.created_at) as last_mood_entry
FROM public.user_profiles up
LEFT JOIN public.mood_entries_backup meb ON up.id = meb.user_id
LEFT JOIN public.user_achievements ua ON up.id = ua.user_id
GROUP BY up.id, up.display_name, up.primary_goals, up.premium_status;

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON TABLE public.user_profiles IS 'User account information and preferences - minimal data stored';
COMMENT ON TABLE public.mood_entries_backup IS 'Optional cloud backup of mood data - users can choose to sync or stay local only';
COMMENT ON TABLE public.user_progress_backup IS 'Backup of user activities and progress - optional sync';
COMMENT ON TABLE public.affirmations IS 'Daily affirmations content for the app';
COMMENT ON TABLE public.daily_tips IS 'Daily wellness tips shown to users';
COMMENT ON TABLE public.learning_content IS 'Educational content for the learning hub';
COMMENT ON TABLE public.app_analytics IS 'Anonymous usage analytics - no personal data';

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres, service_role;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO postgres, authenticated, service_role;