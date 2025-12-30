import React, { useState } from "react";
import { SafeAreaView, View, Text, StyleSheet, TextInput } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import HeaderBar from "../../components/ui/HeaderBar";
import PrimaryButton from "../../components/ui/PrimaryButton";
import { COLORS, RADIUS, SPACING, TYPOGRAPHY } from "../../constants/theme";
import { register } from "../../features/Authentication/authSlice";
import ToastNotification from "../../components/toast/ToastNotification";
import FullScreenLoading from "../../components/loadings/fullScreenLoading";

export default function SignUpScreen({ navigation }) {
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.auth.loading);
  const [form, setForm] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    email: "",
    fullName: "",
    phone: "",
  });
  const [toast, setToast] = useState(null);

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleRegister = () => {
    dispatch(
      register({
        username: form.username,
        password: form.password,
        confirmPassword: form.confirmPassword,
        email: form.email,
        fullName: form.fullName,
        phone: form.phone,
      })
    ).then((res) => {
      if (res.meta.requestStatus === "fulfilled") {
        setToast({
          type: "success",
          message: res.payload?.message || "Đăng ký thành công",
          suggestion: "Vui lòng kiểm tra email để nhập OTP",
        });
        navigation.navigate("Otp", { email: form.email });
      } else {
        const msg =
          res.payload?.message ||
          (typeof res.payload === "string" ? res.payload : "") ||
          "Đăng ký thất bại";
        setToast({
          type: "error",
          message: msg,
        });
      }
    });
  };

  return (
    <SafeAreaView style={styles.safe}>
      <HeaderBar title="" onBack={() => navigation.goBack?.()} />
      <View style={styles.container}>
        <Text style={styles.title}>Tạo tài khoản</Text>
        <Text style={styles.subtitle}>
          Xin chào khách mới! Hãy đăng kí để tiếp tục.
        </Text>
        <LabelInput
          label="Tên tài khoản"
          placeholder="Hãy điền tên..."
          value={form.username}
          onChangeText={(text) => handleChange("username", text)}
        />
        <LabelInput
          label="Email"
          placeholder="Hãy điền email của bạn..."
          value={form.email}
          onChangeText={(text) => handleChange("email", text)}
        />
        <LabelInput
          label="Họ tên"
          placeholder="Hãy điền họ tên..."
          value={form.fullName}
          onChangeText={(text) => handleChange("fullName", text)}
        />
        <LabelInput
          label="Số điện thoại"
          placeholder="0123456789"
          value={form.phone}
          onChangeText={(text) => handleChange("phone", text)}
          keyboardType="phone-pad"
        />
        <LabelInput
          label="Mật khẩu"
          placeholder="Hãy điền mật khẩu..."
          secureTextEntry
          value={form.password}
          onChangeText={(text) => handleChange("password", text)}
        />
        <LabelInput
          label="Xác nhận mật khẩu"
          placeholder="Nhập lại mật khẩu..."
          secureTextEntry
          value={form.confirmPassword}
          onChangeText={(text) => handleChange("confirmPassword", text)}
        />
        <PrimaryButton
          label={loading ? "Đang đăng kí..." : "Đăng kí"}
          onPress={handleRegister}
        />
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
          Bằng cách đăng ký, bạn đồng ý với các{" "}
          <Text style={styles.link}>Điều khoản</Text> và{" "}
          <Text style={styles.link}>Điều kiện</Text> sử dụng của chúng tôi
        </Text>
      </View>
      {toast ? (
        <ToastNotification
          type={toast.type}
          message={toast.message}
          suggestion={toast.suggestion}
          onClose={() => setToast(null)}
          duration={3500}
        />
      ) : null}
      <FullScreenLoading loading={loading} text="Đang tạo tài khoản..." />
    </SafeAreaView>
  );
}

const LabelInput = ({ label, ...rest }) => (
  <View style={{ marginBottom: SPACING.lg }}>
    <Text style={styles.inputLabel}>{label}</Text>
    <TextInput
      style={styles.input}
      placeholderTextColor={COLORS.textMuted}
      {...rest}
    />
  </View>
);

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.surface },
  container: { padding: SPACING.xl },
  title: {
    fontSize: TYPOGRAPHY.headingL,
    fontWeight: "700",
    color: COLORS.textDark,
  },
  subtitle: { color: COLORS.textMuted, marginBottom: SPACING.xl },
  inputLabel: {
    fontWeight: "600",
    color: COLORS.textDark,
    marginBottom: SPACING.xs,
  },
  input: {
    backgroundColor: COLORS.background,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.md,
  },
  separator: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: SPACING.lg,
  },
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
  agreement: {
    marginTop: SPACING.lg,
    color: COLORS.textMuted,
    textAlign: "center",
  },
  link: { color: COLORS.brandBlue, fontWeight: "600" },
});
