import React from "react";
import { SafeAreaView, View, Text, StyleSheet, Image, ScrollView } from "react-native";
import HeaderBar from "../../components/ui/HeaderBar";
import PrimaryButton from "../../components/ui/PrimaryButton";
import { COLORS, RADIUS, SPACING, TYPOGRAPHY } from "../../constants/theme";
import { setDesigns } from "../../constants/mockData";

export default function SetDesignHighlightScreen({ navigation, route }) {
  const set = route?.params?.item || setDesigns[0];
  return (
    <SafeAreaView style={styles.safe}>
      <HeaderBar title="Set Design" onBack={() => navigation.goBack?.()} />
      <ScrollView>
        <Image source={{ uri: set.image }} style={styles.hero} />
        <View style={styles.sheet}>
          <Text style={styles.title}>{set.name}</Text>
          <View style={styles.priceRow}>
            <Text style={styles.price}>{set.price}</Text>
            <Text style={styles.oldPrice}>{set.oldPrice}</Text>
          </View>
          <Text style={styles.body}>
            S Cộng Studio chân thành cảm ơn Rạp đã tin tưởng lựa chọn không gian của chúng tôi để thực hiện bộ sưu tập thời trang mới...
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {set.gallery.map((img) => (
              <Image key={img} source={{ uri: img }} style={styles.gallery} />
            ))}
          </ScrollView>
          <PrimaryButton
            label="Liên hệ (để biết thêm chi tiết)"
            onPress={() => navigation.navigate("SetDesignForm")}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  hero: { width: "100%", height: 320 },
  sheet: {
    marginTop: -40,
    borderTopLeftRadius: RADIUS.xl,
    borderTopRightRadius: RADIUS.xl,
    padding: SPACING.xl,
    backgroundColor: COLORS.surface,
  },
  title: {
    fontSize: TYPOGRAPHY.headingM,
    fontWeight: "700",
    color: COLORS.textDark,
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: SPACING.sm,
  },
  price: {
    color: COLORS.brandBlue,
    fontWeight: "700",
    fontSize: TYPOGRAPHY.headingS,
    marginRight: SPACING.sm,
  },
  oldPrice: {
    color: COLORS.danger,
    textDecorationLine: "line-through",
  },
  body: {
    color: COLORS.textMuted,
    marginBottom: SPACING.lg,
  },
  gallery: {
    width: 120,
    height: 120,
    borderRadius: RADIUS.lg,
    marginRight: SPACING.md,
  },
});

