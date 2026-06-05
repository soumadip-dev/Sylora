import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, useColorScheme } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '../../constants/colors';
import { ProductCard } from '../../components/ProductCard';
import { useAppStore } from '../../store/useAppStore';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { formatPrice } from '../../utils/formatters';

export default function WishlistScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const router = useRouter();
  const { wishlist, products } = useAppStore();
  const insets = useSafeAreaInsets();

  const wishlistedProducts = products.filter(product => wishlist.includes(product.id));

  const totalValue = wishlistedProducts.reduce((sum, product) => sum + product.price, 0);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: 100 + insets.bottom }]}
        bounces={true}
      >
        {/* Header */}
        <View
          style={[
            styles.header,
            { paddingTop: insets.top + 20, backgroundColor: colors.background },
          ]}
        >
          <Text style={[styles.headerTitle, { color: colors.primary }]}>WISHLIST</Text>
          <View style={[styles.headerDivider, { backgroundColor: colors.accent }]} />
          <Text style={[styles.headerSub, { color: colors.textMuted }]}>
            {wishlistedProducts.length}{' '}
            {wishlistedProducts.length === 1 ? 'curated piece' : 'curated pieces'} awaiting your
            collection
          </Text>
        </View>

        {wishlistedProducts.length === 0 ? (
          <View style={styles.emptyContainer}>
            <View
              style={[
                styles.emptyIconContainer,
                { backgroundColor: colors.surface, borderColor: colors.gray200 },
              ]}
            >
              <Text style={[styles.emptyIcon, { color: colors.accent }]}>♡</Text>
            </View>
            <Text style={[styles.emptyTitle, { color: colors.text }]}>Your wishlist is empty</Text>
            <Text style={[styles.emptySubtitle, { color: colors.textMuted }]}>
              Start adding items you love to your wishlist. Tap the heart icon on any product to
              save it here.
            </Text>
            <Pressable
              style={[styles.exploreBtn, { backgroundColor: colors.accent }]}
              onPress={() => router.push('/collections')}
            >
              <Text style={[styles.exploreBtnText, { color: colors.primary }]}>
                EXPLORE COLLECTIONS
              </Text>
            </Pressable>
          </View>
        ) : (
          <>
            {/* Wishlist Stats */}
            <View
              style={[
                styles.statsContainer,
                { backgroundColor: colors.surface, borderColor: colors.gray200 },
              ]}
            >
              <View style={styles.statCard}>
                <Text style={[styles.statNumber, { color: colors.primary }]}>
                  {wishlistedProducts.length}
                </Text>
                <Text style={[styles.statLabel, { color: colors.textMuted }]}>Items Saved</Text>
              </View>
              <View style={[styles.statDivider, { backgroundColor: colors.gray200 }]} />
              <View style={styles.statCard}>
                <Text style={[styles.statNumber, { color: colors.primary }]}>
                  {formatPrice(totalValue)}
                </Text>
                <Text style={[styles.statLabel, { color: colors.textMuted }]}>Total Value</Text>
              </View>
            </View>

            {/* Products Grid */}
            <View style={styles.grid}>
              {wishlistedProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingBottom: 24,
    alignItems: 'center',
  },
  headerTitle: {
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: 28,
    letterSpacing: 6,
  },
  headerDivider: {
    width: 50,
    height: 1.5,
    marginVertical: 12,
  },
  headerSub: {
    fontFamily: 'DMSans_400Regular',
    fontSize: 12,
    letterSpacing: 0.5,
    textAlign: 'center',
    paddingHorizontal: 24,
  },
  scrollContent: {
    flexGrow: 1,
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 20,
    marginBottom: 28,
    marginTop: 8,
    paddingVertical: 20,
    borderRadius: 16,
    borderWidth: 1,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: 22,
    marginBottom: 6,
  },
  statLabel: {
    fontFamily: 'DMSans_600SemiBold',
    fontSize: 11,
    letterSpacing: 0.8,
  },
  statDivider: {
    width: 1,
    height: 30,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    rowGap: 20,
    columnGap: 12,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingVertical: 60,
  },
  emptyIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  emptyIcon: {
    fontSize: 40,
  },
  emptyTitle: {
    fontFamily: 'PlayfairDisplay_600SemiBold',
    fontSize: 22,
    marginBottom: 12,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontFamily: 'DMSans_400Regular',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 22,
  },
  exploreBtn: {
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 25,
  },
  exploreBtnText: {
    fontFamily: 'DMSans_700Bold',
    fontSize: 12,
    letterSpacing: 1.2,
  },
});
