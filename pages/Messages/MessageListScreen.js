import React from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from "react-native";
import HeaderBar from "../../components/ui/HeaderBar";
import { COLORS, RADIUS, SPACING, TYPOGRAPHY } from "../../constants/theme";

const conversations = [
  { id: "1", title: "Quản lý", preview: "Thank you! 😊", time: "7:12 AM" },
  { id: "2", title: "Hệ Thống", preview: "Bạn có lịch đặt phòng lúc 17:00...", time: "12:00 AM" },
  { id: "3", title: "Set Design", preview: "Gói design của bạn yêu cầu...", time: "12:00 AM" },
];

export default function MessageListScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.safe}>
      <HeaderBar title="Tin nhắn" onBack={() => navigation.goBack?.()} />
      <FlatList
        data={conversations}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate("Chat", { conversation: item })}
          >
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {item.title.slice(0, 1)}
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              <View style={styles.rowBetween}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.time}>{item.time}</Text>
              </View>
              <Text style={styles.preview}>{item.preview}</Text>
            </View>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>3</Text>
            </View>
          </TouchableOpacity>
        )}
        contentContainerStyle={{ padding: SPACING.lg }}
      />
      <TouchableOpacity style={styles.fab}>
        <Text style={styles.fabText}>＋</Text>
      </TouchableOpacity>
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
    alignItems: "center",
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.md,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.surfaceAlt,
    alignItems: "center",
    justifyContent: "center",
    marginRight: SPACING.md,
  },
  avatarText: {
    color: COLORS.surface,
    fontWeight: "700",
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  title: {
    fontWeight: "700",
    color: COLORS.textDark,
  },
  time: {
    color: COLORS.textMuted,
    fontSize: TYPOGRAPHY.caption,
  },
  preview: {
    color: COLORS.textMuted,
  },
  badge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.brandBlue,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeText: {
    color: COLORS.surface,
    fontWeight: "700",
  },
  fab: {
    position: "absolute",
    right: 24,
    bottom: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.brandBlue,
    alignItems: "center",
    justifyContent: "center",
  },
  fabText: {
    color: COLORS.surface,
    fontSize: 28,
    lineHeight: 28,
  },
});

