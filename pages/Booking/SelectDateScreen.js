import React from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
} from "react-native";
import HeaderBar from "../../components/ui/HeaderBar";
import PrimaryButton from "../../components/ui/PrimaryButton";
import { COLORS, RADIUS, SPACING, TYPOGRAPHY } from "../../constants/theme";
import { bookingStatuses } from "../../constants/mockData";

const WEEKS = [
  [0, 0, 0, 0, 0, 0, 1],
  [2, 3, 4, 5, 6, 7, 8],
  [9, 10, 11, 12, 13, 14, 15],
  [16, 17, 18, 19, 20, 21, 22],
  [23, 24, 25, 26, 27, 28, 29],
  [30, 0, 0, 0, 0, 0, 0],
];

const STATUS_BY_DATE = {
  8: "done",
  9: "done",
  10: "done",
  11: "done",
  12: "done",
  15: "booking",
  16: "booking",
  21: "approved",
  22: "approved",
  23: "approved",
  28: "pending",
  29: "pending",
  30: "pending",
};

const COLOR_BY_STATUS = bookingStatuses.reduce((acc, status) => {
  acc[status.id] = status.color;
  return acc;
}, {});

export default function SelectDateScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.safe}>
      <HeaderBar
        title="Yêu cầu đặt phòng"
        onBack={() => navigation.goBack?.()}
        rightIcon="more-vertical"
      />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.legend}>
          {bookingStatuses.map((status) => (
            <View key={status.id} style={styles.legendItem}>
              <View
                style={[styles.legendDot, { backgroundColor: status.color }]}
              />
              <Text style={styles.legendLabel}>{status.label}</Text>
            </View>
          ))}
        </View>

        <View style={styles.calendarCard}>
          <Text style={styles.calendarTitle}>Chọn ngày</Text>
          <Text style={styles.calendarMonth}>Tháng 9 | 2025</Text>
          <View style={styles.weekHeader}>
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <Text key={day} style={styles.weekLabel}>
                {day}
              </Text>
            ))}
          </View>
          {WEEKS.map((week, idx) => (
            <View key={idx} style={styles.weekRow}>
              {week.map((day, index) => {
                if (day === 0) {
                  return <View key={index} style={styles.dayCell} />;
                }
                const status = STATUS_BY_DATE[day];
                const isSelected = day === 16;
                return (
                  <Pressable
                    key={index}
                    style={[
                      styles.dayCell,
                      status && {
                        backgroundColor:
                          COLOR_BY_STATUS[status] + "22" || COLORS.surface,
                      },
                    ]}
                  >
                    <View
                      style={[
                        styles.dayCircle,
                        isSelected && {
                          borderWidth: 2,
                          borderColor: COLORS.brandBlue,
                        },
                        status && { backgroundColor: COLORS.surface },
                      ]}
                    >
                      <Text
                        style={[
                          styles.dayText,
                          status && { color: COLOR_BY_STATUS[status] },
                          isSelected && { color: COLORS.brandBlue },
                        ]}
                      >
                        {day}
                      </Text>
                    </View>
                  </Pressable>
                );
              })}
            </View>
          ))}
          <View style={styles.calendarActions}>
            <Pressable style={styles.secondary}>
              <Text style={styles.secondaryText}>Huỷ</Text>
            </Pressable>
            <PrimaryButton
              style={styles.primary}
              label="Xác nhận"
              onPress={() => navigation.navigate("BookingForm")}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xxl,
  },
  legend: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    padding: SPACING.md,
    borderRadius: RADIUS.lg,
    backgroundColor: COLORS.surface,
    marginBottom: SPACING.xl,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    width: "48%",
    marginVertical: 6,
  },
  legendDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: SPACING.sm,
  },
  legendLabel: {
    fontSize: TYPOGRAPHY.bodySm,
    color: COLORS.textDark,
  },
  calendarCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    padding: SPACING.xl,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.08,
    shadowRadius: 30,
    elevation: 4,
  },
  calendarTitle: {
    fontSize: TYPOGRAPHY.headingS,
    fontWeight: "700",
    color: COLORS.textDark,
    textAlign: "center",
  },
  calendarMonth: {
    textAlign: "center",
    color: COLORS.textMuted,
    marginBottom: SPACING.lg,
  },
  weekHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: SPACING.sm,
  },
  weekLabel: {
    flex: 1,
    textAlign: "center",
    fontSize: TYPOGRAPHY.caption,
    color: COLORS.textMuted,
  },
  weekRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: SPACING.sm,
  },
  dayCell: {
    flex: 1,
    alignItems: "center",
    paddingVertical: SPACING.sm,
  },
  dayCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
  },
  dayText: {
    fontSize: TYPOGRAPHY.body,
    color: COLORS.textDark,
    fontWeight: "600",
  },
  calendarActions: {
    marginTop: SPACING.xl,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  secondary: {
    flex: 1,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginRight: SPACING.md,
    alignItems: "center",
  },
  secondaryText: {
    fontSize: TYPOGRAPHY.headingS,
    color: COLORS.textDark,
    fontWeight: "600",
  },
  primary: {
    flex: 1,
  },
});

