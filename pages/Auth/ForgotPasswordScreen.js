import React from "react";
import { SafeAreaView, View, Text, StyleSheet, TextInput } from "react-native";
import HeaderBar from "../../components/ui/HeaderBar";
import PrimaryButton from "../../components/ui/PrimaryButton";
import { COLORS, RADIUS, SPACING, TYPOGRAPHY } from "../../constants/theme";

export default function ForgotPasswordScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.safe}>
      <HeaderBar title="Quên mật khẩu" onBack={() => navigation.goBack?.()} />
      <View style={styles.container}>
        <Text style={styles.subtitle}>Lấy lại mật khẩu của bạn</Text>
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="Hãy điền email..."
          placeholderTextColor={COLORS.textMuted}
        />
        <PrimaryButton label="Tiếp tục" onPress={() => navigation.navigate("CreatePassword")} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.surface },
  container: { padding: SPACING.xl },
  subtitle: { color: COLORS.textMuted, marginBottom: SPACING.xl },
  label: { fontWeight: "600", color: COLORS.textDark, marginBottom: SPACING.sm },
  input: {
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.md,
    backgroundColor: COLORS.background,
    marginBottom: SPACING.xl,
  },
});

