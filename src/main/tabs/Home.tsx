import React, { useState, useEffect } from "react";
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useNavigation } from "@react-navigation/native";
import { Colors } from "../../theme/Themes";
import { DatabaseService, getOrCreateDeviceId } from "../../lib/Supabase";
import { MealLog, DailySummary, UserProfile } from "../../types/database.types";

const { width } = Dimensions.get("window");

// Emojis mapping for food items
const FOOD_EMOJIS: Record<string, string> = {
  "Paratha + Curd": "🫓",
  "Dal Makhani + Rice": "🍛",
  "Masala Chai": "☕",
  Paratha: "🫓",
  Idli: "🍲",
  "Dal Rice": "🍛",
  Dosa: "🥞",
  default: "🍽️",
};

const Home = () => {
  const navigation = useNavigation<any>();

  // State variables - Initialized to the exact mockup data to ensure zero loading state on first paint
  const [deviceId, setDeviceId] = useState<string>("");
  const [profile, setProfile] = useState<UserProfile>({
    device_id: "",
    display_name: "Vivek",
    goal_calories: 1800,
    goal_protein: 80,
    goal_carbs: 200,
    goal_fat: 60,
    goal_fibre: 25,
    goal_sodium: 2000,
    primary_goal: "weight_loss,high_protein",
    has_bp: false,
    has_cholesterol: false,
    has_diabetes: false,
    has_thyroid: false,
  });

  const [meals, setMeals] = useState<MealLog[]>([
    {
      id: "mock-1",
      device_id: "",
      log_date: "",
      meal_type: "breakfast",
      food_name: "Paratha + Curd",
      serving_size: "1 plate",
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
      source: "manual",
    },
    {
      id: "mock-2",
      device_id: "",
      log_date: "",
      meal_type: "lunch",
      food_name: "Dal Makhani + Rice",
      serving_size: "1 bowl",
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
      source: "quick_add",
    },
    {
      id: "mock-3",
      device_id: "",
      log_date: "",
      meal_type: "snack",
      food_name: "Masala Chai",
      serving_size: "1 cup",
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
      source: "manual",
    },
  ]);

  const [summary, setSummary] = useState<DailySummary>({
    device_id: "",
    log_date: "",
    total_calories: 1140,
    total_protein: 58,
    total_carbs: 124,
    total_fat: 38,
    total_fibre: 11,
    total_sodium: 1150,
    meal_count: 3,
  });

  // Load data on component mount
  useEffect(() => {
    const initData = async () => {
      try {
        const today = new Date().toISOString().split("T")[0];
        const dId = await getOrCreateDeviceId();
        setDeviceId(dId);

        // Fetch User Profile
        const userProfile = await DatabaseService.getUserProfile(dId);
        setProfile(userProfile);

        // Fetch logs for today (caches logs and summary if not found)
        const todayLogs = await DatabaseService.getMealLogs(dId, today);
        setMeals(todayLogs);

        // Fetch summary
        const dailySum = await DatabaseService.getDailySummary(dId, today);
        setSummary(dailySum);
      } catch (err) {
        console.error("Error initializing Home data:", err);
      }
    };

    initData();
  }, []);

  // Quick Add handler
  const handleQuickAdd = async (
    foodName: string,
    calories: number,
    protein: number,
    carbs: number,
    fat: number,
  ) => {
    try {
      const today = new Date().toISOString().split("T")[0];
      const currentHour = new Date().getHours();

      // Determine meal type by hour
      let mealType: "breakfast" | "lunch" | "dinner" | "snack" = "snack";
      if (currentHour >= 6 && currentHour < 11) mealType = "breakfast";
      else if (currentHour >= 11 && currentHour < 15) mealType = "lunch";
      else if (currentHour >= 18 && currentHour < 22) mealType = "dinner";

      const newMeal: MealLog = {
        device_id: deviceId,
        log_date: today,
        meal_type: mealType,
        food_name: foodName,
        serving_size: "1 serving",
        servings: 1,
        calories,
        protein,
        carbs,
        fat,
        fibre: 2,
        sugar: 1,
        sodium: 250,
        saturated_fat: 1,
        cholesterol: 0,
        source: "quick_add",
      };

      // Instantly update database and local cache
      const result = await DatabaseService.addMealLog(newMeal);

      // Update local state instantly
      setMeals(result.logs);
      setSummary(result.summary);
    } catch (e) {
      console.error("Failed to quick add meal:", e);
    }
  };

  // Helper to get formatted meal title and subtitle
  const formatMealDetails = (meal: MealLog) => {
    // Keep exact mockup subtitle for initial mock data
    if (meal.id === "mock-1") return "Breakfast · 8:15 am";
    if (meal.id === "mock-2") return "Lunch · 1:00 pm";
    if (meal.id === "mock-3") return "Snack · 4:30 pm";

    // Format new meals dynamically
    const mealTypeFormatted =
      meal.meal_type.charAt(0).toUpperCase() + meal.meal_type.slice(1);

    // Fallback if no creation time is saved
    const timeStr = new Date()
      .toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })
      .toLowerCase();
    return `${mealTypeFormatted} · ${timeStr}`;
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return "Good morning";
    if (hour >= 12 && hour < 17) return "Good afternoon";
    if (hour >= 17 && hour < 21) return "Good evening";
    return "Good night";
  };

  const greetingText = `${getGreeting()}`;

  // Progress Calculations
  const calorieProgress = Math.min(
    summary.total_calories / (profile.goal_calories || 1800),
    1,
  );
  const proteinProgress = Math.min(
    summary.total_protein / (profile.goal_protein || 80),
    1,
  );
  const carbsProgress = Math.min(
    summary.total_carbs / (profile.goal_carbs || 200),
    1,
  );
  const fatProgress = Math.min(summary.total_fat / (profile.goal_fat || 60), 1);

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <StatusBar style="dark" />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* --- TOP WHITE CONTAINER --- */}
        <View style={styles.topSection}>
          {/* Header Row */}
          <View style={styles.headerRow}>
            <View>
              <Text style={styles.greetingText}>{greetingText}</Text>
              <Text style={styles.userName}>{profile.display_name}</Text>
            </View>
            <View style={styles.avatarBorder}>
              <View style={styles.avatarBg}>
                <Text style={styles.avatarEmoji}>👦</Text>
              </View>
            </View>
          </View>

          {/* Calorie Stats */}
          <View style={styles.calorieSection}>
            <Text style={styles.calorieTitle}>CALORIES TODAY</Text>
            <View style={styles.calorieRow}>
              <Text style={styles.calorieValue}>
                {summary.total_calories.toLocaleString()}
              </Text>
              <View style={styles.targetBlock}>
                <Text style={styles.targetValue}>
                  / {profile.goal_calories.toLocaleString()}
                </Text>
                <Text style={styles.kcalLabel}>kcal</Text>
              </View>
            </View>

            {/* Calorie Progress Bar */}
            <View style={styles.calorieTrack}>
              <View
                style={[
                  styles.calorieFill,
                  { width: `${calorieProgress * 100}%` },
                ]}
              />
            </View>
          </View>

          {/* Macro Summary Row */}
          <View style={styles.macroRow}>
            {/* Protein Card */}
            <View style={styles.macroCard}>
              <Text style={styles.macroValue}>{summary.total_protein}g</Text>
              <Text style={styles.macroLabel}>PROTEIN</Text>
              <View style={styles.macroTrack}>
                <View
                  style={[
                    styles.macroFill,
                    {
                      width: `${proteinProgress * 100}%`,
                      backgroundColor: Colors.green,
                    },
                  ]}
                />
              </View>
            </View>

            {/* Carbs Card */}
            <View style={styles.macroCard}>
              <Text style={styles.macroValue}>{summary.total_carbs}g</Text>
              <Text style={styles.macroLabel}>CARBS</Text>
              <View style={styles.macroTrack}>
                <View
                  style={[
                    styles.macroFill,
                    {
                      width: `${carbsProgress * 100}%`,
                      backgroundColor: Colors.orange,
                    },
                  ]}
                />
              </View>
            </View>

            {/* Fat Card */}
            <View style={styles.macroCard}>
              <Text style={styles.macroValue}>{summary.total_fat}g</Text>
              <Text style={styles.macroLabel}>FAT</Text>
              <View style={styles.macroTrack}>
                <View
                  style={[
                    styles.macroFill,
                    {
                      width: `${fatProgress * 100}%`,
                      backgroundColor: "#3A3A3C",
                    },
                  ]}
                />
              </View>
            </View>
          </View>
        </View>

        {/* --- BOTTOM GRAY CONTENT CONTAINER --- */}
        <View style={styles.bottomSection}>
          {/* AI Insights Card */}
          <View style={styles.insightCard}>
            <Text style={styles.insightEmoji}>🌿</Text>
            <Text style={styles.insightText}>
              Dal before rice lowers your glycaemic impact significantly today.
            </Text>
          </View>

          {/* Today's Meals Section */}
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitleText}>TODAY'S MEALS</Text>
            <TouchableOpacity
              style={styles.snapBtn}
              activeOpacity={0.7}
              onPress={() => navigation.navigate("Snap")}
            >
              <Text style={styles.snapEmoji}>📸</Text>
              <Text style={styles.snapBtnText}>Snap</Text>
            </TouchableOpacity>
          </View>

          {/* Meal Logs List */}
          <View style={styles.mealsList}>
            {meals.map((meal) => (
              <View key={meal.id} style={styles.mealCard}>
                <View style={styles.mealIconBg}>
                  <Text style={styles.mealIcon}>
                    {FOOD_EMOJIS[meal.food_name] || FOOD_EMOJIS["default"]}
                  </Text>
                </View>
                <View style={styles.mealInfo}>
                  <Text style={styles.mealName}>{meal.food_name}</Text>
                  <Text style={styles.mealMeta}>{formatMealDetails(meal)}</Text>
                </View>
                <View style={styles.mealCalBlock}>
                  <Text style={styles.mealCalories}>{meal.calories}</Text>
                  <Text style={styles.mealCalUnit}>kcal</Text>
                </View>
              </View>
            ))}
          </View>

          {/* Quick Add Section */}
          <View style={styles.quickAddHeaderRow}>
            <Text style={styles.sectionTitleText}>QUICK ADD</Text>
            <TouchableOpacity activeOpacity={0.7}>
              <Text style={styles.moreBtnText}>More →</Text>
            </TouchableOpacity>
          </View>

          {/* Horizontally scrolling quick-add cards */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.quickAddScroll}
          >
            {/* Paratha Card */}
            <TouchableOpacity
              style={styles.quickAddCard}
              activeOpacity={0.8}
              onPress={() => handleQuickAdd("Paratha", 320, 8, 40, 14)}
            >
              <View style={styles.quickAddIconBg}>
                <Text style={styles.quickAddIcon}>🫓</Text>
              </View>
              <Text style={styles.quickAddName}>Paratha</Text>
              <Text style={styles.quickAddCal}>320</Text>
            </TouchableOpacity>

            {/* Idli Card */}
            <TouchableOpacity
              style={styles.quickAddCard}
              activeOpacity={0.8}
              onPress={() => handleQuickAdd("Idli", 210, 5, 44, 1)}
            >
              <View style={styles.quickAddIconBg}>
                <Text style={styles.quickAddIcon}>🍲</Text>
              </View>
              <Text style={styles.quickAddName}>Idli</Text>
              <Text style={styles.quickAddCal}>210</Text>
            </TouchableOpacity>

            {/* Dal Rice Card */}
            <TouchableOpacity
              style={styles.quickAddCard}
              activeOpacity={0.8}
              onPress={() => handleQuickAdd("Dal Rice", 420, 14, 65, 10)}
            >
              <View style={styles.quickAddIconBg}>
                <Text style={styles.quickAddIcon}>🍛</Text>
              </View>
              <Text style={styles.quickAddName}>Dal Rice</Text>
              <Text style={styles.quickAddCal}>420</Text>
            </TouchableOpacity>

            {/* Dosa Card */}
            <TouchableOpacity
              style={styles.quickAddCard}
              activeOpacity={0.8}
              onPress={() => handleQuickAdd("Dosa", 340, 6, 50, 12)}
            >
              <View style={styles.quickAddIconBg}>
                <Text style={styles.quickAddIcon}>🥞</Text>
              </View>
              <Text style={styles.quickAddName}>Dosa</Text>
              <Text style={styles.quickAddCal}>340</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF", // Clean white top
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  // --- TOP WHITE SECTION ---
  topSection: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 24,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  greetingText: {
    fontFamily: "PlusJakartaSans-Medium",
    fontSize: 14.5,
    color: "#8E8E93",
    fontWeight: "500",
    marginBottom: 3,
  },
  userName: {
    fontFamily: "PlusJakartaSans-Bold",
    fontSize: 32,
    fontWeight: "800",
    color: "#1C1C1E",
  },
  avatarBorder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 1.5,
    borderColor: "#FFDCC8",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarBg: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#FFF2EB",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarEmoji: {
    fontSize: 26,
  },
  calorieSection: {
    marginBottom: 24,
  },
  calorieTitle: {
    fontFamily: "PlusJakartaSans-Bold",
    fontSize: 11,
    fontWeight: "700",
    color: "#8E8E93",
    letterSpacing: 0.8,
    marginBottom: 6,
  },
  calorieRow: {
    flexDirection: "row",
    marginBottom: 16,
  },
  calorieValue: {
    fontFamily: "PlusJakartaSans-ExtraBold",
    fontSize: 60,
    fontWeight: "900",
    color: Colors.orange,
    lineHeight: 68,
  },
  targetBlock: {
    flexDirection: "column",
    marginLeft: 10,
    justifyContent: "center",
  },
  targetValue: {
    fontFamily: "PlusJakartaSans-Bold",
    fontSize: 19,
    fontWeight: "700",
    color: "#AEAEB2",
  },
  kcalLabel: {
    fontFamily: "PlusJakartaSans-Medium",
    fontSize: 13,
    fontWeight: "500",
    color: "#AEAEB2",
    marginTop: 1,
  },
  calorieTrack: {
    height: 8,
    width: "100%",
    backgroundColor: "#E5E5EA",
    borderRadius: 4,
    overflow: "hidden",
  },
  calorieFill: {
    height: "100%",
    backgroundColor: Colors.orange,
    borderRadius: 4,
  },
  macroRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  macroCard: {
    width: (width - 56) / 3, // dynamic width fitting screens
    backgroundColor: "#F2F2F7",
    borderRadius: 16,
    padding: 14,
    justifyContent: "center",
  },
  macroValue: {
    fontFamily: "PlusJakartaSans-Bold",
    fontSize: 19,
    fontWeight: "800",
    color: "#1C1C1E",
    marginBottom: 4,
  },
  macroLabel: {
    fontFamily: "PlusJakartaSans-Bold",
    fontSize: 10.5,
    fontWeight: "700",
    color: "#8E8E93",
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  macroTrack: {
    height: 4.5,
    width: "100%",
    backgroundColor: "#E5E5EA",
    borderRadius: 2.5,
    overflow: "hidden",
  },
  macroFill: {
    height: "100%",
    borderRadius: 2.5,
  },

  // --- BOTTOM GRAY SECTION ---
  bottomSection: {
    backgroundColor: "#F2F4F7", // Matches the design's gray layout background
    paddingHorizontal: 20,
    paddingTop: 20,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    minHeight: 500,
  },
  insightCard: {
    flexDirection: "row",
    backgroundColor: "#E6F9EE",
    borderWidth: 1,
    borderColor: "#CBEFDB",
    borderRadius: 18,
    padding: 16,
    alignItems: "center",
    marginBottom: 24,
  },
  insightEmoji: {
    fontSize: 22,
    marginRight: 12,
  },
  insightText: {
    fontFamily: "PlusJakartaSans-SemiBold",
    flex: 1,
    fontSize: 14,
    fontWeight: "600",
    color: "#1E5D2F",
    lineHeight: 18.5,
  },
  sectionHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  sectionTitleText: {
    fontFamily: "PlusJakartaSans-Bold",
    fontSize: 11.5,
    fontWeight: "700",
    color: "#8E8E93",
    letterSpacing: 0.8,
  },
  snapBtn: {
    flexDirection: "row",
    alignItems: "center",
  },
  snapEmoji: {
    fontSize: 15,
    marginRight: 4,
  },
  snapBtnText: {
    fontFamily: "PlusJakartaSans-Bold",
    fontSize: 14,
    fontWeight: "700",
    color: Colors.orange,
  },
  mealsList: {
    marginBottom: 24,
  },
  mealCard: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 16,
    alignItems: "center",
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.02,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  mealIconBg: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: "#FFF2EB",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  mealIcon: {
    fontSize: 24,
  },
  mealInfo: {
    flex: 1,
  },
  mealName: {
    fontFamily: "PlusJakartaSans-Bold",
    fontSize: 16,
    fontWeight: "700",
    color: "#1C1C1E",
    marginBottom: 3,
  },
  mealMeta: {
    fontFamily: "PlusJakartaSans-Medium",
    fontSize: 12.5,
    color: "#8E8E93",
  },
  mealCalBlock: {
    alignItems: "flex-end",
  },
  mealCalories: {
    fontFamily: "PlusJakartaSans-Bold",
    fontSize: 18,
    fontWeight: "800",
    color: Colors.orange,
  },
  mealCalUnit: {
    fontFamily: "PlusJakartaSans-Medium",
    fontSize: 11,
    color: "#AEAEB2",
    marginTop: 1,
  },
  quickAddHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  moreBtnText: {
    fontFamily: "PlusJakartaSans-Bold",
    fontSize: 14,
    fontWeight: "700",
    color: Colors.orange,
  },
  quickAddScroll: {
    paddingBottom: 20,
  },
  quickAddCard: {
    width: 108,
    backgroundColor: "#FFF5ED",
    borderRadius: 20,
    paddingVertical: 14,
    paddingHorizontal: 10,
    alignItems: "center",
    marginRight: 12,
    shadowColor: "#000",
    shadowOpacity: 0.02,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  quickAddIconBg: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  quickAddIcon: {
    fontSize: 22,
  },
  quickAddName: {
    fontFamily: "PlusJakartaSans-Bold",
    fontSize: 13,
    fontWeight: "700",
    color: "#1C1C1E",
    marginBottom: 4,
    textAlign: "center",
  },
  quickAddCal: {
    fontFamily: "PlusJakartaSans-ExtraBold",
    fontSize: 15,
    fontWeight: "800",
    color: Colors.orange,
  },
});

export default Home;
