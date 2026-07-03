import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useMemo } from 'react';
import { Platform, StyleSheet } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';
import { HomeScreen } from '@/screens/HomeScreen';
import { SearchScreen } from '@/screens/SearchScreen';
import { ProfileScreen } from '@/screens/ProfileScreen';
import type { TabParamList } from './types';

const Tab = createBottomTabNavigator<TabParamList>();

type IconName = keyof typeof Ionicons.glyphMap;

const ICONS: Record<keyof TabParamList, [IconName, IconName]> = {
  Home: ['home', 'home-outline'],
  Search: ['search', 'search-outline'],
  Profile: ['person', 'person-outline'],
};

export function TabNavigator() {
  const { colors } = useTheme();

  const screenOptions = useMemo(
    () =>
      ({ route }: { route: { name: keyof TabParamList } }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          borderTopWidth: StyleSheet.hairlineWidth,
          height: Platform.OS === 'ios' ? 88 : 64,
          paddingBottom: Platform.OS === 'ios' ? 28 : 8,
          paddingTop: 10,
        },
        tabBarLabelStyle: {
          fontSize: 10.5,
          fontWeight: '600' as const,
          letterSpacing: 0.2,
        },
        tabBarIcon: ({ color, size, focused }: { color: string; size: number; focused: boolean }) => {
          const [active, inactive] = ICONS[route.name];
          return <Ionicons name={focused ? active : inactive} size={size} color={color} />;
        },
      }),
    [colors],
  );

  return (
    <Tab.Navigator screenOptions={screenOptions}>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Search" component={SearchScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
