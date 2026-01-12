import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import PrimaryButton from "../../components/ui/PrimaryButton";
import { COLORS, RADIUS, SPACING, TYPOGRAPHY } from "../../constants/theme";
import { register } from "../../features/Authentication/authSlice";
import ToastNotification from "../../components/toast/ToastNotification";
import FullScreenLoading from "../../components/loadings/fullScreenLoading";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";
import { GOOGLE_CLIENT_ID, GOOGLE_WEB_CLIENT_ID } from "@env";

WebBrowser.maybeCompleteAuthSession();

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
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const ANDROID_CLIENT_ID =
    "911436844422-dbqlfannivjimv5dt98e48hf4jjaq5o4.apps.googleusercontent.com";

  const WEB_CLIENT_ID = GOOGLE_WEB_CLIENT_ID;

  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: ANDROID_CLIENT_ID,
    expoClientId: WEB_CLIENT_ID,
    webClientId: WEB_CLIENT_ID,
    iosClientId: GOOGLE_CLIENT_ID,
  });

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
      <View style={[styles.container, { paddingTop: 32, minHeight: '60%' }]}>
        <Text style={styles.title}>Tạo tài khoản</Text>
        <Text style={styles.subtitle}>
          Xin chào khách mới! Hãy đăng ký để tiếp tục.
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
          secureTextEntry={!showPassword}
          showEye
          value={form.password}
          onChangeText={(text) => handleChange("password", text)}
          onToggleEye={() => setShowPassword((v) => !v)}
        />

        <LabelInput
          label="Xác nhận mật khẩu"
          placeholder="Nhập lại mật khẩu..."
          secureTextEntry={!showConfirmPassword}
          showEye
          value={form.confirmPassword}
          onChangeText={(text) =>
            handleChange("confirmPassword", text)
          }
          onToggleEye={() => setShowConfirmPassword((v) => !v)}
        />

        <PrimaryButton
          label={loading ? "Đang đăng ký..." : "Đăng ký"}
          onPress={handleRegister}
        />

        <View style={styles.separator}>
          <View style={styles.line} />
          <Text style={styles.sepText}>Hoặc đăng ký với</Text>
          <View style={styles.line} />
        </View>

        <View style={styles.socialRowCentered}>
          <TouchableOpacity
            style={styles.googleButton}
            onPress={() => promptAsync()}
          >
            <MaterialCommunityIcons
              name="google"
              size={22}
              color="#EA4335"
              style={{ marginRight: 8 }}
            />
            <Text style={styles.googleText}>
              Đăng ký với Google
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.agreement}>
          Bằng cách đăng ký, bạn đồng ý với các{" "}
          <Text style={styles.link}>Điều khoản</Text> và{" "}
          <Text style={styles.link}>Điều kiện</Text> sử dụng của
          chúng tôi
        </Text>
      </View>

      {toast && (
        <ToastNotification
          type={toast.type}
          message={toast.message}
          suggestion={toast.suggestion}
          onClose={() => setToast(null)}
          duration={3500}
        />
      )}

      <FullScreenLoading
        loading={loading}
        text="Đang tạo tài khoản..."
      />
    </SafeAreaView>
  );
}

/* ===== COMPONENT ===== */

const LabelInput = ({
  label,
  showEye,
  onToggleEye,
  secureTextEntry,
  ...rest
}) => (
  <View style={{ marginBottom: SPACING.lg }}>
    <Text style={styles.inputLabel}>{label}</Text>
    <View style={styles.inputWrapper}>
      <TextInput
        style={styles.input}
        placeholderTextColor={COLORS.textMuted}
        secureTextEntry={secureTextEntry}
        {...rest}
      />
      {showEye && (
        <TouchableOpacity
          onPress={onToggleEye}
          style={{ paddingHorizontal: SPACING.md }}
        >
          <MaterialCommunityIcons
            name={
              secureTextEntry
                ? "eye-off-outline"
                : "eye-outline"
            }
            size={22}
            color={COLORS.textMuted}
          />
        </TouchableOpacity>
      )}
    </View>
  </View>
);

/* ===== STYLES ===== */

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.surface,
  },
  container: {
    padding: SPACING.xl,
    paddingTop: SPACING.xxl,
  },
  title: {
    fontSize: TYPOGRAPHY.headingL,
    fontWeight: "700",
    color: COLORS.textDark,
  },
  subtitle: {
    color: COLORS.textMuted,
    marginBottom: SPACING.xl,
  },
  inputLabel: {
    fontWeight: "600",
    color: COLORS.textDark,
    marginBottom: SPACING.xs,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.background,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  input: {
    flex: 1,
    padding: SPACING.md,
  },
  separator: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: SPACING.lg,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.border,
  },
  sepText: {
    marginHorizontal: SPACING.md,
    color: COLORS.textMuted,
  },
  socialRowCentered: {
    flexDirection: "row",
    justifyContent: "center",
  },
  googleButton: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.lg,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
  },
  googleText: {
    fontSize: 16,
    color: COLORS.textDark,
  },
  agreement: {
    marginTop: SPACING.lg,
    color: COLORS.textMuted,
    textAlign: "center",
  },
  link: {
    color: COLORS.brandBlue,
    fontWeight: "600",
  },
});
