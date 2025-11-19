import React, { useState } from "react";
import { SafeAreaView, View, Text, StyleSheet, Switch } from "react-native";
import HeaderBar from "../../components/ui/HeaderBar";
import { COLORS, RADIUS, SPACING, TYPOGRAPHY } from "../../constants/theme";

const toggles = [
  "Sự kiện mới",
  "Lịch nhắc nhở",
  "Tin nhắn",
  "Thanh toán",
];

export default function NotificationSettingsScreen({ navigation }) {
  const [state, setState] = useState(
    toggles.reduce((acc, cur) => ({ ...acc, [cur]: true }), {})
  );

  const handleToggle = (key) => {
    setState((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <SafeAreaView style={styles.safe}>
      <HeaderBar title="Thông báo" onBack={() => navigation.goBack?.()} />
      <View style={styles.card}>
        <Text style={styles.title}>Thông báo tin nhắn</Text>
        {toggles.map((label) => (
          <View key={label} style={styles.row}>
            <Text style={styles.label}>{label}</Text>
            <Switch
              value={state[label]}
              thumbColor={COLORS.surface}
              trackColor={{ true: COLORS.brandBlue }}
              onValueChange={() => handleToggle(label)}
            />
          </View>
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  card: {
    margin: SPACING.lg,
    padding: SPACING.lg,
    borderRadius: RADIUS.xl,
    backgroundColor: COLORS.surface,
  },
  title: {
    fontSize: TYPOGRAPHY.headingS,
    fontWeight: "700",
    color: COLORS.textDark,
    marginBottom: SPACING.md,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: SPACING.sm,
  },
  label: {
    color: COLORS.textDark,
    fontWeight: "600",
  },
});

