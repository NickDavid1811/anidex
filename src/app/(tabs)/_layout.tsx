import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAppTheme } from '@/context/theme-context';

export default function TabLayout() {
  const { activeScheme } = useAppTheme();
  const insets = useSafeAreaInsets();
  const isDark = activeScheme === 'dark';

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#F47521',
        tabBarInactiveTintColor: isDark ? '#71717A' : '#94A3B8',
        tabBarStyle: {
          backgroundColor: isDark ? '#141822' : '#FFFFFF',
          borderTopColor: isDark ? '#232938' : '#E5E7EB',
          borderTopWidth: 1,
          height: Platform.OS === 'ios' ? 56 + insets.bottom : 62 + insets.bottom,
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
          marginBottom: 4,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Tendencias',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'flame' : 'flame-outline'}
              size={23}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: 'Buscar',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'search' : 'search-outline'}
              size={23}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Ajustes',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'settings' : 'settings-outline'}
              size={23}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
