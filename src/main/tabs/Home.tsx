import React from 'react';
import { SafeAreaView, ScrollView, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';

const meals = [
  { title: 'Paratha + Curd', subtitle: 'Breakfast · 8:15 am', calories: 420 },
  { title: 'Dal Makhani + Rice', subtitle: 'Lunch · 1:00 pm', calories: 560 },
  { title: 'Masala Chai', subtitle: 'Snack · 4:30 pm', calories: 160 },
];

const quickAddItems = [
  { title: 'Paratha', calories: 320 },
  { title: 'Idli', calories: 210 },
  { title: 'Dal Rice', calories: 420 },
  { title: 'Dosa', calories: 340 },
];

const Home = () => {
  const caloriesToday = 1140;
  const targetCalories = 1800;
  const progress = Math.min(caloriesToday / targetCalories, 1);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />

      <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.topRow}>
          <View>
            <Text style={styles.greetingSmall}>Good evening 🌙</Text>
            <Text style={styles.greetingLarge}>Vivek</Text>
          </View>
          <View style={styles.avatar}>
            <Text style={styles.avatarInitial}>V</Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>CALORIES TODAY</Text>
          <View style={styles.calorieRow}>
            <Text style={styles.calorieValue}>{caloriesToday.toLocaleString()}</Text>
            <View style={styles.calorieTargetBlock}>
              <Text style={styles.calorieTarget}>{targetCalories.toLocaleString()}</Text>
              <Text style={styles.kcalText}>kcal</Text>
            </View>
          </View>
          <View style={styles.progressBarBackground}>
            <View style={[styles.progressBarFill, { width: `${progress * 100}%` }]} />
          </View>
        </View>

        <View style={styles.nutrientRow}>
          <View style={[styles.nutrientCard, styles.nutrientShadow]}>
            <Text style={styles.nutrientValue}>58g</Text>
            <Text style={styles.nutrientLabel}>PROTEIN</Text>
            <View style={styles.nutrientLineBackground}>
              <View style={[styles.nutrientLine, { width: '45%', backgroundColor: '#42B983' }]} />
            </View>
          </View>
          <View style={[styles.nutrientCard, styles.nutrientShadow]}>
            <Text style={styles.nutrientValue}>124g</Text>
            <Text style={styles.nutrientLabel}>CARBS</Text>
            <View style={styles.nutrientLineBackground}>
              <View style={[styles.nutrientLine, { width: '70%', backgroundColor: '#FF6C00' }]} />
            </View>
          </View>
          <View style={[styles.nutrientCard, styles.nutrientShadow]}>
            <Text style={styles.nutrientValue}>38g</Text>
            <Text style={styles.nutrientLabel}>FAT</Text>
            <View style={styles.nutrientLineBackground}>
              <View style={[styles.nutrientLine, { width: '30%', backgroundColor: '#5D5D5D' }]} />
            </View>
          </View>
        </View>

        <View style={styles.tipCard}>
          <Text style={styles.tipText}>
            Dal before rice lowers your glycaemic impact significantly today.
          </Text>
        </View>

        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionHeader}>TODAY&apos;S MEALS</Text>
          <View style={styles.snapAction}>
            <Text style={styles.snapActionText}>📷</Text>
            <Text style={styles.snapText}>Snap</Text>
          </View>
        </View>

        {meals.map((meal, index) => (
          <View key={index} style={styles.mealCard}>
            <View style={styles.mealIcon}>
              <Text style={styles.mealIconEmoji}>🍽️</Text>
            </View>
            <View style={styles.mealInfo}>
              <Text style={styles.mealTitle}>{meal.title}</Text>
              <Text style={styles.mealSubtitle}>{meal.subtitle}</Text>
            </View>
            <View style={styles.mealCaloriesBlock}>
              <Text style={styles.mealCalories}>{meal.calories}</Text>
              <Text style={styles.mealCaloriesSuffix}>kcal</Text>
            </View>
          </View>
        ))}

        <View style={styles.quickHeaderRow}>
          <Text style={styles.sectionHeader}>QUICK ADD</Text>
          <Text style={styles.moreText}>More →</Text>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.quickAddRow}>
          {quickAddItems.map((item, index) => (
            <TouchableOpacity key={index} style={styles.quickCard} activeOpacity={0.8}>
              <View style={styles.quickIcon}>
                <Text style={styles.quickIconEmoji}>🥘</Text>
              </View>
              <Text style={styles.quickTitle}>{item.title}</Text>
              <Text style={styles.quickCalories}>{item.calories}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F7F7F7',
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  content: {
    paddingBottom: 32,
  },
  topRow: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greetingSmall: {
    color: '#7A7A7A',
    fontSize: 14,
    marginBottom: 6,
  },
  greetingLarge: {
    fontSize: 36,
    color: '#161616',
    fontWeight: '800',
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#FFF2E6',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FFE3CC',
  },
  avatarInitial: {
    fontSize: 22,
    color: '#FF6C00',
    fontWeight: '700',
  },
  card: {
    marginTop: 24,
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    padding: 24,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
  },
  sectionTitle: {
    color: '#8F8F8F',
    fontSize: 12,
    letterSpacing: 1,
    marginBottom: 14,
  },
  calorieRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  calorieValue: {
    fontSize: 56,
    color: '#FF5A00',
    fontWeight: '900',
    lineHeight: 60,
  },
  calorieTargetBlock: {
    alignItems: 'flex-end',
  },
  calorieTarget: {
    fontSize: 18,
    color: '#6B6B6B',
    fontWeight: '700',
  },
  kcalText: {
    fontSize: 14,
    color: '#B5B5B5',
    marginTop: 4,
  },
  progressBarBackground: {
    height: 10,
    width: '100%',
    backgroundColor: '#F0F0F0',
    borderRadius: 10,
    marginTop: 24,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#FF6C00',
  },
  nutrientRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 18,
  },
  nutrientCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 16,
    marginHorizontal: 4,
  },
  nutrientShadow: {
    shadowColor: '#000',
    shadowOpacity: 0.02,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  nutrientValue: {
    fontSize: 18,
    fontWeight: '800',
    color: '#171717',
  },
  nutrientLabel: {
    fontSize: 11,
    color: '#A3A3A3',
    marginTop: 8,
    letterSpacing: 0.5,
  },
  nutrientLineBackground: {
    height: 6,
    backgroundColor: '#F0F0F0',
    borderRadius: 6,
    marginTop: 14,
    overflow: 'hidden',
  },
  nutrientLine: {
    height: '100%',
    borderRadius: 6,
  },
  tipCard: {
    marginTop: 20,
    backgroundColor: '#E6F7E9',
    borderRadius: 20,
    paddingVertical: 18,
    paddingHorizontal: 20,
  },
  tipText: {
    color: '#1E5D2F',
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '700',
  },
  sectionHeaderRow: {
    marginTop: 26,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionHeader: {
    color: '#8B8B8B',
    fontSize: 12,
    letterSpacing: 1,
    fontWeight: '700',
  },
  snapAction: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  snapActionText: {
    fontSize: 16,
    marginRight: 8,
  },
  snapText: {
    color: '#FF6C00',
    fontWeight: '700',
    fontSize: 14,
  },
  mealCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 18,
    marginTop: 14,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  mealIcon: {
    width: 52,
    height: 52,
    borderRadius: 18,
    backgroundColor: '#FFF2E6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  mealIconEmoji: {
    fontSize: 24,
  },
  mealInfo: {
    flex: 1,
  },
  mealTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#171717',
  },
  mealSubtitle: {
    color: '#8B8B8B',
    fontSize: 13,
    marginTop: 4,
  },
  mealCaloriesBlock: {
    alignItems: 'flex-end',
  },
  mealCalories: {
    color: '#FF6C00',
    fontSize: 22,
    fontWeight: '800',
  },
  mealCaloriesSuffix: {
    color: '#A1A1A1',
    fontSize: 12,
    marginTop: 2,
  },
  quickHeaderRow: {
    marginTop: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  moreText: {
    color: '#FF6C00',
    fontSize: 13,
    fontWeight: '700',
  },
  quickAddRow: {
    paddingTop: 16,
    paddingBottom: 20,
  },
  quickCard: {
    width: 130,
    backgroundColor: '#FFF6ED',
    borderRadius: 24,
    padding: 16,
    marginRight: 14,
    alignItems: 'center',
  },
  quickIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
  },
  quickIconEmoji: {
    fontSize: 24,
  },
  quickTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#171717',
    textAlign: 'center',
    marginBottom: 6,
  },
  quickCalories: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FF6C00',
  },
});

export default Home;
