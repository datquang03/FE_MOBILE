import React, { useEffect, useCallback, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getCurrentUser } from "../../features/Authentication/authSlice";
import { getActiveStudio } from "../../features/Studio/studioSlice";
import { getActiveSetDesign } from "../../features/SetDesign/setDesignSlice";
import { getAllEquipments } from "../../features/Equipment/equipmentSlice";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  FlatList,
  RefreshControl,
  Animated,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { COLORS, RADIUS, SPACING, TYPOGRAPHY } from "../../constants/theme";
import { setDesigns, equipments } from "../../constants/mockData";
import { useFocusEffect } from '@react-navigation/native';

export default function HomeScreen({ navigation }) {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const token = useSelector((state) => state.auth.token);
  const customer = useSelector((state) => state.customer.customer);
  const studios = useSelector((state) => state.studio.studios);
  const studioLoading = useSelector((state) => state.studio.loading);
  const studioError = useSelector((state) => state.studio.error);
  const setDesigns = useSelector((state) => state.setDesign?.setDesigns || []);
  const setDesignLoading = useSelector((state) => state.setDesign?.loading);
  const setDesignError = useSelector((state) => state.setDesign?.error);
  const equipments = useSelector((state) => state.equipment?.equipments?.data?.equipment || []);
  const equipmentLoading = useSelector((state) => state.equipment?.loading);
  const equipmentError = useSelector((state) => state.equipment?.error);
  const [refreshing, setRefreshing] = useState(false);

  const isLoggedIn = !!user && !!token;

  // Always sync user info with customer profile if available
  useEffect(() => {
    if (customer) {
      dispatch({ type: 'auth/getCurrentUser/fulfilled', payload: customer });
    }
  }, [customer, dispatch]);

  useEffect(() => {
    if (token && !user) {
      dispatch(getCurrentUser());
    }
  }, [token, user, dispatch]);

  useEffect(() => {
    dispatch(getActiveStudio());
    dispatch(getActiveSetDesign());
    dispatch(getAllEquipments());
  }, [dispatch]);

  useFocusEffect(
    React.useCallback(() => {
      if (token) {
        dispatch(getCurrentUser());
      }
    }, [token, dispatch])
  );

  const handleProfilePress = () => {
    if (isLoggedIn) {
      navigation.navigate("Profile");
    } else {
      navigation.navigate("SignIn");
    }
  };

  // Pull to refresh handler
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await dispatch(getCurrentUser());
    setRefreshing(false);
  }, [dispatch]);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={{ paddingTop: 32, paddingBottom: 24 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.header}>
          <TouchableOpacity style={styles.avatar} onPress={handleProfilePress}>
            {user?.avatar && typeof user.avatar === 'string' ? (
              <Image source={{ uri: user.avatar }} style={styles.avatar} />
            ) : (
              <View style={styles.avatarIconWrapper}>
                <Feather name="user" size={32} color={COLORS.textDark} />
              </View>
            )}
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <TouchableOpacity onPress={handleProfilePress}>
              <Text style={styles.name}>
                {isLoggedIn
                  ? user?.fullName || user?.username || "Khách hàng"
                  : "Khách hàng"}
              </Text>
            </TouchableOpacity>
            <Text style={styles.location}>
              {isLoggedIn
                ? (user?.role === "customer"
                    ? "Khách hàng"
                    : user?.role === "staff"
                    ? "Nhân viên"
                    : user?.role || "Chưa xác định")
                : "Ấn vào để đăng nhập"}
            </Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate('Search')}>
              <Feather name="search" size={20} color={COLORS.textDark} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate('Notifications')}>
              <Feather name="bell" size={20} color={COLORS.textDark} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ paddingHorizontal: 20 }}>
          <TouchableOpacity style={styles.locationCard}>
            <Feather name="map-pin" size={18} color={COLORS.brandBlue} />
            <Text style={styles.locationText}>Bạn có thể thay đổi vị trí của mình</Text>
            <Feather name="chevron-right" size={18} color={COLORS.textMuted} />
          </TouchableOpacity>
        </View>

        <SectionHeader
          title="Phòng phổ biến"
          actionLabel="Xem tất cả"
          onPress={() => navigation.navigate("Search")}
        />
        {studioLoading ? (
          <StudioSkeleton />
        ) : studioError ? (
          <View style={{ height: 160, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ color: 'red' }}>Lỗi tải phòng!</Text>
          </View>
        ) : (
          <FlatList
            data={studios}
            keyExtractor={(item) => item._id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: SPACING.lg }}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.designCard}
                onPress={() => navigation.navigate("Detail", { item })}
              >
                <View style={{ position: 'relative' }}>
                  <Image
                    source={{ uri: item.images?.[0] || undefined }}
                    style={styles.designImage}
                    resizeMode="cover"
                  />
                  <View style={styles.badgeRating}>
                    <Feather name="star" size={16} color={COLORS.brandGold} />
                    <Text style={styles.badgeRatingText}>{item.avgRating?.toFixed(1) || '0.0'}</Text>
                    <Text style={{ color: COLORS.textMuted, marginLeft: 4, fontSize: 13 }}>({item.reviewCount})</Text>
                  </View>
                </View>
                <View style={styles.designContent}>
                  <Text style={styles.cardTitle} numberOfLines={1}>{item.name}</Text>
                  <Text style={[styles.cardMeta, { minHeight: 38 }]} numberOfLines={2}>{item.description}</Text>
                  <Text style={styles.cardPrice}>{item.basePricePerHour.toLocaleString()}đ/giờ</Text>
                </View>
              </TouchableOpacity>
            )}
          />
        )}

        <SectionHeader
          title="Set Design theo yêu cầu"
          actionLabel="Xem thêm"
          onPress={() => navigation.navigate("SetDesignList")}
        />
        {setDesignLoading ? (
          <StudioSkeleton />
        ) : setDesignError ? (
          <View style={{ height: 160, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ color: 'red' }}>Lỗi tải set design!</Text>
          </View>
        ) : (
          <FlatList
            data={setDesigns}
            keyExtractor={(item) => item._id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: SPACING.lg }}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.designCard}
                onPress={() => navigation.navigate("SetDesignDetail", { item })}
              >
                <Image source={{ uri: item.images?.[0] }} style={styles.designImage} />
                <View style={styles.designContent}>
                  <Text style={styles.cardTitle}>{item.name}</Text>
                  <Text style={styles.cardMeta} numberOfLines={2}>{item.description}</Text>
                  <Text style={styles.cardPrice}>{item.price?.toLocaleString()}đ</Text>
                </View>
              </TouchableOpacity>
            )}
          />
        )}

        <SectionHeader
          title="Chúng tôi đang ở đây"
          actionLabel="Mở bản đồ"
        />
        <View style={[styles.mapCard, { marginBottom: 24, marginTop: 8 }]}>
          <Text style={styles.mapTitle}>S Cộng Studio</Text>
          <Text style={styles.mapSubtitle}>Ngô Văn Sở, Phim trường S cộng</Text>
        </View>

        <SectionHeader
          title="Dụng Cụ"
          actionLabel="Xem thêm"
        />
        {equipmentLoading ? (
          <StudioSkeleton />
        ) : equipmentError ? (
          <View style={{ height: 160, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ color: 'red' }}>Lỗi tải dụng cụ!</Text>
          </View>
        ) : (
          <FlatList
            data={equipments}
            keyExtractor={(item) => item._id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: SPACING.lg }}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.equipmentCard}
                onPress={() => navigation.navigate("EquipmentDetail", { item })}
              >
                <Image source={{ uri: item.image }} style={styles.equipmentImage} />
                <View style={{ flex: 1, marginLeft: SPACING.md }}>
                  <Text style={styles.cardTitle}>{item.name}</Text>
                  <Text style={styles.cardMeta} numberOfLines={2}>{item.description}</Text>
                  <Text style={styles.cardPrice}>{item.pricePerHour?.toLocaleString()}đ/giờ</Text>
                  <Text style={{ color: COLORS.textMuted, fontSize: 13 }}>Còn lại: {item.availableQty}/{item.totalQty}</Text>
                </View>
              </TouchableOpacity>
            )}
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const SectionHeader = ({ title, actionLabel, onPress }) => (
  <View style={styles.sectionHeader}>
    <Text style={styles.sectionTitle}>{title}</Text>
    {actionLabel ? (
      <TouchableOpacity onPress={onPress}>
        <Text style={styles.sectionAction}>{actionLabel}</Text>
      </TouchableOpacity>
    ) : null}
  </View>
);

