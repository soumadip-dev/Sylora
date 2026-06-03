import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  ActivityIndicator,
  TextInput,
  Modal,
  useColorScheme,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '../../constants/colors';
import { CartItemTile } from '../../components/CartItemTile';
import { formatPrice } from '../../utils/formatters';
import { useAppStore } from '../../store/useAppStore';
import { Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function CartScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const router = useRouter();
  const { cart, placeOrder } = useAppStore();
  const insets = useSafeAreaInsets();

  const [shippingAddress, setShippingAddress] = useState(
    'Aditya Sharma, 12th Floor, Skyline Towers, Mumbai 400001'
  );
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [addressInput, setAddressInput] = useState(shippingAddress);

  const [isPaying, setIsPaying] = useState(false);
  const [paymentStep, setPaymentStep] = useState<'idle' | 'loading' | 'success'>('idle');

  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const gstTax = Math.round(subtotal * 0.18);
  const shippingCharge = subtotal > 50000 ? 0 : 500;
  const totalAmount = subtotal + gstTax + shippingCharge;

  const handleSaveAddress = () => {
    setShippingAddress(addressInput);
    setIsEditingAddress(false);
  };

  const handleCheckout = () => {
    if (cart.length === 0) return;

    setIsPaying(true);
    setPaymentStep('loading');

    setTimeout(() => {
      setPaymentStep('success');
      setTimeout(() => {
        placeOrder();
        setIsPaying(false);
        setPaymentStep('idle');
        router.push('/order-success');
      }, 1000);
    }, 2000);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[{ paddingBottom: insets.bottom + 220 }]}
        bounces={true}
      >
        {/* Header */}
        <View
          style={[
            styles.header,
            { paddingTop: insets.top + 20, backgroundColor: colors.background },
          ]}
        >
          <Text style={[styles.headerTitle, { color: colors.primary }]}>MY CART</Text>
          <View style={[styles.headerDivider, { backgroundColor: colors.accent }]} />
          <Text style={[styles.headerSub, { color: colors.textMuted }]}>
            {cart.length} {cart.length === 1 ? 'item' : 'items'} in your selection
          </Text>
        </View>

        {cart.length === 0 ? (
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconWrapper}>
              <Feather name="shopping-bag" size={56} color={colors.textMuted} />
            </View>
            <Text style={[styles.emptyTitle, { color: colors.text }]}>Your cart is empty</Text>
            <Text style={[styles.emptySubtitle, { color: colors.textMuted }]}>
              Discover our curated collection of luxury pieces
            </Text>
            <Pressable
              style={[styles.emptyExploreBtn, { backgroundColor: colors.accent }]}
              onPress={() => router.push('/collections')}
            >
              <Text style={[styles.emptyExploreBtnText, { color: colors.primary }]}>
                EXPLORE COLLECTIONS →
              </Text>
            </Pressable>
          </View>
        ) : (
          <>
            {/* Cart Items */}
            <View style={styles.itemsSection}>
              <View style={styles.sectionHeader}>
                <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>
                  SELECTED PIECES
                </Text>
                <View style={[styles.sectionDivider, { backgroundColor: colors.accent }]} />
              </View>
              {cart.map(item => (
                <CartItemTile key={item.id} item={item} />
              ))}
            </View>

            {/* Delivery Address */}
            <View
              style={[
                styles.addressCard,
                { backgroundColor: colors.surface, borderColor: colors.gray200 },
              ]}
            >
              <View style={styles.addressHeader}>
                <Text style={[styles.cardLabel, { color: colors.textMuted }]}>
                  DELIVERY ADDRESS
                </Text>
                <Pressable
                  onPress={() => {
                    setAddressInput(shippingAddress);
                    setIsEditingAddress(true);
                  }}
                >
                  <Text style={[styles.editLink, { color: colors.accent }]}>EDIT</Text>
                </Pressable>
              </View>

              {isEditingAddress ? (
                <View style={styles.editAddressContainer}>
                  <TextInput
                    style={[
                      styles.addressInput,
                      {
                        color: colors.text,
                        borderColor: colors.gray200,
                        backgroundColor: colors.background,
                      },
                    ]}
                    value={addressInput}
                    onChangeText={setAddressInput}
                    multiline
                    numberOfLines={3}
                    placeholderTextColor={colors.textMuted}
                  />
                  <View style={styles.editBtnRow}>
                    <Pressable
                      style={[
                        styles.miniBtn,
                        styles.cancelBtn,
                        { backgroundColor: colors.gray100 },
                      ]}
                      onPress={() => setIsEditingAddress(false)}
                    >
                      <Text style={[styles.cancelBtnText, { color: colors.textMuted }]}>
                        CANCEL
                      </Text>
                    </Pressable>
                    <Pressable
                      style={[styles.miniBtn, styles.saveBtn, { backgroundColor: colors.primary }]}
                      onPress={handleSaveAddress}
                    >
                      <Text style={[styles.saveBtnText, { color: colors.accent }]}>SAVE</Text>
                    </Pressable>
                  </View>
                </View>
              ) : (
                <Text style={[styles.addressText, { color: colors.text }]}>{shippingAddress}</Text>
              )}
            </View>

            {/* Order Summary */}
            <View
              style={[
                styles.summaryCard,
                { backgroundColor: colors.surface, borderColor: colors.gray200 },
              ]}
            >
              <Text style={[styles.summaryTitle, { color: colors.text }]}>ORDER SUMMARY</Text>
              <View style={[styles.summaryDivider, { backgroundColor: colors.gray200 }]} />

              <View style={styles.summaryRow}>
                <Text style={[styles.summaryLabel, { color: colors.textMuted }]}>Subtotal</Text>
                <Text style={[styles.summaryValue, { color: colors.text }]}>
                  {formatPrice(subtotal)}
                </Text>
              </View>

              <View style={styles.summaryRow}>
                <Text style={[styles.summaryLabel, { color: colors.textMuted }]}>
                  Tax (18% GST)
                </Text>
                <Text style={[styles.summaryValue, { color: colors.text }]}>
                  {formatPrice(gstTax)}
                </Text>
              </View>

              <View style={styles.summaryRow}>
                <Text style={[styles.summaryLabel, { color: colors.textMuted }]}>
                  Express Shipping
                </Text>
                <Text style={[styles.summaryValue, { color: colors.text }]}>
                  {shippingCharge === 0 ? 'Free' : formatPrice(shippingCharge)}
                </Text>
              </View>

              <View style={[styles.summaryLightDivider, { backgroundColor: colors.gray200 }]} />

              <View style={styles.totalRow}>
                <Text style={[styles.totalLabel, { color: colors.text }]}>Total Amount</Text>
                <Text style={[styles.totalValue, { color: colors.accent }]}>
                  {formatPrice(totalAmount)}
                </Text>
              </View>
            </View>

            {/* Extra spacing for bottom bar */}
            <View style={{ height: 20 }} />
          </>
        )}
      </ScrollView>

      {cart.length > 0 && (
        <View
          style={[
            styles.checkoutBar,
            {
              paddingBottom: insets.bottom + 12,
              backgroundColor: colors.surface,
              borderTopColor: colors.gray200,
            },
          ]}
        >
          {/* Pay with Points */}
          <Pressable style={styles.pointsBtn}>
            <View style={styles.pointsContent}>
              <View style={styles.pointsIconWrapper}>
                <Feather name="star" size={16} color="#FFFFFF" />
              </View>
              <Text style={styles.pointsBtnText}>Pay with Points</Text>
            </View>
            <Text style={styles.pointsSubText}>REDEEM YOUR REWARD POINTS</Text>
          </Pressable>

          {/* Razorpay Button */}
          <Pressable style={styles.razorpayBtn} onPress={handleCheckout} disabled={isPaying}>
            <View style={styles.razorpayContent}>
              <View style={styles.razorpayIconWrapper}>
                <Feather name="shield" size={14} color="#FFFFFF" />
              </View>
              <Text style={styles.razorpayBtnText}>Pay {formatPrice(totalAmount)}</Text>
            </View>
            <Text style={styles.securedText}>SECURED BY RAZORPAY</Text>
          </Pressable>
        </View>
      )}

      {/* Payment Modal */}
      <Modal visible={isPaying} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.paymentModal}>
            <View style={styles.paymentModalHeader}>
              <View style={styles.paymentBrandRow}>
                <View style={styles.paymentBrandIcon} />
                <Text style={styles.paymentBrandName}>razorpay</Text>
              </View>
              <Text style={styles.paymentAmount}>{formatPrice(totalAmount)}</Text>
            </View>

            <View style={styles.paymentModalBody}>
              {paymentStep === 'loading' && (
                <View style={styles.paymentLoadingContainer}>
                  <ActivityIndicator size="large" color="#3399FF" />
                  <Text style={[styles.paymentLoadingText, { color: colors.text }]}>
                    Processing payment...
                  </Text>
                  <Text style={[styles.paymentSubText, { color: colors.textMuted }]}>
                    Please do not close this screen
                  </Text>
                </View>
              )}

              {paymentStep === 'success' && (
                <View style={styles.paymentSuccessContainer}>
                  <View style={styles.successIconCircle}>
                    <Feather name="check" size={36} color="#00C853" />
                  </View>
                  <Text style={styles.paymentSuccessText}>Payment Successful</Text>
                  <Text style={[styles.paymentSubText, { color: colors.textMuted }]}>
                    Confirming your order
                  </Text>
                </View>
              )}
            </View>

            <View
              style={[
                styles.paymentModalFooter,
                { borderTopColor: colors.gray200, backgroundColor: colors.gray100 },
              ]}
            >
              <Feather name="lock" size={10} color={colors.textMuted} />
              <Text style={[styles.paymentFooterText, { color: colors.textMuted }]}>
                PCI-DSS Secure Checkout
              </Text>
            </View>
          </View>
        </View>
      </Modal>
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
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
    paddingHorizontal: 32,
  },
  emptyIconWrapper: {
    marginBottom: 24,
  },
  emptyTitle: {
    fontFamily: 'PlayfairDisplay_600SemiBold',
    fontSize: 22,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontFamily: 'DMSans_400Regular',
    fontSize: 13,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 20,
  },
  emptyExploreBtn: {
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 25,
  },
  emptyExploreBtnText: {
    fontFamily: 'DMSans_700Bold',
    fontSize: 12,
    letterSpacing: 1.2,
  },
  itemsSection: {
    paddingHorizontal: 16,
    paddingTop: 16,
    marginBottom: 8,
  },
  sectionHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    fontFamily: 'DMSans_700Bold',
    fontSize: 11,
    letterSpacing: 1.5,
  },
  sectionDivider: {
    width: 35,
    height: 1,
    marginTop: 8,
  },
  addressCard: {
    borderRadius: 18,
    padding: 18,
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
  },
  addressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardLabel: {
    fontFamily: 'DMSans_700Bold',
    fontSize: 10,
    letterSpacing: 1.5,
  },
  editLink: {
    fontFamily: 'DMSans_700Bold',
    fontSize: 10,
    letterSpacing: 1,
  },
  addressText: {
    fontFamily: 'DMSans_400Regular',
    fontSize: 14,
    lineHeight: 22,
  },
  editAddressContainer: {
    marginTop: 4,
  },
  addressInput: {
    fontFamily: 'DMSans_400Regular',
    fontSize: 14,
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  editBtnRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 12,
    gap: 10,
  },
  miniBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  cancelBtn: {},
  cancelBtnText: {
    fontFamily: 'DMSans_700Bold',
    fontSize: 11,
    letterSpacing: 0.5,
  },
  saveBtn: {},
  saveBtnText: {
    fontFamily: 'DMSans_700Bold',
    fontSize: 11,
    letterSpacing: 0.5,
  },
  summaryCard: {
    borderRadius: 18,
    padding: 18,
    marginHorizontal: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
  },
  summaryTitle: {
    fontFamily: 'PlayfairDisplay_600SemiBold',
    fontSize: 16,
    letterSpacing: 1,
    marginBottom: 12,
  },
  summaryDivider: {
    height: 1,
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  summaryLabel: {
    fontFamily: 'DMSans_400Regular',
    fontSize: 14,
  },
  summaryValue: {
    fontFamily: 'DMSans_500Medium',
    fontSize: 14,
  },
  summaryLightDivider: {
    height: 1,
    marginVertical: 12,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  totalLabel: {
    fontFamily: 'DMSans_700Bold',
    fontSize: 15,
  },
  totalValue: {
    fontFamily: 'DMSans_700Bold',
    fontSize: 18,
  },
  checkoutBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 80,
    paddingHorizontal: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    zIndex: 1000,
    elevation: 1000,
  },
  pointsBtn: {
    backgroundColor: '#D4AF37',
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  pointsContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  pointsIconWrapper: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 20,
    width: 26,
    height: 26,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  pointsBtnText: {
    fontFamily: 'DMSans_700Bold',
    fontSize: 14,
    color: '#FFFFFF',
    letterSpacing: 0.8,
  },
  pointsSubText: {
    fontFamily: 'DMSans_700Bold',
    fontSize: 8,
    color: '#FFF8DC',
    letterSpacing: 1,
    opacity: 0.9,
  },
  razorpayBtn: {
    backgroundColor: '#0B4C8C',
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  razorpayContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  razorpayIconWrapper: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 20,
    width: 26,
    height: 26,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  razorpayBtnText: {
    fontFamily: 'DMSans_700Bold',
    fontSize: 14,
    color: '#FFFFFF',
    letterSpacing: 0.8,
  },
  securedText: {
    fontFamily: 'DMSans_700Bold',
    fontSize: 8,
    color: '#E0F2FE',
    letterSpacing: 1,
    opacity: 0.8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  paymentModal: {
    backgroundColor: '#FFFFFF',
    width: '100%',
    maxWidth: 340,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  paymentModalHeader: {
    backgroundColor: '#0F2644',
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  paymentBrandRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  paymentBrandIcon: {
    width: 12,
    height: 12,
    backgroundColor: '#3399FF',
    transform: [{ rotate: '45deg' }],
    marginRight: 8,
  },
  paymentBrandName: {
    fontFamily: 'DMSans_700Bold',
    fontSize: 15,
    color: '#FFFFFF',
  },
  paymentAmount: {
    fontFamily: 'DMSans_700Bold',
    fontSize: 15,
    color: '#FFFFFF',
  },
  paymentModalBody: {
    minHeight: 180,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 28,
  },
  paymentLoadingContainer: {
    alignItems: 'center',
  },
  paymentLoadingText: {
    fontFamily: 'DMSans_700Bold',
    fontSize: 15,
    marginTop: 18,
  },
  paymentSubText: {
    fontFamily: 'DMSans_400Regular',
    fontSize: 12,
    marginTop: 8,
    textAlign: 'center',
  },
  paymentSuccessContainer: {
    alignItems: 'center',
  },
  successIconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#E8F5E9',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  paymentSuccessText: {
    fontFamily: 'PlayfairDisplay_600SemiBold',
    fontSize: 18,
    color: '#2E7D32',
  },
  paymentModalFooter: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    borderTopWidth: 1,
    gap: 6,
  },
  paymentFooterText: {
    fontFamily: 'DMSans_500Medium',
    fontSize: 9,
    letterSpacing: 0.5,
  },
});
