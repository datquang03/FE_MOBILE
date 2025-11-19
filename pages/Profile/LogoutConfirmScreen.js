import React from "react";
import { SafeAreaView, View, Text, StyleSheet } from "react-native";
import PrimaryButton from "../../components/ui/PrimaryButton";
import HeaderBar from "../../components/ui/HeaderBar";
import { COLORS, RADIUS, SPACING, TYPOGRAPHY } from "../../constants/theme";

export default function LogoutConfirmScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.safe}>
      <HeaderBar title="" onBack={() => navigation.goBack?.()} />
      <View style={styles.card}>
        <View style={styles.iconCircle}>
          <Text style={styles.icon}>?</Text>
        </View>
        <Text style={styles.title}>Xác nhận</Text>
        <Text style={styles.subtitle}>Bạn có chắc chắn đăng xuất không ?</Text>
        <PrimaryButton
          style={{ backgroundColor: COLORS.danger, marginBottom: SPACING.md }}
          label="Đăng xuất"
          onPress={() => navigation.navigate("SignIn")}
        />
        <PrimaryButton
          label="Huỷ"
          style={{ backgroundColor: COLORS.brandBlue + "11" }}
          textStyle={{ color: COLORS.brandBlue }}
          onPress={() => navigation.goBack()}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.2)",
    justifyContent: "center",
    padding: SPACING.lg,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    padding: SPACING.xl,
    alignItems: "center",
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 2,
    borderColor: COLORS.danger,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: SPACING.md,
  },
  icon: {
    fontSize: 32,
    color: COLORS.danger,
  },
  title: {
    fontSize: TYPOGRAPHY.headingS,
    fontWeight: "700",
    color: COLORS.textDark,
  },
  subtitle: {
    color: COLORS.textMuted,
    marginVertical: SPACING.md,
  },
});

