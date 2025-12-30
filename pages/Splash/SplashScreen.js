import React, { useEffect } from "react";
import { SafeAreaView, View, Text, StyleSheet } from "react-native";
import { COLORS, SPACING, TYPOGRAPHY } from "../../constants/theme";

export default function SplashScreen({ navigation }) {
  useEffect(() => {
    const timeout = setTimeout(() => {
      navigation.replace("Onboarding");
    }, 1500);
    return () => clearTimeout(timeout);
  }, [navigation]);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.logo}>
        <Text style={styles.icon}>S</Text>
      </View>
      <Text style={styles.brand}>S Cộng Studio</Text>
      <Text style={styles.subtitle}>Tìm nơi phù hợp cho công việc của bạn !</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.brandDark,
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: COLORS.brandGold,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: SPACING.lg,
  },
  icon: {
    fontSize: 56,
    color: COLORS.brandDark,
    fontWeight: "900",
  },
  brand: {
    fontSize: TYPOGRAPHY.headingL,
    color: COLORS.surface,
    fontWeight: "700",
  },
  subtitle: {
    color: COLORS.textLight,
    marginTop: SPACING.sm,
  },
});

