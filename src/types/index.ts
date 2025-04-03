/**
 * Core types for the TreeText application
 */

/**
 * Analysis result interface
 */
export interface AnalysisResult {
  id: string;
  originalText: string;
  plagiarismScore: number;
  grammarScore: number;
  readabilityScore: number;
  plagiarismInstances: PlagiarismInstance[];
  grammarIssues: GrammarIssue[];
  readabilityMetrics: ReadabilityMetrics;
  date: Date;
}

/**
 * Plagiarism detection instance
 */
export interface PlagiarismInstance {
  id: string;
  text: string;
  startIndex: number;
  endIndex: number;
  matchedSource: string;
  matchPercentage: number;
  sourceUrl?: string;
}

/**
 * Grammar issue detected in text
 */
export interface GrammarIssue {
  id: string;
  text: string;
  startIndex: number;
  endIndex: number;
  issueType: string;
  suggestion: string;
  severity: 'high' | 'medium' | 'low';
}

/**
 * Readability metrics for text analysis
 */
export interface ReadabilityMetrics {
  fleschKincaidScore: number;
  avgSentenceLength: number;
  avgWordLength: number;
  totalWords: number;
  totalSentences: number;
  totalParagraphs: number;
  readingTime: number; // in minutes
}

/**
 * Analysis settings configuration
 */
export interface AnalysisSettings {
  checkPlagiarism: boolean;
  checkGrammar: boolean;
  checkReadability: boolean;
  languageModel: 'standard' | 'academic' | 'creative';
}

/**
 * User preferences
 */
export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  fontSize: 'small' | 'medium' | 'large';
  autoAnalysis: boolean;
  analysisSettings: AnalysisSettings;
}

/**
 * API response structure
 */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
}

/**
 * Error with HTTP status code
 */
export class ApiError extends Error {
  statusCode: number;
  
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.name = 'ApiError';
  }
}
