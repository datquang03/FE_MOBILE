import React from "react";
import { View, StyleSheet } from "react-native";
import { COLORS, RADIUS, SPACING } from "../../constants/theme";

const CommentSkeleton = ({ count = 4 }) => {
  return (
    <View style={{ padding: SPACING.lg }}>
      {Array.from({ length: count }).map((_, idx) => (
        <View key={idx} style={styles.row}>
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
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.brandBlue + "22",
    marginRight: SPACING.md,
  },
  lineShort: {
    width: '60%',
    height: 14,
    backgroundColor: COLORS.border,
    borderRadius: 8,
    marginBottom: 8,
  },
  lineLong: {
    width: '90%',
    height: 12,
    backgroundColor: COLORS.border,
    borderRadius: 8,
    marginBottom: 8,
  },
  lineTime: {
    width: '40%',
    height: 10,
    backgroundColor: COLORS.border,
    borderRadius: 8,
  },
});

export default CommentSkeleton;
