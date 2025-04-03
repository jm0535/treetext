import { describe, it, expect, vi, beforeEach, MockInstance } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useTextAnalysis } from '../useTextAnalysis';
import { TextAnalysisProvider } from '@/contexts/TextAnalysisContext.tsx';
import TextAnalysisService from '@/services/TextAnalysisService';
import React from 'react';

// Mock TextAnalysisService
vi.mock('@/services/TextAnalysisService', () => ({
  default: {
    analyzeText: vi.fn(),
    getRecentResults: vi.fn(),
    getSettings: vi.fn(),
    updateSettings: vi.fn(),
    deleteResult: vi.fn(),
    clearAllResults: vi.fn(),
  },
}));

// Mock toast
vi.mock('@/hooks/use-toast', () => ({
  toast: vi.fn(),
}));

describe('useTextAnalysis', () => {
  // Mock data
  const mockText = 'This is a test text';
  const mockAnalysisResult = {
    id: '123',
    originalText: mockText,
    plagiarismScore: 90,
    grammarScore: 85,
    readabilityScore: 80,
    plagiarismInstances: [],
    grammarIssues: [],
    readabilityMetrics: {
      fleschKincaidScore: 75,
      avgSentenceLength: 5,
      avgWordLength: 4,
      totalWords: 5,
      totalSentences: 1,
      totalParagraphs: 1,
      readingTime: 0.5,
    },
    date: new Date(),
  };

  // Setup wrapper for the hook
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <TextAnalysisProvider>{children}</TextAnalysisProvider>
  );

  beforeEach(() => {
    vi.clearAllMocks();
    // Mock service methods
    (TextAnalysisService.getRecentResults as MockInstance).mockReturnValue([]);
    (TextAnalysisService.getSettings as MockInstance).mockReturnValue({
      checkPlagiarism: true,
      checkGrammar: true,
      checkReadability: true,
      languageModel: 'standard',
    });
  });

  it('should set text correctly', () => {
    const { result } = renderHook(() => useTextAnalysis(), { wrapper });

    act(() => {
      result.current.setText(mockText);
    });

    expect(result.current.currentText).toBe(mockText);
  });

  it('should analyze text correctly', async () => {
    // Mock successful analysis
    (TextAnalysisService.analyzeText as MockInstance).mockResolvedValue(mockAnalysisResult);
    (TextAnalysisService.getRecentResults as MockInstance).mockReturnValue([mockAnalysisResult]);

    const { result } = renderHook(() => useTextAnalysis(), { wrapper });

    // Set text
    act(() => {
      result.current.setText(mockText);
    });

    // Analyze text
    await act(async () => {
      await result.current.analyzeText();
    });

    // Verify service was called
    expect(TextAnalysisService.analyzeText).toHaveBeenCalledWith(mockText);

    // Verify state was updated
    expect(result.current.currentAnalysis).toEqual(mockAnalysisResult);
    expect(result.current.recentAnalyses).toEqual([mockAnalysisResult]);
    expect(result.current.isAnalyzing).toBe(false);
  });

  it('should handle analysis error', async () => {
    // Mock failed analysis
    const mockError = new Error('Analysis failed');
    (TextAnalysisService.analyzeText as MockInstance).mockRejectedValue(mockError);

    const { result } = renderHook(() => useTextAnalysis(), { wrapper });

    // Set text
    act(() => {
      result.current.setText(mockText);
    });

    // Analyze text
    await act(async () => {
      await result.current.analyzeText();
    });

    // Verify error handling
    expect(result.current.analysisError).toBe(mockError.message);
    expect(result.current.isAnalyzing).toBe(false);
  });

  it('should clear current analysis', () => {
    const { result } = renderHook(() => useTextAnalysis(), { wrapper });

    // Set mock analysis
    act(() => {
      // @ts-expect-error - directly setting state for testing
      result.current.currentAnalysis = mockAnalysisResult;
    });

    // Clear analysis
    act(() => {
      result.current.clearCurrentAnalysis();
    });

    expect(result.current.currentAnalysis).toBeNull();
  });

  it('should update settings', () => {
    const { result } = renderHook(() => useTextAnalysis(), { wrapper });

    const newSettings = {
      checkPlagiarism: false,
      languageModel: 'academic' as const,
    };

    act(() => {
      result.current.updateSettings(newSettings);
    });

    expect(TextAnalysisService.updateSettings).toHaveBeenCalledWith(newSettings);
  });

  it('should delete analysis', () => {
    // Mock successful deletion
    (TextAnalysisService.deleteResult as MockInstance).mockReturnValue(true);
    (TextAnalysisService.getRecentResults as MockInstance).mockReturnValue([]);

    const { result } = renderHook(() => useTextAnalysis(), { wrapper });

    act(() => {
      result.current.deleteAnalysis('123');
    });

    expect(TextAnalysisService.deleteResult).toHaveBeenCalledWith('123');
    expect(result.current.recentAnalyses).toEqual([]);
  });

  it('should clear all analyses', () => {
    const { result } = renderHook(() => useTextAnalysis(), { wrapper });

    act(() => {
      result.current.clearAllAnalyses();
    });

    expect(TextAnalysisService.clearAllResults).toHaveBeenCalled();
    expect(result.current.recentAnalyses).toEqual([]);
    expect(result.current.currentAnalysis).toBeNull();
  });
});
