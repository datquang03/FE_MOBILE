import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  FlatList,
  Dimensions,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { getAllEquipments } from "../../features/Equipment/equipmentSlice";
import HeaderBar from "../../components/ui/HeaderBar";
import PrimaryButton from "../../components/ui/PrimaryButton";
import { COLORS, RADIUS, SPACING, TYPOGRAPHY } from "../../constants/theme";

const { width } = Dimensions.get("window");

function EquipmentCard({ item, selected, onPress }) {
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      style={{
        backgroundColor: selected ? '#E3F2FD' : '#fff',
        borderRadius: 18,
        padding: 10,
        marginBottom: 12,
        marginHorizontal: 4,
        width: width * 0.42,
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 2,
        alignSelf: 'center',
        borderWidth: selected ? 2 : 0,
        borderColor: selected ? '#2196F3' : 'transparent',
      }}
    >
      {/* Tickbox vuông ở góc trên bên phải */}
      <View style={{ position: 'absolute', top: 8, right: 8, zIndex: 2 }}>
        <View style={{
          width: 22,
          height: 22,
          borderRadius: 6,
          backgroundColor: '#fff',
          alignItems: 'center',
          justifyContent: 'center',
          borderWidth: 1.5,
          borderColor: selected ? '#2196F3' : '#bbb',
        }}>
          {selected && (
            <Feather name="check" size={16} color="#2196F3" style={{ marginTop: -1, marginLeft: 0 }} />
          )}
        </View>
      </View>
      <Image source={{ uri: item.image }} style={{ width: '100%', height: 90, borderRadius: 10, marginBottom: 8 }} resizeMode="cover" />
      <Text style={{ fontWeight: 'bold', fontSize: 15, color: '#6C47FF', marginBottom: 2 }}>{item.name}</Text>
      <Text style={{ color: '#6C47FF', fontWeight: 'bold', marginBottom: 2, fontSize: 13 }}>Giá: {item.pricePerHour.toLocaleString()}đ/giờ</Text>
      <Text style={{ color: '#888', fontSize: 12 }}>Tổng: {item.totalQty} | Đang dùng: {item.inUseQty} | Còn: <Text style={{ color: item.availableQty > 0 ? '#43A047' : '#E53935', fontWeight: 'bold' }}>{item.availableQty}</Text></Text>
    </TouchableOpacity>
  );
}

