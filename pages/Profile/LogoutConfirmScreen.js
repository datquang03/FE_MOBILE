import React from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useDispatch } from "react-redux";
import { logout } from "../../features/Authentication/authSlice";
import { COLORS, RADIUS, SPACING, TYPOGRAPHY } from "../../constants/theme";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function LogoutConfirmScreen({ navigation }) {
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
    navigation.reset({
      index: 0,
      routes: [{ name: "Home" }],
    });
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        {/* ICON */}
        <View style={styles.iconWrap}>
          <MaterialCommunityIcons
            name="logout-variant"
            size={52}
            color={COLORS.danger}
          />
        </View>

        {/* TITLE */}
        <Text style={styles.title}>Đăng xuất?</Text>

        {/* DESC */}
        <Text style={styles.desc}>
          Bạn có chắc chắn muốn đăng xuất khỏi tài khoản này không?
        </Text>

        {/* ACTIONS */}
        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.cancelBtn}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.cancelText}>Ở lại</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.logoutBtn}
            onPress={handleLogout}
          >
            <Text style={styles.logoutText}>Đăng xuất</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: SPACING.xl,
  },

  iconWrap: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: COLORS.danger + "15",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },

  title: {
    fontSize: 24,
    fontWeight: "800",
    color: COLORS.textDark,
    marginBottom: 10,
    textAlign: "center",
  },

  desc: {
    fontSize: 16,
    color: COLORS.textMuted,
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 36,
  },

  actions: {
    width: "100%",
    gap: 14,
  },

  cancelBtn: {
    paddingVertical: 14,
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: "center",
    backgroundColor: COLORS.surface,
  },

  cancelText: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.textDark,
  },

  logoutBtn: {
    paddingVertical: 16,
    borderRadius: RADIUS.xl,
    backgroundColor: COLORS.danger,
    alignItems: "center",
  },

  logoutText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#fff",
  },
});
