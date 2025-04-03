
import React, { useState, useEffect } from 'react';
import Navigation from '@/components/Navigation';
import Hero from '@/components/Hero';
import EnhancedTextEditor from '@/components/EnhancedTextEditor';
import ResultsContainer from '@/components/ResultsContainer';
import AnalysisHistory from '@/components/AnalysisHistory';
import FileUploader from '@/components/FileUploader';
import Footer from '@/components/Footer';
import { useTextAnalysis } from '@/hooks/useTextAnalysis';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AnalysisResult } from '@/types';
import { FEATURES } from '@/utils/constants';
import { Type, Upload, History } from 'lucide-react';

const Index = () => {
  const { currentAnalysis, setText, analyzeText } = useTextAnalysis();
  const [activeTab, setActiveTab] = useState<string>('editor');
  const [inputMethod, setInputMethod] = useState<string>('text');
  
  // Handle selecting an analysis from history
  const handleSelectAnalysis = (analysis: AnalysisResult) => {
    // Set the text to the original text from the analysis
    setText(analysis.originalText);
    
    // Switch to the editor tab
    setActiveTab('editor');
    
    // Re-analyze the text to update the results
    analyzeText();
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1">
        <Hero />
        
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setActiveTab('editor')}
                className={`flex items-center px-4 py-2 rounded-md transition-colors ${activeTab === 'editor' ? 'bg-indigo-600 text-white' : 'bg-muted hover:bg-muted/80'}`}
              >
                <Type className="mr-2 h-4 w-4" /> Text Analysis
              </button>
              {FEATURES.HISTORY_TRACKING && (
                <button
                  onClick={() => setActiveTab('history')}
                  className={`flex items-center px-4 py-2 rounded-md transition-colors ${activeTab === 'history' ? 'bg-indigo-600 text-white' : 'bg-muted hover:bg-muted/80'}`}
                >
                  <History className="mr-2 h-4 w-4" /> History
                </button>
              )}
            </div>
          </div>
          
          {activeTab === 'editor' ? (
            <div className="space-y-8">
              <div className="bg-card rounded-lg shadow-sm border overflow-hidden">
                <div className="flex items-center border-b p-2">
                  <button
                    onClick={() => setInputMethod('text')}
                    className={`flex items-center px-4 py-2 rounded-md mr-2 ${inputMethod === 'text' ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-300 font-medium' : 'hover:bg-muted'}`}
                  >
                    <Type className="mr-2 h-4 w-4" /> Text Input
                  </button>
                  <button
                    onClick={() => setInputMethod('file')}
                    className={`flex items-center px-4 py-2 rounded-md ${inputMethod === 'file' ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-300 font-medium' : 'hover:bg-muted'}`}
                  >
                    <Upload className="mr-2 h-4 w-4" /> File Upload
                  </button>
                </div>
                
                <div className="p-0">
                  {inputMethod === 'text' ? (
                    <EnhancedTextEditor className="container mx-auto px-0" />
                  ) : (
                    <div id="file-uploader">
                      <FileUploader className="container mx-auto px-0" />
                    </div>
                  )}
                </div>
              </div>
              
              {currentAnalysis && <ResultsContainer />}
            </div>
          ) : FEATURES.HISTORY_TRACKING && (
            <AnalysisHistory onSelectAnalysis={handleSelectAnalysis} />
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
