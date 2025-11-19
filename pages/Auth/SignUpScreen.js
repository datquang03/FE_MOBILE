import React from "react";
import { SafeAreaView, View, Text, StyleSheet, TextInput } from "react-native";
import HeaderBar from "../../components/ui/HeaderBar";
import PrimaryButton from "../../components/ui/PrimaryButton";
import { COLORS, RADIUS, SPACING, TYPOGRAPHY } from "../../constants/theme";

export default function SignUpScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.safe}>
      <HeaderBar title="" onBack={() => navigation.goBack?.()} />
      <View style={styles.container}>
        <Text style={styles.title}>Tạo tài khoản</Text>
        <Text style={styles.subtitle}>Xin chào khách mới! Hãy đăng kí để tiếp tục.</Text>
        <LabelInput label="Tên tài khoản" placeholder="Hãy điền tên..." />
        <LabelInput label="Email" placeholder="Hãy điền email của bạn..." />
        <LabelInput label="Mật khẩu" placeholder="Hãy điền mật khẩu..." secureTextEntry />
        <PrimaryButton label="Đăng kí" onPress={() => navigation.navigate("Otp")} />
        <View style={styles.separator}>
          <View style={styles.line} />
          <Text style={styles.sepText}>Hoặc đăng kí với</Text>
          <View style={styles.line} />
        </View>
        <View style={styles.socialRow}>
          {["G", "", "f"].map((icon) => (
            <View key={icon} style={styles.social}>
              <Text style={styles.socialText}>{icon}</Text>
            </View>
          ))}
        </View>
        <Text style={styles.agreement}>
          Bằng cách đăng ký, bạn đồng ý với các <Text style={styles.link}>Điều khoản</Text> và{" "}
          <Text style={styles.link}>Điều kiện</Text> sử dụng của chúng tôi
        </Text>
      </View>
    </SafeAreaView>
  );
}

const LabelInput = ({ label, ...rest }) => (
  <View style={{ marginBottom: SPACING.lg }}>
    <Text style={styles.inputLabel}>{label}</Text>
    <TextInput style={styles.input} placeholderTextColor={COLORS.textMuted} {...rest} />
  </View>
);

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.surface },
  container: { padding: SPACING.xl },
  title: { fontSize: TYPOGRAPHY.headingL, fontWeight: "700", color: COLORS.textDark },
  subtitle: { color: COLORS.textMuted, marginBottom: SPACING.xl },
  inputLabel: { fontWeight: "600", color: COLORS.textDark, marginBottom: SPACING.xs },
  input: {
    backgroundColor: COLORS.background,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.md,
  },
  separator: { flexDirection: "row", alignItems: "center", marginVertical: SPACING.lg },
  line: { flex: 1, height: 1, backgroundColor: COLORS.border },
  sepText: { marginHorizontal: SPACING.md, color: COLORS.textMuted },
  socialRow: { flexDirection: "row", justifyContent: "space-between" },
  social: {
    flex: 1,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.lg,
    paddingVertical: SPACING.md,
    alignItems: "center",
    marginHorizontal: SPACING.sm,
  },
  socialText: { fontSize: 18, color: COLORS.textDark },
  agreement: { marginTop: SPACING.lg, color: COLORS.textMuted, textAlign: "center" },
  link: { color: COLORS.brandBlue, fontWeight: "600" },
});