// Custom Expo-compatible skeleton loader for studios
const StudioSkeleton = () => {
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnim, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.timing(shimmerAnim, {
          toValue: 0,
          duration: 1200,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [shimmerAnim]);

  const shimmerStyle = {
    opacity: shimmerAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [0.5, 1],
    }),
  };

  return (
    <View style={{ flexDirection: 'row', paddingHorizontal: SPACING.lg }}>
      {[1,2,3].map((_, idx) => (
        <View key={idx} style={{ width: 220, marginRight: SPACING.md, borderRadius: RADIUS.xl, overflow: 'hidden', backgroundColor: COLORS.surface }}>
          <Animated.View style={[{ width: '100%', height: 140, borderRadius: RADIUS.xl, backgroundColor: COLORS.background }, shimmerStyle]} />
          <View style={{ padding: SPACING.md }}>
            <Animated.View style={[{ width: 120, height: 18, borderRadius: 8, marginBottom: 8, backgroundColor: COLORS.background }, shimmerStyle]} />
            <Animated.View style={[{ width: 80, height: 14, borderRadius: 8, marginBottom: 6, backgroundColor: COLORS.background }, shimmerStyle]} />
            <Animated.View style={[{ width: 60, height: 14, borderRadius: 8, marginBottom: 6, backgroundColor: COLORS.background }, shimmerStyle]} />
            <Animated.View style={[{ width: 80, height: 20, borderRadius: 8, backgroundColor: COLORS.background }, shimmerStyle]} />
          </View>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: SPACING.lg,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.textLight,
    marginRight: SPACING.md,
    overflow: 'hidden',
  },
  avatarIconWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: {
    fontSize: TYPOGRAPHY.headingS,
    fontWeight: "700",
    color: COLORS.textDark,
  },
  location: {
    color: COLORS.textMuted,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: SPACING.sm,
  },
  locationCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.surface,
    marginHorizontal: SPACING.lg,
    borderRadius: RADIUS.xl,
    padding: SPACING.md,
  },
  locationText: {
    flex: 1,
    marginHorizontal: SPACING.md,
    color: COLORS.textDark,
    fontWeight: "600",
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: SPACING.lg,
    marginTop: SPACING.xl,
    marginBottom: SPACING.md,
  },
  sectionTitle: {
    fontSize: TYPOGRAPHY.headingS,
    fontWeight: "700",
    color: COLORS.textDark,
  },
  sectionAction: {
    color: COLORS.brandBlue,
    fontWeight: "600",
  },
  horizontalCard: {
    width: 220,
    marginRight: SPACING.md,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    overflow: "hidden",
  },
  horizontalImage: {
    width: "100%",
    height: 140,
  },
  horizontalContent: {
    padding: SPACING.md,
  },
  cardTitle: {
    fontWeight: "700",
    color: COLORS.textDark,
    marginBottom: 4,
  },
  cardMeta: {
    color: COLORS.textMuted,
    marginBottom: 4,
  },
  cardPrice: {
    color: COLORS.brandBlue,
    fontWeight: "700",
  },
  designCard: {
    width: 180,
    marginRight: SPACING.md,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    overflow: "hidden",
  },
  designImage: {
    width: "100%",
    height: 160,
  },
  designContent: {
    padding: SPACING.md,
  },
  mapCard: {
    marginHorizontal: SPACING.lg,
    borderRadius: RADIUS.xl,
    backgroundColor: COLORS.surface,
    padding: SPACING.lg,
  },
  mapTitle: {
    fontWeight: "700",
    color: COLORS.textDark,
  },
  mapSubtitle: {
    color: COLORS.textMuted,
  },
  equipmentCard: {
    flexDirection: "row",
    alignItems: "center",
    width: 260,
    padding: SPACING.md,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    marginRight: SPACING.md,
  },
  equipmentImage: {
    width: 72,
    height: 72,
    borderRadius: RADIUS.md,
  },
  oldPrice: {
    textDecorationLine: "line-through",
    color: COLORS.danger,
  },
  badgeRating: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 2,
    shadowColor: COLORS.brandGold,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 2,
  },
  badgeRatingText: {
    color: COLORS.brandGold,
    fontWeight: 'bold',
    marginLeft: 4,
    fontSize: 15,
  },
  cardPriceHighlight: {
    color: COLORS.brandBlue,
    fontWeight: 'bold',
    fontSize: 22,
    marginTop: 4,
    marginBottom: 2,
    letterSpacing: 1,
  },
});

