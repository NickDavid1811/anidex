import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useFavorites } from '@/context/favorites-context';
import { useAppTheme } from '@/context/theme-context';

interface TabIconProps {
  name: keyof typeof Ionicons.glyphMap;
  focusedName: keyof typeof Ionicons.glyphMap;
  focused: boolean;
  isDark: boolean;
  badge?: number;
}

function TabPillIcon({ name, focusedName, focused, isDark, badge }: TabIconProps) {
  return (
    <View
      style={{
        backgroundColor: focused
          ? isDark
            ? '#58392B'
            : '#FFDCC2'
          : 'transparent',
        borderRadius: 16,
        paddingHorizontal: 16,
        paddingVertical: 3,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
      }}>
      <Ionicons
        name={focused ? focusedName : name}
        size={22}
        color={
          focused
            ? isDark
              ? '#FFDCC2'
              : '#351A08'
            : isDark
            ? '#A89C94'
            : '#776962'
        }
      />
      {badge !== undefined && badge > 0 && (
        <View
          style={{
            position: 'absolute',
            top: -2,
            right: 8,
            backgroundColor: '#D32F2F',
            borderRadius: 9,
            minWidth: 16,
            height: 16,
            alignItems: 'center',
            justifyContent: 'center',
            paddingHorizontal: 3,
          }}>
          <Text style={{ color: '#FFFFFF', fontSize: 9, fontWeight: 'bold' }}>
            {badge}
          </Text>
        </View>
      )}
    </View>
  );
}

export default function TabLayout() {
  const { activeScheme } = useAppTheme();
  const { count: favoritesCount } = useFavorites();
  const insets = useSafeAreaInsets();
  const isDark = activeScheme === 'dark';

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: isDark ? '#FFDCC2' : '#351A08',
        tabBarInactiveTintColor: isDark ? '#A89C94' : '#776962',
        tabBarStyle: {
          backgroundColor: isDark ? '#221A16' : '#FFFFFF',
          borderTopColor: isDark ? '#3E3028' : '#D8CDC5',
          borderTopWidth: 1,
          height: Platform.OS === 'ios' ? 60 + insets.bottom : 68 + insets.bottom,
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
          fontWeight: '700',
          marginTop: 2,
        },
      }}>
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
              badge={favoritesCount}
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
