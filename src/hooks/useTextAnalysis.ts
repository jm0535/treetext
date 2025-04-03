import { useContext } from 'react';
import { TextAnalysisContext, TextAnalysisContextType } from '@/contexts/TextAnalysisContext.context';

/**
 * Custom hook to access the TextAnalysisContext
 * @returns The TextAnalysisContext value
 * @throws Error if used outside of a TextAnalysisProvider
 */
export function useTextAnalysis(): TextAnalysisContextType {
  const context = useContext(TextAnalysisContext);
  
  if (context === undefined) {
    throw new Error('useTextAnalysis must be used within a TextAnalysisProvider');
  }
  
  return context;
}

export default useTextAnalysis;
