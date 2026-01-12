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
  Animated,
  Easing,
  Pressable,
} from "react-native";
import HeaderBar from "../../components/ui/HeaderBar";
import SetDesignDetailSkeleton from "../../components/skeletons/SetDesignDetailSkeleton";
import { COLORS, RADIUS, SPACING } from "../../constants/theme";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } =
  Dimensions.get("window");

export default function SetDesignDetailScreen({ route, navigation }) {
  const { item } = route.params || {};
  const [loading, setLoading] = useState(true);
  const [sliderIndex, setSliderIndex] = useState(0);
  const [showImageModal, setShowImageModal] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const sliderRef = useRef(null);
  const autoPlayTimer = useRef(null);

  /* ===== MODAL ANIMATION ===== */
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.92)).current;

  useEffect(() => {
    if (showBookingModal) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 260,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 300,
          easing: Easing.out(Easing.exp),
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      fadeAnim.setValue(0);
      scaleAnim.setValue(0.92);
    }
  }, [showBookingModal]);

  /* ===== FAKE LOADING ===== */
  useEffect(() => {
    if (item) {
      const t = setTimeout(() => setLoading(false), 400);
      return () => clearTimeout(t);
    }
  }, [item]);

  /* ===== AUTOPLAY SLIDER ===== */
  useEffect(() => {
    if (!item?.images?.length || showImageModal) return;

    autoPlayTimer.current &&
      clearInterval(autoPlayTimer.current);

    autoPlayTimer.current = setInterval(() => {
      setSliderIndex((prev) => {
        const next =
          prev + 1 >= item.images.length ? 0 : prev + 1;
        sliderRef.current?.scrollToIndex({
          index: next,
          animated: true,
        });
        return next;
      });
    }, 3500);

    return () =>
      autoPlayTimer.current &&
      clearInterval(autoPlayTimer.current);
  }, [item?.images, showImageModal]);

  /* ===== SLIDER ===== */
  const renderSlider = () => (
    <View style={styles.sliderWrapper}>
      <FlatList
        ref={sliderRef}
        data={item?.images || []}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(_, i) => i.toString()}
        onMomentumScrollEnd={(e) =>
          setSliderIndex(
            Math.round(
              e.nativeEvent.contentOffset.x / SCREEN_WIDTH
            )
          )
        }
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

  /* ===== IMAGE FULLSCREEN ===== */
  const renderImageModal = () => (
    <Modal visible={showImageModal} transparent>
      <Pressable
        style={styles.imageModalBg}
        onPress={() => setShowImageModal(false)}
      >
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
            <Image
              source={{ uri: item }}
              style={styles.fullImage}
            />
          )}
        />
      </Pressable>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.safe}>
      <View style={{ marginTop: 32 }}>
        <HeaderBar
          title="Chi tiết"
          onBack={() => navigation.goBack?.()}
          rightIcon="more-vertical"
          onRightPress={() => setShowMenu((v) => !v)}
        />
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
                <Text style={styles.menuItemText}>Báo cáo</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>

      <ScrollView>
        {loading ? (
          <SetDesignDetailSkeleton />
        ) : (
          <>
            {renderSlider()}
            {renderImageModal()}

            <View style={styles.sheet}>
              <Text style={styles.title}>{item.name}</Text>
              <Text style={styles.description}>
                {item.description}
              </Text>
            </View>
          </>
        )}
      </ScrollView>

      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.primaryBtn}
          onPress={() => setShowBookingModal(true)}
        >
          <Text style={styles.primaryBtnText}>Đặt ngay</Text>
        </TouchableOpacity>
      </View>

      {/* ===== BOOKING MODAL – NO DIM, NO GRADIENT ===== */}
      <Modal
        visible={showBookingModal}
        transparent
        presentationStyle="overFullScreen"
        statusBarTranslucent
      >
        <Pressable
          style={styles.modalRoot}
          onPress={() => setShowBookingModal(false)}
        >
          <Image
            source={{ uri: item?.images?.[0] }}
            style={styles.modalBg}
          />

          <Pressable>
            <Animated.View
              style={[
                styles.bookingModalBox,
                {
                  opacity: fadeAnim,
                  transform: [{ scale: scaleAnim }],
                },
              ]}
            >
              <Text style={styles.bookingModalTitle}>
                Chọn cách đặt Set Design
              </Text>

              <View style={styles.bookingModalBtnRow}>
                <TouchableOpacity
                  style={styles.bookingModalBtnLeft}
                >
                  <Text style={styles.bookingModalBtnText}>
                    Đặt ngay trên app
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.bookingModalBtnRight}
                >
                  <Text
                    style={[
                      styles.bookingModalBtnText,
                      { color: COLORS.brandBlue },
                    ]}
                  >
                    Liên hệ tư vấn
                  </Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

/* ===== STYLES ===== */
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },

  hero: { width: SCREEN_WIDTH, height: 280 },
  sliderWrapper: { height: 280 },
  sliderIndicatorWrap: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: -24,
  },
  sliderDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#aaa",
    marginHorizontal: 3,
  },
  sliderDotActive: {
    width: 18,
    backgroundColor: COLORS.brandBlue,
  },

  imageModalBg: { flex: 1, backgroundColor: "#000" },
  fullImage: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    resizeMode: "contain",
  },

  sheet: {
    marginTop: -32,
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: RADIUS.xl,
    borderTopRightRadius: RADIUS.xl,
    padding: SPACING.xl,
  },

  title: { fontSize: 22, fontWeight: "700" },
  description: {
    marginTop: 12,
    fontSize: 15,
    lineHeight: 22,
    color: "#555",
  },

  bottomBar: { padding: 16 },
  primaryBtn: {
    backgroundColor: COLORS.brandBlue,
    borderRadius: 20,
    paddingVertical: 16,
    alignItems: "center",
  },
  primaryBtnText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },

  /* ===== MODAL ===== */
  modalRoot: {
    flex: 1,
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBg: {
    ...StyleSheet.absoluteFillObject,
    resizeMode: "cover",
  },

  bookingModalBox: {
    width: 320,
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 26,
    elevation: 12,
  },
  bookingModalTitle: {
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 24,
  },
  bookingModalBtnRow: {
    flexDirection: "row",
    gap: 12,
  },
  bookingModalBtnLeft: {
    flex: 1,
    backgroundColor: COLORS.brandBlue,
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: "center",
  },
  bookingModalBtnRight: {
    flex: 1,
    borderWidth: 1,
    borderColor: COLORS.brandBlue,
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: "center",
  },
  bookingModalBtnText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#fff",
  },

  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "transparent",
    zIndex: 99,
  },
  dropdownMenu: {
    position: "absolute",
    top: 56,
    right: 18,
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingVertical: 6,
    paddingHorizontal: 0,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 6,
    zIndex: 100,
    minWidth: 140,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 18,
  },
  menuItemText: {
    fontSize: 16,
    color: "#E53935",
    fontWeight: "bold",
  },
});
