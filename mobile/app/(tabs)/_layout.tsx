import React from 'react';
import { Colors } from '../../constants/colors';
import { useColorScheme } from 'react-native';

import { NativeTabs, Icon, Label } from 'expo-router/unstable-native-tabs';

export default function TabsLayout() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  return (
    <NativeTabs
      backgroundColor={colors.surface}
      tintColor={colors.primary}
      iconColor={{
        default: colors.tabInactive,
        selected: colors.primary,
      }}
      labelStyle={{
        color: colors.tabLabel,
      }}
    >
      <NativeTabs.Trigger name="index">
        <Label>Home</Label>
        <Icon sf="house.fill" src={require('../../assets/icons/home.svg')} />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="collections">
        <Icon sf="square.grid.2x2.fill" src={require('../../assets/icons/grid.svg')} />
        <Label>Collections</Label>
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="cart">
        <Icon sf="bag.fill" src={require('../../assets/icons/bag.svg')} />
        <Label>Cart</Label>
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="wishlist">
        <Icon sf="heart.fill" src={require('../../assets/icons/heart.svg')} />
        <Label>Wishlist</Label>
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="profile">
        <Icon sf="person.fill" src={require('../../assets/icons/person.svg')} />
        <Label>Account</Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
