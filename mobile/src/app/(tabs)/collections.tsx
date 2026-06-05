import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, useColorScheme } from 'react-native';
import { Colors } from '../../constants/colors';
import { ProductCard } from '../../components/ProductCard';
import { ProductGridSkeleton } from '../../components/SkeletonLoader';
import { useAppStore } from '../../store/useAppStore';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const CATEGORIES = ['All', 'Footwear', 'Apparel', 'Watches', 'Accessories', 'Fragrance'];
const BRANDS = ['All', 'Nike', 'Aurelia Paris', 'Maison M', "L'Heure", 'Studio Core'];

export default function CollectionsScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { products } = useAppStore();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedBrand, setSelectedBrand] = useState('All');
  const [isLoading, setIsLoading] = useState(true);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, [selectedCategory, selectedBrand]);

  const filteredProducts = products.filter(product => {
    const categoryMatch =
      selectedCategory === 'All' ||
      product.category.toLowerCase() === selectedCategory.toLowerCase() ||
      (selectedCategory === 'Accessories' && product.category.toLowerCase() === 'bags');
    const brandMatch =
      selectedBrand === 'All' || product.brand.toLowerCase() === selectedBrand.toLowerCase();
    return categoryMatch && brandMatch;
  });

  const getResultCount = () => {
    if (selectedCategory === 'All' && selectedBrand === 'All') return 'All Products';
    if (selectedCategory !== 'All' && selectedBrand !== 'All')
      return `${filteredProducts.length} items in ${selectedCategory} · ${selectedBrand}`;
    if (selectedCategory !== 'All')
      return `${filteredProducts.length} items in ${selectedCategory}`;
    return `${filteredProducts.length} items from ${selectedBrand}`;
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 + insets.bottom }}
        bounces={true}
      >
        {/* Header */}
        <View
          style={[
            styles.header,
            { backgroundColor: colors.background, paddingTop: insets.top + 20 },
          ]}
        >
          <Text style={[styles.headerTitle, { color: colors.primary }]}>COLLECTIONS</Text>
          <View style={[styles.headerDivider, { backgroundColor: colors.accent }]} />
          <Text style={[styles.headerSub, { color: colors.textMuted }]}>
            Curated catalog of luxury acquisitions
          </Text>
        </View>

        {/* Filter Section */}
        <View
          style={[
            styles.filterSection,
            {
              backgroundColor: colors.surface,
              borderTopColor: colors.gray200,
              borderBottomColor: colors.gray200,
            },
          ]}
        >
          <View style={styles.filterHeader}>
            <Text style={[styles.filterTitle, { color: colors.textMuted }]}>REFINE BY</Text>
            <View style={[styles.filterDivider, { backgroundColor: colors.accent }]} />
          </View>

          {/* Categories */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterScrollContainer}
            decelerationRate="fast"
          >
            {CATEGORIES.map(cat => {
              const isSelected = selectedCategory === cat;
              return (
                <Pressable
                  key={cat}
                  style={[
                    styles.filterChip,
                    { backgroundColor: colors.gray100 },
                    isSelected && [
                      { backgroundColor: colors.surface, borderColor: colors.primary },
                    ],
                  ]}
                  onPress={() => setSelectedCategory(cat)}
                >
                  <Text
                    style={[
                      styles.filterChipText,
                      { color: colors.text },
                      isSelected && [styles.filterChipTextActive, { color: colors.accent }],
                    ]}
                  >
                    {cat.toUpperCase()}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>

          {/* Brands */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterScrollContainer}
            decelerationRate="fast"
          >
            {BRANDS.map(br => {
              const isSelected = selectedBrand === br;
              return (
                <Pressable
                  key={br}
                  style={[
                    styles.filterChip,
                    { backgroundColor: colors.gray100 },
                    isSelected && [
                      { backgroundColor: colors.surface, borderColor: colors.primary },
                    ],
                  ]}
                  onPress={() => setSelectedBrand(br)}
                >
                  <Text
                    style={[
                      styles.filterChipText,
                      { color: colors.text },
                      isSelected && [styles.filterChipTextActive, { color: colors.accent }],
                    ]}
                  >
                    {br}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>

          {/* Results Counter */}
          <View style={[styles.resultInfo, { borderTopColor: colors.gray200 }]}>
            <Text style={[styles.resultText, { color: colors.textMuted }]}>{getResultCount()}</Text>
            {(selectedCategory !== 'All' || selectedBrand !== 'All') && (
              <Pressable
                style={[styles.resetButton, { backgroundColor: colors.accent }]}
                onPress={() => {
                  setSelectedCategory('All');
                  setSelectedBrand('All');
                }}
              >
                <Text style={[styles.resetButtonText, { color: colors.primary }]}>RESET</Text>
              </Pressable>
            )}
          </View>
        </View>

        {/* Products Grid */}
        {isLoading ? (
          <View style={styles.skeletonContainer}>
            <ProductGridSkeleton />
          </View>
        ) : filteredProducts.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyTitle, { color: colors.text }]}>No matching items</Text>
            <Text style={[styles.emptySubtitle, { color: colors.textMuted }]}>
              Try adjusting your filters to find what you{`'`}re looking for
            </Text>
            <Pressable
              style={[styles.emptyResetBtn, { backgroundColor: colors.accent }]}
              onPress={() => {
                setSelectedCategory('All');
                setSelectedBrand('All');
              }}
            >
              <Text style={[styles.emptyResetBtnText, { color: colors.primary }]}>
                VIEW ALL PRODUCTS
              </Text>
            </Pressable>
          </View>
        ) : (
          <View style={styles.grid}>
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </View>
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
    letterSpacing: 1,
  },
  filterSection: {
    paddingVertical: 20,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    marginBottom: 8,
  },
  filterHeader: {
    alignItems: 'center',
    marginBottom: 16,
  },
  filterTitle: {
    fontFamily: 'DMSans_700Bold',
    fontSize: 10,
    letterSpacing: 2,
  },
  filterDivider: {
    width: 30,
    height: 1,
    marginTop: 8,
  },
  filterScrollContainer: {
    paddingHorizontal: 16,
    paddingVertical: 4,
    gap: 10,
  },
  filterChip: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: 'transparent',
    minWidth: 70,
    alignItems: 'center',
  },

  filterChipText: {
    fontFamily: 'DMSans_700Bold',
    fontSize: 11,
    letterSpacing: 0.8,
  },
  filterChipTextActive: {},
  resultInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 16,
    paddingTop: 12,
    borderTopWidth: 1,
  },
  resultText: {
    fontFamily: 'DMSans_600SemiBold',
    fontSize: 12,
    letterSpacing: 0.5,
  },
  resetButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  resetButtonText: {
    fontFamily: 'DMSans_700Bold',
    fontSize: 10,
    letterSpacing: 1,
  },
  skeletonContainer: {
    paddingTop: 16,
    paddingHorizontal: 16,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 16,
    rowGap: 20,
    columnGap: 12,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontFamily: 'PlayfairDisplay_600SemiBold',
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontFamily: 'DMSans_400Regular',
    fontSize: 13,
    textAlign: 'center',
    marginBottom: 28,
    lineHeight: 20,
  },
  emptyResetBtn: {
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 25,
  },
  emptyResetBtnText: {
    fontFamily: 'DMSans_700Bold',
    fontSize: 12,
    letterSpacing: 1.2,
  },
});
