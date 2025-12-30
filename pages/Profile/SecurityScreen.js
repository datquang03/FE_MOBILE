import React, { useState } from "react";
import { SafeAreaView, View, Text, StyleSheet, Switch } from "react-native";
import HeaderBar from "../../components/ui/HeaderBar";
import { COLORS, RADIUS, SPACING, TYPOGRAPHY } from "../../constants/theme";

const settings = [
  "Nhận diện khuôn mặt",
  "Ghi nhớ mật khẩu",
  "Nhận diện vân tay",
];

export default function SecurityScreen({ navigation }) {
  const [state, setState] = useState(
    settings.reduce((acc, label) => ({ ...acc, [label]: true }), {})
  );

  return (
    <SafeAreaView style={styles.safe}>
      <HeaderBar title="Bảo mật" onBack={() => navigation.goBack?.()} />
      <View style={styles.card}>
        {settings.map((label) => (
          <View key={label} style={styles.row}>
            <Text style={styles.label}>{label}</Text>
            <Switch
              value={state[label]}
              onValueChange={() =>
                setState((prev) => ({ ...prev, [label]: !prev[label] }))
              }
              trackColor={{ true: COLORS.brandBlue }}
              thumbColor={COLORS.surface}
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
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: SPACING.md,
  },
  label: {
    color: COLORS.textDark,
    fontWeight: "600",
  },
});

