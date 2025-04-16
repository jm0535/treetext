import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const DropboxAuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const { updateCloudAuth } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    // Parse the access token from the URL hash
    const parseHash = () => {
      const hash = window.location.hash.substring(1);
      const params = new URLSearchParams(hash);
      const accessToken = params.get('access_token');
      const state = params.get('state');

      if (accessToken) {
        try {
          // Store the token in localStorage
          localStorage.setItem('dropboxToken', accessToken);

          // Update auth context
          updateCloudAuth('Dropbox', true);

          // Parse the state to get the redirect path
          let redirectPath = '/';
          if (state) {
            try {
              const stateObj = JSON.parse(decodeURIComponent(state));
              if (stateObj.redirect) {
                redirectPath = stateObj.redirect;
              }
            } catch (e) {
              console.error('Error parsing state:', e);
            }
          }

          // Show success message
          window.opener.postMessage(
            { type: 'AUTH_SUCCESS', provider: 'Dropbox', accessToken },
            window.location.origin
          );

          toast({
            title: "Authentication Successful",
            description: "Connected to Dropbox successfully.",
            variant: "success"
          });

          // Close the popup after a short delay
          setTimeout(() => window.close(), 1000);
        } catch (error) {
          console.error('Error during Dropbox authentication:', error);
          toast({
            title: "Authentication Failed",
            description: "Could not connect to Dropbox. Please try again.",
            variant: "destructive"
          });
        }
      } else {
        toast({
          title: "Authentication Failed",
          description: "No access token received from Dropbox. Please try again.",
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
          <path d="M12 6L24 14L12 22L0 14L12 6Z" fill="#0061FF"/>
          <path d="M36 6L48 14L36 22L24 14L36 6Z" fill="#0061FF"/>
          <path d="M0 26L12 18L24 26L12 34L0 26Z" fill="#0061FF"/>
          <path d="M36 18L48 26L36 34L24 26L36 18Z" fill="#0061FF"/>
          <path d="M12 38L24 30L36 38L24 46L12 38Z" fill="#0061FF"/>
        </svg>
      </div>
      <h1 className="text-2xl font-bold mb-2">Dropbox Authentication</h1>
      <p className="mb-6 text-muted-foreground">
        Authentication successful! This window will close automatically.
      </p>
      <Button onClick={handleClose}>Close Window</Button>
    </div>
  );
};

export default DropboxAuthCallback;
