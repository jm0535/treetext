import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { BarChart2, Home, Clock, Search, Filter, Eye, Download, Trash2, FileText, AlertCircle, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '@/components/PageHeader';
import DatabaseService from '@/services/DatabaseService';
import { AnalysisResult } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from '@/hooks/use-toast';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

interface HistoryItem {
  id: string;
  title: string;
  date: Date;
  type: string;
  wordCount: number;
  score: number;
  isFileAnalysis: boolean;
  fileName?: string;
  fileType?: string;
  fileSize?: number;
}

const HistoryPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [loading, setLoading] = useState(true);
  const [historyData, setHistoryData] = useState<HistoryItem[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<HistoryItem | null>(null);
  const [deleting, setDeleting] = useState(false);
  
  // Load history data from database
  useEffect(() => {
    const loadHistoryData = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      
      setLoading(true);
      try {
        // Fetch text analyses
        const textAnalyses = await DatabaseService.getTextAnalysisHistory(100);
        const textHistoryItems: HistoryItem[] = textAnalyses.map(item => ({
          id: item.id,
          title: item.title || 'Untitled Analysis',
          date: item.date,
          type: item.settings?.analysisType || 'text',
          wordCount: item.text?.split(/\s+/).length || 0,
          score: Math.round((item.grammarScore || 0) * 100),
          isFileAnalysis: false
        }));
        
        // Fetch file analyses
        const fileAnalyses = await DatabaseService.getFileAnalysisHistory(100);
        const fileHistoryItems: HistoryItem[] = fileAnalyses.map(item => ({
          id: item.id,
          title: item.fileName || 'Untitled File',
          date: item.date,
          type: getFileType(item.fileType),
          wordCount: 0, // We don't have this info for files
          score: Math.round((item.grammarScore || 0) * 100),
          isFileAnalysis: true,
          fileName: item.fileName,
          fileType: item.fileType,
          fileSize: item.fileSize
        }));
        
        // Combine and sort by date
        const combinedHistory = [...textHistoryItems, ...fileHistoryItems].sort(
          (a, b) => b.date.getTime() - a.date.getTime()
        );
        
        setHistoryData(combinedHistory);
      } catch (error) {
        console.error('Error loading history data:', error);
        toast({
          title: "Error loading history",
          description: "There was a problem loading your analysis history.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    loadHistoryData();
  }, [user]);
  
  // Helper function to get file type category
  const getFileType = (mimeType: string): string => {
    if (!mimeType) return 'unknown';
    
    if (mimeType.includes('pdf')) return 'pdf';
    if (mimeType.includes('word') || mimeType.includes('document')) return 'document';
    if (mimeType.includes('text')) return 'text';
    if (mimeType.includes('html')) return 'html';
    if (mimeType.includes('markdown')) return 'markdown';
    
    return 'other';
  };
  
  // Handle delete confirmation
  const confirmDelete = (item: HistoryItem) => {
    setItemToDelete(item);
    setDeleteDialogOpen(true);
  };
  
  // Handle actual deletion
  const handleDelete = async () => {
    if (!itemToDelete) return;
    
    setDeleting(true);
    try {
      let success = false;
      
      if (itemToDelete.isFileAnalysis) {
        success = await DatabaseService.deleteFileAnalysis(itemToDelete.id);
      } else {
        success = await DatabaseService.deleteTextAnalysis(itemToDelete.id);
      }
      
      if (success) {
        // Remove from local state
        setHistoryData(prev => prev.filter(item => item.id !== itemToDelete.id));
        toast({
          title: "Analysis deleted",
          description: "The analysis has been successfully deleted."
        });
      } else {
        throw new Error("Failed to delete analysis");
      }
    } catch (error) {
      console.error('Error deleting analysis:', error);
      toast({
        title: "Error deleting analysis",
        description: "There was a problem deleting the analysis.",
        variant: "destructive"
      });
    } finally {
      setDeleting(false);
      setDeleteDialogOpen(false);
      setItemToDelete(null);
    }
  };

  // Filter and search functionality
  const filteredHistory = historyData
    .filter(item => filterType === 'all' || item.type === filterType)
    .filter(item => 
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.type.toLowerCase().includes(searchTerm.toLowerCase())
    );

  return (
    <div className="container max-w-6xl mx-auto px-4 py-8">
      <div className="flex flex-col space-y-8">
        <PageHeader
          title="Analysis History"
          description="View and manage your previous text analyses"
          breadcrumbs={[
            { label: 'Dashboard', path: '/dashboard', icon: <Home className="h-4 w-4 mr-1" /> },
            { label: 'History', path: '/history', icon: <Clock className="h-4 w-4 mr-1" /> }
          ]}
        />

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search analyses..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="academic">Academic</SelectItem>
                <SelectItem value="business">Business</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* History Table */}
        <Card>
          <CardHeader>
            <CardTitle>Analysis History</CardTitle>
            <CardDescription>Your text and file analyses history</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="py-4">
                <div className="flex items-center justify-center mb-4">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  <span className="ml-2 text-sm text-muted-foreground">Loading your analysis history...</span>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead><Skeleton className="h-4 w-24" /></TableHead>
                      <TableHead><Skeleton className="h-4 w-20" /></TableHead>
                      <TableHead><Skeleton className="h-4 w-16" /></TableHead>
                      <TableHead className="text-right"><Skeleton className="h-4 w-12 ml-auto" /></TableHead>
                      <TableHead className="text-right"><Skeleton className="h-4 w-12 ml-auto" /></TableHead>
                      <TableHead className="text-right"><Skeleton className="h-4 w-20 ml-auto" /></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[1, 2, 3, 4, 5].map((i) => (
                      <TableRow key={i}>
                        <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                        <TableCell><Skeleton className="h-6 w-16 rounded-full" /></TableCell>
                        <TableCell className="text-right"><Skeleton className="h-4 w-12 ml-auto" /></TableCell>
                        <TableCell className="text-right"><Skeleton className="h-4 w-12 ml-auto" /></TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Skeleton className="h-8 w-8 rounded-full" />
                            <Skeleton className="h-8 w-8 rounded-full" />
                            <Skeleton className="h-8 w-8 rounded-full" />
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead className="text-right">Words</TableHead>
                    <TableHead className="text-right">Score</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredHistory.length > 0 ? (
                    filteredHistory.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center">
                            {item.isFileAnalysis ? (
                              <FileText className="h-4 w-4 mr-2 text-primary" />
                            ) : (
                              <AlertCircle className="h-4 w-4 mr-2 text-primary" />
                            )}
                            <span className="truncate max-w-[200px] md:max-w-[300px]">{item.title}</span>
                          </div>
                        </TableCell>
                        <TableCell>{item.date.toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Badge variant={getBadgeVariant(item.type)}>
                            {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          {item.wordCount > 0 ? item.wordCount : '-'}
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          {item.score > 0 ? `${item.score}/100` : '-'}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              title="View"
                              onClick={() => navigate(item.isFileAnalysis ? `/file-analysis/${item.id}` : `/analysis/${item.id}`)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              title="Download"
                              disabled={true} // Implement download functionality later
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              title="Delete"
                              onClick={() => confirmDelete(item)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        {searchTerm || filterType !== 'all' ? (
                          <>
                            <p>No analysis history found matching your criteria</p>
                            <p className="text-sm mt-1">Try adjusting your search or filter settings</p>
                          </>
                        ) : (
                          <>
                            <p>You don't have any analysis history yet</p>
                            <p className="text-sm mt-1">Start analyzing text to see your history here</p>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="mt-4"
                              onClick={() => navigate('/')}
                            >
                              New Analysis
                            </Button>
                          </>
                        )}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => navigate('/dashboard')}>
              Back to Dashboard
            </Button>
            <Button 
              variant="outline" 
              onClick={() => navigate('/analytics')}
              disabled={historyData.length === 0}
            >
              View Analytics
            </Button>
          </CardFooter>
        </Card>
        
        {/* Delete Confirmation Dialog */}
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete the analysis "{itemToDelete?.title}". 
                This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
              <AlertDialogAction 
                onClick={(e) => {
                  e.preventDefault();
                  handleDelete();
                }}
                disabled={deleting}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {deleting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>Delete</>  
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
  
  // Helper function to determine badge variant based on type
  function getBadgeVariant(type: string): "default" | "secondary" | "outline" | "destructive" {
    switch (type.toLowerCase()) {
      case 'academic':
      case 'pdf':
        return 'default';
      case 'business':
      case 'document':
        return 'secondary';
      case 'text':
        return 'outline';
      default:
        return 'outline';
    }
  }
};

export default HistoryPage;
