import React, { useEffect, useRef } from "react";
import { Animated, View } from "react-native";

export default function SkeletonBlock({
  width = "100%",
  height = 16,
  radius = 8,
  style,
}) {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.7,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <Animated.View
      style={[
        {
          width,
          height,
          borderRadius: radius,
          backgroundColor: "#E1E1E1",
          opacity,
        },
        style,
      ]}
    />
  );
}
