import React from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import HeaderBar from "../../components/ui/HeaderBar";
import PrimaryButton from "../../components/ui/PrimaryButton";
import { COLORS, RADIUS, SPACING, TYPOGRAPHY } from "../../constants/theme";
import { studios } from "../../constants/mockData";

export default function CheckoutScreen({ navigation }) {
  const studio = studios[0];
  return (
    <SafeAreaView style={styles.safe}>
      <HeaderBar
        title="Thanh toán"
        onBack={() => navigation.goBack?.()}
        rightIcon="more-vertical"
      />
      <ScrollView style={styles.scroll}>
        <View style={styles.card}>
          <View style={styles.topRow}>
            <Image source={{ uri: studio.image }} style={styles.thumbnail} />
            <View style={{ flex: 1, marginLeft: SPACING.md }}>
              <Text style={styles.studioName}>{studio.name}</Text>
              <Text style={styles.studioMeta}>{studio.size}</Text>
              <Text style={styles.price}>{studio.price}</Text>
            </View>
            <View style={styles.ratingBadge}>
              <Text style={styles.ratingText}>4.5</Text>
            </View>
          </View>
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Phòng của bạn</Text>
            <InfoRow icon="calendar" label="Ngày" value="15 - 16 Tháng 9 2025" />
            <InfoRow icon="user" label="Khách hàng" value="10 người/phòng" />
            <InfoRow icon="mail" label="Email" value="dat@gmail.com" />
            <InfoRow icon="phone" label="Số điện thoại" value="0828213468" />
          </View>
          <TouchableOpacity
            style={styles.setDesignRow}
            onPress={() => navigation.navigate("SelectSetDesign")}
          >
            <View>
              <Text style={styles.sectionLabel}>Set Design (tuỳ chọn)</Text>
              <Text style={styles.setDesignHint}>Chọn gói</Text>
            </View>
            <Text style={styles.linkText}>Chọn gói</Text>
          </TouchableOpacity>
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Chi tiết thanh toán</Text>
            <InfoRow label="Giá" value="4.070.000" />
            <InfoRow label="Set design" value="0" />
            <View style={styles.separator} />
            <InfoRow label="Total price" value="4.070.000 (đồng)" bold />
          </View>
        </View>
      </ScrollView>
      <View style={styles.footer}>
        <PrimaryButton
          label="Chọn phương thức thanh toán"
          onPress={() => navigation.navigate("PaymentMethod")}
        />
      </View>
    </SafeAreaView>
  );
}

const InfoRow = ({ icon, label, value, bold }) => (
  <View style={styles.infoRow}>
    {icon ? (
      <View style={styles.iconCircle}>
        <Text style={styles.iconText}>{icon.slice(0, 1).toUpperCase()}</Text>
      </View>
    ) : null}
    <View style={{ flex: 1 }}>
      <Text style={styles.infoLabel}>{label}</Text>
    </View>
    <Text style={[styles.infoValue, bold && styles.bold]}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scroll: {
    paddingHorizontal: SPACING.lg,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    padding: SPACING.xl,
    marginBottom: SPACING.xl,
    marginTop: SPACING.md,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.06,
    shadowRadius: 30,
    elevation: 4,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: SPACING.lg,
  },
  thumbnail: {
    width: 88,
    height: 88,
    borderRadius: RADIUS.lg,
  },
  studioName: {
    fontSize: TYPOGRAPHY.headingS,
    fontWeight: "700",
    color: COLORS.textDark,
  },
  studioMeta: {
    color: COLORS.textMuted,
    marginVertical: 4,
  },
  price: {
    color: COLORS.brandBlue,
    fontWeight: "700",
  },
  ratingBadge: {
    backgroundColor: COLORS.surfaceAlt,
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  ratingText: {
    color: COLORS.surface,
    fontWeight: "700",
  },
  section: {
    marginBottom: SPACING.xl,
  },
  sectionLabel: {
    fontSize: TYPOGRAPHY.headingS,
    fontWeight: "600",
    color: COLORS.textDark,
    marginBottom: SPACING.sm,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: SPACING.sm,
  },
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.background,
    alignItems: "center",
    justifyContent: "center",
    marginRight: SPACING.sm,
  },
  iconText: {
    fontWeight: "600",
    color: COLORS.brandBlue,
  },
  infoLabel: {
    color: COLORS.textMuted,
  },
  infoValue: {
    color: COLORS.textDark,
    fontWeight: "600",
  },
  setDesignRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: SPACING.xl,
  },
  setDesignHint: {
    color: COLORS.textMuted,
  },
  linkText: {
    color: COLORS.brandBlue,
    fontWeight: "600",
  },
  separator: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: SPACING.md,
  },
  bold: {
    fontWeight: "700",
    color: COLORS.textDark,
  },
  footer: {
    padding: SPACING.lg,
    backgroundColor: COLORS.background,
  },
});

