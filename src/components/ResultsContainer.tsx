import React from 'react';
import EnhancedResultsDashboard from './EnhancedResultsDashboard';
import { useTextAnalysis } from '@/hooks/useTextAnalysis';

/**
 * This component serves as a container for the results dashboard
 * to ensure only one instance is rendered at a time
 */
const ResultsContainer: React.FC = () => {
  const { currentAnalysis } = useTextAnalysis();
  
  if (!currentAnalysis) {
    return null;
  }
  
  return <EnhancedResultsDashboard />;
};

export default ResultsContainer;
