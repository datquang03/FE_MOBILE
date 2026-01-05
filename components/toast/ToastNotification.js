// src/components/toast/ToastNotification.js (React Native)
import React, { useEffect, useRef } from "react";
import {
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { COLORS, RADIUS, SPACING, TYPOGRAPHY } from "../../constants/theme";

const BG = {
  success: { bg: "#16a34a", border: "#22c55e" },
  error: { bg: "#dc2626", border: "#ef4444" },
  warning: { bg: "#d97706", border: "#f59e0b" },
  info: { bg: "#2563eb", border: "#3b82f6" },
};

/**
 * ToastNotification for mobile.
 * Props:
 * - type: "success" | "error" | "warning" | "info"
 * - message: string | object (có thể là object trả về từ BE)
 * - suggestion?: string
 * - onClose?: () => void
 * - duration?: number (ms)
 */
export default function ToastNotification({
  type = "success",
  message,
  suggestion = null,
  onClose,
  duration = 4000,
}) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(-24)).current;
  const colors = BG[type] || BG.info;

  // Xử lý message là object hoặc string
  let msg = message;
  let sugg = suggestion;
  if (typeof message === 'object' && message !== null) {
    msg = message.message || message.error || message.errorCode || JSON.stringify(message);
    sugg = message.suggestion || suggestion || '';
  }

  const animateIn = () => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 220,
        useNativeDriver: true,
      }),
      Animated.spring(translateY, {
        toValue: 0,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const animateOut = (cb) => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 0,
        duration: 180,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: -16,
        duration: 180,
        useNativeDriver: true,
      }),
    ]).start(() => cb?.());
  };

  useEffect(() => {
    animateIn();
    const timer = setTimeout(() => animateOut(onClose), duration);
    return () => clearTimeout(timer);
  }, [duration]);

  const handleClose = () => animateOut(onClose);

  return (
    <View pointerEvents="box-none" style={styles.overlay}>
      <Animated.View
        style={[
          styles.toast,
          { backgroundColor: colors.bg, borderColor: colors.border },
          { opacity, transform: [{ translateY }] },
        ]}
      >
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>
            {type === "success"
              ? "Thành công"
              : type === "error"
              ? "Lỗi"
              : type === "warning"
              ? "Cảnh báo"
              : "Thông báo"}
          </Text>
          {msg ? <Text style={styles.message}>{msg}</Text> : null}
          {sugg ? (
            <Text style={styles.suggestion}>{sugg}</Text>
          ) : null}
        </View>
        <TouchableOpacity onPress={handleClose} hitSlop={8}>
          <Text style={styles.close}>✕</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    right: 0,
    left: 0,
    bottom: 0,
    paddingTop: SPACING.xl * 2, // hạ toast xuống thấp hơn
    paddingHorizontal: SPACING.lg,
    alignItems: "flex-end",
    justifyContent: "flex-start",
    backgroundColor: "rgba(0,0,0,0.35)", // phủ đen toàn màn
    zIndex: 9999,
  },
  toast: {
    minWidth: 260,
    maxWidth: 420,
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING.lg,
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    flexDirection: "row",
    gap: SPACING.sm,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  },
  title: {
    color: COLORS.surface,
    fontWeight: "700",
    marginBottom: 4,
    fontSize: (TYPOGRAPHY?.bodyM || 14) + 1,
  },
  message: {
    color: COLORS.surface,
    opacity: 0.92,
    fontSize: (TYPOGRAPHY?.bodyS || 13) + 1,
    lineHeight: 18,
  },
  suggestion: {
    color: COLORS.surface,
    opacity: 0.85,
    fontSize: (TYPOGRAPHY?.caption || 12) + 1,
    marginTop: 6,
    fontStyle: "italic",
  },
  close: {
    color: COLORS.surface,
    opacity: 0.9,
    fontWeight: "700",
    fontSize: 18,
    paddingHorizontal: 6,
  },
});
