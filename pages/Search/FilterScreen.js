import React from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import HeaderBar from "../../components/ui/HeaderBar";
import PrimaryButton from "../../components/ui/PrimaryButton";
import { COLORS, RADIUS, SPACING, TYPOGRAPHY } from "../../constants/theme";

const facilities = [
  "Wifi miễn phí",
  "Chỗ Make Up",
  "Phòng nghỉ ngơi",
  "Nhà vệ sinh riêng",
];

export default function FilterScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.safe}>
      <HeaderBar title="Lọc theo" onBack={() => navigation.goBack?.()} />
      <View style={styles.card}>
        <Text style={styles.label}>Tìm</Text>
        <TouchableOpacity style={styles.dropdown}>
          <Text style={styles.dropdownText}>10 người/100m2</Text>
        </TouchableOpacity>

        <Text style={styles.label}>Giá</Text>
        <View style={styles.slider}>
          <View style={styles.sliderTrack} />
          <View style={[styles.thumb, { left: "20%" }]} />
          <View style={[styles.thumb, { left: "60%" }]} />
        </View>
        <Text style={styles.hint}>0 - 50.000.000 VND</Text>

        <View style={styles.switchRow}>
          <Text style={styles.label}>Đặt tức thì</Text>
          <View style={styles.switch}>
            <View style={styles.switchCircle} />
          </View>
        </View>

        <Text style={styles.label}>Cơ sở vật chất</Text>
        {facilities.map((item, idx) => (
          <View key={item} style={styles.checkboxRow}>
            <View style={[styles.checkbox, idx < 2 && styles.checkboxActive]} />
            <Text style={styles.checkboxLabel}>{item}</Text>
          </View>
        ))}

        <Text style={styles.label}>Đánh giá</Text>
        <View style={styles.ratingRow}>
          {[5, 4, 3, 2, 1].map((star, index) => (
            <View
              key={star}
              style={[
                styles.ratingChip,
                index === 1 && styles.ratingChipActive,
              ]}
            >
              <Text
                style={[
                  styles.ratingText,
                  index === 1 && styles.ratingTextActive,
                ]}
              >
                {star}
              </Text>
            </View>
          ))}
        </View>
      </View>
      <View style={styles.footer}>
        <PrimaryButton label="Xác nhận" onPress={() => navigation.goBack()} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  card: {
    margin: SPACING.lg,
    padding: SPACING.lg,
    borderRadius: RADIUS.xl,
    backgroundColor: COLORS.surface,
  },
  label: {
    fontSize: TYPOGRAPHY.headingS,
    fontWeight: "600",
    color: COLORS.textDark,
    marginBottom: SPACING.sm,
  },
  dropdown: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.lg,
  },
  dropdownText: {
    color: COLORS.textDark,
  },
  slider: {
    height: 40,
    justifyContent: "center",
    marginBottom: SPACING.sm,
  },
  sliderTrack: {
    height: 6,
    backgroundColor: COLORS.border,
    borderRadius: 3,
  },
  thumb: {
    position: "absolute",
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: COLORS.brandBlue,
    top: 10,
  },
  hint: {
    color: COLORS.textMuted,
    marginBottom: SPACING.lg,
  },
  switchRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SPACING.lg,
  },
  switch: {
    width: 50,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.brandBlue,
    justifyContent: "center",
    padding: 4,
  },
  switchCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: COLORS.surface,
    alignSelf: "flex-end",
  },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: SPACING.sm,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginRight: SPACING.sm,
  },
  checkboxActive: {
    backgroundColor: COLORS.brandBlue,
    borderColor: COLORS.brandBlue,
  },
  checkboxLabel: {
    color: COLORS.textDark,
  },
  ratingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: SPACING.sm,
  },
  ratingChip: {
    flex: 1,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginRight: SPACING.sm,
    paddingVertical: SPACING.sm,
    alignItems: "center",
  },
  ratingChipActive: {
    backgroundColor: COLORS.brandBlue,
    borderColor: COLORS.brandBlue,
  },
  ratingText: {
    color: COLORS.textDark,
    fontWeight: "600",
  },
  ratingTextActive: {
    color: COLORS.surface,
  },
  footer: {
    padding: SPACING.lg,
  },
});

