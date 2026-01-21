import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Link, useNavigate } from 'react-router-dom';

const ResetPasswordForm: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { signIn, isAuthenticated, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();

  // Redirect to dashboard if already authenticated
  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, authLoading, navigate]);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      // With Auth0, password reset is handled through the Universal Login page
      // Redirect user to sign in where they can use "Forgot password?" link
      const result = await signIn();
      if (result.error) {
        setError(result.error.message);
        setIsLoading(false);
      }
    } catch (error: Error | unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to process request';
      setError(errorMessage);
      setIsLoading(false);
    }
  };

  // Show loading while checking auth state
  if (authLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">Reset Password</h1>
        <p className="text-muted-foreground">
          Click below to access the login page where you can use the "Forgot password?" option
        </p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleResetPassword} className="space-y-4">
        <p className="text-sm text-muted-foreground text-center">
          You'll be redirected to our secure login page where you can reset your password
        </p>
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? 'Redirecting...' : 'Continue to Reset Password'}
        </Button>
      </form>

      <div className="text-center text-sm">
        Remember your password?{' '}
        <Link to="/signin" className="text-primary hover:underline">
          Back to Sign In
        </Link>
      </div>
    </div>
  );
};

export default ResetPasswordForm;
