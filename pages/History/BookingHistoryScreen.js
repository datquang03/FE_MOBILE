import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
} from "react-native";
import HeaderBar from "../../components/ui/HeaderBar";
import { COLORS, RADIUS, SPACING, TYPOGRAPHY } from "../../constants/theme";
import { studios, equipments } from "../../constants/mockData";

export default function BookingHistoryScreen({ navigation }) {
  const [tab, setTab] = useState("rooms");
  const data = tab === "rooms" ? studios : equipments;

  return (
    <SafeAreaView style={styles.safe}>
      <HeaderBar
        title="Lịch sử"
        onBack={() => navigation.goBack?.()}
        rightIcon="more-vertical"
      />
      <View style={styles.searchWrapper}>
        <TextInput
          placeholder="Bạn cần gì..."
          placeholderTextColor={COLORS.textMuted}
          style={styles.searchInput}
        />
        <View style={styles.filterButton}>
          <Text style={styles.filterText}>☰</Text>
        </View>
      </View>
      <View style={styles.segment}>
        {[
          { id: "rooms", label: "Phòng" },
          { id: "equip", label: "Dụng cụ" },
        ].map((item) => (
          <TouchableOpacity
            key={item.id}
            onPress={() => setTab(item.id)}
            style={[
              styles.segmentItem,
              tab === item.id && styles.segmentActive,
            ]}
          >
            <Text
              style={[
                styles.segmentText,
                tab === item.id && styles.segmentTextActive,
              ]}
            >
              {item.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: SPACING.lg }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.historyCard}
            onPress={() =>
              navigation.navigate("BookingDetail", { type: tab, item })
            }
          >
            <Image source={{ uri: item.image }} style={styles.thumbnail} />
            <View style={{ flex: 1, marginLeft: SPACING.md }}>
              <Text style={styles.itemTitle}>{item.name}</Text>
              <Text style={styles.meta}>{item.size || "6 tiếng"}</Text>
              <Text style={styles.price}>{item.price}</Text>
              <Text style={styles.meta}>Ngày | 15 - 16 Tháng 9,2025</Text>
            </View>
            <Text style={styles.rating}>{item.rating || "4.0"}</Text>
          </TouchableOpacity>
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
  searchWrapper: {
    flexDirection: "row",
    marginHorizontal: SPACING.lg,
    marginTop: SPACING.md,
  },
  searchInput: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    paddingHorizontal: SPACING.lg,
    height: 48,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  filterButton: {
    width: 48,
    height: 48,
    borderRadius: RADIUS.lg,
    backgroundColor: COLORS.surface,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  filterText: {
    fontSize: 18,
  },
  segment: {
    flexDirection: "row",
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    margin: SPACING.lg,
    padding: SPACING.xs,
  },
  segmentItem: {
    flex: 1,
    paddingVertical: SPACING.sm,
    alignItems: "center",
    borderRadius: RADIUS.lg,
  },
  segmentActive: {
    backgroundColor: COLORS.brandBlue,
  },
  segmentText: {
    color: COLORS.textMuted,
    fontWeight: "600",
  },
  segmentTextActive: {
    color: COLORS.surface,
  },
  historyCard: {
    flexDirection: "row",
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    alignItems: "center",
  },
  thumbnail: {
    width: 68,
    height: 68,
    borderRadius: RADIUS.md,
  },
  itemTitle: {
    fontWeight: "700",
    color: COLORS.textDark,
  },
  meta: {
    color: COLORS.textMuted,
    fontSize: TYPOGRAPHY.caption,
  },
  price: {
    color: COLORS.brandBlue,
    fontWeight: "700",
  },
  rating: {
    fontWeight: "700",
    color: COLORS.textDark,
  },
});

