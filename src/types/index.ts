/**
 * Core types for the TreeText application
 */

/**
 * Analysis result interface
 */
export interface AnalysisResult {
  id: string;
  originalText: string;
  text?: string; // Legacy/Compat
  title?: string;
  plagiarismScore: number;
  grammarScore: number;
  readabilityScore: number;
  plagiarismInstances: PlagiarismInstance[];
  grammarIssues: GrammarIssue[];
  readabilityMetrics: ReadabilityMetrics;
  suggestions?: string[];
  settings?: AnalysisSettings;
  date: Date;
}

/**
 * File analysis result interface
 */
export interface FileAnalysisResult {
  id: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  fileUrl?: string;
  plagiarismScore?: number;
  grammarScore?: number;
  readabilityScore?: number;
  analysisSettings?: AnalysisSettings;
  results?: any; // JSON structure depending on analysis
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
  context?: {
    text: string;
    offset: number;
    length: number;
  };
  ruleId?: string; // Reference to the specific grammar rule that was violated
}

/**
 * Readability metrics for text analysis
 */
export interface ReadabilityMetrics {
  // Primary readability scores
  fleschKincaidScore: number;
  fleschKincaidGradeLevel?: number;
  gunningFogIndex?: number;
  colemanLiauIndex?: number;
  smogIndex?: number;
  automatedReadabilityIndex?: number;
  overallReadabilityScore?: number;

  // Text statistics
  avgSentenceLength: number;
  avgWordLength: number;
  syllablesPerWord?: number;
  complexWordPercentage?: number;
  totalWords: number;
  totalSentences: number;
  totalSyllables?: number;
  totalParagraphs: number;
  readingTime: number; // in minutes

  // Enhanced analysis
  audienceLevel?: string; // Target audience education level
  complexityLevel?: string; // Text complexity categorization
  improvementSuggestions?: string[]; // Specific suggestions to improve readability
}

/**
 * Analysis settings configuration
 */
// Language model categories
export type LanguageModelCategory = 'general' | 'academic' | 'business' | 'specialized';

// Language model types
export type LanguageModelType =
  // General models
  'standard' | 'creative' |
  // Academic models
  'academic-general' | 'scientific' | 'statistical' | 'legal' |
  // Business models
  'business' | 'marketing' | 'technical' |
  // Specialized models
  'journalism' | 'medical' | 'documentation';

export interface AnalysisSettings {
  checkPlagiarism: boolean;
  checkGrammar: boolean;
  checkReadability: boolean;
  languageModel: LanguageModelType;
  languageModelCategory: LanguageModelCategory;
  // AI-assisted calibration settings
  adaptiveAnalysis: boolean;
  // User feedback data for AI calibration
  userFeedback?: {
    documentTypes: string[];
    preferredStyles: string[];
    lastFeedbackDate?: Date;
  };
  // Custom weights for analysis components
  customWeights?: {
    grammar?: number;
    plagiarism?: number;
    readability?: number;
    // Additional specialized metrics
    technicalAccuracy?: number;
    engagement?: number;
    clarity?: number;
  };
}

/**
 * Usage limits and tracking
 */
export interface UsageLimit {
  // Daily limits
  dailyAnalysisLimit: number;       // Maximum number of analyses per day
  dailyAnalysisCount: number;       // Current count of analyses today
  dailyTokenLimit: number;          // Maximum number of tokens per day
  dailyTokenCount: number;          // Current count of tokens used today

  // Monthly limits
  monthlyAnalysisLimit: number;     // Maximum number of analyses per month
  monthlyAnalysisCount: number;     // Current count of analyses this month
  monthlyTokenLimit: number;        // Maximum number of tokens per month
  monthlyTokenCount: number;        // Current count of tokens used this month

  // Last reset timestamps
  lastDailyReset: string;           // ISO date string of last daily reset
  lastMonthlyReset: string;         // ISO date string of last monthly reset
}

/**
 * User preferences
 */
export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  fontSize: 'small' | 'medium' | 'large';
  autoAnalysis: boolean;
  analysisSettings: AnalysisSettings;
  usageLimit?: UsageLimit;          // Usage limits for the user
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
