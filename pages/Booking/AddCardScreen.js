import React from "react";
import { SafeAreaView, View, Text, StyleSheet, TextInput } from "react-native";
import HeaderBar from "../../components/ui/HeaderBar";
import PrimaryButton from "../../components/ui/PrimaryButton";
import { COLORS, RADIUS, SPACING, TYPOGRAPHY } from "../../constants/theme";

export default function AddCardScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.safe}>
      <HeaderBar title="Thêm thẻ mới" onBack={() => navigation.goBack?.()} />
      <View style={styles.cardPreview}>
        <Text style={styles.cardBrand}>Maestro Kard</Text>
        <Text style={styles.cardNumber}>2894 - 8799 - 4432 - 9432</Text>
        <View style={styles.rowBetween}>
          <View>
            <Text style={styles.cardLabel}>Holder Name</Text>
            <Text style={styles.cardValue}>DAO QUANG DAT</Text>
          </View>
          <View>
            <Text style={styles.cardLabel}>Exp</Text>
            <Text style={styles.cardValue}>06/27</Text>
          </View>
        </View>
      </View>

      <View style={styles.form}>
        <LabelInput label="Số thẻ" placeholder="Vui lòng điền số thẻ" />
        <LabelInput label="Họ tên chủ tài khoản" placeholder="Vui lòng điền họ tên" />
        <View style={styles.rowBetween}>
          <View style={{ flex: 1, marginRight: SPACING.sm }}>
            <LabelInput label="Hết hạn" placeholder="MM/YY" />
          </View>
          <View style={{ flex: 1, marginLeft: SPACING.sm }}>
            <LabelInput label="Mã CVV" placeholder="CVV" secureTextEntry />
          </View>
        </View>
      </View>

      <View style={styles.footer}>
        <PrimaryButton
          label="Thêm thẻ"
          onPress={() => navigation.navigate("CardSuccess")}
        />
      </View>
    </SafeAreaView>
  );
}

const LabelInput = ({ label, ...rest }) => (
  <View style={{ marginBottom: SPACING.lg }}>
    <Text style={styles.label}>{label}</Text>
    <TextInput
      style={styles.input}
      placeholderTextColor={COLORS.textMuted}
      {...rest}
    />
  </View>
);

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  cardPreview: {
    margin: SPACING.lg,
    padding: SPACING.xl,
    borderRadius: RADIUS.xl,
    backgroundColor: "#5474F6",
  },
  cardBrand: {
    color: COLORS.surface,
    fontSize: TYPOGRAPHY.headingS,
    fontWeight: "600",
    marginBottom: SPACING.md,
  },
  cardNumber: {
    color: COLORS.surface,
    fontSize: TYPOGRAPHY.headingS,
    letterSpacing: 2,
    marginBottom: SPACING.lg,
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardLabel: {
    color: "#D1DBFF",
    fontSize: TYPOGRAPHY.caption,
  },
  cardValue: {
    color: COLORS.surface,
    fontSize: TYPOGRAPHY.body,
    fontWeight: "600",
  },
  form: {
    paddingHorizontal: SPACING.lg,
  },
  label: {
    fontWeight: "600",
    color: COLORS.textDark,
    marginBottom: SPACING.xs,
  },
  input: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  footer: {
    padding: SPACING.lg,
  },
});

