import React from "react";
import { SafeAreaView, View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import PrimaryButton from "../../components/ui/PrimaryButton";
import { COLORS, RADIUS, SPACING, TYPOGRAPHY } from "../../constants/theme";
import { studios } from "../../constants/mockData";

export default function ShareSheetScreen({ navigation }) {
  const studio = studios[0];
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.sheet}>
        <View style={styles.handle} />
        <Text style={styles.title}>Chia sẻ địa điểm</Text>
        <View style={styles.card}>
          <Image source={{ uri: studio.image }} style={styles.thumbnail} />
          <View style={{ flex: 1, marginLeft: SPACING.md }}>
            <Text style={styles.name}>{studio.name}</Text>
            <Text style={styles.meta}>{studio.size}</Text>
            <Text style={styles.price}>{studio.price}</Text>
          </View>
          <Text style={styles.rating}>{studio.rating}</Text>
        </View>
        <View style={styles.linkBox}>
          <Text style={styles.linkText}>https://localhost:8000/studio-1</Text>
          <TouchableOpacity style={styles.copyButton}>
            <Text style={styles.copyText}>Copy</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.shareRow}>
          {["Airdrop", "Whatsapp", "Facebook", "Instagram"].map((app) => (
            <View key={app} style={styles.shareIcon}>
              <Text style={styles.shareLabel}>{app.slice(0, 1)}</Text>
            </View>
          ))}
        </View>
        <PrimaryButton label="Đóng" onPress={() => navigation.goBack()} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: RADIUS.xl,
    borderTopRightRadius: RADIUS.xl,
    padding: SPACING.lg,
  },
  handle: {
    width: 56,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: COLORS.border,
    alignSelf: "center",
    marginBottom: SPACING.md,
  },
  title: {
    fontSize: TYPOGRAPHY.headingS,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: SPACING.md,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.background,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.md,
  },
  thumbnail: {
    width: 56,
    height: 56,
    borderRadius: RADIUS.md,
  },
  name: {
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
  rating: {
    fontWeight: "700",
    color: COLORS.textDark,
  },
  linkBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.background,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.md,
  },
  linkText: {
    flex: 1,
    color: COLORS.textMuted,
  },
  copyButton: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.brandBlue,
  },
  copyText: {
    color: COLORS.surface,
  },
  shareRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: SPACING.lg,
  },
  shareIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.background,
    alignItems: "center",
    justifyContent: "center",
  },
  shareLabel: {
    color: COLORS.textDark,
    fontWeight: "700",
  },
});

