import React from "react";
import { View, StyleSheet } from "react-native";
import { COLORS, RADIUS, SPACING } from "../../constants/theme";

export default function TransactionSkeleton() {
  return (
    <View style={{ padding: SPACING.lg }}>
      {[...Array(4)].map((_, idx) => (
        <View key={idx} style={styles.card}>
          <View style={styles.thumbnail} />
          <View style={{ flex: 1, marginLeft: SPACING.md }}>
            <View style={styles.skeletonLine} />
            <View style={[styles.skeletonLine, { width: '60%', marginTop: 8 }]} />
            <View style={[styles.skeletonLine, { width: '40%', marginTop: 8 }]} />
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    alignItems: "center",
    opacity: 0.7,
  },
  thumbnail: {
    width: 68,
    height: 68,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.border,
  },
  skeletonLine: {
    height: 16,
    borderRadius: 8,
    backgroundColor: COLORS.border,
    width: '80%',
  },
});
