import React from "react";
import { View, StyleSheet } from "react-native";
import { COLORS, RADIUS, SPACING } from "../../constants/theme";

const NotificationSkeleton = ({ count = 7 }) => {
  return (
    <View>
      {Array.from({ length: count }).map((_, idx) => (
        <View key={idx} style={styles.card}>
          <View style={styles.avatar} />
          <View style={{ flex: 1 }}>
            <View style={styles.lineShort} />
            <View style={styles.lineLong} />
            <View style={styles.lineTime} />
          </View>
        </View>
      ))}
    </View>
  );
};

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
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.brandBlue + "22",
    marginRight: SPACING.md,
  },
  lineShort: {
    width: '60%',
    height: 16,
    backgroundColor: COLORS.border,
    borderRadius: 8,
    marginBottom: 8,
  },
  lineLong: {
    width: '90%',
    height: 14,
    backgroundColor: COLORS.border,
    borderRadius: 8,
    marginBottom: 8,
  },
  lineTime: {
    width: '40%',
    height: 12,
    backgroundColor: COLORS.border,
    borderRadius: 8,
  },
});

export default NotificationSkeleton;
