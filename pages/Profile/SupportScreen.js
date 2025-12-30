import React from "react";
import { SafeAreaView, View, Text, StyleSheet, TouchableOpacity } from "react-native";
import HeaderBar from "../../components/ui/HeaderBar";
import { COLORS, RADIUS, SPACING, TYPOGRAPHY } from "../../constants/theme";

const faqs = [
  { id: "1", question: "Làm sao để đặt lịch trong hệ thống", answer: "Chúng tôi chấp nhận đặt lịch trực tuyến..." },
  { id: "2", question: "Làm sao để liên hệ đặt nhân viên hỗ trợ Set Design tại nhà", answer: "Bạn có thể liên hệ qua hotline hoặc chat trực tiếp trong ứng dụng." },
  { id: "3", question: "Làm sao để thanh toán", answer: "Hiện tại chúng tôi chấp nhận banking, thẻ ghi nợ và tiền mặt." },
];

export default function SupportScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.safe}>
      <HeaderBar title="Hỗ trợ và giải đáp" onBack={() => navigation.goBack?.()} />
      <View style={styles.card}>
        {faqs.map((item) => (
          <View key={item.id} style={styles.block}>
            <TouchableOpacity>
              <Text style={styles.question}>{item.question}</Text>
            </TouchableOpacity>
            <Text style={styles.answer}>{item.answer}</Text>
          </View>
        ))}
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
  block: {
    marginBottom: SPACING.lg,
  },
  question: {
    fontWeight: "700",
    color: COLORS.textDark,
    marginBottom: SPACING.xs,
  },
  answer: {
    color: COLORS.textMuted,
    lineHeight: 20,
  },
});

