import React, { useEffect } from 'react';
import { StyleSheet, Animated, Dimensions, View } from 'react-native';

const { width, height } = Dimensions.get('window');

export default function AnimatedBackground() {
  const animation = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animation, {
          toValue: 1,
          duration: 10000,
          useNativeDriver: true,
        }),
        Animated.timing(animation, {
          toValue: 0,
          duration: 10000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [animation]);

  const translateX = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -width * 0.2],
  });

  const translateY = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -height * 0.2],
  });

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.circle,
          {
            transform: [{ translateX }, { translateY }],
            opacity: 0.15,
          },
        ]}
      />
      <Animated.View
        style={[
          styles.circle,
          {
            transform: [{ translateX: Animated.multiply(translateX, -1) }, { translateY: Animated.multiply(translateY, -1) }],
            opacity: 0.1,
          },
        ]}
      />
      <Animated.View
        style={[
          styles.circle,
          {
            transform: [{ translateX: Animated.multiply(translateX, 0.5) }, { translateY: Animated.multiply(translateY, 0.5) }],
            opacity: 0.07,
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#0a3d62',  
    overflow: 'hidden',
  },
  circle: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: '#00aaff',
    top: 100,
    left: 100,
  },
});
