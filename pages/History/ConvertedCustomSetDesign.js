import React from "react";
import { SafeAreaView, View, Text, FlatList, Image, StyleSheet, ScrollView } from "react-native";
import HeaderBar from "../../components/ui/HeaderBar";
import { COLORS, RADIUS, SPACING } from "../../constants/theme";

export default function ConvertedCustomSetDesign({ route, navigation }) {
  const { item } = route.params || {};
  const [showImage, setShowImage] = React.useState(null);

  if (!item) {
    return (
      <SafeAreaView style={styles.safe}>
        <HeaderBar title="Chi tiết đơn yêu cầu" onBack={() => navigation.goBack?.()} style={{ paddingTop: 32 }} />
        <Text style={{ textAlign: 'center', marginTop: 40, color: COLORS.danger }}>Không tìm thấy dữ liệu đơn yêu cầu!</Text>
      </SafeAreaView>
    );
  }
  return (
    <SafeAreaView style={styles.safe}>
      <View style={{ paddingTop: 32, backgroundColor: COLORS.background }}>
        <HeaderBar title="Chi tiết đơn yêu cầu" onBack={() => navigation.goBack?.()} />
      </View>
      <ScrollView contentContainerStyle={{ padding: SPACING.lg }}>
        <View style={{ backgroundColor: '#fff', borderRadius: 20, padding: 20, marginTop: 12, shadowColor: '#000', shadowOpacity: 0.07, shadowRadius: 10, elevation: 2 }}>
          <Text style={{ fontWeight: 'bold', fontSize: 18, color: '#6C47FF', marginBottom: 10 }}>Thông tin đơn yêu cầu</Text>
          <Text style={{ fontWeight: 'bold', color: '#6C47FF', fontSize: 16, marginBottom: 6 }}>
            Ngân sách: <Text style={{ color: '#222' }}>{item.budget?.toLocaleString()}đ</Text>
          </Text>
          <Text style={{ color: '#6C47FF', fontWeight: 'bold', marginBottom: 6 }}>Danh mục: <Text style={{ color: '#222', fontWeight: 'normal' }}>{item.preferredCategory === 'corporate' ? 'Doanh nghiệp' : item.preferredCategory === 'wedding' ? 'Đám cưới' : item.preferredCategory === 'family' ? 'Gia đình' : item.preferredCategory === 'graduation' ? 'Tốt nghiệp' : item.preferredCategory || '---'}</Text></Text>
          <Text style={{ color: '#6C47FF', fontWeight: 'bold', marginBottom: 6 }}>Ngày tạo: <Text style={{ color: '#222', fontWeight: 'normal' }}>{item.createdAt}</Text></Text>
          <Text style={{ fontWeight: 'bold', marginBottom: 6, color: item.status === 'pending' ? '#F44336' : item.status === 'processing' ? '#FF9800' : '#6C47FF', backgroundColor: item.status === 'pending' ? '#FDECEA' : item.status === 'processing' ? '#FFF3E0' : '#F5F0FF', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, alignSelf: 'flex-start' }}>
            Trạng thái: <Text style={{ color: '#222', fontWeight: 'normal' }}>{item.status === 'pending' ? 'Chờ xử lý' : item.status === 'processing' ? 'Đang xử lý' : item.status}</Text>
          </Text>
          <Text style={{ color: '#6C47FF', fontWeight: 'bold', marginBottom: 6 }}>Ghi chú nhân viên: <Text style={{ color: '#222', fontWeight: 'normal' }}>{item.staffNotes || 'Không có'}</Text></Text>
          <Text style={{ color: '#6C47FF', fontWeight: 'bold', marginBottom: 6 }}>Mô tả:</Text>
          <Text style={{ color: '#333', fontStyle: 'italic', marginBottom: 10 }}>{item.description}</Text>
          {item.referenceImages?.length > 0 && (
            <View style={{ marginTop: 8 }}>
              <Text style={{ color: '#6C47FF', fontWeight: 'bold', marginBottom: 6 }}>Ảnh tham khảo:</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {item.referenceImages.map((img) => (
                  <Text key={img._id || img.id}>
                    <Text onPress={() => setShowImage(img.url)}>
                      <Image source={{ uri: img.url }} style={{ width: 100, height: 100, borderRadius: 12, marginRight: 10, borderWidth: 2, borderColor: '#E5E1F9' }} />
                    </Text>
                  </Text>
                ))}
              </ScrollView>
            </View>
          )}
        </View>
      </ScrollView>
      {showImage && (
        <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.95)', justifyContent: 'center', alignItems: 'center', zIndex: 99 }}>
          <Image source={{ uri: showImage }} style={{ width: '90%', height: '70%', borderRadius: 16, resizeMode: 'contain' }} />
          <Text onPress={() => setShowImage(null)} style={{ color: '#fff', fontSize: 18, marginTop: 24, padding: 12, backgroundColor: '#6C47FF', borderRadius: 10, overflow: 'hidden' }}>Đóng</Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
});
