import React from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import { COLORS, SPACING, RADIUS } from "../../constants/theme";

const { width } = Dimensions.get("window");

const Box = ({ style }) => <View style={[styles.box, style]} />;

export default function SetDesignDetailSkeleton() {
  return (
    <View>
      {/* Hero */}
      <Box style={styles.hero} />

      {/* Sheet */}
      <View style={styles.sheet}>
        <Box style={{ width: "70%", height: 26, marginBottom: 10 }} />
        <Box style={{ width: "40%", height: 18, marginBottom: 16 }} />

        <Box style={{ width: "60%", height: 16, marginBottom: 10 }} />
        <Box style={{ width: "50%", height: 16, marginBottom: 10 }} />
        <Box style={{ width: "70%", height: 16, marginBottom: 16 }} />

        <Box style={{ width: "100%", height: 14, marginBottom: 8 }} />
        <Box style={{ width: "100%", height: 14, marginBottom: 8 }} />
        <Box style={{ width: "80%", height: 14 }} />
      </View>

      {/* Bottom bar */}
      <View style={styles.bottomBar}>
        <Box style={{ width: "100%", height: 52, borderRadius: 26 }} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    backgroundColor: COLORS.border,
    borderRadius: 8,
  },
  hero: {
    width,
    height: 280,
  },
  sheet: {
    marginTop: -40,
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: RADIUS.xl,
    borderTopRightRadius: RADIUS.xl,
    padding: SPACING.xl,
  },
  bottomBar: {
    padding: SPACING.lg,
    backgroundColor: COLORS.surface,
  },
});
