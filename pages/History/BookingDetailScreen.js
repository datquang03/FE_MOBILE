import React, { useEffect, useState } from "react";
import { SafeAreaView, View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { getTransactionById } from "../../features/Transaction/transactionSlice";
import HeaderBar from "../../components/ui/HeaderBar";
import { COLORS, RADIUS, SPACING, TYPOGRAPHY } from "../../constants/theme";
import PrimaryButton from "../../components/ui/PrimaryButton";
import TransactionDetailSkeletonLoading from "../../components/skeletons/TransactionDetailSkeletonLoading";

export default function BookingDetailScreen({ route, navigation }) {
  const dispatch = useDispatch();
  const { item } = route.params || {};
  const transactionDetail = useSelector((state) => state.transaction.transactionDetail);
  const loading = useSelector((state) => state.transaction.loading);
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    if (item && item.id) {
      dispatch(getTransactionById(item.id));
    }
  }, [item, dispatch]);

  if (loading || !transactionDetail) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={{ marginTop: 32 }}>
          <HeaderBar
            title="Lịch sử"
            onBack={() => navigation.goBack?.()}
            rightIcon="more-vertical"
            onRightPress={() => setShowMenu((v) => !v)}
          />
          {showMenu && (
            <>
              <TouchableOpacity
                style={[styles.overlay, { zIndex: 29, position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }]}
                activeOpacity={1}
                onPress={() => setShowMenu(false)}
              />
              <View style={styles.dropdownMenu}>
                <TouchableOpacity style={styles.menuItem} onPress={() => setShowMenu(false)}>
                  <Text style={styles.menuItemText}>Báo cáo</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
        <TransactionDetailSkeletonLoading />
      </SafeAreaView>
    );
  }

  // Map dữ liệu đẹp từ transactionDetail
  const studio = transactionDetail.bookingId?.scheduleId?.studioId;
  const user = transactionDetail.bookingId?.userId;
  const schedule = transactionDetail.bookingId?.scheduleId;

  return (
    <SafeAreaView style={styles.safe}>
      <View style={{ marginTop: 32 }}>
        <HeaderBar
          title="Lịch sử"
          onBack={() => navigation.goBack?.()}
          rightIcon="more-vertical"
          onRightPress={() => setShowMenu((v) => !v)}
        />
        {showMenu && (
          <>
            <TouchableOpacity
              style={[styles.overlay, { zIndex: 29, position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }]}
              activeOpacity={1}
              onPress={() => setShowMenu(false)}
            />
            <View style={styles.dropdownMenu}>
              <TouchableOpacity style={styles.menuItem} onPress={() => setShowMenu(false)}>
                <Text style={styles.menuItemText}>Báo cáo</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>
      <View style={styles.card}>
        <View style={styles.row}>
          <Image source={{ uri: studio?.images?.[0] }} style={styles.thumbnail} />
          <View style={{ flex: 1, marginLeft: SPACING.md }}>
            <Text style={styles.title}>{studio?.name}</Text>
            <Text style={styles.meta}>{studio?.location}</Text>
            <Text style={styles.price}>{transactionDetail.amount?.toLocaleString()}đ</Text>
          </View>
        </View>
        <Text style={styles.sectionLabel}>Thông tin giao dịch</Text>
        <View style={styles.infoBlock}>
          <Info line1="Khách hàng" line2={user?.fullName || user?.username} />
          <Info line1="Số điện thoại" line2={user?.phone} />
          <Info line1="Email" line2={user?.email} />
          <Info line1="Ngày đặt" line2={schedule?.startTime ? new Date(schedule.startTime).toLocaleDateString("vi-VN") : ""} />
          <Info line1="Giờ" line2={schedule?.startTime ? `${new Date(schedule.startTime).toLocaleTimeString("vi-VN", { hour: '2-digit', minute: '2-digit' })} - ${new Date(schedule.endTime).toLocaleTimeString("vi-VN", { hour: '2-digit', minute: '2-digit' })}` : ""} />
          <Info line1="Trạng thái" line2={transactionDetail.status} />
          <Info line1="Mã thanh toán" line2={transactionDetail.paymentCode} />
        </View>
        <View style={styles.barcode}>
          <Text style={styles.barcodeText}>{transactionDetail.transactionId}</Text>
        </View>
      </View>
      <View style={styles.footer}>
        <PrimaryButton label="Quay lại" onPress={() => navigation.goBack()} />
      </View>
    </SafeAreaView>
  );
}

const Info = ({ line1, line2 }) => (
  <View style={styles.infoRow}>
    <Text style={styles.infoLabel}>{line1}</Text>
    <Text style={styles.infoValue}>{line2}</Text>
  </View>
);

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  card: {
    margin: SPACING.lg,
    padding: SPACING.xl,
    borderRadius: RADIUS.xl,
    backgroundColor: COLORS.surface,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.05,
    shadowRadius: 30,
    elevation: 4,
    flex: 1,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: SPACING.lg,
  },
  thumbnail: {
    width: 92,
    height: 92,
    borderRadius: RADIUS.lg,
  },
  title: {
    fontSize: TYPOGRAPHY.headingS,
    fontWeight: "700",
    color: COLORS.textDark,
  },
  meta: {
    color: COLORS.textMuted,
  },
  price: {
    color: COLORS.brandBlue,
    fontWeight: "700",
    marginTop: 4,
  },
  rating: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.background,
    alignItems: "center",
    justifyContent: "center",
  },
  ratingText: {
    fontWeight: "700",
    color: COLORS.textDark,
  },
  sectionLabel: {
    fontSize: TYPOGRAPHY.headingS,
    fontWeight: "600",
    marginBottom: SPACING.md,
  },
  mapPlaceholder: {
    height: 140,
    borderRadius: RADIUS.lg,
    backgroundColor: COLORS.background,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: SPACING.lg,
  },
  mapText: {
    color: COLORS.textDark,
    fontWeight: "600",
  },
  infoBlock: {
    marginBottom: SPACING.lg,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: SPACING.md,
  },
  infoLabel: {
    color: COLORS.textMuted,
  },
  infoValue: {
    color: COLORS.textDark,
    fontWeight: "600",
  },
  barcode: {
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.md,
    alignItems: "center",
  },
  barcodeText: {
    letterSpacing: 2,
    fontWeight: "700",
    color: COLORS.textDark,
  },
  footer: {
    padding: SPACING.lg,
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "transparent",
    zIndex: 99,
  },
  dropdownMenu: {
    position: "absolute",
    top: 56,
    right: 18,
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingVertical: 6,
    paddingHorizontal: 0,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 6,
    zIndex: 100,
    minWidth: 140,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 18,
  },
  menuItemText: {
    fontSize: 16,
    color: "#E53935",
    fontWeight: "bold",
  },
});

