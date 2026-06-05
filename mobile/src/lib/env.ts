const clerkPublishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

if (!clerkPublishableKey) {
  throw new Error('EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY is not defined');
}

export const env = {
  backendUrl: process.env.EXPO_API_URL ?? 'http://localhost:8080',
  clerkPublishableKey,
};
