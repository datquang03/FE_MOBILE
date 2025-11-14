import React from 'react';
import { View, Text, StyleSheet, Linking, TouchableOpacity } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

export default function Footer() {
  return (
    <View style={styles.footer}>
      {/* Info */}
      <View style={styles.infoContainer}>
        <Text style={styles.title}>S Cộng Studio</Text>
        <Text style={styles.rating}>⭐ 4.7 (25 đánh giá trên Google)</Text>
        <Text style={styles.description}>
          Studio nhiếp ảnh ở Thành phố Hồ Chí Minh
        </Text>
      </View>

      {/* Buttons */}
      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => Linking.openURL('https://www.google.com')}
        >
          <Ionicons name="globe-outline" size={18} color="#fff" />
          <Text style={styles.buttonText}>Trang web</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => Linking.openURL('https://goo.gl/maps')}
        >
          <Ionicons name="navigate-outline" size={18} color="#fff" />
          <Text style={styles.buttonText}>Đường đi</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() =>
            Linking.openURL(
              'https://www.google.com/maps/place/S+C%E1%BB%99ng+Studio'
            )
          }
        >
          <Ionicons name="star-outline" size={18} color="#fff" />
          <Text style={styles.buttonText}>Đánh giá</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => Linking.openURL('tel:0933753110')}
        >
          <MaterialIcons name="call" size={18} color="#fff" />
          <Text style={styles.buttonText}>Gọi</Text>
        </TouchableOpacity>
      </View>

      {/* Contact Info */}
      <View style={styles.contactInfo}>
        <Text style={styles.contactText}>
          <Text style={styles.bold}>Địa chỉ:</Text> 1 Trương Định Hội, P18, Q4, HCM
        </Text>
        <Text style={styles.contactText}>
          <Text style={styles.bold}>Số điện thoại:</Text> 0933 753 110
        </Text>
        <Text style={styles.contactText}>
          <Text style={styles.bold}>Giờ hoạt động:</Text>{' '}
          <Text style={styles.open}>Mở cả ngày</Text>
        </Text>
        <Text style={styles.contactText}>
          <Text style={styles.bold}>Tỉnh:</Text> Hồ Chí Minh
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    backgroundColor: '#1e1e2f',
    paddingVertical: 25,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  infoContainer: {
    marginBottom: 15,
    alignItems: 'center',
  },
  title: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 5,
  },
  rating: {
    color: '#ffd700',
    marginBottom: 5,
  },
  description: {
    color: '#ccc',
    fontSize: 14,
    textAlign: 'center',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
    flexWrap: 'wrap',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#00aaff',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 25,
    marginHorizontal: 5,
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    marginLeft: 6,
  },
  contactInfo: {
    borderTopWidth: 1,
    borderTopColor: '#333',
    paddingTop: 15,
  },
  contactText: {
    color: '#ccc',
    fontSize: 14,
    marginBottom: 6,
  },
  bold: {
    fontWeight: 'bold',
    color: '#fff',
  },
  open: {
    color: '#00ff88',
    fontWeight: '600',
  },
});
