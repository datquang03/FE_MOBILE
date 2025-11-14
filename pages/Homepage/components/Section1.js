import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { MaterialIcons, FontAwesome5, Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function Section1() {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Dịch Vụ Của Chúng Tôi</Text>
      <View style={styles.servicesContainer}>
        <View style={styles.serviceBox}>
          <MaterialIcons name="mic" size={40} color="#00bfff" />
          <Text style={styles.serviceTitle}>Thu Âm Chuyên Nghiệp</Text>
          <Text style={styles.serviceDescription}>
            Thiết bị thu âm hiện đại nhất cho chất lượng âm thanh tốt nhất
          </Text>
        </View>
        <View style={styles.serviceBox}>
          <FontAwesome5 name="headphones" size={40} color="#00bfff" />
          <Text style={styles.serviceTitle}>Mix & Master</Text>
          <Text style={styles.serviceDescription}>
            Dịch vụ kỹ thuật âm thanh và sản xuất chuyên nghiệp
          </Text>
        </View>
        <View style={styles.serviceBox}>
          <Ionicons name="musical-notes" size={40} color="#800080" />
          <Text style={styles.serviceTitle}>Sản Xuất Âm Nhạc</Text>
          <Text style={styles.serviceDescription}>
            Sản xuất âm nhạc hoàn chỉnh từ ý tưởng đến bản nhạc cuối cùng
          </Text>
        </View>
      </View>
      <View style={styles.callToAction}>
        <Text style={styles.ctaTitle}>Sẵn Sàng Tạo Ra Điều Tuyệt Vời?</Text>
        <Text style={styles.ctaDescription}>
          Tham gia cộng đồng nghệ sĩ của chúng tôi và bắt đầu dự án tiếp theo ngay hôm nay.
        </Text>
        <View style={styles.ctaButton}>
          <Text style={styles.ctaButtonText}>Bắt Đầu Dự Án</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: 'transparent',
    flex: 1,
  },
  header: {
    fontSize: 28,
    fontWeight: '700',
    color: '#00bfff',
    textAlign: 'center',
    marginBottom: 20,
  },
  servicesContainer: {
    flexDirection: 'column',
    justifyContent: 'space-around',
    marginBottom: 30,
  },
  serviceBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    width: width - 40,
    alignItems: 'center',
  },
  serviceTitle: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
    marginTop: 10,
    marginBottom: 5,
    textAlign: 'center',
  },
  serviceDescription: {
    color: '#ccc',
    fontSize: 14,
    textAlign: 'center',
  },
  callToAction: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  ctaTitle: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 20,
    marginBottom: 10,
    textAlign: 'center',
  },
  ctaDescription: {
    color: '#ccc',
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  ctaButton: {
    backgroundColor: '#00bfff',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 25,
  },
  ctaButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
});
