const clerkPublishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!clerkPublishableKey) {
  throw new Error('VITE_CLERK_PUBLISHABLE_KEY is not defined');
}

export const env = {
  backendUrl: import.meta.env.VITE_API_URL ?? 'http://localhost:8080',
  clerkPublishableKey,
};
