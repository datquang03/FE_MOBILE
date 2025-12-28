import React, { useRef, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Dimensions,
  FlatList,
} from "react-native";
import PrimaryButton from "../../components/ui/PrimaryButton";
import { onboardingSlides } from "../../constants/mockData";
import { COLORS, SPACING, TYPOGRAPHY } from "../../constants/theme";

const { width } = Dimensions.get("window");

export default function OnboardingScreen({ navigation }) {
  const [index, setIndex] = useState(0);
  const flatListRef = useRef(null);

  const handleNext = () => {
    if (index === onboardingSlides.length - 1) {
      navigation.replace("SignIn");
    } else {
      flatListRef.current?.scrollToIndex({ index: index + 1 });
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <FlatList
        ref={flatListRef}
        data={onboardingSlides}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(e) => {
          const newIndex = Math.round(e.nativeEvent.contentOffset.x / width);
          setIndex(newIndex);
        }}
        renderItem={({ item }) => (
          <ImageBackground source={{ uri: item.image }} style={styles.slide}>
            <View style={styles.overlay} />
            <View style={styles.content}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.subtitle}>{item.subtitle}</Text>
              <View style={styles.dots}>
                {onboardingSlides.map((_, idx) => (
                  <View
                    key={idx}
                    style={[styles.dot, idx === index && styles.dotActive]}
                  />
                ))}
              </View>
              <PrimaryButton label={item.cta} onPress={handleNext} />
            </View>
          </ImageBackground>
        )}
        keyExtractor={(item) => item.id}
      />
      {index === onboardingSlides.length - 1 ? (
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Bạn không có tài khoản?{" "}
            <Text
              style={styles.link}
              onPress={() => navigation.navigate("SignUp")}
            >
              Đăng kí ngay
            </Text>
          </Text>
        </View>
      ) : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.brandDark,
  },
  slide: {
    width,
    flex: 1,
    justifyContent: "flex-end",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(11,43,71,0.35)",
  },
  content: {
    padding: SPACING.xl,
  },
  title: {
    fontSize: TYPOGRAPHY.headingL,
    fontWeight: "700",
    color: COLORS.surface,
    marginBottom: SPACING.md,
  },
  subtitle: {
    color: COLORS.textLight,
    marginBottom: SPACING.lg,
  },
  dots: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: SPACING.lg,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(255,255,255,0.4)",
    marginRight: 6,
  },
  dotActive: {
    width: 24,
    backgroundColor: COLORS.surface,
  },
  footer: {
    paddingBottom: SPACING.lg,
    alignItems: "center",
  },
  footerText: {
    color: COLORS.surface,
  },
  link: {
    color: COLORS.brandGold,
    fontWeight: "700",
  },
});

