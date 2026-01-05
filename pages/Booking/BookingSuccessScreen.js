import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Image,
  TouchableOpacity,
  Animated,
  Dimensions,
  Pressable,
} from "react-native";
import { BlurView } from "expo-blur";
import { useDispatch, useSelector } from "react-redux";
import { getStudioById } from "../../features/Studio/studioSlice";
import { getScheduleById } from "../../features/Schedule/scheduleSlice";
import { getCurrentUser } from "../../features/Authentication/authSlice";
import dayjs from "dayjs";
import PrimaryButton from "../../components/ui/PrimaryButton";
import HeaderBar from "../../components/ui/HeaderBar";
import FullScreenLoading from "../../components/loadings/fullScreenLoading";
import { COLORS, SPACING, RADIUS, TYPOGRAPHY } from "../../constants/theme";
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import { captureRef } from 'react-native-view-shot';

const { height } = Dimensions.get("window");
const SHEET_HEIGHT = 420;

export default function BookingSuccessScreen({ route, navigation }) {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  const [loading, setLoading] = useState(false);
  const [studio, setStudio] = useState(route.params?.studio || null);
  const [schedule, setSchedule] = useState(null);
  const [toast, setToast] = useState(null);
  const booking = route.params?.booking?.booking || route.params?.booking;

  const billRef = useRef();

  /* ===== BOTTOM SHEET ===== */
  const sheetY = useRef(new Animated.Value(SHEET_HEIGHT)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;
  const [open, setOpen] = useState(false);

  const openSheet = () => {
    setOpen(true);
    Animated.parallel([
      Animated.spring(sheetY, {
        toValue: 0,
        damping: 18,
        stiffness: 120,
        useNativeDriver: true,
      }),
      Animated.timing(backdropOpacity, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const closeSheet = () => {
    Animated.parallel([
      Animated.timing(sheetY, {
        toValue: SHEET_HEIGHT,
        duration: 220,
        useNativeDriver: true,
      }),
      Animated.timing(backdropOpacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => setOpen(false));
  };

  const handleDownloadBill = async () => {
    try {
      setLoading(true);
      // Chụp bill thành ảnh
      const uri = await captureRef(billRef, { format: 'png', quality: 1 });
      const perm = await MediaLibrary.requestPermissionsAsync();
      if (!perm.granted) throw new Error('Bạn cần cấp quyền lưu ảnh!');
      const asset = await MediaLibrary.createAssetAsync(uri);
      await MediaLibrary.createAlbumAsync('S+Studio', asset, false);
      setToast({ type: 'success', message: 'Đã lưu ảnh hóa đơn vào thư viện!' });
    } catch (err) {
      setToast({ type: 'error', message: err.message || 'Lưu ảnh thất bại!' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!studio && booking?.studioId) {
      dispatch(getStudioById(booking.studioId)).then((res) =>
        setStudio(res.payload)
      );
    }
    if (booking?.scheduleId) {
      dispatch(getScheduleById(booking.scheduleId)).then((res) =>
        setSchedule(res.payload)
      );
    }
    if (route.params?.toastMessage) {
      setToast({ type: "success", message: route.params.toastMessage });
    }
  }, [booking, dispatch]);

  if (!booking) {
    return (
      <SafeAreaView style={styles.safe}>
        <Text style={{ color: "red", textAlign: "center", marginTop: 40 }}>
          Không có dữ liệu booking!
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      {/* ===== HEADER ===== */}
      <View style={{ paddingTop: 24, marginBottom: 8 }}>
        <HeaderBar
          title="Hóa đơn thanh toán"
          onBack={() => navigation.goBack()}
          rightIcon="download"
          onRightPress={handleDownloadBill}
        />
      </View>

      {/* ===== CONTENT ===== */}
      <ScrollView contentContainerStyle={{ padding: SPACING.lg }} ref={billRef}>
        <View style={[styles.card, { borderWidth: 2, borderColor: COLORS.brandBlue, backgroundColor: '#fff', shadowColor: COLORS.brandBlue, shadowOpacity: 0.08, shadowRadius: 12, elevation: 6 }]}> 
          <Text style={[styles.invoiceTitle, { letterSpacing: 1, marginTop: 8 }]}>HÓA ĐƠN ĐẶT PHÒNG</Text>
          <View style={{ alignItems: 'center', marginBottom: 22 }}>
            <Image source={{ uri: studio?.images?.[0] }} style={[styles.thumbnail, { marginBottom: 12 }]} />
            <Text style={[styles.studioName, { fontSize: 20, marginBottom: 4 }]}>{studio?.name}</Text>
            <Text style={[styles.price, { fontSize: 17, marginBottom: 4 }]}>{(studio?.basePricePerHour || 0).toLocaleString()}đ / giờ</Text>
            <Text style={[styles.label, { fontSize: 15 }]}>{studio?.location}</Text>
          </View>

          {/* Customer Info */}
          <View style={{ marginBottom: 20 }}>
            <Text style={[styles.label, { fontWeight: 'bold', color: COLORS.brandBlue, fontSize: 16, marginBottom: 8 }]}>Thông tin khách hàng</Text>
            <Text style={styles.value}>👤 {user?.fullName || user?.username || user?.name || booking?.customerName || booking?.customer?.fullName || booking?.customer?.name || '---'}</Text>
            <Text style={styles.value}>✉️ {user?.email || booking?.customerEmail || booking?.customer?.email || '---'}</Text>
            <Text style={styles.value}>📞 {user?.phone || booking?.customerPhone || booking?.customer?.phone || '---'}</Text>
          </View>

          {/* Booking Time */}
          {schedule && (
            <View style={{ marginBottom: 20 }}>
              <Text style={[styles.label, { fontWeight: 'bold', color: COLORS.brandBlue, fontSize: 16, marginBottom: 8 }]}>Thời gian đặt phòng</Text>
              <Text style={styles.value}>
                Check - In: <Text style={{ color: COLORS.brandBlue }}>{dayjs(schedule.startTime).format("HH:mm")}</Text>  |  Check - Out: <Text style={{ color: COLORS.brandBlue }}>{dayjs(schedule.endTime).format("HH:mm")}</Text>
              </Text>
              <Text style={styles.value}>
                Ngày: <Text style={{ color: COLORS.textDark }}>{dayjs(schedule.startTime).format("DD/MM/YYYY")}</Text> - <Text style={{ color: COLORS.textDark }}>{dayjs(schedule.endTime).format("DD/MM/YYYY")}</Text>
              </Text>
            </View>
          )}

          {/* Payment Info */}
          <View style={{ marginBottom: 20 }}>
            <Text style={[styles.label, { fontWeight: 'bold', color: COLORS.brandBlue, fontSize: 16, marginBottom: 8 }]}>Chi tiết thanh toán</Text>
            <Text style={styles.value}>Tổng trước giảm giá: <Text style={{ color: COLORS.textDark }}>{booking.totalBeforeDiscount?.toLocaleString()}đ</Text></Text>
            <Text style={styles.value}>Giảm giá: <Text style={{ color: COLORS.textDark }}>{booking.discountAmount?.toLocaleString()}đ</Text></Text>
            <Text style={styles.value}>Thành tiền: <Text style={{ color: COLORS.brandBlue, fontWeight: 'bold' }}>{booking.finalAmount?.toLocaleString()}đ</Text></Text>
          </View>

          {/* Policy Info */}
          {booking.policySnapshots?.cancellation && (
            <View style={{ marginBottom: 16 }}>
              <Text style={[styles.label, { fontWeight: 'bold', color: COLORS.brandBlue, fontSize: 16, marginBottom: 8 }]}>Chính sách hủy phòng</Text>
              {booking.policySnapshots.cancellation.refundTiers?.map((tier) => (
                <Text key={tier._id} style={{ color: '#444', marginBottom: 2 }}>• {tier.description}</Text>
              ))}
            </View>
          )}
          {booking.policySnapshots?.noShow && (
            <View style={{ marginBottom: 16 }}>
              <Text style={[styles.label, { fontWeight: 'bold', color: COLORS.brandBlue, fontSize: 16, marginBottom: 8 }]}>Chính sách No-show</Text>
              <Text style={{ color: '#444' }}>• Nếu không đến, sẽ bị tính phí {booking.policySnapshots.noShow.noShowRules?.chargePercentage || 100}% tổng tiền ({booking.finalAmount?.toLocaleString()}đ)</Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* ===== FOOTER ===== */}
      <View style={styles.footer}>
        <PrimaryButton label="Chọn mức thanh toán" onPress={openSheet} />
      </View>

      {/* ===== BLUR BACKDROP ===== */}
      {open && (
        <Animated.View
          style={[
            StyleSheet.absoluteFill,
            { opacity: backdropOpacity, zIndex: 10 },
          ]}
        >
          <Pressable style={{ flex: 1 }} onPress={closeSheet}>
            <BlurView intensity={30} tint="dark" style={{ flex: 1 }} />
          </Pressable>
        </Animated.View>
      )}

      {/* ===== BOTTOM SHEET ===== */}
      {open && (
        <Animated.View
          style={[styles.sheet, { transform: [{ translateY: sheetY }] }]}
        >
          <View style={styles.sheetHandle} />

          <Text style={styles.sheetTitle}>Chọn mức thanh toán</Text>

          {[0.3, 0.5, 1].map((percent) => (
            <TouchableOpacity
              key={percent}
              style={styles.option}
              onPress={closeSheet}
            >
              <Text style={styles.optionText}>
                {percent * 100}% –{" "}
                {Math.round(booking.finalAmount * percent).toLocaleString()}đ
              </Text>
            </TouchableOpacity>
          ))}
        </Animated.View>
      )}

      {loading && <FullScreenLoading />}
    </SafeAreaView>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },

  card: {
    backgroundColor: "#fff",
    borderRadius: RADIUS.xl,
    padding: SPACING.xl,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 20,
    elevation: 4,
  },

  invoiceTitle: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },

  topRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },

  thumbnail: {
    width: 80,
    height: 80,
    borderRadius: 14,
    backgroundColor: COLORS.border,
  },

  studioName: {
    fontSize: 18,
    fontWeight: "700",
  },

  price: {
    color: COLORS.brandBlue,
    fontWeight: "700",
    marginTop: 4,
  },

  label: {
    marginTop: 10,
    color: COLORS.textMuted,
  },

  value: {
    fontSize: 15,
    fontWeight: "600",
  },

  footer: {
    padding: SPACING.lg,
    backgroundColor: COLORS.background,
  },

  /* ===== BOTTOM SHEET ===== */
  sheet: {
    position: "absolute",
    bottom: 0,
    height: SHEET_HEIGHT,
    width: "100%",
    backgroundColor: "#fff",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 24,
    zIndex: 20,
  },

  sheetHandle: {
    width: 48,
    height: 5,
    borderRadius: 4,
    backgroundColor: "#ccc",
    alignSelf: "center",
    marginBottom: 12,
  },

  sheetTitle: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 18,
    color: COLORS.brandBlue,
  },

  option: {
    paddingVertical: 16,
    borderRadius: 16,
    backgroundColor: "#F4F6FF",
    borderWidth: 2,
    borderColor: COLORS.brandBlue,
    marginBottom: 14,
    alignItems: "center",
  },

  optionText: {
    fontSize: 17,
    fontWeight: "bold",
    color: COLORS.brandBlue,
  },
});
