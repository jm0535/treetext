import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { toast } from '@/hooks/use-toast';
import { useTextAnalysis } from '@/hooks/useTextAnalysis';
import { 
  Upload, 
  FileText, 
  File as FileIcon, 
  AlertCircle, 
  X, 
  Eye, 
  EyeOff,
  Scan,
  Server
} from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import * as pdfjsLib from 'pdfjs-dist';
import mammoth from 'mammoth';
import pdfProcessingService from '@/services/PdfProcessingService';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';

// Set up PDF.js worker with the correct version
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

// Maximum file size in bytes (100MB)
const MAX_FILE_SIZE = 100 * 1024 * 1024;

// Supported file types
const SUPPORTED_FILE_TYPES = [
  'text/plain',                                           // .txt
  'application/pdf',                                      // .pdf
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
  'application/msword',                                   // .doc
  'text/html',                                            // .html
  'text/markdown',                                        // .md
  'application/rtf',                                      // .rtf
  'application/vnd.oasis.opendocument.text'               // .odt
];

// File type icons mapping
const FILE_TYPE_ICONS: Record<string, React.ReactNode> = {
  'text/plain': <FileText className="h-6 w-6 text-blue-500" />,
  'application/pdf': <FileIcon className="h-6 w-6 text-red-500" />,
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': <FileText className="h-6 w-6 text-blue-600" />,
  'application/msword': <FileText className="h-6 w-6 text-blue-600" />,
  'text/html': <FileText className="h-6 w-6 text-orange-500" />,
  'text/markdown': <FileText className="h-6 w-6 text-purple-500" />,
  'application/rtf': <FileText className="h-6 w-6 text-green-500" />,
  'application/vnd.oasis.opendocument.text': <FileText className="h-6 w-6 text-teal-500" />
};

interface FileUploaderProps {
  className?: string;
}

