-- SQL Script for Supabase (PostgreSQL)
-- Set up your tables for the Auth-less Device ID pattern.
-- Copy and paste this script into your Supabase Dashboard SQL Editor.

-- 1. Create User Profiles Table
CREATE TABLE IF NOT EXISTS public.user_profiles (
    device_id TEXT PRIMARY KEY,
    display_name TEXT NOT NULL DEFAULT 'Vivek',
    age INTEGER,
    gender TEXT CHECK (gender IN ('male', 'female', 'other')),
    height_cm NUMERIC,
    weight_kg NUMERIC,
    target_weight_kg NUMERIC,
    activity_level TEXT CHECK (activity_level IN ('sedentary', 'light', 'moderate', 'active', 'very_active')),
    primary_goal TEXT, -- comma-separated e.g. "weight_loss,high_protein"
    has_bp BOOLEAN NOT NULL DEFAULT false,
    has_cholesterol BOOLEAN NOT NULL DEFAULT false,
    has_diabetes BOOLEAN NOT NULL DEFAULT false,
    has_thyroid BOOLEAN NOT NULL DEFAULT false,
    goal_calories INTEGER NOT NULL DEFAULT 1800,
    goal_protein INTEGER NOT NULL DEFAULT 80,
    goal_carbs INTEGER NOT NULL DEFAULT 200,
    goal_fat INTEGER NOT NULL DEFAULT 60,
    goal_fibre INTEGER NOT NULL DEFAULT 25,
    goal_sodium INTEGER NOT NULL DEFAULT 2000,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create Meal Logs Table
CREATE TABLE IF NOT EXISTS public.meal_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    device_id TEXT NOT NULL REFERENCES public.user_profiles(device_id) ON DELETE CASCADE,
    log_date DATE NOT NULL,
    meal_type TEXT NOT NULL CHECK (meal_type IN ('breakfast', 'lunch', 'dinner', 'snack')),
    food_name TEXT NOT NULL,
    serving_size TEXT,
    servings NUMERIC NOT NULL DEFAULT 1,
    calories INTEGER NOT NULL DEFAULT 0,
    protein INTEGER NOT NULL DEFAULT 0,
    carbs INTEGER NOT NULL DEFAULT 0,
    fat INTEGER NOT NULL DEFAULT 0,
    fibre INTEGER NOT NULL DEFAULT 0,
    sugar INTEGER NOT NULL DEFAULT 0,
    sodium INTEGER NOT NULL DEFAULT 0,
    saturated_fat INTEGER NOT NULL DEFAULT 0,
    cholesterol INTEGER NOT NULL DEFAULT 0,
    source TEXT NOT NULL CHECK (source IN ('ai', 'quick_add', 'manual')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster querying by device_id and date
CREATE INDEX IF NOT EXISTS idx_meal_logs_device_date ON public.meal_logs(device_id, log_date);

-- 3. Create Daily Summaries Table (Acts as cache and fast lookup)
CREATE TABLE IF NOT EXISTS public.daily_summaries (
    device_id TEXT NOT NULL REFERENCES public.user_profiles(device_id) ON DELETE CASCADE,
    log_date DATE NOT NULL,
    total_calories INTEGER NOT NULL DEFAULT 0,
    total_protein INTEGER NOT NULL DEFAULT 0,
    total_carbs INTEGER NOT NULL DEFAULT 0,
    total_fat INTEGER NOT NULL DEFAULT 0,
    total_fibre INTEGER NOT NULL DEFAULT 0,
    total_sodium INTEGER NOT NULL DEFAULT 0,
    meal_count INTEGER NOT NULL DEFAULT 0,
    PRIMARY KEY (device_id, log_date),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. PostgreSQL Trigger to Automate Daily Summaries Recalculation
-- This ensures that the user never faces data mismatch issues between meal logs and summaries.
CREATE OR REPLACE FUNCTION public.recalculate_daily_summary()
RETURNS TRIGGER AS $$
DECLARE
    target_device_id TEXT;
    target_log_date DATE;
BEGIN
    target_device_id := COALESCE(NEW.device_id, OLD.device_id);
    target_log_date := COALESCE(NEW.log_date, OLD.log_date);

    -- Insert or update daily summary based on sum of meal logs for that day
    INSERT INTO public.daily_summaries (
        device_id,
        log_date,
        total_calories,
        total_protein,
        total_carbs,
        total_fat,
        total_fibre,
        total_sodium,
        meal_count
    )
    SELECT
        target_device_id,
        target_log_date,
        COALESCE(SUM(calories * servings), 0) AS total_calories,
        COALESCE(SUM(protein * servings), 0) AS total_protein,
        COALESCE(SUM(carbs * servings), 0) AS total_carbs,
        COALESCE(SUM(fat * servings), 0) AS total_fat,
        COALESCE(SUM(fibre * servings), 0) AS total_fibre,
        COALESCE(SUM(sodium * servings), 0) AS total_sodium,
        COUNT(*) AS meal_count
    FROM public.meal_logs
    WHERE device_id = target_device_id AND log_date = target_log_date
    ON CONFLICT (device_id, log_date) DO UPDATE
    SET
        total_calories = EXCLUDED.total_calories,
        total_protein = EXCLUDED.total_protein,
        total_carbs = EXCLUDED.total_carbs,
        total_fat = EXCLUDED.total_fat,
        total_fibre = EXCLUDED.total_fibre,
        total_sodium = EXCLUDED.total_sodium,
        meal_count = EXCLUDED.meal_count,
        updated_at = NOW();

    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Attach the trigger to meal_logs table
DROP TRIGGER IF EXISTS trg_meal_logs_changed ON public.meal_logs;
CREATE TRIGGER trg_meal_logs_changed
AFTER INSERT OR UPDATE OR DELETE ON public.meal_logs
FOR EACH ROW
EXECUTE FUNCTION public.recalculate_daily_summary();

-- 5. Row Level Security (RLS) Configuration for Device ID Pattern
-- Enable RLS on all tables
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meal_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_summaries ENABLE ROW LEVEL SECURITY;

-- Create Policies allowing access matching the device ID.
-- Since the application operates without a traditional login, we use public client access
-- restricted to rows matching the device ID.

CREATE POLICY "Enable all operations for device-id matching profile"
    ON public.user_profiles
    FOR ALL
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Enable all operations for device-id matching meal logs"
    ON public.meal_logs
    FOR ALL
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Enable all operations for device-id matching summaries"
    ON public.daily_summaries
    FOR ALL
    USING (true)
    WITH CHECK (true);
