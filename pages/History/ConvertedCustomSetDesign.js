import React, { useEffect } from "react";
import { SafeAreaView, View, Text, FlatList, Image, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { getOwnCustomSetDesignById } from "../../features/SetDesign/setDesignSlice";
import HeaderBar from "../../components/ui/HeaderBar";
import { COLORS, RADIUS, SPACING } from "../../constants/theme";

export default function ConvertedCustomSetDesign({ route, navigation }) {
  const dispatch = useDispatch();
  const { id } = route.params || {};
  const loading = useSelector((state) => state.setDesign.customLoading);
  const data = useSelector((state) => {
    const detail = state.setDesign.customSetDesignDetail;
    // Nếu API trả về { success, data }, lấy data
    if (detail && detail.data) return detail.data;
    return detail;
  });

  React.useEffect(() => {
    if (id) {
      dispatch(getOwnCustomSetDesignById(id));
    }
  }, [dispatch, id]);

  if (loading) {
    return (
      <SafeAreaView style={styles.safe}>
        <HeaderBar title="Chi tiết đơn yêu cầu" onBack={() => navigation.goBack?.()} />
        <Text style={{ textAlign: 'center', marginTop: 40 }}>Đang tải...</Text>
      </SafeAreaView>
    );
  }
  if (!data) {
    return (
      <SafeAreaView style={styles.safe}>
        <HeaderBar title="Chi tiết đơn yêu cầu" onBack={() => navigation.goBack?.()} />
        <Text style={{ textAlign: 'center', marginTop: 40, color: COLORS.danger }}>Không tìm thấy dữ liệu đơn yêu cầu!</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <HeaderBar title="Chi tiết đơn yêu cầu" onBack={() => navigation.goBack?.()} />
      <ScrollView contentContainerStyle={{ padding: SPACING.lg }}>
        <View style={styles.card}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
            <Image source={{ uri: data.customerId?.avatar }} style={styles.avatar} />
            <View style={{ marginLeft: 12 }}>
              <Text style={[styles.title, { marginTop: 8 }]}>{data.customerName}</Text>
              <Text style={styles.meta}>{data.email}</Text>
              <Text style={styles.meta}>SĐT: {data.phoneNumber}</Text>
            </View>
          </View>
          <Text style={styles.price}>Ngân sách: <Text style={{ color: COLORS.brandBlue }}>{data.budget?.toLocaleString()}đ</Text></Text>
          <Text style={styles.meta}>Danh mục: <Text style={{ color: COLORS.textDark }}>{data.preferredCategory}</Text></Text>
          <Text style={styles.meta}>Ngày tạo: <Text style={{ color: COLORS.textDark }}>{new Date(data.createdAt).toLocaleString('vi-VN')}</Text></Text>
          <Text style={[styles.status, { color: data.status === 'pending' ? COLORS.danger : COLORS.brandBlue }]}>Trạng thái: {data.status === 'pending' ? 'Chờ xử lý' : data.status}</Text>
          <Text style={styles.meta}>Ghi chú nhân viên: <Text style={{ color: COLORS.textDark }}>{data.staffNotes || 'Không có'}</Text></Text>
          <Text numberOfLines={3} ellipsizeMode="tail" style={[styles.meta, { marginTop: 2, color: COLORS.textDark, fontStyle: 'italic' }]}>Mô tả: {data.description}</Text>
          {/* Ảnh tham khảo */}
          {data.referenceImages?.length > 0 && (
            <View style={{ marginTop: 12 }}>
              <Text style={[styles.meta, { marginBottom: 6 }]}>Ảnh tham khảo:</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {data.referenceImages.map((img) => (
                  <Image key={img._id || img.id} source={{ uri: img.url }} style={styles.image} />
                ))}
              </ScrollView>
            </View>
          )}
          <TouchableOpacity style={[styles.detailBtn, { marginTop: 16 }]}>
            <Text style={styles.detailBtnText}>Chi tiết yêu cầu</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.border,
  },
  title: { fontWeight: 'bold', fontSize: 18, color: COLORS.textDark },
  meta: { color: COLORS.textMuted, fontSize: 14 },
  price: { color: COLORS.brandBlue, fontWeight: 'bold', marginVertical: 4 },
  status: { fontWeight: 'bold', marginVertical: 4 },
  image: {
    width: 80,
    height: 60,
    borderRadius: 8,
    marginRight: 8,
    backgroundColor: COLORS.border,
  },
  detailBtn: {
    backgroundColor: COLORS.brandBlue,
    borderRadius: 24,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
