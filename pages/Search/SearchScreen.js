import React from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
} from "react-native";
import HeaderBar from "../../components/ui/HeaderBar";
import { COLORS, RADIUS, SPACING, TYPOGRAPHY } from "../../constants/theme";
import { studios } from "../../constants/mockData";

const recents = ["Studio 1", "Set Design", "Dụng cụ"];

export default function SearchScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.safe}>
      <HeaderBar title="Tìm Kiếm" onBack={() => navigation.goBack?.()} />
      <View style={styles.inputRow}>
        <TextInput
          placeholder="Bạn cần gì..."
          placeholderTextColor={COLORS.textMuted}
          style={styles.input}
        />
        <TouchableOpacity style={styles.filterButton}>
          <Text style={styles.filterText}>☰</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.card}>
        <View style={styles.rowBetween}>
          <Text style={styles.sectionLabel}>Gần đây</Text>
          <TouchableOpacity>
            <Text style={styles.link}>Xoá tất cả</Text>
          </TouchableOpacity>
        </View>
        {recents.map((item) => (
          <Text key={item} style={styles.recentItem}>
            {item}
          </Text>
        ))}
      </View>

      <View style={styles.rowBetween}>
        <Text style={styles.sectionLabel}>Xem gần đây</Text>
        <TouchableOpacity>
          <Text style={styles.link}>Xem tất cả</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={studios}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.resultCard}
            onPress={() => navigation.navigate("SearchResults")}
          >
            <Text style={styles.resultTitle}>{item.name}</Text>
            <Text style={styles.meta}>{item.size}</Text>
            <Text style={styles.price}>{item.price}</Text>
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
    padding: SPACING.lg,
  },
  inputRow: {
    flexDirection: "row",
    marginBottom: SPACING.lg,
  },
  input: {
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
  },
  filterText: {
    fontSize: 18,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    marginBottom: SPACING.xl,
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SPACING.md,
  },
  sectionLabel: {
    fontSize: TYPOGRAPHY.headingS,
    fontWeight: "600",
    color: COLORS.textDark,
  },
  link: {
    color: COLORS.danger,
    fontWeight: "600",
  },
  recentItem: {
    color: COLORS.textMuted,
    marginBottom: SPACING.sm,
  },
  resultCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.md,
  },
  resultTitle: {
    fontWeight: "700",
    color: COLORS.textDark,
  },
  meta: {
    color: COLORS.textMuted,
  },
  price: {
    color: COLORS.brandBlue,
    fontWeight: "700",
  },
});

