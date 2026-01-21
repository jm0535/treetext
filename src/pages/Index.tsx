
import React, { useState, useEffect } from 'react';
import Hero from '@/components/Hero';
import EnhancedTextEditor from '@/components/EnhancedTextEditor';
import ResultsContainer from '@/components/ResultsContainer';
import AnalysisHistory from '@/components/AnalysisHistory';
import FileUploader from '@/components/FileUploader';
import UsageStats from '@/components/UsageStats';
import { useTextAnalysis } from '@/hooks/useTextAnalysis';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AnalysisResult } from '@/types';
import { FEATURES } from '@/utils/constants';
import { Type, Upload, History as HistoryIcon } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const Index = () => {
  const { currentAnalysis, setText, analyzeText } = useTextAnalysis();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<string>('editor');
  const [inputMethod, setInputMethod] = useState<string>('text');
  const location = useLocation();

  // Check for inputMethod in location state on component mount
  useEffect(() => {
    // Check if we have state passed from navigation
    if (location.state && location.state.inputMethod) {
      setInputMethod(location.state.inputMethod);
    }

    // Also check URL parameters for backward compatibility
    const params = new URLSearchParams(location.search);
    const modeParam = params.get('mode');
    if (modeParam === 'file') {
      setInputMethod('file');
    }
  }, [location]);

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
    <>
      <Hero onInputMethodChange={setInputMethod} />

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
                  <HistoryIcon className="mr-2 h-4 w-4" /> History
                </button>
              )}
            </div>
          </div>

          {activeTab === 'editor' ? (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {/* Main content area - 3/4 width on medium screens and up */}
              <div className="md:col-span-3 space-y-8">
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

              {/* Sidebar - 1/4 width on medium screens and up */}
              <div className="md:col-span-1 space-y-6">
                <UsageStats />
              </div>
            </div>
          ) : FEATURES.HISTORY_TRACKING && (
            isAuthenticated ? (
              <AnalysisHistory onSelectAnalysis={handleSelectAnalysis} />
            ) : (
              <Card className="p-12 text-center bg-muted/30 border-dashed border-2">
                <div className="flex flex-col items-center justify-center space-y-4">
                  <div className="p-4 bg-primary/10 rounded-full">
                    <HistoryIcon className="h-10 w-10 text-primary" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold">Sign in to View History</h3>
                    <p className="text-muted-foreground max-w-sm mx-auto">
                      All your previous analyses are securely stored in your account so you can access them from any device.
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <Button onClick={() => navigate('/signin')}>Sign In</Button>
                    <Button variant="outline" onClick={() => navigate('/signup')}>Create Account</Button>
                  </div>
                </div>
              </Card>
            )
          )}
        </div>
    </>
  );
};

export default Index;
