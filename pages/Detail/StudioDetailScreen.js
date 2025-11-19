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
import { equipments, reviews } from "../../constants/mockData";

export default function StudioDetailScreen({ route, navigation }) {
  const { item } = route.params || {};
  return (
    <SafeAreaView style={styles.safe}>
      <HeaderBar title="Chi tiết" onBack={() => navigation.goBack?.()} rightIcon="more-vertical" />
      <ScrollView contentContainerStyle={{ paddingBottom: SPACING.xxl }}>
        <Image source={{ uri: item?.image }} style={styles.hero} />
        <View style={styles.sheet}>
          <View style={styles.rowBetween}>
            <View>
              <Text style={styles.title}>{item?.name}</Text>
              <Text style={styles.meta}>{item?.size}</Text>
            </View>
            <View style={styles.rating}>
              <Text style={styles.ratingText}>{item?.rating}</Text>
            </View>
          </View>
          <Text style={styles.description}>
            Nơi lý tưởng cho những ai tìm kiếm trải nghiệm chụp ảnh sang trọng và yên bình trong
            không gian trắng tinh tế rộng {item?.size}.
          </Text>

          <SectionHeader title="Dụng Cụ" onPress={() => navigation.navigate("EquipmentList")} />
          {equipments.map((eq) => (
            <View key={eq.id} style={styles.equipmentRow}>
              <Image source={{ uri: eq.image }} style={styles.equipmentImage} />
              <View style={{ flex: 1, marginLeft: SPACING.md }}>
                <Text style={styles.equipmentName}>{eq.name}</Text>
                <Text style={styles.cardPrice}>{eq.price}</Text>
                <Text style={styles.oldPrice}>{eq.oldPrice}</Text>
              </View>
              <TouchableOpacity>
                <Text style={styles.link}>Xem thêm</Text>
              </TouchableOpacity>
            </View>
          ))}

          <SectionHeader title="Đánh giá" onPress={() => navigation.navigate("Reviews")} />
          {reviews.slice(0, 2).map((review) => (
            <View key={review.id} style={styles.reviewRow}>
              <View style={styles.avatar} />
              <View style={{ flex: 1, marginLeft: SPACING.md }}>
                <Text style={styles.reviewName}>{review.name}</Text>
                <Text style={styles.reviewText}>{review.comment}</Text>
              </View>
              <Text style={styles.reviewRating}>{review.rating}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
      <View style={styles.bottomBar}>
        <View>
          <Text style={styles.priceLabel}>Giá (tạm tính)</Text>
          <Text style={styles.totalPrice}>{item?.price}</Text>
        </View>
        <PrimaryButton
          style={{ flex: 1, marginLeft: SPACING.md }}
          label="Đặt ngay"
          onPress={() => navigation.navigate("BookingRequest")}
        />
      </View>
    </SafeAreaView>
  );
}

const SectionHeader = ({ title, onPress }) => (
  <View style={styles.sectionHeader}>
    <Text style={styles.sectionTitle}>{title}</Text>
    <TouchableOpacity onPress={onPress}>
      <Text style={styles.link}>Xem thêm</Text>
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  hero: {
    width: "100%",
    height: 280,
  },
  sheet: {
    marginTop: -40,
    borderTopLeftRadius: RADIUS.xl,
    borderTopRightRadius: RADIUS.xl,
    backgroundColor: COLORS.surface,
    padding: SPACING.xl,
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: TYPOGRAPHY.headingM,
    fontWeight: "700",
    color: COLORS.textDark,
  },
  meta: {
    color: COLORS.textMuted,
  },
  rating: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.background,
    alignItems: "center",
    justifyContent: "center",
  },
  ratingText: {
    fontWeight: "700",
    color: COLORS.textDark,
  },
  description: {
    color: COLORS.textMuted,
    marginVertical: SPACING.lg,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: SPACING.lg,
    marginBottom: SPACING.md,
  },
  sectionTitle: {
    fontWeight: "700",
    color: COLORS.textDark,
  },
  link: {
    color: COLORS.brandBlue,
    fontWeight: "600",
  },
  equipmentRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: SPACING.md,
  },
  equipmentImage: {
    width: 72,
    height: 72,
    borderRadius: RADIUS.lg,
  },
  equipmentName: {
    fontWeight: "600",
    color: COLORS.textDark,
  },
  cardPrice: {
    color: COLORS.brandBlue,
    fontWeight: "700",
  },
  oldPrice: {
    color: COLORS.danger,
    textDecorationLine: "line-through",
  },
  reviewRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: SPACING.md,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.background,
  },
  reviewName: {
    fontWeight: "600",
    color: COLORS.textDark,
  },
  reviewText: {
    color: COLORS.textMuted,
  },
  reviewRating: {
    fontWeight: "700",
    color: COLORS.textDark,
  },
  bottomBar: {
    flexDirection: "row",
    alignItems: "center",
    padding: SPACING.lg,
    backgroundColor: COLORS.surface,
    borderTopWidth: 1,
    borderColor: COLORS.border,
  },
  priceLabel: {
    color: COLORS.textMuted,
  },
  totalPrice: {
    color: COLORS.brandBlue,
    fontWeight: "700",
    fontSize: TYPOGRAPHY.headingS,
  },
});

