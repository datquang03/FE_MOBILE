import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { getStudioById } from "../../features/Studio/studioSlice";
import HeaderBar from "../../components/ui/HeaderBar";
import PrimaryButton from "../../components/ui/PrimaryButton";
import { COLORS, RADIUS, SPACING, TYPOGRAPHY } from "../../constants/theme";
import { getCurrentUser } from "../../features/Authentication/authSlice";
import { createBooking } from "../../features/Booking/bookingSlice";
import ToastNotification from "../../components/toast/ToastNotification";
import FullScreenLoading from "../../components/loadings/fullScreenLoading";
import Modal from "react-native-modal";

export default function CheckoutScreen({ navigation, route }) {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const studioDetail = useSelector((state) => state.studio.studioDetail);
  const currentBooking = useSelector((state) => state.booking.booking);
  const currentError = useSelector((state) => state.booking.bookingError);
  const isBookingLoading = useSelector((state) => state.booking.bookingLoading);
  const {
    studio,
    summary,
    guests = 10,
    email = "",
    phone = "",
    total,
  } = route?.params || {};

  const [bill, setBill] = useState(null);
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [confirmModal, setConfirmModal] = useState(false);

  useEffect(() => {
    dispatch(getCurrentUser());
    if (studio?._id) {
      dispatch(getStudioById(studio._id));
    }
  }, [dispatch, studio?._id]);
  console.log(currentError);
  useEffect(() => {
    if (currentBooking && currentBooking._id) {
      setBill(currentBooking);
      navigation.replace("BookingSuccess", { booking: currentBooking });
    }
    if (currentError) {
      // Same robust extraction as in catch block
      let errorMessage = "Đặt phòng thất bại!";
      let suggestion = "Vui lòng thử lại.";

      if (currentError) {
        if (typeof currentError === "string") {
          errorMessage = currentError;
        } else if (typeof currentError === "object" && currentError !== null) {
          errorMessage =
            currentError.message ||
            currentError.error ||
            currentError.errorMessage ||
            currentError.errorCode ||
            currentError.msg ||
            JSON.stringify(currentError);
          suggestion = currentError.suggestion || suggestion;
        }
      }

      setToast({
        type: "error",
        message: errorMessage,
        suggestion,
      });
    }
  }, [currentBooking, currentError, navigation]);
  // Lấy lại chi tiết thanh toán từ summary nếu có
  const paymentDetail = summary || {};
  // Lấy ngày giờ check-in/check-out từ summary nếu có
  const checkInDate = summary?.startDate
    ? new Date(summary.startDate).toLocaleDateString("vi-VN")
    : route?.params?.checkInDate || "";
  const checkInTimeStr =
    summary?.checkinTime || route?.params?.checkInTimeStr || "";
  const checkOutDate = summary?.endDate
    ? new Date(summary.endDate).toLocaleDateString("vi-VN")
    : route?.params?.checkOutDate || "";
  const checkOutTimeStr =
    summary?.checkoutTime || route?.params?.checkOutTimeStr || "";
  console.log("a", toast);
  return (
    <SafeAreaView style={styles.safe}>
      {/* Toast message */}
      {toast && (
        <View
          style={{
            position: "absolute",
            top: 60,
            left: 0,
            right: 0,
            zIndex: 999,
          }}
        >
          <ToastNotification
            type={toast.type}
            message={toast.message}
            suggestion={toast.suggestion || ""}
            onClose={() => setToast(null)}
          />
        </View>
      )}
      <View style={{ paddingTop: 32 }} />
      <HeaderBar
        title="Hóa đơn thanh toán"
        onBack={() => navigation.goBack?.()}
        rightIcon="more-vertical"
      />
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: SPACING.lg,
          paddingTop: 12,
          paddingBottom: 24,
        }}
      >
        <View
          style={[
            styles.card,
            {
              borderWidth: 2,
              borderColor: COLORS.brandBlue,
              backgroundColor: "#fff",
            },
          ]}
        >
          {/* Bill sau khi booking thành công */}
          {bill ? (
            <>
              <View style={{ alignItems: "center", marginBottom: 18 }}>
                <Text
                  style={{
                    fontSize: 22,
                    fontWeight: "bold",
                    color: COLORS.brandBlue,
                    marginBottom: 2,
                  }}
                >
                  S+ Studio
                </Text>
                <Text style={{ color: COLORS.textMuted, fontSize: 15 }}>
                  Địa chỉ: 123 Đường Studio, Quận 1, TP.HCM
                </Text>
                <Text style={{ color: COLORS.textMuted, fontSize: 15 }}>
                  Hotline: 0909 999 999
                </Text>
                <Text style={{ color: COLORS.textMuted, fontSize: 15 }}>
                  Mã số thuế: 0312345678
                </Text>
              </View>
              <View style={{ alignItems: "center", marginBottom: 18 }}>
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: "bold",
                    color: COLORS.textDark,
                  }}
                >
                  HÓA ĐƠN ĐẶT PHÒNG
                </Text>
                <Text style={{ color: COLORS.textMuted, fontSize: 14 }}>
                  Ngày xuất:{" "}
                  {new Date(bill.createdAt).toLocaleDateString("vi-VN")}
                </Text>
              </View>
              <View style={styles.topRow}>
                <Image
                  source={{
                    uri: studioDetail?.images?.[0] || studio?.images?.[0],
                  }}
                  style={styles.thumbnail}
                />
                <View
                  style={{
                    flex: 1,
                    marginLeft: SPACING.md,
                    justifyContent: "center",
                  }}
                >
                  <Text style={styles.studioName}>
                    {studioDetail?.name || studio?.name}
                  </Text>
                  <Text style={styles.studioMeta}>
                    {studioDetail?.location || studio?.location}
                  </Text>
                  <Text style={styles.price}>
                    {(
                      studioDetail?.basePricePerHour ||
                      studio?.basePricePerHour ||
                      0
                    ).toLocaleString()}
                    đ/giờ
                  </Text>
                </View>
              </View>
              <View style={[styles.section, styles.bookingInfoCard]}>
                <Text style={styles.sectionLabelHighlight}>
                  Thông tin ngày đặt phòng
                </Text>
                <View style={styles.bookingInfoRow}>
                  <View style={styles.bookingCol}>
                    <Text style={styles.bookingLabel}>Check - In</Text>
                    <View style={styles.bookingDateRow}>
                      <Text style={{ fontSize: 18, marginRight: 6 }}>⏰</Text>
                      <Text style={styles.bookingTime}>{bill.checkinTime}</Text>
                    </View>
                    <View style={styles.bookingDateRow}>
                      <Text style={{ fontSize: 18, marginRight: 6 }}>📅</Text>
                      <Text style={styles.bookingDate}>
                        {new Date(bill.startDate).toLocaleDateString("vi-VN")}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.dividerVertical} />
                  <View style={styles.bookingCol}>
                    <Text style={styles.bookingLabel}>Check - Out</Text>
                    <View style={styles.bookingDateRow}>
                      <Text style={{ fontSize: 18, marginRight: 6 }}>⏰</Text>
                      <Text style={styles.bookingTime}>
                        {bill.checkoutTime}
                      </Text>
                    </View>
                    <View style={styles.bookingDateRow}>
                      <Text style={{ fontSize: 18, marginRight: 6 }}>📅</Text>
                      <Text style={styles.bookingDate}>
                        {new Date(bill.endDate).toLocaleDateString("vi-VN")}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
              <View style={[styles.section, { marginBottom: 10 }]}>
                <Text style={styles.sectionLabel}>Thông tin khách hàng</Text>
                <InfoRow
                  icon="👤"
                  label="Tên khách hàng"
                  value={user?.fullName || user?.name || "---"}
                />
                <InfoRow icon="✉️" label="Email" value={user?.email || email} />
                <InfoRow
                  icon="📞"
                  label="Số điện thoại"
                  value={user?.phone || phone}
                />
              </View>
              <View style={styles.uniformCard}>
                <Text style={styles.uniformCardTitle}>Chi tiết thanh toán</Text>
                <View style={styles.paymentDetailList}>
                  <InfoRow
                    label="Tổng trước giảm giá"
                    value={`${bill.totalBeforeDiscount?.toLocaleString()}đ`}
                  />
                  <InfoRow
                    label="Giảm giá"
                    value={`${bill.discountAmount?.toLocaleString()}đ`}
                  />
                  <InfoRow
                    label="Thành tiền"
                    value={`${bill.finalAmount?.toLocaleString()}đ`}
                    bold
                  />
                </View>
              </View>
              {/* Chính sách hủy và no-show */}
              <View style={styles.uniformCard}>
                <Text style={styles.uniformCardTitle}>Chính sách</Text>
                <Text
                  style={{
                    color: "#1976D2",
                    fontWeight: "bold",
                    marginBottom: 4,
                  }}
                >
                  Hủy phòng:
                </Text>
                {bill.policySnapshots?.cancellation?.refundTiers?.map(
                  (tier) => (
                    <Text
                      key={tier._id}
                      style={{ color: "#444", marginBottom: 2 }}
                    >
                      • {tier.description}
                    </Text>
                  )
                )}
                <Text
                  style={{
                    color: "#1976D2",
                    fontWeight: "bold",
                    marginTop: 8,
                    marginBottom: 4,
                  }}
                >
                  No-show:
                </Text>
                <Text style={{ color: "#444" }}>
                  • Nếu không đến, sẽ bị tính phí{" "}
                  {bill.policySnapshots?.noShow?.noShowRules
                    ?.chargePercentage || 100}
                  % tổng tiền ({bill.finalAmount?.toLocaleString()}đ)
                </Text>
              </View>
            </>
          ) : (
            <>
              <View style={{ alignItems: "center", marginBottom: 18 }}>
                <Text
                  style={{
                    fontSize: 22,
                    fontWeight: "bold",
                    color: COLORS.brandBlue,
                    marginBottom: 2,
                  }}
                >
                  S+ Studio
                </Text>
                <Text style={{ color: COLORS.textMuted, fontSize: 15 }}>
                  Địa chỉ: 123 Đường Studio, Quận 1, TP.HCM
                </Text>
                <Text style={{ color: COLORS.textMuted, fontSize: 15 }}>
                  Hotline: 0909 999 999
                </Text>
                <Text style={{ color: COLORS.textMuted, fontSize: 15 }}>
                  Mã số thuế: 0312345678
                </Text>
              </View>
              <View style={{ alignItems: "center", marginBottom: 18 }}>
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: "bold",
                    color: COLORS.textDark,
                  }}
                >
                  HÓA ĐƠN ĐẶT PHÒNG
                </Text>
                <Text style={{ color: COLORS.textMuted, fontSize: 14 }}>
                  Ngày xuất: {new Date().toLocaleDateString("vi-VN")}
                </Text>
              </View>
              {/* Thông tin studio */}
              <View style={styles.topRow}>
                <Image
                  source={{
                    uri: studioDetail?.images?.[0] || studio?.images?.[0],
                  }}
                  style={styles.thumbnail}
                />
                <View
                  style={{
                    flex: 1,
                    marginLeft: SPACING.md,
                    justifyContent: "center",
                  }}
                >
                  <Text style={styles.studioName}>
                    {studioDetail?.name || studio?.name}
                  </Text>
                  <Text style={styles.studioMeta}>
                    {studioDetail?.location || studio?.location}
                  </Text>
                  <Text style={styles.price}>
                    {(
                      studioDetail?.basePricePerHour ||
                      studio?.basePricePerHour ||
                      0
                    ).toLocaleString()}
                    đ/giờ
                  </Text>
                </View>
              </View>
              {/* Thông tin ngày đặt phòng - chỉ hiển thị 1 lần, căn đều và highlight */}
              <View style={[styles.section, styles.bookingInfoCard]}>
                <Text style={styles.sectionLabelHighlight}>
                  Thông tin ngày đặt phòng
                </Text>
                <View style={styles.bookingInfoRow}>
                  <View style={styles.bookingCol}>
                    <Text style={styles.bookingLabel}>Check - In</Text>
                    <View style={styles.bookingDateRow}>
                      <Text style={{ fontSize: 18, marginRight: 6 }}>⏰</Text>
                      <Text style={styles.bookingTime}>{checkInTimeStr}</Text>
                    </View>
                    <View style={styles.bookingDateRow}>
                      <Text style={{ fontSize: 18, marginRight: 6 }}>📅</Text>
                      <Text style={styles.bookingDate}>{checkInDate}</Text>
                    </View>
                  </View>
                  <View style={styles.dividerVertical} />
                  <View style={styles.bookingCol}>
                    <Text style={styles.bookingLabel}>Check - Out</Text>
                    <View style={styles.bookingDateRow}>
                      <Text style={{ fontSize: 18, marginRight: 6 }}>⏰</Text>
                      <Text style={styles.bookingTime}>{checkOutTimeStr}</Text>
                    </View>
                    <View style={styles.bookingDateRow}>
                      <Text style={{ fontSize: 18, marginRight: 6 }}>📅</Text>
                      <Text style={styles.bookingDate}>{checkOutDate}</Text>
                    </View>
                  </View>
                </View>
              </View>
              {/* Thông tin khách hàng với icon unicode */}
              <View style={[styles.section, { marginBottom: 10 }]}>
                <Text style={styles.sectionLabel}>Thông tin khách hàng</Text>
                <InfoRow
                  icon="👤"
                  label="Tên khách hàng"
                  value={user?.fullName || user?.name || "---"}
                />
                <InfoRow icon="✉️" label="Email" value={user?.email || email} />
                <InfoRow
                  icon="📞"
                  label="Số điện thoại"
                  value={user?.phone || phone}
                />
              </View>
              {/* Chi tiết thanh toán */}
              <View style={styles.uniformCard}>
                <Text style={styles.uniformCardTitle}>Chi tiết thanh toán</Text>
                <View style={styles.paymentDetailList}>
                  <View style={styles.paymentDetailRow}>
                    <Text style={styles.paymentLabel}>Thời gian</Text>
                    <Text style={styles.paymentValue}>
                      {paymentDetail.totalHours?.toFixed(1) || 0} tiếng
                    </Text>
                  </View>
                  <View style={styles.paymentDetailRow}>
                    <Text style={styles.paymentLabel}>Số ngày</Text>
                    <Text style={styles.paymentValue}>
                      {paymentDetail.totalDays || 1}
                    </Text>
                  </View>
                  <View style={styles.paymentDetailRow}>
                    <Text style={styles.paymentLabel}>Giá phòng</Text>
                    <Text style={styles.paymentValue}>
                      {paymentDetail.roomPricePerHour?.toLocaleString() ||
                        studioDetail?.basePricePerHour?.toLocaleString() ||
                        studio?.basePricePerHour?.toLocaleString()}
                      đ x {paymentDetail.totalHours?.toFixed(1) || 0}h ={" "}
                      {(paymentDetail.roomPrice || 0).toLocaleString()}đ
                    </Text>
                  </View>
                  <View style={styles.paymentDetailRow}>
                    <Text style={styles.paymentLabel}>Phí dịch vụ</Text>
                    <Text style={styles.paymentValue}>
                      {paymentDetail.servicePrice?.toLocaleString() || 0}đ
                    </Text>
                  </View>
                  <View style={styles.paymentDetailRow}>
                    <Text style={styles.paymentLabel}>
                      Phí phụ thu (dụng cụ, phòng,...)
                    </Text>
                    <Text style={styles.paymentValue}>
                      {paymentDetail.equipmentPrice?.toLocaleString() || 0}đ
                    </Text>
                  </View>
                  <View style={styles.paymentSeparator} />
                  <View style={styles.paymentDetailRowTotal}>
                    <Text style={styles.paymentLabelTotal}>
                      Tổng thanh toán
                    </Text>
                    <Text style={styles.paymentValueTotal}>
                      {(total || paymentDetail.total || 0).toLocaleString()}đ
                    </Text>
                  </View>
                </View>
              </View>
              {/* Footer xác nhận */}
              <View style={{ alignItems: "center", marginTop: 18 }}>
                <Text style={{ color: COLORS.textMuted, fontSize: 14 }}>
                  Cảm ơn bạn đã sử dụng dịch vụ của S+ Studio!
                </Text>
                <Text style={{ color: COLORS.textMuted, fontSize: 14 }}>
                  Mọi thắc mắc vui lòng liên hệ hotline hoặc email hỗ trợ.
                </Text>
              </View>
            </>
          )}
        </View>
      </ScrollView>
      {loading && (
        <FullScreenLoading
          loading={loading}
          text="Đang tạo đơn thanh toán..."
        />
      )}
      {/* Modal xác nhận tạo đơn */}
      <Modal
        isVisible={confirmModal}
        backdropOpacity={0.3}
        onBackdropPress={() => setConfirmModal(false)}
      >
        <View
          style={{
            backgroundColor: "#fff",
            borderRadius: 16,
            borderWidth: 2,
            borderColor: COLORS.brandBlue,
            padding: 24,
            alignItems: "center",
          }}
        >
          <Text
            style={{
              fontSize: 18,
              fontWeight: "bold",
              color: COLORS.brandBlue,
              marginBottom: 12,
              textAlign: "center",
            }}
          >
            Bạn chắc chắn muốn tạo đơn thanh toán?
          </Text>
          <View style={{ flexDirection: "row", gap: 16, marginTop: 8 }}>
            <TouchableOpacity
              onPress={async () => {
                setConfirmModal(false);
                setLoading(true);
                setToast(null);
                try {
                  const details = [];
                  if (summary?.selectedEquipments?.length) {
                    summary.selectedEquipments.forEach((eq) => {
                      details.push({
                        detailType: "equipment",
                        _id: eq._id,
                        name: eq.name,
                        pricePerHour: eq.pricePerHour,
                        quantity: eq.quantity || 1,
                      });
                    });
                  }
                  if (summary?.selectedServices?.length) {
                    summary.selectedServices.forEach((sv) => {
                      details.push({
                        detailType: "extra_service",
                        _id: sv._id,
                        name: sv.name,
                        pricePerUse: sv.pricePerUse,
                        quantity: sv.quantity || 1,
                      });
                    });
                  }
                  const bookingData = {
                    studioId: studio?._id,
                    startTime:
                      summary?.startDate && summary?.checkinTime
                        ? `${summary.startDate}T${summary.checkinTime}`
                        : "",
                    endTime:
                      summary?.endDate && summary?.checkoutTime
                        ? `${summary.endDate}T${summary.checkoutTime}`
                        : "",
                    details,
                    ...(summary?.promoId && { promoId: summary.promoId }),
                    ...(summary?.promoCode && { promoCode: summary.promoCode }),
                    ...(summary?.discountAmount && {
                      discountAmount: summary.discountAmount,
                    }),
                  };
                  if (
                    !bookingData.studioId ||
                    !bookingData.startTime ||
                    !bookingData.endTime
                  ) {
                    setLoading(false);
                    setToast({
                      type: "error",
                      message: "Thiếu thông tin đặt phòng!",
                      suggestion: "Vui lòng kiểm tra lại.",
                    });
                    return;
                  }
                  console.log(bookingData);
                  const res = await dispatch(
                    createBooking(bookingData)
                  ).unwrap();
                  setLoading(false);
                  navigation.replace("BookingSuccess", {
                    booking: res?.data?.booking || res?.booking || res,
                    studio,
                    toastMessage: res?.message,
                  });
                } catch (err) {
                  setLoading(false);
                  // Extract the best possible message as a string
                  let errorMessage = "Đặt phòng thất bại!";
                  let suggestion = "Vui lòng thử lại.";

                  if (err) {
                    if (typeof err === "string") {
                      errorMessage = err;
                    } else if (typeof err === "object") {
                      errorMessage =
                        err.message ||
                        err.error ||
                        err.errorMessage ||
                        err.errorCode ||
                        err.msg ||
                        JSON.stringify(err);
                      suggestion = err.suggestion || suggestion;
                    }
                  }

                  setToast({
                    type: "error",
                    message: errorMessage,
                    suggestion,
                  });
                }
              }}
              style={{
                borderWidth: 2,
                borderColor: COLORS.brandBlue,
                backgroundColor: "#fff",
                borderRadius: 24,
                paddingVertical: 10,
                paddingHorizontal: 28,
                marginRight: 8,
              }}
            >
              <Text
                style={{
                  color: COLORS.brandBlue,
                  fontWeight: "bold",
                  fontSize: 16,
                }}
              >
                Có
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setConfirmModal(false)}
              style={{
                backgroundColor: "#E53935",
                borderRadius: 24,
                paddingVertical: 10,
                paddingHorizontal: 28,
                marginLeft: 8,
              }}
            >
              <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 16 }}>
                Không
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <View style={styles.footer}>
        <PrimaryButton
          label="Xác nhận đặt phòng"
          onPress={() => setConfirmModal(true)}
        />
      </View>
    </SafeAreaView>
  );
}