const FileUploader: React.FC<FileUploaderProps> = ({ className }) => {
  const { setText } = useTextAnalysis();
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [isPdfPasswordProtected, setIsPdfPasswordProtected] = useState<boolean>(false);
  const [pdfPassword, setPdfPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [useOcr, setUseOcr] = useState<boolean>(false);
  const [useServerProcessing, setUseServerProcessing] = useState<boolean>(false);
  const [passwordDialogOpen, setPasswordDialogOpen] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Get PDF page count without processing the content
  const getPageCount = async (file: File): Promise<number> => {
    if (file.type !== 'application/pdf') {
      return 0;
    }

    const fileUrl = URL.createObjectURL(file);
    try {
      const loadingTask = pdfjsLib.getDocument({
        url: fileUrl,
        cMapUrl: `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/cmaps/`,
        cMapPacked: true,
      });

      // Use a timeout to prevent hanging on large PDFs
      const pdfPromise = loadingTask.promise;
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => {
          reject(new Error('Timeout getting page count'));
        }, 5000); // 5 second timeout just for page count
      });

      const pdf = await Promise.race([pdfPromise, timeoutPromise]);
      const pageCount = pdf.numPages;
      URL.revokeObjectURL(fileUrl);
      return pageCount;
    } catch (error) {
      URL.revokeObjectURL(fileUrl);
      console.error('Error getting page count:', error);
      return 0;
    }
  };

  // Process only a sample of a large document
  const processSampleOfDocument = async (file: File): Promise<string> => {
    try {
      setIsLoading(true);
      setProgress(10);

      // Show a progress notification for large documents
      toast({
        title: "Processing Document Sample",
        description: "Analyzing a representative sample of your document for better performance.",
        variant: "info",
      });

      // Set a timeout to prevent the browser from hanging
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => {
          reject(new Error('Sample processing timed out. The document may be too complex.'));
        }, 90000); // 90 second timeout for very large documents
      });

      if (file.type === 'application/pdf') {
        // For PDFs, process a strategic sample of pages
        const fileUrl = URL.createObjectURL(file);
        try {
          const loadingTask = pdfjsLib.getDocument({
            url: fileUrl,
            cMapUrl: `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/cmaps/`,
            cMapPacked: true,
          });

          const pdf = await Promise.race([loadingTask.promise, timeoutPromise]);

          // For very large documents like a thesis, sample pages strategically
          // Get total page count
          const totalPages = pdf.numPages;
          setProgress(20);

          // Sample pages from beginning, middle, and end for better representation
          let pagesToSample = [];

          // For documents with more than 30 pages, use strategic sampling
          if (totalPages > 30) {
            // Get first 3 pages (introduction)
            for (let i = 1; i <= Math.min(3, totalPages); i++) {
              pagesToSample.push(i);
            }

            // Get 2 pages from each quarter of the document
            const quarter = Math.floor(totalPages / 4);
            pagesToSample.push(quarter, quarter + 1);                   // 1st quarter
            pagesToSample.push(2 * quarter, 2 * quarter + 1);           // 2nd quarter
            pagesToSample.push(3 * quarter, 3 * quarter + 1);           // 3rd quarter

            // Get last 3 pages (conclusion)
            for (let i = Math.max(1, totalPages - 2); i <= totalPages; i++) {
              pagesToSample.push(i);
            }

            // Remove duplicates and sort
            pagesToSample = [...new Set(pagesToSample)].sort((a, b) => a - b);
          } else {
            // For smaller documents, take first 10 pages
            pagesToSample = Array.from({length: Math.min(10, totalPages)}, (_, i) => i + 1);
          }

          let sampleText = `[PDF Document Sample: ${file.name}]\n\n`;
          sampleText += `Note: This is a strategic sample of ${pagesToSample.length} pages from your ${totalPages}-page document.\n\n`;

          // Process pages in batches to prevent UI freezing
          const BATCH_SIZE = 2;
          for (let batchIndex = 0; batchIndex < pagesToSample.length; batchIndex += BATCH_SIZE) {
            const currentBatch = pagesToSample.slice(batchIndex, batchIndex + BATCH_SIZE);
            setProgress(Math.floor(30 + (batchIndex / pagesToSample.length) * 60));

            // Process current batch of pages
            for (const pageNum of currentBatch) {
              try {
                const page = await pdf.getPage(pageNum);
                const textContent = await page.getTextContent();
                const pageText = textContent.items
                  .map(item => 'str' in item ? item.str : '')
                  .join(' ');

                sampleText += `Page ${pageNum}:\n${pageText}\n\n`;
              } catch (pageError) {
                console.error(`Error processing page ${pageNum}:`, pageError);
                sampleText += `Page ${pageNum}: [Error extracting content]\n\n`;
              }
            }

            // Small delay to allow UI to update
            await new Promise(resolve => setTimeout(resolve, 20));
          }

          URL.revokeObjectURL(fileUrl);
          setProgress(100);
          return sampleText;
        } catch (error) {
          URL.revokeObjectURL(fileUrl);
          throw error;
        }
      } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        // For DOCX, extract but add a note that it's a sample
        const arrayBuffer = await file.arrayBuffer();
        const result = await Promise.race([mammoth.extractRawText({ arrayBuffer }), timeoutPromise]);
        setProgress(100);
        return `[Word Document Sample: ${file.name}]\n\nNote: This document was very large. The analysis may not include all content.\n\n${result.value.substring(0, 50000)}`;
      } else if (file.type === 'text/plain' || file.type === 'text/markdown' || file.type === 'text/html') {
        // For text files, read only the first 50,000 characters
        const text = await Promise.race([readTextFile(file), timeoutPromise]);
        setProgress(100);
        const sample = text.substring(0, 50000);
        return `[Text Document Sample: ${file.name}]\n\nNote: This document was very large. The analysis includes only the first 50,000 characters.\n\n${sample}`;
      } else {
        throw new Error('Cannot process a sample of this file type');
      }
    } catch (error) {
      console.error('Error processing document sample:', error);
      throw new Error(`Failed to process document sample: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setError(null);
    
    if (!selectedFile) {
      return;
    }
    
    // Validate file size
    if (selectedFile.size > MAX_FILE_SIZE) {
      setError(`File size exceeds the maximum limit of 100MB. Your file is ${(selectedFile.size / (1024 * 1024)).toFixed(2)}MB.`);
      return;
    }
    
    // Validate file type
    if (!SUPPORTED_FILE_TYPES.includes(selectedFile.type)) {
      setError(`Unsupported file type: ${selectedFile.type}. Please upload a supported document format.`);
      return;
    }
    
    setFile(selectedFile);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setError(null);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      
      // Validate file size
      if (droppedFile.size > MAX_FILE_SIZE) {
        setError(`File size exceeds the maximum limit of 100MB. Your file is ${(droppedFile.size / (1024 * 1024)).toFixed(2)}MB.`);
        return;
      }
      
      // Validate file type
      if (!SUPPORTED_FILE_TYPES.includes(droppedFile.type)) {
        setError(`Unsupported file type: ${droppedFile.type}. Please upload a supported document format.`);
        return;
      }
      
      setFile(droppedFile);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  // Function to extract text from a PDF file using PDF.js
  const extractTextFromPdf = async (file: File): Promise<string> => {
    const fileUrl = URL.createObjectURL(file);
    let extractedText = '';
    
    try {
      const loadingTask = pdfjsLib.getDocument({
        url: fileUrl,
        password: isPdfPasswordProtected ? pdfPassword : '',
        cMapUrl: `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/cmaps/`,
        cMapPacked: true,
      });
      
      // Set a timeout to prevent the browser from hanging
      const pdfPromise = loadingTask.promise;
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => {
          reject(new Error('PDF processing timed out. The document may be too large or complex.'));
        }, 60000); // 60 second timeout for large documents
      });
      
      const pdf = await Promise.race([pdfPromise, timeoutPromise]);
      const numPages = pdf.numPages;
      
      // Process pages in batches to prevent UI freezing
      const BATCH_SIZE = 5;
      for (let i = 1; i <= numPages; i += BATCH_SIZE) {
        const pagePromises = [];
        
        // Create a batch of page processing promises
        for (let j = i; j <= Math.min(i + BATCH_SIZE - 1, numPages); j++) {
          pagePromises.push(pdf.getPage(j).then(async (page) => {
            const textContent = await page.getTextContent();
            return { 
              pageNum: j, 
              text: textContent.items.map(item => 'str' in item ? item.str : '').join(' ') 
            };
          }));
        }
        
        // Process the current batch
        const pageResults = await Promise.all(pagePromises);
        pageResults.sort((a, b) => a.pageNum - b.pageNum);
        
        // Add the text from each page to the result
        for (const result of pageResults) {
          extractedText += `Page ${result.pageNum}:\n${result.text}\n\n`;
        }
        
        // Update progress
        setProgress(Math.min(Math.floor((i / numPages) * 100), 95));
        
        // Small delay to allow UI to update
        await new Promise(resolve => setTimeout(resolve, 10));
      }
      
      URL.revokeObjectURL(fileUrl);
      return extractedText;
    } catch (error) {
      URL.revokeObjectURL(fileUrl);
      
      if (error instanceof Error && error.message.includes('Invalid password')) {
        setIsPdfPasswordProtected(true);
        setPasswordDialogOpen(true);
        throw new Error('PDF is password protected. Please enter the password.');
      }
      
      throw error;
    }
  };

  // Function to extract text from a DOCX file using mammoth
  const extractTextFromDocx = async (file: File): Promise<string> => {
    try {
      const arrayBuffer = await file.arrayBuffer();
      
      // Set a timeout to prevent the browser from hanging
      const mammothPromise = mammoth.extractRawText({ arrayBuffer });
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => {
          reject(new Error('DOCX processing timed out. The document may be too large or complex.'));
        }, 60000); // 60 second timeout for large documents
      });
      
      const result = await Promise.race([mammothPromise, timeoutPromise]);
      return result.value;
    } catch (error) {
      throw error;
    }
  };

  // Check if a PDF is password protected
  const checkPdfProtection = async (file: File): Promise<boolean> => {
    const fileUrl = URL.createObjectURL(file);
    
    try {
      const loadingTask = pdfjsLib.getDocument({
        url: fileUrl,
        password: '',
      });
      
      await loadingTask.promise;
      URL.revokeObjectURL(fileUrl);
      return false;
    } catch (error) {
      URL.revokeObjectURL(fileUrl);
      if (error instanceof Error && error.message.includes('Invalid password')) {
        return true;
      }
      return false;
    }
  };

  const extractTextFromFile = async (uploadedFile: File): Promise<string> => {
    setIsLoading(true);
    setProgress(10);
    
    try {
      // Check if file is too large and needs sampling
      const isVeryLargeFile = uploadedFile.size > 10 * 1024 * 1024; // 10MB
      let pageCount = 0;
      
      // For PDFs, check page count
      if (uploadedFile.type === 'application/pdf') {
        pageCount = await getPageCount(uploadedFile);
      }
      
      // If file is very large or has many pages, ask user if they want to process a sample
      if (isVeryLargeFile || pageCount > 100) {
        const confirmMessage = pageCount > 0 
          ? `This document has ${pageCount} pages and may take a long time to process. Would you like to process only a sample of the document for faster analysis?`
          : `This document is very large (${(uploadedFile.size / (1024 * 1024)).toFixed(2)}MB) and may take a long time to process. Would you like to process only a sample of the document for faster analysis?`;
          
        const shouldProcessSample = window.confirm(confirmMessage);
        
        if (shouldProcessSample) {
          return await processSampleOfDocument(uploadedFile);
        }
      }
      
      // Process the entire document
      let extractedText = '';
      
      switch (uploadedFile.type) {
        case 'text/plain':
        case 'text/markdown':
        case 'text/html':
          extractedText = await readTextFile(uploadedFile);
          break;
          
        case 'application/pdf':
          // Check if PDF is password protected
          if (await checkPdfProtection(uploadedFile)) {
            setIsPdfPasswordProtected(true);
            setPasswordDialogOpen(true);
            throw new Error('PDF is password protected. Please enter the password.');
          }
          
          if (useServerProcessing) {
            // Use server-side processing for complex PDFs
            extractedText = await pdfProcessingService.processWithServer(uploadedFile, useOcr);
          } else {
            // Use client-side processing
            extractedText = await extractTextFromPdf(uploadedFile);
          }
          break;
          
        case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        case 'application/msword':
          extractedText = await extractTextFromDocx(uploadedFile);
          break;
          
        case 'application/rtf':
        case 'application/vnd.oasis.opendocument.text':
          // For RTF and ODT, we would need additional libraries
          // For now, just show a message
          extractedText = `[${uploadedFile.type.split('/')[1].toUpperCase()} Document: ${uploadedFile.name}]\n\nContent extraction for this format is limited. For best results, consider converting to PDF or DOCX.`;
          break;
          
        default:
          throw new Error(`Unsupported file type: ${uploadedFile.type}`);
      }
      
      setProgress(100);
      return extractedText;
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const readTextFile = (uploadedFile: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        resolve(e.target?.result as string);
      };
      
      reader.onerror = () => {
        reject(new Error('Error reading text file'));
      };
      
      reader.readAsText(uploadedFile);
    });
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file to upload.');
      return;
    }
    
    setError(null);
    setIsLoading(true);
    setProgress(0);
    
    try {
      // Extract text from the file
      const extractedText = await extractTextFromFile(file);
      
      // Set the extracted text for analysis
      setText(extractedText);
      
      // Show success message
      toast({
        title: "Document Uploaded Successfully",
        description: `${file.name} has been processed and is ready for analysis.`,
        variant: "success",
      });
      
      // Clear the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      
      // Don't show error for password protected PDFs as we'll show a dialog instead
      if (error instanceof Error && !error.message.includes('password protected')) {
        setError(`Error processing file: ${error.message}`);
        
        toast({
          title: "Upload Failed",
          description: error.message,
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const clearFile = () => {
    setFile(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getFileTypeIcon = (fileType: string) => {
    return FILE_TYPE_ICONS[fileType] || <FileText className="h-6 w-6 text-gray-500" />;
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' bytes';
    else if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    else if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    else return (bytes / (1024 * 1024 * 1024)).toFixed(1) + ' GB';
  };

  // Handle password submission
  const handlePasswordSubmit = () => {
    if (!pdfPassword) {
      return;
    }
    
    setPasswordDialogOpen(false);
    setIsLoading(true);
    setProgress(0);
    
    // Re-attempt extraction with the provided password
    if (file) {
      extractTextFromFile(file)
        .then(extractedText => {
          setText(extractedText);
          
          toast({
            title: "Document Uploaded Successfully",
            description: `${file.name} has been processed and is ready for analysis.`,
            variant: "success",
          });
          
          // Clear the file input
          if (fileInputRef.current) {
            fileInputRef.current.value = '';
          }
        })
        .catch(error => {
          console.error('Error processing file with password:', error);
          
          if (error instanceof Error && error.message.includes('Invalid password')) {
            setError('Incorrect password. Please try again.');
            setPasswordDialogOpen(true);
          } else {
            setError(`Error processing file: ${error.message}`);
            
            toast({
              title: "Upload Failed",
              description: error.message,
              variant: "destructive",
            });
          }
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  };

  return (
    <div className={className}>
      <div className="space-y-4">
        <div className="flex flex-col space-y-2">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Upload Document</h3>
            {file && (
              <Button variant="ghost" size="sm" onClick={clearFile} className="h-8 px-2">
                <X className="h-4 w-4 mr-1" /> Clear
              </Button>
            )}
          </div>
          <p className="text-sm text-muted-foreground">Upload a document to analyze for plagiarism, grammar, and readability.</p>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {file ? (
          <Card className="border-dashed">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {getFileTypeIcon(file.type)}
                  <div>
                    <p className="font-medium truncate max-w-[200px]">{file.name}</p>
                    <p className="text-sm text-muted-foreground">{formatFileSize(file.size)}</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setFile(null)} className="h-8 px-2">
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div
            className="border-2 border-dashed rounded-lg p-12 text-center cursor-pointer hover:bg-muted/50 transition-colors"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="flex flex-col items-center justify-center space-y-3">
              <Upload className="h-8 w-8 text-muted-foreground" />
              <div>
                <p className="font-medium">Drag & drop your file here</p>
                <p className="text-sm text-muted-foreground">or click to browse</p>
              </div>
              <p className="text-xs text-muted-foreground">
                Supported formats: PDF, DOCX, TXT, HTML, MD, RTF, ODT (Max 100MB)
              </p>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              accept={SUPPORTED_FILE_TYPES.join(',')}
              onChange={handleFileChange}
            />
          </div>
        )}

        {file && file.type === 'application/pdf' && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Advanced PDF Options</h4>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox id="use-ocr" checked={useOcr} onCheckedChange={(checked) => setUseOcr(checked as boolean)} />
                <Label htmlFor="use-ocr" className="text-sm cursor-pointer flex items-center">
                  <Scan className="h-4 w-4 mr-1" /> Use OCR for scanned pages
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="use-server" 
                  checked={useServerProcessing} 
                  onCheckedChange={(checked) => setUseServerProcessing(checked as boolean)} 
                />
                <Label htmlFor="use-server" className="text-sm cursor-pointer flex items-center">
                  <Server className="h-4 w-4 mr-1" /> Use server-side processing for complex documents
                </Label>
              </div>
            </div>
          </div>
        )}

        {isLoading ? (
          <div className="space-y-2">
            <Progress value={progress} className="h-2" />
            <p className="text-sm text-center text-muted-foreground">
              {progress < 100 ? 'Processing document...' : 'Finalizing...'}
            </p>
          </div>
        ) : (
          file && (
            <Button className="w-full" onClick={handleUpload}>
              Upload & Analyze
            </Button>
          )
        )}
      </div>

      {/* Password Dialog */}
      <Dialog open={passwordDialogOpen} onOpenChange={setPasswordDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>PDF Password Required</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <p className="text-sm">This PDF is password protected. Please enter the password to continue.</p>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Enter password"
                value={pdfPassword}
                onChange={(e) => setPdfPassword(e.target.value)}
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPasswordDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handlePasswordSubmit}>
              Submit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FileUploader;
