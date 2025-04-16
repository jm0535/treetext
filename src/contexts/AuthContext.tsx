import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

type CloudAuthStatus = {
  [provider: string]: boolean;
};

type AuthContextType = {
  session: Session | null;
  user: User | null;
  isLoading: boolean;
  cloudAuth: CloudAuthStatus;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  signIn: (email: string, password: string) => Promise<{
    error: Error | null;
    data: { user: User | null; session: Session | null } | null;
  }>;
  signUp: (email: string, password: string) => Promise<{
    error: Error | null;
    data: { user: User | null; session: Session | null } | null;
  }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: Error | null }>;
  updateCloudAuth: (provider: string, status: boolean) => void;
  getCloudToken: (provider: string) => string | null;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [cloudAuth, setCloudAuth] = useState<CloudAuthStatus>({});

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = (email: string, password: string) => {
    return supabase.auth.signInWithPassword({ email, password });
  };

  const signUp = (email: string, password: string) => {
    return supabase.auth.signUp({ email, password });
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const resetPassword = async (email: string) => {
    return supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
  };

  // Load cloud authentication status from localStorage on mount
  useEffect(() => {
    const loadCloudAuthStatus = () => {
      const googleAuth = localStorage.getItem('googleDriveToken') !== null;
      const dropboxAuth = localStorage.getItem('dropboxToken') !== null;
      const oneDriveAuth = localStorage.getItem('oneDriveToken') !== null;

      setCloudAuth({
        'Google Drive': googleAuth,
        'Dropbox': dropboxAuth,
        'OneDrive': oneDriveAuth
      });
    };

    loadCloudAuthStatus();

    // Listen for messages from OAuth popup windows
    const handleAuthMessage = (event: MessageEvent) => {
      // Verify origin for security
      if (event.origin !== window.location.origin) return;

      const { type, provider, accessToken } = event.data;

      // Handle the new standardized AUTH_SUCCESS message type
      if (type === 'AUTH_SUCCESS' && provider) {
        console.log(`Authentication successful for ${provider}`);
        updateCloudAuth(provider, true);
      }
      // For backward compatibility with old message types
      else if (type === 'GOOGLE_AUTH_SUCCESS') {
        updateCloudAuth('Google Drive', true);
      } else if (type === 'DROPBOX_AUTH_SUCCESS') {
        updateCloudAuth('Dropbox', true);
      } else if (type === 'ONEDRIVE_AUTH_SUCCESS') {
        updateCloudAuth('OneDrive', true);
      }
    };

    window.addEventListener('message', handleAuthMessage);

    return () => {
      window.removeEventListener('message', handleAuthMessage);
    };
  }, []);

  // Update cloud authentication status
  const updateCloudAuth = (provider: string, status: boolean) => {
    setCloudAuth(prev => ({
      ...prev,
      [provider]: status
    }));
  };

  // Get cloud token for a specific provider
  const getCloudToken = (provider: string): string | null => {
    switch (provider) {
      case 'Google Drive':
        return localStorage.getItem('googleDriveToken');
      case 'Dropbox':
        return localStorage.getItem('dropboxToken');
      case 'OneDrive':
        return localStorage.getItem('oneDriveToken');
      default:
        return null;
    }
  };

  const value = {
    session,
    user,
    isLoading,
    cloudAuth,
    setUser,
    signIn,
    signUp,
    signOut,
    resetPassword,
    updateCloudAuth,
    getCloudToken
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
