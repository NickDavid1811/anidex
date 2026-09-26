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

  // Calcular el radio máximo necesario desde el punto de toque (x, y) hasta la esquina más lejana
  const maxDistX = Math.max(x, SCREEN_WIDTH - x);
  const maxDistY = Math.max(y, SCREEN_HEIGHT - y);
  const radius = Math.ceil(Math.hypot(maxDistX, maxDistY)) + 30;
  const diameter = radius * 2;

  const scale = useSharedValue(0);
  const opacity = useSharedValue(1);

  useEffect(() => {
    scale.value = 0;
    opacity.value = 1;

    // Animación de barrido expansivo
    scale.value = withTiming(
      1,
      {
        duration: 380,
        easing: Easing.bezier(0.2, 0, 0, 1),
      },
      (finished) => {
        if (finished) {
          // Desvanecimiento suave al finalizar la cobertura
          opacity.value = withTiming(
            0,
            {
              duration: 160,
              easing: Easing.out(Easing.ease),
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
  }, [onComplete]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  // Color de fondo del tema de destino
  const bgColor = targetScheme === 'dark' ? '#0B0E14' : '#F7F8FA';

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
            borderColor: '#F47521',
            borderWidth: 3.5,
          },
          animatedStyle,
        ]}
      />
    </View>
  );
}
