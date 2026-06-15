import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MealLog, DailySummary, UserProfile } from '../types/database.types';
// Supabase Configuration
// To connect your real Supabase project:
// 1. Create a .env file or configure environment variables:
//    EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
//    EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';
export const supabase = (SUPABASE_URL && SUPABASE_ANON_KEY)
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : null;
// Local AsyncStorage Keys
const LOCAL_PROFILE_KEY = 'nutrisnap_profile';
const LOCAL_LOGS_KEY_PREFIX = 'nutrisnap_logs_';
const LOCAL_SUMMARY_KEY_PREFIX = 'nutrisnap_summary_';
/**
 * Gets the current device ID. Generates one if it doesn't exist.
 */
export const getOrCreateDeviceId = async (): Promise<string> => {
  try {
    let deviceId = await AsyncStorage.getItem('device_id');
    if (!deviceId) {
      deviceId = 'dev_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      await AsyncStorage.setItem('device_id', deviceId);
    }
    return deviceId;
  } catch (e) {
    console.error('Error with Device ID:', e);
    return 'dev_fallback_id';
  }
};
/**
 * Recalculates the daily summary based on meal logs.
 */
export const calculateSummary = (logs: MealLog[], deviceId: string, date: string): DailySummary => {
  const summary: DailySummary = {
    device_id: deviceId,
    log_date: date,
    total_calories: 0,
    total_protein: 0,
    total_carbs: 0,
    total_fat: 0,
    total_fibre: 0,
    total_sodium: 0,
    meal_count: logs.length
  };
  logs.forEach(log => {
    const s = log.servings || 1;
    summary.total_calories += Math.round((log.calories || 0) * s);
    summary.total_protein += Math.round((log.protein || 0) * s);
    summary.total_carbs += Math.round((log.carbs || 0) * s);
    summary.total_fat += Math.round((log.fat || 0) * s);
    summary.total_fibre += Math.round((log.fibre || 0) * s);
    summary.total_sodium += Math.round((log.sodium || 0) * s);
  });
  return summary;
};
// Default Pre-loaded Mock Data matching the design mockup for first paint
const getDefaultMeals = (deviceId: string, date: string): MealLog[] => [
  {
    id: 'mock-1',
    device_id: deviceId,
    log_date: date,
    meal_type: 'breakfast',
    food_name: 'Paratha + Curd',
    serving_size: '1 plate',
    servings: 1,
    calories: 420,
    protein: 18,
    carbs: 45,
    fat: 18,
    fibre: 3,
    sugar: 4,
    sodium: 450,
    saturated_fat: 8,
    cholesterol: 15,
    source: 'manual'
  },
  {
    id: 'mock-2',
    device_id: deviceId,
    log_date: date,
    meal_type: 'lunch',
    food_name: 'Dal Makhani + Rice',
    serving_size: '1 bowl',
    servings: 1,
    calories: 560,
    protein: 35,
    carbs: 65,
    fat: 14,
    fibre: 8,
    sugar: 2,
    sodium: 650,
    saturated_fat: 5,
    cholesterol: 10,
    source: 'quick_add'
  },
  {
    id: 'mock-3',
    device_id: deviceId,
    log_date: date,
    meal_type: 'snack',
    food_name: 'Masala Chai',
    serving_size: '1 cup',
    servings: 1,
    calories: 160,
    protein: 5,
    carbs: 14,
    fat: 6,
    fibre: 0,
    sugar: 10,
    sodium: 50,
    saturated_fat: 3,
    cholesterol: 5,
    source: 'manual'
  }
];

const getDefaultProfile = (deviceId: string): UserProfile => ({
  device_id: deviceId,
  display_name: 'Vivek',
  age: 40,
  gender: 'male',
  height_cm: 180,
  weight_kg: 80,
  target_weight_kg: 72,
  activity_level: 'moderate',
  primary_goal: 'weight_loss,high_protein',
  has_bp: false,
  has_cholesterol: false,
  has_diabetes: true,
  has_thyroid: false,
  goal_calories: 1800,
  goal_protein: 80,
  goal_carbs: 200,
  goal_fat: 60,
  goal_fibre: 25,
  goal_sodium: 2000
});

