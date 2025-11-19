import React from "react";
import { SafeAreaView, View, Text, StyleSheet, Image } from "react-native";
import HeaderBar from "../../components/ui/HeaderBar";
import PrimaryButton from "../../components/ui/PrimaryButton";
import { COLORS, RADIUS, SPACING, TYPOGRAPHY } from "../../constants/theme";

export default function QRCodeScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.safe}>
      <HeaderBar title="Booking Complete" onBack={() => navigation.goBack?.()} />
      <View style={styles.content}>
        <View style={styles.qrContainer}>
          <Image
            source={{
              uri: "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=Studio-1",
            }}
            style={styles.qrImage}
          />
        </View>
      </View>
      <View style={styles.footer}>
        <PrimaryButton
          label="Về trang chủ"
          onPress={() => navigation.navigate("MainTabs")}
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
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  qrContainer: {
    padding: SPACING.xl,
    borderRadius: RADIUS.xl,
    backgroundColor: COLORS.surface,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.05,
    shadowRadius: 25,
    elevation: 4,
  },
  qrImage: {
    width: 220,
    height: 220,
  },
  footer: {
    padding: SPACING.lg,
  },
});

