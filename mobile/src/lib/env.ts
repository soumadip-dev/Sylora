import Constants from 'expo-constants';

const clerkPublishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

if (!clerkPublishableKey) {
  throw new Error('EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY is not defined');
}

const getBackendUrl = () => {
  let url = process.env.EXPO_PUBLIC_API_URL || process.env.EXPO_API_URL || 'http://localhost:8080';

  if (url.includes('localhost') || url.includes('127.0.0.1')) {
    const hostUri = Constants.expoConfig?.hostUri;
    if (hostUri) {
      const host = hostUri.split(':')[0];
      url = url.replace('localhost', host).replace('127.0.0.1', host);
    }
  }

  return url;
};

const backendUrl = getBackendUrl();
console.log('[env] Resolved backendUrl:', backendUrl);

export const env = {
  backendUrl,
  clerkPublishableKey,
};
