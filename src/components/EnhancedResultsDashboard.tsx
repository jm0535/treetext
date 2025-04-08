import React, { useState, useCallback, useEffect } from 'react';
import { useTextAnalysis } from '@/hooks/useTextAnalysis';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  CardFooter 
} from '@/components/ui/card';
import { motion, AnimatePresence } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart, 
  FileText, 
  AlertTriangle, 
  BookOpen, 
  ExternalLink,
  Download,
  Printer,
  Share2,
  RefreshCw,
  AlertCircle,
  Edit,
  Mail,
  Link2,
  Clock,
  FileCheck
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/hooks/use-toast';
import { FEATURES } from '@/utils/constants';
import {
  PlagiarismInstance,
  GrammarIssue,
  ReadabilityMetrics
} from '@/types';

// This component ID helps prevent duplicate rendering
const dashboardInstanceId = 'primary-results-dashboard';

const EnhancedResultsDashboard: React.FC = () => {
  const { currentAnalysis, analyzeText, currentText, isAnalyzing, analysisError } = useTextAnalysis();
  const [activeTab, setActiveTab] = useState('plagiarism');
  const [isExporting, setIsExporting] = useState(false);
  const [animateIn, setAnimateIn] = useState(false);
  
  // Trigger animation when analysis is complete and check for duplicates
  useEffect(() => {
    // First, check if this dashboard is already rendered elsewhere
    const dashboards = document.querySelectorAll(`[data-dashboard-id="${dashboardInstanceId}"]`);
    
    // If this is the first one (no duplicates) and we have analysis results
    if (dashboards.length <= 1 && currentAnalysis && !isAnalyzing) {
      setAnimateIn(true);
    } else if (dashboards.length > 1) {
      // If this is a duplicate instance (not the first one), don't render it
      setAnimateIn(false);
    }
  }, [currentAnalysis, isAnalyzing]);
  
  // Handle refreshing the analysis
  const handleRefreshAnalysis = useCallback(() => {
    if (currentText && currentText.trim().length > 0) {
      analyzeText();
      toast({
        title: "Refreshing analysis",
        description: "Your text is being analyzed again.",
        duration: 3000,
      });
    } else {
      toast({
        title: "No Text to Analyze",
        description: "Please enter some text before refreshing the analysis.",
        variant: "destructive",
      });
    }
  }, [currentText, analyzeText]);
  
  // Helper function to get color based on score with more vibrant colors
  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-emerald-500";
    if (score >= 70) return "text-amber-500";
    return "text-rose-600";
  };
  
  // Helper function to get progress color based on score with more vibrant colors
  const getProgressColor = (score: number) => {
    if (score >= 90) return "bg-emerald-500";
    if (score >= 70) return "bg-amber-500";
    return "bg-rose-600";
  };
  
  // Helper function to get severity badge
  const getSeverityBadge = (matchPercentage: number) => {
    if (matchPercentage >= 80) {
      return <Badge variant="destructive">High</Badge>;
    } else if (matchPercentage >= 50) {
      return <Badge variant="default" className="bg-yellow-500">Medium</Badge>;
    } else {
      return <Badge variant="outline">Low</Badge>;
    }
  };
  
  // Helper function to get readability label
  const getReadabilityLabel = (score: number) => {
    if (score >= 90) return "Very Easy";
    if (score >= 80) return "Easy";
    if (score >= 70) return "Fairly Easy";
    if (score >= 60) return "Standard";
    if (score >= 50) return "Fairly Difficult";
    if (score >= 30) return "Difficult";
    return "Very Difficult";
  };
  
  // Export the analysis results as a text file
  const exportResults = useCallback(() => {
    if (!currentAnalysis || !FEATURES.EXPORT_RESULTS) return;
    
    try {
      setIsExporting(true);
      
      // Create text content from analysis
      let content = "TREETEXT ANALYSIS RESULTS\n";
      content += "=========================\n\n";
      content += `Date: ${currentAnalysis.date.toLocaleString()}\n\n`;
      
      content += `ORIGINALITY SCORE: ${Math.round(currentAnalysis.plagiarismScore)}%\n`;
      content += `GRAMMAR SCORE: ${Math.round(currentAnalysis.grammarScore)}%\n`;
      content += `READABILITY SCORE: ${Math.round(currentAnalysis.readabilityScore)}%\n\n`;
      
      content += `READABILITY METRICS\n`;
      content += `Flesch-Kincaid Score: ${currentAnalysis.readabilityMetrics.fleschKincaidScore}\n`;
      content += `Average Sentence Length: ${currentAnalysis.readabilityMetrics.avgSentenceLength.toFixed(1)} words\n`;
      content += `Average Word Length: ${currentAnalysis.readabilityMetrics.avgWordLength.toFixed(1)} characters\n`;
      content += `Total Words: ${currentAnalysis.readabilityMetrics.totalWords}\n`;
      content += `Total Sentences: ${currentAnalysis.readabilityMetrics.totalSentences}\n`;
      content += `Total Paragraphs: ${currentAnalysis.readabilityMetrics.totalParagraphs}\n\n`;
      
      if (currentAnalysis.plagiarismInstances.length > 0) {
        content += "POTENTIAL MATCHING CONTENT:\n";
        currentAnalysis.plagiarismInstances.forEach((instance, index) => {
          content += `Match ${index + 1}: ${instance.matchPercentage}% match\n`;
          content += `Source: ${instance.source}\n`;
          content += `Text: "${instance.text}"\n\n`;
        });
      } else {
        content += "No significant matching content detected.\n\n";
      }
      
      if (currentAnalysis.grammarIssues.length > 0) {
        content += "GRAMMAR ISSUES:\n";
        currentAnalysis.grammarIssues.forEach((issue, index) => {
          content += `Issue ${index + 1}: ${issue.type}\n`;
          content += `Text: "${issue.text}"\n`;
          content += `Suggestion: ${issue.suggestion}\n\n`;
        });
      } else {
        content += "No significant grammar issues detected.\n\n";
      }
      
      // Create a blob and download it
      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `treetext-analysis-${new Date().toISOString().slice(0, 10)}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Export Complete",
        description: "Your analysis results have been exported as a text file.",
        duration: 3000,
      });
    } catch (error) {
      console.error("Error exporting results:", error);
      toast({
        title: "Export Failed",
        description: "There was an error exporting your results.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  }, [currentAnalysis]);

  // Render the plagiarism tab content
  const renderPlagiarismTab = () => {
    const { plagiarismInstances, plagiarismScore } = currentAnalysis;
    return (
      <div>
        <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="text-xl font-bold mb-1 text-emerald-700 dark:text-emerald-400">Originality Score</h3>
            <p className="text-muted-foreground text-sm">
              Higher score indicates more original content
            </p>
          </div>
          <div className="mt-4 md:mt-0 text-center">
            <span className={`text-4xl font-bold ${getScoreColor(plagiarismScore)}`}>
              {Math.round(plagiarismScore)}%
            </span>
          </div>
        </div>
        
        <Progress 
          value={plagiarismScore} 
          className={`h-2 mb-8 ${getProgressColor(plagiarismScore)}`} 
        />
        
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-4 text-emerald-700 dark:text-emerald-400">Potential Matching Content</h3>
          {plagiarismInstances.length === 0 ? (
            <div className="bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded-md border-l-4 border-emerald-400 dark:border-emerald-600 shadow-sm">
              <p className="text-emerald-700 dark:text-emerald-300 text-sm">
                No significant matching content detected. Your text appears to be original.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {plagiarismInstances.map((instance, index) => (
                <div 
                  key={index} 
                  className="border rounded-md overflow-hidden bg-card"
                >
                  <div className="bg-muted p-3 flex justify-between items-center">
                    <div className="flex items-center">
                      <span className="font-medium text-sm">Match {index + 1}</span>
                      <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-background">
                        {instance.matchPercentage}% match
                      </span>
                      <span className="ml-2">{getSeverityBadge(instance.matchPercentage)}</span>
                    </div>
                    <a 
                      href={instance.source} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-xs flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                      View Source <ExternalLink className="h-3 w-3 ml-1" />
                    </a>
                  </div>
                  <div className="p-3 text-sm">
                    <p className="italic">"{instance.text}"</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };
  // Render the grammar tab content
  const renderGrammarTab = () => {
    const { grammarIssues, grammarScore } = currentAnalysis;
    return (
      <div>
        <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="text-xl font-bold mb-1 text-amber-700 dark:text-amber-400">Grammar Score</h3>
            <p className="text-muted-foreground text-sm">
              Higher score indicates fewer grammar issues
            </p>
          </div>
          <div className="mt-4 md:mt-0 text-center">
            <span className={`text-4xl font-bold ${getScoreColor(grammarScore)}`}>
              {Math.round(grammarScore)}%
            </span>
          </div>
        </div>
        
        <Progress 
          value={grammarScore} 
          className={`h-2 mb-8 ${getProgressColor(grammarScore)}`} 
        />
        
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-4 text-amber-700 dark:text-amber-400">Grammar Issues</h3>
          {grammarIssues.length === 0 ? (
            <div className="bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded-md border-l-4 border-emerald-400 dark:border-emerald-600 shadow-sm">
              <p className="text-emerald-700 dark:text-emerald-300 text-sm">
                No significant grammar issues detected. Your text appears to be well-written.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {grammarIssues.map((issue, index) => (
                <div 
                  key={index} 
                  className="border rounded-md overflow-hidden bg-card"
                >
                  <div className="bg-muted p-3 flex justify-between items-center">
                    <div className="flex items-center">
                      <span className="font-medium text-sm">{issue.type}</span>
                      <span className="ml-2">{getSeverityBadge(issue.severity)}</span>
                    </div>
                  </div>
                  <div className="p-3 text-sm">
                    <p className="mb-2 italic">"{issue.text}"</p>
                    {issue.suggestion && (
                      <div className="mt-2">
                        <span className="text-xs font-medium text-muted-foreground">Suggestion:</span>
                        <p className="text-sm mt-1 text-emerald-600 dark:text-emerald-400">{issue.suggestion}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="bg-indigo-50 dark:bg-indigo-950/30 p-4 rounded-md text-sm border-l-4 border-indigo-400 dark:border-indigo-600 shadow-sm">
          <h4 className="font-medium mb-2 text-indigo-700 dark:text-indigo-300">Grammar Tips</h4>
          <ul className="list-disc list-inside space-y-1 text-indigo-600/80 dark:text-indigo-300/80">
            <li>Use active voice instead of passive voice when possible</li>
            <li>Be consistent with verb tense throughout your writing</li>
            <li>Check for subject-verb agreement errors</li>
            <li>Avoid run-on sentences and sentence fragments</li>
          </ul>
        </div>
      </div>
    );
  };

  // Render the readability tab content
  const renderReadabilityTab = () => {
    const { readabilityMetrics, readabilityScore } = currentAnalysis;
    const { 
      fleschKincaidScore, 
      avgSentenceLength, 
      avgWordLength, 
      totalWords, 
      totalSentences, 
      totalParagraphs 
    } = readabilityMetrics;
    
    return (
      <div>
        <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="text-xl font-bold mb-1 text-indigo-700 dark:text-indigo-400">Readability Score</h3>
            <p className="text-muted-foreground text-sm">
              {getReadabilityLabel(readabilityScore)} to read
            </p>
          </div>
          <div className="mt-4 md:mt-0 text-center">
            <span className={`text-4xl font-bold ${getScoreColor(readabilityScore)}`}>
              {Math.round(readabilityScore)}%
            </span>
          </div>
        </div>
        
        <Progress 
          value={readabilityScore} 
          className={`h-2 mb-8 ${getProgressColor(readabilityScore)}`} 
        />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="border-l-4 border-l-emerald-500 shadow-sm hover:shadow-md transition-all duration-300">
            <CardHeader className="pb-2">
              <CardTitle className="text-md text-emerald-700 dark:text-emerald-400">Text Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="space-y-2">
                <div className="flex justify-between">
                  <dt className="text-muted-foreground text-sm">Words</dt>
                  <dd className="font-medium">{readabilityMetrics.totalWords}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground text-sm">Sentences</dt>
                  <dd className="font-medium">{readabilityMetrics.totalSentences}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground text-sm">Paragraphs</dt>
                  <dd className="font-medium">{readabilityMetrics.totalParagraphs}</dd>
                </div>
              </dl>
            </CardContent>
          </Card>
          
          <Card className="border-l-4 border-l-emerald-500 shadow-sm hover:shadow-md transition-all duration-300">
            <CardHeader className="pb-2">
              <CardTitle className="text-md text-amber-700 dark:text-amber-400">Sentence Length</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center mb-2">
                <span className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                  {readabilityMetrics.avgSentenceLength.toFixed(1)}
                </span>
                <span className="text-sm ml-1 text-muted-foreground">words/sentence</span>
              </div>
              <p className="text-sm text-muted-foreground">
                {readabilityMetrics.avgSentenceLength > 25 
                  ? "Consider shortening your sentences for better readability." 
                  : "Good sentence length for readability."}
              </p>
            </CardContent>
          </Card>
          
          <Card className="border-l-4 border-l-emerald-500 shadow-sm hover:shadow-md transition-all duration-300">
            <CardHeader className="pb-2">
              <CardTitle className="text-md text-indigo-700 dark:text-indigo-400">Word Length</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center mb-2">
                <span className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                  {readabilityMetrics.avgWordLength.toFixed(1)}
                </span>
                <span className="text-sm ml-1 text-muted-foreground">characters/word</span>
              </div>
              <p className="text-sm text-muted-foreground">
                {readabilityMetrics.avgWordLength > 5.5 
                  ? "Your vocabulary may be complex for general audiences." 
                  : "Good word choice for general readers."}
              </p>
            </CardContent>
          </Card>
        </div>
        
        <div className="bg-indigo-50 dark:bg-indigo-950/30 p-4 rounded-md text-sm border-l-4 border-indigo-400 dark:border-indigo-600 shadow-sm">
          <h4 className="font-medium mb-2 text-indigo-700 dark:text-indigo-300">Readability Tips</h4>
          <ul className="list-disc list-inside space-y-1 text-indigo-600/80 dark:text-indigo-300/80">
            <li>Aim for an average sentence length of 15-20 words</li>
            <li>Use simpler words when they communicate equally well</li>
            <li>Break up long paragraphs into smaller ones</li>
            <li>Use headings and lists to organize complex information</li>
          </ul>
        </div>
      </div>
    );
  };

  // Check if this component is already rendered on the page
  const isDuplicate = () => {
    const dashboards = document.querySelectorAll(`[data-dashboard-id="${dashboardInstanceId}"]`);
    return dashboards.length > 1;
  };

  // If this is a duplicate instance, don't render anything
  if (isDuplicate()) {
    return null;
  }

  if (!currentAnalysis) {
    return (
      <div className="py-8 kopitree-container">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Analysis Results</CardTitle>
            <CardDescription>No analysis results available</CardDescription>
          </CardHeader>
          <CardContent className="text-center py-12">
            <AlertCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-medium mb-2">No Analysis Results</h3>
            <p className="text-muted-foreground mb-6">Enter text and run an analysis to see results here</p>
            {analysisError && (
              <div className="bg-destructive/10 p-4 rounded-md mb-4 max-w-md mx-auto">
                <p className="text-destructive text-sm">{analysisError}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="py-6 kopitree-container" data-dashboard-id={dashboardInstanceId}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: animateIn ? 1 : 0, y: animateIn ? 0 : 20 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="border-t-4 border-t-indigo-600 shadow-lg overflow-hidden bg-gradient-to-b from-background to-background/80">
          <CardHeader className="pb-0">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <FileCheck className="h-5 w-5 text-primary" /> Analysis Results
                </CardTitle>
                <CardDescription className="flex items-center gap-1 mt-1">
                  <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                  Analysis completed on {currentAnalysis.date.toLocaleString()}
                </CardDescription>
              </div>
              <div className="flex gap-6 bg-indigo-50 dark:bg-indigo-950/30 p-3 rounded-lg shadow-inner">
                <div className="text-center">
                  <div className={`text-xl font-bold ${getScoreColor(currentAnalysis.plagiarismScore)}`}>
                    {Math.round(currentAnalysis.plagiarismScore)}%
                  </div>
                  <div className="text-xs text-muted-foreground">Originality</div>
                </div>
                <Separator orientation="vertical" className="h-12" />
                <div className="text-center">
                  <div className={`text-xl font-bold ${getScoreColor(currentAnalysis.grammarScore)}`}>
                    {Math.round(currentAnalysis.grammarScore)}%
                  </div>
                  <div className="text-xs text-muted-foreground">Grammar</div>
                </div>
                <Separator orientation="vertical" className="h-12" />
                <div className="text-center">
                  <div className={`text-xl font-bold ${getScoreColor(currentAnalysis.readabilityScore)}`}>
                    {Math.round(currentAnalysis.readabilityScore)}%
                  </div>
                  <div className="text-xs text-muted-foreground">Readability</div>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3 mb-8 bg-indigo-50 dark:bg-indigo-950/30 p-1 rounded-md shadow-sm">
                <TabsTrigger value="plagiarism" className="flex items-center justify-center gap-2 data-[state=active]:bg-indigo-600 data-[state=active]:text-white">
                  <FileText className="h-4 w-4" />
                  <span className="hidden sm:inline">Plagiarism</span>
                  <span className="sm:hidden">Plag.</span>
                </TabsTrigger>
                <TabsTrigger value="grammar" className="flex items-center justify-center gap-2 data-[state=active]:bg-indigo-600 data-[state=active]:text-white">
                  <AlertTriangle className="h-4 w-4" />
                  <span className="hidden sm:inline">Grammar</span>
                  <span className="sm:hidden">Gram.</span>
                </TabsTrigger>
                <TabsTrigger value="readability" className="flex items-center justify-center gap-2 data-[state=active]:bg-indigo-600 data-[state=active]:text-white">
                  <BookOpen className="h-4 w-4" />
                  <span className="hidden sm:inline">Readability</span>
                  <span className="sm:hidden">Read.</span>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="plagiarism">
                {renderPlagiarismTab()}
              </TabsContent>
              
              <TabsContent value="grammar">
                {renderGrammarTab()}
              </TabsContent>
              
              <TabsContent value="readability">
                {renderReadabilityTab()}
              </TabsContent>
            </Tabs>
          </CardContent>
          
          <CardFooter className="border-t pt-6 flex flex-wrap justify-between items-center">
            <div className="flex items-center space-x-4 mb-4 md:mb-0">
              <div className="flex items-center bg-white dark:bg-gray-900 px-2 py-1 rounded-md border border-indigo-200 dark:border-indigo-800 shadow-sm">
                <Clock className="h-3.5 w-3.5 mr-1.5 text-primary" />
                {currentAnalysis.date.toLocaleString()}
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-background hover:bg-background/80 transition-all duration-300"
                  >
                    <FileCheck className="h-4 w-4 mr-2" />
                    Actions
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={handleRefreshAnalysis} disabled={isAnalyzing}>
                    <RefreshCw className={`h-4 w-4 mr-2 ${isAnalyzing ? 'animate-spin' : ''}`} />
                    {isAnalyzing ? 'Analyzing...' : 'Refresh'}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigator.clipboard.writeText(window.location.href)}>
                    <Link2 className="h-4 w-4 mr-2" />
                    Copy Link
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => window.open(`mailto:?subject=TreeText Analysis&body=${encodeURIComponent(window.location.href)}`, '_blank')}>
                    <Mail className="h-4 w-4 mr-2" />
                    Email
                  </DropdownMenuItem>
                  {FEATURES.EXPORT_RESULTS && (
                    <>
                      <DropdownMenuItem onClick={exportResults} disabled={isExporting}>
                        <Download className={`h-4 w-4 mr-2 ${isExporting ? 'animate-bounce' : ''}`} />
                        Export as Text
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => window.print()}>
                        <Printer className="h-4 w-4 mr-2" />
                        Print / PDF
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
              
              <Button
                size="sm"
                className="bg-indigo-600 hover:bg-indigo-700 text-white transition-all duration-300 shadow-md"
                onClick={() => {
                  const textEditor = document.querySelector('#text-editor');
                  if (textEditor) {
                    textEditor.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit Text
              </Button>
            </div>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
};

export default EnhancedResultsDashboard;
