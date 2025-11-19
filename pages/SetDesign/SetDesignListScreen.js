import React from "react";
import { SafeAreaView, View, Text, StyleSheet, Image, FlatList, TouchableOpacity } from "react-native";
import HeaderBar from "../../components/ui/HeaderBar";
import { COLORS, RADIUS, SPACING, TYPOGRAPHY } from "../../constants/theme";
import { setDesigns } from "../../constants/mockData";

export default function SetDesignListScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.safe}>
      <HeaderBar title="Set Design" onBack={() => navigation.goBack?.()} rightIcon="more-vertical" />
      <FlatList
        data={setDesigns}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: SPACING.lg }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate("SetDesignHighlight", { item })}
          >
            <Image source={{ uri: item.image }} style={styles.image} />
            <View style={{ flex: 1, marginLeft: SPACING.md }}>
              <Text style={styles.title}>{item.name}</Text>
              <View style={styles.priceRow}>
                <Text style={styles.price}>{item.price}</Text>
                <Text style={styles.oldPrice}>{item.oldPrice}</Text>
              </View>
            </View>
            <Text style={styles.link}>Liên hệ</Text>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  card: {
    flexDirection: "row",
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    alignItems: "center",
  },
  image: { width: 72, height: 72, borderRadius: RADIUS.md },
  title: { fontWeight: "700", color: COLORS.textDark },
  priceRow: { flexDirection: "row", alignItems: "center" },
  price: { color: COLORS.brandBlue, fontWeight: "700", marginRight: SPACING.sm },
  oldPrice: { color: COLORS.danger, textDecorationLine: "line-through" },
  link: { color: COLORS.brandBlue, fontWeight: "600" },
});

