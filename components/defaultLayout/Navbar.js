import React, { useEffect } from 'react';
import { Text, StyleSheet } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import AnimatedButton from '../customedButton/animatedButton';

export default function Navbar({ navigation }) {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(-40);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  useEffect(() => {
    opacity.value = withTiming(1, { duration: 800 });
    translateY.value = withTiming(0, { duration: 800 });
  }, []);

  return (
    <Animated.View style={[styles.navbar, animatedStyle]}>
      <Text style={styles.title}>S+ Studio</Text>
      <AnimatedButton
        text="Đăng nhập"
        onPress={() => navigation.navigate('Login')}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 80,
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: '#1e1e2f',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    borderRadius: 10,
    elevation: 5,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#00aaff',
    letterSpacing: 1.2,
  },
});
