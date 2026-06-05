import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Image,
  Alert,
  useColorScheme,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../constants/colors';
import { formatPrice, formatDate, canReturnOrder } from '../utils/formatters';
import { useAppStore } from '../store/useAppStore';

export default function MyOrdersScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const router = useRouter();
  const { orders, returnOrder } = useAppStore();
  const insets = useSafeAreaInsets();

  const handleReturn = (orderId: string, orderNumber: string) => {
    Alert.alert('Return Acquisition', `Are you sure you want to return order ${orderNumber}?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Confirm Return',
        style: 'destructive',
        onPress: () => {
          returnOrder(orderId);
          Alert.alert(
            'Return Processed',
            'Our concierge team will contact you to schedule the collection.'
          );
        },
      },
    ]);
  };

  const getStatusBadgeStyle = (status: string) => {
    switch (status) {
      case 'Delivered':
        return { backgroundColor: '#E8F5E9' };
      case 'Processing':
        return { backgroundColor: '#FFF3E0' };
      case 'Returned':
        return { backgroundColor: '#FFEBEE' };
      default:
        return { backgroundColor: colors.gray100 };
    }
  };

  const getStatusTextStyle = (status: string) => {
    switch (status) {
      case 'Delivered':
        return { color: '#2E7D32' };
      case 'Processing':
        return { color: '#EF6C00' };
      case 'Returned':
        return { color: '#C62828' };
      default:
        return { color: colors.textMuted };
    }
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
          style={[styles.backBtn, { backgroundColor: colors.gray100 }]}
          onPress={() => router.back()}
        >
          <Feather name="arrow-left" size={22} color={colors.primary} />
        </Pressable>
        <View style={styles.headerCenter}>
          <Text style={[styles.headerTitle, { color: colors.primary }]}>MY ORDERS</Text>
          <View style={[styles.headerDivider, { backgroundColor: colors.accent }]} />
        </View>
        <View style={styles.backPlaceholder} />
      </View>

      <ScrollView
        contentContainerStyle={[{ paddingBottom: 40 + insets.bottom }]}
        showsVerticalScrollIndicator={false}
        bounces={true}
      >
        {/* Sub Header */}
        <View style={styles.subHeader}>
          <Text style={[styles.subTitle, { color: colors.text }]}>Order History</Text>
          <Text style={[styles.subText, { color: colors.textMuted }]}>
            View and manage your recent luxury acquisitions
          </Text>
          <View style={[styles.subDivider, { backgroundColor: colors.accent }]} />
        </View>

        {orders.length === 0 ? (
          <View style={styles.emptyContainer}>
            <View style={[styles.emptyIconCircle, { backgroundColor: colors.gray100 }]}>
              <Feather name="package" size={48} color={colors.accent} />
            </View>
            <Text style={[styles.emptyText, { color: colors.text }]}>No orders found</Text>
            <Text style={[styles.emptySubtext, { color: colors.textMuted }]}>
              You haven+{"'"}+t placed any acquisitions yet
            </Text>
            <Pressable
              style={[styles.emptyShopBtn, { backgroundColor: colors.accent }]}
              onPress={() => router.push('/')}
            >
              <Text style={[styles.emptyShopBtnText, { color: colors.primary }]}>
                START SHOPPING
              </Text>
            </Pressable>
          </View>
        ) : (
          <View style={styles.ordersList}>
            {orders.map(order => {
              const isEligibleForReturn = canReturnOrder(order);

              return (
                <View
                  key={order.id}
                  style={[
                    styles.orderCard,
                    { backgroundColor: colors.surface, borderColor: colors.gray200 },
                  ]}
                >
                  {/* Order Meta Header */}
                  <View style={[styles.cardHeader, { borderBottomColor: colors.gray200 }]}>
                    <View>
                      <Text style={[styles.orderNumber, { color: colors.text }]}>
                        {order.orderNumber}
                      </Text>
                      <Text style={[styles.orderDate, { color: colors.textMuted }]}>
                        Placed on {formatDate(order.orderDate)}
                      </Text>
                    </View>
                    <View style={[styles.statusBadge, getStatusBadgeStyle(order.status)]}>
                      <Text style={[styles.statusText, getStatusTextStyle(order.status)]}>
                        {order.status.toUpperCase()}
                      </Text>
                    </View>
                  </View>

                  {/* Order Items */}
                  <View style={styles.itemsList}>
                    {order.items.map((item, index) => (
                      <View
                        key={`${item.productId}-${index}`}
                        style={[styles.itemRow, { borderBottomColor: colors.gray100 }]}
                      >
                        <Image
                          source={{ uri: item.image }}
                          style={[styles.itemImage, { backgroundColor: colors.secondary }]}
                          resizeMode="cover"
                        />
                        <View style={styles.itemInfo}>
                          <Text
                            style={[styles.itemTitle, { color: colors.text }]}
                            numberOfLines={1}
                          >
                            {item.title}
                          </Text>
                          <Text style={[styles.itemMeta, { color: colors.textMuted }]}>
                            Qty: {item.quantity} • Size: {item.selectedSize}
                          </Text>
                          <Text style={[styles.itemMeta, { color: colors.textMuted }]}>
                            Color: {item.selectedColor}
                          </Text>
                        </View>
                        <Text style={[styles.itemPrice, { color: colors.text }]}>
                          {formatPrice(item.price * item.quantity)}
                        </Text>
                      </View>
                    ))}
                  </View>

                  {/* Address Display */}
                  <View style={[styles.addressSection, { borderBottomColor: colors.gray200 }]}>
                    <Text style={[styles.addressTitle, { color: colors.textMuted }]}>
                      DELIVERED TO
                    </Text>
                    <Text style={[styles.addressText, { color: colors.text }]}>
                      {order.shippingAddress}
                    </Text>
                  </View>

                  {/* Order Summary Row */}
                  <View style={styles.cardFooter}>
                    <View>
                      <Text style={[styles.totalLabel, { color: colors.textMuted }]}>
                        TOTAL AMOUNT
                      </Text>
                      <Text style={[styles.totalVal, { color: colors.accent }]}>
                        {formatPrice(order.totalAmount)}
                      </Text>
                    </View>

                    {/* Conditional Return Button */}
                    {isEligibleForReturn && (
                      <Pressable
                        style={[styles.returnBtn, { borderColor: colors.accent }]}
                        onPress={() => handleReturn(order.id, order.orderNumber)}
                      >
                        <Text style={[styles.returnBtnText, { color: colors.primary }]}>
                          REQUEST RETURN
                        </Text>
                      </Pressable>
                    )}
                  </View>
                </View>
              );
            })}
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerCenter: {
    alignItems: 'center',
  },
  headerTitle: {
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: 20,
    letterSpacing: 4,
  },
  headerDivider: {
    width: 30,
    height: 1,
    marginTop: 6,
  },
  backPlaceholder: {
    width: 40,
  },
  subHeader: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 20,
    alignItems: 'center',
  },
  subTitle: {
    fontFamily: 'PlayfairDisplay_600SemiBold',
    fontSize: 24,
    textAlign: 'center',
  },
  subText: {
    fontFamily: 'DMSans_400Regular',
    fontSize: 13,
    textAlign: 'center',
    marginTop: 6,
  },
  subDivider: {
    width: 40,
    height: 1.5,
    marginTop: 12,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
    paddingHorizontal: 32,
  },
  emptyIconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  emptyText: {
    fontFamily: 'PlayfairDisplay_600SemiBold',
    fontSize: 20,
    marginBottom: 8,
  },
  emptySubtext: {
    fontFamily: 'DMSans_400Regular',
    fontSize: 13,
    textAlign: 'center',
    marginBottom: 28,
    lineHeight: 20,
  },
  emptyShopBtn: {
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 25,
  },
  emptyShopBtnText: {
    fontFamily: 'DMSans_700Bold',
    fontSize: 12,
    letterSpacing: 1.2,
  },
  ordersList: {
    paddingHorizontal: 16,
    gap: 16,
  },
  orderCard: {
    borderRadius: 18,
    padding: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    borderBottomWidth: 1,
    paddingBottom: 14,
    marginBottom: 8,
  },
  orderNumber: {
    fontFamily: 'DMSans_700Bold',
    fontSize: 14,
    letterSpacing: 0.5,
  },
  orderDate: {
    fontFamily: 'DMSans_400Regular',
    fontSize: 11,
    marginTop: 4,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  statusText: {
    fontFamily: 'DMSans_700Bold',
    fontSize: 10,
    letterSpacing: 0.8,
  },
  itemsList: {
    marginVertical: 8,
    gap: 12,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
  },
  itemImage: {
    width: 60,
    height: 70,
    borderRadius: 10,
  },
  itemInfo: {
    flex: 1,
    marginLeft: 14,
  },
  itemTitle: {
    fontFamily: 'PlayfairDisplay_600SemiBold',
    fontSize: 14,
    marginBottom: 4,
  },
  itemMeta: {
    fontFamily: 'DMSans_400Regular',
    fontSize: 10,
    lineHeight: 14,
  },
  itemPrice: {
    fontFamily: 'DMSans_700Bold',
    fontSize: 13,
    marginLeft: 12,
  },
  addressSection: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    marginTop: 4,
  },
  addressTitle: {
    fontFamily: 'DMSans_700Bold',
    fontSize: 9,
    letterSpacing: 1.2,
    marginBottom: 6,
  },
  addressText: {
    fontFamily: 'DMSans_400Regular',
    fontSize: 12,
    lineHeight: 18,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 14,
    marginTop: 4,
  },
  totalLabel: {
    fontFamily: 'DMSans_700Bold',
    fontSize: 9,
    letterSpacing: 1.2,
    marginBottom: 4,
  },
  totalVal: {
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: 18,
  },
  returnBtn: {
    borderWidth: 1.5,
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: 'transparent',
  },
  returnBtnText: {
    fontFamily: 'DMSans_700Bold',
    fontSize: 11,
    letterSpacing: 0.8,
  },
});
