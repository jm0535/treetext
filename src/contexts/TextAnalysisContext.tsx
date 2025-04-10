
import React, { useState, useEffect, ReactNode } from 'react';
import TextAnalysisService from '@/services/TextAnalysisService';
import { AnalysisResult, AnalysisSettings } from '@/types';
import { toast } from '@/hooks/use-toast';
import { FEATURES } from '@/utils/constants';
import { TextAnalysisContext } from './TextAnalysisContext.context';



export const TextAnalysisProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentText, setCurrentText] = useState<string>('');
  const [currentAnalysis, setCurrentAnalysis] = useState<AnalysisResult | null>(null);
  const [recentAnalyses, setRecentAnalyses] = useState<AnalysisResult[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [settings, setSettings] = useState<AnalysisSettings>(TextAnalysisService.getSettings());
  
  // Load recent analyses on mount
  useEffect(() => {
    const loadRecentAnalyses = async () => {
      const analyses = await TextAnalysisService.getRecentResults();
      setRecentAnalyses(analyses);
    };
    
    loadRecentAnalyses();
  }, []);

  const setText = (text: string) => {
    setCurrentText(text);
    setAnalysisError(null);
    
    // If real-time analysis is enabled, analyze text after a delay
    if (FEATURES.REAL_TIME_ANALYSIS && text.trim().length > 50) {
      const timeoutId = setTimeout(() => {
        analyzeText();
      }, 1500);
      
      return () => clearTimeout(timeoutId);
    }
  };

  const analyzeText = async () => {
    if (!currentText.trim()) {
      toast({
        title: "Empty Text",
        description: "Please enter some text to analyze.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsAnalyzing(true);
      setAnalysisError(null);
      
      // Ensure settings are properly initialized before analysis
      const currentSettings = TextAnalysisService.getSettings();
      const needsUpdate = !currentSettings.languageModel || !currentSettings.languageModelCategory;

      if (needsUpdate) {
        // If either language model field is not defined, update with default settings
        TextAnalysisService.updateSettings({
          languageModel: currentSettings.languageModel || 'standard',
          languageModelCategory: currentSettings.languageModelCategory || 'general'
        });
        // Update local state with the new settings
        setSettings(TextAnalysisService.getSettings());
      }
      
      const result = await TextAnalysisService.analyzeText(currentText);
      setCurrentAnalysis(result);
      
      // Update recent analyses
      const analyses = await TextAnalysisService.getRecentResults();
      setRecentAnalyses(analyses);
      
      toast({
        title: "Analysis Complete",
        description: "Your text has been analyzed successfully.",
      });
    } catch (error) {
      console.error("Failed to analyze text:", error);

      const errorMessage = error instanceof Error 
        ? error.message 
        : "There was an error analyzing your text. Please try again.";
      
      setAnalysisError(errorMessage);
      
      toast({
        title: "Analysis Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const clearCurrentAnalysis = () => {
    setCurrentAnalysis(null);
    setAnalysisError(null);
  };
  
  const deleteAnalysis = async (id: string) => {
    try {
      // Remove from service
      const success = await TextAnalysisService.deleteResult(id);
      
      if (success) {
        // Update state
        const analyses = await TextAnalysisService.getRecentResults();
        setRecentAnalyses(analyses);
        
        // If the current analysis was deleted, clear it
        if (currentAnalysis && currentAnalysis.id === id) {
          setCurrentAnalysis(null);
        }
        
        toast({
          title: "Analysis Deleted",
          description: "The analysis has been removed from your history.",
        });
      }
    } catch (error) {
      console.error("Failed to delete analysis:", error);
      toast({
        title: "Delete Failed",
        description: "There was an error deleting the analysis. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  const clearAllAnalyses = async () => {
    try {
      // Clear all analyses from service
      await TextAnalysisService.clearAllResults();
      
      // Update state
      setRecentAnalyses([]);
      setCurrentAnalysis(null);
      
      toast({
        title: "History Cleared",
        description: "All analyses have been removed from your history.",
      });
    } catch (error) {
      console.error("Failed to clear analyses:", error);
      toast({
        title: "Clear Failed",
        description: "There was an error clearing your history. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  const updateSettings = (newSettings: Partial<AnalysisSettings>) => {
    // Update settings in service
    TextAnalysisService.updateSettings(newSettings);
    
    // Update state
    setSettings(TextAnalysisService.getSettings());
    
    toast({
      title: "Settings Updated",
      description: "Your analysis settings have been updated.",
    });
  };
  
  const exportAnalysisAsPDF = async (analysis: AnalysisResult) => {
    try {
      // In a real implementation, this would use a PDF generation library
      // For now, we'll just show a toast
      toast({
        title: "Export Feature",
        description: "PDF export will be available in a future update.",
      });
    } catch (error) {
      console.error("Failed to export analysis as PDF:", error);
      toast({
        title: "Export Failed",
        description: "There was an error exporting your analysis. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  const exportAnalysisAsText = (analysis: AnalysisResult) => {
    try {
      // Create a text representation of the analysis
      const text = [
        `TreeText Analysis Report - ${new Date(analysis.date).toLocaleString()}`,
        `\nOriginal Text:\n${analysis.originalText}`,
        `\nScores:\n- Originality: ${analysis.plagiarismScore.toFixed(1)}%`,
        `- Grammar: ${analysis.grammarScore.toFixed(1)}%`,
        `- Readability: ${analysis.readabilityScore.toFixed(1)}%`,
        `\nReadability Metrics:\n- Flesch-Kincaid Score: ${analysis.readabilityMetrics.fleschKincaidScore.toFixed(1)}`,
        `- Average Sentence Length: ${analysis.readabilityMetrics.avgSentenceLength.toFixed(1)} words`,
        `- Total Words: ${analysis.readabilityMetrics.totalWords}`,
        `- Reading Time: ${analysis.readabilityMetrics.readingTime} minutes`,
      ].join('\n');
      
      // Create a download link
      const element = document.createElement('a');
      const file = new Blob([text], {type: 'text/plain'});
      element.href = URL.createObjectURL(file);
      element.download = `treetext-analysis-${new Date().toISOString().slice(0, 10)}.txt`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
      
      toast({
        title: "Export Complete",
        description: "Your analysis has been exported as a text file.",
      });
    } catch (error) {
      console.error("Failed to export analysis as text:", error);
      toast({
        title: "Export Failed",
        description: "There was an error exporting your analysis. Please try again.",
        variant: "destructive",
      });
    }
  };

  const value = {
    currentText,
    currentAnalysis,
    recentAnalyses,
    isAnalyzing,
    analysisError,
    settings,
    setText,
    analyzeText,
    clearCurrentAnalysis,
    deleteAnalysis,
    clearAllAnalyses,
    updateSettings,
    exportAnalysisAsPDF,
    exportAnalysisAsText,
  };

  return (
    <TextAnalysisContext.Provider value={value}>
      {children}
    </TextAnalysisContext.Provider>
  );
};


