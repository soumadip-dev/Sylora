import React from 'react';
import { View, Text, StyleSheet, Image, Pressable, useColorScheme } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { CartItem } from '../types';
import { Colors } from '../constants/colors';
import { formatPrice } from '../utils/formatters';
import { useAppStore } from '../store/useAppStore';

interface CartItemTileProps {
  item: CartItem;
}

export const CartItemTile: React.FC<CartItemTileProps> = ({ item }) => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { updateCartQuantity, removeFromCart } = useAppStore();
  const { product, selectedSize, selectedColor, quantity } = item;

  const handleIncrement = () => {
    updateCartQuantity(item.id, quantity + 1);
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      updateCartQuantity(item.id, quantity - 1);
    } else {
      removeFromCart(item.id);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.surface }]}>
      {/* Item Image */}
      <Image
        source={{ uri: product.image }}
        style={[styles.image, { backgroundColor: colors.secondary }]}
        resizeMode="cover"
      />

      {/* Item Details */}
      <View style={styles.detailsContainer}>
        <Text style={[styles.brand, { color: colors.textMuted }]}>
          {product.brand.toUpperCase()}
        </Text>
        <Text style={[styles.title, { color: colors.text }]} numberOfLines={1}>
          {product.title}
        </Text>

        {/* Selected Options */}
        <Text style={[styles.options, { color: colors.textMuted }]}>
          Size: {selectedSize} • Color: {selectedColor}
        </Text>

        <Text style={[styles.price, { color: colors.accent }]}>
          {formatPrice(product.price * quantity)}
        </Text>

        {/* Quantity Controls */}
        <View style={styles.bottomRow}>
          <View style={[styles.quantityControls, { borderColor: colors.outlineLight }]}>
            <Pressable style={styles.qtyBtn} onPress={handleDecrement}>
              <Feather name="minus" size={14} color={colors.primary} />
            </Pressable>
            <Text style={[styles.qtyText, { color: colors.text }]}>{quantity}</Text>
            <Pressable style={styles.qtyBtn} onPress={handleIncrement}>
              <Feather name="plus" size={14} color={colors.primary} />
            </Pressable>
          </View>
        </View>
      </View>

      {/* Remove Button */}
      <Pressable style={styles.removeBtn} onPress={() => removeFromCart(item.id)}>
        <Feather name="trash-2" size={18} color={colors.textMuted} />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 2,
    position: 'relative',
  },
  image: {
    width: 80,
    height: 96,
    borderRadius: 12,
  },
  detailsContainer: {
    flex: 1,
    marginLeft: 14,
    justifyContent: 'center',
  },
  brand: {
    fontFamily: 'DMSans_700Bold',
    fontSize: 9,
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  title: {
    fontFamily: 'PlayfairDisplay_600SemiBold',
    fontSize: 15,
    marginBottom: 4,
  },
  options: {
    fontFamily: 'DMSans_400Regular',
    fontSize: 12,
    marginBottom: 8,
  },
  price: {
    fontFamily: 'DMSans_700Bold',
    fontSize: 14,
    marginBottom: 8,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  qtyBtn: {
    padding: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  qtyText: {
    fontFamily: 'DMSans_700Bold',
    fontSize: 13,
    marginHorizontal: 12,
    textAlign: 'center',
  },
  removeBtn: {
    position: 'absolute',
    top: 12,
    right: 12,
    padding: 6,
  },
});

export default CartItemTile;