export const DatabaseService = {
  /**
   * Retrieves user profile. Check cache first, then fetch from Supabase if online.
   */
  getUserProfile: async (deviceId: string): Promise<UserProfile> => {
    try {
      // 1. Get cached profile
      const cached = await AsyncStorage.getItem(LOCAL_PROFILE_KEY);
      let profile = cached ? JSON.parse(cached) : getDefaultProfile(deviceId);
      // If Supabase is available, sync in background
      if (supabase) {
        (async () => {
          try {
            const { data, error } = await supabase
              .from('user_profiles')
              .select('*')
              .eq('device_id', deviceId)
              .single();
            if (data && !error) {
              await AsyncStorage.setItem(LOCAL_PROFILE_KEY, JSON.stringify(data));
            } else if (error && error.code === 'PGRST116') {
              // Row not found, create one in Supabase
              await supabase.from('user_profiles').insert([profile]);
            }
          } catch (err) {
            console.log('Supabase profile background error:', err);
          }
        })();
      }
      return profile;
    } catch (e) {
      console.error('Error getting profile:', e);
      return getDefaultProfile(deviceId);
    }
  },
  /**
   * Updates user profile in local cache and Supabase.
   */
  saveUserProfile: async (profile: UserProfile): Promise<void> => {
    try {
      await AsyncStorage.setItem(LOCAL_PROFILE_KEY, JSON.stringify(profile));
      if (supabase) {
        const { error } = await supabase.from('user_profiles').upsert(profile);
        if (error) console.error('Error saving profile to Supabase:', error);
      }
    } catch (e) {
      console.error('Error saving profile:', e);
    }
  },
  /**
   * Retrieves meal logs for a specific date.
   * Instantly returns cached values. If empty, initializes with default mockup data.
   */
  getMealLogs: async (deviceId: string, date: string): Promise<MealLog[]> => {
    const cacheKey = `${LOCAL_LOGS_KEY_PREFIX}${date}`;
    try {
      const cached = await AsyncStorage.getItem(cacheKey);
      let logs: MealLog[] = [];
      if (cached) {
        logs = JSON.parse(cached);
      } else {
        // Initialize with default meals on first paint to match mockup design
        logs = getDefaultMeals(deviceId, date);
        await AsyncStorage.setItem(cacheKey, JSON.stringify(logs));
        // Save initial summary
        const initialSummary = calculateSummary(logs, deviceId, date);
        await AsyncStorage.setItem(`${LOCAL_SUMMARY_KEY_PREFIX}${date}`, JSON.stringify(initialSummary));
      }
      // Sync with Supabase in background
      if (supabase) {
        (async () => {
          try {
            const { data, error } = await supabase
              .from('meal_logs')
              .select('*')
              .eq('device_id', deviceId)
              .eq('log_date', date);
            if (data && !error) {
              // Merge or overwrite local cache with DB state (DB is source of truth)
              await AsyncStorage.setItem(cacheKey, JSON.stringify(data));
              
              // Recalculate summary and update summary cache
              const updatedSummary = calculateSummary(data, deviceId, date);
              await AsyncStorage.setItem(`${LOCAL_SUMMARY_KEY_PREFIX}${date}`, JSON.stringify(updatedSummary));
              
              // Upsert summary to Supabase
              await supabase.from('daily_summaries').upsert(updatedSummary);
            }
          } catch (err) {
            console.log('Supabase logs background error:', err);
          }
        })();
      }
      return logs;
    } catch (e) {
      console.error('Error getting meal logs:', e);
      return getDefaultMeals(deviceId, date);
    }
  },
  /**
   * Adds a new meal log. Updates local storage instantly (returning updated dataset)
   * and triggers Supabase sync in the background.
   */
  addMealLog: async (mealLog: MealLog): Promise<{ logs: MealLog[]; summary: DailySummary }> => {
    const date = mealLog.log_date;
    const deviceId = mealLog.device_id;
    const cacheKey = `${LOCAL_LOGS_KEY_PREFIX}${date}`;
    
    try {
      // 1. Get current logs
      const cached = await AsyncStorage.getItem(cacheKey);
      let logs: MealLog[] = cached ? JSON.parse(cached) : [];
      // 2. Add new log
      const newLog = {
        ...mealLog,
        id: mealLog.id || 'local_' + Math.random().toString(36).substring(2, 9)
      };
      const updatedLogs = [...logs, newLog];
      // 3. Recalculate summary
      const updatedSummary = calculateSummary(updatedLogs, deviceId, date);
      // 4. Save to local cache (instant UI update)
      await AsyncStorage.setItem(cacheKey, JSON.stringify(updatedLogs));
      await AsyncStorage.setItem(`${LOCAL_SUMMARY_KEY_PREFIX}${date}`, JSON.stringify(updatedSummary));
      // 5. Sync to Supabase in the background
      if (supabase) {
        (async () => {
          try {
            const { error } = await supabase
              .from('meal_logs')
              .insert([newLog]);
            
            if (error) {
              console.error('Supabase meal log insertion error:', error);
            } else {
              // Upsert the daily summary in Supabase
              await supabase.from('daily_summaries').upsert(updatedSummary);
            }
          } catch (err) {
            console.log('Supabase sync background insert error:', err);
          }
        })();
      }
      return { logs: updatedLogs, summary: updatedSummary };
    } catch (e) {
      console.error('Error adding meal log:', e);
      throw e;
    }
  },
  /**
   * Retrieves the daily summary for a date.
   * Checks local storage cache for instant paint.
   */
  getDailySummary: async (deviceId: string, date: string): Promise<DailySummary> => {
    const cacheKey = `${LOCAL_SUMMARY_KEY_PREFIX}${date}`;
    try {
      const cached = await AsyncStorage.getItem(cacheKey);
      if (cached) {
        return JSON.parse(cached);
      }
      // If no cache, load logs first (which triggers mock initialization or Supabase fetch)
      const logs = await DatabaseService.getMealLogs(deviceId, date);
      const summary = calculateSummary(logs, deviceId, date);
      await AsyncStorage.setItem(cacheKey, JSON.stringify(summary));
      return summary;
    } catch (e) {
      console.error('Error getting daily summary:', e);
      // Fallback
      return {
        device_id: deviceId,
        log_date: date,
        total_calories: 1140, // Default mock total calories
        total_protein: 58,
        total_carbs: 124,
        total_fat: 38,
        total_fibre: 11,
        total_sodium: 1150,
        meal_count: 3
      };
    }
  }
};
