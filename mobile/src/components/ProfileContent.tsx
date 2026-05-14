import React from 'react';
import { ScrollView, View, Text, Image, Pressable, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Colors } from '../constants/colors';
import { UserProfile } from '@/src/types';

interface ProfileContentProps {
  colors: (typeof Colors)['light'];
  insets: { top: number; bottom: number };
  displayName: string;
  displayEmail: string;
  user: UserProfile;
  menuItems: {
    id: string;
    title: string;
    subtitle: string;
    icon: React.ComponentProps<typeof Feather>['name'];
    isLogout?: boolean;
    action: () => void;
  }[];
}

export default function ProfileContent({
  colors,
  insets,
  displayName,
  displayEmail,
  user,
  menuItems,
}: ProfileContentProps) {
  return (
    <ScrollView contentContainerStyle={{ paddingBottom: 3 + insets.bottom }}>
      <View
        style={[
          styles.header,
          {
            paddingTop: insets.top + 20,
            backgroundColor: colors.background,
          },
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
                {displayName.charAt(0).toUpperCase()}
              </Text>
            </View>
          )}

          <Pressable
            style={[
              styles.editAvatarButton,
              {
                backgroundColor: colors.primary,
                borderColor: colors.background,
              },
            ]}
          >
            <Feather name="edit-2" size={10} color="#FFF" />
          </Pressable>
        </View>

        <Text style={[styles.userName, { color: colors.text }]}>{displayName}</Text>

        <Text style={[styles.userEmail, { color: colors.textMuted }]}>{displayEmail}</Text>

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
              {
                borderBottomColor: colors.gray200,
              },
            ]}
            onPress={item.action}
          >
            <View style={styles.menuItemLeft}>
              <View
                style={[
                  styles.menuIconContainer,
                  item.isLogout && [styles.menuIconContainerLogout, { backgroundColor: '#FFE5E5' }],
                  !item.isLogout && {
                    backgroundColor: colors.gray100,
                  },
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
                    !item.isLogout && {
                      color: colors.text,
                    },
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
    </ScrollView>
  );
}

const styles = StyleSheet.create({
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
