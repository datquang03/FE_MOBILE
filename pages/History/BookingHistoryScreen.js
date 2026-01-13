import React, { useState, useCallback, useRef, useMemo } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { useFocusEffect } from "@react-navigation/native";

import { getMyBookings } from "../../features/Booking/bookingSlice";
import { getMyTransaction } from "../../features/Transaction/transactionSlice";
import { getOwnCustomSetDesign } from "../../features/SetDesign/setDesignSlice";

import HeaderBar from "../../components/ui/HeaderBar";
import TransactionSkeleton from "../../components/skeletons/TransactionSkeleton";
import { COLORS, RADIUS, SPACING, TYPOGRAPHY } from "../../constants/theme";

export default function BookingHistoryScreen({ navigation }) {
  const dispatch = useDispatch();
  const listRef = useRef(null);

  const { token } = useSelector((state) => state.auth);

  const { transactions = [], loading: transactionLoading } = useSelector(
    (state) => state.transaction
  );

  const { customSetDesigns = [], loading: setDesignLoading } = useSelector(
    (state) => state.setDesign
  );

  const [tab, setTab] = useState("rooms");

  /* =========================
        FETCH DATA
  ========================= */
  useFocusEffect(
    useCallback(() => {
      // Luôn gọi hooks ở cùng vị trí, không gọi trong if/else
      if (tab === "rooms") {
        dispatch(getMyBookings({ page: 1, limit: 10 }));
        listRef.current?.scrollToOffset({ offset: 0, animated: false });
      } else if (tab === "transactions") {
        dispatch(getMyTransaction({ page: 1, limit: 10 }));
      } else if (tab === "setdesigncustom") {
        dispatch(getOwnCustomSetDesign({ page: 1, limit: 10 }));
      }
    }, [dispatch, tab])
  );

  /* =========================
        NOT LOGIN
  ========================= */
  if (!token) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.emptyWrap}>
          <Text style={styles.emptyTitle}>Bạn chưa đăng nhập</Text>
          <Text style={styles.emptyDesc}>
            Vui lòng đăng nhập để xem lịch sử
          </Text>
          <TouchableOpacity
            style={styles.loginBtn}
            onPress={() => navigation.navigate("SignIn")}
          >
            <Text style={styles.loginBtnText}>Đăng nhập</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  /* =========================
        MAP ROOMS
  ========================= */
  // bookings: lấy từ state.booking.bookings (đã là mảng items)
  const bookings = useSelector((state) => state.booking.bookings) || [];
  const bookingsLoading = useSelector((state) => state.booking.bookingLoading);

  const roomData = useMemo(() => {
    if (!Array.isArray(bookings)) return [];
    return bookings.map((booking) => {
      return {
        id: booking._id,
        name: booking.studio?.name || `Booking #${booking._id.slice(-4)}`,
        image: booking.studio?.images?.[0] || null,
        location: booking.studio?.location || "",
        date: booking.createdAt ? new Date(booking.createdAt).toLocaleDateString("vi-VN") : "",
        status: booking.status,
        bookingRaw: booking,
      };
    });
  }, [bookings]);

  // transactions: lấy từ state.transaction.transactions
  const transactionData = useMemo(() => {
    const txs = Array.isArray(transactions)
      ? transactions
      : (transactions?.transactions || []); // fallback nếu là object
    return txs.map((tran) => {
      const booking = tran.bookingId || {};
      const schedule = booking.scheduleId || {};
      const studio = schedule.studioId || {};
      return {
        id: tran._id,
        name: studio.name || "Studio",
        image: Array.isArray(studio.images) && studio.images.length > 0 ? studio.images[0] : null,
        location: studio.location || "",
        price: tran.amount ? `${tran.amount.toLocaleString()}đ` : "",
        date: schedule.startTime ? new Date(schedule.startTime).toLocaleDateString("vi-VN") : "",
        time: schedule.startTime && schedule.endTime ? `${new Date(schedule.startTime).toLocaleTimeString("vi-VN", { hour: '2-digit', minute: '2-digit' })} - ${new Date(schedule.endTime).toLocaleTimeString("vi-VN", { hour: '2-digit', minute: '2-digit' })}` : "",
        status: tran.status,
        paymentCode: tran.paymentCode,
        payType: tran.payType,
        transactionId: tran.transactionId,
        bookingId: booking._id,
        raw: tran,
      };
    });
  }, [transactions]);

  /* =========================
        MAP CUSTOM SET DESIGN
  ========================= */
  const mappedCustomSetDesigns = useMemo(() => {
    if (!Array.isArray(customSetDesigns)) return [];
    return customSetDesigns.map((item) => {
      const image =
        Array.isArray(item.referenceImages) && item.referenceImages.length > 0
          ? item.referenceImages[0].url
          : null;
      const imageCount = Array.isArray(item.referenceImages)
        ? item.referenceImages.length
        : 0;
      return {
        ...item, // truyền toàn bộ thông tin sang
        id: item._id,
        name: item.customerName,
        email: item.email,
        phoneNumber: item.phoneNumber,
        description: item.description,
        budget: item.budget || "Chưa có",
        status: item.status || "Chưa có",
        category: item.preferredCategory || "Chưa có",
        image,
        imageCount,
        processedBy: item.processedBy?.email || "Chưa có",
        convertedToDesign: item.convertedToDesignId?.name || null,
        convertedPrice: item.convertedToDesignId?.price || null,
        createdAt: item.createdAt
          ? new Date(item.createdAt).toLocaleString("vi-VN", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })
          : "Chưa có",
      };
    });
  }, [customSetDesigns]);

  /* =========================
        RENDER
  ========================= */
  return (
    <SafeAreaView style={styles.safe}>
      <View style={{ marginTop: 32 }}>
        <HeaderBar title="Lịch sử" onBack={() => navigation.goBack()} />
      </View>

      {/* SEGMENT */}
      <View style={styles.segment}>
        {[
          { id: "rooms", label: "Phòng" },
          { id: "transactions", label: "Giao dịch" },
          { id: "setdesigncustom", label: "Đơn yêu cầu" },
        ].map((item) => (
          <TouchableOpacity
            key={item.id}
            style={[
              styles.segmentItem,
              tab === item.id && styles.segmentActive,
            ]}
            onPress={() => setTab(item.id)}
          >
            <Text
              style={[
                styles.segmentText,
                tab === item.id && styles.segmentTextActive,
              ]}
            >
              {item.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* CONTENT */}
      {tab === "rooms" ? (
        bookingsLoading ? (
          <TransactionSkeleton />
        ) : (
          <FlatList
            ref={listRef}
            data={roomData}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ padding: SPACING.lg }}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.historyCard,
                  {
                    flexDirection: 'row',
                    alignItems: 'center',
                    backgroundColor: '#fff',
                    borderWidth: 1,
                    borderColor: COLORS.border,
                    shadowColor: '#000',
                    shadowOpacity: 0.06,
                    shadowRadius: 8,
                    elevation: 2,
                  },
                ]}
                onPress={() =>
                  navigation.navigate("BookingStudioDetail", { bookingId: item.id })
                }
                activeOpacity={0.93}
                key={item.id}
              >
                <View style={{ flex: 1, marginLeft: SPACING.md }}>
                  <Text style={[styles.itemTitle, { fontSize: 17, marginBottom: 2 }]}>{item.name}</Text>
                  <Text style={styles.meta}>Mã đặt: <Text style={{ color: COLORS.textDark }}>{item.id}</Text></Text>
                  <Text style={styles.meta}>Ngày đặt: <Text style={{ color: COLORS.textDark }}>{item.date}</Text></Text>
                  <Text style={[
                    styles.status,
                    {
                      color:
                        item.status === "pending"
                          ? COLORS.danger
                          : item.status === "confirmed"
                          ? COLORS.brandBlue
                          : COLORS.textMuted,
                      marginTop: 6,
                    },
                  ]}>
                    Trạng thái: {item.status === "pending" ? "Chờ xác nhận" : item.status === "confirmed" ? "Đã xác nhận" : item.status}
                  </Text>
                </View>
              </TouchableOpacity>
            )}
          />
        )
      ) : tab === "transactions" ? (
        transactionLoading ? (
          <TransactionSkeleton />
        ) : (
          <FlatList
            ref={listRef}
            data={transactionData}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ padding: SPACING.lg }}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.historyCard}
                onPress={() =>
                  navigation.navigate("BookingDetail", { item })
                }
                activeOpacity={0.9}
                key={item.id}
              >
                {item.image ? (
                  <Image
                    source={{ uri: item.image }}
                    style={styles.thumbnail}
                  />
                ) : (
                  <View style={[styles.thumbnail, styles.noImage]}>
                    <Text>No Image</Text>
                  </View>
                )}
                <View style={{ flex: 1, marginLeft: SPACING.md }}>
                  <Text style={styles.itemTitle}>{item.name}</Text>
                  <Text style={styles.meta}>{item.location}</Text>
                  <Text style={styles.price}>{item.price}</Text>
                  <Text style={styles.meta}>Ngày: {item.date}</Text>
                  <Text style={styles.meta}>Giờ: {item.time}</Text>
                  <Text style={styles.status}>{item.status}</Text>
                </View>
              </TouchableOpacity>
            )}
          />
        )
      ) : setDesignLoading ? (
        <TransactionSkeleton />
      ) : (
        <FlatList
          data={mappedCustomSetDesigns}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: SPACING.lg }}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.historyCard,
                {
                  shadowColor: "#000",
                  shadowOpacity: 0.08,
                  shadowRadius: 8,
                  elevation: 2,
                  alignItems: "center",
                  paddingVertical: SPACING.md,
                },
              ]}
              onPress={() =>
                navigation.navigate("ConvertedCustomSetDesign", { item })
              }
              activeOpacity={0.9}
              key={item.id}
            >
              {/* IMAGE */}
              <View style={{ position: "relative", marginRight: SPACING.md }}>
                {item.image ? (
                  <Image
                    source={{ uri: item.image }}
                    style={styles.thumbnail}
                  />
                ) : (
                  <View style={[styles.thumbnail, styles.noImage]}>
                    <Text style={{ color: "#888" }}>Không có ảnh</Text>
                  </View>
                )}
                {item.imageCount > 1 && (
                  <View
                    style={{
                      position: "absolute",
                      left: -10,
                      top: -10,
                      width: 32,
                      height: 32,
                      backgroundColor: COLORS.border,
                      borderRadius: 16,
                      alignItems: "center",
                      justifyContent: "center",
                      borderWidth: 2,
                      borderColor: "#fff",
                      zIndex: 2,
                    }}
                  >
                    <Text
                      style={{
                        color: "#222",
                        fontWeight: "bold",
                        fontSize: 13,
                      }}
                    >
                      +{item.imageCount - 1}
                    </Text>
                  </View>
                )}
              </View>
              {/* INFO */}
              <View style={{ flex: 1 }}>
                <Text
                  style={[styles.itemTitle, { fontSize: 17, marginBottom: 2 }]}
                >
                  {item.name}
                </Text>
                <Text style={styles.meta}>
                  Email:{" "}
                  <Text style={{ color: COLORS.textDark }}>{item.email}</Text>
                </Text>
                <Text style={styles.meta}>
                  SĐT:{" "}
                  <Text style={{ color: COLORS.textDark }}>
                    {item.phoneNumber}
                  </Text>
                </Text>
                <Text style={[styles.price, { marginTop: 4 }]}>
                  Ngân sách:{" "}
                  <Text style={{ color: COLORS.brandBlue }}>
                    {item.budget !== "Chưa có"
                      ? `${item.budget.toLocaleString()}đ`
                      : "Chưa có"}
                  </Text>
                </Text>
                <Text style={styles.meta}>
                  Danh mục:{" "}
                  <Text style={{ color: COLORS.textDark }}>
                    {item.category}
                  </Text>
                </Text>
                <Text style={styles.meta}>
                  Ngày tạo:{" "}
                  <Text style={{ color: COLORS.textDark }}>
                    {item.createdAt}
                  </Text>
                </Text>
                <Text
                  style={[
                    styles.status,
                    {
                      color:
                        item.status === "pending"
                          ? COLORS.danger
                          : COLORS.brandBlue,
                      marginTop: 6,
                    },
                  ]}
                >
                  Trạng thái:{" "}
                  {item.status === "pending" ? "Chờ xử lý" : item.status}
                </Text>
                <Text style={styles.meta}>
                  Nhân viên xử lý:{" "}
                  <Text style={{ color: COLORS.textDark }}>
                    {item.processedBy}
                  </Text>
                </Text>
                <Text
                  numberOfLines={2}
                  ellipsizeMode="tail"
                  style={[
                    styles.meta,
                    {
                      marginTop: 2,
                      color: COLORS.textDark,
                      fontStyle: "italic",
                    },
                  ]}
                >
                  {item.description}
                </Text>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </SafeAreaView>
  );
}