const InfoRow = ({ icon, label, value, bold }) => (
  <View style={styles.infoRow}>
    {icon ? (
      <View style={styles.iconCircle}>
        <Text style={styles.iconText}>{icon.slice(0, 1).toUpperCase()}</Text>
      </View>
    ) : null}
    <View style={{ flex: 1 }}>
      <Text style={styles.infoLabel}>{label}</Text>
    </View>
    <Text style={[styles.infoValue, bold && styles.bold]}>{value}</Text>
  </View>
);

// Định nghĩa lại DateInfo cho CheckoutScreen KHÔNG dùng Feather
const DateInfo = ({ label, date, time }) => (
  <View style={styles.dateInfo}>
    <Text style={styles.helperLabel}>{label}</Text>
    <View style={styles.dateRow}>
      <Text style={{ fontSize: 16, marginRight: 4 }}>⏰</Text>
      <Text style={styles.timeText}>{time}</Text>
    </View>
    <View style={styles.dateRow}>
      <Text style={{ fontSize: 16, marginRight: 4 }}>📅</Text>
      <Text style={styles.dateText}>{date}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scroll: {
    paddingHorizontal: SPACING.lg,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    padding: SPACING.xl,
    marginBottom: SPACING.xl,
    marginTop: SPACING.md,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.06,
    shadowRadius: 30,
    elevation: 4,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: SPACING.lg,
  },
  thumbnail: {
    width: 88,
    height: 88,
    borderRadius: RADIUS.lg,
  },
  studioName: {
    fontSize: TYPOGRAPHY.headingS,
    fontWeight: "700",
    color: COLORS.textDark,
  },
  studioMeta: {
    color: COLORS.textMuted,
    marginVertical: 4,
  },
  price: {
    color: COLORS.brandBlue,
    fontWeight: "700",
  },
  ratingBadge: {
    backgroundColor: COLORS.surfaceAlt,
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  ratingText: {
    color: COLORS.surface,
    fontWeight: "700",
  },
  section: {
    marginBottom: SPACING.xl,
  },
  sectionLabel: {
    fontSize: TYPOGRAPHY.headingS,
    fontWeight: "600",
    color: COLORS.textDark,
    marginBottom: SPACING.sm,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: SPACING.sm,
  },
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.background,
    alignItems: "center",
    justifyContent: "center",
    marginRight: SPACING.sm,
  },
  iconText: {
    fontWeight: "600",
    color: COLORS.brandBlue,
  },
  infoLabel: {
    color: COLORS.textMuted,
  },
  infoValue: {
    color: COLORS.textDark,
    fontWeight: "600",
  },
  setDesignRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: SPACING.xl,
  },
  setDesignHint: {
    color: COLORS.textMuted,
  },
  linkText: {
    color: COLORS.brandBlue,
    fontWeight: "600",
  },
  separator: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: SPACING.md,
  },
  bold: {
    fontWeight: "700",
    color: COLORS.textDark,
  },
  footer: {
    padding: SPACING.lg,
    backgroundColor: COLORS.background,
  },
  paymentDetailList: {
    marginTop: SPACING.md,
  },
  paymentDetailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: SPACING.sm,
  },
  paymentLabel: {
    color: COLORS.textMuted,
  },
  paymentValue: {
    color: COLORS.textDark,
    fontWeight: "600",
  },
  paymentSeparator: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: SPACING.md,
  },
  paymentDetailRowTotal: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: SPACING.md,
  },
  paymentLabelTotal: {
    color: COLORS.textDark,
    fontWeight: "700",
  },
  paymentValueTotal: {
    color: COLORS.brandBlue,
    fontWeight: "700",
  },
  bookingInfoCard: {
    backgroundColor: "#F7F5FF",
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "#6C47FF",
    padding: 18,
    marginBottom: 18,
    alignItems: "center",
    alignSelf: "center",
    width: "100%",
    shadowColor: "#6C47FF",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  sectionLabelHighlight: {
    fontSize: 19,
    fontWeight: "bold",
    color: "#6C47FF",
    marginBottom: 12,
    textAlign: "center",
    letterSpacing: 0.5,
  },
  bookingInfoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    gap: 12,
  },
  bookingCol: {
    flex: 1,
    alignItems: "center",
  },
  bookingLabel: {
    color: "#1976D2",
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 4,
  },
  bookingDateRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 2,
  },
  bookingTime: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1976D2",
  },
  bookingDate: {
    fontSize: 16,
    color: "#888",
    fontWeight: "600",
  },
  dividerVertical: {
    width: 1.5,
    backgroundColor: "#6C47FF",
    height: 60,
    marginHorizontal: 10,
    borderRadius: 2,
  },
});
