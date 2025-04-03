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
    
    const droppedFile = e.dataTransfer.files?.[0] || null;
    setError(null);
    
    if (!droppedFile) {
      return;
    }
    
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
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  // Function to extract text from a PDF file using PDF.js
  const extractTextFromPdf = async (file: File): Promise<string> => {
    try {
      setProgress(20);
      console.log('Starting PDF extraction for:', file.name);
      
      // Convert the file to an ArrayBuffer
      const arrayBuffer = await file.arrayBuffer();
      console.log('File converted to ArrayBuffer, size:', arrayBuffer.byteLength);
      
      // Load the PDF document
      setProgress(40);
      console.log('Creating PDF loading task...');
      
      // Use a try-catch specifically for the document loading
      try {
        const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
        console.log('Waiting for PDF document to load...');
        const pdf = await loadingTask.promise;
        console.log('PDF loaded successfully, pages:', pdf.numPages);
        
        setProgress(60);
        let fullText = `[PDF Document: ${file.name}]\n\n`;
        
        // If the PDF has no pages, return a message
        if (pdf.numPages === 0) {
          return `[PDF Document: ${file.name}]\n\nThis PDF appears to be empty or contains no text content that can be extracted.`;
        }
        
        // Extract text from each page
        for (let i = 1; i <= pdf.numPages; i++) {
          console.log(`Processing page ${i} of ${pdf.numPages}...`);
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          const textItems = textContent.items;
          
          // Concatenate the text items
          const pageText = textItems
            .map((item: { str?: string }) => {
              // Check if the item has a 'str' property (TextItem) or not (TextMarkedContent)
              return item.str || '';
            })
            .join(' ');
          
          fullText += pageText + '\n';
          console.log(`Page ${i} processed, extracted ${pageText.length} characters`);
          
          // Update progress based on page completion
          setProgress(60 + Math.floor((i / pdf.numPages) * 30));
        }
        
        // If we extracted no text, provide a fallback message
        if (fullText.trim() === `[PDF Document: ${file.name}]`) {
          return `[PDF Document: ${file.name}]\n\nThis PDF appears to contain no extractable text content. It may consist of scanned images or have content protection enabled.`;
        }
        
        console.log('PDF extraction completed successfully');
        return fullText;
      } catch (pdfError) {
        console.error('Error loading PDF document:', pdfError);
        // Fallback to a simpler extraction method
        return `[PDF Document: ${file.name}]\n\nUnable to parse this PDF document. It may be corrupted, password-protected, or use unsupported features.\n\nFor demonstration purposes, here is some placeholder text that would normally be extracted from your document:\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nisl eget ultricies aliquam, magna libero commodo justo, eget tincidunt purus augue vel velit.`;
      }
    } catch (error) {
      console.error('Error extracting text from PDF:', error);
      throw new Error('Failed to extract text from the PDF document. Please try again.');
    }
  };

  // Function to extract text from a DOCX file using mammoth
  const extractTextFromDocx = async (file: File): Promise<string> => {
    try {
      setProgress(30);
      // Convert the file to an ArrayBuffer
      const arrayBuffer = await file.arrayBuffer();
      
      setProgress(60);
      // Extract text from the DOCX file
      const result = await mammoth.extractRawText({ arrayBuffer });
      const text = `[Word Document: ${file.name}]\n\n${result.value}`;
      
      setProgress(90);
      return text;
    } catch (error) {
      console.error('Error extracting text from DOCX:', error);
      throw new Error('Failed to extract text from the Word document. Please try again.');
    }
  };

  // Check if a PDF is password protected
  const checkPdfProtection = async (file: File): Promise<boolean> => {
    try {
      console.log('Checking if PDF is password protected:', file.name);
      const isProtected = await pdfProcessingService.isPasswordProtected(file);
      
      if (isProtected) {
        console.log('PDF is password protected');
        setIsPdfPasswordProtected(true);
        setPasswordDialogOpen(true);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error checking PDF protection:', error);
      return false;
    }
  };
  
  const extractTextFromFile = async (uploadedFile: File): Promise<string> => {
    setIsLoading(true);
    setProgress(10);
    
    try {
      // For text files, we can directly read the content
      if (uploadedFile.type === 'text/plain' || uploadedFile.type === 'text/markdown' || uploadedFile.type === 'text/html') {
        const text = await readTextFile(uploadedFile);
        setProgress(100);
        return text;
      }
      
      // For PDF files, use advanced PDF processing
      if (uploadedFile.type === 'application/pdf') {
        // Check if PDF is password protected
        const isProtected = await checkPdfProtection(uploadedFile);
        
        if (isProtected) {
          // If it's password protected, return a placeholder and wait for password dialog
          setIsLoading(false);
          return `[PDF Document: ${uploadedFile.name}]\n\nThis PDF is password protected. Please enter the password to extract the content.`;
        }
        
        // Use the advanced PDF processing service
        const text = await pdfProcessingService.extractTextFromPdf(
          uploadedFile,
          undefined, // No password needed for non-protected PDFs
          useOcr,
          useServerProcessing,
          (progress) => {
            setProgress(Math.floor(20 + progress * 0.7)); // Scale progress to 20-90%
          }
        );
        
        setProgress(100);
        return `[PDF Document: ${uploadedFile.name}]\n\n${text}`;
      }
      
      // For DOCX files, use mammoth
      if (uploadedFile.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        const text = await extractTextFromDocx(uploadedFile);
        setProgress(100);
        return text;
      }
      
      // For other file types, we still use placeholder text
      setProgress(50);
      let extractedText = "";
      
      if (uploadedFile.type === 'application/msword') {
        extractedText = `[Word Document (DOC): ${uploadedFile.name}]\n\n`;
        extractedText += "This is a legacy DOC format file. For full support, we would need a server-side conversion service.\n\n";
        extractedText += "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nisl eget ultricies aliquam, ";
        extractedText += "magna libero commodo justo, eget tincidunt purus augue vel velit.";
      } else if (uploadedFile.type === 'application/rtf') {
        extractedText = `[RTF Document: ${uploadedFile.name}]\n\n`;
        extractedText += "RTF parsing requires additional libraries not included in this demo.\n\n";
        extractedText += "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nisl eget ultricies aliquam, ";
        extractedText += "magna libero commodo justo, eget tincidunt purus augue vel velit.";
      } else if (uploadedFile.type === 'application/vnd.oasis.opendocument.text') {
        extractedText = `[OpenDocument Text: ${uploadedFile.name}]\n\n`;
        extractedText += "ODT parsing requires additional libraries not included in this demo.\n\n";
        extractedText += "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nisl eget ultricies aliquam, ";
        extractedText += "magna libero commodo justo, eget tincidunt purus augue vel velit.";
      } else {
        // For any other file type, provide a generic message
        extractedText = `[Document: ${uploadedFile.name}]\n\n`;
        extractedText += "This file type is not fully supported in this demo.\n\n";
        extractedText += "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nisl eget ultricies aliquam, ";
        extractedText += "magna libero commodo justo, eget tincidunt purus augue vel velit.";
      }
      
      setProgress(100);
      return extractedText;
    } catch (error) {
      console.error('Error extracting text from file:', error);
      throw new Error('Failed to extract text from the document. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const readTextFile = (uploadedFile: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        resolve(e.target?.result as string || '');
      };
      
      reader.onerror = () => {
        reject(new Error('Failed to read file. Please try again.'));
      };
      
      reader.readAsText(uploadedFile);
    });
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file to upload.');
      return;
    }
    
    try {
      setError(null);
      const extractedText = await extractTextFromFile(file);
      
      // Set the extracted text for analysis
      setText(extractedText);
      
      toast({
        title: 'File Uploaded Successfully',
        description: `${file.name} has been processed and is ready for analysis.`,
      });
      
      // Clear the file after successful upload
      setFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Upload error:', error);
      setError(error instanceof Error ? error.message : 'An unknown error occurred during upload.');
      
      toast({
        title: 'Upload Failed',
        description: error instanceof Error ? error.message : 'Failed to process the document. Please try again.',
        variant: 'destructive',
      });
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
    return FILE_TYPE_ICONS[fileType] || <FileIcon className="h-6 w-6 text-gray-500" />;
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) {
      return bytes + ' bytes';
    } else if (bytes < 1024 * 1024) {
      return (bytes / 1024).toFixed(2) + ' KB';
    } else {
      return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
    }
  };

  // Handle password submission
  const handlePasswordSubmit = async () => {
    if (!file) {
      setPasswordDialogOpen(false);
      return;
    }
    
    try {
      setIsLoading(true);
      setProgress(20);
      
      // Use the PDF processing service with the password
      const text = await pdfProcessingService.extractTextFromPdf(
        file,
        pdfPassword,
        useOcr,
        useServerProcessing,
        (progress) => {
          setProgress(Math.floor(20 + progress * 0.7)); // Scale progress to 20-90%
        }
      );
      
      setPasswordDialogOpen(false);
      setText(`[PDF Document: ${file.name}]\n\n${text}`);
      
      toast({
        title: 'File Uploaded Successfully',
        description: `${file.name} has been processed and is ready for analysis.`,
      });
      
      // Clear the file after successful upload
      setFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Error processing password-protected PDF:', error);
      setError(`Failed to process password-protected PDF: ${error instanceof Error ? error.message : String(error)}`);
      
      toast({
        title: 'Password Error',
        description: 'The password may be incorrect or the document is corrupted.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
      setProgress(0);
    }
  };
  
  return (
    <>
      <Dialog open={passwordDialogOpen} onOpenChange={setPasswordDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Password Protected PDF</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <p className="text-sm text-muted-foreground">
              This PDF document is password protected. Please enter the password to extract its content.
            </p>
            <div className="space-y-2">
              <Label htmlFor="pdf-password">Password</Label>
              <div className="relative">
                <Input
                  id="pdf-password"
                  type={showPassword ? "text" : "password"}
                  value={pdfPassword}
                  onChange={(e) => setPdfPassword(e.target.value)}
                  placeholder="Enter document password"
                  className="pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox id="use-ocr" checked={useOcr} onCheckedChange={(checked) => setUseOcr(checked === true)} />
                <Label htmlFor="use-ocr" className="text-sm font-normal cursor-pointer flex items-center">
                  <Scan className="h-4 w-4 mr-1" /> Use OCR for scanned pages
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="use-server" checked={useServerProcessing} onCheckedChange={(checked) => setUseServerProcessing(checked === true)} />
                <Label htmlFor="use-server" className="text-sm font-normal cursor-pointer flex items-center">
                  <Server className="h-4 w-4 mr-1" /> Use server-side processing for complex documents
                </Label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPasswordDialogOpen(false)}>Cancel</Button>
            <Button onClick={handlePasswordSubmit} disabled={!pdfPassword}>Submit</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Card className={`w-full ${className || ''}`}>
        <CardContent className="p-6">
        <div className="mb-4">
          <h3 className="text-lg font-medium">Upload Document</h3>
          <p className="text-sm text-muted-foreground">
            Upload a document to analyze for plagiarism, grammar, and readability.
          </p>
        </div>
        
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <div
          className={`border-2 border-dashed rounded-md p-6 text-center ${
            file ? 'border-primary' : 'border-muted-foreground/25'
          } hover:border-primary/50 transition-colors cursor-pointer`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept=".txt,.pdf,.docx,.doc,.html,.md,.rtf,.odt"
          />
          
          {!file && (
            <div className="flex flex-col items-center justify-center py-4">
              <Upload className="h-10 w-10 text-muted-foreground mb-2" />
              <p className="text-sm font-medium mb-1">Drag and drop your document here</p>
              <p className="text-xs text-muted-foreground mb-2">
                Supported formats: TXT, PDF, DOCX, DOC, HTML, MD, RTF, ODT (Max 100MB)
              </p>
              <Button variant="outline" type="button" size="sm">
                Browse Files
              </Button>
            </div>
          )}
          
          {file && (
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center">
                {getFileTypeIcon(file.type)}
                <div className="ml-3 text-left">
                  <p className="text-sm font-medium truncate max-w-[200px]">{file.name}</p>
                  <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  clearFile();
                }}
                aria-label="Remove file"
              >
                <X className="h-4 w-4 text-muted-foreground" />
              </Button>
            </div>
          )}
        </div>
        
        {isLoading && (
          <div className="mt-4">
            <Progress value={progress} className="h-2" />
            <p className="text-xs text-muted-foreground mt-1 text-center">
              Processing document... {progress}%
            </p>
          </div>
        )}
        
        {file && file.type === 'application/pdf' && (
          <div className="mt-4 space-y-2 border rounded-md p-3 bg-muted/20">
            <h4 className="text-sm font-medium">Advanced PDF Options</h4>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox id="use-ocr" checked={useOcr} onCheckedChange={(checked) => setUseOcr(checked === true)} />
                <Label htmlFor="use-ocr" className="text-sm font-normal cursor-pointer flex items-center">
                  <Scan className="h-4 w-4 mr-1" /> Use OCR for scanned pages
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="use-server" checked={useServerProcessing} onCheckedChange={(checked) => setUseServerProcessing(checked === true)} />
                <Label htmlFor="use-server" className="text-sm font-normal cursor-pointer flex items-center">
                  <Server className="h-4 w-4 mr-1" /> Use server-side processing for complex documents
                </Label>
              </div>
            </div>
          </div>
        )}
        
        <div className="mt-4 flex justify-end">
          <Button
            onClick={handleUpload}
            disabled={!file || isLoading}
            className="w-full sm:w-auto"
          >
            {isLoading ? 'Processing...' : 'Upload & Analyze'}
          </Button>
        </div>
      </CardContent>
    </Card>
    </>
  );
};

export default FileUploader;
