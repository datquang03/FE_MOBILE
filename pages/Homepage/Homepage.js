import React, { useRef } from "react";
import { StyleSheet, Animated, Dimensions } from "react-native";
import DefaultLayout from "../../components/defaultLayout/DefaultLayout";
import Section1 from "./components/Section1";
import Section2 from "./components/Section2";
import AnimatedBackground from "../../components/customedBackground/animatedBackground";

const { height } = Dimensions.get("window");

export default function Homepage({ navigation }) {
  const scrollY = useRef(new Animated.Value(0)).current;

  return (
    <DefaultLayout navigation={navigation}>
      <AnimatedBackground style={styles.backgroundContainer} />
      <Section1 />
      <Section2 />
    </DefaultLayout>
  );
}

const styles = StyleSheet.create({
  backgroundContainer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: -1,
  },
});
