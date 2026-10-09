import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useEffect, useState } from 'react';
import {
  Animated as RNAnimated,
  GestureResponderEvent,
  Pressable,
} from 'react-native';
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

interface FavoriteActionButtonProps {
  active: boolean;
  accessibilityLabel: string;
  isDark: boolean;
  onPress: () => void;
  contained?: boolean;
  size?: number;
}

export function FavoriteActionButton({
  active,
  accessibilityLabel,
  isDark,
  onPress,
  contained = true,
  size = 22,
}: FavoriteActionButtonProps) {
  const activeProgress = useSharedValue(active ? 1 : 0);
  const [pressScale] = useState(() => new RNAnimated.Value(1));

  useEffect(() => {
    activeProgress.value = withTiming(active ? 1 : 0, { duration: 160 });
  }, [active, activeProgress]);

  const containerStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      activeProgress.value,
      [0, 1],
      [
        contained
          ? isDark
            ? '#2F241E'
            : '#EDE5DF'
          : 'rgba(0, 0, 0, 0)',
        isDark ? '#58392B' : '#FFDCC2',
      ]
    ),
  }));

  const outlineStyle = useAnimatedStyle(() => ({
    opacity: 1 - activeProgress.value,
    transform: [{ scale: 1 - activeProgress.value * 0.25 }],
  }));

  const filledStyle = useAnimatedStyle(() => ({
    opacity: activeProgress.value,
    transform: [{ scale: 0.65 + activeProgress.value * 0.35 }],
  }));

  const handlePress = (event: GestureResponderEvent) => {
    event.stopPropagation();
    RNAnimated.sequence([
      RNAnimated.timing(pressScale, {
        toValue: 0.82,
        duration: 70,
        useNativeDriver: true,
      }),
      RNAnimated.spring(pressScale, {
        toValue: 1.14,
        friction: 5,
        tension: 160,
        useNativeDriver: true,
      }),
      RNAnimated.spring(pressScale, {
        toValue: 1,
        friction: 7,
        tension: 130,
        useNativeDriver: true,
      }),
    ]).start();
    void Haptics.selectionAsync().catch(() => {});
    onPress();
  };

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ selected: active }}
      onPress={handlePress}
      onPressIn={() => {
        RNAnimated.timing(pressScale, {
          toValue: 0.9,
          duration: 80,
          useNativeDriver: true,
        }).start();
      }}
      onPressOut={() => {
        RNAnimated.spring(pressScale, {
          toValue: 1,
          friction: 7,
          tension: 130,
          useNativeDriver: true,
        }).start();
      }}
      style={{ width: 48, height: 48 }}
    >
      <RNAnimated.View style={{ transform: [{ scale: pressScale }] }}>
        <Animated.View
          style={[
            {
              width: 48,
              height: 48,
              borderRadius: 24,
              alignItems: 'center',
              justifyContent: 'center',
            },
            containerStyle,
          ]}
        >
          <Animated.View style={[{ position: 'absolute' }, outlineStyle]}>
            <Ionicons
              name="heart-outline"
              size={size}
              color={isDark ? '#EDE0DB' : '#53433C'}
            />
          </Animated.View>
          <Animated.View style={filledStyle}>
            <Ionicons
              name="heart"
              size={size}
              color={isDark ? '#FFDCC2' : '#8B4F26'}
            />
          </Animated.View>
        </Animated.View>
      </RNAnimated.View>
    </Pressable>
  );
}
