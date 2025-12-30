import React from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import SkeletonBlock from "./SkeletonBlock";

const { width } = Dimensions.get("window");

export default function RoomSkeleton({ count = 4 }) {
  return (
    <View style={{ padding: 16 }}>
      {Array.from({ length: count }).map((_, index) => (
        <View key={index} style={styles.card}>
          {/* Image */}
          <SkeletonBlock height={160} radius={12} />

          {/* Title */}
          <SkeletonBlock
            width="70%"
            height={20}
            style={{ marginTop: 12 }}
          />

          {/* Subtitle */}
          <SkeletonBlock
            width="45%"
            height={16}
            style={{ marginTop: 8 }}
          />

          {/* Price */}
          <SkeletonBlock
            width="30%"
            height={18}
            style={{ marginTop: 12 }}
          />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 20,
    width: width - 32,
  },
});
