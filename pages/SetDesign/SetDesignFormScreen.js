import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TextInput,
  Image,
  TouchableOpacity,
} from "react-native";
import { useDispatch } from "react-redux";
import { createCustomSetDesignRequest } from "../../features/SetDesign/setDesignSlice";
import HeaderBar from "../../components/ui/HeaderBar";
import PrimaryButton from "../../components/ui/PrimaryButton";
import { COLORS, RADIUS, SPACING, TYPOGRAPHY } from "../../constants/theme";
import * as ImagePicker from "expo-image-picker";
import FullScreenLoading from "../../components/loadings/fullScreenLoading";
import ToastNotification from "../../components/toast/ToastNotification";

const CATEGORY_OPTIONS = [
  { value: "wedding", label: "Đám cưới" },
  { value: "portrait", label: "Chân dung" },
  { value: "corporate", label: "Doanh nghiệp" },
  { value: "event", label: "Sự kiện" },
  { value: "family", label: "Gia đình" },
  { value: "graduation", label: "Tốt nghiệp" },
  { value: "other", label: "Khác" },
];

export default function SetDesignFormScreen({ navigation }) {
  const dispatch = useDispatch();
  const [description, setDescription] = React.useState("");
  const [preferredCategory, setPreferredCategory] = React.useState("");
  const [budget, setBudget] = React.useState("");
  const [galleryImages, setGalleryImages] = React.useState([]); // chỉ để hình dấu cộng
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null); // { type, message }

  const handlePickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (result.canceled) return;
    const asset = result.assets[0];
    // Log asset để kiểm tra thông tin file ảnh lấy được từ ImagePicker
    console.log('PICKED ASSET:', asset);
    setGalleryImages((prev) => [
      ...prev,
      {
        uri: asset.uri,
        name: asset.fileName || `image_${Date.now()}.jpg`,
        type: asset.mimeType || "image/jpeg",
      },
    ]);
  };

  const handleSubmit = async () => {
    // Validate required fields
    if (
      !description.trim() ||
      !preferredCategory ||
      !budget.trim() ||
      galleryImages.length === 0
    ) {
      setToast({
        type: "error",
        message:
          "Vui lòng nhập đầy đủ thông tin và chọn ít nhất 1 ảnh tham khảo!",
      });
      return;
    }
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("description", description);
      formData.append("preferredCategory", preferredCategory);
      formData.append("budget", Number(budget));
      galleryImages.forEach((img) => {
        // Log từng file object trước khi append vào formData
        console.log('APPEND FILE:', img);
        formData.append("referenceImages", {
          uri: img.uri,
          name: img.name,
          type: img.type,
        });
      });
      // Log lại formData._parts để kiểm tra dữ liệu gửi đi
      if (formData._parts) {
        for (let pair of formData._parts) {
          console.log(pair[0], pair[1]);
        }
      }
      await dispatch(createCustomSetDesignRequest(formData)).unwrap();
      setLoading(false);
      setToast({ type: "success", message: "Tạo đơn thành công!" });
      navigation.navigate("MainTabs", {
        screen: "History",
        params: { tab: "setdesigncustom" },
      });
    } catch (err) {
      setLoading(false);
      setToast({ type: "error", message: err?.message || "Tạo đơn thất bại!" });
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <FullScreenLoading loading={loading} text="Đang tạo đơn yêu cầu..." />
      <View style={{ paddingTop: 32, backgroundColor: COLORS.background }}>
        <HeaderBar title="Set Design" onBack={() => navigation.goBack?.()} />
      </View>
      <View style={styles.form}>
        <LabelInput
          label="Mô tả"
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={3}
        />
        <View style={styles.inputBlock}>
          <Text style={styles.label}>Danh mục</Text>
          <TouchableOpacity
            style={[
              styles.input,
              {
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              },
            ]}
            onPress={() => setShowCategoryDropdown((v) => !v)}
            activeOpacity={0.8}
          >
            <Text
              style={{
                color: preferredCategory ? COLORS.textDark : COLORS.textMuted,
              }}
            >
              {preferredCategory
                ? CATEGORY_OPTIONS.find(
                    (opt) => opt.value === preferredCategory
                  )?.label
                : "Chọn danh mục"}
            </Text>
            <Text style={{ color: COLORS.textMuted, fontSize: 18 }}>▼</Text>
          </TouchableOpacity>
          {showCategoryDropdown && (
            <View
              style={{
                backgroundColor: COLORS.surface,
                borderRadius: RADIUS.lg,
                borderWidth: 1,
                borderColor: COLORS.border,
                marginTop: 4,
                position: "absolute",
                left: 0,
                right: 0,
                zIndex: 10,
              }}
            >
              {CATEGORY_OPTIONS.map((opt) => (
                <TouchableOpacity
                  key={opt.value}
                  style={{
                    padding: SPACING.md,
                    backgroundColor:
                      preferredCategory === opt.value
                        ? "#F5F0FF"
                        : "transparent",
                    borderRadius: RADIUS.lg,
                  }}
                  onPress={() => {
                    setPreferredCategory(opt.value);
                    setShowCategoryDropdown(false);
                  }}
                >
                  <Text
                    style={{
                      color:
                        preferredCategory === opt.value
                          ? "#6C47FF"
                          : COLORS.textDark,
                      fontWeight:
                        preferredCategory === opt.value ? "bold" : "normal",
                    }}
                  >
                    {opt.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
        <LabelInput
          label="Ngân sách (VNĐ)"
          value={budget}
          onChangeText={setBudget}
          keyboardType="numeric"
        />
        <Text style={styles.label}>Hình ảnh tham khảo</Text>
        <View style={styles.galleryRow}>
          <TouchableOpacity style={styles.addCard} onPress={handlePickImage}>
            <Text style={styles.addText}>＋</Text>
          </TouchableOpacity>
          {galleryImages.map((img, idx) => (
            <Image
              key={idx}
              source={{ uri: img.uri }}
              style={styles.galleryImage}
            />
          ))}
        </View>
      </View>
      <View style={styles.footer}>
        <PrimaryButton label="Gửi" onPress={handleSubmit} />
      </View>
      {toast && (
        <ToastNotification
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}
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
