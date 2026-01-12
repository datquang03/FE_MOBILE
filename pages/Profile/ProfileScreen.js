import React, { useEffect } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { getMyProfile } from "../../features/Customer/customerSlice";
import HeaderBar from "../../components/ui/HeaderBar";
import PrimaryButton from "../../components/ui/PrimaryButton";
import { COLORS, RADIUS, SPACING, TYPOGRAPHY } from "../../constants/theme";
import { useFocusEffect } from '@react-navigation/native';

const settings = [
  { id: "card", label: "Thẻ", route: "Cards" },
  { id: "security", label: "Bảo mật", route: "Security" },
  { id: "notifications", label: "Thông báo", route: "NotificationSettings" },
  { id: "support", label: "Hỗ trợ & giải đáp", route: "Support" },
];

const InfoRow = ({ label, value }) => (
  <View style={styles.infoRow}>
    <Text style={styles.infoLabel}>{label}</Text>
    <Text style={styles.infoValue}>{value || "-"}</Text>
  </View>
);

export default function ProfileScreen({ navigation }) {
  const dispatch = useDispatch();
  const { customer, loading } = useSelector((state) => state.customer);
  const { token } = useSelector((state) => state.auth);

  // Luôn gọi hook trước mọi return
  useEffect(() => {
    if (token) dispatch(getMyProfile());
  }, [token]);

  useFocusEffect(
    React.useCallback(() => {
      if (token) dispatch(getMyProfile());
    }, [token, dispatch])
  );

  // Nếu chưa đăng nhập, show UI đẹp yêu cầu đăng nhập
  if (!token) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.emptyWrap}>
          <View style={styles.emptyImg}> 
            <Text style={{ fontSize: 54, color: COLORS.brandBlue, fontWeight: 'bold' }}>?</Text>
          </View>
          <Text style={styles.emptyTitle}>Bạn chưa đăng nhập</Text>
          <Text style={styles.emptyDesc}>Vui lòng đăng nhập để xem và chỉnh sửa hồ sơ cá nhân của bạn.</Text>
          <TouchableOpacity style={styles.loginBtn} onPress={() => navigation.navigate('SignIn')}>
            <Text style={styles.loginBtnText}>Đăng nhập</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const getRoleLabel = (role) => {
    if (role === "customer") return "Khách hàng";
    if (role === "staff") return "Nhân viên";
    return "Chưa xác định";
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: 16 }}>
          <HeaderBar title="Hồ sơ" />

          {/* PROFILE CARD */}
          <View style={styles.card}>
            <View style={styles.avatarWrapper}>
              {loading ? (
                // Skeleton loading for avatar
                <View style={[styles.avatar, { backgroundColor: COLORS.border, opacity: 0.5 }]} />
              ) : (
                <Image
                  source={{
                    uri:
                      (typeof customer?.avatar === 'string' && customer?.avatar) ||
                      (customer?.avatar && typeof customer.avatar === 'object' && typeof customer.avatar.url === 'string' ? customer.avatar.url : null) ||
                      "https://ui-avatars.com/api/?name=User&background=0D8ABC&color=fff",
                  }}
                  style={styles.avatar}
                />
              )}
            </View>

            {loading ? (
              // Skeleton loading for name and username
              <>
                <View style={{ width: 120, height: 20, backgroundColor: COLORS.border, borderRadius: 8, marginTop: 12, marginBottom: 6, alignSelf: 'center' }} />
                <View style={{ width: 80, height: 16, backgroundColor: COLORS.border, borderRadius: 8, marginBottom: 12, alignSelf: 'center' }} />
              </>
            ) : (
              <>
                <Text style={styles.name}>
                  {customer?.fullName || customer?.username || "Guest"}
                </Text>
                <Text style={styles.username}>@{customer?.username}</Text>
              </>
            )}

            <View style={styles.infoBox}>
              {loading ? (
                // Skeleton loading for info rows
                Array.from({ length: 5 }).map((_, idx) => (
                  <View key={idx} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <View style={{ width: 80, height: 14, backgroundColor: COLORS.border, borderRadius: 6 }} />
                    <View style={{ width: 100, height: 14, backgroundColor: COLORS.border, borderRadius: 6 }} />
                  </View>
                ))
              ) : (
                <>
                  <InfoRow label="Email" value={customer?.email} />
                  <InfoRow label="Số điện thoại" value={customer?.phone} />
                  <InfoRow label="Vai trò" value={getRoleLabel(customer?.role)} />
                  <InfoRow label="Trạng thái" value={customer?.isActive ? "Hoạt động" : "Bị khóa"} />
                  <InfoRow label="Xác thực" value={customer?.isVerified ? "Đã xác thực" : "Chưa xác thực"} />
                </>
              )}
            </View>

            <TouchableOpacity
              style={styles.editBtn}
              onPress={() => navigation.navigate("EditProfile")}
              disabled={loading}
            >
              <Text style={styles.editText}>Chỉnh sửa hồ sơ</Text>
            </TouchableOpacity>
          </View>

          {/* SETTINGS */}
          <View style={styles.list}>
            {settings.map((item, index) => (
              <TouchableOpacity
                key={item.id}
                style={[
                  styles.row,
                  index === settings.length - 1 && { borderBottomWidth: 0 },
                ]}
                onPress={() => navigation.navigate(item.route)}
                disabled={loading}
              >
                <Text style={styles.rowText}>{item.label}</Text>
                <Text style={styles.rowIcon}>›</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* LOGOUT */}
          <View style={styles.footer}>
            <PrimaryButton
              label="Đăng xuất"
              style={{ backgroundColor: COLORS.danger }}
              onPress={() => navigation.navigate("LogoutConfirm")}
              disabled={loading}
            />
          </View>
        </ScrollView>
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
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 6,
  },

  avatarWrapper: {
    padding: 4,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: COLORS.brandBlue,
  },

  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
  },

  name: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.textDark,
    marginTop: 12,
  },

  username: {
    color: COLORS.textMuted,
    marginBottom: 12,
  },

  infoBox: {
    width: "100%",
    backgroundColor: COLORS.background,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginTop: SPACING.md,
  },

  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
  },

  infoLabel: {
    color: COLORS.textMuted,
    fontSize: 13,
  },

  infoValue: {
    color: COLORS.textDark,
    fontWeight: "600",
  },

  editBtn: {
    marginTop: SPACING.md,
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: COLORS.brandBlue + "15",
  },

  editText: {
    color: COLORS.brandBlue,
    fontWeight: "600",
  },

  list: {
    marginHorizontal: SPACING.lg,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    marginTop: SPACING.sm,
    overflow: "hidden",
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },

  rowText: {
    color: COLORS.textDark,
    fontWeight: "600",
  },

  rowIcon: {
    color: COLORS.textMuted,
    fontSize: 18,
  },

  footer: {
    padding: SPACING.xxl,
  },

  emptyWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.xl,
    backgroundColor: COLORS.background,
  },
  emptyImg: {
    width: 180,
    height: 180,
    marginBottom: 24,
    opacity: 0.85,
    borderRadius: 90,
    backgroundColor: COLORS.brandBlue + '22',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.brandBlue,
    marginBottom: 10,
    textAlign: 'center',
  },
  emptyDesc: {
    color: COLORS.textMuted,
    fontSize: 16,
    marginBottom: 32,
    textAlign: 'center',
  },
  loginBtn: {
    backgroundColor: COLORS.brandBlue,
    borderRadius: 24,
    paddingVertical: 14,
    paddingHorizontal: 36,
    alignItems: 'center',
  },
  loginBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
});
