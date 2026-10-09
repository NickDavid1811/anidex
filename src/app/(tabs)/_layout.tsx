import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Typography, useAppTheme } from '@/features/theme';

interface TabIconProps {
  name: keyof typeof Ionicons.glyphMap;
  focusedName: keyof typeof Ionicons.glyphMap;
  focused: boolean;
  isDark: boolean;
}

function TabPillIcon({
  name,
  focusedName,
  focused,
  isDark,
}: TabIconProps) {
  const iconColor = focused
    ? isDark
      ? '#FFDCC2'
      : '#351A08'
    : isDark
      ? '#A89C94'
      : '#776962';

  return (
    <View
      style={{
        width: 60,
        height: 32,
        borderRadius: 16,
        backgroundColor: focused
          ? isDark
            ? '#58392B'
            : '#FFDCC2'
          : 'transparent',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
      }}
    >
      <Ionicons
        name={focused ? focusedName : name}
        size={22}
        color={iconColor}
      />

    </View>
  );
}

export default function TabLayout() {
  const { activeScheme } = useAppTheme();
  const insets = useSafeAreaInsets();
  const isDark = activeScheme === 'dark';

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        animation: 'fade',
        transitionSpec: {
          animation: 'timing',
          config: {
            duration: 180,
          },
        },
        tabBarActiveTintColor: isDark ? '#FFDCC2' : '#351A08',
        tabBarInactiveTintColor: isDark ? '#A89C94' : '#776962',
        // Desactiva el ripple gris gigante nativo de Android
        tabBarButton: ({ ref, ...rest }) => (
          <Pressable
            {...rest}
            android_ripple={null}
            style={[rest.style, { overflow: 'hidden' }]}
          />
        ),
        tabBarIconStyle: {
          width: 64,
          height: 32,
        },
        tabBarStyle: {
          backgroundColor: isDark ? '#221A16' : '#FFFFFF',
          borderTopColor: isDark ? '#3E3028' : '#D8CDC5',
          borderTopWidth: 1,
          height:
            Platform.OS === 'ios' ? 60 + insets.bottom : 68 + insets.bottom,
          paddingBottom: insets.bottom > 0 ? insets.bottom : 8,
          paddingTop: 8,
          elevation: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: isDark ? 0.35 : 0.08,
          shadowRadius: 4,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontFamily: Typography.semibold,
          marginTop: 2,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Inicio',
          tabBarIcon: ({ focused }) => (
            <TabPillIcon
              name="home-outline"
              focusedName="home"
              focused={focused}
              isDark={isDark}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explorar',
          tabBarIcon: ({ focused }) => (
            <TabPillIcon
              name="compass-outline"
              focusedName="compass"
              focused={focused}
              isDark={isDark}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          title: 'Favoritos',
          tabBarIcon: ({ focused }) => (
            <TabPillIcon
              name="heart-outline"
              focusedName="heart"
              focused={focused}
              isDark={isDark}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Ajustes',
          tabBarIcon: ({ focused }) => (
            <TabPillIcon
              name="settings-outline"
              focusedName="settings"
              focused={focused}
              isDark={isDark}
            />
          ),
        }}
      />
    </Tabs>
  );
}
