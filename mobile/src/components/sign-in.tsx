import { useSSO } from '@clerk/expo';
import React from 'react';
import { View, Text, StyleSheet, Pressable, ActivityIndicator, useColorScheme } from 'react-native';
import { Colors } from '../constants/colors';
import FontAwesome from '@expo/vector-icons/FontAwesome';

export default function SignInScreen() {
  const { startSSOFlow } = useSSO();
  const [loading, setLoading] = React.useState(false);

  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  async function handleGoogleSignIn() {
    try {
      setLoading(true);

      const { createdSessionId, setActive } = await startSSOFlow({
        strategy: 'oauth_google',
      });

      if (createdSessionId && setActive) {
        await setActive({ session: createdSessionId });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.background,
        },
      ]}
    >
      <Text
        style={[
          styles.title,
          {
            color: colors.primary,
          },
        ]}
      >
        Sign in to Sylora
      </Text>

      <Text
        style={[
          styles.subtitle,
          {
            color: colors.textMuted,
          },
        ]}
      >
        Welcome back! Please sign in to continue
      </Text>

      <Pressable
        style={[
          styles.googleButton,
          {
            backgroundColor: colors.primary,
          },
        ]}
        onPress={handleGoogleSignIn}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color={colors.surface} />
        ) : (
          <View style={styles.buttonContent}>
            <FontAwesome name="google" size={20} color={colors.surface} />
            <Text
              style={[
                styles.buttonText,
                {
                  color: colors.surface,
                },
              ]}
            >
              Continue with Google
            </Text>
          </View>
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 28,
  },
  title: {
    fontSize: 34,
    fontWeight: '800',
    letterSpacing: 0.3,
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 48,
    paddingHorizontal: 10,
  },
  googleButton: {
    width: '100%',
    paddingVertical: 18,
    borderRadius: 18,
    alignItems: 'center',

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
});
