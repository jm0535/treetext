import { useState, useCallback } from 'react';
import { toast } from '@/hooks/use-toast';

/**
 * Custom hook for handling errors in a consistent way
 */
export function useErrorHandler() {
  const [error, setError] = useState<string | null>(null);

  /**
   * Handle an error and show a toast notification
   */
  const handleError = useCallback((
    errorObj: unknown, 
    title = 'Error', 
    fallbackMessage = 'An unexpected error occurred'
  ) => {
    // Extract error message
    const errorMessage = errorObj instanceof Error 
      ? errorObj.message 
      : fallbackMessage;
    
    // Set error state
    setError(errorMessage);
    
    // Show toast notification
    toast({
      title,
      description: errorMessage,
      variant: 'destructive',
    });
    
    // Log error to console
    console.error(`${title}:`, errorObj);
    
    return errorMessage;
  }, []);

  /**
   * Clear the error state
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    error,
    handleError,
    clearError,
  };
}

export default useErrorHandler;
