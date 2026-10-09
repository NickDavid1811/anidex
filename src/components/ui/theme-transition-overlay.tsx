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

    // Cubrir primero la interfaz anterior antes de aplicar el tema nuevo.
    scale.value = withTiming(
      1,
      {
        duration: 220,
        easing: Easing.out(Easing.cubic),
      },
      (finished) => {
        if (finished) {
          runOnJS(onCovered)();
        }
      }
    );
  }, [onCovered, scale]);

  useEffect(() => {
    if (!covered) return;

    // El nuevo tema ya está renderizado debajo: revelarlo suavemente.
    opacity.value = withTiming(
      0,
      {
        duration: 120,
        easing: Easing.inOut(Easing.ease),
      },
      (finished) => {
        if (finished) {
          runOnJS(onComplete)();
        }
      }
    );
  }, [covered, onComplete, opacity]);

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
