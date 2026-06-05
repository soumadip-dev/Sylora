import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, DimensionValue, useColorScheme } from 'react-native';
import { Colors } from '../constants/colors';

interface SkeletonProps {
  width?: DimensionValue;
  height?: DimensionValue;
  borderRadius?: number;
  style?: object;
}

export const SkeletonItem: React.FC<SkeletonProps> = ({
  width = '100%',
  height = 20,
  borderRadius = 4,
  style,
}) => {
  const pulseAnim = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 0.8,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0.3,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );
    pulse.start();

    return () => pulse.stop();
  }, [pulseAnim]);

  return (
    <Animated.View
      style={[
        styles.skeleton,
        {
          width,
          height,
          borderRadius,
          opacity: pulseAnim,
        },
        style,
      ]}
    />
  );
};

export const ProductCardSkeleton: React.FC = () => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  return (
    <View style={[styles.card, { backgroundColor: colors.surface }]}>
      {/* Product Image placeholder */}
      <SkeletonItem width="100%" height={220} borderRadius={16} style={styles.imagePlaceholder} />
      {/* Brand name */}
      <SkeletonItem width={80} height={12} borderRadius={4} style={styles.brandPlaceholder} />
      {/* Title */}
      <SkeletonItem width="80%" height={18} borderRadius={4} style={styles.titlePlaceholder} />
      {/* Price */}
      <SkeletonItem width={60} height={16} borderRadius={4} style={styles.pricePlaceholder} />
    </View>
  );
};

export const ProductGridSkeleton: React.FC = () => {
  return (
    <View style={styles.gridContainer}>
      <View style={styles.row}>
        <View style={styles.col}>
          <ProductCardSkeleton />
        </View>
        <View style={styles.col}>
          <ProductCardSkeleton />
        </View>
      </View>
      <View style={styles.row}>
        <View style={styles.col}>
          <ProductCardSkeleton />
        </View>
        <View style={styles.col}>
          <ProductCardSkeleton />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  skeleton: {
    backgroundColor: '#E1E4E8',
  },
  card: {
    borderRadius: 16,
    padding: 12,
    marginVertical: 8,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 3,
    alignItems: 'center',
  },
  imagePlaceholder: {
    marginBottom: 12,
  },
  brandPlaceholder: {
    marginBottom: 8,
  },
  titlePlaceholder: {
    marginBottom: 8,
  },
  pricePlaceholder: {
    marginBottom: 4,
  },
  gridContainer: {
    paddingHorizontal: 16,
    width: '100%',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  col: {
    width: '48%',
  },
});

export default SkeletonItem;
