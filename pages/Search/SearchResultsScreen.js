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
import StudioCard from "../../components/cards/StudioCard";
import { COLORS, RADIUS, SPACING, TYPOGRAPHY } from "../../constants/theme";
import { studios } from "../../constants/mockData";

export default function SearchResultsScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.safe}>
      <HeaderBar title="Tìm Kiếm" onBack={() => navigation.goBack?.()} rightIcon="sliders" />
      <View style={styles.chipRow}>
        {["All", "Studio", "Dụng cụ", "Set"].map((chip, index) => (
          <TouchableOpacity
            key={chip}
            style={[styles.chip, index === 0 && styles.chipActive]}
          >
            <Text
              style={[
                styles.chipLabel,
                index === 0 && styles.chipLabelActive,
              ]}
            >
              {chip}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <FlatList
        data={studios}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: SPACING.lg }}
        renderItem={({ item }) => (
          <StudioCard
            item={item}
            onPress={() => navigation.navigate("Detail", { item })}
            priceColor={COLORS.brandBlue}
          />
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
  chipRow: {
    flexDirection: "row",
    paddingHorizontal: SPACING.lg,
    marginTop: SPACING.md,
  },
  chip: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.lg,
    backgroundColor: COLORS.surface,
    marginRight: SPACING.sm,
  },
  chipActive: {
    backgroundColor: COLORS.brandBlue,
  },
  chipLabel: {
    color: COLORS.textMuted,
    fontWeight: "600",
  },
  chipLabelActive: {
    color: COLORS.surface,
  },
});

