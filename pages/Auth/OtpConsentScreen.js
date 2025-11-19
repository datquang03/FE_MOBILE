import React from "react";
import { SafeAreaView, View, Text, StyleSheet } from "react-native";
import HeaderBar from "../../components/ui/HeaderBar";
import PrimaryButton from "../../components/ui/PrimaryButton";
import { COLORS, RADIUS, SPACING, TYPOGRAPHY } from "../../constants/theme";

export default function OtpConsentScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.safe}>
      <HeaderBar title="Điền mã OTP" onBack={() => navigation.goBack?.()} />
      <View style={styles.sheet}>
        <Text style={styles.body}>
          Tôi đồng ý với Điều khoản Dịch vụ và Điều kiện Sử dụng, bao gồm việc chấp thuận nhận thông tin qua
          phương tiện điện tử, và tôi xác nhận rằng các thông tin cung cấp là của riêng tôi.
        </Text>
        <PrimaryButton
          label="Đồng ý"
          onPress={() => navigation.navigate("MainTabs")}
        />
        <PrimaryButton
          style={{ backgroundColor: COLORS.danger, marginTop: SPACING.md }}
          label="Từ chối"
          onPress={() => navigation.navigate("SignIn")}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.surface },
  sheet: {
    margin: SPACING.lg,
    padding: SPACING.lg,
    borderRadius: RADIUS.xl,
    backgroundColor: COLORS.surface,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.1,
    shadowRadius: 30,
    elevation: 5,
  },
  body: {
    color: COLORS.textMuted,
    lineHeight: 22,
    marginBottom: SPACING.lg,
  },
});

