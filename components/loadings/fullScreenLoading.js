import React, { useEffect, useRef } from "react";
import {
  ActivityIndicator,
  Animated,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { COLORS, RADIUS, SPACING } from "../../constants/theme";

/**
 * Full-screen loading overlay, reusable across screens.
 * - Show only when `loading` = true.
 * - Fade/scale animation + ActivityIndicator spinner.
 */
export default function FullScreenLoading({ loading, text = "Đang tải..." }) {
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.95)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: loading ? 1 : 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.spring(scale, {
        toValue: loading ? 1 : 0.95,
        friction: 6,
        useNativeDriver: true,
      }),
    ]).start();
  }, [loading, opacity, scale]);

  // Keep component mounted to allow fade-out; block touches only when visible.
  return (
    <Animated.View
      pointerEvents={loading ? "auto" : "none"}
      style={[styles.overlay, { opacity }]}
    >
      <Animated.View style={[styles.box, { transform: [{ scale }] }]}>
        <ActivityIndicator size="large" color={COLORS.brandBlue} />
        {text ? <Text style={styles.text}>{text}</Text> : null}
      </Animated.View>
    </Animated.View>
  );
}

/**
 * Inline loading row (non-overlay), reuse where needed.
 * Usage: <InlineLoading text="Đang tải dữ liệu..." />
 */
export const InlineLoading = ({ text = "Đang tải..." }) => (
  <View style={styles.inline}>
    <ActivityIndicator size="small" color={COLORS.brandBlue} />
    {text ? <Text style={styles.inlineText}>{text}</Text> : null}
  </View>
);

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.35)",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 999,
  },
  box: {
    backgroundColor: COLORS.surface,
    padding: SPACING.xl,
    borderRadius: RADIUS.lg,
    alignItems: "center",
    minWidth: 160,
  },
  text: {
    marginTop: SPACING.md,
    color: COLORS.textDark,
    fontWeight: "600",
    textAlign: "center",
  },
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
