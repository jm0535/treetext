import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import EnhancedResultsDashboard from '../EnhancedResultsDashboard';
import { useTextAnalysis } from '@/hooks/useTextAnalysis';
import { FEATURES } from '@/utils/constants';
import { toast } from '@/hooks/use-toast';

// Mock the hooks
vi.mock('@/hooks/useTextAnalysis');
vi.mock('@/hooks/use-toast');

// Mock window.print
Object.defineProperty(window, 'print', {
  value: vi.fn(),
  writable: true
});

// Mock URL.createObjectURL and URL.revokeObjectURL
global.URL.createObjectURL = vi.fn(() => 'mock-url');
global.URL.revokeObjectURL = vi.fn();

describe('EnhancedResultsDashboard', () => {
  const mockAnalysisResult = {
    id: '123',
    originalText: 'This is a test text',
    plagiarismScore: 95,
    grammarScore: 85,
    readabilityScore: 75,
    plagiarismInstances: [
      {
        id: 'p1',
        text: 'This is a test',
        matchPercentage: 85,
        matchedSource: 'Example Source'
      }
    ],
    grammarIssues: [
      {
        id: 'g1',
        text: 'This is a test',
        issueType: 'Grammar Error',
        suggestion: 'Fix this'
      }
    ],
    readabilityMetrics: {
      fleschKincaidScore: 70,
      avgSentenceLength: 5,
      avgWordLength: 4,
      totalWords: 5,
      totalSentences: 1,
      totalParagraphs: 1,
      readingTime: 0.5
    },
    date: new Date()
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders no results message when no analysis is available', () => {
    // Mock the hook to return no analysis
    vi.mocked(useTextAnalysis).mockReturnValue({
      currentAnalysis: null,
      analyzeText: vi.fn(),
      currentText: '',
      isAnalyzing: false,
      analysisError: null,
      setText: vi.fn(),
      clearCurrentAnalysis: vi.fn(),
      recentAnalyses: [],
      updateSettings: vi.fn(),
      deleteAnalysis: vi.fn(),
      clearAllAnalyses: vi.fn(),
      settings: {
        checkPlagiarism: true,
        checkGrammar: true,
        checkReadability: true,
        languageModel: 'standard'
      }
    });

    render(<EnhancedResultsDashboard />);
    
    expect(screen.getByText('No Analysis Results')).toBeInTheDocument();
    expect(screen.getByText('Enter text and run an analysis to see results here')).toBeInTheDocument();
  });

  it('renders analysis results when available', () => {
    // Mock the hook to return analysis
    vi.mocked(useTextAnalysis).mockReturnValue({
      currentAnalysis: mockAnalysisResult,
      analyzeText: vi.fn(),
      currentText: 'This is a test text',
      isAnalyzing: false,
      analysisError: null,
      setText: vi.fn(),
      clearCurrentAnalysis: vi.fn(),
      recentAnalyses: [mockAnalysisResult],
      updateSettings: vi.fn(),
      deleteAnalysis: vi.fn(),
      clearAllAnalyses: vi.fn(),
      settings: {
        checkPlagiarism: true,
        checkGrammar: true,
        checkReadability: true,
        languageModel: 'standard'
      }
    });

    render(<EnhancedResultsDashboard />);
    
    // Check if the scores are displayed
    expect(screen.getByText('95%')).toBeInTheDocument();
    expect(screen.getByText('85%')).toBeInTheDocument();
    expect(screen.getByText('75%')).toBeInTheDocument();
    
    // Check if the tabs are present
    expect(screen.getByRole('tab', { name: /plagiarism/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /grammar/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /readability/i })).toBeInTheDocument();
  });

  it('allows switching between tabs', async () => {
    // Mock the hook to return analysis
    vi.mocked(useTextAnalysis).mockReturnValue({
      currentAnalysis: mockAnalysisResult,
      analyzeText: vi.fn(),
      currentText: 'This is a test text',
      isAnalyzing: false,
      analysisError: null,
      setText: vi.fn(),
      clearCurrentAnalysis: vi.fn(),
      recentAnalyses: [mockAnalysisResult],
      updateSettings: vi.fn(),
      deleteAnalysis: vi.fn(),
      clearAllAnalyses: vi.fn(),
      settings: {
        checkPlagiarism: true,
        checkGrammar: true,
        checkReadability: true,
        languageModel: 'standard'
      }
    });

    render(<EnhancedResultsDashboard />);
    
    // Default tab is plagiarism
    expect(screen.getByText('Originality Score')).toBeInTheDocument();
    
    // Switch to grammar tab
    fireEvent.click(screen.getByRole('tab', { name: /grammar/i }));
    expect(screen.getByText('Grammar Score')).toBeInTheDocument();
    
    // Switch to readability tab
    fireEvent.click(screen.getByRole('tab', { name: /readability/i }));
    expect(screen.getByText('Readability Score')).toBeInTheDocument();
  });

  it('handles refresh analysis', async () => {
    const mockAnalyzeText = vi.fn();
    
    // Mock the hook
    vi.mocked(useTextAnalysis).mockReturnValue({
      currentAnalysis: mockAnalysisResult,
      analyzeText: mockAnalyzeText,
      currentText: 'This is a test text',
      isAnalyzing: false,
      analysisError: null,
      setText: vi.fn(),
      clearCurrentAnalysis: vi.fn(),
      recentAnalyses: [mockAnalysisResult],
      updateSettings: vi.fn(),
      deleteAnalysis: vi.fn(),
      clearAllAnalyses: vi.fn(),
      settings: {
        checkPlagiarism: true,
        checkGrammar: true,
        checkReadability: true,
        languageModel: 'standard'
      }
    });

    render(<EnhancedResultsDashboard />);
    
    // Click refresh button
    fireEvent.click(screen.getByRole('button', { name: /refresh/i }));
    
    // Check if analyzeText was called
    expect(mockAnalyzeText).toHaveBeenCalledTimes(1);
  });

  it('handles export results', async () => {
    // Mock document.createElement and appendChild
    const mockAnchor = {
      href: '',
      download: '',
      click: vi.fn()
    };
    
    document.createElement = vi.fn().mockImplementation((tag) => {
      if (tag === 'a') return mockAnchor;
      return document.createElement(tag);
    });
    
    document.body.appendChild = vi.fn();
    document.body.removeChild = vi.fn();
    
    // Mock the hook
    vi.mocked(useTextAnalysis).mockReturnValue({
      currentAnalysis: mockAnalysisResult,
      analyzeText: vi.fn(),
      currentText: 'This is a test text',
      isAnalyzing: false,
      analysisError: null,
      setText: vi.fn(),
      clearCurrentAnalysis: vi.fn(),
      recentAnalyses: [mockAnalysisResult],
      updateSettings: vi.fn(),
      deleteAnalysis: vi.fn(),
      clearAllAnalyses: vi.fn(),
      settings: {
        checkPlagiarism: true,
        checkGrammar: true,
        checkReadability: true,
        languageModel: 'standard'
      }
    });

    // Mock FEATURES
    const originalFeatures = { ...FEATURES };
    FEATURES.EXPORT_RESULTS = true;

    render(<EnhancedResultsDashboard />);
    
    // Click export button
    fireEvent.click(screen.getByRole('button', { name: /export/i }));
    
    // Check if the export functionality was triggered
    expect(mockAnchor.click).toHaveBeenCalledTimes(1);
    expect(toast).toHaveBeenCalledWith(expect.objectContaining({
      title: "Export Successful"
    }));
    
    // Restore original features
    Object.assign(FEATURES, originalFeatures);
  });

  it('handles print functionality', () => {
    // Mock the hook
    vi.mocked(useTextAnalysis).mockReturnValue({
      currentAnalysis: mockAnalysisResult,
      analyzeText: vi.fn(),
      currentText: 'This is a test text',
      isAnalyzing: false,
      analysisError: null,
      setText: vi.fn(),
      clearCurrentAnalysis: vi.fn(),
      recentAnalyses: [mockAnalysisResult],
      updateSettings: vi.fn(),
      deleteAnalysis: vi.fn(),
      clearAllAnalyses: vi.fn(),
      settings: {
        checkPlagiarism: true,
        checkGrammar: true,
        checkReadability: true,
        languageModel: 'standard'
      }
    });

    render(<EnhancedResultsDashboard />);
    
    // Click print button
    fireEvent.click(screen.getByRole('button', { name: /print/i }));
    
    // Check if window.print was called
    expect(window.print).toHaveBeenCalledTimes(1);
  });
});
