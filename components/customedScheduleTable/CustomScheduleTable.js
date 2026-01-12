import React, { useState } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import moment from "moment";

export default function CustomScheduleTable({
  pickMode,
  singleDate,
  rangeStart,
  rangeEnd,
  onSelectDate,
}) {
  const [monthOffset, setMonthOffset] = useState(0);
  const today = moment();
  const months = [today.clone().add(monthOffset, 'month')];

  // Tính toán logic range highlight
  const isInRange = (date) => {
    if (pickMode === 'single') return false;
    if (!rangeStart || !rangeEnd) return false;
    // Chỉ highlight ngày ở giữa, không phải start/end
    return (
      moment(date).isAfter(moment(rangeStart), 'day') &&
      moment(date).isBefore(moment(rangeEnd), 'day')
    );
  };
  const isStart = (date) => pickMode === 'range' && rangeStart && moment(date).isSame(rangeStart, 'day');
  const isEnd = (date) => pickMode === 'range' && rangeEnd && moment(date).isSame(rangeEnd, 'day');
  const isSelected = (date) => {
    if (pickMode === 'single') return moment(date).isSame(singleDate, 'day');
    if (pickMode === 'range') return isStart(date) || isEnd(date);
    return false;
  };

  // Xử lý chọn ngày cho range: nếu chọn ngày trước start thì start = ngày mới, end = start cũ
  const handleRangeSelect = (date) => {
    if (!rangeStart || (rangeStart && rangeEnd)) {
      onSelectDate({ start: date, end: moment(date).add(1, 'day').toDate() });
    } else {
      const start = moment(rangeStart);
      if (moment(date).isBefore(start, 'day')) {
        onSelectDate({ start: date, end: start.toDate() });
      } else if (moment(date).isSame(start, 'day')) {
        // Nếu bấm lại ngày start thì reset về 1 ngày
        onSelectDate({ start: date, end: moment(date).add(1, 'day').toDate() });
      } else {
        onSelectDate({ start: start.toDate(), end: date });
      }
    }
  };

  return (
    <View style={{ gap: 24 }}>
      {months.map((monthDate, idx) => {
        const year = monthDate.year();
        const month = monthDate.month();
        const daysInMonth = monthDate.daysInMonth();
        const firstDayOfMonth = monthDate.clone().startOf('month').day();
        const daysArray = [];
        let offset = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;
        for (let i = 0; i < offset; i++) daysArray.push(null);
        for (let d = 1; d <= daysInMonth; d++) daysArray.push(new Date(year, month, d));
        return (
          <View key={idx} style={{ marginBottom: 16 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
              <Pressable onPress={() => setMonthOffset((v) => Math.max(0, v - 1))} disabled={monthOffset === 0}>
                <Text style={{ color: monthOffset === 0 ? '#ccc' : '#6C47FF', fontSize: 24 }}>{'<'}</Text>
              </Pressable>
              <Text style={{ fontWeight: 'bold', fontSize: 18, color: '#6C47FF' }}>
                Tháng {month + 1} - {year}
              </Text>
              <Pressable onPress={() => setMonthOffset((v) => v + 1)}>
                <Text style={{ color: '#6C47FF', fontSize: 24 }}>{'>'}</Text>
              </Pressable>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
              {["CN", "T2", "T3", "T4", "T5", "T6", "T7"].map((day) => (
                <Text key={day} style={{ width: 40, textAlign: 'center', color: '#777', fontWeight: '600', fontSize: 13 }}>{day}</Text>
              ))}
            </View>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
              {daysArray.map((date, index) => {
                if (!date) {
                  return <View key={`empty-${index}`} style={{ width: 40, height: 40, margin: 4 }} />;
                }
                const isSel = isSelected(date);
                const inRange = isInRange(date);
                return (
                  <Pressable
                    key={index}
                    style={[
                      { width: 40, height: 40, margin: 4, borderRadius: 12, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#E8E1FF', backgroundColor: '#fff' },
                      isSel && { backgroundColor: '#6C47FF', borderWidth: 0 },
                      inRange && { backgroundColor: '#E5E1F9' },
                    ]}
                    onPress={() => {
                      if (pickMode === 'single') onSelectDate(date);
                      else handleRangeSelect(date);
                    }}
                  >
                    <Text style={[
                      { fontWeight: 'bold', color: '#333', fontSize: 15 },
                      isSel && { color: '#fff' },
                      inRange && { color: '#6C47FF' },
                    ]}>
                      {date.getDate()}
                    </Text>
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
