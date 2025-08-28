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
        console.log('Auth not loaded or no user ID:', { isLoaded, userId });
        return null;
      }
      
      console.log('Getting token for user:', userId);
      const token = await getToken();
      
      if (token) {
        console.log('Token obtained successfully, length:', token.length);
        // Log apenas os primeiros caracteres do token para debug
        console.log('Token preview:', token.substring(0, 20) + '...');
      } else {
        console.log('No token obtained');
      }
      
      return token;
    } catch (error) {
      console.error('Error getting token:', error);
      return null;
    }
  }, [isLoaded, userId, getToken]);

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
        console.error('Error during sign out:', error);
    }
  };

  useEffect(() => {
    if (isLoaded) {
      console.log('Auth loaded, setting global token getter');
      setGlobalTokenGetter(getCurrentToken);
      setIsInitialized(true);
    }
  }, [isLoaded, getCurrentToken, userId]);

  useEffect(() => {
    if (!isLoaded || !userId) return;

    console.log('Setting up token refresh interval for user:', userId);
    const refreshInterval = setInterval(async () => {
      try {
        console.log('Refreshing token...');
        const token = await getCurrentToken();
        if (token) {
          console.log('Token refreshed successfully');
        } else {
          console.log('Failed to refresh token');
        }
      } catch (error) {
        console.error('Error refreshing token:', error);
      }
    }, 45 * 60 * 1000); // 45 minutos

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
