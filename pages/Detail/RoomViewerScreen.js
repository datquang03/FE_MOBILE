import React from "react";
import { SafeAreaView, View, Text, StyleSheet, ImageBackground } from "react-native";
import HeaderBar from "../../components/ui/HeaderBar";
import { COLORS, SPACING, TYPOGRAPHY } from "../../constants/theme";

export default function RoomViewerScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.safe}>
      <HeaderBar title="Chi tiết phòng" onBack={() => navigation.goBack?.()} rightIcon="more-vertical" />
      <ImageBackground
        source={{
          uri: "https://images.unsplash.com/photo-1504208434309-cb69f4fe52b0?auto=format&fit=crop&w=800&q=60",
        }}
        style={styles.viewer}
      >
        <View style={styles.overlay}>
          <Text style={styles.room}>Studio 1</Text>
          <Text style={styles.meta}>360° View</Text>
        </View>
        <View style={styles.captureButton} />
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  viewer: { flex: 1, justifyContent: "space-between", padding: SPACING.lg },
  overlay: { marginTop: SPACING.lg },
  room: { color: COLORS.surface, fontSize: TYPOGRAPHY.headingS, fontWeight: "700" },
  meta: { color: COLORS.surface },
  captureButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.surface,
    alignSelf: "center",
    marginBottom: SPACING.lg,
  },
});

