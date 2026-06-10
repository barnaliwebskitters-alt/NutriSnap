import React from "react";
import { SafeAreaView, ScrollView, View, Text, StyleSheet } from "react-native";
import { Colors } from "../../theme/Themes";

const Progress = () => {
  const calories = 1140;
  const caloriesTarget = 1800;
  const caloriesProgress = Math.min(calories / caloriesTarget, 1);

  const protein = 58;
  const proteinTarget = 80;
  const proteinProgress = Math.min(protein / proteinTarget, 1);

  const macros = [
    { key: "Carbs", value: 124, target: 200, color: Colors.orange },
    { key: "Protein", value: 58, target: 80, color: Colors.green },
    { key: "Fat", value: 38, target: 60, color: "#5D5D5D" },
    { key: "Fibre", value: 14, target: 25, color: "#2BAF8F" },
  ];

  const week = [0.75, 0.95, 0.6, 0.9, 0.7, 0.45, 0.85];

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.dateSmall}>Friday, 6 Jun</Text>
            <Text style={styles.title}>Progress</Text>
          </View>
        </View>

        <View style={styles.summaryRow}>
          <View style={[styles.summaryCard, styles.calorieCard]}>
            <Text style={styles.summaryLabel}>CALORIES</Text>
            <Text style={styles.summaryValue}>{calories.toLocaleString()}</Text>
            <Text style={styles.summarySub}>
              of {caloriesTarget.toLocaleString()} kcal
            </Text>
            <View style={styles.smallBarBg}>
              <View
                style={[
                  styles.smallBarFill,
                  {
                    width: `${caloriesProgress * 100}%`,
                    backgroundColor: Colors.orange,
                  },
                ]}
              />
            </View>
          </View>

          <View style={[styles.summaryCard, styles.proteinCard]}>
            <Text style={styles.summaryLabelGreen}>PROTEIN</Text>
            <Text style={styles.summaryValue}>58g</Text>
            <Text style={styles.summarySub}>of 80g goal</Text>
            <View style={styles.smallBarBg}>
              <View
                style={[
                  styles.smallBarFill,
                  {
                    width: `${proteinProgress * 100}%`,
                    backgroundColor: Colors.green,
                  },
                ]}
              />
            </View>
          </View>
        </View>

        <View style={styles.weekCard}>
          <View style={styles.weekHeader}>
            <Text style={styles.weekTitle}>This week</Text>
            <Text style={styles.weekAvg}>avg 1,624 kcal</Text>
          </View>
          <View style={styles.weekBarsRow}>
            {week.map((w, i) => (
              <View key={i} style={styles.weekBarWrap}>
                <View
                  style={[
                    styles.weekBar,
                    {
                      height: `${Math.max(w, 0.08) * 100}%`,
                      backgroundColor: i === 6 ? Colors.orange : "#F7BFA6",
                    },
                  ]}
                />
                <Text style={styles.weekDay}>
                  {["M", "T", "W", "T", "F", "S", "S"][i]}
                </Text>
              </View>
            ))}
          </View>
          <View style={styles.weekLegendRow}>
            <View style={styles.legendItem}>
              <View
                style={[styles.legendSwatch, { backgroundColor: "#FFE6D9" }]}
              />
              <Text style={styles.legendLabel}>Under goal</Text>
            </View>
            <View style={styles.legendItem}>
              <View
                style={[styles.legendSwatch, { backgroundColor: "#FFC9AA" }]}
              />
              <Text style={styles.legendLabel}>Over goal</Text>
            </View>
          </View>
        </View>

        <View style={styles.macrosCard}>
          <Text style={styles.macrosTitle}>Today's macros</Text>
          {macros.map((m) => {
            const pct = Math.min(m.value / m.target, 1);
            return (
              <View key={m.key} style={styles.macroRow}>
                <Text style={styles.macroLabel}>{m.key}</Text>
                <Text style={styles.macroValue}>
                  {m.value} / {m.target}g
                </Text>
                <View style={styles.macroBarBg}>
                  <View
                    style={[
                      styles.macroBarFill,
                      { width: `${pct * 100}%`, backgroundColor: m.color },
                    ]}
                  />
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.surface },
  container: { padding: 18, paddingBottom: 40 },
  headerRow: { marginBottom: 8 },
  dateSmall: { color: Colors.muted, fontSize: 13, marginBottom: 6 },
  title: { fontSize: 34, fontWeight: "700", color: Colors.text },

  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
  },
  summaryCard: {
    flex: 1,
    borderRadius: 18,
    padding: 18,
    marginRight: 12,
    backgroundColor: Colors.white,
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  calorieCard: {
    backgroundColor: Colors.orangePale,
    borderColor: Colors.orangeMid,
    borderWidth: 1,
  },
  proteinCard: {
    backgroundColor: Colors.greenPale,
    borderColor: Colors.surface2,
    borderWidth: 1,
    marginRight: 0,
  },
  summaryLabel: {
    color: Colors.orange,
    fontSize: 12,
    fontWeight: "700",
    marginBottom: 8,
  },
  summaryLabelGreen: {
    color: Colors.green,
    fontSize: 12,
    fontWeight: "700",
    marginBottom: 8,
  },
  summaryValue: {
    fontSize: 36,
    fontWeight: "800",
    color: Colors.text,
    marginBottom: 4,
  },
  summarySub: { color: Colors.text2, fontSize: 13, marginBottom: 10 },
  smallBarBg: {
    height: 8,
    backgroundColor: Colors.surface2,
    borderRadius: 8,
    overflow: "hidden",
  },
  smallBarFill: { height: "100%" },

  weekCard: {
    marginTop: 18,
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  weekHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  weekTitle: { fontSize: 18, fontWeight: "700", color: Colors.text },
  weekAvg: { color: Colors.text2, fontSize: 13 },
  weekBarsRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    height: 80,
    paddingHorizontal: 6,
  },
  weekBarWrap: { alignItems: "center", width: 28 },
  weekBar: { width: 22, borderRadius: 6 },
  weekDay: { marginTop: 8, color: Colors.muted, fontSize: 12 },
  weekLegendRow: { flexDirection: "row", marginTop: 12, alignItems: "center" },
  legendItem: { flexDirection: "row", alignItems: "center", marginRight: 16 },
  legendSwatch: { width: 16, height: 16, borderRadius: 4, marginRight: 8 },
  legendLabel: { color: Colors.text2, fontSize: 13 },

  macrosCard: {
    marginTop: 18,
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  macrosTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.text,
    marginBottom: 12,
  },
  macroRow: { marginBottom: 14 },
  macroLabel: { color: Colors.text, fontSize: 15, fontWeight: "600" },
  macroValue: {
    position: "absolute",
    right: 18,
    top: 18,
    color: Colors.text,
    fontWeight: "700",
  },
  macroBarBg: {
    height: 10,
    backgroundColor: Colors.surface2,
    borderRadius: 10,
    marginTop: 10,
    overflow: "hidden",
  },
  macroBarFill: { height: "100%" },
});

export default Progress;
