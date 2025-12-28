import React from "react";
import { SafeAreaView, View, Text, StyleSheet, TextInput } from "react-native";
import HeaderBar from "../../components/ui/HeaderBar";
import PrimaryButton from "../../components/ui/PrimaryButton";
import { COLORS, RADIUS, SPACING, TYPOGRAPHY } from "../../constants/theme";

export default function CreatePasswordScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.safe}>
      <HeaderBar title="Hãy tạo mật khẩu mới của bạn" onBack={() => navigation.goBack?.()} />
      <View style={styles.container}>
        <Text style={styles.subtitle}>Tạo mật khẩu mới</Text>
        <LabelInput label="Mật khẩu mới" placeholder="Hãy điền mật khẩu mới..." secureTextEntry />
        <LabelInput label="Xác nhận mật khẩu" placeholder="Hãy điền mật khẩu xác nhận..." secureTextEntry />
        <PrimaryButton label="Tiếp tục" onPress={() => navigation.navigate("PasswordSuccess")} />
      </View>
    </SafeAreaView>
  );
}

const LabelInput = ({ label, ...rest }) => (
  <View style={{ marginBottom: SPACING.lg }}>
    <Text style={styles.label}>{label}</Text>
    <TextInput style={styles.input} placeholderTextColor={COLORS.textMuted} {...rest} />
  </View>
);

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.surface },
  container: { padding: SPACING.xl },
  subtitle: { color: COLORS.textMuted, marginBottom: SPACING.xl },
  label: { fontWeight: "600", color: COLORS.textDark, marginBottom: SPACING.xs },
  input: {
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.background,
    padding: SPACING.md,
  },
});

