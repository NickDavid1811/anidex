import { Image } from 'expo-image';
import * as SplashScreen from 'expo-splash-screen';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { Easing, Keyframe } from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

const DURATION = 600;

const exitAnimation = new Keyframe({
  0: {
    transform: [{ scale: 1 }],
    opacity: 1,
  },
  20: {
    opacity: 1,
  },
  70: {
    opacity: 0,
    easing: Easing.elastic(0.7),
  },
  100: {
    opacity: 0,
    transform: [{ scale: 1 }],
    easing: Easing.elastic(0.7),
  },
});

export function SplashOverlay() {
  const [animate, setAnimate] = useState(false);
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  const logo = (
    <Image
      contentFit="contain"
      style={styles.logo}
      source={require('@/assets/brand/anidex-mark.png')}
    />
  );

  if (animate) {
    return (
      <Animated.View
        entering={exitAnimation.duration(DURATION).withCallback((finished) => {
          'worklet';
          if (finished) scheduleOnRN(setVisible, false);
        })}
        style={styles.overlay}
      >
        {logo}
      </Animated.View>
    );
  }

  return (
    <View
      onLayout={() => {
        SplashScreen.hideAsync().finally(() => setAnimate(true));
      }}
      style={styles.overlay}
    >
      {logo}
    </View>
  );
}

const styles = StyleSheet.create({
  logo: {
    width: 128,
    height: 128,
  },
  overlay: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#141211',
    zIndex: 1000,
  },
});
