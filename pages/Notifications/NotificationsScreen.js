import React from "react";
import { SafeAreaView, View, Text, StyleSheet, FlatList } from "react-native";
import HeaderBar from "../../components/ui/HeaderBar";
import { COLORS, RADIUS, SPACING, TYPOGRAPHY } from "../../constants/theme";

const notifications = [
  { id: "1", title: "Quản lý vừa thêm một bài đăng mới !", time: "5 hours ago", section: "Hôm nay" },
  { id: "2", title: "Giảm giá 20% cho Set Design!", time: "4 hours ago", section: "Hôm nay" },
  { id: "3", title: "Chúc mừng! Bạn đã đặt lịch thành công!", time: "30 minutes ago", section: "Hôm nay" },
  { id: "4", title: "Bạn đã gửi yêu cầu Set Design!", time: "20 hours ago", section: "Hôm qua" },
];

export default function NotificationsScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.safe}>
      <HeaderBar title="Thông báo" onBack={() => navigation.goBack?.()} rightIcon="sliders" />
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: SPACING.lg }}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>S</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.time}>{item.time}</Text>
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  card: {
    flexDirection: "row",
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    alignItems: "center",
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.brandBlue + "22",
    alignItems: "center",
    justifyContent: "center",
    marginRight: SPACING.md,
  },
  avatarText: {
    color: COLORS.brandBlue,
    fontWeight: "700",
  },
  title: {
    color: COLORS.textDark,
    fontWeight: "600",
  },
  time: {
    color: COLORS.textMuted,
    fontSize: TYPOGRAPHY.caption,
  },
});

