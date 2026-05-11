import { useAuth } from '@clerk/expo';
import { useAuthStore } from './store';
import { getMe, syncUser } from './api';
import { useEffect } from 'react';
import { setApiTokenGetter } from '../../lib/api';

export function useBootstrapAuth() {
  const { isLoaded, isSignedIn, getToken } = useAuth();

  const { setLoading, setUser, clearAuth, setError } = useAuthStore();

  useEffect(() => {
    setApiTokenGetter(async () => {
      const token = await getToken();
      return token ?? null;
    });
  }, [getToken]);

  useEffect(() => {
    async function run() {
      if (!isLoaded) return;

      if (!isSignedIn) {
        clearAuth();
        return;
      }

      try {
        setLoading();

        await syncUser();
        const me = await getMe();

        if (me?.user) {
          setUser(me.user);
        } else {
          clearAuth();
        }
      } catch (error) {
        const errMessage = error instanceof Error ? error.message : 'Failed to load user';
        setError(errMessage);
      }
    }

    void run();
  }, [isLoaded, isSignedIn, clearAuth, setError, setLoading, setUser]);
}