/* =========================
        STYLES
========================= */
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },

  segment: {
    flexDirection: "row",
    backgroundColor: COLORS.surface,
    margin: SPACING.lg,
    borderRadius: RADIUS.lg,
    padding: 4,
  },
  segmentItem: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: RADIUS.lg,
  },
  segmentActive: { backgroundColor: COLORS.brandBlue },
  segmentText: { color: COLORS.textMuted, fontWeight: "600" },
  segmentTextActive: { color: "#fff" },

  historyCard: {
    flexDirection: "row",
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.md,
  },

  thumbnail: {
    width: 68,
    height: 68,
    borderRadius: RADIUS.md,
  },

  noImage: {
    backgroundColor: COLORS.border,
    alignItems: "center",
    justifyContent: "center",
  },

  imageCount: {
    position: "absolute",
    bottom: -6,
    right: -6,
    backgroundColor: COLORS.brandBlue,
    borderRadius: 12,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  imageCountText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },

  itemTitle: { fontWeight: "700", color: COLORS.textDark },
  meta: { fontSize: TYPOGRAPHY.caption, color: COLORS.textMuted },
  price: { color: COLORS.brandBlue, fontWeight: "700", marginTop: 2 },
  status: { fontWeight: "700", marginTop: 4, color: COLORS.brandBlue },

  emptyWrap: { flex: 1, justifyContent: "center", alignItems: "center" },
  emptyTitle: { fontSize: 22, fontWeight: "bold" },
  emptyDesc: { color: COLORS.textMuted, marginVertical: 8 },
  loginBtn: {
    backgroundColor: COLORS.brandBlue,
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 24,
  },
  loginBtnText: { color: "#fff", fontWeight: "bold" },
});
