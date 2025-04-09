/**
 * Application-wide constants
 */
import ENV from './env';

export const APP_NAME = ENV.APP.NAME;

/**
 * Score threshold constants
 */
export const SCORE_THRESHOLDS = {
  HIGH: 90,
  MEDIUM: 70,
  LOW: 50
};

/**
 * API configuration
 */
export const API_CONFIG = {
  USE_API: ENV.API.USE_API,
  BASE_URL: ENV.API.BASE_URL,
  TIMEOUT: ENV.API.TIMEOUT,
  RETRY_ATTEMPTS: ENV.API.RETRY_ATTEMPTS,
  ENDPOINTS: {
    TEXT_ANALYSIS: '/api/analyze',
    USER_HISTORY: '/api/history'
  }
};

/**
 * Local storage keys
 */
export const STORAGE_KEYS = {
  RECENT_ANALYSES: 'treetext_recent_analyses',
  USER_PREFERENCES: 'treetext_user_preferences',
  AUTH_TOKEN: 'treetext_auth_token',
  USAGE_LIMITS: 'treetext_usage_limits'
};

/**
 * Default analysis settings
 */
export const DEFAULT_ANALYSIS_SETTINGS = {
  checkPlagiarism: true,
  checkGrammar: true,
  checkReadability: true,
  languageModel: 'standard',
  languageModelCategory: 'general',
  adaptiveAnalysis: false,
  userFeedback: {
    documentTypes: [],
    preferredStyles: []
  },
  customWeights: {
    grammar: 1.0,
    plagiarism: 1.0,
    readability: 1.0,
    technicalAccuracy: 1.0,
    engagement: 1.0,
    clarity: 1.0
  }
};

// Language model mappings for the tiered structure
export const LANGUAGE_MODEL_STRUCTURE = {
  general: {
    name: 'General',
    description: 'Models for everyday writing',
    models: [
      { id: 'standard', name: 'Standard', description: 'Balanced analysis for general text' },
      { id: 'creative', name: 'Creative', description: 'For creative writing and storytelling' }
    ]
  },
  academic: {
    name: 'Academic',
    description: 'Models for scholarly and research writing',
    models: [
      { id: 'academic-general', name: 'Academic', description: 'Optimized for scholarly writing' },
      { id: 'scientific', name: 'Scientific', description: 'For scientific research papers' },
      { id: 'statistical', name: 'Statistical', description: 'For data-heavy academic content' },
      { id: 'legal', name: 'Legal', description: 'For legal documents and research' }
    ]
  },
  business: {
    name: 'Business',
    description: 'Models for professional and commercial writing',
    models: [
      { id: 'business', name: 'Business', description: 'For general business documents' },
      { id: 'marketing', name: 'Marketing', description: 'For persuasive and promotional content' },
      { id: 'technical', name: 'Technical', description: 'For technical specifications and documentation' }
    ]
  },
  specialized: {
    name: 'Specialized',
    description: 'Models for specific professional domains',
    models: [
      { id: 'journalism', name: 'Journalism', description: 'For news articles and media content' },
      { id: 'medical', name: 'Medical', description: 'For healthcare and medical content' },
      { id: 'documentation', name: 'Documentation', description: 'For technical guides and API docs' }
    ]
  }
};

/**
 * Feature flags
 */
export const FEATURES = ENV.FEATURES;
