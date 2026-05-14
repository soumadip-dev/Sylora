import React from 'react';
import { View, StyleSheet, Alert, useColorScheme, ActivityIndicator } from 'react-native';

import { useRouter } from 'expo-router';
import { Colors } from '../../constants/colors';
import { useAppStore } from '../../store/useAppStore';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import SignInScreen from '@/src/components/sign-in';
import { useAuth } from '@clerk/expo';
import { useAuthStore } from '@/src/features/auth/store';

import ProfileContent from '@/src/components/ProfileContent';

export default function ProfileScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const router = useRouter();
  const { user } = useAppStore();
  const insets = useSafeAreaInsets();

  const { isLoaded, isSignedIn, signOut } = useAuth();
  const { isBootstrapped, status, user: authUser } = useAuthStore();

  const displayName = authUser?.name || user.name;
  const displayEmail = authUser?.email || user.email;

  //TODO : DEMO FOR NOW
  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          try {
            await signOut();
          } catch (error) {
            console.error('Failed to sign out:', error);
          }
        },
      },
    ]);
  };

  //TODO : DEMO FOR NOW
  const menuItems = [
    {
      id: 'orders',
      title: 'My Orders',
      subtitle: 'View and manage recent acquisitions',
      icon: 'package' as const,
      action: () => router.push('/orders'),
    },
    {
      id: 'wishlist',
      title: 'My Wishlist',
      subtitle: 'Items saved for later',
      icon: 'heart' as const,
      action: () => router.push('/(tabs)/wishlist'),
    },
    {
      id: 'support',
      title: 'Help & Support',
      subtitle: '24/7 client support assistance',
      icon: 'help-circle' as const,
      action: () => {},
    },
    {
      id: 'logout',
      title: 'Logout',
      subtitle: 'Sign out of your account securely',
      icon: 'log-out' as const,
      isLogout: true,
      action: handleLogout,
    },
  ];

  const isLoading = !isLoaded || (isSignedIn && (!isBootstrapped || status === 'loading'));

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.accent} />
        </View>
      ) : !isSignedIn ? (
        <SignInScreen />
      ) : (
        <ProfileContent
          colors={colors}
          insets={insets}
          displayName={displayName}
          displayEmail={displayEmail}
          user={user}
          menuItems={menuItems}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
