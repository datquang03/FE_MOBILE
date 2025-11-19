import React from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { setDesigns } from "../../constants/mockData";
import { COLORS, RADIUS, SPACING, TYPOGRAPHY } from "../../constants/theme";
import PrimaryButton from "../../components/ui/PrimaryButton";

export default function SelectSetDesignScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.sheet}>
        <View style={styles.handle} />
        <View style={styles.header}>
          <Text style={styles.title}>Set Design (gói có sẵn)</Text>
          <TouchableOpacity onPress={() => navigation.goBack?.()}>
            <Text style={styles.close}>✕</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={setDesigns.slice(1)}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.item}>
              <Image source={{ uri: item.image }} style={styles.itemImage} />
              <View style={{ flex: 1, marginLeft: SPACING.md }}>
                <Text style={styles.itemName}>{item.name}</Text>
                <View style={styles.priceRow}>
                  <Text style={styles.priceNew}>{item.price}</Text>
                  <Text style={styles.priceOld}>{item.oldPrice}</Text>
                </View>
              </View>
            </View>
          )}
        />
        <PrimaryButton label="Xác nhận" onPress={() => navigation.goBack()} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "rgba(13,31,51,0.6)",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: RADIUS.xl,
    borderTopRightRadius: RADIUS.xl,
    padding: SPACING.lg,
    maxHeight: "88%",
  },
  handle: {
    width: 60,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: COLORS.border,
    alignSelf: "center",
    marginBottom: SPACING.lg,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SPACING.md,
  },
  title: {
    fontSize: TYPOGRAPHY.headingS,
    fontWeight: "700",
    color: COLORS.textDark,
  },
  close: {
    fontSize: 18,
    color: COLORS.textMuted,
  },
  item: {
    flexDirection: "row",
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  itemImage: {
    width: 64,
    height: 64,
    borderRadius: RADIUS.md,
  },
  itemName: {
    fontWeight: "600",
    color: COLORS.textDark,
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: SPACING.xs,
  },
  priceNew: {
    color: COLORS.brandBlue,
    fontWeight: "700",
    marginRight: SPACING.sm,
  },
  priceOld: {
    color: COLORS.textMuted,
    textDecorationLine: "line-through",
  },
});

