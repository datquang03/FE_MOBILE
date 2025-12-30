import React from "react";
import { SafeAreaView, View, Text, StyleSheet, FlatList } from "react-native";
import HeaderBar from "../../components/ui/HeaderBar";
import { COLORS, RADIUS, SPACING, TYPOGRAPHY } from "../../constants/theme";
import { reviews } from "../../constants/mockData";

export default function ReviewsScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.safe}>
      <HeaderBar title="Đánh giá" onBack={() => navigation.goBack?.()} rightIcon="filter" />
      <View style={styles.summary}>
        <View>
          <Text style={styles.score}>4.4</Text>
          <Text style={styles.caption}>Dựa trên 532 đánh giá</Text>
        </View>
        <View style={{ flex: 1, marginLeft: SPACING.lg }}>
          {[5, 4, 3, 2, 1].map((star) => (
            <View key={star} style={styles.progressRow}>
              <Text style={styles.starLabel}>{star}</Text>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: `${star * 15}%` }]} />
              </View>
            </View>
          ))}
        </View>
      </View>
      <FlatList
        data={reviews}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: SPACING.lg }}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.avatar} />
            <View style={{ flex: 1, marginLeft: SPACING.md }}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.comment}>{item.comment}</Text>
            </View>
            <Text style={styles.rating}>{item.rating}</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  summary: {
    flexDirection: "row",
    padding: SPACING.lg,
  },
  score: {
    fontSize: 42,
    fontWeight: "700",
    color: COLORS.textDark,
  },
  caption: {
    color: COLORS.textMuted,
  },
  progressRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: SPACING.xs,
  },
  starLabel: {
    width: 20,
    textAlign: "center",
    color: COLORS.textMuted,
  },
  progressBar: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.border,
    marginLeft: SPACING.sm,
  },
  progressFill: {
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.brandBlue,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: SPACING.md,
    marginBottom: SPACING.md,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.background,
  },
  name: {
    fontWeight: "600",
    color: COLORS.textDark,
  },
  comment: {
    color: COLORS.textMuted,
  },
  rating: {
    fontWeight: "700",
    color: COLORS.textDark,
  },
});

