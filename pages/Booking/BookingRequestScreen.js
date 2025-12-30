import React from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import HeaderBar from "../../components/ui/HeaderBar";
import PrimaryButton from "../../components/ui/PrimaryButton";
import {
  bookingStatuses,
  studios,
} from "../../constants/mockData";
import { COLORS, RADIUS, SPACING, TYPOGRAPHY } from "../../constants/theme";

export default function BookingRequestScreen({ navigation }) {
  const studio = studios[0];

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
        <View style={styles.legendRow}>
          {bookingStatuses.map((status) => (
            <View key={status.id} style={styles.legendItem}>
              <View
                style={[styles.legendDot, { backgroundColor: status.color }]}
              />
              <Text style={styles.legendLabel}>{status.label}</Text>
            </View>
          ))}
        </View>

        <View style={styles.card}>
          <Image source={{ uri: studio.image }} style={styles.cardImage} />
          <View style={styles.rating}>
            <Feather name="star" size={14} color={COLORS.brandGold} />
            <Text style={styles.ratingText}>{studio.rating}</Text>
          </View>
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>{studio.name}</Text>
            <Text style={styles.cardMeta}>{studio.size}</Text>
            <View style={styles.infoRow}>
              <View style={styles.infoRow}>
                <Feather name="clock" size={14} color={COLORS.textMuted} />
                <Text style={styles.cardMetaSmall}>16 tiếng</Text>
              </View>
              <Text style={styles.price}>4.000.000</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <PrimaryButton
          label="Tiến hành thanh toán"
          onPress={() => navigation.navigate("SelectDate")}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scroll: {
    paddingHorizontal: SPACING.lg,
  },
  legendRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.lg,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: SPACING.xs,
    width: "48%",
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
    fontWeight: "500",
  },
  card: {
    borderRadius: RADIUS.lg,
    backgroundColor: COLORS.surface,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.08,
    shadowRadius: 30,
    elevation: 5,
  },
  cardImage: {
    width: "100%",
    height: 190,
    borderTopLeftRadius: RADIUS.lg,
    borderTopRightRadius: RADIUS.lg,
  },
  rating: {
    position: "absolute",
    top: SPACING.md,
    left: SPACING.md,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.92)",
    borderRadius: 999,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
  },
  ratingText: {
    marginLeft: 4,
    fontWeight: "600",
    color: COLORS.textDark,
  },
  cardContent: {
    padding: SPACING.lg,
  },
  cardTitle: {
    fontSize: TYPOGRAPHY.headingS,
    fontWeight: "700",
    color: COLORS.textDark,
    marginBottom: 4,
  },
  cardMeta: {
    color: COLORS.textMuted,
    marginBottom: SPACING.md,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  cardMetaSmall: {
    marginLeft: 6,
    color: COLORS.textMuted,
    fontSize: TYPOGRAPHY.caption,
  },
  price: {
    fontSize: TYPOGRAPHY.headingS,
    fontWeight: "700",
    color: COLORS.brandBlue,
  },
  footer: {
    padding: SPACING.lg,
    backgroundColor: COLORS.background,
  },
});

