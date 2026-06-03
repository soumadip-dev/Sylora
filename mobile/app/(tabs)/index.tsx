import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Dimensions,
  ImageBackground,
  Alert,
  useColorScheme,
} from 'react-native';
import { useRouter } from 'expo-router';
import * as Clipboard from 'expo-clipboard';
import { Colors } from '../../constants/colors';
import { ProductCard } from '../../components/ProductCard';
import { useAppStore } from '../../store/useAppStore';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

interface CollectionItem {
  id: string;
  title: string;
  image: string;
}

interface CouponItem {
  id: string;
  discount: string;
  code: string;
}

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const router = useRouter();
  const { products } = useAppStore();
  const insets = useSafeAreaInsets();

  const latestArrivals = products.filter(p => ['p1', 'p2', 'p3', 'p4'].includes(p.id));

  const collections: CollectionItem[] = [
    {
      id: 'c1',
      title: 'Electronics',
      image:
        'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=400&q=80',
    },
    {
      id: 'c2',
      title: 'Kids',
      image:
        'https://images.unsplash.com/photo-1519457431-44ccd64a579b?auto=format&fit=crop&w=400&q=80',
    },
    {
      id: 'c3',
      title: 'Laptops',
      image:
        'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    },
    {
      id: 'c4',
      title: 'Men',
      image:
        'https://images.unsplash.com/photo-1488161628813-04466f872be2?auto=format&fit=crop&w=400&q=80',
    },
  ];

  const coupons: CouponItem[] = [
    { id: 'co1', discount: '10% OFF', code: 'CODE10' },
    { id: 'co2', discount: '20% OFF', code: 'CODE20' },
    { id: 'co3', discount: '30% OFF', code: 'CODE30' },
    { id: 'co4', discount: '40% OFF', code: 'CODE40' },
  ];

  const handleCopyCoupon = async (code: string) => {
    await Clipboard.setStringAsync(code);
    Alert.alert('Coupon Copied', `Code "${code}" has been copied to your clipboard!`);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        contentContainerStyle={[{ paddingBottom: 100 + insets.bottom }]}
        showsVerticalScrollIndicator={false}
        bounces={true}
      >
        {/* Header */}
        <View
          style={[
            styles.header,
            { paddingTop: insets.top + 16, backgroundColor: colors.background },
          ]}
        >
          <Text style={[styles.headerTitle, { color: colors.primary }]}>SYLORA</Text>
          <View style={[styles.headerDivider, { backgroundColor: colors.accent }]} />
          <Text style={[styles.headerSub, { color: colors.textMuted }]}>LUXURY MINIMALISM</Text>
        </View>

        {/* Hero Section */}
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          style={styles.heroScroll}
          decelerationRate="fast"
        >
          <View style={styles.heroSlide}>
            <ImageBackground
              source={{
                uri: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=800&q=80',
              }}
              style={styles.heroBg}
              imageStyle={styles.heroBgImage}
            >
              <View style={styles.heroOverlay}>
                <Text style={[styles.heroLabel, { color: colors.accent }]}>NEW ARRIVALS</Text>
                <Text style={[styles.heroTitleText, { color: colors.secondary }]}>
                  The Autumn Lookbook
                </Text>
                <Text style={[styles.heroSubText, { color: '#D1E4FF' }]}>
                  Discover the essence of modern luxury in our latest curated collection.
                </Text>
                <Pressable
                  style={[styles.heroBtn, { backgroundColor: colors.accent }]}
                  onPress={() => router.push('/collections')}
                >
                  <Text style={[styles.heroBtnText, { color: colors.primary }]}>VIEW LATEST</Text>
                </Pressable>
              </View>
            </ImageBackground>
          </View>

          <View style={styles.heroSlide}>
            <ImageBackground
              source={{
                uri: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80',
              }}
              style={styles.heroBg}
              imageStyle={styles.heroBgImage}
            >
              <View style={styles.heroOverlay}>
                <Text style={[styles.heroLabel, { color: colors.accent }]}>SEASONAL OFFER</Text>
                <Text style={[styles.heroTitleText, { color: colors.secondary }]}>
                  Up to 50% Off
                </Text>
                <Text style={[styles.heroSubText, { color: '#D1E4FF' }]}>
                  Seasonal favorites curated for the discerning palette, now within reach.
                </Text>
                <Pressable
                  style={[styles.heroBtn, { backgroundColor: colors.accent }]}
                  onPress={() => router.push('/collections')}
                >
                  <Text style={[styles.heroBtnText, { color: colors.primary }]}>EXPLORE SALE</Text>
                </Pressable>
              </View>
            </ImageBackground>
          </View>
        </ScrollView>

        {/* Curated Collections */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Curated Collections</Text>
          <View style={[styles.divider, { backgroundColor: colors.accent }]} />
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.collectionsScrollContainer}
          style={styles.collectionsScroll}
          decelerationRate="fast"
        >
          {collections.map(item => (
            <Pressable
              key={item.id}
              style={styles.collectionCard}
              onPress={() => router.push('/collections')}
            >
              <ImageBackground
                source={{ uri: item.image }}
                style={styles.collectionBg}
                imageStyle={styles.collectionImage}
              >
                <View style={styles.collectionOverlay}>
                  <Text style={[styles.collectionName, { color: '#FFFFFF' }]}>
                    {item.title.toUpperCase()}
                  </Text>
                  <Text style={[styles.collectionLink, { color: colors.accent }]}>BROWSE →</Text>
                </View>
              </ImageBackground>
            </Pressable>
          ))}
        </ScrollView>

        {/* Exclusive Offers */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Exclusive Offers</Text>
          <View style={[styles.divider, { backgroundColor: colors.accent }]} />
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.couponsScrollContainer}
          style={styles.couponsScroll}
          decelerationRate="fast"
        >
          {coupons.map(item => (
            <Pressable
              key={item.id}
              style={styles.couponCard}
              onPress={() => handleCopyCoupon(item.code)}
            >
              <View style={styles.couponLeft}>
                <Text style={[styles.couponDiscount, { color: colors.primary }]}>
                  {item.discount}
                </Text>
                <Text style={[styles.couponTapText, { color: colors.textMuted }]}>Tap to copy</Text>
              </View>
              <View style={styles.couponDashedLine} />
              <View style={styles.couponRight}>
                <Text style={[styles.couponCode, { color: colors.accent }]}>{item.code}</Text>
              </View>
            </Pressable>
          ))}
        </ScrollView>

        {/* Latest Arrivals */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Latest Arrivals</Text>
          <Text style={[styles.sectionSubtitle, { color: colors.textMuted }]}>
            The very best from around the world
          </Text>
          <View style={[styles.divider, { backgroundColor: colors.accent }]} />
        </View>

        <View style={styles.grid}>
          {latestArrivals.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </View>
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
    fontSize: 32,
    letterSpacing: 8,
  },
  headerDivider: {
    width: 60,
    height: 1,
    marginVertical: 12,
  },
  headerSub: {
    fontFamily: 'DMSans_700Bold',
    fontSize: 10,
    letterSpacing: 2.5,
  },
  heroScroll: {
    height: 420,
    marginBottom: 40,
  },
  heroSlide: {
    width: width,
    paddingHorizontal: 16,
  },
  heroBg: {
    flex: 1,
    height: '100%',
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  heroBgImage: {
    borderRadius: 20,
  },
  heroOverlay: {
    backgroundColor: 'rgba(13, 27, 42, 0.55)',
    borderRadius: 20,
    padding: 28,
    justifyContent: 'flex-end',
    height: '100%',
  },
  heroLabel: {
    fontFamily: 'DMSans_700Bold',
    fontSize: 11,
    letterSpacing: 2.5,
    marginBottom: 10,
  },
  heroTitleText: {
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: 28,
    marginBottom: 10,
    lineHeight: 34,
  },
  heroSubText: {
    fontFamily: 'DMSans_400Regular',
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 20,
    opacity: 0.9,
  },
  heroBtn: {
    alignSelf: 'flex-start',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
  },
  heroBtnText: {
    fontFamily: 'DMSans_700Bold',
    fontSize: 12,
    letterSpacing: 1.2,
  },
  sectionHeader: {
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  sectionTitle: {
    fontFamily: 'PlayfairDisplay_600SemiBold',
    fontSize: 24,
    textAlign: 'center',
  },
  sectionSubtitle: {
    fontFamily: 'DMSans_400Regular',
    fontSize: 13,
    textAlign: 'center',
    marginTop: 6,
  },
  divider: {
    width: 45,
    height: 1.5,
    marginTop: 12,
  },
  collectionsScroll: {
    marginBottom: 40,
  },
  collectionsScrollContainer: {
    paddingHorizontal: 16,
    gap: 14,
  },
  collectionCard: {
    width: 150,
    height: 200,
    borderRadius: 18,
    overflow: 'hidden',
  },
  collectionBg: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  collectionImage: {
    borderRadius: 18,
  },
  collectionOverlay: {
    backgroundColor: 'rgba(13, 27, 42, 0.5)',
    padding: 14,
    height: '100%',
    justifyContent: 'flex-end',
  },
  collectionName: {
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: 15,
    letterSpacing: 1.2,
    marginBottom: 6,
  },
  collectionLink: {
    fontFamily: 'DMSans_700Bold',
    fontSize: 10,
    letterSpacing: 1.2,
  },
  couponsScroll: {
    marginBottom: 40,
  },
  couponsScrollContainer: {
    paddingHorizontal: 16,
    gap: 14,
  },
  couponCard: {
    flexDirection: 'row',
    width: 260,
    height: 85,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#EEEEEE',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 1,
    overflow: 'hidden',
  },
  couponLeft: {
    flex: 1.3,
    paddingLeft: 18,
    justifyContent: 'center',
  },
  couponDiscount: {
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: 18,
  },
  couponTapText: {
    fontFamily: 'DMSans_400Regular',
    fontSize: 10,
    marginTop: 4,
  },
  couponDashedLine: {
    height: '60%',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderStyle: 'dashed',
  },
  couponRight: {
    flex: 1,
    backgroundColor: '#F8F8F8',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  couponCode: {
    fontFamily: 'DMSans_700Bold',
    fontSize: 13,
    letterSpacing: 0.8,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    rowGap: 20,
    columnGap: 12,
  },
});
