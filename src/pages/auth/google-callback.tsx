import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const GoogleAuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const { updateCloudAuth } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    // Parse the access token from the URL hash
    const parseHash = () => {
      console.log('Google callback triggered');
      console.log('Current URL:', window.location.href);
      
      // Check if there's an error in the URL
      const urlParams = new URLSearchParams(window.location.search);
      const error = urlParams.get('error');
      
      if (error) {
        console.error('OAuth error:', error);
        toast({
          title: "Authentication Error",
          description: `Google returned an error: ${error}`,
          variant: "destructive"
        });
        return;
      }
      
      const hash = window.location.hash.substring(1);
      console.log('Hash fragment:', hash);
      
      const params = new URLSearchParams(hash);
      const accessToken = params.get('access_token');
      const expiresIn = params.get('expires_in');
      const state = params.get('state');
      
      console.log('Access token present:', !!accessToken);

      // Try to parse the state parameter if it exists
      let provider = 'Google Drive';
      if (state) {
        try {
          const stateObj = JSON.parse(state);
          if (stateObj.provider) {
            provider = stateObj.provider;
          }
          console.log('State object:', stateObj);
        } catch (e) {
          console.error('Error parsing state parameter:', e);
        }
      }

      if (accessToken) {
        try {
          console.log('Storing token for provider:', provider);
          
          // Store the token in localStorage
          localStorage.setItem('googleDriveToken', accessToken);

          // Set expiration time
          if (expiresIn) {
            const expiresAt = Date.now() + parseInt(expiresIn) * 1000;
            localStorage.setItem('googleDriveTokenExpiry', expiresAt.toString());
          }

          // Update auth context
          updateCloudAuth(provider, true);

          // Show success message
          if (window.opener) {
            console.log('Sending message to opener window');
            window.opener.postMessage(
              { type: 'AUTH_SUCCESS', provider, accessToken },
              window.location.origin
            );
          } else {
            console.warn('No opener window found');
          }

          toast({
            title: "Authentication Successful",
            description: `Connected to ${provider} successfully.`,
            variant: "success"
          });

          // Close the popup after a short delay
          setTimeout(() => window.close(), 1000);
        } catch (error) {
          console.error('Error during Google authentication:', error);
          toast({
            title: "Authentication Failed",
            description: "Could not connect to Google Drive. Please try again.",
            variant: "destructive"
          });
        }
      } else {
        toast({
          title: "Authentication Failed",
          description: "No access token received from Google. Please try again.",
          variant: "destructive"
        });
      }
    };

    parseHash();
  }, [updateCloudAuth, toast]);

  const handleClose = () => {
    window.close();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
      <div className="mb-4">
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12
            s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24
            s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" fill="#FFC107"/>
          <path d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657
            C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" fill="#FF3D00"/>
          <path d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36
            c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" fill="#4CAF50"/>
          <path d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571
            c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z" fill="#1976D2"/>
        </svg>
      </div>
      <h1 className="text-2xl font-bold mb-2">Google Drive Authentication</h1>
      <p className="mb-6 text-muted-foreground">
        Authentication successful! This window will close automatically.
      </p>
      <Button onClick={handleClose}>Close Window</Button>
    </div>
  );
};

export default GoogleAuthCallback;
