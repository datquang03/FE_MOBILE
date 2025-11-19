import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { COLORS, RADIUS, SPACING, TYPOGRAPHY } from "../../constants/theme";

export default function StudioCard({
  item,
  onPress,
  showFavorite,
  priceColor = COLORS.brandBlue,
}) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.9}>
      <Image source={{ uri: item.image }} style={styles.image} />
      {showFavorite ? (
        <View style={styles.favorite}>
          <Feather name="heart" size={16} color={COLORS.surface} />
        </View>
      ) : null}
      <View style={styles.badge}>
        <Text style={styles.badgeText}>{item.rating}</Text>
        <Feather name="star" size={12} color={COLORS.brandGold} />
      </View>
      <View style={styles.content}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.meta}>{item.size}</Text>
        <View style={styles.row}>
          <View style={styles.row}>
            <Feather name="users" size={14} color={COLORS.textMuted} />
            <Text style={styles.metaSmall}> 10 người/phòng</Text>
          </View>
          <Text style={[styles.price, { color: priceColor }]}>{item.price}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: RADIUS.lg,
    backgroundColor: COLORS.surface,
    overflow: "hidden",
    marginBottom: SPACING.lg,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.05,
    shadowRadius: 22,
    elevation: 4,
  },
  image: {
    height: 180,
    width: "100%",
  },
  badge: {
    position: "absolute",
    top: SPACING.md,
    left: SPACING.md,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.9)",
    borderRadius: 999,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
  },
  badgeText: {
    fontSize: TYPOGRAPHY.bodySm,
    fontWeight: "600",
    marginRight: 4,
    color: COLORS.textDark,
  },
  favorite: {
    position: "absolute",
    top: SPACING.md,
    right: SPACING.md,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(11,43,71,0.45)",
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    padding: SPACING.lg,
  },
  name: {
    fontSize: TYPOGRAPHY.headingS,
    fontWeight: "700",
    color: COLORS.textDark,
    marginBottom: 4,
  },
  meta: {
    fontSize: TYPOGRAPHY.bodySm,
    color: COLORS.textMuted,
    marginBottom: SPACING.sm,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  metaSmall: {
    fontSize: TYPOGRAPHY.caption,
    color: COLORS.textMuted,
  },
  price: {
    fontSize: TYPOGRAPHY.headingS,
    fontWeight: "700",
  },
});

