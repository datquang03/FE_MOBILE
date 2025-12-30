import React, { useEffect, useState, useRef } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Modal,
  Dimensions,
  FlatList,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { getStudioById } from "../../features/Studio/studioSlice";
import HeaderBar from "../../components/ui/HeaderBar";
import PrimaryButton from "../../components/ui/PrimaryButton";
import FullScreenLoading from "../../components/loadings/fullScreenLoading";
import { COLORS, RADIUS, SPACING, TYPOGRAPHY } from "../../constants/theme";
import { Feather } from '@expo/vector-icons';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

export default function StudioDetailScreen({ route, navigation }) {
  const { item } = route.params || {};
  const dispatch = useDispatch();
  const studio = useSelector((state) => state.studio.studioDetail);
  const loading = useSelector((state) => state.studio.studioDetailLoading);
  const error = useSelector((state) => state.studio.studioDetailError);

  // State cho slider và modal fullscreen
  const [sliderIndex, setSliderIndex] = useState(0);
  const [showImageModal, setShowImageModal] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const sliderRef = useRef();
  const autoPlayTimer = useRef();

  // Autoplay slider
  useEffect(() => {
    if (!studio?.images?.length || showImageModal) return;
    autoPlayTimer.current && clearInterval(autoPlayTimer.current);
    autoPlayTimer.current = setInterval(() => {
      setSliderIndex((prev) => {
        const next = prev + 1 >= studio.images.length ? 0 : prev + 1;
        // Scroll FlatList
        sliderRef.current?.scrollToIndex({ index: next, animated: true });
        return next;
      });
    }, 3500);
    return () => clearInterval(autoPlayTimer.current);
  }, [studio?.images, showImageModal]);

  useEffect(() => {
    if (item?._id) {
      dispatch(getStudioById(item._id));
    }
  }, [item?._id, dispatch]);

  // Render slider ảnh
  const renderImageSlider = () => (
    <View style={styles.sliderWrapper}>
      <FlatList
        ref={sliderRef}
        data={studio?.images || []}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(_, idx) => idx.toString()}
        onMomentumScrollEnd={e => {
          const idx = Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH);
          setSliderIndex(idx);
        }}
        renderItem={({ item: img, index }) => (
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => {
              setSliderIndex(index);
              setShowImageModal(true);
            }}
          >
            <View>
              <Image source={{ uri: img }} style={styles.hero} resizeMode="cover" />
              {/* Hiển thị badge đánh giá ở tất cả các ảnh */}
              <View style={styles.ratingBadge}>
                <Feather name="star" size={18} color={COLORS.brandGold} />
                <Text style={styles.ratingText}>{studio.avgRating?.toFixed(1) || 0}</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
        extraData={sliderIndex}
      />
      {/* Indicator */}
      <View style={styles.sliderIndicatorWrap}>
        {(studio?.images || []).map((_, idx) => (
          <View
            key={idx}
            style={[styles.sliderDot, sliderIndex === idx && styles.sliderDotActive]}
          />
        ))}
      </View>
    </View>
  );

  // Modal xem ảnh fullscreen
  const renderImageModal = () => (
    <Modal visible={showImageModal} transparent animationType="fade">
      <View style={styles.modalBg}>
        <FlatList
          data={studio?.images || []}
          horizontal
          pagingEnabled
          initialScrollIndex={sliderIndex}
          getItemLayout={(_, i) => ({ length: SCREEN_WIDTH, offset: SCREEN_WIDTH * i, index: i })}
          renderItem={({ item }) => (
            <Image source={{ uri: item }} style={styles.fullImage} resizeMode="contain" />
          )}
          keyExtractor={(_, idx) => idx.toString()}
        />
        <TouchableOpacity style={styles.closeBtn} onPress={() => setShowImageModal(false)}>
          <Text style={{ color: '#fff', fontSize: 18 }}>Đóng</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );

  return (
    <SafeAreaView style={[styles.safe, { paddingTop: 32 }]}>
      <HeaderBar
        title="Chi tiết"
        onBack={() => navigation.goBack?.()}
        rightIcon="more-vertical"
        onRightPress={() => setShowMenu((v) => !v)}
      />
      {/* Dropdown menu khi bấm ba chấm */}
      {showMenu && (
        <View style={styles.dropdownMenu}>
          <TouchableOpacity style={styles.menuItem} onPress={() => { setShowMenu(false); /* TODO: handle report */ }}>
            <Feather name="alert-circle" size={20} color="#E53935" style={{ marginRight: 8 }} />
            <Text style={styles.menuItemText}> <Text style={{ color: '#E53935', fontWeight: 'bold' }}>Báo cáo</Text></Text>
          </TouchableOpacity>
        </View>
      )}
      {loading && <FullScreenLoading />}
      <ScrollView contentContainerStyle={{ paddingBottom: SPACING.xxl }}>
        {/* Skeleton loading */}
        {loading ? (
          <View>
            <View style={[styles.hero, { backgroundColor: COLORS.border }]} />
            <View style={{ padding: SPACING.xl }}>
              <View style={{ width: 180, height: 28, backgroundColor: COLORS.border, borderRadius: 8, marginBottom: 12 }} />
              <View style={{ width: 100, height: 18, backgroundColor: COLORS.border, borderRadius: 8, marginBottom: 16 }} />
              <View style={{ width: '100%', height: 60, backgroundColor: COLORS.border, borderRadius: 8, marginBottom: 24 }} />
            </View>
          </View>
        ) : error ? (
          <View style={{ padding: SPACING.xl }}>
            <Text style={{ color: 'red' }}>Không thể tải thông tin studio.</Text>
          </View>
        ) : studio ? (
          <>
            {studio.images?.length > 0 && renderImageSlider()}
            {renderImageModal()}
            <View style={styles.sheet}>
              <Text style={styles.title}>{studio.name}</Text>
              <Text style={styles.location}>{studio.location}</Text>
              <View style={styles.infoRowGroup}>
                <View style={styles.infoRow}>
                  <Feather name="maximize" size={16} color={COLORS.textMuted} style={{ marginRight: 4 }} />
                  <Text style={styles.infoLabel}>Diện tích:</Text>
                  <Text style={styles.infoValue}>{studio.area} m²</Text>
                  <Feather name="users" size={16} color={COLORS.textMuted} style={{ marginLeft: 16, marginRight: 4 }} />
                  <Text style={styles.infoLabel}>Sức chứa:</Text>
                  <Text style={styles.infoValue}>{studio.capacity}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Feather name="dollar-sign" size={16} color={COLORS.brandBlue} style={{ marginRight: 4 }} />
                  <Text style={styles.infoLabel}>Giá:</Text>
                  <Text style={styles.price}>{studio.basePricePerHour?.toLocaleString()}đ/giờ</Text>
                </View>
              </View>
              <Text style={styles.description}>{studio.description}</Text>
            </View>
          </>
        ) : null}
      </ScrollView>
      {/* Bottom bar */}
      <View style={styles.bottomBar}>
        <View>
          <Text style={styles.priceLabel}>Giá (tạm tính)</Text>
          <Text style={styles.totalPrice}>{studio?.basePricePerHour?.toLocaleString()}đ/giờ</Text>
        </View>
        <PrimaryButton
          style={{ flex: 1, marginLeft: SPACING.md }}
          label="Đặt ngay"
          onPress={() => navigation.navigate("SelectDate", { studio })}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  hero: {
    width: SCREEN_WIDTH,
    height: 280,
    backgroundColor: COLORS.border,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
  },
  sliderWrapper: {
    width: SCREEN_WIDTH,
    height: 280,
    backgroundColor: COLORS.border,
  },
  sliderIndicatorWrap: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -24,
    marginBottom: 8,
  },
  sliderDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.textMuted,
    marginHorizontal: 3,
  },
  sliderDotActive: {
    backgroundColor: COLORS.brandBlue,
    width: 16,
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
  ratingBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  ratingText: {
    color: COLORS.brandGold,
    fontWeight: '700',
    marginLeft: 4,
    fontSize: 15,
  },
  sheet: {
    marginTop: -40,
    borderTopLeftRadius: RADIUS.xl,
    borderTopRightRadius: RADIUS.xl,
    backgroundColor: COLORS.surface,
    padding: SPACING.xl,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  title: {
    fontSize: TYPOGRAPHY.headingM,
    fontWeight: '700',
    color: COLORS.textDark,
    marginBottom: 6,
  },
  location: {
    color: COLORS.textMuted,
    marginBottom: 12,
    fontSize: 15,
  },
  infoRowGroup: {
    marginBottom: 10,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  infoLabel: {
    color: COLORS.textMuted,
    fontWeight: '600',
    fontSize: 15,
    marginRight: 2,
  },
  infoValue: {
    color: COLORS.textDark,
    fontWeight: '600',
    fontSize: 15,
    marginLeft: 2,
  },
  price: {
    color: COLORS.brandBlue,
    fontWeight: '700',
    fontSize: 16,
    marginLeft: 4,
  },
  description: {
    color: COLORS.textDark,
    marginTop: 14,
    fontSize: 15,
    lineHeight: 22,
  },
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.lg,
    backgroundColor: COLORS.surface,
    borderTopWidth: 1,
    borderColor: COLORS.border,
  },
  priceLabel: {
    color: COLORS.textMuted,
  },
  totalPrice: {
    color: COLORS.brandBlue,
    fontWeight: '700',
    fontSize: TYPOGRAPHY.headingS,
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

