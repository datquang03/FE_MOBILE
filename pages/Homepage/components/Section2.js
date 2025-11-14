import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import AnimatedBackground from '../../../components/customedBackground/animatedBackground';

const { width } = Dimensions.get('window');

export default function Section2() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>S+ Studio</Text>
      <Text style={styles.description}>
        Nơi sáng tạo gặp gỡ công nghệ. Studio thu âm chuyên nghiệp cho nghệ sĩ, nhạc sĩ và người sáng tạo nội dung.
      </Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.primaryButton}>
          <Text style={styles.primaryButtonText}>Bắt Đầu Ngay</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.secondaryButton}>
          <Text style={styles.secondaryButtonText}>▶ Xem Demo</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>500+</Text>
          <Text style={styles.statLabel}>Khách Hàng Hài Lòng</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>1000+</Text>
          <Text style={styles.statLabel}>Dự Án Hoàn Thành</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statRating}>5★</Text>
          <Text style={styles.statLabel}>Đánh Giá Trung Bình</Text>
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
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#00aaff',
    marginBottom: 10,
  },
  description: {
    color: '#ccc',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    maxWidth: width * 0.8,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginBottom: 30,
  },
  primaryButton: {
    backgroundColor: '#00aaff',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginRight: 15,
  },
  primaryButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  secondaryButton: {
    borderColor: '#00aaff',
    borderWidth: 2,
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    justifyContent: 'center',
  },
  secondaryButtonText: {
    color: '#00aaff',
    fontWeight: '700',
    fontSize: 16,
  },
  statsContainer: {
    width: '100%',
    alignItems: 'center',
  },
  statItem: {
    marginBottom: 20,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 28,
    fontWeight: '700',
    color: '#00aaff',
  },
  statRating: {
    fontSize: 28,
    fontWeight: '700',
    color: '#800080',
  },
  statLabel: {
    color: '#ccc',
    fontSize: 14,
    marginTop: 5,
  },
});
