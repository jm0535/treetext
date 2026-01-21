import { createContext } from 'react';
import { AnalysisResult, AnalysisSettings } from '@/types';

/**
 * Interface defining the shape of the TextAnalysisContext
 */
export interface TextAnalysisContextType {
  currentText: string;
  currentAnalysis: AnalysisResult | null;
  recentAnalyses: AnalysisResult[];
  isAnalyzing: boolean;
  analysisProgress: number;
  analysisETA: number | null;
  analysisError: string | null;
  settings: AnalysisSettings;
  setText: (text: string) => void;
  analyzeText: () => Promise<void>;
  clearCurrentAnalysis: () => void;
  deleteAnalysis: (id: string) => void;
  clearAllAnalyses: () => void;
  updateSettings: (newSettings: Partial<AnalysisSettings>) => void;
  exportAnalysisAsPDF: (analysis: AnalysisResult) => Promise<void>;
  exportAnalysisAsText: (analysis: AnalysisResult) => void;
}

/**
 * Create the context with undefined as default value
 * The actual value will be provided by the TextAnalysisProvider
 */
export const TextAnalysisContext = createContext<TextAnalysisContextType | undefined>(undefined);
