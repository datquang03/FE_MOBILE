import React from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { COLORS, SPACING } from "../../constants/theme";

/**
 * Inline loading row, hiển thị text tùy chỉnh.
 * Usage: <InlineLoading text="Đang tải dữ liệu..." />
 */
export default function InlineLoading({ text = "Đang tải..." }) {
  return (
    <View style={styles.inline}>
      <ActivityIndicator size="small" color={COLORS.brandBlue} />
      {text ? <Text style={styles.inlineText}>{text}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  inline: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
    paddingVertical: SPACING.sm,
  },
  inlineText: {
    color: COLORS.textDark,
    fontWeight: "500",
  },
});


