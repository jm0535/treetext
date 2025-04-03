
import React, { useRef, useEffect } from 'react';
import { useTextAnalysis } from '@/hooks/useTextAnalysis';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Loader2, FileCheck, Trash2, AlertCircle, Settings } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import AnalysisSettings from './AnalysisSettings';

interface EnhancedTextEditorProps {
  className?: string;
}

const EnhancedTextEditor: React.FC<EnhancedTextEditorProps> = ({ className }) => {
  const { 
    currentText, 
    setText, 
    analyzeText, 
    isAnalyzing,
    currentAnalysis,
    clearCurrentAnalysis,
    analysisError,
    settings
  } = useTextAnalysis();
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
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
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" size="icon" aria-label="Settings">
                            <Settings className="h-4 w-4 text-muted-foreground" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-80 p-0" align="end">
                          <AnalysisSettings />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Analysis Settings</p>
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
          
          <textarea
            ref={textareaRef}
            className="w-full h-64 p-4 border rounded-md bg-background resize-none focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-primary"
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
            </div>
            <div className="flex items-center space-x-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div>
                      <Button 
                        onClick={() => analyzeText()}
                        disabled={isAnalyzing || !currentText.trim()}
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
