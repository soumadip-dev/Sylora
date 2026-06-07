import { useEffect } from 'react';
import { router } from 'expo-router';

export default function SSOCallback() {
  useEffect(() => {
    router.replace('/profile');
  }, []);

  return null;
}
