import React from "react";
import { SafeAreaView, View, Text, StyleSheet, Image, ScrollView, Modal, TouchableOpacity, Dimensions } from "react-native";
import HeaderBar from "../../components/ui/HeaderBar";
import { COLORS, RADIUS, SPACING, TYPOGRAPHY } from "../../constants/theme";
import { Feather } from "@expo/vector-icons";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

export default function EquipmentDetailScreen({ route, navigation }) {
  const { item } = route.params || {};
  const [showImageModal, setShowImageModal] = React.useState(false);
  const [showMenu, setShowMenu] = React.useState(false);
  if (!item) {
    return (
      <SafeAreaView style={styles.safe}>
        <HeaderBar  title="Chi tiết dụng cụ" onBack={() => navigation.goBack?.()} />
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ color: COLORS.danger, fontSize: 18 }}>Không tìm thấy thông tin dụng cụ!</Text>
        </View>
      </SafeAreaView>
    );
  }
  return (
    <SafeAreaView style={styles.safe}>
      <View style={{ paddingTop: 32 }}>
        <HeaderBar
          title="Chi tiết dụng cụ"
          onBack={() => navigation.goBack?.()}
          rightIcon="more-vertical"
          onRightPress={() => setShowMenu((v) => !v)}
        />
      </View>
      {showMenu && (
        <>
          <TouchableOpacity
            style={styles.overlay}
            activeOpacity={1}
            onPress={() => setShowMenu(false)}
          />
          <View style={styles.dropdownMenu}>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                setShowMenu(false); /* TODO: handle report */
              }}
            >
              <Feather
                name="alert-circle"
                size={20}
                color="#E53935"
                style={{ marginRight: 8 }}
              />
              <Text style={styles.menuItemText}>Báo cáo</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
      <ScrollView contentContainerStyle={{ padding: SPACING.xl, paddingTop: 32, paddingBottom: 32 }}>
        <View style={styles.card}>
          <TouchableOpacity onPress={() => setShowImageModal(true)} activeOpacity={0.9}>
            <Image source={{ uri: item.image }} style={styles.image} />
          </TouchableOpacity>
          <Modal visible={showImageModal} transparent animationType="fade">
            <View style={styles.modalBg}>
              <Image source={{ uri: item.image }} style={styles.fullImage} resizeMode="contain" />
              <TouchableOpacity style={styles.closeBtn} onPress={() => setShowImageModal(false)}>
                <Text style={{ color: "#fff", fontSize: 18 }}>Đóng</Text>
              </TouchableOpacity>
            </View>
          </Modal>
          <View style={{ flexDirection: 'row', alignItems: 'center', width: '100%', marginTop: 18, marginBottom: 8 }}>
            <Text style={styles.title}>{item.name}</Text>
            <TouchableOpacity
              style={styles.reportBtn}
              onPress={() => setShowMenu(true)}
            >
              <Feather name="alert-circle" size={20} color={COLORS.danger} />
            </TouchableOpacity>
          </View>
          <Text style={styles.meta}>{item.description}</Text>
          <Text style={styles.price}>{item.pricePerHour?.toLocaleString()}đ/giờ</Text>
          <Text style={styles.qty}>Còn lại: {item.availableQty}/{item.totalQty}</Text>
          {item.features && (
            <View style={{ marginTop: 16, width: '100%' }}>
              <Text style={styles.section}>Tính năng nổi bật:</Text>
              {item.features.map((f, idx) => (
                <Text key={idx} style={styles.feature}>• {f}</Text>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    padding: SPACING.xl,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
    alignItems: 'center',
    marginTop: 64, // tăng marginTop để card hạ thấp xuống rõ rệt
  },
  image: {
    width: 180,
    height: 180,
    borderRadius: RADIUS.lg,
    marginBottom: 0,
    backgroundColor: COLORS.border,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 22,
    color: COLORS.textDark,
    flex: 1,
    textAlign: 'left',
  },
  reportBtn: {
    marginLeft: 12,
    padding: 4,
    borderRadius: 16,
    backgroundColor: COLORS.brandBlue + '10',
  },
  meta: {
    color: COLORS.textMuted,
    fontSize: 15,
    marginBottom: 8,
    textAlign: 'left',
    width: '100%',
  },
  price: {
    color: COLORS.brandBlue,
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 8,
    textAlign: 'left',
    width: '100%',
  },
  qty: {
    color: COLORS.textMuted,
    fontSize: 15,
    marginBottom: 8,
    textAlign: 'left',
    width: '100%',
  },
  section: {
    fontWeight: 'bold',
    color: COLORS.brandBlue,
    fontSize: 16,
    marginBottom: 6,
  },
  feature: {
    color: COLORS.textDark,
    fontSize: 15,
    marginBottom: 2,
  },
  modalBg: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.95)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullImage: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    resizeMode: 'contain',
  },
  closeBtn: {
    position: 'absolute',
    top: 40,
    right: 24,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 10,
    borderRadius: 20,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.01)',
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
