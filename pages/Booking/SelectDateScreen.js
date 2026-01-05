import React, { useEffect, useMemo, useState, useRef } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Animated,
  Modal,
  TouchableOpacity,
  Image,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import HeaderBar from "../../components/ui/HeaderBar";
import PrimaryButton from "../../components/ui/PrimaryButton";
import { COLORS, SPACING } from "../../constants/theme";
import { getStudioSchedule, getStudioById } from "../../features/Studio/studioSlice";
import moment from "moment";
import "moment/locale/vi";
import { PanResponder } from 'react-native';
import { Feather } from '@expo/vector-icons';

moment.locale("vi");

/* ================== HELPERS ================== */
const getDatesInRange = (start, end) => {
  const dates = [];
  let current = new Date(start);
  while (current <= end) {
    dates.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }
  return dates;
};

/* ================== SKELETON ================== */
const SkeletonBlock = ({ width, height, radius = 10 }) => {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.7,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 600,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <Animated.View
      style={{
        width,
        height,
        borderRadius: radius,
        backgroundColor: "#E0E0E0",
        opacity,
      }}
    />
  );
};

const ScheduleSkeleton = () => (
  <View>
    {[1, 2, 3].map((i) => (
      <View key={i} style={{ marginBottom: 24 }}>
        <SkeletonBlock width={160} height={16} />
        <View style={{ flexDirection: "row", gap: 8, marginTop: 12 }}>
          {[1, 2, 3].map((j) => (
            <SkeletonBlock key={j} width={90} height={40} />
          ))}
        </View>
      </View>
    ))}
  </View>
);

