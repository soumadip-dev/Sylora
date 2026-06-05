export type UserRole = 'user' | 'admin';

export type AppUser = {
  id: string;
  clerkUserId: string;
  email?: string;
  name?: string;
  role: UserRole;
};

export type ApiErrorItem = {
  message: string;
  code?: string;
};

export type ApiEnvelope<T> = {
  status: 'success' | 'error';
  data: T | null;
  meta?: Record<string, unknown>; // Record<string, unknown> allows storing dynamic key-value object with string keys and values of any type.means {[key: string]: unknown}
  errors?: ApiErrorItem[];
};
