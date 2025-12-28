import React from "react";
import { SafeAreaView, View, Text, StyleSheet, Image } from "react-native";
import HeaderBar from "../../components/ui/HeaderBar";
import { COLORS, RADIUS, SPACING, TYPOGRAPHY } from "../../constants/theme";
import PrimaryButton from "../../components/ui/PrimaryButton";

export default function BookingDetailScreen({ route, navigation }) {
  const { item, type } = route.params || {};
  const isEquipment = type === "equip";

  return (
    <SafeAreaView style={styles.safe}>
      <HeaderBar
        title="Lịch sử"
        onBack={() => navigation.goBack?.()}
        rightIcon="more-vertical"
      />
      <View style={styles.card}>
        <View style={styles.row}>
          <Image source={{ uri: item.image }} style={styles.thumbnail} />
          <View style={{ flex: 1, marginLeft: SPACING.md }}>
            <Text style={styles.title}>{item.name}</Text>
            <Text style={styles.meta}>{item.size || "6 tiếng"}</Text>
            <Text style={styles.price}>{item.price}</Text>
          </View>
          <View style={styles.rating}>
            <Text style={styles.ratingText}>{item.rating || "4.5"}</Text>
          </View>
        </View>
        <Text style={styles.sectionLabel}>
          {isEquipment ? "Dụng cụ của bạn" : "Phòng của bạn"}
        </Text>
        {!isEquipment ? (
          <View style={styles.mapPlaceholder}>
            <Text style={styles.mapText}>S Cộng Studio</Text>
          </View>
        ) : null}
        <View style={styles.infoBlock}>
          <Info line1="Ngày" line2="15 - 16 Tháng 9 2025" />
          <Info line1={isEquipment ? "Thời gian" : "Khách hàng"} line2={isEquipment ? "6 tiếng" : "10 người/phòng"} />
          <Info line1="Số điện thoại" line2="0865930428" />
        </View>
        {!isEquipment ? (
          <View style={styles.barcode}>
            <Text style={styles.barcodeText}>06158310-5427-471d-af1f-bd9029b</Text>
          </View>
        ) : null}
      </View>
      <View style={styles.footer}>
        <PrimaryButton label="Tiếp tục" onPress={() => navigation.goBack()} />
      </View>
    </SafeAreaView>
  );
}

const Info = ({ line1, line2 }) => (
  <View style={styles.infoRow}>
    <Text style={styles.infoLabel}>{line1}</Text>
    <Text style={styles.infoValue}>{line2}</Text>
  </View>
);

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  card: {
    margin: SPACING.lg,
    padding: SPACING.xl,
    borderRadius: RADIUS.xl,
    backgroundColor: COLORS.surface,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.05,
    shadowRadius: 30,
    elevation: 4,
    flex: 1,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: SPACING.lg,
  },
  thumbnail: {
    width: 92,
    height: 92,
    borderRadius: RADIUS.lg,
  },
  title: {
    fontSize: TYPOGRAPHY.headingS,
    fontWeight: "700",
    color: COLORS.textDark,
  },
  meta: {
    color: COLORS.textMuted,
  },
  price: {
    color: COLORS.brandBlue,
    fontWeight: "700",
    marginTop: 4,
  },
  rating: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.background,
    alignItems: "center",
    justifyContent: "center",
  },
  ratingText: {
    fontWeight: "700",
    color: COLORS.textDark,
  },
  sectionLabel: {
    fontSize: TYPOGRAPHY.headingS,
    fontWeight: "600",
    marginBottom: SPACING.md,
  },
  mapPlaceholder: {
    height: 140,
    borderRadius: RADIUS.lg,
    backgroundColor: COLORS.background,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: SPACING.lg,
  },
  mapText: {
    color: COLORS.textDark,
    fontWeight: "600",
  },
  infoBlock: {
    marginBottom: SPACING.lg,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: SPACING.md,
  },
  infoLabel: {
    color: COLORS.textMuted,
  },
  infoValue: {
    color: COLORS.textDark,
    fontWeight: "600",
  },
  barcode: {
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.md,
    alignItems: "center",
  },
  barcodeText: {
    letterSpacing: 2,
    fontWeight: "700",
    color: COLORS.textDark,
  },
  footer: {
    padding: SPACING.lg,
  },
});

