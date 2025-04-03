/**
 * Environment configuration for the TreeText application
 * This centralizes all environment variable access and provides defaults
 */

// Application environment
export const ENV = {
  // Current environment
  NODE_ENV: import.meta.env.MODE || 'development',
  
  // API configuration
  API: {
    USE_API: import.meta.env.VITE_USE_API === 'true' || false,
    BASE_URL: import.meta.env.VITE_API_BASE_URL || '',
    TIMEOUT: Number(import.meta.env.VITE_API_TIMEOUT) || 30000,
    RETRY_ATTEMPTS: Number(import.meta.env.VITE_API_RETRY_ATTEMPTS) || 3,
  },
  
  // Feature flags
  FEATURES: {
    EXPORT_RESULTS: import.meta.env.VITE_FEATURE_EXPORT === 'true' || true,
    REAL_TIME_ANALYSIS: import.meta.env.VITE_FEATURE_REAL_TIME === 'true' || false,
    USER_AUTHENTICATION: import.meta.env.VITE_FEATURE_AUTH === 'true' || false,
    HISTORY_TRACKING: import.meta.env.VITE_FEATURE_HISTORY === 'true' || true,
  },
  
  // Application metadata
  APP: {
    NAME: 'TreeText',
    VERSION: import.meta.env.VITE_APP_VERSION || '1.0.0',
    DESCRIPTION: 'Advanced text analysis for plagiarism, grammar, and readability',
  }
};

/**
 * Check if the application is running in production
 */
export const isProd = ENV.NODE_ENV === 'production';

/**
 * Check if the application is running in development
 */
export const isDev = ENV.NODE_ENV === 'development';

/**
 * Check if the application is running in test mode
 */
export const isTest = ENV.NODE_ENV === 'test';

export default ENV;
