import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const OneDriveAuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const { updateCloudAuth } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    // Parse the access token from the URL hash
    const parseHash = () => {
      const hash = window.location.hash.substring(1);
      const params = new URLSearchParams(hash);
      const accessToken = params.get('access_token');
      const expiresIn = params.get('expires_in');
      const state = params.get('state');

      if (accessToken) {
        try {
          // Store the token in localStorage
          localStorage.setItem('oneDriveToken', accessToken);

          // Set expiration time
          if (expiresIn) {
            const expiresAt = Date.now() + parseInt(expiresIn) * 1000;
            localStorage.setItem('oneDriveTokenExpiry', expiresAt.toString());
          }

          // Update auth context
          updateCloudAuth('OneDrive', true);

          // Get the redirect path from state
          const redirectPath = state || '/';

          // Show success message
          window.opener.postMessage(
            { type: 'AUTH_SUCCESS', provider: 'OneDrive', accessToken },
            window.location.origin
          );

          toast({
            title: "Authentication Successful",
            description: "Connected to OneDrive successfully.",
            variant: "success"
          });

          // Close the popup after a short delay
          setTimeout(() => window.close(), 1000);
        } catch (error) {
          console.error('Error during OneDrive authentication:', error);
          toast({
            title: "Authentication Failed",
            description: "Could not connect to OneDrive. Please try again.",
            variant: "destructive"
          });
        }
      } else {
        toast({
          title: "Authentication Failed",
          description: "No access token received from OneDrive. Please try again.",
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
          <path d="M24.5 9.5H9.5V24.5H24.5V9.5Z" fill="#0364B8"/>
          <path d="M24.5 9.5H39.5V24.5H24.5V9.5Z" fill="#0078D4"/>
          <path d="M9.5 24.5H24.5V39.5H9.5V24.5Z" fill="#1490DF"/>
          <path d="M24.5 24.5H39.5V39.5H24.5V24.5Z" fill="#28A8EA"/>
        </svg>
      </div>
      <h1 className="text-2xl font-bold mb-2">OneDrive Authentication</h1>
      <p className="mb-6 text-muted-foreground">
        Authentication successful! This window will close automatically.
      </p>
      <Button onClick={handleClose}>Close Window</Button>
    </div>
  );
};

export default OneDriveAuthCallback;
