import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { User, useAuth0 } from '@auth0/auth0-react';

type CloudAuthStatus = {
  [provider: string]: boolean;
};

type AuthResult = {
  error?: Error;
};

interface DbUser {
  id: string;
  auth0Id: string;
  email: string;
  role: string;
  createdAt: string;
}

type AuthContextType = {
  user: User | undefined;
  isLoading: boolean;
  isAuthenticated: boolean;
  isSynced: boolean;
  cloudAuth: CloudAuthStatus;
  loginWithRedirect: (options?: { authorizationParams?: { screen_hint?: string } }) => Promise<void>;
  logout: () => void;
  getAccessToken: () => Promise<string>;
  updateCloudAuth: (provider: string, status: boolean) => void;
  getCloudToken: (provider: string) => string | null;
  syncUser: () => Promise<void>;
  dbUser: DbUser | null;
  // Auth0 redirect-based auth (email/password params kept for form compatibility but unused)
  signIn: (email?: string, password?: string) => Promise<AuthResult>;
  signUp: (email?: string, password?: string) => Promise<AuthResult>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<AuthResult>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const {
    user,
    isAuthenticated,
    isLoading,
    loginWithRedirect,
    logout: auth0Logout,
    getAccessTokenSilently
  } = useAuth0();

  const [cloudAuth, setCloudAuth] = useState<CloudAuthStatus>({});
  const [isSynced, setIsSynced] = useState(false);
  const [dbUser, setDbUser] = useState<DbUser | null>(null);

  // API base URL for user sync
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

  // Wrapper for logout
  const logout = () => {
    setIsSynced(false);
    auth0Logout({ logoutParams: { returnTo: window.location.origin } });
  };

  // Wrapper to get access token for API calls
  const getAccessToken = async (): Promise<string> => {
    try {
      return await getAccessTokenSilently();
    } catch (error) {
      console.error("Error getting access token", error);
      return "";
    }
  };

  // Sync user with backend database
  const syncUser = useCallback(async (): Promise<void> => {
    if (!isAuthenticated || !API_BASE_URL) return;

    try {
      const token = await getAccessTokenSilently();
      const response = await fetch(`${API_BASE_URL}/api/user/sync`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setDbUser(data.user);
        setIsSynced(true);
      } else {
        console.error('User sync failed:', response.status);
      }
    } catch (error) {
      console.error('Error syncing user:', error);
    }
  }, [isAuthenticated, getAccessTokenSilently, API_BASE_URL]);

  // Auto-sync user when authenticated
  useEffect(() => {
    if (isAuthenticated && !isLoading && !isSynced && API_BASE_URL) {
      syncUser();
    }
  }, [isAuthenticated, isLoading, isSynced, syncUser, API_BASE_URL]);

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

      const { type, provider } = event.data;

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

  // Auth0 redirect-based authentication
  // Note: email/password params are accepted for form compatibility but Auth0 handles actual credentials
  const signIn = async (_email?: string, _password?: string): Promise<AuthResult> => {
    try {
      await loginWithRedirect();
      return {};
    } catch (error) {
      return { error: error instanceof Error ? error : new Error('Sign in failed') };
    }
  };

  const signUp = async (_email?: string, _password?: string): Promise<AuthResult> => {
    try {
      await loginWithRedirect({ authorizationParams: { screen_hint: 'signup' } });
      return {};
    } catch (error) {
      return { error: error instanceof Error ? error : new Error('Sign up failed') };
    }
  };

  const signOut = async (): Promise<void> => {
    logout();
  };

  const resetPassword = async (_email: string): Promise<AuthResult> => {
    // Auth0 handles password reset through its Universal Login page
    // Users can click "Forgot password?" on the Auth0 login screen
    try {
      await loginWithRedirect({
        authorizationParams: {
          screen_hint: 'signup' // Redirect to Auth0 where they can use "Forgot password"
        }
      });
      return {};
    } catch (error) {
      return { error: error instanceof Error ? error : new Error('Password reset request failed') };
    }
  };

  const value = {
    user,
    dbUser,
    isAuthenticated,
    isLoading,
    isSynced,
    cloudAuth,
    loginWithRedirect,
    logout,
    getAccessToken,
    updateCloudAuth,
    getCloudToken,
    syncUser,
    signIn,
    signUp,
    signOut,
    resetPassword
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
