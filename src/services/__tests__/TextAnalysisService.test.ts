import { describe, it, expect, vi, beforeEach, afterEach, MockInstance } from 'vitest';
import TextAnalysisService from '../TextAnalysisService';
import ApiClient from '../ApiClient';
import { AnalysisResult } from '@/types';

// Mock the ApiClient
vi.mock('../ApiClient', () => ({
  default: {
    post: vi.fn(),
  },
}));

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value.toString();
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      store = {};
    }),
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('TextAnalysisService', () => {
  const sampleText = 'This is a sample text for analysis.';
  const mockResult: AnalysisResult = {
    id: '123',
    originalText: sampleText,
    plagiarismScore: 95,
    grammarScore: 90,
    readabilityScore: 85,
    plagiarismInstances: [],
    grammarIssues: [],
    readabilityMetrics: {
      fleschKincaidScore: 80,
      avgSentenceLength: 5,
      avgWordLength: 4,
      totalWords: 7,
      totalSentences: 1,
      totalParagraphs: 1,
      readingTime: 0.5,
    },
    date: new Date(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.clear();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('analyzeText', () => {
    it('should call the API and return the result', async () => {
      // Mock API response
      (ApiClient.post as MockInstance).mockResolvedValue(mockResult);

      // Call the service
      const result = await TextAnalysisService.analyzeText(sampleText);

      // Verify API was called
      expect(ApiClient.post).toHaveBeenCalledWith(
        expect.stringContaining('/api/analyze'),
        expect.objectContaining({
          text: sampleText,
          settings: expect.any(Object),
        })
      );

      // Verify result
      expect(result).toEqual(mockResult);
    });

    it('should fall back to local analysis when API fails with server error', async () => {
      // Mock API error
      const apiError = new Error('Server error') as Error & { statusCode: number };
      apiError.statusCode = 500;
      (ApiClient.post as MockInstance).mockRejectedValue(apiError);

      // Call the service
      const result = await TextAnalysisService.analyzeText(sampleText);

      // Verify result has expected structure
      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('originalText', sampleText);
      expect(result).toHaveProperty('plagiarismScore');
      expect(result).toHaveProperty('grammarScore');
      expect(result).toHaveProperty('readabilityScore');
      expect(result).toHaveProperty('plagiarismInstances');
      expect(result).toHaveProperty('grammarIssues');
      expect(result).toHaveProperty('readabilityMetrics');
      expect(result).toHaveProperty('date');
    });

    it('should throw error for empty text', async () => {
      await expect(TextAnalysisService.analyzeText('')).rejects.toThrow('Text is empty');
    });
  });

  describe('getRecentResults', () => {
    it('should return recent results', async () => {
      // Mock API response
      (ApiClient.post as MockInstance).mockResolvedValue(mockResult);

      // Analyze text to add to history
      await TextAnalysisService.analyzeText(sampleText);

      // Get recent results
      const results = TextAnalysisService.getRecentResults();

      // Verify results
      expect(results).toHaveLength(1);
      expect(results[0]).toHaveProperty('originalText', sampleText);
    });

    it('should limit results to specified count', async () => {
      // Mock API response
      (ApiClient.post as MockInstance).mockResolvedValue(mockResult);

      // Analyze text multiple times
      await TextAnalysisService.analyzeText('Text 1');
      await TextAnalysisService.analyzeText('Text 2');
      await TextAnalysisService.analyzeText('Text 3');

      // Get recent results with limit
      const results = TextAnalysisService.getRecentResults(2);

      // Verify results
      expect(results).toHaveLength(2);
    });
  });

  describe('deleteResult', () => {
    it('should delete a result by ID', async () => {
      // Mock API response
      (ApiClient.post as MockInstance).mockResolvedValue(mockResult);

      // Analyze text to add to history
      await TextAnalysisService.analyzeText(sampleText);

      // Get the ID of the first result
      const results = TextAnalysisService.getRecentResults();
      const id = results[0].id;

      // Delete the result
      const success = TextAnalysisService.deleteResult(id);

      // Verify deletion
      expect(success).toBe(true);
      expect(TextAnalysisService.getRecentResults()).toHaveLength(0);
    });

    it('should return false if ID not found', () => {
      const success = TextAnalysisService.deleteResult('nonexistent-id');
      expect(success).toBe(false);
    });
  });

  describe('settings', () => {
    it('should update settings', () => {
      // Update settings
      TextAnalysisService.updateSettings({
        checkPlagiarism: false,
        languageModel: 'academic',
      });

      // Get settings
      const settings = TextAnalysisService.getSettings();

      // Verify settings
      expect(settings.checkPlagiarism).toBe(false);
      expect(settings.languageModel).toBe('academic');
    });
  });
});
