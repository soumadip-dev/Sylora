import React from 'react';
import { View, Text, StyleSheet, Image, Pressable, Alert, useColorScheme } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Colors } from '../../constants/colors';
import { useAppStore } from '../../store/useAppStore';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import SignInScreen from '@/src/components/sign-in';

export default function ProfileScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const router = useRouter();
  const { user } = useAppStore();
  const insets = useSafeAreaInsets();
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);

  const handleLogin = () => {
    Alert.alert(
      'Login',
      'Trying to login...',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Login',
          onPress: () => {
            setIsLoggedIn(true);
            Alert.alert('Success', 'Logged in successfully!');
          },
        },
      ],
      { cancelable: false }
    );
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          onPress: () => {
            setIsLoggedIn(false);
            Alert.alert('Logged Out', 'You have been logged out successfully.');
          },
          style: 'destructive',
        },
      ],
      { cancelable: false }
    );
  };

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

  if (!isLoggedIn) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        {/* <View style={[styles.loginContainer, { paddingTop: insets.top }]}>
          <View style={[styles.loginIconContainer, { backgroundColor: colors.surface }]}>
            <Feather name="user" size={60} color={colors.accent} />
          </View>
          <Text style={[styles.loginTitle, { color: colors.primary }]}>Welcome Back</Text>
          <Text style={[styles.loginSubtitle, { color: colors.textMuted }]}>
            Login to access your luxury portfolio{'\n'}
            and explore exclusive offers
          </Text>
          <Pressable
            style={[styles.loginButton, { backgroundColor: colors.surface }]}
            onPress={handleLogin}
          >
            <Text style={[styles.loginButtonText, { color: colors.primary }]}>
              LOGIN TO YOUR ACCOUNT
            </Text>
            <Feather name="arrow-right" size={18} color={colors.accent} />
          </Pressable>
          <Text style={[styles.loginFooter, { color: colors.textMuted }]}>
            New to our luxury collection?{' '}
            <Text style={[styles.loginFooterLink, { color: colors.accent }]}>Create Account</Text>
          </Text>
        </View> */}
        <SignInScreen />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={{ paddingBottom: 3 + insets.bottom }}>
        <View
          style={[
            styles.header,
            { paddingTop: insets.top + 20, backgroundColor: colors.background },
          ]}
        >
          <Text style={[styles.headerTitle, { color: colors.primary }]}>PROFILE</Text>
          <View style={[styles.headerDivider, { backgroundColor: colors.accent }]} />
          <Text style={[styles.headerSub, { color: colors.textMuted }]}>Your luxury portfolio</Text>
        </View>

        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            {user.avatar ? (
              <Image
                source={{ uri: user.avatar }}
                style={[styles.avatar, { borderColor: colors.accent }]}
              />
            ) : (
              <View style={[styles.avatarPlaceholder, { backgroundColor: colors.primary }]}>
                <Text style={[styles.avatarPlaceholderText, { color: colors.accent }]}>
                  {user.name.charAt(0)}
                </Text>
              </View>
            )}
            <Pressable
              style={[
                styles.editAvatarButton,
                { backgroundColor: colors.primary, borderColor: colors.background },
              ]}
            >
              <Feather name="edit-2" size={10} color="#FFF" />
            </Pressable>
          </View>

          <Text style={[styles.userName, { color: colors.text }]}>{user.name}</Text>
          <Text style={[styles.userEmail, { color: colors.textMuted }]}>{user.email}</Text>

          {/* Points Badge */}
          <View style={styles.pointsBadge}>
            <Feather name="star" size={12} color="#5A4614" style={{ marginRight: 4 }} />
            <Text style={styles.pointsText}>1,240 Points</Text>
          </View>
        </View>

        <View style={[styles.sectionCard, { backgroundColor: colors.surface }]}>
          <View style={[styles.cardHeader, { borderBottomColor: colors.gray200 }]}>
            <Text style={[styles.cardTitle, { color: colors.textMuted }]}>SAVED ADDRESS</Text>
            <Pressable>
              <Text style={[styles.cardLink, { color: colors.accent }]}>VIEW ALL →</Text>
            </Pressable>
          </View>

          <View style={styles.addressContent}>
            <View style={styles.addressHeader}>
              <View style={styles.labelContainer}>
                <Text style={[styles.addressLabel, { color: colors.text }]}>Home</Text>
                <View style={styles.defaultBadge}>
                  <Text style={styles.defaultBadgeText}>DEFAULT</Text>
                </View>
              </View>
              <Pressable style={styles.editButton}>
                <Feather name="edit-2" size={12} color={colors.textMuted} />
                <Text style={[styles.editButtonText, { color: colors.textMuted }]}>Edit</Text>
              </Pressable>
            </View>

            <View style={styles.addressRow}>
              <Feather name="map-pin" size={16} color={colors.accent} />
              <Text style={[styles.addressText, { color: colors.text }]}>{user.address}</Text>
            </View>
          </View>
        </View>

        <Pressable style={[styles.addAddressCard, { borderColor: colors.gray900 }]}>
          <Feather name="plus" size={16} color={colors.accent} />
          <Text style={[styles.addAddressText, { color: colors.accent }]}>Add New Address</Text>
        </Pressable>

        <View style={[styles.menuSection, { backgroundColor: colors.surface }]}>
          {menuItems.map((item, index) => (
            <Pressable
              key={item.id}
              style={[
                styles.menuItem,
                index === menuItems.length - 1 && styles.menuItemLast,
                { borderBottomColor: colors.gray200 },
              ]}
              onPress={item.action}
            >
              <View style={styles.menuItemLeft}>
                <View
                  style={[
                    styles.menuIconContainer,
                    item.isLogout && [
                      styles.menuIconContainerLogout,
                      { backgroundColor: '#FFE5E5' },
                    ],
                    !item.isLogout && { backgroundColor: colors.gray100 },
                  ]}
                >
                  <Feather
                    name={item.icon}
                    size={18}
                    color={item.isLogout ? '#8B0000' : colors.primary}
                  />
                </View>
                <View>
                  <Text
                    style={[
                      styles.menuItemTitle,
                      item.isLogout && [styles.menuItemTitleLogout, { color: '#8B0000' }],
                      !item.isLogout && { color: colors.text },
                    ]}
                  >
                    {item.title}
                  </Text>
                  <Text style={[styles.menuItemSubtitle, { color: colors.textMuted }]}>
                    {item.subtitle}
                  </Text>
                </View>
              </View>
              <Feather name="chevron-right" size={18} color={colors.tabInactive} />
            </Pressable>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loginContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  loginIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  loginTitle: {
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: 32,
    marginBottom: 12,
    letterSpacing: 1,
  },
  loginSubtitle: {
    fontFamily: 'DMSans_400Regular',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 40,
  },
  loginButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 28,
    borderRadius: 30,
    gap: 12,
    width: '100%',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  loginButtonText: {
    fontFamily: 'DMSans_700Bold',
    fontSize: 14,
    letterSpacing: 1,
  },
  loginFooter: {
    fontFamily: 'DMSans_400Regular',
    fontSize: 13,
    marginTop: 24,
  },
  loginFooterLink: {
    fontFamily: 'DMSans_700Bold',
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
  profileSection: {
    alignItems: 'center',
    paddingVertical: 24,
    marginBottom: 8,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarPlaceholderText: {
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: 36,
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
  },
  userName: {
    fontFamily: 'PlayfairDisplay_600SemiBold',
    fontSize: 24,
    marginBottom: 6,
  },
  userEmail: {
    fontFamily: 'DMSans_400Regular',
    fontSize: 13,
    marginBottom: 16,
  },
  pointsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E6C66D',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 25,
  },
  pointsText: {
    fontFamily: 'DMSans_700Bold',
    fontSize: 11,
    color: '#5A4614',
    letterSpacing: 0.5,
  },
  sectionCard: {
    borderRadius: 18,
    marginHorizontal: 16,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
    overflow: 'hidden',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
  },
  cardTitle: {
    fontFamily: 'DMSans_700Bold',
    fontSize: 10,
    letterSpacing: 1.5,
  },
  cardLink: {
    fontFamily: 'DMSans_600SemiBold',
    fontSize: 10,
    letterSpacing: 0.5,
  },
  addressContent: {
    padding: 18,
  },
  addressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  addressLabel: {
    fontFamily: 'DMSans_700Bold',
    fontSize: 14,
  },
  defaultBadge: {
    backgroundColor: '#E2F7ED',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  defaultBadgeText: {
    fontFamily: 'DMSans_700Bold',
    fontSize: 9,
    color: '#219653',
    letterSpacing: 0.5,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 6,
  },
  editButtonText: {
    fontFamily: 'DMSans_400Regular',
    fontSize: 11,
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  addressText: {
    fontFamily: 'DMSans_400Regular',
    fontSize: 13,
    lineHeight: 19,
    flex: 1,
  },
  addAddressCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderRadius: 18,
    paddingVertical: 16,
    marginHorizontal: 16,
    marginTop: 14,
    backgroundColor: 'transparent',
  },
  addAddressText: {
    fontFamily: 'DMSans_600SemiBold',
    fontSize: 13,
    letterSpacing: 0.5,
  },
  menuSection: {
    borderRadius: 18,
    marginHorizontal: 16,
    marginTop: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 18,
    borderBottomWidth: 1,
  },
  menuItemLast: {
    borderBottomWidth: 0,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  menuIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuIconContainerLogout: {
    backgroundColor: '#FFE5E5',
  },
  menuItemTitle: {
    fontFamily: 'DMSans_700Bold',
    fontSize: 14,
    marginBottom: 2,
  },
  menuItemTitleLogout: {
    color: '#8B0000',
  },
  menuItemSubtitle: {
    fontFamily: 'DMSans_400Regular',
    fontSize: 11,
  },
});
