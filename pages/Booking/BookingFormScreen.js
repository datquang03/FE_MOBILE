import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  Dimensions,
  ScrollView,
  TextInput,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { getAllEquipments } from "../../features/Equipment/equipmentSlice";
import { getAllActiveServices } from "../../features/Service/serviceSlice";
import { applyPromotion } from "../../features/Promotion/promotionSlice";
import HeaderBar from "../../components/ui/HeaderBar";
import PrimaryButton from "../../components/ui/PrimaryButton";
import { COLORS, RADIUS, SPACING, TYPOGRAPHY } from "../../constants/theme";

const { width } = Dimensions.get("window");

export default function BookingFormScreen({ navigation, route }) {
  const [guests, setGuests] = useState(10);
  const [showMenu, setShowMenu] = useState(false);
  const [selectedEquipments, setSelectedEquipments] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]);
  const [discountCode, setDiscountCode] = useState("");

  // LẤY THÔNG TIN TÓM TẮT ĐẶT PHÒNG TỪ route.params.summary
  const { summary = {}, studio } = route?.params || {};
  const {
    pickMode,
    startDate,
    endDate,
    checkinTime,
    checkoutTime,
    totalHours,
    totalDays,
    roomPricePerHour
  } = summary;

  // Nếu không có summary thì fallback về logic cũ
  const { startTime, endTime, studioId, bookingMap, range } = route?.params || {};

  // Lấy ảnh và tên studio nếu có
  const studioImage = studio?.images?.[0];
  const studioName = studio?.name;
  const studioLocation = studio?.location;

  const checkInDate = startDate
    ? new Date(startDate).toLocaleDateString("vi-VN")
    : (startTime ? startTime.slice(0, 10).split('-').reverse().join('/') : '');
  const checkInTimeStr = checkinTime || (startTime ? startTime.slice(11, 16) : '');
  const checkOutDate = endDate
    ? new Date(endDate).toLocaleDateString("vi-VN")
    : (endTime ? endTime.slice(0, 10).split('-').reverse().join('/') : '');
  const checkOutTimeStr = checkoutTime || (endTime ? endTime.slice(11, 16) : '');

  const dispatch = useDispatch();
  const { equipments, loading } = useSelector((state) => state.equipment);
  const { services, loading: loadingServices } = useSelector((state) => state.service);
  const { loading: promoLoading, data: promoData, error: promoError } = useSelector((state) => state.promotion);

  useEffect(() => {
    dispatch(getAllEquipments());
    dispatch(getAllActiveServices());
  }, [dispatch]);

  function getTotalServicePrice(selectedServices, serviceData) {
    return selectedServices.reduce((sum, id) => {
      const service = serviceData.find(s => s._id === id);
      return sum + (service ? service.pricePerUse : 0);
    }, 0);
  }

  function getTotalEquipmentPrice(selectedEquipments, equipmentList, hours) {
    return selectedEquipments.reduce((sum, id) => {
      const eq = equipmentList.find(e => e._id === id);
      return sum + (eq ? eq.pricePerHour * hours : 0);
    }, 0);
  }

  const serviceData = services && services.data ? services.data : [];
  const equipmentList = equipments && equipments.data && equipments.data.equipment ? equipments.data.equipment : [];

  // Sử dụng số giờ và số ngày từ summary nếu có, nếu không thì fallback về logic cũ
  const hours = typeof totalHours === "number" ? totalHours : (
    startTime && endTime
      ? (() => {
          const startDate = new Date(startTime);
          const endDate = new Date(endTime);
          const diffMs = endDate.getTime() - startDate.getTime();
          return Math.max(diffMs / (1000 * 60 * 60), 0);
        })()
      : 0
  );
  const days = typeof totalDays === "number" ? totalDays : 1;

  // Lấy giá phòng động từ studio hoặc summary
  const roomPricePerHourFinal = roomPricePerHour || studio?.basePricePerHour || 250000;
  const roomPrice = Math.round(hours * roomPricePerHourFinal);
  const servicePrice = getTotalServicePrice(selectedServices, serviceData);
  const equipmentPrice = getTotalEquipmentPrice(selectedEquipments, equipmentList, hours);
  const total = roomPrice + servicePrice + equipmentPrice;

  const handleApplyDiscount = () => {
    const subtotal = roomPrice + servicePrice + equipmentPrice;
    dispatch(applyPromotion({ code: discountCode, subtotal }));
  };

  const MainListHeader = () => (
    <>
      <View style={styles.uniformCard}> 
        {/* Thông tin studio */}
        <View style={styles.studioInfoRow}>
          {studioImage && (
            <Image source={{ uri: studioImage }} style={styles.studioImage} resizeMode="cover" />
          )}
          <View style={styles.studioInfoTextWrap}>
            {studioName && <Text style={styles.studioTitle}>{studioName}</Text>}
            {studioLocation && <Text style={styles.studioLocation}>{studioLocation}</Text>}
          </View>
        </View>
        <Text style={styles.uniformCardTitle}>Thông tin ngày đặt phòng</Text>
        <View style={[styles.rowBetween, { marginBottom: 8 }]}> 
          <DateInfo label="Check - In" date={checkInDate} time={checkInTimeStr} />
          <View className="divider" style={styles.divider} />
          <DateInfo label="Check - Out" date={checkOutDate} time={checkOutTimeStr} />
        </View>
        <View style={styles.summaryHighlightRow}>
          <View style={styles.summaryHighlightColLeft}>
            <Text style={styles.summaryHighlightLabel}>Tổng số giờ</Text>
            <Text style={styles.summaryHighlightValue}>{hours.toFixed(1)} giờ</Text>
          </View>
          <View style={styles.summaryHighlightColRight}>
            <Text style={styles.summaryHighlightLabel}>Số ngày</Text>
            <Text style={[styles.summaryHighlightValue, { color: '#E53935' }]}>{days}</Text>
          </View>
        </View>
        {/* Giá phòng highlight */}
        <View style={{ alignItems: 'center', marginTop: 10 }}>
          <Text style={{ color: '#888', fontSize: 15 }}>Giá phòng</Text>
          <Text style={styles.priceHighlight}>
            {roomPricePerHourFinal?.toLocaleString() || '...'}đ/giờ
          </Text>
        </View>
      </View>
      <View style={styles.uniformCard}> 
        <Text style={styles.uniformCardTitle}>Thiết bị nổi bật</Text>
        <FlatList
          data={equipmentList}
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
          contentContainerStyle={{ paddingHorizontal: 8, paddingBottom: 8, alignItems: 'center' }}
          ItemSeparatorComponent={() => <View style={{ width: 16 }} />}
          style={{ marginBottom: 0 }}
          scrollEnabled
          getItemLayout={(_, index) => ({ length: 110 + 16, offset: (110 + 16) * index, index })}
        />
      </View>
      <View style={styles.uniformCard}> 
        <Text style={styles.uniformCardTitle}>Dịch vụ đi kèm</Text>
        <View style={styles.serviceListContainer}>
          {serviceData.length === 0 ? (
            <Text style={{ color: '#888', textAlign: 'center', marginTop: 12 }}>Không có dịch vụ nào</Text>
          ) : (
            serviceData.map((item) => (
              <TouchableOpacity
                key={item._id}
                activeOpacity={0.85}
                onPress={() => {
                  setSelectedServices((prev) =>
                    prev.includes(item._id)
                      ? prev.filter((id) => id !== item._id)
                      : [...prev, item._id]
                  );
                }}
                style={[
                  styles.serviceItemMini,
                  selectedServices.includes(item._id) && styles.serviceItemMiniSelected
                ]}
              >
                <View style={[
                  styles.serviceCheckboxMini,
                  selectedServices.includes(item._id) && styles.serviceCheckboxMiniSelected
                ]}>
                  {selectedServices.includes(item._id) && (
                    <View style={{
                      width: 10,
                      height: 10,
                      borderRadius: 2,
                      backgroundColor: '#1976D2',
                    }} />
                  )}
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.serviceNameMini}>{item.name}</Text>
                  <Text style={styles.serviceDescMini} numberOfLines={2}>{item.description}</Text>
                  <Text style={styles.servicePriceMini}>Giá: {item.pricePerUse.toLocaleString()}đ/lần</Text>
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>
      </View>
      {/* Thêm input mã giảm giá */}
      <View style={{ width: '100%', alignItems: 'center', marginTop: 8, marginBottom: 8 }}>
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: '#F7F5FF',
          borderRadius: 12,
          borderWidth: 1.5,
          borderColor: '#6C47FF',
          paddingHorizontal: 14,
          paddingVertical: 8,
          width: '90%',
          shadowColor: '#6C47FF',
          shadowOpacity: 0.08,
          shadowRadius: 6,
          elevation: 2,
        }}>
          <Text style={{fontSize: 18, color: '#6C47FF', marginRight: 8}}>🎁</Text>
          <View style={{ flex: 1 }}>
            <TextInput
              placeholder="Nhập mã giảm giá..."
              placeholderTextColor="#aaa"
              style={{
                fontSize: 15,
                color: '#222',
                paddingVertical: 0,
                fontWeight: '600',
                backgroundColor: 'transparent',
              }}
              value={discountCode}
              onChangeText={setDiscountCode}
              autoCapitalize="characters"
              autoCorrect={false}
              underlineColorAndroid="transparent"
            />
          </View>
          <TouchableOpacity
            style={{
              backgroundColor: '#6C47FF',
              borderRadius: 8,
              paddingHorizontal: 12,
              paddingVertical: 6,
              marginLeft: 8,
              opacity: promoLoading ? 0.6 : 1,
            }}
            onPress={handleApplyDiscount}
            disabled={promoLoading}
          >
            <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 15 }}>Áp dụng</Text>
          </TouchableOpacity>
        </View>
        {/* Hiển thị trạng thái áp dụng mã giảm giá */}
        {promoLoading && <Text style={{ color: '#6C47FF', marginTop: 6 }}>Đang kiểm tra mã...</Text>}
        {promoData && <Text style={{ color: '#388E3C', marginTop: 6 }}>Mã hợp lệ: {promoData.message || 'Áp dụng thành công!'}</Text>}
        {promoError && <Text style={{ color: '#E53935', marginTop: 6 }}>{promoError}</Text>}
      </View>
      <View style={styles.uniformCard}> 
        <Text style={styles.uniformCardTitle}>Chi tiết thanh toán</Text>
        <View style={styles.paymentDetailList}>
          <View style={styles.paymentDetailRow}>
            <Text style={styles.paymentLabel}>Thời gian</Text>
            <Text style={styles.paymentValue}>{hours.toFixed(1)} tiếng</Text>
          </View>
          <View style={styles.paymentDetailRow}>
            <Text style={styles.paymentLabel}>Số ngày</Text>
            <Text style={styles.paymentValue}>{days}</Text>
          </View>
          <View style={styles.paymentDetailRow}>
            <Text style={styles.paymentLabel}>Giá phòng</Text>
            <Text style={styles.paymentValue}>{roomPricePerHourFinal?.toLocaleString()}đ x {hours.toFixed(1)}h = {roomPrice.toLocaleString()}đ</Text>
          </View>
          <View style={styles.paymentDetailRow}>
            <Text style={styles.paymentLabel}>Phí dịch vụ</Text>
            <Text style={styles.paymentValue}>{servicePrice.toLocaleString()}đ</Text>
          </View>
          <View style={styles.paymentDetailRow}>
            <Text style={styles.paymentLabel}>Phí phụ thu (dụng cụ, phòng,...)</Text>
            <Text style={styles.paymentValue}>{equipmentPrice.toLocaleString()}đ</Text>
          </View>
          <View style={styles.paymentSeparator} />
          <View style={styles.paymentDetailRowTotal}>
            <Text style={styles.paymentLabelTotal}>Tổng thanh toán</Text>
            <Text style={styles.paymentValueTotal}>{total.toLocaleString()}đ</Text>
          </View>
        </View>
      </View>
    </>
  );

  return (
    <SafeAreaView style={styles.safe}>
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
            }}
          >
            <Text style={{fontSize: 18, color: '#E53935', marginRight: 8}}>⚠️</Text>
            <Text style={styles.menuItemText}>
              <Text style={{ color: "#E53935", fontWeight: "bold" }}>
                Báo cáo
              </Text>
            </Text>
          </TouchableOpacity>
        </View>
      )}
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      >
        <MainListHeader />
      </ScrollView>
      <View style={styles.footer}>
        <PrimaryButton
          label="Tiến hành thanh toán"
          onPress={() => navigation.navigate("Checkout", {
            studio,
            summary: {
              totalHours: hours,
              totalDays: days,
              roomPricePerHour: roomPricePerHourFinal,
              roomPrice,
              servicePrice,
              equipmentPrice,
              total,
              // Thêm các trường ngày giờ checkin/checkout
              startDate,
              endDate,
              checkinTime,
              checkoutTime,
            },
            guests,
            // các params khác nếu cần
          })}
        />
      </View>
    </SafeAreaView>
  );
}

