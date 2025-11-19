import React from "react";
import { SafeAreaView, View, Text, StyleSheet } from "react-native";
import HeaderBar from "../../components/ui/HeaderBar";
import PrimaryButton from "../../components/ui/PrimaryButton";
import { COLORS, SPACING, TYPOGRAPHY } from "../../constants/theme";

export default function PasswordSuccessScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.safe}>
      <HeaderBar title="" onBack={() => navigation.goBack?.()} />
      <View style={styles.card}>
        <View style={styles.icon}>
          <Text style={styles.iconText}>✔</Text>
        </View>
        <Text style={styles.title}>Thành công</Text>
        <Text style={styles.subtitle}>Mật khẩu của bạn đã được tạo thành công !</Text>
        <PrimaryButton label="Tiếp tục" onPress={() => navigation.navigate("SignIn")} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.2)" },
  card: {
    width: "80%",
    padding: SPACING.xl,
    borderRadius: 32,
    backgroundColor: COLORS.surface,
    alignItems: "center",
  },
  icon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: COLORS.success + "22",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: SPACING.md,
  },
  iconText: { fontSize: 32, color: COLORS.success },
  title: { fontSize: TYPOGRAPHY.headingS, fontWeight: "700", color: COLORS.textDark },
  subtitle: { color: COLORS.textMuted, textAlign: "center", marginVertical: SPACING.md },
});

