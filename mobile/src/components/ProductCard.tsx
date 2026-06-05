import React from 'react';
import { View, Text, StyleSheet, Image, Pressable, Dimensions, useColorScheme } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter, Href } from 'expo-router';
import { Product } from '../types';
import { Colors } from '../constants/colors';
import { formatPrice } from '../utils/formatters';
import { useAppStore } from '../store/useAppStore';

interface ProductCardProps {
  product: Product;
}

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2; // Two columns with gutters

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const router = useRouter();
  const { wishlist, toggleWishlist } = useAppStore();
  const isWishlisted = wishlist.includes(product.id);

  const handlePress = () => {
    router.push(`/product/${product.id}` as Href);
  };

  return (
    <Pressable style={[styles.card, { backgroundColor: colors.surface }]} onPress={handlePress}>
      {/* Product Image */}
      <View style={[styles.imageContainer, { backgroundColor: colors.secondary }]}>
        <Image source={{ uri: product.image }} style={styles.image} resizeMode="cover" />
        {/* Wishlist Button */}
        <Pressable
          style={[styles.wishlistButton, { backgroundColor: colors.surface }]}
          onPress={() => toggleWishlist(product.id)}
        >
          <Feather
            name="heart"
            size={18}
            color={isWishlisted ? colors.error : colors.primary}
            style={isWishlisted ? styles.filledHeart : null}
          />
        </Pressable>

        {/* Exclusive Badge */}
        {product.isExclusive && (
          <View style={[styles.badge, { backgroundColor: colors.primary }]}>
            <Text style={[styles.badgeText, { color: colors.accent }]}>EXCLUSIVE</Text>
          </View>
        )}
      </View>

      {/* Product Details */}
      <View style={styles.detailsContainer}>
        <Text style={[styles.brand, { color: colors.textMuted }]}>
          {product.brand.toUpperCase()}
        </Text>
        <Text style={[styles.title, { color: colors.text }]} numberOfLines={1}>
          {product.title}
        </Text>
        <Text style={[styles.price, { color: colors.accent }]}>{formatPrice(product.price)}</Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    marginBottom: 16,
    width: CARD_WIDTH,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 3,
    overflow: 'hidden',
  },
  imageContainer: {
    height: 200,
    width: '100%',
    position: 'relative',
  },
  image: {
    height: '100%',
    width: '100%',
  },
  wishlistButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    borderRadius: 999,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  filledHeart: {
    backgroundColor: 'transparent',
  },
  badge: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
  },
  badgeText: {
    fontFamily: 'DMSans_700Bold',
    fontSize: 8,
    letterSpacing: 1,
  },
  detailsContainer: {
    padding: 12,
    alignItems: 'center',
  },
  brand: {
    fontFamily: 'DMSans_700Bold',
    fontSize: 9,
    letterSpacing: 1,
    marginBottom: 4,
  },
  title: {
    fontFamily: 'PlayfairDisplay_600SemiBold',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 6,
  },
  price: {
    fontFamily: 'DMSans_700Bold',
    fontSize: 13,
  },
});

export default ProductCard;
