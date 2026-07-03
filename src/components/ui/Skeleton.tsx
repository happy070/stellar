import React, { useEffect } from 'react';
import { View, type ViewStyle } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { useTheme } from '@/theme/ThemeProvider';

interface SkeletonProps {
  width?: number | `${number}%`;
  height?: number;
  radius?: number;
  style?: ViewStyle;
}

/**
 * A single shimmering placeholder block. Uses a looping opacity pulse driven
 * on the UI thread by Reanimated, so skeletons stay smooth even while the JS
 * thread is busy resolving data.
 */
export function Skeleton({ width = '100%', height = 16, radius = 8, style }: SkeletonProps) {
  const { colors } = useTheme();
  const progress = useSharedValue(0.4);

  useEffect(() => {
    progress.value = withRepeat(
      withTiming(1, { duration: 900, easing: Easing.inOut(Easing.ease) }),
      -1,
      true,
    );
  }, [progress]);

  const animatedStyle = useAnimatedStyle(() => ({ opacity: progress.value }));

  return (
    <Animated.View
      style={[
        { width, height, borderRadius: radius, backgroundColor: colors.skeletonBase },
        animatedStyle,
        style,
      ]}
    />
  );
}

/** Convenience wrapper to stack skeleton lines with consistent gaps. */
export function SkeletonGroup({
  children,
  gap = 8,
  style,
}: {
  children: React.ReactNode;
  gap?: number;
  style?: ViewStyle;
}) {
  return <View style={[{ gap }, style]}>{children}</View>;
}
