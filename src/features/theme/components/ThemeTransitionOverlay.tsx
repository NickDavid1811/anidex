import React, { useEffect } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

interface ThemeTransitionOverlayProps {
  x: number;
  y: number;
  targetScheme: 'light' | 'dark';
  covered: boolean;
  onCovered: () => void;
  onComplete: () => void;
}

export function ThemeTransitionOverlay({
  x,
  y,
  targetScheme,
  covered,
  onCovered,
  onComplete,
}: ThemeTransitionOverlayProps) {
  const { width: screenWidth, height: screenHeight } = Dimensions.get('screen');
  const maxDistX = Math.max(x, screenWidth - x);
  const maxDistY = Math.max(y, screenHeight - y);
  const radius = Math.ceil(Math.hypot(maxDistX, maxDistY)) + 20;
  const diameter = radius * 2;
  const scale = useSharedValue(0);
  const opacity = useSharedValue(1);

  useEffect(() => {
    scale.value = 0;
    scale.value = withTiming(
      1,
      {
        duration: 220,
        easing: Easing.out(Easing.cubic),
      },
      (finished) => {
        if (finished) runOnJS(onCovered)();
      }
    );
  }, [onCovered, scale]);

  useEffect(() => {
    if (!covered) return;

    opacity.value = withTiming(
      0,
      {
        duration: 120,
        easing: Easing.inOut(Easing.ease),
      },
      (finished) => {
        if (finished) runOnJS(onComplete)();
      }
    );
  }, [covered, onComplete, opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));
  const backgroundColor = targetScheme === 'dark' ? '#141211' : '#FCF8F6';

  return (
    <View
      pointerEvents="none"
      style={[
        StyleSheet.absoluteFill,
        {
          zIndex: 99999,
          elevation: 99999,
          overflow: 'hidden',
        },
      ]}
    >
      <Animated.View
        style={[
          {
            position: 'absolute',
            left: x - radius,
            top: y - radius,
            width: diameter,
            height: diameter,
            borderRadius: radius,
            backgroundColor,
            borderColor: '#E09F7D',
            borderWidth: 2.5,
          },
          animatedStyle,
        ]}
      />
    </View>
  );
}
