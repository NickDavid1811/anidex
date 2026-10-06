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
  onComplete: () => void;
}

export function ThemeTransitionOverlay({
  x,
  y,
  targetScheme,
  onComplete,
}: ThemeTransitionOverlayProps) {
  const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('screen');

  // Calcular el radio máximo necesario desde el punto de toque hasta la esquina más lejana
  const maxDistX = Math.max(x, SCREEN_WIDTH - x);
  const maxDistY = Math.max(y, SCREEN_HEIGHT - y);
  const radius = Math.ceil(Math.hypot(maxDistX, maxDistY)) + 20;
  const diameter = radius * 2;

  const scale = useSharedValue(0);
  const opacity = useSharedValue(1);

  useEffect(() => {
    scale.value = 0;
    opacity.value = 1;

    // Animación de barrido expansivo ultra rápida y fluida (180ms)
    scale.value = withTiming(
      1,
      {
        duration: 180,
        easing: Easing.out(Easing.cubic),
      },
      (finished) => {
        if (finished) {
          // Desvanecimiento rápido (70ms)
          opacity.value = withTiming(
            0,
            {
              duration: 70,
              easing: Easing.linear,
            },
            (fadeFinished) => {
              if (fadeFinished) {
                runOnJS(onComplete)();
              }
            }
          );
        }
      }
    );
  }, [onComplete, opacity, scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const bgColor = targetScheme === 'dark' ? '#141211' : '#FCF8F6';

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
      ]}>
      <Animated.View
        style={[
          {
            position: 'absolute',
            left: x - radius,
            top: y - radius,
            width: diameter,
            height: diameter,
            borderRadius: radius,
            backgroundColor: bgColor,
            borderColor: '#E09F7D',
            borderWidth: 2.5,
          },
          animatedStyle,
        ]}
      />
    </View>
  );
}
