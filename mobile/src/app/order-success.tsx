import React from 'react';
import { View, Text, StyleSheet, Pressable, useColorScheme } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter, Href } from 'expo-router';
import { Colors } from '../constants/colors';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function OrderSuccessScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const router = useRouter();

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <View style={styles.container}>
        {/* Success Icon Badge */}
        <View
          style={[
            styles.iconCircle,
            { backgroundColor: colors.primary, shadowColor: colors.primary },
          ]}
        >
          <Feather name="check" size={48} color={colors.accent} />
        </View>

        {/* Success Typography */}
        <Text style={[styles.title, { color: colors.primary }]}>Acquisition Confirmed</Text>

        <Text style={[styles.message, { color: colors.textMuted }]}>
          Thank you for choosing Sylora. Your order has been registered and is being prepared for
          dispatch.
        </Text>

        <View style={[styles.divider, { backgroundColor: colors.outlineLight }]} />

        {/* Navigation CTAs */}
        <Pressable
          style={[
            styles.primaryBtn,
            { backgroundColor: colors.primary, shadowColor: colors.primary },
          ]}
          onPress={() => router.replace('/orders' as Href)}
        >
          <Text style={[styles.primaryBtnText, { color: colors.accent }]}>VIEW ORDERS</Text>
        </Pressable>

        <Pressable
          style={[styles.secondaryBtn, { borderColor: colors.outline }]}
          onPress={() => router.replace('/(tabs)' as Href)}
        >
          <Text style={[styles.secondaryBtnText, { color: colors.primary }]}>
            CONTINUE SHOPPING
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  iconCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 28,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 4,
  },
  title: {
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: 26,
    textAlign: 'center',
    marginBottom: 16,
    letterSpacing: 1,
  },
  message: {
    fontFamily: 'DMSans_400Regular',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
  },
  divider: {
    width: 60,
    height: 1,
    marginBottom: 32,
  },
  primaryBtn: {
    width: '100%',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  primaryBtnText: {
    fontFamily: 'DMSans_700Bold',
    fontSize: 12,
    letterSpacing: 1,
  },
  secondaryBtn: {
    width: '100%',
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryBtnText: {
    fontFamily: 'DMSans_700Bold',
    fontSize: 12,
    letterSpacing: 1,
  },
});