/* ================== TABLE ================== */
const ScheduleTable = ({ dates, scheduleByDate, value, onChange }) => (
  <View>
    {dates.map((date) => {
      const key = moment(date).format("YYYY-MM-DD");
      const slots = scheduleByDate?.[key] || [];

      return (
        <View key={key} style={{ marginBottom: 20 }}>
          <Text style={styles.dateLabel}>
            {moment(date).format("dddd, DD/MM")}
          </Text>

          {slots.length === 0 ? (
            <Text style={styles.noSlot}>Không có khung giờ</Text>
          ) : (
            <View style={styles.slotRow}>
              {slots.map((slot) => {
                const selected = value?.[key]?.slotId === slot._id;
                return (
                  <Pressable
                    key={slot._id}
                    disabled={slot.status === "booked"}
                    style={[
                      styles.slot,
                      selected && styles.slotActive,
                      slot.status === "booked" && styles.slotDisabled,
                    ]}
                    onPress={() =>
                      onChange(key, {
                        slotId: slot._id,
                        checkIn: slot.start,
                        checkOut: slot.end,
                      })
                    }
                  >
                    <Text
                      style={[
                        styles.slotText,
                        selected && { color: "#fff" },
                        slot.status === "booked" && styles.slotTextDisabled,
                      ]}
                    >
                      {slot.timeRange}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          )}
        </View>
      );
    })}
  </View>
);

/* ================== CUSTOM SCHEDULE TABLE ================== */
const CustomScheduleTable = ({ pickMode, singleDate, rangeStart, rangeEnd, onSelectDate }) => {
  const today = new Date();
  const [monthOffset, setMonthOffset] = useState(0); // cho phép xem các tháng tiếp theo
  const months = [];
  for (let i = 0; i < 2; i++) {
    const monthDate = new Date(today.getFullYear(), today.getMonth() + monthOffset + i, 1);
    months.push(monthDate);
  }
  const isInRange = (date) => {
    if (pickMode === 'single') return moment(date).isSame(singleDate, 'day');
    if (!rangeStart || !rangeEnd) return false;
    return moment(date).isBetween(rangeStart, rangeEnd, 'day', '[]');
  };
  const isStart = (date) => pickMode === 'range' && rangeStart && moment(date).isSame(rangeStart, 'day');
  const isEnd = (date) => pickMode === 'range' && rangeEnd && moment(date).isSame(rangeEnd, 'day');
  const isPast = (date) => moment(date).isBefore(today, 'day');

  const handleRangeSelect = (date) => {
    if (!rangeStart || !rangeEnd) {
      // Lần đầu: chọn ngày, luôn bôi ngày đó và ngày tiếp theo
      const nextDay = moment(date).clone().add(1, 'day').toDate();
      onSelectDate({ start: date, end: nextDay });
    } else if (moment(date).isSame(rangeStart, 'day') || moment(date).isSame(rangeEnd, 'day')) {
      // Nếu bấm lại vào đầu/cuối range: reset về ngày đó + ngày tiếp theo
      const nextDay = moment(date).clone().add(1, 'day').toDate();
      onSelectDate({ start: date, end: nextDay });
    } else if (moment(date).isBefore(rangeStart, 'day')) {
      // Kéo dài về trước
      onSelectDate({ start: date, end: rangeEnd });
    } else if (moment(date).isAfter(rangeEnd, 'day')) {
      // Kéo dài về sau
      onSelectDate({ start: rangeStart, end: date });
    } else {
      // Nếu bấm vào trong range thì reset về ngày đó + ngày tiếp theo
      const nextDay = moment(date).clone().add(1, 'day').toDate();
      onSelectDate({ start: date, end: nextDay });
    }
  };

  return (
    <View style={{ gap: 18 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <Pressable
          style={{ padding: 8, opacity: monthOffset === 0 ? 0.3 : 1 }}
          disabled={monthOffset === 0}
          onPress={() => setMonthOffset(monthOffset - 1)}
        >
          <Text style={{ color: '#6C47FF', fontWeight: 'bold', fontSize: 18 }}>{'<'}</Text>
        </Pressable>
        <Text style={{ fontWeight: 'bold', fontSize: 16, color: '#6C47FF' }}>Tháng {months[0].getMonth() + 1} - {months[0].getFullYear()}</Text>
        <Pressable
          style={{ padding: 8 }}
          onPress={() => setMonthOffset(monthOffset + 1)}
        >
          <Text style={{ color: '#6C47FF', fontWeight: 'bold', fontSize: 18 }}>{'>'}</Text>
        </Pressable>
      </View>
      {months.map((monthDate, idx) => {
        const year = monthDate.getFullYear();
        const month = monthDate.getMonth();
        const daysInMonth = moment(monthDate).daysInMonth();
        const firstDay = new Date(year, month, 1).getDay();
        const days = [];
        for (let i = 0; i < firstDay; i++) days.push(null);
        for (let d = 1; d <= daysInMonth; d++) days.push(new Date(year, month, d));
        return (
          <View key={idx} style={{ marginBottom: 8 }}>
            <Text style={{ fontWeight: 'bold', fontSize: 16, color: '#6C47FF', marginBottom: 6 }}>
              {moment(monthDate).format('MMMM YYYY')}
            </Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
              {['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'].map((d) => (
                <Text key={d} style={{ width: 32, textAlign: 'center', color: '#888', fontWeight: '600' }}>{d}</Text>
              ))}
            </View>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
              {days.map((date, i) => {
                if (!date) return <View key={i} style={{ width: 32, height: 32, margin: 2 }} />;
                const selected = isInRange(date);
                const start = isStart(date);
                const end = isEnd(date);
                const disabled = isPast(date);
                return (
                  <Pressable
                    key={i}
                    style={{
                      width: 32,
                      height: 32,
                      margin: 2,
                      borderRadius: start || end ? 16 : 8,
                      backgroundColor: selected ? (start || end ? '#6C47FF' : '#E5E1F9') : '#fff',
                      justifyContent: 'center',
                      alignItems: 'center',
                      borderWidth: selected ? 0 : 1,
                      borderColor: '#E5E1F9',
                      opacity: disabled ? 0.3 : 1,
                    }}
                    disabled={disabled}
                    onPress={() => {
                      if (pickMode === 'single') {
                        onSelectDate(date);
                      } else {
                        handleRangeSelect(date);
                      }
                    }}
                  >
                    <Text style={{ color: start || end ? '#fff' : selected ? '#6C47FF' : '#222', fontWeight: 'bold', textDecorationLine: disabled ? 'line-through' : 'none' }}>{date.getDate()}</Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        );
      })}
    </View>
  );
}

/* ================== SIMPLE HOUR GRID CLOCK ================== */
function SimpleHourGrid({ hour, setHour, minSelectableHour = 0, isToday = false }) {
  return (
    <View style={{ width: 260, flexDirection: 'row', flexWrap: 'wrap', alignSelf: 'center', marginVertical: 8 }}>
      {[...Array(24).keys()].map((h) => {
        const disabled = isToday && h < minSelectableHour;
        return (
          <TouchableOpacity
            key={h}
            disabled={disabled}
            style={{
              width: 52, height: 52, margin: 4, borderRadius: 26,
              backgroundColor: hour === h ? '#6C47FF' : '#fff',
              justifyContent: 'center', alignItems: 'center',
              borderWidth: 1, borderColor: '#E5E1F9',
              opacity: disabled ? 0.3 : 1,
            }}
            onPress={() => {
              if (!disabled) setHour(h);
            }}
          >
            <Text style={{ color: hour === h ? '#fff' : '#6C47FF', fontWeight: 'bold', fontSize: 18 }}>{h.toString().padStart(2, '0')}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

/* ================== TIME PICKER MODAL ================== */
function TimePickerModal({ visible, initialTime, onClose, onConfirm, minHour = 0, minDate }) {
  const [hour, setHour] = useState(initialTime.getHours());
  const [minute, setMinute] = useState(initialTime.getMinutes());
  const [selecting, setSelecting] = useState('hour');

  // Lấy giờ hiện tại
  const now = new Date();
  const isToday = minDate && moment(minDate).isSame(now, 'day');
  const minSelectableHour = isToday ? now.getHours() + 1 : minHour;

  useEffect(() => {
    let initHour = initialTime.getHours();
    let initMinute = initialTime.getMinutes();
    // Nếu là hôm nay và giờ hiện tại >= minSelectableHour thì set mặc định là minSelectableHour
    if (isToday && initHour < minSelectableHour) {
      initHour = minSelectableHour;
      initMinute = 0;
    }
    setHour(initHour);
    setMinute(initMinute);
    setSelecting('hour');
  }, [initialTime, visible, minSelectableHour, isToday]);

  const handleOk = () => {
    if (isToday && hour < minSelectableHour) {
      alert(`Bạn chỉ có thể chọn giờ từ ${minSelectableHour}:00 trở đi hôm nay!`);
      return;
    }
    const newTime = new Date(initialTime);
    newTime.setHours(hour);
    newTime.setMinutes(minute);
    onConfirm(newTime);
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.18)', justifyContent: 'center', alignItems: 'center' }}>
        <View style={{ backgroundColor: '#F7F5FF', borderRadius: 18, padding: 24, width: 340, alignItems: 'center', elevation: 6 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
            <TouchableOpacity onPress={() => setSelecting('hour')} style={{ borderWidth: 2, borderColor: selecting === 'hour' ? '#6C47FF' : 'transparent', borderRadius: 8, padding: 4, minWidth: 56, alignItems: 'center', backgroundColor: '#fff' }}>
              <Text style={{ fontSize: 32, color: '#6C47FF', fontWeight: 'bold' }}>{hour.toString().padStart(2, '0')}</Text>
            </TouchableOpacity>
            <Text style={{ fontSize: 32, color: '#6C47FF', fontWeight: 'bold', marginHorizontal: 4 }}>:</Text>
            <TouchableOpacity onPress={() => setSelecting('minute')} style={{ borderWidth: 2, borderColor: selecting === 'minute' ? '#6C47FF' : 'transparent', borderRadius: 8, padding: 4, minWidth: 56, alignItems: 'center', backgroundColor: '#fff' }}>
              <Text style={{ fontSize: 32, color: '#6C47FF', fontWeight: 'bold' }}>{minute.toString().padStart(2, '0')}</Text>
            </TouchableOpacity>
          </View>
          {selecting === 'hour' ? (
            <SimpleHourGrid hour={hour} setHour={(h) => { setHour(h); setSelecting('minute'); }} minSelectableHour={minSelectableHour} isToday={isToday} />
          ) : (
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', width: 240, alignSelf: 'center', marginVertical: 16, justifyContent: 'center' }}>
              {[0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55].map((m) => (
                <TouchableOpacity key={m} onPress={() => setMinute(m)} style={{ width: 56, height: 56, borderRadius: 28, justifyContent: 'center', alignItems: 'center', margin: 4, backgroundColor: minute === m ? '#E5E1F9' : 'transparent' }}>
                  <Text style={{ fontSize: 20, color: '#6C47FF', fontWeight: 'bold' }}>{m.toString().padStart(2, '0')}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
          <View style={{ flexDirection: 'row', justifyContent: 'flex-end', width: '100%', marginTop: 8 }}>
            <TouchableOpacity onPress={onClose} style={{ marginRight: 24 }}>
              <Text style={{ color: '#6C47FF', fontWeight: 'bold', fontSize: 16 }}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleOk}>
              <Text style={{ color: '#6C47FF', fontWeight: 'bold', fontSize: 16 }}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

/* ================== SCREEN ================== */
export default function SelectDateScreen({ navigation, route }) {
  const dispatch = useDispatch();
  const studioId = route?.params?.studio?._id;

  // Lấy studio detail từ redux để luôn có dữ liệu mới nhất
  const studio = useSelector((state) => state.studio.studioDetail);
  const studioLoading = useSelector((state) => state.studio.studioDetailLoading);

  const { studioSchedule, studioScheduleLoading } = useSelector(
    (state) => state.studio
  );

  const [pickMode, setPickMode] = useState('single'); // 'single' hoặc 'range'
  const [singleDate, setSingleDate] = useState(new Date());
  const [rangeStart, setRangeStart] = useState(new Date());
  const [rangeEnd, setRangeEnd] = useState(moment().add(1, 'day').toDate());
  const [checkinTime, setCheckinTime] = useState(moment().startOf('hour').toDate());
  const [checkoutTime, setCheckoutTime] = useState(moment().startOf('hour').add(4, 'hours').toDate());
  const [bookingMap, setBookingMap] = useState({});
  const [showTimeModal, setShowTimeModal] = useState(false);
  const [timeModalType, setTimeModalType] = useState('checkin'); // 'checkin' or 'checkout'
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    if (studioId) {
      dispatch(getStudioById(studioId));
      dispatch(getStudioSchedule());
    }
  }, [studioId, dispatch]);

  const dates = useMemo(
    () => getDatesInRange(rangeStart, rangeEnd),
    [rangeStart, rangeEnd]
  );

  const disabled = dates.some((d) => {
    const key = moment(d).format("YYYY-MM-DD");
    const slots = studio?.scheduleByDate?.[key] || [];
    return slots.length > 0 && !bookingMap[key];
  });

  return (
    <SafeAreaView style={[styles.safe, { paddingTop: 32 }]}>
      {showMenu && (
        <TouchableOpacity style={styles.menuOverlay} activeOpacity={1} onPress={() => setShowMenu(false)} />
      )}
      <HeaderBar
        title="Chọn lịch đặt phòng"
        onBack={navigation.goBack}
        rightIcon="more-vertical"
        onRightPress={() => setShowMenu((v) => !v)}
      />
      {showMenu && (
        <View style={styles.dropdownMenu}>
          <TouchableOpacity style={styles.menuItem} onPress={() => { setShowMenu(false); /* TODO: handle report */ }}>
            <Feather name="alert-circle" size={20} color="#E53935" style={{ marginRight: 8 }} />
            <Text style={styles.menuItemText}> <Text style={{ color: '#E53935', fontWeight: 'bold' }}>Báo cáo</Text></Text>
          </TouchableOpacity>
        </View>
      )}
      <ScrollView contentContainerStyle={[styles.content, { paddingTop: 12 }]}>
        <View style={styles.calendarCard}>
          <View style={styles.modeRow}>
            <Pressable
              style={[styles.modeButton, pickMode === 'single' && styles.modeButtonActive]}
              onPress={() => setPickMode('single')}
            >
              <Text style={[styles.modeButtonText, pickMode === 'single' && styles.modeButtonTextActive]}>Chọn 1 ngày</Text>
            </Pressable>
            <Pressable
              style={[styles.modeButton, pickMode === 'range' && styles.modeButtonActive]}
              onPress={() => {
                if (pickMode === 'single') {
                  // Khi chuyển từ single sang range, lấy ngày đang chọn và cộng thêm 1 ngày
                  setRangeStart(singleDate);
                  setRangeEnd(moment(singleDate).add(1, 'day').toDate());
                }
                setPickMode('range');
              }}
            >
              <Text style={[styles.modeButtonText, pickMode === 'range' && styles.modeButtonTextActive]}>Chọn nhiều ngày</Text>
            </Pressable>
          </View>
          <CustomScheduleTable
            pickMode={pickMode}
            singleDate={singleDate}
            rangeStart={rangeStart}
            rangeEnd={rangeEnd}
            onSelectDate={(dateOrRange) => {
              if (pickMode === 'single') setSingleDate(dateOrRange);
              else {
                if (dateOrRange.start && dateOrRange.end) {
                  // Đảm bảo start <= end
                  if (moment(dateOrRange.start).isBefore(dateOrRange.end, 'day')) {
                    setRangeStart(dateOrRange.start);
                    setRangeEnd(dateOrRange.end);
                  } else {
                    setRangeStart(dateOrRange.end);
                    setRangeEnd(dateOrRange.start);
                  }
                }
              }
            }}
          />
        </View>
        <View style={styles.timeRowHorizontal}>
          <View style={styles.timeCol}>
            <Text style={styles.timeLabel}>Check-in</Text>
            <Pressable style={styles.timePickerButton} onPress={() => { setTimeModalType('checkin'); setShowTimeModal(true); }}>
              <Text style={styles.timePickerText}>{moment(checkinTime).format('HH:mm')}</Text>
            </Pressable>
          </View>
          <View style={styles.timeCol}>
            <Text style={styles.timeLabel}>Check-out</Text>
            <Pressable style={styles.timePickerButton} onPress={() => { setTimeModalType('checkout'); setShowTimeModal(true); }}>
              <Text style={styles.timePickerText}>{moment(checkoutTime).format('HH:mm')}</Text>
            </Pressable>
          </View>
        </View>
        {/* Card tóm tắt đặt phòng đẹp, chia rõ từng thông tin */}
        <View style={styles.summaryCardV2}>
          {/* Ảnh đại diện studio */}
          {studio?.images?.[0] && (
            <View style={{ alignItems: 'center', marginBottom: 12 }}>
              <Image
                source={{ uri: studio.images[0] }}
                style={{ width: 120, height: 80, borderRadius: 12, backgroundColor: '#eee' }}
                resizeMode="cover"
              />
            </View>
          )}
          <Text style={styles.summaryTitle}>Tóm tắt đặt phòng</Text>
          <View style={styles.summaryRow}>
            <View style={styles.summaryColLeft}>
              <Text style={styles.summaryLabel}>Ngày bắt đầu</Text>
              <Text style={styles.summaryValue}>{pickMode === 'single' ? moment(singleDate).format('dddd, DD/MM/YYYY') : moment(rangeStart).format('dddd, DD/MM/YYYY')}</Text>
            </View>
            <View style={styles.summaryColRight}>
              <Text style={styles.summaryLabel}>Ngày kết thúc</Text>
              <Text style={styles.summaryValue}>{pickMode === 'single' ? moment(singleDate).format('dddd, DD/MM/YYYY') : moment(rangeEnd).format('dddd, DD/MM/YYYY')}</Text>
            </View>
          </View>
          <View style={styles.summaryRow}>
            <View style={styles.summaryColLeft}>
              <Text style={styles.summaryLabel}>Check-in</Text>
              <Text style={styles.summaryValue}>{moment(checkinTime).format('HH:mm')}</Text>
            </View>
            <View style={styles.summaryColRight}>
              <Text style={styles.summaryLabel}>Check-out</Text>
              <Text style={styles.summaryValue}>{moment(checkoutTime).format('HH:mm')}</Text>
            </View>
          </View>
          {/* Tính tổng số giờ thuê thực tế */}
          <View style={[styles.summaryRow, { marginTop: 10, padding: 10, backgroundColor: '#E3F2FD', borderRadius: 10 }]}>
            <View style={styles.summaryColLeft}>
              <Text style={[styles.summaryLabel, { color: '#1976D2', fontWeight: 'bold' }]}>Tổng số giờ</Text>
              <Text style={[styles.summaryValue, { color: '#1976D2', fontSize: 20, fontWeight: 'bold' }]}> {
                (() => {
                  if (pickMode === 'single') {
                    const diffMs = checkoutTime.getTime() - checkinTime.getTime();
                    const diffHours = diffMs / (1000 * 60 * 60);
                    return Math.max(4, diffHours.toFixed(1));
                  } else {
                    const start = new Date(rangeStart);
                    start.setHours(checkinTime.getHours());
                    start.setMinutes(checkinTime.getMinutes());
                    const end = new Date(rangeEnd);
                    end.setHours(checkoutTime.getHours());
                    end.setMinutes(checkoutTime.getMinutes());
                    const diffMs = end.getTime() - start.getTime();
                    const diffHours = diffMs / (1000 * 60 * 60);
                    return diffHours > 0 ? diffHours.toFixed(1) : 0;
                  }
                })()
              } giờ</Text>
            </View>
            <View style={styles.summaryColRight}>
              <Text style={[styles.summaryLabel, { color: '#E53935', fontWeight: 'bold' }]}>Số ngày</Text>
              <Text style={[styles.summaryValue, { color: '#E53935', fontSize: 20, fontWeight: 'bold' }]}> {
                pickMode === 'single' ? 1 : moment(rangeEnd).diff(moment(rangeStart), 'days') + 1
              }</Text>
            </View>
          </View>
          {/* Giá phòng highlight */}
          <View style={{ alignItems: 'center', marginTop: 10 }}>
            <Text style={{ color: '#888', fontSize: 15 }}>Giá phòng</Text>
            <Text style={{
              color: '#6C47FF',
              fontWeight: 'bold',
              fontSize: 22,
              backgroundColor: '#E5E1F9',
              paddingHorizontal: 18,
              paddingVertical: 6,
              borderRadius: 12,
              marginTop: 2,
            }}>
              {studio?.basePricePerHour?.toLocaleString() || '...'}đ/giờ
            </Text>
          </View>
        </View>
        {/* Danh sách các ngày trong range, báo có khung giờ hay không */}
        <View style={styles.dayListCard}>
          <Text style={styles.dayListTitle}>Chi tiết từng ngày</Text>
          {(pickMode === 'single' ? [singleDate] : getDatesInRange(rangeStart, rangeEnd)).map((d, idx) => {
            const key = moment(d).format('YYYY-MM-DD');
            const slots = studio?.scheduleByDate?.[key] || [];
            let status = '';
            let color = '';
            if (slots.length === 0) {
              status = 'Còn trống';
              color = '#4FC3F7'; // xanh dương nhạt
            } else if (slots.every(s => s.status === 'booked')) {
              status = 'Hết chỗ';
              color = '#E57373'; // đỏ
            } else {
              status = 'Có khung giờ';
              color = '#6C47FF'; // tím
            }
            return (
              <View key={key} style={styles.dayRow}>
                <Text style={styles.dayDate}>{moment(d).format('dddd, DD/MM')}</Text>
                <Text style={[styles.dayStatus, { color }]}>{status}</Text>
              </View>
            );
          })}
        </View>
        <PrimaryButton
          label="Xác nhận"
          disabled={disabled}
          onPress={() => {
            // Chuẩn hóa dữ liệu booking gửi sang BookingFormScreen
            let startTime = '';
            let endTime = '';
            if (Object.keys(bookingMap).length > 0) {
              const keys = Object.keys(bookingMap).sort();
              const first = bookingMap[keys[0]];
              const last = bookingMap[keys[keys.length - 1]];
              startTime = first?.checkIn || rangeStart.toISOString();
              endTime = last?.checkOut || rangeEnd.toISOString();
            } else {
              // Nếu không có slot, lấy từ range và thời gian checkin/checkout
              startTime = `${moment(rangeStart).format('YYYY-MM-DD')}T${moment(checkinTime).format('HH:mm')}`;
              endTime = `${moment(rangeEnd).format('YYYY-MM-DD')}T${moment(checkoutTime).format('HH:mm')}`;
            }

            // Tính tổng số giờ và số ngày
            let totalHours = 0;
            let totalDays = 1;
            if (pickMode === 'single') {
              const diffMs = checkoutTime.getTime() - checkinTime.getTime();
              totalHours = Math.max(4, diffMs / (1000 * 60 * 60));
              totalDays = 1;
            } else {
              const start = new Date(rangeStart);
              start.setHours(checkinTime.getHours());
              start.setMinutes(checkinTime.getMinutes());
              const end = new Date(rangeEnd);
              end.setHours(checkoutTime.getHours());
              end.setMinutes(checkoutTime.getMinutes());
              const diffMs = end.getTime() - start.getTime();
              totalHours = diffMs > 0 ? diffMs / (1000 * 60 * 60) : 0;
              totalDays = moment(rangeEnd).diff(moment(rangeStart), 'days') + 1;
            }

            navigation.navigate("BookingForm", {
              studio, // <-- truyền nguyên object studio
              studioId,
              startTime,
              endTime,
              bookingMap,
              range: {
                start: rangeStart.toISOString(),
                end: rangeEnd.toISOString()
              },
              summary: {
                pickMode,
                startDate: moment(pickMode === 'single' ? singleDate : rangeStart).format('YYYY-MM-DD'),
                endDate: moment(pickMode === 'single' ? singleDate : rangeEnd).format('YYYY-MM-DD'),
                checkinTime: moment(checkinTime).format('HH:mm'),
                checkoutTime: moment(checkoutTime).format('HH:mm'),
                totalHours,
                totalDays,
                roomPricePerHour: studio?.basePricePerHour // lấy từ studio truyền vào
              }
            });
          }}
        />
      </ScrollView>
      <TimePickerModal
        visible={showTimeModal}
        initialTime={timeModalType === 'checkin' ? checkinTime : checkoutTime}
        onClose={() => setShowTimeModal(false)}
        onConfirm={(newTime) => {
          setShowTimeModal(false);
          if (timeModalType === 'checkin') {
            setCheckinTime(newTime);
            // Nếu checkout < checkin + 4h, tự động set checkout = checkin + 4h
            if (moment(newTime).add(4, 'hours').isAfter(checkoutTime)) {
              setCheckoutTime(moment(newTime).add(4, 'hours').toDate());
            }
          } else {
            // Chỉ cho phép checkout >= checkin + 4h
            if (moment(newTime).isBefore(moment(checkinTime).add(4, 'hours'))) {
              alert('Giờ check-out phải sau check-in ít nhất 4 giờ!');
              return;
            }
            setCheckoutTime(newTime);
          }
        }}
        minDate={pickMode==='single'?singleDate:rangeStart}
      />
    </SafeAreaView>
  );
}

/* ================== STYLES ================== */
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: SPACING.lg, paddingBottom: 40 },

  rangeRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 12,
    marginBottom: 20,
  },
  rangeBtn: {
    borderWidth: 1,
    borderColor: COLORS.brandBlue,
    padding: 10,
    borderRadius: 10,
  },
  dateLabel: {
    fontWeight: "700",
    color: COLORS.brandBlue,
    marginBottom: 8,
  },
  noSlot: { color: COLORS.textMuted, fontStyle: "italic" },
  slotRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  slot: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  slotActive: {
    backgroundColor: COLORS.brandBlue,
    borderColor: COLORS.brandBlue,
  },
  slotDisabled: { opacity: 0.4 },
  slotText: { fontWeight: "600" },
  slotTextDisabled: {
    textDecorationLine: "line-through",
    color: COLORS.textMuted,
  },
  modeRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 20,
  },
  modeButton: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingVertical: 12,
    marginHorizontal: 4,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E1F9',
  },
  modeButtonActive: {
    backgroundColor: '#6C47FF',
    borderColor: '#6C47FF',
  },
  modeButtonText: {
    fontSize: 16,
    color: '#6C47FF',
    fontWeight: 'bold',
  },
  modeButtonTextActive: {
    color: '#fff',
  },
  datePickerButton: {
    backgroundColor: '#fff',
    borderRadius: 18,
    paddingVertical: 16,
    paddingHorizontal: 24,
    marginVertical: 10,
    alignItems: 'center',
    shadowColor: '#6C47FF',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#E5E1F9',
  },
  datePickerText: {
    fontSize: 20,
    color: '#222',
    fontWeight: 'bold',
    letterSpacing: 0.2,
  },
  timeRow: {
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 12,
    gap: 8,
  },
  timePickerButton: {
    backgroundColor: '#fff',
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 24,
    marginVertical: 6,
    alignItems: 'center',
    shadowColor: '#6C47FF',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#E5E1F9',
  },
  timePickerText: {
    fontSize: 18,
    color: '#6C47FF',
    fontWeight: 'bold',
    letterSpacing: 0.2,
  },
  timeLabel: {
    fontSize: 15,
    color: '#222',
    marginBottom: 2,
    marginTop: -2,
  },
  calendarCard: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 24,
    margin: 16,
    shadowColor: '#6C47FF',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  timeRowHorizontal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 18,
    marginBottom: 18,
    gap: 24,
  },
  timeCol: {
    flex: 1,
    alignItems: 'center',
  },
  summaryCard: {
    backgroundColor: '#F7F5FF',
    borderRadius: 18,
    padding: 18,
    marginTop: 32,
    marginBottom: 16,
    shadowColor: '#6C47FF',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  summaryCardV2: {
    backgroundColor: '#F7F5FF',
    borderRadius: 18,
    padding: 18,
    marginTop: 32,
    marginBottom: 16,
    shadowColor: '#6C47FF',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  summaryTitle: {
    fontWeight: 'bold',
    color: '#6C47FF',
    fontSize: 16,
    marginBottom: 8,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
    gap: 12,
  },
  summaryColLeft: {
    flex: 1,
    alignItems: 'flex-start',
  },
  summaryColRight: {
    flex: 1,
    alignItems: 'flex-end',
  },
  summaryLabel: {
    fontSize: 13,
    color: '#888',
    marginBottom: 2,
  },
  summaryValue: {
    fontSize: 16,
    color: '#222',
    fontWeight: 'bold',
  },
  dayListCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 14,
    marginTop: 8,
    marginBottom: 18,
    shadowColor: '#6C47FF',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 1,
  },
  dayListTitle: {
    fontWeight: 'bold',
    color: '#6C47FF',
    fontSize: 15,
    marginBottom: 8,
  },
  dayRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#F0EFFF',
  },
  dayDate: {
    fontSize: 15,
    color: '#222',
  },
  dayStatus: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  menuOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 99,
  },
  dropdownMenu: {
    position: 'absolute',
    top: 56,
    right: 18,
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 6,
    paddingHorizontal: 0,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 6,
    zIndex: 100,
    minWidth: 140,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 18,
  },
  menuItemText: {
    fontSize: 16,
    color: '#E53935',
    fontWeight: 'bold',
  },
});
