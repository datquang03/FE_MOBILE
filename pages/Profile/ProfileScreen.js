import React from "react";
import { SafeAreaView, View, Text, StyleSheet, TouchableOpacity } from "react-native";
import HeaderBar from "../../components/ui/HeaderBar";
import PrimaryButton from "../../components/ui/PrimaryButton";
import { COLORS, RADIUS, SPACING, TYPOGRAPHY } from "../../constants/theme";

const settings = [
  { id: "card", label: "Thẻ", route: "Cards" },
  { id: "security", label: "Bảo mật", route: "Security" },
  { id: "notifications", label: "Thông báo", route: "NotificationSettings" },
  { id: "support", label: "Hỗ trợ và giải đáp", route: "Support" },
];

export default function ProfileScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.safe}>
      <HeaderBar title="Hồ sơ" />
      <View style={styles.card}>
        <View style={styles.avatar} />
        <Text style={styles.name}>Dat Quang</Text>
        <Text style={styles.username}>@datquang0103</Text>
        <TouchableOpacity onPress={() => navigation.navigate("EditProfile")}>
          <Text style={styles.edit}>Chỉnh sửa</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.list}>
        {settings.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.row}
            onPress={() => navigation.navigate(item.route)}
          >
            <Text style={styles.rowText}>{item.label}</Text>
            <Text style={styles.rowIcon}>›</Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.footer}>
        <PrimaryButton
          style={{ backgroundColor: COLORS.danger }}
          label="Đăng xuất"
          onPress={() => navigation.navigate("LogoutConfirm")}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  card: {
    margin: SPACING.lg,
    padding: SPACING.lg,
    borderRadius: RADIUS.xl,
    backgroundColor: COLORS.surface,
    alignItems: "center",
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: COLORS.brandBlue,
  },
  name: {
    fontSize: TYPOGRAPHY.headingS,
    fontWeight: "700",
    color: COLORS.textDark,
    marginTop: SPACING.md,
  },
  username: {
    color: COLORS.textMuted,
  },
  edit: {
    color: COLORS.brandBlue,
    marginTop: SPACING.sm,
  },
  list: {
    marginHorizontal: SPACING.lg,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    paddingVertical: SPACING.md,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
  },
  rowText: {
    color: COLORS.textDark,
    fontWeight: "600",
  },
  rowIcon: {
    color: COLORS.textMuted,
  },
  footer: {
    padding: SPACING.lg,
  },
});

