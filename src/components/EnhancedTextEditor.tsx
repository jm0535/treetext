
import React, { useRef, useEffect, useState } from 'react';
import { useTextAnalysis } from '@/hooks/useTextAnalysis';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Loader2, FileCheck, Trash2, AlertCircle, Settings, Lock, Timer } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import AnalysisSettings from './AnalysisSettings';

import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface EnhancedTextEditorProps {
  className?: string;
}

const EnhancedTextEditor: React.FC<EnhancedTextEditorProps> = ({ className }) => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const {
    currentText,
    setText,
    analyzeText,
    isAnalyzing,
    analysisProgress,
    analysisETA,
    currentAnalysis,
    clearCurrentAnalysis,
    analysisError,
    settings
  } = useTextAnalysis();

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);

  // Auto-focus the textarea when the component mounts
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, []);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };

  // Handle paste events to clean up text
  const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    // Let the default paste happen, then process the text
    setTimeout(() => {
      if (textareaRef.current) {
        // Clean up any potential formatting issues
        setText(textareaRef.current.value);
      }
    }, 0);
  };

  const handleClearText = () => {
    setText('');
    clearCurrentAnalysis();

    // Re-focus the textarea after clearing
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  const getWordCount = () => {
    if (!currentText.trim()) return 0;
    return currentText.trim().split(/\s+/).length;
  };

  const getCharCount = () => {
    return currentText.length;
  };

  return (
    <div id="text-editor" className={`py-8 ${className || ''}`}>
      <Card className="w-full">
        <CardContent className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-medium">Enter text to analyze</h3>
            <div className="flex items-center space-x-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div>
                      {!isAuthenticated ? (
                        <Button
                          variant="outline"
                          size="icon"
                          aria-label="Settings"
                          onClick={() => navigate('/signin')}
                          className="border-primary/20 hover:bg-primary/5"
                        >
                          <Lock className="h-4 w-4 text-primary" />
                        </Button>
                      ) : (
                        <Popover open={settingsOpen} onOpenChange={setSettingsOpen}>
                          <PopoverTrigger asChild>
                            <Button variant="outline" size="icon" aria-label="Settings">
                              <Settings className="h-4 w-4 text-muted-foreground" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-[550px] p-0 max-h-[85vh]" align="end" sideOffset={5}>
                            <AnalysisSettings onClose={() => setSettingsOpen(false)} />
                          </PopoverContent>
                        </Popover>
                      )}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{isAuthenticated ? "Analysis Settings" : "Sign in for analysis settings"}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              {currentText && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleClearText}
                        className="text-muted-foreground hover:text-destructive"
                        aria-label="Clear text"
                      >
                        <Trash2 className="h-4 w-4 mr-1 text-red-500" /> Clear
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Clear all text</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
          </div>

          {analysisError && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{analysisError}</AlertDescription>
            </Alert>
          )}

          {isAnalyzing && (
            <div className="mb-4 space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="flex justify-between items-center text-xs font-medium">
                <div className="flex items-center gap-1.5 text-primary">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                  Analyzing Text...
                </div>
                <div className="flex items-center gap-3">
                  {analysisETA !== null && analysisETA > 0 && (
                    <span className="text-muted-foreground flex items-center gap-1">
                      <Timer className="h-3 w-3" />
                      ETA: {analysisETA}s
                    </span>
                  )}
                  <span className="text-primary font-bold">{Math.round(analysisProgress)}%</span>
                </div>
              </div>
              <Progress value={analysisProgress} className="h-1.5 transition-all" />
              <p className="text-[10px] text-muted-foreground italic">
                {analysisProgress < 20 && "Calculating initial scores..."}
                {analysisProgress >= 20 && analysisProgress < 40 && "Processing readability metrics..."}
                {analysisProgress >= 40 && analysisProgress < 75 && "Detecting potential plagiarism (semantic analysis)..."}
                {analysisProgress >= 75 && analysisProgress < 100 && "Running deep grammar and style checks..."}
                {analysisProgress === 100 && "Finalizing results..."}
              </p>
            </div>
          )}

          <textarea
            ref={textareaRef}
            className="w-full h-64 p-4 border rounded-md bg-background resize-none focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-primary shadow-inner"
            placeholder="Paste or type your text here to check for plagiarism and grammar issues..."
            value={currentText}
            onChange={handleTextChange}
            onPaste={handlePaste}
            disabled={isAnalyzing}
            aria-label="Text to analyze"
            aria-describedby="text-editor-description"
            data-gramm="false"
            data-gramm_editor="false"
            data-enable-grammarly="false"
            spellCheck="false"
          />
          <p id="text-editor-description" className="sr-only">
            Enter your text here to analyze for plagiarism, grammar issues, and readability.
          </p>

          <CardFooter className="px-0 pt-4 pb-0 flex justify-between items-center">
            <div className="text-sm text-muted-foreground">
              {currentText ? (
                <>
                  <span className="font-medium">{getWordCount()}</span> words,
                  <span className="font-medium">{getCharCount()}</span> characters
                </>
              ) : (
                'Enter text to begin analysis'
              )}
              {!isAuthenticated && getCharCount() > 500 && (
                <span className="ml-2 text-destructive font-medium flex items-center gap-1 animate-pulse">
                  <Lock className="h-3 w-3" />
                  Sign in for longer texts (limit: 500 charts)
                </span>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div>
                      <Button
                        onClick={() => {
                          if (!isAuthenticated && getCharCount() > 500) {
                            navigate('/signin');
                            return;
                          }
                          analyzeText();
                        }}
                        disabled={isAnalyzing || !currentText.trim() || (!isAuthenticated && getCharCount() > 500)}
                        className="relative"
                        aria-label={isAnalyzing ? "Analyzing text..." : "Analyze text"}
                      >
                        {isAnalyzing ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Analyzing...
                          </>
                        ) : (
                          <>
                            <FileCheck className="mr-2 h-4 w-4" />
                            {currentAnalysis ? 'Re-analyze Text' : 'Analyze Text'}
                          </>
                        )}

                        {/* Show active settings as indicators */}
                        <div className="absolute -top-1 -right-1 flex space-x-1">
                          {settings.checkPlagiarism && (
                            <span className="w-2 h-2 rounded-full bg-green-500" title="Plagiarism detection enabled"></span>
                          )}
                          {settings.checkGrammar && (
                            <span className="w-2 h-2 rounded-full bg-blue-500" title="Grammar checking enabled"></span>
                          )}
                          {settings.checkReadability && (
                            <span className="w-2 h-2 rounded-full bg-purple-500" title="Readability analysis enabled"></span>
                          )}
                        </div>
                      </Button>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{isAnalyzing ? "Analysis in progress..." : "Analyze your text"}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </CardFooter>
        </CardContent>
      </Card>
    </div>
  );
};

export default EnhancedTextEditor;
