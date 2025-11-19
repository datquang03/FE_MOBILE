import React from "react";
import { SafeAreaView, ScrollView, Text, StyleSheet } from "react-native";
import HeaderBar from "../../components/ui/HeaderBar";
import { COLORS, SPACING, TYPOGRAPHY } from "../../constants/theme";

export default function PrivacyScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.safe}>
      <HeaderBar title="Điều khoản và chính sách" onBack={() => navigation.goBack?.()} />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.heading}>Điều khoản</Text>
        <Text style={styles.body}>{PLACEHOLDER}</Text>
        <Text style={styles.heading}>Thay đổi đối với dịch vụ/điều khoản</Text>
        <Text style={styles.body}>{PLACEHOLDER}</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const PLACEHOLDER =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec vel felis facilisis, feugiat enim sagittis, porta tortor. Suspendisse potenti. Fusce vulputate, tortor quis porta posuere, erat leo auctor elit, ut semper nulla ipsum in libero. Nullam vitae augue at erat posuere ultricies. Phasellus porta, purus eget bibendum suscipit, lorem elit cursus tortor, id fringilla turpis nibh ut ipsum. Vivamus nec viverra lorem. Duis eget orci finibus, pulvinar neque at, aliquet lorem. Pellentesque commodo tempus nibh sed aliquet. Donec at nunc tortor. Interdum et malesuada fames ac ante ipsum primis in faucibus.";

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    padding: SPACING.lg,
  },
  heading: {
    fontSize: TYPOGRAPHY.headingS,
    fontWeight: "700",
    color: COLORS.textDark,
    marginBottom: SPACING.sm,
  },
  body: {
    color: COLORS.textMuted,
    lineHeight: 22,
    marginBottom: SPACING.xl,
  },
});

