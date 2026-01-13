import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { getBookingById, createRemainingPayment } from "../../features/Booking/bookingSlice";
import { getStudioById } from "../../features/Studio/studioSlice";
import { COLORS, SPACING, RADIUS } from "../../constants/theme";
import HeaderBar from "../../components/ui/HeaderBar";
import FullScreenLoading from "../../components/loadings/fullScreenLoading";
import ToastNotification from "../../components/toast/ToastNotification";
import TransactionDetailSkeletonLoading from "../../components/skeletons/TransactionDetailSkeletonLoading";

export default function BookingStudioDetail({ route, navigation }) {
  const { bookingId } = route.params || {};
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [studioImage, setStudioImage] = useState(null);
  const [payLoading, setPayLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const { bookingDetail, bookingError } = useSelector((state) => state.booking);

  useEffect(() => {
    if (bookingId) {
      setLoading(true);
      dispatch(getBookingById(bookingId)).finally(() => setLoading(false));
    }
  }, [bookingId]);

  useEffect(() => {
    if (bookingDetail?.data?.studio?._id) {
      dispatch(getStudioById(bookingDetail.data.studio._id)).then((res) => {
        if (res.payload?.images?.length) {
          setStudioImage(res.payload.images[0]);
        }
      });
    }
  }, [bookingDetail]);

  if (loading) {
    return (
      <View style={styles.center}>
        <TransactionDetailSkeletonLoading />
      </View>
    );
  }

  if (bookingError || !bookingDetail?.data) {
    return (
      <View style={styles.center}>
        <Text style={{ color: COLORS.danger }}>
          Không thể tải thông tin booking
        </Text>
      </View>
    );
  }

  const data = bookingDetail.data;
  const {
    customer = {},
    studio = {},
    schedule = {},
    paymentSummary = {},
    details = [],
  } = data;

  const handlePayRemaining = async () => {
    setPayLoading(true);
    try {
      const res = await dispatch(createRemainingPayment(bookingId)).unwrap();
      setPayLoading(false);
      setToast({ type: res.success ? "success" : "error", message: res.message });
      if (res.success && res.data?.qrCodeUrl) {
        setTimeout(() => {
          setToast(null);
          navigation.navigate("WebViewScreen", {
            url: res.data.qrCodeUrl,
            title: "Thanh toán",
            paymentInfo: res.data, // truyền thêm thông tin thanh toán
          });
        }, 1200);
      }
    } catch (err) {
      setPayLoading(false);
      setToast({ type: "error", message: err?.message || "Thanh toán thất bại" });
    }
  };

  return (
    <View style={styles.container}>
      {/* Hạ thấp header xuống */}
      <View style={{ marginTop: 24, marginBottom: 8 }}>
        <HeaderBar
          title="Chi tiết đặt phòng"
          onBack={() => navigation.goBack()}
        />
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        {/* ===== Studio Image ===== */}
        {studioImage && (
          <View style={styles.imageWrap}>
            <Image source={{ uri: studioImage }} style={styles.image} />
            <View style={styles.imageOverlay}>
              <Text style={styles.studioName}>{studio.name}</Text>
              <Text style={styles.status}>
                {data.status === "confirmed"
                  ? "Đã xác nhận"
                  : data.status === "pending"
                  ? "Chờ xác nhận"
                  : data.status}
              </Text>
            </View>
          </View>
        )}

        {/* ===== Booking Info ===== */}
        <Section title="Thông tin đặt phòng">
          <InfoRow
            label="Ngày"
            value={new Date(schedule.startTime).toLocaleDateString("vi-VN")}
          />
          <InfoRow label="Thời gian" value={schedule.timeRange} />
          <InfoRow
            label="Bắt đầu"
            value={new Date(schedule.startTime).toLocaleTimeString("vi-VN", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          />
          <InfoRow
            label="Kết thúc"
            value={new Date(schedule.endTime).toLocaleTimeString("vi-VN", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          />
          <InfoRow label="Số giờ" value={`${schedule.duration}h`} />
        </Section>

        {/* ===== Customer ===== */}
        <Section title="Khách hàng">
          <InfoRow label="Họ tên" value={customer.fullName} />
          <InfoRow label="SĐT" value={customer.phone} />
          <InfoRow label="Email" value={customer.email} />
        </Section>

        {/* ===== Payment ===== */}
        <Section title="Thanh toán">
          <PriceRow label="Tổng tiền" value={paymentSummary.totalAmount} />
          <PriceRow
            label="Đã thanh toán"
            value={paymentSummary.paidAmount}
            green
          />
          <PriceRow
            label="Còn lại"
            value={paymentSummary.remainingAmount}
            danger
          />
          <InfoRow label="Hình thức" value={data.payType} />
        </Section>

        {/* ===== Details ===== */}
        <Section title="Dịch vụ / Thiết bị">
          {details.length === 0 ? (
            <Text style={styles.empty}>Không có dịch vụ / thiết bị</Text>
          ) : (
            details.map((d) => (
              <View key={d._id} style={styles.detailRow}>
                <Text style={styles.detailName}>
                  {d.detailType === "equipment"
                    ? d.equipment?.name
                    : d.service?.name}
                </Text>
                <Text style={styles.detailQty}>x{d.quantity}</Text>
                <Text style={styles.detailTotal}>
                  {d.subtotal?.toLocaleString()}đ
                </Text>
              </View>
            ))
          )}
        </Section>

        <Text style={styles.bookingId}>Mã booking: {data._id}</Text>
      </ScrollView>
      {/* Button tất toán ở dưới cùng */}
      <View style={styles.footerBtnWrap}>
        {paymentSummary.remainingAmount > 0 && (
          <TouchableOpacity style={styles.payBtn} onPress={handlePayRemaining} disabled={payLoading}>
            <Text style={styles.payBtnText}>Tất toán</Text>
          </TouchableOpacity>
        )}
      </View>
      {payLoading && <FullScreenLoading loading text="Đang tạo thanh toán..." />}
      {toast && (
        <ToastNotification
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}
    </View>
  );
}

/* ===== Reusable Components ===== */
const Section = ({ title, children }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>{title}</Text>
    {children}
  </View>
);

const InfoRow = ({ label, value }) => (
  <View style={styles.row}>
    <Text style={styles.label}>{label}</Text>
    <Text style={styles.value}>{value}</Text>
  </View>
);

const PriceRow = ({ label, value, green, danger }) => (
  <View style={styles.row}>
    <Text
      style={[styles.label, green && styles.green, danger && styles.danger]}
    >
      {label}
    </Text>
    <Text
      style={[styles.value, green && styles.green, danger && styles.danger]}
    >
      {value?.toLocaleString()}đ
    </Text>
  </View>
);

const BookingDetailSkeleton = () => (
  <View style={styles.section}>
    <View style={{ width: '100%', height: 200, backgroundColor: COLORS.border, borderRadius: RADIUS.lg, marginBottom: 16 }} />
    <View style={{ height: 28, backgroundColor: COLORS.border, borderRadius: 6, marginBottom: 12, width: '60%' }} />
    <View style={{ height: 18, backgroundColor: COLORS.border, borderRadius: 6, marginBottom: 10, width: '40%' }} />
    {/* Booking Info Skeleton */}
    <View style={{ height: 18, backgroundColor: COLORS.border, borderRadius: 6, marginBottom: 8, width: '80%' }} />
    <View style={{ height: 18, backgroundColor: COLORS.border, borderRadius: 6, marginBottom: 8, width: '50%' }} />
    <View style={{ height: 18, backgroundColor: COLORS.border, borderRadius: 6, marginBottom: 8, width: '70%' }} />
    <View style={{ height: 18, backgroundColor: COLORS.border, borderRadius: 6, marginBottom: 8, width: '60%' }} />
    {/* Customer Skeleton */}
    <View style={{ height: 18, backgroundColor: COLORS.border, borderRadius: 6, marginBottom: 8, width: '40%' }} />
    <View style={{ height: 18, backgroundColor: COLORS.border, borderRadius: 6, marginBottom: 8, width: '90%' }} />
    <View style={{ height: 18, backgroundColor: COLORS.border, borderRadius: 6, marginBottom: 8, width: '80%' }} />
    {/* Payment Skeleton */}
    <View style={{ height: 18, backgroundColor: COLORS.border, borderRadius: 6, marginBottom: 8, width: '60%' }} />
    <View style={{ height: 18, backgroundColor: COLORS.border, borderRadius: 6, marginBottom: 8, width: '50%' }} />
    <View style={{ height: 18, backgroundColor: COLORS.border, borderRadius: 6, marginBottom: 8, width: '70%' }} />
    {/* Details Skeleton */}
    <View style={{ height: 18, backgroundColor: COLORS.border, borderRadius: 6, marginBottom: 8, width: '60%' }} />
    <View style={{ height: 18, backgroundColor: COLORS.border, borderRadius: 6, marginBottom: 8, width: '40%' }} />
  </View>
);

/* ===== Styles ===== */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: SPACING.lg, paddingBottom: 40 },

  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  loadingText: { marginTop: 10, color: COLORS.textMuted },

  imageWrap: { borderRadius: RADIUS.lg, overflow: "hidden", marginBottom: 16 },
  image: { width: "100%", height: 200 },
  imageOverlay: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    padding: 12,
    backgroundColor: "rgba(0,0,0,0.45)",
  },
  studioName: { color: "#fff", fontSize: 22, fontWeight: "bold" },
  status: { color: "#fff", marginTop: 4, fontSize: 17 },

  section: {
    backgroundColor: "#fff",
    borderRadius: RADIUS.lg,
    padding: 14,
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.brandBlue,
    marginBottom: 10,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  label: { color: COLORS.textMuted, fontSize: 16 },
  value: { fontWeight: "600", color: COLORS.textDark, fontSize: 17 },

  green: { color: COLORS.brandGreen },
  danger: { color: COLORS.danger },

  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderColor: COLORS.border,
  },
  detailName: { flex: 2, fontWeight: "500", fontSize: 16 },
  detailQty: { flex: 1, textAlign: "center", color: COLORS.textMuted, fontSize: 16 },
  detailTotal: {
    flex: 1,
    textAlign: "right",
    fontWeight: "bold",
    color: COLORS.brandBlue,
    fontSize: 16,
  },

  empty: { color: COLORS.textMuted, fontStyle: "italic" },
  bookingId: { textAlign: "center", marginTop: 10, color: COLORS.textMuted, fontSize: 15 },

  // Footer button
  footerBtnWrap: {
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderColor: COLORS.border,
  },
  payBtn: {
    backgroundColor: COLORS.brandBlue,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
  },
  payBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
    letterSpacing: 1,
  },
});