export default function BookingFormScreen({ navigation, route }) {
  const [guests, setGuests] = useState(10);
  const [showMenu, setShowMenu] = useState(false);
  const [selectedEquipments, setSelectedEquipments] = useState([]);

  // Nhận params từ SelectDateScreen
  const { startTime, endTime, studioId, bookingMap, range } = route?.params || {};

  // Hiển thị ngày/giờ lấy từ params, fallback rỗng nếu chưa có
  const checkInDate = startTime ? startTime.slice(0, 10).split('-').reverse().join('/') : '';
  const checkInTime = startTime ? startTime.slice(11, 16) : '';
  const checkOutDate = endTime ? endTime.slice(0, 10).split('-').reverse().join('/') : '';
  const checkOutTime = endTime ? endTime.slice(11, 16) : '';

  // Lấy danh sách thiết bị
  const dispatch = useDispatch();
  const { equipments, loading } = useSelector((state) => state.equipment);
  useEffect(() => {
    dispatch(getAllEquipments());
  }, [dispatch]);

  return (
    <SafeAreaView style={styles.safe}>
      {/* Add a top spacer for consistent content padding */}
      <View style={{ paddingTop: 32 }} />
      {showMenu && (
        <TouchableOpacity
          style={styles.menuOverlay}
          activeOpacity={1}
          onPress={() => setShowMenu(false)}
        />
      )}
      <HeaderBar
        title="Yêu cầu đặt phòng"
        onBack={navigation.goBack}
        rightIcon="more-vertical"
        onRightPress={() => setShowMenu((v) => !v)}
      />
      {showMenu && (
        <View style={styles.dropdownMenu}>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => {
              setShowMenu(false);
              /* TODO: handle report */
            }}
          >
            <Feather
              name="alert-circle"
              size={20}
              color="#E53935"
              style={{ marginRight: 8 }}
            />
            <Text style={styles.menuItemText}>
              <Text style={{ color: "#E53935", fontWeight: "bold" }}>
                Báo cáo
              </Text>
            </Text>
          </TouchableOpacity>
        </View>
      )}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={{ paddingBottom: SPACING.xxl, paddingTop: 12 }}
      >
        {/* Card ngày đặt phòng - phóng to, highlight */}
        <View style={[styles.card, { borderWidth: 2, borderColor: '#6C47FF', backgroundColor: '#F7F5FF', shadowOpacity: 0.12 }]}> 
          <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#6C47FF', marginBottom: 12, textAlign: 'center', letterSpacing: 0.5 }}>Thông tin ngày đặt phòng</Text>
          <View style={[styles.rowBetween, { marginBottom: 8 }]}> 
            <DateInfo label="Check - In" date={checkInDate} time={checkInTime} />
            <View style={styles.divider} />
            <DateInfo label="Check - Out" date={checkOutDate} time={checkOutTime} />
          </View>
        </View>
        {/* Card slider thiết bị */}
        <View style={[styles.card, { borderWidth: 2, borderColor: '#6C47FF', backgroundColor: '#F7F5FF', shadowOpacity: 0.12, marginBottom: 24 }]}> 
          <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#6C47FF', marginBottom: 8, marginTop: 8 }}>Thiết bị nổi bật</Text>
          <FlatList
            data={equipments && equipments.data && equipments.data.equipment ? equipments.data.equipment : []}
            keyExtractor={item => item._id}
            renderItem={({ item }) => (
              <EquipmentCard
                item={item}
                selected={selectedEquipments.includes(item._id)}
                onPress={() => {
                  setSelectedEquipments((prev) =>
                    prev.includes(item._id)
                      ? prev.filter((id) => id !== item._id)
                      : [...prev, item._id]
                  );
                }}
              />
            )}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 4 }}
            style={{ marginBottom: 0 }}
          />
        </View>
        <View style={styles.card}>
          <Text style={styles.sectionLabel}>Chi tiết thanh toán</Text>
          <DetailRow label="Thời gian : 16 tiếng" value="4.000.000" />
          <DetailRow label="Phí phát sinh" value="50.000" />
          <DetailRow label="Phí dịch vụ" value="0" />
          <DetailRow label="Phí phụ thu (dụng cụ, phòng,...)" value="0" />
          <View style={styles.separator} />
          <DetailRow
            label="Tổng thanh toán"
            value="4.070.000 (đồng)"
            bold
          />
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <PrimaryButton
          label="Tiến hành thanh toán"
          onPress={() => navigation.navigate("Checkout")}
        />
      </View>
    </SafeAreaView>
  );
}

const DateInfo = ({ label, date, time }) => (
  <View style={styles.dateInfo}>
    <Text style={styles.helperLabel}>{label}</Text>
    <View style={styles.dateRow}>
      <Feather name="clock" size={16} color={COLORS.brandBlue} />
      <Text style={styles.timeText}>{time}</Text>
    </View>
    <View style={styles.dateRow}>
      <Feather name="calendar" size={16} color={COLORS.textMuted} />
      <Text style={styles.dateText}>{date}</Text>
    </View>
  </View>
);

const DetailRow = ({ label, value, bold }) => (
  <View style={styles.detailRow}>
    <Text style={[styles.detailLabel, bold && styles.bold]}>{label}</Text>
    <Text style={[styles.detailValue, bold && styles.bold]}>{value}</Text>
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
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.06,
    shadowRadius: 30,
    elevation: 4,
  },
  sectionLabel: {
    fontSize: TYPOGRAPHY.headingS,
    fontWeight: "600",
    color: COLORS.textDark,
    marginBottom: SPACING.sm,
  },
  rowBetween: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  dateInfo: {
    flex: 1,
  },
  divider: {
    width: 1,
    backgroundColor: COLORS.border,
    marginHorizontal: SPACING.md,
    height: 86,
  },
  helperLabel: {
    color: COLORS.textMuted,
    fontSize: TYPOGRAPHY.bodySm,
    marginBottom: SPACING.xs,
  },
  dateRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: SPACING.xs,
  },
  timeText: {
    marginLeft: 8,
    fontSize: TYPOGRAPHY.body,
    color: COLORS.textDark,
    fontWeight: "600",
  },
  dateText: {
    marginLeft: 8,
    color: COLORS.textMuted,
  },
  spacer: {
    height: SPACING.xl,
  },
  paymentRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  paymentHint: {
    color: COLORS.textMuted,
  },
  editButton: {
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
  },
  editText: {
    color: COLORS.brandBlue,
    fontWeight: "600",
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: SPACING.md,
  },
  detailLabel: {
    color: COLORS.textMuted,
  },
  detailValue: {
    color: COLORS.textDark,
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
  },
  menuOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
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

