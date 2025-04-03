import React from 'react';
import { useTextAnalysis } from '@/hooks/useTextAnalysis';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { 
  History, 
  FileText, 
  MoreVertical, 
  Trash2, 
  Download, 
  Eye
} from 'lucide-react';
import { AnalysisResult } from '@/types';
import { formatDistanceToNow } from 'date-fns';

interface AnalysisHistoryProps {
  className?: string;
  onSelectAnalysis?: (analysis: AnalysisResult) => void;
}

const AnalysisHistory: React.FC<AnalysisHistoryProps> = ({ 
  className,
  onSelectAnalysis 
}) => {
  const { 
    recentAnalyses, 
    deleteAnalysis, 
    clearAllAnalyses,
    exportAnalysisAsText
  } = useTextAnalysis();

  const handleSelectAnalysis = (analysis: AnalysisResult) => {
    if (onSelectAnalysis) {
      onSelectAnalysis(analysis);
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl flex items-center">
              <History className="mr-2 h-5 w-5 text-muted-foreground" />
              Analysis History
            </CardTitle>
            <CardDescription>
              Your recent text analyses
            </CardDescription>
          </div>
          {recentAnalyses.length > 0 && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={clearAllAnalyses}
              className="text-muted-foreground"
            >
              <Trash2 className="mr-1 h-4 w-4 text-red-500" />
              Clear All
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {recentAnalyses.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <FileText className="mx-auto h-10 w-10 mb-3 opacity-20" />
            <p>No analysis history yet</p>
            <p className="text-sm">Analyses you perform will appear here</p>
          </div>
        ) : (
          <div className="space-y-4">
            {recentAnalyses.map((analysis) => (
              <div 
                key={analysis.id} 
                className="p-3 border rounded-md hover:bg-accent/50 transition-colors"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center">
                      <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                      <h4 className="font-medium truncate">
                        {analysis.originalText.substring(0, 40)}
                        {analysis.originalText.length > 40 ? '...' : ''}
                      </h4>
                    </div>
                    <div className="mt-1 flex items-center text-sm text-muted-foreground">
                      <span className="mr-3">
                        {formatDistanceToNow(new Date(analysis.date), { addSuffix: true })}
                      </span>
                      <span className="mr-3">
                        {analysis.readabilityMetrics.totalWords} words
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleSelectAnalysis(analysis)}
                      title="View Analysis"
                    >
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    </Button>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4 text-muted-foreground" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleSelectAnalysis(analysis)}>
                          <Eye className="mr-2 h-4 w-4" />
                          View
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => exportAnalysisAsText(analysis)}>
                          <Download className="mr-2 h-4 w-4" />
                          Export as Text
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => deleteAnalysis(analysis.id)}
                          className="text-red-500"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
                
                <div className="mt-2 flex items-center space-x-4">
                  <div className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-green-500 mr-1"></div>
                    <span className="text-xs">{Math.round(analysis.plagiarismScore)}%</span>
                    <span className="text-xs text-muted-foreground ml-1">Orig.</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-blue-500 mr-1"></div>
                    <span className="text-xs">{Math.round(analysis.grammarScore)}%</span>
                    <span className="text-xs text-muted-foreground ml-1">Gram.</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-purple-500 mr-1"></div>
                    <span className="text-xs">{Math.round(analysis.readabilityScore)}%</span>
                    <span className="text-xs text-muted-foreground ml-1">Read.</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AnalysisHistory;
