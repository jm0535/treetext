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
