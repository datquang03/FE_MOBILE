import React, { useEffect, useRef } from "react";
import { View, StyleSheet, Animated } from "react-native";
import { COLORS, RADIUS, SPACING } from "../../constants/theme";

export default function TransactionDetailSkeletonLoading() {
  const shimmer = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(shimmer, {
          toValue: 1,
          duration: 800,
          useNativeDriver: false,
        }),
        Animated.timing(shimmer, {
          toValue: 0,
          duration: 800,
          useNativeDriver: false,
        }),
      ])
    ).start();
  }, []);

  const bg = shimmer.interpolate({
    inputRange: [0, 1],
    outputRange: [COLORS.background, "#E9E9E9"],
  });

  const Skeleton = ({ style }) => (
    <Animated.View style={[styles.skeleton, style, { backgroundColor: bg }]} />
  );

  return (
    <View style={styles.card}>
      {/* Header */}
      <View style={styles.row}>
        <Skeleton style={styles.thumbnail} />
        <View style={{ flex: 1, marginLeft: SPACING.md }}>
          <Skeleton style={{ height: 18, width: "70%", marginBottom: 8 }} />
          <Skeleton style={{ height: 14, width: "50%", marginBottom: 8 }} />
          <Skeleton style={{ height: 16, width: "40%" }} />
        </View>
      </View>

      {/* Section label */}
      <Skeleton style={{ height: 18, width: "50%", marginBottom: SPACING.md }} />

      {/* Info rows */}
      {[1, 2, 3, 4, 5, 6].map((_, i) => (
        <View key={i} style={styles.infoRow}>
          <Skeleton style={{ height: 14, width: "40%" }} />
          <Skeleton style={{ height: 14, width: "45%" }} />
        </View>
      ))}

      {/* Barcode */}
      <Skeleton style={{ height: 44, borderRadius: RADIUS.lg, marginTop: SPACING.md }} />

      {/* QR */}
      <View style={{ alignItems: "center", marginTop: SPACING.lg }}>
        <Skeleton style={{ width: 120, height: 120, borderRadius: 12 }} />
        <Skeleton style={{ height: 14, width: 120, marginTop: 8 }} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    margin: SPACING.lg,
    padding: SPACING.xl,
    borderRadius: RADIUS.xl,
    backgroundColor: COLORS.surface,
    flex: 1,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: SPACING.lg,
  },
  thumbnail: {
    width: 92,
    height: 92,
    borderRadius: RADIUS.lg,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: SPACING.md,
  },
  skeleton: {
    backgroundColor: COLORS.background,
    borderRadius: 6,
  },
});
