import React from "react";
import { SafeAreaView, View, Text, StyleSheet, TextInput, Image, TouchableOpacity } from "react-native";
import HeaderBar from "../../components/ui/HeaderBar";
import PrimaryButton from "../../components/ui/PrimaryButton";
import { COLORS, RADIUS, SPACING, TYPOGRAPHY } from "../../constants/theme";

const gallery = [
  "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=60",
  "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=600&q=60",
];

export default function SetDesignFormScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.safe}>
      <HeaderBar title="Set Design" onBack={() => navigation.goBack?.()} />
      <View style={styles.form}>
        <LabelInput label="Họ Tên" value="Đạt Quang" />
        <LabelInput label="Email" value="dat@gmail.com" />
        <LabelInput label="Số điện thoại" value="+84 723 422 412" />
        <LabelInput
          label="Mô tả"
          value="Tôi muốn cái phòng nó trông như thế này ...."
          multiline
          numberOfLines={3}
        />
        <Text style={styles.label}>Hình ảnh tham khảo</Text>
        <View style={styles.galleryRow}>
          {gallery.map((img) => (
            <Image key={img} source={{ uri: img }} style={styles.galleryImage} />
          ))}
          <TouchableOpacity style={styles.addCard}>
            <Text style={styles.addText}>＋</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.footer}>
        <PrimaryButton label="Gửi" onPress={() => navigation.navigate("Chat")} />
      </View>
    </SafeAreaView>
  );
}

const LabelInput = ({ label, ...rest }) => (
  <View style={styles.inputBlock}>
    <Text style={styles.label}>{label}</Text>
    <TextInput style={styles.input} {...rest} />
  </View>
);

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  form: { padding: SPACING.lg },
  inputBlock: { marginBottom: SPACING.lg },
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
  galleryRow: { flexDirection: "row" },
  galleryImage: {
    width: 80,
    height: 80,
    borderRadius: RADIUS.md,
    marginRight: SPACING.sm,
  },
  addCard: {
    width: 80,
    height: 80,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: "center",
    justifyContent: "center",
  },
  addText: { fontSize: 28, color: COLORS.textMuted },
  footer: { padding: SPACING.lg },
});

