import React from "react";
import { View, StyleSheet, Dimensions, Animated } from "react-native";
import { COLORS, SPACING, RADIUS } from "../../constants/theme";

const { width } = Dimensions.get("window");

const AnimatedBox = ({ style }) => {
  const shimmerAnim = React.useRef(new Animated.Value(0)).current;
  React.useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnim, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.timing(shimmerAnim, {
          toValue: 0,
          duration: 1200,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [shimmerAnim]);
  const shimmerStyle = {
    opacity: shimmerAnim.interpolate({ inputRange: [0, 1], outputRange: [0.5, 1] }),
  };
  return <Animated.View style={[styles.box, shimmerStyle, style]} />;
};

export default function StudioDetailSkeleton() {
  return (
    <View>
      {/* Image slider skeleton */}
      <AnimatedBox style={styles.hero} />

      {/* Sheet */}
      <View style={styles.sheet}>
        <AnimatedBox style={{ width: "70%", height: 26, marginBottom: 8 }} />
        <AnimatedBox style={{ width: "40%", height: 16, marginBottom: 16 }} />

        {/* Info rows */}
        <AnimatedBox style={{ width: "90%", height: 16, marginBottom: 10 }} />
        <AnimatedBox style={{ width: "60%", height: 16, marginBottom: 16 }} />

        {/* Description */}
        <AnimatedBox style={{ width: "100%", height: 14, marginBottom: 8 }} />
        <AnimatedBox style={{ width: "100%", height: 14, marginBottom: 8 }} />
        <AnimatedBox style={{ width: "80%", height: 14, marginBottom: 20 }} />

        {/* Comments title */}
        <AnimatedBox style={{ width: 120, height: 20, marginBottom: 16 }} />

        {/* Comment skeletons */}
        {[1, 2].map((i) => (
          <View key={i} style={styles.commentRow}>
            <AnimatedBox style={styles.avatar} />
            <View style={{ flex: 1 }}>
              <AnimatedBox style={{ width: "40%", height: 14, marginBottom: 6 }} />
              <AnimatedBox style={{ width: "100%", height: 14, marginBottom: 6 }} />
              <AnimatedBox style={{ width: "60%", height: 14 }} />
            </View>
          </View>
        ))}
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
  commentRow: {
    flexDirection: "row",
    marginBottom: 16,
    gap: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
});
