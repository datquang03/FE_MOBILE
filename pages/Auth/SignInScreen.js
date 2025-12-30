import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Platform,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import HeaderBar from "../../components/ui/HeaderBar";
import PrimaryButton from "../../components/ui/PrimaryButton";
import { COLORS, RADIUS, SPACING, TYPOGRAPHY } from "../../constants/theme";
import { login, loginGoogle } from "../../features/Authentication/authSlice";
import FullScreenLoading from "../../components/loadings/fullScreenLoading";
import ToastNotification from "../../components/toast/ToastNotification";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";
import { GOOGLE_CLIENT_ID, GOOGLE_WEB_CLIENT_ID } from "@env";

WebBrowser.maybeCompleteAuthSession();

export default function SignInScreen({ navigation }) {
  const [remember, setRemember] = useState(false);
  const [form, setForm] = useState({ username: "", password: "" });
  const [toast, setToast] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.auth.loading);

  const ANDROID_CLIENT_ID = "911436844422-dbqlfannivjimv5dt98e48hf4jjaq5o4.apps.googleusercontent.com";
  const WEB_CLIENT_ID = GOOGLE_WEB_CLIENT_ID;

  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: ANDROID_CLIENT_ID,
    expoClientId: WEB_CLIENT_ID,
    webClientId: WEB_CLIENT_ID,
    iosClientId: GOOGLE_CLIENT_ID,
  });

  useEffect(() => {
    if (response?.type === "success") {
      const googleToken = response.authentication.idToken;
      dispatch(loginGoogle(googleToken)).then((res) => {
        if (res.meta.requestStatus === "fulfilled") {
          setToast({
            type: "success",
            message: "Đăng nhập Google thành công",
          });
          navigation.replace("MainTabs");
        } else {
          const msg =
            res.payload?.message ||
            (typeof res.payload === "string" ? res.payload : "") ||
            "Đăng nhập Google thất bại";
          setToast({
            type: "error",
            message: msg,
          });
        }
      });
    }
  }, [response]);

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleLogin = () => {
    dispatch(
      login({
        username: form.username,
        password: form.password,
      })
    ).then((res) => {
      if (res.meta.requestStatus === "fulfilled") {
        setToast({
          type: "success",
          message: "Đăng nhập thành công",
        });
        navigation.replace("MainTabs");
      } else {
        const msg =
          res.payload?.message ||
          (typeof res.payload === "string" ? res.payload : "") ||
          "Đăng nhập thất bại";
        setToast({
          type: "error",
          message: msg,
        });
      }
    });
  };

  const handleGoogleLogin = async () => {
    promptAsync();
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={{ paddingTop: 32, backgroundColor: COLORS.surface }}>
        <HeaderBar title="" onBack={() => navigation.goBack?.() || {}} />
      </View>
      <View style={[styles.container, { paddingTop: 16 }]}>
        <Text style={styles.title}>Đăng nhập</Text>
        <Text style={styles.subtitle}>
          Chào mừng trở lại! Hãy đăng nhập để tiếp tục.
        </Text>
        <LabelInput
          placeholder="Hãy điền tên tài khoản..."
          label="Tên tài khoản"
          value={form.username}
          onChangeText={(text) => handleChange("username", text)}
        />
        <LabelInput
          placeholder="Hãy điền mật khẩu..."
          label="Mật khẩu"
          secureTextEntry={!showPassword}
          showEye
          value={form.password}
          onChangeText={(text) => handleChange("password", text)}
          onToggleEye={() => setShowPassword((prev) => !prev)}
        />
        <View style={styles.rowBetween}>
          <TouchableOpacity
            style={styles.checkboxRow}
            onPress={() => setRemember(!remember)}
          >
            <View style={[styles.checkbox, remember && styles.checkboxActive]} />
            <Text style={styles.checkboxLabel}>Ghi nhớ</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate("ForgotPassword")}>
            <Text style={styles.link}>Quên mật khẩu</Text>
          </TouchableOpacity>
        </View>
        <PrimaryButton
          label={loading ? "Đang đăng nhập..." : "Đăng nhập"}
          onPress={handleLogin}
        />
        <Text style={styles.switchText}>
          Bạn không có tài khoản?{" "}
          <Text style={styles.link} onPress={() => navigation.navigate("SignUp")}>
            Đăng kí
          </Text>
        </Text>
        <View style={styles.separator}>
          <View style={styles.line} />
          <Text style={styles.separatorText}>Hoặc đăng kí với</Text>
          <View style={styles.line} />
        </View>
        <View style={styles.socialRowCentered}>
          <TouchableOpacity style={styles.googleButton} onPress={handleGoogleLogin}>
            <MaterialCommunityIcons
              name="google"
              size={22}
              color="#EA4335"
              style={{ marginRight: 8 }}
            />
            <Text style={styles.googleText}>Đăng nhập với Google</Text>
          </TouchableOpacity>
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
      <FullScreenLoading loading={loading} text="Đang đăng nhập..." />
    </SafeAreaView>
  );
}

const LabelInput = ({ label, showEye, onToggleEye, secureTextEntry, ...rest }) => (
  <View style={{ marginBottom: SPACING.lg }}>
    <Text style={styles.inputLabel}>{label}</Text>
    <View style={styles.inputWrapper}>
      <TextInput
        style={styles.input}
        placeholderTextColor={COLORS.textMuted}
        secureTextEntry={secureTextEntry}
        {...rest}
      />
      {showEye ? (
        <TouchableOpacity onPress={onToggleEye} style={{ paddingHorizontal: SPACING.md }}>
          <MaterialCommunityIcons
            name={secureTextEntry ? "eye-off-outline" : "eye-outline"}
            size={22}
            color={COLORS.textMuted}
          />
        </TouchableOpacity>
      ) : null}
    </View>
  </View>
);

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.surface },
  container: { padding: SPACING.xl },
  title: { fontSize: TYPOGRAPHY.headingL, fontWeight: "700", color: COLORS.textDark },
  subtitle: { color: COLORS.textMuted, marginBottom: SPACING.xl },
  inputLabel: { fontWeight: "600", color: COLORS.textDark, marginBottom: SPACING.xs },
  inputWrapper: {
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.background,
    flexDirection: "row",
    alignItems: "center",
  },
  input: { flex: 1, padding: SPACING.md },
  eye: { paddingHorizontal: SPACING.md, color: COLORS.textMuted },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SPACING.lg,
  },
  checkboxRow: { flexDirection: "row", alignItems: "center" },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginRight: SPACING.sm,
  },
  checkboxActive: { backgroundColor: COLORS.brandBlue, borderColor: COLORS.brandBlue },
  checkboxLabel: { color: COLORS.textDark },
  link: { color: COLORS.brandBlue, fontWeight: "600" },
  switchText: { textAlign: "center", marginVertical: SPACING.md, color: COLORS.textDark },
  separator: { flexDirection: "row", alignItems: "center", marginVertical: SPACING.lg },
  line: { flex: 1, height: 1, backgroundColor: COLORS.border },
  separatorText: { marginHorizontal: SPACING.md, color: COLORS.textMuted },
  socialRowCentered: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: SPACING.lg,
  },
  googleButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xl,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 1,
  },
  googleText: {
    color: COLORS.textDark,
    fontWeight: "600",
    fontSize: 16,
  },
  agreement: { marginTop: SPACING.lg, color: COLORS.textMuted, textAlign: "center" },
});

