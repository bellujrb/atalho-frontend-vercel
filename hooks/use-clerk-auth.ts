import { useAuth, useUser } from '@clerk/nextjs';
import { useEffect, useState, useCallback } from 'react';
import { setGlobalTokenGetter } from '@/lib/api';

export function useClerkAuth() {
  const { isLoaded, userId, sessionId, getToken, signOut } = useAuth();
  const { user } = useUser();
  const [isInitialized, setIsInitialized] = useState(false);

  const getCurrentToken = useCallback(async (): Promise<string | null> => {
    try {
      if (!isLoaded || !userId) {
        return null;
      }
      
      const token = await getToken();
      
      return token;
    } catch (error) {
      return null;
    }
  }, [isLoaded, userId, getToken]);

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
        console.error(error);
    }
  };

  useEffect(() => {
    if (isLoaded) {
      setGlobalTokenGetter(getCurrentToken);
      setIsInitialized(true);
    }
  }, [isLoaded, getCurrentToken, userId]);

  useEffect(() => {
    if (!isLoaded || !userId) return;

    const refreshInterval = setInterval(async () => {
      try {
        const token = await getCurrentToken();
        if (token) {
        }
      } catch (error) {
      }
    }, 45 * 60 * 1000); 

    return () => clearInterval(refreshInterval);
  }, [isLoaded, userId, getCurrentToken]);

  return {
    isLoaded,
    isSignedIn: !!userId,
    userId,
    sessionId,
    user,
    getCurrentToken,
    signOut: handleSignOut,
    isInitialized,
  };
}
