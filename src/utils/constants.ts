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
  AUTH_TOKEN: 'treetext_auth_token'
};

/**
 * Default analysis settings
 */
export const DEFAULT_ANALYSIS_SETTINGS = {
  checkPlagiarism: true,
  checkGrammar: true,
  checkReadability: true,
  languageModel: 'standard'
};

/**
 * Feature flags
 */
export const FEATURES = ENV.FEATURES;
