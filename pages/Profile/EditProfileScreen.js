import React, { useEffect, useState, useRef } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import * as ImagePicker from "expo-image-picker";
import { Feather } from '@expo/vector-icons';

import {
  getMyProfile,
  updateProfile,
} from "../../features/Customer/customerSlice";
import { uploadAvatar } from "../../features/Upload/uploadSlice";

import HeaderBar from "../../components/ui/HeaderBar";
import PrimaryButton from "../../components/ui/PrimaryButton";
import ToastNotification from "../../components/toast/ToastNotification";
import FullScreenLoading from "../../components/loadings/fullScreenLoading";
import { COLORS, RADIUS, SPACING } from "../../constants/theme";

export default function EditProfileScreen({ navigation }) {
  const dispatch = useDispatch();

  const { customer, loading } = useSelector((state) => state.customer);
  const { uploading } = useSelector((state) => state.upload);

  const [form, setForm] = useState({
    fullName: "",
    username: "",
    email: "",
    phone: "",
    avatar: "",
  });

  const [avatarFile, setAvatarFile] = useState(null);
  const toastRef = useRef();

  /* ================= FETCH PROFILE ================= */
  useEffect(() => {
    dispatch(getMyProfile());
  }, [dispatch]);

  useEffect(() => {
    if (!customer) return;
    setForm({
      fullName: customer.fullName || "",
      username: customer.username || "",
      email: customer.email || "",
      phone: customer.phone || "",
      avatar: customer.avatar || "",
    });
  }, [customer]);

  /* ================= HANDLERS ================= */
  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handlePickAvatar = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (result.canceled) return;

    const asset = result.assets[0];
    setAvatarFile({
      uri: asset.uri,
      name: asset.fileName || `avatar_${Date.now()}.jpg`,
      type: asset.mimeType || "image/jpeg",
    });
  };

  const handleSave = async () => {
    try {
      let avatarUrl = form.avatar;

      if (avatarFile) {
        const res = await dispatch(uploadAvatar(avatarFile)).unwrap();
        avatarUrl = res?.url || res?.secure_url;
      }

      await dispatch(
        updateProfile({
          ...form,
          avatar: avatarUrl,
        })
      ).unwrap();

      // Không show toast thành công, chỉ quay lại màn hình trước
      navigation.navigate("MainTabs", { screen: "Profile" });
    } catch (err) {
      toastRef.current?.show(err?.message || "Cập nhật thất bại", "error");
    }
  };

  /* ================= RENDER ================= */
  return (
    <SafeAreaView style={styles.safe}>
      <HeaderBar title="Chỉnh sửa hồ sơ" onBack={navigation.goBack} />
      <FullScreenLoading loading={loading || uploading} text="Đang cập nhật hồ sơ..." />

      {/* AVATAR */}
      <View style={styles.avatarBox}>
        <TouchableOpacity onPress={handlePickAvatar} disabled={uploading}>
          <View style={{ alignItems: 'center' }}>
            <Image
              source={{
                uri: (() => {
                  // Ưu tiên ảnh mới chọn
                  if (avatarFile?.uri && typeof avatarFile.uri === 'string') return avatarFile.uri;
                  // Nếu form.avatar là object (từ BE trả về), lấy url nếu là string
                  if (
                    form.avatar &&
                    typeof form.avatar === 'object' &&
                    form.avatar !== null &&
                    typeof form.avatar.url === 'string'
                  ) {
                    return form.avatar.url;
                  }
                  // Nếu form.avatar là string
                  if (typeof form.avatar === 'string' && form.avatar) return form.avatar;
                  // Fallback
                  return "https://ui-avatars.com/api/?name=User";
                })()
              }}
              style={styles.avatar}
            />
          </View>
        </TouchableOpacity>
        <Text style={styles.changeAvatar}>Đổi ảnh đại diện</Text>
      </View>

      {/* FORM */}
      <View style={styles.form}>
        <LabelInput
          label="Họ và tên"
          value={form.fullName}
          onChangeText={(v) => handleChange("fullName", v)}
        />
        <LabelInput
          label="Tên đăng nhập"
          value={form.username}
          onChangeText={(v) => handleChange("username", v)}
        />
        <LabelInput
          label="Email"
          value={form.email}
          onChangeText={(v) => handleChange("email", v)}
        />
        <LabelInput
          label="Số điện thoại"
          value={form.phone}
          onChangeText={(v) => handleChange("phone", v)}
        />
      </View>

      {/* SAVE */}
      <View style={styles.footer}>
        <PrimaryButton
          label={loading || uploading ? "Đang lưu..." : "Lưu thay đổi"}
          onPress={handleSave}
          disabled={loading || uploading}
        />
      </View>

      {/* TAB BAR ICONS (bottom navigation) */}
      {/* ĐÃ XÓA TAB BAR TỰ VẼ Ở ĐÂY */}
    </SafeAreaView>
  );
}

/* ================= COMPONENT ================= */
const LabelInput = ({ label, ...props }) => (
  <View style={styles.inputBlock}>
    <Text style={styles.label}>{label}</Text>
    <TextInput {...props} style={styles.input} autoCapitalize="none" />
  </View>
); // Đóng component tại đây

/* ================= STYLES ================= */
const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  avatarBox: {
    alignItems: "center",
    marginTop: 24,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    marginBottom: 8,
  },
  changeAvatar: {
    color: COLORS.brandBlue,
    textAlign: "center",
  },
  form: {
    padding: SPACING.lg,
  },
  inputBlock: {
    marginBottom: SPACING.lg,
  },
  label: {
    fontWeight: "600",
    marginBottom: SPACING.xs,
    color: COLORS.textDark,
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
  // ĐÃ XÓA style tabBar, tabItem, tabLabel
});
