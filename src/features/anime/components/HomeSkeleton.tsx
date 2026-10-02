import React, { useEffect, useRef } from 'react';
import { Animated, Dimensions, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface HomeSkeletonProps {
  isDark: boolean;
}

export function HomeSkeleton({ isDark }: HomeSkeletonProps) {
  const pulseAnim = useRef(new Animated.Value(0.35)).current;
  const screenWidth = Dimensions.get('window').width;
  const contentWidth = Math.min(screenWidth, 800);

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 0.8,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0.35,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [pulseAnim]);

  const blockColor = isDark ? '#2D231D' : '#E8DFD8';

  return (
    <View
      className={`flex-1 ${
        isDark ? 'bg-[#141211]' : 'bg-[#FCF8F6]'
      }`}>
      <SafeAreaView
        className="flex-1 w-full max-w-[800px] self-center"
        edges={['top', 'left', 'right']}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 110 }}>
          {/* Header Skeleton */}
          <View className="px-4 pt-3 pb-2 gap-2">
            <Animated.View
              style={{
                opacity: pulseAnim,
                backgroundColor: blockColor,
                width: 170,
                height: 28,
                borderRadius: 8,
              }}
            />
            <Animated.View
              style={{
                opacity: pulseAnim,
                backgroundColor: blockColor,
                width: 220,
                height: 14,
                borderRadius: 6,
              }}
            />
          </View>

          {/* Hero Carousel Skeleton */}
          <View className="mt-4 px-4 gap-2.5">
            <View className="flex-row justify-between items-center">
              <Animated.View
                style={{
                  opacity: pulseAnim,
                  backgroundColor: blockColor,
                  width: 190,
                  height: 20,
                  borderRadius: 6,
                }}
              />
              <Animated.View
                style={{
                  opacity: pulseAnim,
                  backgroundColor: blockColor,
                  width: 60,
                  height: 16,
                  borderRadius: 6,
                }}
              />
            </View>

            <Animated.View
              style={{
                opacity: pulseAnim,
                backgroundColor: blockColor,
                width: '100%',
                height: 195,
                borderRadius: 28,
              }}
            />

            {/* Dots Skeleton */}
            <View className="flex-row justify-center items-center mt-2 gap-1.5">
              {[1, 2, 3, 4, 5].map((i) => (
                <View
                  key={i}
                  className={`h-1.5 rounded-full ${
                    i === 1 ? 'w-5' : 'w-1.5'
                  } ${isDark ? 'bg-[#3E3028]' : 'bg-[#D8CDC5]'}`}
                />
              ))}
            </View>
          </View>

          {/* Categories Skeleton */}
          <View className="mt-6 px-4 gap-2.5">
            <Animated.View
              style={{
                opacity: pulseAnim,
                backgroundColor: blockColor,
                width: 160,
                height: 20,
                borderRadius: 6,
              }}
            />
            <View className="flex-row gap-2 mt-1">
              {[90, 80, 85, 75].map((w, index) => (
                <Animated.View
                  key={index}
                  style={{
                    opacity: pulseAnim,
                    backgroundColor: blockColor,
                    width: w,
                    height: 36,
                    borderRadius: 16,
                  }}
                />
              ))}
            </View>
          </View>

          {/* Top Ranking Skeletons */}
          <View className="mt-6 px-4 gap-2.5">
            <Animated.View
              style={{
                opacity: pulseAnim,
                backgroundColor: blockColor,
                width: 210,
                height: 20,
                borderRadius: 6,
              }}
            />

            {[1, 2, 3].map((item) => (
              <Animated.View
                key={item}
                style={{
                  opacity: pulseAnim,
                  backgroundColor: blockColor,
                  width: '100%',
                  height: 80,
                  borderRadius: 18,
                  marginBottom: 10,
                }}
              />
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
