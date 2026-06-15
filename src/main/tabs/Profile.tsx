import React, { useState, useEffect } from 'react';
import { 
  SafeAreaView, 
  ScrollView, 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Dimensions 
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Colors } from '../../theme/Themes';
import { DatabaseService, getOrCreateDeviceId } from '../../lib/Supabase';
import { UserProfile } from '../../types/database.types';

const { width } = Dimensions.get('window');

const Profile = () => {
  // State
  const [deviceId, setDeviceId] = useState<string>('');
  const [profile, setProfile] = useState<UserProfile>({
    device_id: '',
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

  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

  // Load profile data on mount
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const dId = await getOrCreateDeviceId();
        setDeviceId(dId);
        
        const userProfile = await DatabaseService.getUserProfile(dId);
        // Ensure values match the image design by default if empty
        if (!userProfile.display_name) {
          userProfile.display_name = 'Vivek';
          userProfile.age = 40;
          userProfile.gender = 'male';
          userProfile.height_cm = 180;
          userProfile.weight_kg = 80;
          userProfile.target_weight_kg = 72;
          userProfile.activity_level = 'moderate';
          userProfile.primary_goal = 'weight_loss,high_protein';
          userProfile.has_diabetes = true;
        }
        setProfile(userProfile);
      } catch (err) {
        console.error('Error loading profile:', err);
      }
    };

    loadProfile();
  }, []);

  // Compute BMI dynamically
  const heightInMeters = (profile.height_cm || 180) / 100;
  const computedBmi = heightInMeters > 0 
    ? (profile.weight_kg || 80) / (heightInMeters * heightInMeters)
    : 24.7;
  const bmiFormatted = computedBmi.toFixed(1);

  // Compute weight remaining to target
  const weightRemaining = Math.max((profile.weight_kg || 80) - (profile.target_weight_kg || 72), 0);

  // Helper to toggle goals
  const toggleGoal = (goalKey: string) => {
    const goals = profile.primary_goal.split(',').filter(Boolean);
    let updatedGoals: string[];

    if (goals.includes(goalKey)) {
      updatedGoals = goals.filter(g => g !== goalKey);
    } else {
      updatedGoals = [...goals, goalKey];
    }

    setProfile({
      ...profile,
      primary_goal: updatedGoals.join(',')
    });
    setSaveStatus('idle');
  };

  const isGoalActive = (goalKey: string) => {
    return profile.primary_goal.split(',').includes(goalKey);
  };

  // Helper to toggle conditions
  const toggleCondition = (conditionField: 'has_bp' | 'has_diabetes' | 'has_thyroid' | 'has_cholesterol') => {
    setProfile({
      ...profile,
      [conditionField]: !profile[conditionField]
    });
    setSaveStatus('idle');
  };

  // Save profile changes
  const handleSave = async () => {
    setSaveStatus('saving');
    try {
      await DatabaseService.saveUserProfile(profile);
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } catch (e) {
      console.error('Failed to save profile:', e);
      setSaveStatus('idle');
    }
  };

  const getFormatActivity = (level: string) => {
    if (level === 'moderate') return 'Moderate activity';
    if (level === 'sedentary') return 'Sedentary activity';
    if (level === 'light') return 'Light activity';
    if (level === 'active') return 'Active lifestyle';
    if (level === 'very_active') return 'Very active lifestyle';
    return 'Moderate activity';
  };



    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#F7F7F7",
        }}
      >
        <Text style={{ fontSize: 18, color: "#303030" }}>Profile Screen</Text>
      </View>
    );
  

  // return (
  //   <SafeAreaView style={styles.safeArea}>
  //     <StatusBar style="dark" />
      
  //     <View style={styles.header}>
  //       <Text style={styles.headerTitle}>Profile</Text>
  //     </View>

  //     <ScrollView 
  //       style={styles.scrollView} 
  //       contentContainerStyle={styles.scrollContent} 
  //       showsVerticalScrollIndicator={false}
  //     >
  //       {/* --- MAIN PROFILE & BMI CARD --- */}
  //       <View style={styles.mainCard}>
          
  //         {/* Avatar Row */}
  //         <View style={styles.avatarRow}>
  //           <View style={styles.avatarBorder}>
  //             <View style={styles.avatarBg}>
  //               <Text style={styles.avatarEmoji}>👦</Text>
  //             </View>
  //           </View>
  //           <View style={styles.userInfo}>
  //             <Text style={styles.userName}>{profile.display_name}</Text>
  //             <Text style={styles.userDetail}>
  //               {profile.age} yrs · {profile.gender ? (profile.gender.charAt(0).toUpperCase() + profile.gender.slice(1)) : 'Male'} · {getFormatActivity(profile.activity_level || 'moderate')}
  //             </Text>
  //           </View>
  //           <TouchableOpacity style={styles.editBtn} activeOpacity={0.7}>
  //             <Text style={styles.editBtnText}>Edit</Text>
  //           </TouchableOpacity>
  //         </View>

  //         {/* Separator line */}
  //         <View style={styles.divider} />

  //         {/* BMI Info */}
  //         <View style={styles.bmiSection}>
  //           <View style={styles.bmiHeaderRow}>
  //             <Text style={styles.bmiLabel}>BMI · Healthy range</Text>
  //             <Text style={styles.bmiValue}>{bmiFormatted}</Text>
  //           </View>

  //           {/* BMI Track Progress */}
  //           <View style={styles.bmiTrack}>
  //             <View style={styles.bmiFill} />
  //           </View>

  //           {/* BMI Subtext */}
  //           <Text style={styles.bmiSubtext}>
  //             Target {profile.target_weight_kg}kg · {weightRemaining}kg remaining
  //           </Text>
  //         </View>
  //       </View>

  //       {/* --- GOALS SECTION --- */}
  //       <View style={styles.sectionContainer}>
  //         <Text style={styles.sectionHeaderTitle}>GOALS</Text>
          
  //         <View style={styles.goalsGrid}>
            
  //           {/* Weight Loss Goal */}
  //           <TouchableOpacity 
  //             style={[styles.goalCard, isGoalActive('weight_loss') ? styles.goalCardActive : styles.goalCardInactive]}
  //             activeOpacity={0.8}
  //             onPress={() => toggleGoal('weight_loss')}
  //           >
  //             <View style={styles.goalCardContent}>
  //               <Text style={styles.goalEmoji}>⚖️</Text>
  //               <Text style={[styles.goalText, isGoalActive('weight_loss') ? styles.goalTextActive : styles.goalTextInactive]}>
  //                 Weight Loss
  //               </Text>
  //             </View>
  //             {isGoalActive('weight_loss') && (
  //               <View style={styles.checkmarkWrap}>
  //                 <Text style={styles.checkmarkSymbol}>✓</Text>
  //               </View>
  //             )}
  //           </TouchableOpacity>

  //           {/* Muscle Gain Goal */}
  //           <TouchableOpacity 
  //             style={[styles.goalCard, isGoalActive('muscle_gain') ? styles.goalCardActive : styles.goalCardInactive]}
  //             activeOpacity={0.8}
  //             onPress={() => toggleGoal('muscle_gain')}
  //           >
  //             <View style={styles.goalCardContent}>
  //               <Text style={styles.goalEmoji}>💪</Text>
  //               <Text style={[styles.goalText, isGoalActive('muscle_gain') ? styles.goalTextActive : styles.goalTextInactive]}>
  //                 Muscle Gain
  //               </Text>
  //             </View>
  //             {isGoalActive('muscle_gain') && (
  //               <View style={styles.checkmarkWrap}>
  //                 <Text style={styles.checkmarkSymbol}>✓</Text>
  //               </View>
  //             )}
  //           </TouchableOpacity>

  //           {/* High Protein Goal */}
  //           <TouchableOpacity 
  //             style={[styles.goalCard, isGoalActive('high_protein') ? styles.goalCardActive : styles.goalCardInactive]}
  //             activeOpacity={0.8}
  //             onPress={() => toggleGoal('high_protein')}
  //           >
  //             <View style={styles.goalCardContent}>
  //               <Text style={styles.goalEmoji}>🥩</Text>
  //               <Text style={[styles.goalText, isGoalActive('high_protein') ? styles.goalTextActive : styles.goalTextInactive]}>
  //                 High Protein
  //               </Text>
  //             </View>
  //             {isGoalActive('high_protein') && (
  //               <View style={styles.checkmarkWrap}>
  //                 <Text style={styles.checkmarkSymbol}>✓</Text>
  //               </View>
  //             )}
  //           </TouchableOpacity>

  //           {/* Heart Health Goal */}
  //           <TouchableOpacity 
  //             style={[styles.goalCard, isGoalActive('heart_health') ? styles.goalCardActive : styles.goalCardInactive]}
  //             activeOpacity={0.8}
  //             onPress={() => toggleGoal('heart_health')}
  //           >
  //             <View style={styles.goalCardContent}>
  //               <Text style={styles.goalEmoji}>❤️</Text>
  //               <Text style={[styles.goalText, isGoalActive('heart_health') ? styles.goalTextActive : styles.goalTextInactive]}>
  //                 Heart Health
  //               </Text>
  //             </View>
  //             {isGoalActive('heart_health') && (
  //               <View style={styles.checkmarkWrap}>
  //                 <Text style={styles.checkmarkSymbol}>✓</Text>
  //               </View>
  //             )}
  //           </TouchableOpacity>

  //         </View>
  //       </View>

  //       {/* --- CONDITIONS SECTION --- */}
  //       <View style={styles.sectionContainer}>
  //         <Text style={styles.sectionHeaderTitle}>CONDITIONS</Text>
          
  //         <View style={styles.chipsRow}>
            
  //           {/* High BP */}
  //           <TouchableOpacity 
  //             style={[styles.chip, profile.has_bp ? styles.chipActive : styles.chipInactive]}
  //             activeOpacity={0.7}
  //             onPress={() => toggleCondition('has_bp')}
  //           >
  //             <Text style={[styles.chipText, profile.has_bp ? styles.chipTextActive : styles.chipTextInactive]}>
  //               🫀 High BP{profile.has_bp ? ' ✓' : ''}
  //             </Text>
  //           </TouchableOpacity>

  //           {/* Diabetes */}
  //           <TouchableOpacity 
  //             style={[styles.chip, profile.has_diabetes ? styles.chipActive : styles.chipInactive]}
  //             activeOpacity={0.7}
  //             onPress={() => toggleCondition('has_diabetes')}
  //           >
  //             <Text style={[styles.chipText, profile.has_diabetes ? styles.chipTextActive : styles.chipTextInactive]}>
  //               🍬 Diabetes{profile.has_diabetes ? ' ✓' : ''}
  //             </Text>
  //           </TouchableOpacity>

  //           {/* Thyroid */}
  //           <TouchableOpacity 
  //             style={[styles.chip, profile.has_thyroid ? styles.chipActive : styles.chipInactive]}
  //             activeOpacity={0.7}
  //             onPress={() => toggleCondition('has_thyroid')}
  //           >
  //             <Text style={[styles.chipText, profile.has_thyroid ? styles.chipTextActive : styles.chipTextInactive]}>
  //               🦋 Thyroid{profile.has_thyroid ? ' ✓' : ''}
  //             </Text>
  //           </TouchableOpacity>

  //           {/* Cholesterol */}
  //           <TouchableOpacity 
  //             style={[styles.chip, profile.has_cholesterol ? styles.chipActive : styles.chipInactive]}
  //             activeOpacity={0.7}
  //             onPress={() => toggleCondition('has_cholesterol')}
  //           >
  //             <Text style={[styles.chipText, profile.has_cholesterol ? styles.chipTextActive : styles.chipTextInactive]}>
  //               🩸 Cholesterol{profile.has_cholesterol ? ' ✓' : ''}
  //             </Text>
  //           </TouchableOpacity>

  //         </View>
  //       </View>

  //       {/* --- SAVE STATUS BANNER --- */}
  //       {saveStatus === 'saved' && (
  //         <View style={styles.successBanner}>
  //           <Text style={styles.successText}>Profile saved successfully! 🎉</Text>
  //         </View>
  //       )}

  //       {/* --- SAVE BUTTON --- */}
  //       <TouchableOpacity 
  //         style={styles.saveBtn} 
  //         activeOpacity={0.88}
  //         onPress={handleSave}
  //         disabled={saveStatus === 'saving'}
  //       >
  //         <Text style={styles.saveBtnText}>
  //           {saveStatus === 'saving' ? 'Saving...' : 'Save profile'}
  //         </Text>
  //       </TouchableOpacity>

  //     </ScrollView>
  //   </SafeAreaView>
  // );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF', // Header safe area white
  },
  header: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 16,
  },
  headerTitle: {
    fontFamily: 'PlusJakartaSans-Bold',
    fontSize: 34,
    color: '#1C1C1E',
  },
  scrollView: {
    flex: 1,
    backgroundColor: '#F2F4F7', // Matches bottom gray layout background
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 40,
  },
  // --- USER PROFILE & BMI CARD ---
  mainCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
    marginBottom: 28,
  },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarBorder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 1.5,
    borderColor: '#FFDCC8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarBg: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFF2EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarEmoji: {
    fontSize: 26,
  },
  userInfo: {
    flex: 1,
    marginLeft: 14,
  },
  userName: {
    fontFamily: 'PlusJakartaSans-Bold',
    fontSize: 18,
    color: '#1C1C1E',
    marginBottom: 3,
  },
  userDetail: {
    fontFamily: 'PlusJakartaSans-Medium',
    fontSize: 13,
    color: '#8E8E93',
  },
  editBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  editBtnText: {
    fontFamily: 'PlusJakartaSans-Bold',
    fontSize: 14.5,
    color: Colors.orange,
  },
  divider: {
    height: 1,
    backgroundColor: '#F2F2F7',
    marginVertical: 18,
  },
  bmiSection: {},
  bmiHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  bmiLabel: {
    fontFamily: 'PlusJakartaSans-Bold',
    fontSize: 13,
    color: '#AEAEB2',
  },
  bmiValue: {
    fontFamily: 'PlusJakartaSans-Bold',
    fontSize: 18,
    color: Colors.green,
  },
  bmiTrack: {
    height: 8,
    backgroundColor: '#F2F2F7',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 10,
  },
  bmiFill: {
    height: '100%',
    width: '46%', // Representing healthy range center visual
    backgroundColor: Colors.green,
    borderRadius: 4,
  },
  bmiSubtext: {
    fontFamily: 'PlusJakartaSans-Medium',
    fontSize: 12.5,
    color: '#8E8E93',
  },
  // --- SECTIONS ---
  sectionContainer: {
    marginBottom: 28,
  },
  sectionHeaderTitle: {
    fontFamily: 'PlusJakartaSans-Bold',
    fontSize: 11.5,
    color: '#8E8E93',
    letterSpacing: 0.8,
    marginBottom: 12,
  },
  // --- GOALS GRID ---
  goalsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  goalCard: {
    width: (width - 54) / 2,
    height: 86,
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOpacity: 0.02,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  goalCardActive: {
    backgroundColor: Colors.orange,
  },
  goalCardInactive: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#C5C5C9',
    borderStyle: 'dashed',
  },
  goalCardContent: {
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  goalEmoji: {
    fontSize: 22,
    marginBottom: 6,
  },
  goalText: {
    fontSize: 14.5,
    fontWeight: '700',
  },
  goalTextActive: {
    fontFamily: 'PlusJakartaSans-Bold',
    color: '#FFFFFF',
  },
  goalTextInactive: {
    fontFamily: 'PlusJakartaSans-Bold',
    color: '#636366',
  },
  checkmarkWrap: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 12,
    right: 12,
  },
  checkmarkSymbol: {
    fontSize: 12,
    fontWeight: '900',
    color: Colors.orange,
  },
  // --- CONDITION CHIPS ---
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  chip: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 10,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.02,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1.5,
  },
  chipActive: {
    backgroundColor: Colors.orange,
  },
  chipInactive: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  chipText: {
    fontSize: 14,
    fontWeight: '700',
  },
  chipTextActive: {
    fontFamily: 'PlusJakartaSans-Bold',
    color: '#FFFFFF',
  },
  chipTextInactive: {
    fontFamily: 'PlusJakartaSans-Bold',
    color: '#636366',
  },
  // --- BANNER ---
  successBanner: {
    backgroundColor: '#E6F9EE',
    borderWidth: 1,
    borderColor: '#CBEFDB',
    borderRadius: 14,
    padding: 12,
    alignItems: 'center',
    marginBottom: 20,
  },
  successText: {
    fontFamily: 'PlusJakartaSans-SemiBold',
    fontSize: 14,
    color: '#1E5D2F',
  },
  // --- SAVE BUTTON ---
  saveBtn: {
    width: '100%',
    backgroundColor: Colors.orange,
    borderRadius: 28,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.orange,
    shadowOpacity: 0.2,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
    marginTop: 10,
  },
  saveBtnText: {
    fontFamily: 'PlusJakartaSans-Bold',
    color: '#FFFFFF',
    fontSize: 16.5,
    fontWeight: '800',
  },
});

export default Profile;
