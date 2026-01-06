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
import { Feather } from "@expo/vector-icons";
import HeaderBar from "../../components/ui/HeaderBar";
import SetDesignDetailSkeleton from "../../components/skeletons/SetDesignDetailSkeleton";
import { COLORS, RADIUS, SPACING, TYPOGRAPHY } from "../../constants/theme";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

export default function SetDesignDetailScreen({ route, navigation }) {
  const { item } = route.params || {};
  const [loading, setLoading] = useState(true);

  const [sliderIndex, setSliderIndex] = useState(0);
  const [showImageModal, setShowImageModal] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const sliderRef = useRef();
  const autoPlayTimer = useRef();

  /* ================= FAKE LOADING ================= */
  useEffect(() => {
    if (item) {
      const t = setTimeout(() => setLoading(false), 500);
      return () => clearTimeout(t);
    }
  }, [item]);

  /* ================= AUTOPLAY SLIDER ================= */
  useEffect(() => {
    if (!item?.images?.length || showImageModal) return;
    autoPlayTimer.current && clearInterval(autoPlayTimer.current);

    autoPlayTimer.current = setInterval(() => {
      setSliderIndex((prev) => {
        const next = prev + 1 >= item.images.length ? 0 : prev + 1;
        sliderRef.current?.scrollToIndex({ index: next, animated: true });
        return next;
      });
    }, 3500);

    return () => clearInterval(autoPlayTimer.current);
  }, [item?.images, showImageModal]);

  /* ================= IMAGE SLIDER ================= */
  const renderImageSlider = () => (
    <View style={styles.sliderWrapper}>
      <FlatList
        ref={sliderRef}
        data={item?.images || []}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(_, idx) => idx.toString()}
        onMomentumScrollEnd={(e) => {
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
            <Image source={{ uri: img }} style={styles.hero} />
          </TouchableOpacity>
        )}
      />

      <View style={styles.sliderIndicatorWrap}>
        {(item?.images || []).map((_, idx) => (
          <View
            key={idx}
            style={[
              styles.sliderDot,
              sliderIndex === idx && styles.sliderDotActive,
            ]}
          />
        ))}
      </View>
    </View>
  );

  /* ================= IMAGE MODAL ================= */
  const renderImageModal = () => (
    <Modal visible={showImageModal} transparent animationType="fade">
      <View style={styles.modalBg}>
        <FlatList
          data={item?.images || []}
          horizontal
          pagingEnabled
          initialScrollIndex={sliderIndex}
          getItemLayout={(_, i) => ({
            length: SCREEN_WIDTH,
            offset: SCREEN_WIDTH * i,
            index: i,
          })}
          renderItem={({ item }) => (
            <Image source={{ uri: item }} style={styles.fullImage} />
          )}
        />

        <TouchableOpacity
          style={styles.closeBtn}
          onPress={() => setShowImageModal(false)}
        >
          <Text style={{ color: "#fff", fontSize: 18 }}>Đóng</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );

  /* ================= RENDER ================= */
  return (
    <SafeAreaView style={[styles.safe, { paddingTop: 32 }]}>
      {/* ===== HEADER GIỐNG STUDIO ===== */}
      <HeaderBar
        title="Chi tiết"
        onBack={() => navigation.goBack?.()}
        rightIcon="more-vertical"
        onRightPress={() => setShowMenu((v) => !v)}
      />

      {/* ===== DROPDOWN MENU ===== */}
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
              onPress={() => setShowMenu(false)}
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

      <ScrollView contentContainerStyle={{ paddingBottom: SPACING.xxl }}>
        {loading ? (
          <SetDesignDetailSkeleton />
        ) : (
          <>
            {item?.images?.length > 0 && renderImageSlider()}
            {renderImageModal()}

            <View style={styles.sheet}>
              <View style={styles.titleRow}>
                <Text style={styles.title}>{item.name}</Text>
                <TouchableOpacity>
                  <Feather
                    name="heart"
                    size={22}
                    color={COLORS.textMuted}
                    style={{ opacity: 0.7 }}
                  />
                </TouchableOpacity>
              </View>

              <View style={styles.infoRowGroup}>
                <View style={styles.infoRow}>
                  <Feather
                    name="dollar-sign"
                    size={16}
                    color={COLORS.brandBlue}
                  />
                  <Text style={styles.infoLabel}>Giá:</Text>
                  <Text style={styles.price}>
                    {item.price?.toLocaleString()}đ
                  </Text>
                </View>

                <View style={styles.infoRow}>
                  <Feather name="tag" size={16} color={COLORS.textMuted} />
                  <Text style={styles.infoLabel}>Danh mục:</Text>
                  <Text style={styles.infoValue}>{item.category}</Text>
                </View>

                <View style={styles.infoRow}>
                  <Feather name="calendar" size={16} color={COLORS.textMuted} />
                  <Text style={styles.infoLabel}>Ngày tạo:</Text>
                  <Text style={styles.infoValue}>
                    {new Date(item.createdAt).toLocaleDateString("vi-VN")}
                  </Text>
                </View>
              </View>

              <Text style={styles.description}>{item.description}</Text>
            </View>
          </>
        )}
      </ScrollView>

      {/* ===== BOTTOM BAR ===== */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.primaryBtn}>
          <Text style={styles.primaryBtnText}>Đặt ngay</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

/* ================= STYLES ================= */
const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  hero: {
    width: SCREEN_WIDTH,
    height: 280,
    backgroundColor: COLORS.border,
  },

  sliderWrapper: {
    width: SCREEN_WIDTH,
    height: 280,
  },

  sliderIndicatorWrap: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: -24,
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
    backgroundColor: "rgba(0,0,0,0.95)",
  },

  fullImage: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    resizeMode: "contain",
  },

  closeBtn: {
    position: "absolute",
    top: 40,
    right: 24,
    padding: 10,
  },

  sheet: {
    marginTop: -40,
    borderTopLeftRadius: RADIUS.xl,
    borderTopRightRadius: RADIUS.xl,
    backgroundColor: COLORS.surface,
    padding: SPACING.xl,
  },

  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  title: {
    fontSize: TYPOGRAPHY.headingM,
    fontWeight: "700",
    color: COLORS.textDark,
  },

  infoRowGroup: {
    marginTop: 8,
  },

  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },

  infoLabel: {
    marginLeft: 4,
    marginRight: 2,
    color: COLORS.textMuted,
    fontWeight: "600",
  },

  infoValue: {
    color: COLORS.textDark,
    fontWeight: "600",
  },

  price: {
    marginLeft: 4,
    color: COLORS.brandBlue,
    fontWeight: "700",
  },

  description: {
    marginTop: 14,
    fontSize: 15,
    lineHeight: 22,
    color: COLORS.textDark,
  },

  bottomBar: {
    padding: SPACING.lg,
    backgroundColor: COLORS.surface,
    borderTopWidth: 1,
    borderColor: COLORS.border,
  },

  primaryBtn: {
    backgroundColor: COLORS.brandBlue,
    borderRadius: RADIUS.xl,
    paddingVertical: 16,
    alignItems: "center",
  },

  primaryBtnText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },

  dropdownMenu: {
    position: "absolute",
    top: 56,
    right: 18,
    backgroundColor: "#fff",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 6,
    zIndex: 100,
  },

  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
  },

  menuItemText: {
    color: "#E53935",
    fontWeight: "700",
  },

  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.01)",
    zIndex: 99,
  },
});
