import React from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
} from "react-native";
import HeaderBar from "../../components/ui/HeaderBar";
import StudioCard from "../../components/cards/StudioCard";
import { COLORS, RADIUS, SPACING, TYPOGRAPHY } from "../../constants/theme";
import { studios } from "../../constants/mockData";

export default function FavoritesScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.safe}>
      <HeaderBar title="Yêu thích" onBack={() => navigation.goBack?.()} />
      <View style={styles.searchRow}>
        <TextInput
          placeholder="Search..."
          placeholderTextColor={COLORS.textMuted}
          style={styles.searchInput}
        />
      </View>
      <View style={styles.tabRow}>
        {["All", "Studio", "Dụng cụ", "Gói"].map((tab, idx) => (
          <View
            key={tab}
            style={[styles.tabItem, idx === 0 && styles.tabItemActive]}
          >
            <Text
              style={[
                styles.tabText,
                idx === 0 && styles.tabTextActive,
              ]}
            >
              {tab}
            </Text>
          </View>
        ))}
      </View>
      <FlatList
        data={studios}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: "space-between" }}
        contentContainerStyle={{ padding: SPACING.lg }}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.cardWrapper}>
            <StudioCard
              item={item}
              showFavorite
              priceColor={COLORS.brandGold}
              onPress={() => navigation.navigate("Detail", { item })}
            />
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
  searchRow: {
    margin: SPACING.lg,
  },
  searchInput: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    paddingHorizontal: SPACING.lg,
    height: 48,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  tabRow: {
    flexDirection: "row",
    marginHorizontal: SPACING.lg,
  },
  tabItem: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.lg,
    backgroundColor: COLORS.surface,
    marginRight: SPACING.sm,
  },
  tabItemActive: {
    backgroundColor: COLORS.brandBlue,
  },
  tabText: {
    color: COLORS.textMuted,
  },
  tabTextActive: {
    color: COLORS.surface,
    fontWeight: "600",
  },
  cardWrapper: {
    width: "48%",
  },
});

