import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, useAuth0 } from '@auth0/auth0-react';

type CloudAuthStatus = {
  [provider: string]: boolean;
};

type AuthContextType = {
  user: User | undefined;
  isLoading: boolean;
  isAuthenticated: boolean;
  cloudAuth: CloudAuthStatus;
  loginWithRedirect: () => Promise<void>;
  logout: () => void;
  getAccessToken: () => Promise<string>;
  updateCloudAuth: (provider: string, status: boolean) => void;
  getCloudToken: (provider: string) => string | null;
  // Legacy compatibility (stubbed)
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error?: Error }>;
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

  // Wrapper for logout
  const logout = () => {
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

  // Stubs for legacy support during refactor
  const signIn = async () => { await loginWithRedirect(); };
  const signUp = async () => { await loginWithRedirect({ authorizationParams: { screen_hint: 'signup' } }); };
  const signOut = async () => { logout(); };
  const resetPassword = async () => { return { error: new Error("Use Auth0 dashboard") }; };

  const value = {
    user,
    isAuthenticated,
    isLoading,
    cloudAuth,
    loginWithRedirect,
    logout,
    getAccessToken,
    updateCloudAuth,
    getCloudToken,
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