// Thay thế Feather icon bằng emoji hoặc ký tự unicode
const DateInfo = ({ label, date, time }) => (
  <View style={styles.dateInfo}>
    <Text style={styles.helperLabel}>{label}</Text>
    <View style={styles.dateRow}>
      <Text style={{fontSize: 16, marginRight: 4}}>⏰</Text>
      <Text style={styles.timeText}>{time}</Text>
    </View>
    <View style={styles.dateRow}>
      <Text style={{fontSize: 16, marginRight: 4}}>📅</Text>
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

// EquipmentCard component for FlatList
const EquipmentCard = ({ item, selected, onPress }) => (
  <TouchableOpacity
    onPress={onPress}
    style={{
      width: 150,
      height: 200,
      padding: 14,
      borderRadius: 14,
      backgroundColor: selected ? "#E3F2FD" : "#fff",
      borderWidth: selected ? 2 : 1,
      borderColor: selected ? "#1976D2" : "#eee",
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 8,
      position: 'relative',
    }}
  >
    <View style={{ width: 95, height: 95, marginBottom: 10 }}>
      {item.image && (
        <Image
          source={{ uri: item.image }}
          style={{ width: 95, height: 95, borderRadius: 10, backgroundColor: "#eee" }}
          resizeMode="cover"
        />
      )}
      {/* Tick box ở góc phải trên cùng */}
      <View style={{
        position: 'absolute',
        top: 2,
        right: 2,
        width: 22,
        height: 22,
        borderRadius: 5,
        backgroundColor: '#fff',
        borderWidth: 1.5,
        borderColor: selected ? '#1976D2' : '#bbb',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 2,
      }}>
        {selected ? (
          <View style={{
            width: 12,
            height: 12,
            borderRadius: 2,
            backgroundColor: '#1976D2',
          }} />
        ) : null}
      </View>
    </View>
    <Text style={{ fontWeight: "bold", color: "#1976D2", fontSize: 16, textAlign: 'center' }}>{item.name}</Text>
    <Text style={{ color: "#1976D2", fontWeight: "bold", fontSize: 15, textAlign: 'center', marginTop: 8 }}>
      {item.pricePerHour?.toLocaleString()}đ/giờ
    </Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  uniformCard: {
    backgroundColor: '#F7F5FF',
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#6C47FF',
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.10,
    shadowRadius: 16,
    elevation: 4,
    alignItems: 'center',
    alignSelf: 'center', // căn giữa ngang
    width: width - 32, // thêm khoảng cách hai bên
    marginTop: 12, // thêm spacing phía trên
  },
  uniformCardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#6C47FF',
    marginBottom: 14,
    textAlign: 'center',
    letterSpacing: 0.5,
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
  serviceListContainer: {
    width: '100%',
    paddingVertical: 4,
    paddingHorizontal: 0,
  },
  serviceItemMini: {
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#eee',
    padding: 10,
    marginBottom: 10,
    marginHorizontal: 0,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#1976D2',
    shadowOpacity: 0.10,
    shadowRadius: 4,
    elevation: 2,
    width: '100%',
    alignSelf: 'center',
  },
  serviceItemMiniSelected: {
    backgroundColor: '#E3F2FD',
    borderColor: '#1976D2',
    borderWidth: 2,
    shadowColor: '#1976D2',
    shadowOpacity: 0.18,
    elevation: 4,
  },
  serviceCheckboxMini: {
    width: 18,
    height: 18,
    borderRadius: 5,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.2,
    borderColor: '#bbb',
    marginRight: 10,
  },
  serviceCheckboxMiniSelected: {
    borderColor: '#1976D2',
  },
  serviceNameMini: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#1976D2',
    marginBottom: 1,
  },
  serviceDescMini: {
    color: '#666',
    fontSize: 12,
    marginBottom: 1,
  },
  servicePriceMini: {
    color: '#1976D2',
    fontWeight: 'bold',
    fontSize: 13,
  },
  paymentDetailList: {
    width: '100%',
    marginTop: 8,
  },
  paymentDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },
  paymentLabel: {
    color: '#444',
    fontSize: 15,
    fontWeight: '500',
    flex: 1,
  },
  paymentValue: {
    color: '#1976D2',
    fontSize: 15,
    fontWeight: '600',
    minWidth: 90,
    textAlign: 'right',
  },
  paymentSeparator: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 10,
    width: '100%',
  },
  paymentDetailRowTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  paymentLabelTotal: {
    color: '#6C47FF',
    fontSize: 17,
    fontWeight: 'bold',
    flex: 1,
  },
  paymentValueTotal: {
    color: '#E53935',
    fontSize: 18,
    fontWeight: 'bold',
    minWidth: 110,
    textAlign: 'right',
  },
  studioInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 10,
  },
  studioImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
    backgroundColor: '#eee',
    marginRight: 14,
  },
  studioInfoTextWrap: {
    flex: 1,
    justifyContent: 'center',
  },
  studioTitle: {
    fontWeight: 'bold',
    color: '#6C47FF',
    fontSize: 18,
    marginBottom: 2,
    textAlign: 'left',
  },
  studioLocation: {
    color: '#888',
    fontSize: 14,
    textAlign: 'left',
    marginBottom: 8,
  },
  summaryHighlightRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 8,
    width: '100%',
    gap: 12,
  },
  summaryHighlightColLeft: {
    flex: 1,
    alignItems: 'flex-start',
    backgroundColor: '#E3F2FD',
    borderRadius: 10,
    padding: 8,
    marginRight: 6,
  },
  summaryHighlightColRight: {
    flex: 1,
    alignItems: 'flex-end',
    backgroundColor: '#FDE3E3',
    borderRadius: 10,
    padding: 8,
    marginLeft: 6,
  },
  summaryHighlightLabel: {
    color: '#1976D2',
    fontWeight: 'bold',
    fontSize: 15,
    marginBottom: 2,
  },
  summaryHighlightValue: {
    color: '#1976D2',
    fontWeight: 'bold',
    fontSize: 20,
  },
  priceHighlight: {
    color: '#6C47FF',
    fontWeight: 'bold',
    fontSize: 22,
    backgroundColor: '#E5E1F9',
    paddingHorizontal: 18,
    paddingVertical: 6,
    borderRadius: 12,
    marginTop: 2,
    textAlign: 'center',
    minWidth: 120,
  },
});

