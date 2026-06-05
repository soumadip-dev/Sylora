import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { ClerkProvider } from '@clerk/react';
import { env } from './lib/env.ts';

createRoot(document.getElementById('root')!).render(
  <ClerkProvider publishableKey={env.clerkPublishableKey}>
    <App />
  </ClerkProvider>
);
