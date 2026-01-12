import React, { useEffect, useMemo, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { Ionicons } from "@expo/vector-icons";

import HeaderBar from "../../components/ui/HeaderBar";
import { COLORS, RADIUS, SPACING } from "../../constants/theme";
import { createSearch } from "../../features/Search/searchSlice";
import SearchInputSkeletonLoading from "../../components/skeletons/SearchInputSkeletonLoading";

export default function SearchScreen({ navigation }) {
  const dispatch = useDispatch();
  const [keyword, setKeyword] = useState("");

  const { results, loading } = useSelector((state) => state.search);

  /* =======================
      🔥 DEBOUNCE SEARCH
  ======================= */
  useEffect(() => {
    if (!keyword.trim()) return;

    const timer = setTimeout(() => {
      dispatch(createSearch(keyword));
    }, 400);

    return () => clearTimeout(timer);
  }, [keyword]);

  /* =======================
      🔥 FLATTEN DATA + SECTION
  ======================= */
  const listData = useMemo(() => {
    const data = [];

    if (results?.studios?.length) {
      data.push({ type: "header", title: "Studio" });
      data.push(
        ...results.studios.map((item) => ({
          ...item,
          entityType: "studio",
        }))
      );
    }

    if (results?.setDesigns?.length) {
      data.push({ type: "header", title: "Set thiết kế" });
      data.push(
        ...results.setDesigns.map((item) => ({
          ...item,
          entityType: "setDesign",
        }))
      );
    }

    if (results?.equipment?.length) {
      data.push({ type: "header", title: "Thiết bị" });
      data.push(
        ...results.equipment.map((item) => ({
          ...item,
          entityType: "equipment",
        }))
      );
    }

    return data;
  }, [results]);

  /* =======================
      🔥 RENDER ITEM
  ======================= */
  const renderItem = ({ item }) => {
    if (item.type === "header") {
      return <Text style={styles.sectionHeader}>{item.title}</Text>;
    }

    const imageUri =
      item.entityType === "studio"
        ? item.images?.[0]
        : item.entityType === "setDesign"
        ? item.images?.[0]
        : item.image;

    return (
      <TouchableOpacity
        style={styles.resultCard}
        activeOpacity={0.85}
        onPress={() => {
          if (item.entityType === "studio") {
            navigation.navigate("Detail", {
              studioId: item._id,
            });
          }

          if (item.entityType === "setDesign") {
            navigation.navigate("SetDesignDetail", {
              setDesignId: item._id,
            });
          }

          if (item.entityType === "equipment") {
            console.log("Equipment clicked:", item._id);
          }
        }}
      >
        <View style={styles.row}>
          {/* IMAGE */}
          {imageUri && (
            <Image source={{ uri: imageUri }} style={styles.thumb} />
          )}

          <View style={{ flex: 1 }}>
            <View style={styles.row}>
              <Ionicons
                name={
                  item.entityType === "studio"
                    ? "business"
                    : item.entityType === "setDesign"
                    ? "color-palette"
                    : "camera"
                }
                size={16}
                color={COLORS.brandBlue}
                style={{ marginRight: 6 }}
              />
              <Text style={styles.resultTitle} numberOfLines={1}>
                {item.name}
              </Text>
            </View>

            {!!item.basePricePerHour && (
              <Text style={styles.price}>{item.basePricePerHour}đ / giờ</Text>
            )}

            {!!item.pricePerHour && (
              <Text style={styles.price}>{item.pricePerHour}đ / giờ</Text>
            )}

            {!!item.price && <Text style={styles.price}>{item.price}đ</Text>}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <HeaderBar title="Tìm kiếm" onBack={() => navigation.goBack()} />

      <View style={styles.content}>
        <View style={styles.inputRow}>
          <TextInput
            placeholder="Bạn cần gì..."
            placeholderTextColor={COLORS.textMuted}
            style={styles.input}
            value={keyword}
            onChangeText={setKeyword}
            returnKeyType="search"
          />
        </View>

        {loading ? (
          <SearchInputSkeletonLoading />
        ) : (
          <FlatList
            data={listData}
            keyExtractor={(item, index) =>
              item._id ? item._id : item.title + index
            }
            renderItem={renderItem}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

/* =======================
      🎨 STYLES
======================= */
const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.background,
    marginTop: 32,
  },

  content: {
    paddingHorizontal: SPACING.lg,
    paddingTop: 16,
  },

  inputRow: {
    marginBottom: SPACING.md,
  },

  input: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    paddingHorizontal: SPACING.lg,
    height: 48,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  sectionHeader: {
    marginTop: 32,
    marginBottom: SPACING.sm,
    fontWeight: "700",
    color: COLORS.textMuted,
  },

  resultCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
  },

  thumb: {
    width: 56,
    height: 56,
    borderRadius: 10,
    marginRight: 12,
    backgroundColor: COLORS.border,
  },

  resultTitle: {
    fontWeight: "700",
    color: COLORS.textDark,
  },

  price: {
    marginTop: 4,
    color: COLORS.brandBlue,
    fontWeight: "700",
  },

  meta: {
    color: COLORS.textMuted,
    marginBottom: SPACING.sm,
  },
});
