import React from "react";
import { SafeAreaView, View, Text, StyleSheet } from "react-native";
import HeaderBar from "../../components/ui/HeaderBar";
import PrimaryButton from "../../components/ui/PrimaryButton";
import { COLORS, RADIUS, SPACING, TYPOGRAPHY } from "../../constants/theme";

export default function CardSuccessScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.safe}>
      <HeaderBar title="" onBack={() => navigation.goBack?.()} />
      <View style={styles.content}>
        <View style={styles.iconCircle}>
          <Text style={styles.check}>✓</Text>
        </View>
        <Text style={styles.title}>Đã thêm thẻ thành công</Text>
        <Text style={styles.subtitle}>
          Hãy luôn tiến về phía trước với sự tự tin. Sự kiên định sẽ dẫn đến
          thành công.
        </Text>
      </View>
      <View style={styles.footer}>
        <PrimaryButton
          label="Tiếp tục"
          onPress={() => navigation.navigate("QRCode")}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: SPACING.xl,
  },
  iconCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: COLORS.success + "22",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: SPACING.lg,
  },
  check: {
    fontSize: 42,
    color: COLORS.success,
  },
  title: {
    fontSize: TYPOGRAPHY.headingM,
    fontWeight: "700",
    color: COLORS.textDark,
    textAlign: "center",
    marginBottom: SPACING.md,
  },
  subtitle: {
    textAlign: "center",
    color: COLORS.textMuted,
    lineHeight: 22,
  },
  footer: {
    padding: SPACING.lg,
  },
});

