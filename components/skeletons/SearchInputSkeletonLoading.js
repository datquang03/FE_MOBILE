import React, { useRef, useEffect } from "react";
import { View, StyleSheet, Animated } from "react-native";
import { COLORS, RADIUS, SPACING } from "../../constants/theme";

const SearchInputSkeletonLoading = () => {
  const shimmer = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(shimmer, {
          toValue: 1,
          duration: 900,
          useNativeDriver: true,
        }),
        Animated.timing(shimmer, {
          toValue: 0,
          duration: 900,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const translateX = shimmer.interpolate({
    inputRange: [0, 1],
    outputRange: [-120, 120],
  });

  const Shimmer = () => (
    <Animated.View
      style={[
        styles.shimmer,
        {
          transform: [{ translateX }],
        },
      ]}
    />
  );

  return (
    <View>
      {/* Search input skeleton */}
      <View style={styles.searchBox}>
        <View style={styles.icon} />
        <View style={styles.input}>
          <Shimmer />
        </View>
      </View>

      {/* Result skeleton lines */}
      {[1, 2, 3].map((_, index) => (
        <View key={index} style={styles.resultRow}>
          <View style={styles.thumb} />
          <View style={styles.textWrap}>
            <View style={styles.lineShort}>
              <Shimmer />
            </View>
            <View style={styles.lineLong}>
              <Shimmer />
            </View>
          </View>
        </View>
      ))}
    </View>
  );
};

export default SearchInputSkeletonLoading;

const styles = StyleSheet.create({
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    height: 48,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.gray100,
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.lg,
    overflow: "hidden",
  },
  icon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: COLORS.gray200,
    marginRight: SPACING.sm,
  },
  input: {
    flex: 1,
    height: 14,
    backgroundColor: COLORS.gray200,
    borderRadius: 6,
    overflow: "hidden",
  },
  shimmer: {
    position: "absolute",
    width: 120,
    height: "100%",
    backgroundColor: "rgba(255,255,255,0.35)",
  },

  resultRow: {
    flexDirection: "row",
    marginBottom: SPACING.md,
  },
  thumb: {
    width: 56,
    height: 56,
    borderRadius: RADIUS.sm,
    backgroundColor: COLORS.gray200,
  },
  textWrap: {
    flex: 1,
    marginLeft: SPACING.md,
    justifyContent: "center",
  },
  lineShort: {
    width: "60%",
    height: 12,
    backgroundColor: COLORS.gray200,
    borderRadius: 6,
    marginBottom: 8,
    overflow: "hidden",
  },
  lineLong: {
    width: "85%",
    height: 12,
    backgroundColor: COLORS.gray200,
    borderRadius: 6,
    overflow: "hidden",
  },
});
