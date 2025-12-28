import React from "react";
import { SafeAreaView, View, Text, StyleSheet, TouchableOpacity } from "react-native";
import HeaderBar from "../../components/ui/HeaderBar";
import PrimaryButton from "../../components/ui/PrimaryButton";
import { COLORS, RADIUS, SPACING, TYPOGRAPHY } from "../../constants/theme";

const digits = ["3", "3", "1", "4"];

export default function OtpScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.safe}>
      <HeaderBar title="Điền mã OTP" onBack={() => navigation.goBack?.()} />
      <View style={styles.container}>
        <Text style={styles.subtitle}>
          Chúng tôi vừa gửi cho bạn mã gồm 4 chữ số qua datquang0103@gmail.com
        </Text>
        <View style={styles.digits}>
          {digits.map((digit, idx) => (
            <View key={idx} style={[styles.digitBox, idx === 3 && styles.digitActive]}>
              <Text style={styles.digit}>{digit}</Text>
            </View>
          ))}
        </View>
        <PrimaryButton label="Tiếp tục" onPress={() => navigation.navigate("OtpConsent")} />
        <TouchableOpacity>
          <Text style={styles.link}>Bạn không nhận được mã? Gửi lại</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.surface },
  container: { padding: SPACING.xl },
  subtitle: { color: COLORS.textMuted, marginBottom: SPACING.xl },
  digits: { flexDirection: "row", justifyContent: "space-between", marginBottom: SPACING.xl },
  digitBox: {
    width: 64,
    height: 64,
    borderRadius: RADIUS.lg,
    backgroundColor: COLORS.background,
    alignItems: "center",
    justifyContent: "center",
  },
  digitActive: {
    borderWidth: 2,
    borderColor: COLORS.brandBlue,
  },
  digit: { fontSize: TYPOGRAPHY.headingL, fontWeight: "700", color: COLORS.textDark },
  link: { textAlign: "center", color: COLORS.brandBlue, marginTop: SPACING.md },
});

