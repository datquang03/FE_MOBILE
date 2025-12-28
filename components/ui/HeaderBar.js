import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";
import { COLORS, SPACING, TYPOGRAPHY } from "../../constants/theme";

export default function HeaderBar({
  title,
  subtitle,
  onBack,
  rightIcon,
  onRightPress,
}) {
  return (
    <View style={styles.container}>
      <View style={styles.side}>
        {onBack ? (
          <TouchableOpacity style={styles.iconButton} onPress={onBack}>
            <Feather name="arrow-left" size={20} color={COLORS.textDark} />
          </TouchableOpacity>
        ) : (
          <View style={styles.placeholder} />
        )}
      </View>
      <View style={styles.center}>
        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>
      <View style={styles.side}>
        {rightIcon ? (
          <TouchableOpacity style={styles.iconButton} onPress={onRightPress}>
            <Feather name={rightIcon} size={20} color={COLORS.textDark} />
          </TouchableOpacity>
        ) : (
          <View style={styles.placeholder} />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
  },
  side: {
    width: 48,
    alignItems: "center",
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  placeholder: {
    width: 40,
    height: 40,
  },
  center: {
    flex: 1,
    alignItems: "center",
  },
  title: {
    fontSize: TYPOGRAPHY.headingS,
    fontWeight: "600",
    color: COLORS.textDark,
  },
  subtitle: {
    marginTop: 2,
    fontSize: TYPOGRAPHY.bodySm,
    color: COLORS.textMuted,
  },
});

