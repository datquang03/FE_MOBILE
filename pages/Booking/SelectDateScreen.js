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
import {
  getStudioSchedule,
  getStudioById,
} from "../../features/Studio/studioSlice";
import moment from "moment";
import "moment/locale/vi";
import { Feather } from "@expo/vector-icons";

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

/* ================== CUSTOM SCHEDULE TABLE ================== */
const CustomScheduleTable = ({
  pickMode,
  singleDate,
  rangeStart,
  rangeEnd,
  onSelectDate,
}) => {
  const today = new Date();
  const todayKey = moment(today).format("YYYY-MM-DD");

  const [monthOffset, setMonthOffset] = useState(0);
  const months = [];
  for (let i = 0; i < 2; i++) {
    const monthDate = new Date(
      today.getFullYear(),
      today.getMonth() + monthOffset + i,
      1
    );
    months.push(monthDate);
  }

  const isInRange = (date) => {
    if (pickMode === "single") return false;
    if (!rangeStart || !rangeEnd) return false;
    return moment(date).isAfter(rangeStart, "day") && moment(date).isBefore(rangeEnd, "day");
  };

  const isStart = (date) =>
    pickMode === "range" &&
    rangeStart &&
    moment(date).isSame(rangeStart, "day");
  const isEnd = (date) =>
    pickMode === "range" && rangeEnd && moment(date).isSame(rangeEnd, "day");
  const isTodayFunc = (date) => moment(date).isSame(today, "day");
  const isPast = (date) => moment(date).isBefore(today, "day");

  const handleRangeSelect = (date) => {
    if (isPast(date)) return;
    if (!rangeStart || !rangeEnd) {
      const nextDay = moment(date).clone().add(1, "day").toDate();
      onSelectDate({ start: date, end: nextDay });
      return;
    }
    if (
      moment(date).isSame(rangeStart, "day") ||
      moment(date).isSame(rangeEnd, "day")
    ) {
      const nextDay = moment(date).clone().add(1, "day").toDate();
      onSelectDate({ start: date, end: nextDay });
      return;
    }
    if (moment(date).isBefore(rangeStart, "day")) {
      onSelectDate({ start: date, end: rangeEnd });
    } else if (moment(date).isAfter(rangeEnd, "day")) {
      onSelectDate({ start: rangeStart, end: date });
    } else {
      const nextDay = moment(date).clone().add(1, "day").toDate();
      onSelectDate({ start: date, end: nextDay });
    }
  };

  return (
    <View style={{ gap: 24 }}>
      {/* Header điều hướng tháng */}
      <View style={styles.monthHeader}>
        <TouchableOpacity
          style={[styles.monthNavBtn, monthOffset === 0 && { opacity: 0.4 }]}
          disabled={monthOffset === 0}
          onPress={() => setMonthOffset(monthOffset - 1)}
        >
          <Feather name="chevron-left" size={28} color="#6C47FF" />
        </TouchableOpacity>

        <Text style={styles.currentMonthTitle}>
          Tháng {months[0].getMonth() + 1} - {months[0].getFullYear()}
        </Text>

        <TouchableOpacity
          style={styles.monthNavBtn}
          onPress={() => setMonthOffset(monthOffset + 1)}
        >
          <Feather name="chevron-right" size={28} color="#6C47FF" />
        </TouchableOpacity>
      </View>

      {months.map((monthDate, idx) => {
        const year = monthDate.getFullYear();
        const month = monthDate.getMonth();
        const daysInMonth = moment(monthDate).daysInMonth();
        const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 = CN, 1 = T2, ...
        const daysArray = [];
        for (let i = 0; i < firstDayOfMonth; i++) daysArray.push(null);
        for (let d = 1; d <= daysInMonth; d++)
          daysArray.push(new Date(year, month, d));

        return (
          <View key={idx} style={{ marginBottom: 16 }}>
            <Text style={styles.monthLabel}>
              {moment(monthDate).format("MMMM YYYY")}
            </Text>

            {/* Thứ trong tuần */}
            <View style={styles.weekHeader}>
              {["CN", "T2", "T3", "T4", "T5", "T6", "T7"].map((day) => (
                <Text key={day} style={styles.weekDayText}>
                  {day}
                </Text>
              ))}
            </View>

            {/* Lưới ngày */}
            <View style={styles.daysGrid}>
              {daysArray.map((date, index) => {
                if (!date) {
                  return (
                    <View key={`empty-${index}`} style={styles.dayEmpty} />
                  );
                }

                const dateKey = moment(date).format("YYYY-MM-DD");
                const isToday = dateKey === todayKey;
                const start = isStart(date);
                const end = isEnd(date);
                const inRange = isInRange(date);
                // Highlight cho single và range
                const selected = (pickMode === "single" && moment(date).isSame(singleDate, "day")) ||
                  (pickMode === "range" && (start || end));
                const disabled = isPast(date) && !isToday;

                return (
                  <TouchableOpacity
                    key={dateKey}
                    style={[
                      styles.dayCell,
                      isToday && styles.todayCell,
                      start && styles.startCell,
                      end && styles.endCell,
                      inRange && !start && !end && styles.rangeCell, // chỉ ngày ở giữa mới có bg mờ
                      selected && styles.selectedCell,
                      disabled && styles.disabledCell,
                    ]}
                    disabled={disabled}
                    onPress={() => {
                      if (!disabled) {
                        pickMode === "single"
                          ? onSelectDate(date)
                          : handleRangeSelect(date);
                      }
                    }}
                  >
                    <Text
                      style={[
                        styles.dayText,
                        isToday && styles.todayText,
                        selected && styles.selectedText,
                        inRange && !start && !end && styles.rangeText,
                        disabled && styles.disabledText,
                      ]}
                    >
                      {date.getDate()}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        );
      })}
    </View>
  );
};

/* ================== TIME PICKER MODAL (đã fix crash) ================== */
function TimePickerModal({
  visible,
  initialTime,
  onClose,
  onConfirm,
  minHour = 0,
  minDate,
}) {
  const safeInitial =
    initialTime instanceof Date && !isNaN(initialTime)
      ? initialTime
      : new Date();

  const [hour, setHour] = useState(safeInitial.getHours());
  const [minute, setMinute] = useState(safeInitial.getMinutes());
  const [selecting, setSelecting] = useState("hour");

  const now = new Date();
  const isToday = minDate && moment(minDate).isSame(now, "day");
  const minSelectableHour = isToday ? now.getHours() + 1 : minHour;

  useEffect(() => {
    if (!visible) return;

    const valid =
      initialTime instanceof Date && !isNaN(initialTime)
        ? initialTime
        : new Date();
    let h = valid.getHours();
    let m = valid.getMinutes();

    if (isToday && h < minSelectableHour) {
      h = minSelectableHour;
      m = 0;
    }

    setHour(h);
    setMinute(m);
    setSelecting("hour");
  }, [visible, initialTime]);

  const confirm = () => {
    if (isToday && hour < minSelectableHour) {
      alert(`Chỉ chọn được từ ${minSelectableHour}:00 hôm nay!`);
      return;
    }
    const time = new Date(safeInitial);
    time.setHours(hour, minute, 0, 0);
    onConfirm(time);
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.modalOverlay}>
        <View style={styles.timeModalContent}>
          <Text style={styles.modalHeader}>Chọn giờ</Text>

          <View style={styles.timePickerDisplay}>
            <TouchableOpacity
              onPress={() => setSelecting("hour")}
              style={[
                styles.timeUnit,
                selecting === "hour" && styles.activeUnit,
              ]}
            >
              <Text style={styles.timeNumber}>
                {hour.toString().padStart(2, "0")}
              </Text>
            </TouchableOpacity>
            <Text style={styles.colon}>:</Text>
            <TouchableOpacity
              onPress={() => setSelecting("minute")}
              style={[
                styles.timeUnit,
                selecting === "minute" && styles.activeUnit,
              ]}
            >
              <Text style={styles.timeNumber}>
                {minute.toString().padStart(2, "0")}
              </Text>
            </TouchableOpacity>
          </View>

          {selecting === "hour" ? (
            <View style={styles.hourSelector}>
              {Array.from({ length: 24 }, (_, i) => {
                const disabled = isToday && i < minSelectableHour;
                return (
                  <TouchableOpacity
                    key={i}
                    disabled={disabled}
                    style={[
                      styles.hourOption,
                      hour === i && styles.selectedHour,
                      disabled && styles.disabledHour,
                    ]}
                    onPress={() => {
                      setHour(i);
                      setSelecting("minute");
                    }}
                  >
                    <Text
                      style={[
                        styles.hourTxt,
                        hour === i && { color: "#fff" },
                        disabled && { color: "#aaa" },
                      ]}
                    >
                      {i.toString().padStart(2, "0")}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          ) : (
            <View style={styles.minuteSelector}>
              {[0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55].map((m) => (
                <TouchableOpacity
                  key={m}
                  style={[
                    styles.minuteOption,
                    minute === m && styles.selectedMinute,
                  ]}
                  onPress={() => setMinute(m)}
                >
                  <Text style={styles.minuteTxt}>
                    {m.toString().padStart(2, "0")}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          <View style={styles.modalActionsRow}>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.cancelBtn}>Hủy</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={confirm}>
              <Text style={styles.confirmBtn}>Xác nhận</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

/* ================== MAIN SCREEN ================== */
export default function SelectDateScreen({ navigation, route }) {
  const dispatch = useDispatch();
  const studioId = route?.params?.studio?._id;
  const studio = useSelector((state) => state.studio.studioDetail);
  const studioSchedule = useSelector((state) => state.studio.studioSchedule);
  console.log('studioSchedule:', studioSchedule);

  const [pickMode, setPickMode] = useState("single");
  const [singleDate, setSingleDate] = useState(new Date());
  const [rangeStart, setRangeStart] = useState(new Date());
  const [rangeEnd, setRangeEnd] = useState(moment().add(1, "day").toDate());
  const [checkinTime, setCheckinTime] = useState(() => {
    const t = new Date();
    t.setMinutes(0, 0, 0);
    return t;
  });
  const [checkoutTime, setCheckoutTime] = useState(() => {
    const t = new Date();
    t.setHours(t.getHours() + 4, 0, 0, 0);
    return t;
  });

  const [showTimeModal, setShowTimeModal] = useState(false);
  const [timeModalType, setTimeModalType] = useState("checkin");
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    if (studioId) {
      dispatch(getStudioById(studioId));
      dispatch(getStudioSchedule()); // Lấy lịch các studios
    }
  }, [studioId]);

  return (
    <SafeAreaView style={styles.safeArea}>
      {showMenu && (
        <TouchableOpacity
          style={styles.overlay}
          onPress={() => setShowMenu(false)}
        />
      )}

      <HeaderBar
        title="Chọn lịch đặt phòng"
        onBack={navigation.goBack}
        rightIcon="more-vertical"
        onRightPress={() => setShowMenu(!showMenu)}
      />

      {showMenu && (
        <View style={styles.menuDropdown}>
          <TouchableOpacity style={styles.menuItem}>
            <Feather
              name="alert-circle"
              size={20}
              color="#E53935"
              style={{ marginRight: 10 }}
            />
            <Text style={styles.menuItemText}>Báo cáo</Text>
          </TouchableOpacity>
        </View>
      )}

      <ScrollView contentContainerStyle={styles.content}>
        {/* Mode */}
        <View style={styles.modeRow}>
          <TouchableOpacity
            style={[
              styles.modeBtn,
              pickMode === "single" && styles.modeBtnActive,
            ]}
            onPress={() => setPickMode("single")}
          >
            <Text
              style={[
                styles.modeText,
                pickMode === "single" && styles.modeTextActive,
              ]}
            >
              Chọn 1 ngày
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.modeBtn,
              pickMode === "range" && styles.modeBtnActive,
            ]}
            onPress={() => {
              if (pickMode === "single") {
                setRangeStart(singleDate);
                setRangeEnd(moment(singleDate).add(1, "day").toDate());
              }
              setPickMode("range");
            }}
          >
            <Text
              style={[
                styles.modeText,
                pickMode === "range" && styles.modeTextActive,
              ]}
            >
              Chọn nhiều ngày
            </Text>
          </TouchableOpacity>
        </View>

        {/* Lịch */}
        <View style={styles.calendarWrapper}>
          <CustomScheduleTable
            pickMode={pickMode}
            singleDate={singleDate}
            rangeStart={rangeStart}
            rangeEnd={rangeEnd}
            onSelectDate={(val) => {
              if (pickMode === "single") setSingleDate(val);
              else if (val.start && val.end) {
                setRangeStart(
                  moment(val.start).isBefore(val.end) ? val.start : val.end
                );
                setRangeEnd(
                  moment(val.start).isBefore(val.end) ? val.end : val.start
                );
              }
            }}
          />
        </View>

        {/* Thời gian */}
        <View style={styles.timeRow}>
          <View style={styles.timeCol}>
            <Text style={styles.timeLabel}>Check-in</Text>
            <TouchableOpacity
              style={styles.timeBtn}
              onPress={() => {
                setTimeModalType("checkin");
                setShowTimeModal(true);
              }}
            >
              <Text style={styles.timeDisplayText}>
                {moment(checkinTime).format("HH:mm")}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.timeCol}>
            <Text style={styles.timeLabel}>Check-out</Text>
            <TouchableOpacity
              style={styles.timeBtn}
              onPress={() => {
                setTimeModalType("checkout");
                setShowTimeModal(true);
              }}
            >
              <Text style={styles.timeDisplayText}>
                {moment(checkoutTime).format("HH:mm")}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Tóm tắt */}
        <View style={styles.summaryCard}>
          {studio?.images?.[0] && (
            <Image
              source={{ uri: studio.images[0] }}
              style={styles.studioImage}
              resizeMode="cover"
            />
          )}

          <Text style={styles.summaryHeader}>Tóm tắt đặt phòng</Text>

          <View style={styles.summaryGrid}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Ngày bắt đầu</Text>
              <Text style={styles.summaryValue}>
                {pickMode === "single"
                  ? moment(singleDate).format("dddd, DD/MM/YYYY")
                  : moment(rangeStart).format("dddd, DD/MM/YYYY")}
              </Text>
            </View>

            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Ngày kết thúc</Text>
              <Text style={styles.summaryValue}>
                {pickMode === "single"
                  ? moment(singleDate).format("dddd, DD/MM/YYYY")
                  : moment(rangeEnd).format("dddd, DD/MM/YYYY")}
              </Text>
            </View>

            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Check-in</Text>
              <Text style={styles.summaryValue}>
                {moment(checkinTime).format("HH:mm")}
              </Text>
            </View>

            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Check-out</Text>
              <Text style={styles.summaryValue}>
                {moment(checkoutTime).format("HH:mm")}
              </Text>
            </View>
          </View>

          <View style={styles.totalHighlight}>
            <View style={styles.totalItem}>
              <Text style={styles.totalLabel}>Tổng số giờ</Text>
              <Text style={styles.totalValue}>
                {pickMode === "single"
                  ? Math.max(
                      4,
                      ((checkoutTime - checkinTime) / 3600000).toFixed(1)
                    )
                  : (() => {
                      const s = new Date(rangeStart);
                      s.setHours(
                        checkinTime.getHours(),
                        checkinTime.getMinutes()
                      );
                      const e = new Date(rangeEnd);
                      e.setHours(
                        checkoutTime.getHours(),
                        checkoutTime.getMinutes()
                      );
                      return ((e - s) / 3600000).toFixed(1);
                    })()}{" "}
                giờ
              </Text>
            </View>

            <View style={styles.totalItem}>
              <Text style={styles.totalLabel}>Số ngày</Text>
              <Text style={styles.totalValue}>
                {pickMode === "single"
                  ? 1
                  : moment(rangeEnd).diff(moment(rangeStart), "days") + 1}
              </Text>
            </View>
          </View>

          <View style={styles.priceDisplay}>
            <Text style={styles.priceTitle}>Giá phòng</Text>
            <Text style={styles.priceAmount}>
              {studio?.basePricePerHour?.toLocaleString() || "---"} đ/giờ
            </Text>
          </View>
        </View>

        {/* Giá phòng */}
        <View style={{
          backgroundColor: '#F5F0FF',
          borderRadius: 16,
          padding: 18,
          alignItems: 'center',
          marginBottom: 18,
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
          <Text style={{ fontSize: 16, color: '#6C47FF', fontWeight: 'bold' }}>Giá phòng</Text>
          <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#6C47FF', backgroundColor: '#fff', paddingHorizontal: 18, paddingVertical: 8, borderRadius: 14, overflow: 'hidden', elevation: 1 }}>
            {studio?.basePricePerHour?.toLocaleString() || "---"} đ/giờ
          </Text>
        </View>

        {/* Chi tiết ngày */}
        <View style={[styles.detailCard, { backgroundColor: '#F8F5FF', borderRadius: 18, padding: 18 }]}> 
          <Text style={{ fontSize: 17, fontWeight: 'bold', color: '#6C47FF', marginBottom: 10 }}>Chi tiết từng ngày</Text>
          {(pickMode === "single"
            ? [singleDate]
            : getDatesInRange(rangeStart, rangeEnd)
          ).map((d) => {
            const key = moment(d).format("YYYY-MM-DD");
            const studioData = studioSchedule?.studios?.find(s => s._id === studioId);
            const slots = studioData && studioData.scheduleByDate && typeof studioData.scheduleByDate === 'object'
              ? studioData.scheduleByDate[key] || []
              : [];
            let status = "Còn trống";
            let color = "#4CAF50";
            let slotInfo = null;
            if (slots.length > 0) {
              status = slots.every((s) => s.status === "booked")
                ? "Đã đặt hết"
                : "Có khung giờ khả dụng";
              color = status === "Đã đặt hết" ? "#F44336" : "#6C47FF";
              if (status === "Đã đặt hết") {
                slotInfo = slots.map((s, idx) => (
                  <View key={idx} style={{ marginTop: 2, marginLeft: 8, flexDirection: 'row', alignItems: 'center' }}>
                    <Feather name="user" size={15} color="#888" style={{ marginRight: 4 }} />
                    <Text style={{ color: '#888', fontSize: 13 }}>
                      {s.timeRange} - {s.booking?.customer?.fullName || '---'}
                    </Text>
                  </View>
                ));
              } else if (status === "Có khung giờ khả dụng") {
                slotInfo = slots.map((s, idx) => (
                  <View key={idx} style={{ marginTop: 2, marginLeft: 8, flexDirection: 'row', alignItems: 'center' }}>
                    <Feather name={s.status === 'booked' ? 'user-x' : 'clock'} size={15} color={s.status === 'booked' ? '#F44336' : '#4CAF50'} style={{ marginRight: 4 }} />
                    <Text style={{ color: s.status === 'booked' ? '#F44336' : '#4CAF50', fontSize: 13 }}>
                      {s.timeRange} - {s.status === 'booked' ? 'Đã đặt' : 'Còn trống'}
                    </Text>
                  </View>
                ));
              }
            }
            return (
              <View key={key} style={{ flexDirection: 'row', alignItems: 'flex-start', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#E5E1F9' }}>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 15, color: '#333', fontWeight: '600' }}>
                    {moment(d).format("dddd, DD/MM")}
                  </Text>
                  {slotInfo}
                </View>
                <Text style={{ fontSize: 15, fontWeight: 'bold', color, marginTop: 2 }}>{status}</Text>
              </View>
            );
          })}
        </View>

        <PrimaryButton
          label="Xác nhận"
          onPress={() => {
            // Logic xác nhận cũ của bạn
            // ...
          }}
        />
      </ScrollView>

      <TimePickerModal
        visible={showTimeModal}
        initialTime={timeModalType === "checkin" ? checkinTime : checkoutTime}
        onClose={() => setShowTimeModal(false)}
        onConfirm={(newTime) => {
          setShowTimeModal(false);
          if (timeModalType === "checkin") {
            setCheckinTime(newTime);
            if (moment(newTime).add(4, "hours").isAfter(checkoutTime)) {
              setCheckoutTime(moment(newTime).add(4, "hours").toDate());
            }
          } else {
            if (moment(newTime).isBefore(moment(checkinTime).add(4, "hours"))) {
              alert("Check-out phải sau check-in ít nhất 4 giờ!");
              return;
            }
            setCheckoutTime(newTime);
          }
        }}
        minDate={pickMode === "single" ? singleDate : rangeStart}
      />
    </SafeAreaView>
  );
}

/* ================== STYLES ================== */
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#F9FAFD" },
  content: { padding: 16, paddingBottom: 80 },

  modeRow: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 6,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  modeBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: "center",
  },
  modeBtnActive: { backgroundColor: "#6C47FF" },
  modeText: { fontSize: 15, fontWeight: "600", color: "#6C47FF" },
  modeTextActive: { color: "#fff" },

  calendarWrapper: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 10,
    elevation: 3,
  },

  monthHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  monthNavBtn: { padding: 8 },
  currentMonthTitle: { fontSize: 18, fontWeight: "700", color: "#6C47FF" },

  monthLabel: {
    fontSize: 16,
    fontWeight: "700",
    color: "#333",
    marginBottom: 10,
    textAlign: "center",
  },

  weekHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  weekDayText: {
    width: 40,
    textAlign: "center",
    color: "#777",
    fontWeight: "600",
    fontSize: 13,
  },

  daysGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  dayCell: {
    width: 40,
    height: 40,
    margin: 4,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E8E1FF",
    backgroundColor: "#fff",
  },
  todayCell: {
    borderColor: "#4CAF50",
    borderWidth: 2,
    backgroundColor: "#E8F5E9",
  },
  selectedCell: {
    backgroundColor: "#6C47FF",
    borderWidth: 0,
  },
  startCell: {
    backgroundColor: "#6C47FF",
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
  },
  endCell: {
    backgroundColor: "#6C47FF",
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
  },
  rangeCell: {
    backgroundColor: "#E5E1F9",
  },
  disabledCell: { opacity: 0.45 },
  dayEmpty: { width: 40, height: 40, margin: 4 },
  dayNumber: { fontSize: 15, fontWeight: "600", color: "#333" },
  todayText: { color: "#2E7D32", fontWeight: "bold" },
  selectedText: {
    color: "#fff",
    fontWeight: "bold",
  },
  rangeText: {
    color: "#6C47FF",
  },
  disabledText: { color: "#aaa", textDecorationLine: "line-through" },

  timeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  timeCol: { flex: 1, marginHorizontal: 8, alignItems: "center" },
  timeLabel: { fontSize: 14, color: "#555", marginBottom: 8 },
  timeBtn: {
    backgroundColor: "#fff",
    borderRadius: 16,
    paddingVertical: 14,
    width: "100%",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E0D9FF",
  },
  timeDisplayText: { fontSize: 18, fontWeight: "700", color: "#6C47FF" },

  summarySection: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 10,
    elevation: 3,
  },
  previewImage: {
    width: "100%",
    height: 140,
    borderRadius: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#6C47FF",
    textAlign: "center",
    marginBottom: 16,
  },

  summaryGrid: { gap: 12 },
  summaryItem: { marginBottom: 8 },
  summaryLabel: { fontSize: 14, color: "#666", marginBottom: 4 },
  summaryValue: { fontSize: 15, fontWeight: "600", color: "#222" },

  totalHighlight: {
    flexDirection: "row",
    backgroundColor: "#F5F0FF",
    borderRadius: 16,
    padding: 16,
    marginVertical: 16,
  },
  totalItem: { flex: 1, alignItems: "center" },
  totalLabel: { fontSize: 13, color: "#6C47FF", marginBottom: 4 },
  totalValue: { fontSize: 22, fontWeight: "bold", color: "#6C47FF" },

  priceBox: { alignItems: "center" },
  priceLabel: { fontSize: 14, color: "#666", marginBottom: 4 },
  priceAmount: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#6C47FF",
    backgroundColor: "#F8F5FF",
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 20,
  },

  detailSection: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    marginBottom: 40,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 10,
    elevation: 3,
  },
  detailLine: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#F5F0FF",
  },
  detailDay: { fontSize: 15, color: "#333", fontWeight: "500", flex: 1 },
  detailStatus: {
    fontSize: 15,
    fontWeight: "700",
    minWidth: 170,
    textAlign: "right",
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  timeModal: {
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 24,
    width: "88%",
    maxWidth: 360,
    alignItems: "center",
  },
  modalHeader: { fontSize: 20, fontWeight: "bold", marginBottom: 20 },
  timeDisplayRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  timeSegment: {
    padding: 12,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "transparent",
  },
  timeSegmentActive: { borderColor: "#6C47FF" },
  timeDigit: { fontSize: 40, fontWeight: "bold", color: "#333" },
  colon: { fontSize: 40, color: "#6C47FF", marginHorizontal: 16 },

  hourSelector: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginBottom: 24,
  },
  hourOption: {
    width: 56,
    height: 56,
    margin: 6,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E0D9FF",
  },
  selectedHour: { backgroundColor: "#6C47FF", borderWidth: 0 },
  disabledHour: { opacity: 0.4 },
  hourTxt: { fontSize: 18, color: "#6C47FF", fontWeight: "600" },

  minuteSelector: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginBottom: 24,
  },
  minuteOption: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    margin: 6,
  },
  selectedMinute: { backgroundColor: "#E5E1F9" },
  minuteTxt: { fontSize: 18, color: "#6C47FF", fontWeight: "600" },

  modalFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 16,
  },
  modalBtnCancel: { color: "#888", fontSize: 16, fontWeight: "600" },
  modalBtnConfirm: { color: "#6C47FF", fontSize: 16, fontWeight: "bold" },

  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 99,
  },
  dropdown: {
    position: "absolute",
    top: 56,
    right: 16,
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingVertical: 8,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
    zIndex: 100,
  },
  menuRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  menuText: { fontSize: 16, color: "#E53935", fontWeight: "600" },
});
