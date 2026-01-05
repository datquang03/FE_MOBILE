import React, { useEffect, useRef, memo, useMemo } from "react";
import {
  SafeAreaView,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  Easing,
} from "react-native";
import { Audio } from "expo-av";
import { COLORS, SPACING, TYPOGRAPHY } from "../../constants/theme";

const { width, height } = Dimensions.get("window");

/* ================= STAR ================= */
const Star = memo(({ x, y, size, delay }) => {
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 1200,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.15,
          duration: 1200,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <Animated.View
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: size,
        height: size,
        borderRadius: size,
        backgroundColor: "#E6F2FF",
        opacity,
      }}
    />
  );
});

export default function SplashScreen({ navigation }) {
  /* CAMERA */
  const cameraPush = useRef(new Animated.Value(60)).current;
  const vignetteOpacity = useRef(new Animated.Value(0)).current;

  /* BACKGROUND */
  const bgProgress = useRef(new Animated.Value(0)).current;

  /* LOGO */
  const logoScale = useRef(new Animated.Value(0.28)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;

  /* LIGHT SWEEP */
  const sweepSoftX = useRef(new Animated.Value(-width)).current;
  const sweepSoftO = useRef(new Animated.Value(0)).current;
  const sweepSharpX = useRef(new Animated.Value(-width)).current;
  const sweepSharpO = useRef(new Animated.Value(0)).current;

  /* TEXT */
  const textOpacity = useRef(new Animated.Value(0)).current;
  const textY = useRef(new Animated.Value(24)).current;

  /* FADE */
  const fadeOut = useRef(new Animated.Value(0)).current;

  /* ⭐ RANDOM STARS – tạo mới mỗi lần vào app */
  const stars = useMemo(() => {
    return Array.from({ length: 24 }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 2 + 1,
      delay: Math.random() * 2500,
    }));
  }, []);

  useEffect(() => {
    playSound();

    /* BACKGROUND – CỰC MƯỢT */
    Animated.timing(bgProgress, {
      toValue: 1,
      duration: 4200,
      easing: Easing.inOut(Easing.cubic),
      useNativeDriver: false,
    }).start();

    /* CAMERA */
    Animated.parallel([
      Animated.timing(cameraPush, {
        toValue: 0,
        duration: 1400,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(vignetteOpacity, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
      }),
    ]).start();

    /* LOGO + SWEEP */
    setTimeout(() => {
      Animated.parallel([
        Animated.timing(logoScale, {
          toValue: 1,
          duration: 1300,
          easing: Easing.out(Easing.exp),
          useNativeDriver: true,
        }),
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 900,
          useNativeDriver: true,
        }),

        Animated.sequence([
          Animated.timing(sweepSoftO, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(sweepSoftX, {
            toValue: width,
            duration: 1400,
            easing: Easing.inOut(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.timing(sweepSoftO, {
            toValue: 0,
            duration: 400,
            useNativeDriver: true,
          }),
        ]),

        Animated.sequence([
          Animated.delay(500),
          Animated.timing(sweepSharpO, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.timing(sweepSharpX, {
            toValue: width,
            duration: 800,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }),
          Animated.timing(sweepSharpO, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
        ]),
      ]).start();
    }, 900);

    /* TEXT */
    setTimeout(() => {
      Animated.parallel([
        Animated.timing(textOpacity, {
          toValue: 1,
          duration: 900,
          useNativeDriver: true,
        }),
        Animated.timing(textY, {
          toValue: 0,
          duration: 900,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start();
    }, 1900);

    /* FADE OUT */
    setTimeout(() => {
      Animated.timing(fadeOut, {
        toValue: 1,
        duration: 700,
        easing: Easing.inOut(Easing.quad),
        useNativeDriver: true,
      }).start(() => navigation.replace("Onboarding"));
    }, 3100);
  }, []);

  const playSound = async () => {
    const { sound } = await Audio.Sound.createAsync(
      require("../../assets/intro.mp3"),
      { volume: 0.3 }
    );
    await sound.playAsync();
  };

  /* BACKGROUND COLOR – ĐEN → XANH ĐEN MƯỢT */
  const bgColor = bgProgress.interpolate({
    inputRange: [0, 0.4, 0.7, 1],
    outputRange: ["#020409", "#040A16", "#071B33", "#0A2547"],
  });

  return (
    <SafeAreaView style={styles.safe}>
      {/* BACKGROUND */}
      <Animated.View
        style={[
          styles.bg,
          {
            backgroundColor: bgColor,
            transform: [{ translateY: cameraPush }],
          },
        ]}
      />

      {/* STARS – RANDOM */}
      <Animated.View style={StyleSheet.absoluteFill}>
        {stars.map((s, i) => (
          <Star key={i} {...s} />
        ))}
      </Animated.View>

      {/* VIGNETTE */}
      <Animated.View style={[styles.vignette, { opacity: vignetteOpacity }]} />

      {/* LOGO */}
      <Animated.View
        style={[
          styles.logo,
          {
            opacity: logoOpacity,
            transform: [{ scale: logoScale }],
          },
        ]}
      >
        <Text style={styles.icon}>S</Text>

        <Animated.View
          style={[
            styles.sweepSoft,
            { opacity: sweepSoftO, transform: [{ translateX: sweepSoftX }] },
          ]}
        />
        <Animated.View
          style={[
            styles.sweepSharp,
            { opacity: sweepSharpO, transform: [{ translateX: sweepSharpX }] },
          ]}
        />
      </Animated.View>

      {/* TEXT */}
      <Animated.View
        style={{
          marginTop: SPACING.lg,
          alignItems: "center",
          opacity: textOpacity,
          transform: [{ translateY: textY }],
        }}
      >
        <Text style={styles.brand}>S Cộng Studio</Text>
        <Text style={styles.subtitle}>
          Tìm nơi phù hợp cho công việc của bạn !
        </Text>
      </Animated.View>

      <Animated.View style={[styles.fadeOut, { opacity: fadeOut }]} />
    </SafeAreaView>
  );
}

/* ================= STYLES ================= */
const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#020409",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  bg: { ...StyleSheet.absoluteFillObject },
  vignette: {
    position: "absolute",
    width: width * 1.2,
    height: height * 1.2,
    backgroundColor: "rgba(0,0,0,0.45)",
    borderRadius: width,
  },
  logo: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: COLORS.brandGold,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    shadowColor: "#4DA6FF",
    shadowOpacity: 0.45,
    shadowRadius: 35,
    elevation: 28,
  },
  icon: {
    fontSize: 56,
    fontWeight: "900",
    color: COLORS.brandDark,
    letterSpacing: 2,
    zIndex: 2,
  },
  sweepSoft: {
    position: "absolute",
    width: 80,
    height: 180,
    backgroundColor: "rgba(255,255,255,0.18)",
    transform: [{ rotate: "18deg" }],
  },
  sweepSharp: {
    position: "absolute",
    width: 36,
    height: 180,
    backgroundColor: "rgba(255,255,255,0.45)",
    transform: [{ rotate: "18deg" }],
  },
  brand: {
    fontSize: TYPOGRAPHY.headingL,
    color: COLORS.surface,
    fontWeight: "700",
    letterSpacing: 1.4,
  },
  subtitle: {
    marginTop: SPACING.sm,
    color: COLORS.textLight,
    opacity: 0.8,
  },
  fadeOut: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#040914",
  },
});
