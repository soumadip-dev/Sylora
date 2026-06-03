import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  Pressable,
  Dimensions,
  Alert,
  useColorScheme,
} from 'react-native';
import { useLocalSearchParams, useRouter, Href } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../constants/colors';
import { formatPrice } from '../../utils/formatters';
import { useAppStore } from '../../store/useAppStore';
import { Product } from '../../types';

const { width } = Dimensions.get('window');

export default function ProductDetailsScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { products, addToCart, wishlist, toggleWishlist } = useAppStore();
  const insets = useSafeAreaInsets();

  const product = products.find((p: Product) => p.id === id);

  const [selectedColor, setSelectedColor] = useState(product?.colors?.[0] || 'Default');
  const [selectedSize, setSelectedSize] = useState(product?.sizes?.[0] || 'Standard');
  const [isAdded, setIsAdded] = useState(false);

  if (!product) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={[styles.errorContainer, { paddingTop: insets.top + 40 }]}>
          <View style={[styles.errorIconCircle, { backgroundColor: colors.gray100 }]}>
            <Feather name="shopping-bag" size={48} color={colors.accent} />
          </View>
          <Text style={[styles.errorTitle, { color: colors.text }]}>Product Not Found</Text>
          <Text style={[styles.errorSubtitle, { color: colors.textMuted }]}>
            The luxury piece you requested is unavailable
          </Text>
          <Pressable
            style={[styles.errorBackBtn, { backgroundColor: colors.accent }]}
            onPress={() => router.back()}
          >
            <Text style={[styles.errorBackBtnText, { color: colors.primary }]}>GO BACK</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  const isWishlisted = wishlist.includes(product.id);

  const relatedProducts = products
    .filter((p: Product) => p.category === product.category && p.id !== product.id)
    .slice(0, 3);

  const displayRelated =
    relatedProducts.length > 0
      ? relatedProducts
      : products
          .filter((p: Product) => p.id !== product.id && ['p10', 'p11', 'p12'].includes(p.id))
          .slice(0, 3);

  const handleAddToCart = () => {
    addToCart(product, selectedSize, selectedColor, 1);
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
      Alert.alert(
        'Added to Selection',
        `${product.title} (${selectedSize}, ${selectedColor}) has been added to your cart.`,
        [
          { text: 'Continue Shopping', style: 'cancel' },
          { text: 'Go to Cart', onPress: () => router.push('/(tabs)/cart') },
        ]
      );
    }, 300);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View
        style={[
          styles.header,
          {
            paddingTop: insets.top + 12,
            backgroundColor: colors.background,
            borderBottomColor: colors.gray200,
          },
        ]}
      >
        <Pressable
          style={[styles.iconBtn, { backgroundColor: colors.gray100 }]}
          onPress={() => router.back()}
        >
          <Feather name="arrow-left" size={22} color={colors.primary} />
        </Pressable>
        <View style={styles.headerCenter}>
          <Text style={[styles.headerTitle, { color: colors.primary }]}>
            {product.brand.toUpperCase()}
          </Text>
          <View style={[styles.headerDivider, { backgroundColor: colors.accent }]} />
        </View>
        <Pressable
          style={[styles.iconBtn, { backgroundColor: colors.gray100 }]}
          onPress={() => toggleWishlist(product.id)}
        >
          <Feather
            name="heart"
            size={22}
            color={isWishlisted ? colors.error : colors.primary}
            fill={isWishlisted ? colors.error : 'none'}
          />
        </Pressable>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[{ paddingBottom: 100 + insets.bottom }]}
        bounces={true}
      >
        {/* Product Image */}
        <View style={[styles.imageContainer, { backgroundColor: colors.secondary }]}>
          <Image source={{ uri: product.image }} style={styles.image} resizeMode="cover" />
        </View>

        {/* Product Info */}
        <View
          style={[
            styles.infoContainer,
            { borderBottomColor: colors.gray200, backgroundColor: colors.surface },
          ]}
        >
          <Text style={[styles.brandText, { color: colors.textMuted }]}>
            {product.brand.toUpperCase()}
          </Text>
          <Text style={[styles.titleText, { color: colors.text }]}>{product.title}</Text>
          <View style={[styles.priceDivider, { backgroundColor: colors.accent }]} />
          <Text style={[styles.priceText, { color: colors.accent }]}>
            {formatPrice(product.price)}
          </Text>
        </View>

        {/* Color Selection */}
        {product.colors && product.colors.length > 0 && (
          <View
            style={[
              styles.selectorSection,
              { backgroundColor: colors.surface, borderBottomColor: colors.gray200 },
            ]}
          >
            <View style={styles.sectionHeader}>
              <Text style={[styles.selectorTitle, { color: colors.textMuted }]}>COLOR</Text>
              <View style={[styles.sectionDivider, { backgroundColor: colors.accent }]} />
            </View>
            <View style={styles.colorsRow}>
              {product.colors.map((color: string) => {
                const isActive = selectedColor === color;
                return (
                  <Pressable
                    key={color}
                    style={[
                      styles.colorChip,
                      { borderColor: colors.gray200, backgroundColor: colors.surface },
                      isActive && [
                        styles.colorChipActive,
                        { borderColor: colors.primary, backgroundColor: colors.primary },
                      ],
                    ]}
                    onPress={() => setSelectedColor(color)}
                  >
                    <Text
                      style={[
                        styles.colorChipText,
                        { color: colors.text },
                        isActive && [styles.colorChipTextActive, { color: colors.accent }],
                      ]}
                    >
                      {color}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        )}

        {/* Size Selection */}
        {product.sizes && product.sizes.length > 0 && (
          <View
            style={[
              styles.selectorSection,
              { backgroundColor: colors.surface, borderBottomColor: colors.gray200 },
            ]}
          >
            <View style={styles.sectionHeader}>
              <Text style={[styles.selectorTitle, { color: colors.textMuted }]}>SIZE</Text>
              <View style={[styles.sectionDivider, { backgroundColor: colors.accent }]} />
            </View>
            <View style={styles.sizesRow}>
              {product.sizes.map((size: string) => {
                const isActive = selectedSize === size;
                return (
                  <Pressable
                    key={size}
                    style={[
                      styles.sizeChip,
                      { borderColor: colors.gray200, backgroundColor: colors.surface },
                      isActive && [
                        styles.sizeChipActive,
                        { borderColor: colors.primary, backgroundColor: colors.primary },
                      ],
                    ]}
                    onPress={() => setSelectedSize(size)}
                  >
                    <Text
                      style={[
                        styles.sizeChipText,
                        { color: colors.text },
                        isActive && [styles.sizeChipTextActive, { color: colors.accent }],
                      ]}
                    >
                      {size}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        )}

        {/* Description */}
        <View
          style={[
            styles.descSection,
            { backgroundColor: colors.surface, borderBottomColor: colors.gray200 },
          ]}
        >
          <View style={styles.sectionHeader}>
            <Text style={[styles.descTitle, { color: colors.textMuted }]}>CRAFTSMANSHIP</Text>
            <View style={[styles.sectionDivider, { backgroundColor: colors.accent }]} />
          </View>
          <Text style={[styles.descText, { color: colors.text }]}>{product.description}</Text>
        </View>

        {/* Related Products */}
        {displayRelated.length > 0 && (
          <View style={[styles.relatedSection, { backgroundColor: colors.surface }]}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.relatedTitle, { color: colors.text }]}>YOU MAY ALSO LIKE</Text>
              <View style={[styles.sectionDivider, { backgroundColor: colors.accent }]} />
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.relatedScrollContainer}
              decelerationRate="fast"
            >
              {displayRelated.map((item: Product) => (
                <Pressable
                  key={item.id}
                  style={styles.relatedItem}
                  onPress={() => router.push(`/product/${item.id}` as Href)}
                >
                  <Image
                    source={{ uri: item.image }}
                    style={[styles.relatedImg, { backgroundColor: colors.secondary }]}
                    resizeMode="cover"
                  />
                  <Text style={[styles.relatedBrand, { color: colors.textMuted }]}>
                    {item.brand.toUpperCase()}
                  </Text>
                  <Text style={[styles.relatedName, { color: colors.text }]} numberOfLines={1}>
                    {item.title}
                  </Text>
                  <Text style={[styles.relatedPrice, { color: colors.accent }]}>
                    {formatPrice(item.price)}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>
        )}
      </ScrollView>

      {/* Sticky Add to Cart Button */}
      <View
        style={[
          styles.stickyBar,
          {
            paddingBottom: insets.bottom + 16,
            backgroundColor: colors.surface,
            borderTopColor: colors.gray200,
          },
        ]}
      >
        <Pressable
          style={[
            styles.addToCartBtn,
            { backgroundColor: colors.accent },
            isAdded && [styles.addToCartBtnSuccess, { backgroundColor: colors.primary }],
          ]}
          onPress={handleAddToCart}
          disabled={isAdded}
        >
          {isAdded ? (
            <Text style={[styles.addToCartText, { color: colors.primary }]}>ADDING PIECE...</Text>
          ) : (
            <Text style={[styles.addToCartText, { color: colors.primary }]}>ADD TO SELECTION</Text>
          )}
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
  },
  headerCenter: {
    alignItems: 'center',
  },
  headerTitle: {
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: 18,
    letterSpacing: 3,
  },
  headerDivider: {
    width: 30,
    height: 1,
    marginTop: 6,
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageContainer: {
    width: width,
    height: width * 1.2,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  infoContainer: {
    padding: 28,
    alignItems: 'center',
    borderBottomWidth: 1,
  },
  brandText: {
    fontFamily: 'DMSans_700Bold',
    fontSize: 11,
    letterSpacing: 2.5,
    marginBottom: 10,
  },
  titleText: {
    fontFamily: 'PlayfairDisplay_600SemiBold',
    fontSize: 26,
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 34,
  },
  priceDivider: {
    width: 40,
    height: 1.5,
    marginBottom: 16,
  },
  priceText: {
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: 22,
  },
  selectorSection: {
    paddingVertical: 20,
    paddingHorizontal: 24,
    borderBottomWidth: 1,
  },
  sectionHeader: {
    alignItems: 'center',
    marginBottom: 16,
  },
  selectorTitle: {
    fontFamily: 'DMSans_700Bold',
    fontSize: 11,
    letterSpacing: 1.5,
  },
  sectionDivider: {
    width: 30,
    height: 1,
    marginTop: 8,
  },
  colorsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
  },
  colorChip: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 30,
    borderWidth: 1.5,
  },
  colorChipActive: {
    borderWidth: 1.5,
  },
  colorChipText: {
    fontFamily: 'DMSans_600SemiBold',
    fontSize: 12,
  },
  colorChipTextActive: {},
  sizesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
  },
  sizeChip: {
    width: 60,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1.5,
    alignItems: 'center',
  },
  sizeChipActive: {
    borderWidth: 1.5,
  },
  sizeChipText: {
    fontFamily: 'DMSans_700Bold',
    fontSize: 13,
  },
  sizeChipTextActive: {},
  descSection: {
    padding: 24,
    borderBottomWidth: 1,
  },
  descTitle: {
    fontFamily: 'DMSans_700Bold',
    fontSize: 11,
    letterSpacing: 1.5,
  },
  descText: {
    fontFamily: 'DMSans_400Regular',
    fontSize: 14,
    lineHeight: 24,
    textAlign: 'center',
  },
  relatedSection: {
    paddingVertical: 28,
    paddingHorizontal: 20,
  },
  relatedTitle: {
    fontFamily: 'PlayfairDisplay_600SemiBold',
    fontSize: 18,
    letterSpacing: 1,
  },
  relatedScrollContainer: {
    gap: 16,
    paddingHorizontal: 4,
  },
  relatedItem: {
    width: 130,
    alignItems: 'center',
  },
  relatedImg: {
    width: '100%',
    height: 150,
    borderRadius: 16,
    marginBottom: 10,
  },
  relatedBrand: {
    fontFamily: 'DMSans_700Bold',
    fontSize: 9,
    letterSpacing: 1,
    marginBottom: 4,
  },
  relatedName: {
    fontFamily: 'PlayfairDisplay_600SemiBold',
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 4,
  },
  relatedPrice: {
    fontFamily: 'DMSans_700Bold',
    fontSize: 11,
  },
  stickyBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingTop: 16,
    borderTopWidth: 1,
  },
  addToCartBtn: {
    borderRadius: 30,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addToCartBtnSuccess: {},
  addToCartText: {
    fontFamily: 'DMSans_700Bold',
    fontSize: 14,
    letterSpacing: 1.2,
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  errorIconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  errorTitle: {
    fontFamily: 'PlayfairDisplay_600SemiBold',
    fontSize: 22,
    marginBottom: 8,
  },
  errorSubtitle: {
    fontFamily: 'DMSans_400Regular',
    fontSize: 13,
    textAlign: 'center',
    marginBottom: 28,
    lineHeight: 20,
  },
  errorBackBtn: {
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 30,
  },
  errorBackBtnText: {
    fontFamily: 'DMSans_700Bold',
    fontSize: 12,
    letterSpacing: 1.2,
  },
});
