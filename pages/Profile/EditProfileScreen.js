import React from "react";
import { SafeAreaView, View, Text, StyleSheet, TextInput } from "react-native";
import HeaderBar from "../../components/ui/HeaderBar";
import PrimaryButton from "../../components/ui/PrimaryButton";
import { COLORS, RADIUS, SPACING, TYPOGRAPHY } from "../../constants/theme";

export default function EditProfileScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.safe}>
      <HeaderBar title="Hồ sơ" onBack={() => navigation.goBack?.()} />
      <View style={styles.form}>
        <LabelInput label="Tên của bạn" value="Dat Quang" />
        <LabelInput label="Tên tài khoản" value="datquang0103" />
        <LabelInput label="Email" value="datquang0103@gmail.com" />
        <LabelInput label="Phone" value="+84 752 213 463" />
      </View>
      <View style={styles.footer}>
        <PrimaryButton label="Save Changes" onPress={() => navigation.goBack()} />
      </View>
    </SafeAreaView>
  );
}

const LabelInput = ({ label, value }) => (
  <View style={styles.inputBlock}>
    <Text style={styles.label}>{label}</Text>
    <TextInput style={styles.input} value={value} editable={false} />
  </View>
);

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  form: {
    padding: SPACING.lg,
  },
  inputBlock: {
    marginBottom: SPACING.lg,
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

