import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import HeaderBar from "../../components/ui/HeaderBar";
import PrimaryButton from "../../components/ui/PrimaryButton";
import { COLORS, RADIUS, SPACING, TYPOGRAPHY } from "../../constants/theme";

export default function BookingFormScreen({ navigation }) {
  const [guests, setGuests] = useState(10);
  return (
    <SafeAreaView style={styles.safe}>
      <HeaderBar
        title="Yêu cầu đặt phòng"
        onBack={() => navigation.goBack?.()}
        rightIcon="more-vertical"
      />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={{ paddingBottom: SPACING.xxl }}
      >
        <View style={styles.card}>
          <Text style={styles.sectionLabel}>Ngày</Text>
          <View style={styles.rowBetween}>
            <DateInfo label="Check - In" date="15/09/2025" time="12:00" />
            <View style={styles.divider} />
            <DateInfo label="Check - Out" date="16/09/2025" time="04:00" />
          </View>
          <View style={styles.spacer} />
          <View style={styles.rowBetween}>
            <Text style={styles.sectionLabel}>Khách hàng (Số lượng)</Text>
            <Counter guests={guests} setGuests={setGuests} />
          </View>
          <View style={styles.spacer} />
          <View style={styles.paymentRow}>
            <View>
              <Text style={styles.sectionLabel}>Phương thức thanh toán</Text>
              <Text style={styles.paymentHint}>Banking ******6587</Text>
            </View>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => navigation.navigate("PaymentMethod")}
            >
              <Text style={styles.editText}>Edit</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionLabel}>Chi tiết thanh toán</Text>
          <DetailRow label="Thời gian : 16 tiếng" value="4.000.000" />
          <DetailRow label="Phí phát sinh" value="50.000" />
          <DetailRow label="Phí dịch vụ" value="0" />
          <DetailRow label="Phí phụ thu (dụng cụ, phòng,...)" value="0" />
          <View style={styles.separator} />
          <DetailRow
            label="Tổng thanh toán"
            value="4.070.000 (đồng)"
            bold
          />
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <PrimaryButton
          label="Tiến hành thanh toán"
          onPress={() => navigation.navigate("Checkout")}
        />
      </View>
    </SafeAreaView>
  );
}

const DateInfo = ({ label, date, time }) => (
  <View style={styles.dateInfo}>
    <Text style={styles.helperLabel}>{label}</Text>
    <View style={styles.dateRow}>
      <Feather name="clock" size={16} color={COLORS.brandBlue} />
      <Text style={styles.timeText}>{time}</Text>
    </View>
    <View style={styles.dateRow}>
      <Feather name="calendar" size={16} color={COLORS.textMuted} />
      <Text style={styles.dateText}>{date}</Text>
    </View>
  </View>
);

const Counter = ({ guests, setGuests }) => (
  <View style={styles.counterContainer}>
    <TouchableOpacity
      style={styles.circleButton}
      onPress={() => setGuests((prev) => Math.max(1, prev - 1))}
    >
      <Feather name="minus" size={16} color={COLORS.textDark} />
    </TouchableOpacity>
    <Text style={styles.counterValue}>{guests}</Text>
    <TouchableOpacity
      style={[styles.circleButton, styles.primaryCircle]}
      onPress={() => setGuests((prev) => prev + 1)}
    >
      <Feather name="plus" size={16} color={COLORS.surface} />
    </TouchableOpacity>
  </View>
);

const DetailRow = ({ label, value, bold }) => (
  <View style={styles.detailRow}>
    <Text style={[styles.detailLabel, bold && styles.bold]}>{label}</Text>
    <Text style={[styles.detailValue, bold && styles.bold]}>{value}</Text>
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
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.06,
    shadowRadius: 30,
    elevation: 4,
  },
  sectionLabel: {
    fontSize: TYPOGRAPHY.headingS,
    fontWeight: "600",
    color: COLORS.textDark,
    marginBottom: SPACING.sm,
  },
  rowBetween: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  dateInfo: {
    flex: 1,
  },
  divider: {
    width: 1,
    backgroundColor: COLORS.border,
    marginHorizontal: SPACING.md,
    height: 86,
  },
  helperLabel: {
    color: COLORS.textMuted,
    fontSize: TYPOGRAPHY.bodySm,
    marginBottom: SPACING.xs,
  },
  dateRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: SPACING.xs,
  },
  timeText: {
    marginLeft: 8,
    fontSize: TYPOGRAPHY.body,
    color: COLORS.textDark,
    fontWeight: "600",
  },
  dateText: {
    marginLeft: 8,
    color: COLORS.textMuted,
  },
  spacer: {
    height: SPACING.xl,
  },
  counterContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  circleButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryCircle: {
    backgroundColor: COLORS.brandBlue,
    borderColor: COLORS.brandBlue,
  },
  counterValue: {
    marginHorizontal: SPACING.md,
    fontSize: TYPOGRAPHY.headingS,
    fontWeight: "700",
    color: COLORS.textDark,
  },
  paymentRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  paymentHint: {
    color: COLORS.textMuted,
  },
  editButton: {
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
  },
  editText: {
    color: COLORS.brandBlue,
    fontWeight: "600",
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: SPACING.md,
  },
  detailLabel: {
    color: COLORS.textMuted,
  },
  detailValue: {
    color: COLORS.textDark,
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
  },
});

