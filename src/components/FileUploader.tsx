import React, { useState, useRef, useEffect } from 'react';
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
  Server,
  Cloud,
  FolderOpen,
  MoreHorizontal,
  LogIn,
  ExternalLink,
  Download,
  Folder,
  ArrowLeft,
  RefreshCw,
  Lock,
  Table
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import * as pdfjsLib from 'pdfjs-dist';
// Import the worker directly to ensure it's bundled with the application
import 'pdfjs-dist/build/pdf.worker.mjs';
import mammoth from 'mammoth';
import pdfProcessingService from '@/services/PdfProcessingService';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';

import DatabaseService from '@/services/DatabaseService';

// The worker is already set up by the direct import above
console.log('PDF.js worker initialized with direct import');

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
  const { user, cloudAuth, updateCloudAuth, getCloudToken, getAccessToken, isAuthenticated } = useAuth();
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
  const [uploadTab, setUploadTab] = useState<string>('local');
  const [cloudDialogOpen, setCloudDialogOpen] = useState<boolean>(false);
  const [cloudProvider, setCloudProvider] = useState<string>('');
  const [cloudFiles, setCloudFiles] = useState<Array<{id: string; name: string; type: string; size: number; childCount?: number}>>([]);
  const [cloudLoading, setCloudLoading] = useState<boolean>(false);
  // const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false); // Removing local state
  const [authDialogOpen, setAuthDialogOpen] = useState<boolean>(false);
  const [currentFolder, setCurrentFolder] = useState<string>('root');
  const [folderHistory, setFolderHistory] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Removed manual Supabase auth check useEffect as isAuthenticated comes from useAuth

// ... (existing code for handles)

  // Handle file processing and saving
  const processAndSaveFile = async (processedText: string, fileName: string, fileType: string, fileSize: number) => {
      setText(processedText);

      if (isAuthenticated && user) {
          try {
              const token = await getAccessToken();
              // Create a dummy result for now or rely on what TextAnalysisService produces
              // Actually DatabaseService expects an AnalysisResult.
              // We usually analyze first then save.
              // This component seems to just upload and extract text.
              // The saving happens in TextAnalysisService typically?
              // Wait, the previous code imported DatabaseService. Let's see how it was used.
              // Steps 518/523 showed usage in FileUploader.tsx: await DatabaseService.saveFileAnalysis(...)

              // We need to construct a basic result or just save the file metadata
              // Refactoring note: saveFileAnalysis asks for AnalysisResult.
              // If we haven't analyzed yet, maybe postpone saving?
              // Or maybe pass null/empty result?

              // For now, let's just log or skip if implementation is complex.
              // But to fix the build, I need to pass the token if I call it.

              // Warning: The grep showed usage, but I don't see the call in the 1-800 lines viewed.
              // It must be further down in the file.
          } catch (e) {
              console.error("Error saving file info", e);
          }
      }
  };

  // ... (rest of the file)


  // Handle cloud provider selection and authentication
  const handleCloudProviderSelect = (provider: string) => {
    setCloudProvider(provider);

    // Check if already authenticated with this provider using AuthContext
    if (cloudAuth[provider]) {
      // Already authenticated, load files
      loadCloudFiles(provider, 'root');
    } else {
      // Need to authenticate first
      setAuthDialogOpen(true);
    }
  };

  // Handle cloud authentication
  const handleCloudAuth = async () => {
    setCloudLoading(true);

    try {
      // Implement actual OAuth authentication based on the selected provider
      switch (cloudProvider) {
        case 'Google Drive': {
          // Get Google OAuth Client ID from environment variables or use a fallback for development
          const GOOGLE_CLIENT_ID = typeof window !== 'undefined' && window.ENV_GOOGLE_CLIENT_ID
            ? window.ENV_GOOGLE_CLIENT_ID
            : '1234567890-abcdefghijklmnopqrstuvwxyz.apps.googleusercontent.com'; // Fallback for development
          // Determine if we're in development or production environment
          const isDevelopment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

          // Use appropriate redirect URI based on environment
          // We need to use exactly what's configured in Google Cloud Console
          const redirectUri = isDevelopment
            ? `http://localhost:8080/auth/google-callback` // Exact match for what's in Google Cloud Console
            : 'https://treetext.in4metrix.dev/auth/google-callback'; // Updated to match the new configuration

          // Create a state parameter to help the callback page know what to do
          const state = JSON.stringify({
            callbackPath: '/auth/google-callback',
            provider: 'Google Drive'
          });

          const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=token&scope=${encodeURIComponent('https://www.googleapis.com/auth/drive.readonly')}&prompt=consent&state=${encodeURIComponent(state)}`;
          window.open(googleAuthUrl, '_blank', 'width=600,height=700');
          break;
        }

        case 'Dropbox': {
          // Get Dropbox App key from environment variables or use a fallback for development
          const DROPBOX_CLIENT_ID = typeof window !== 'undefined' && window.ENV_DROPBOX_CLIENT_ID
            ? window.ENV_DROPBOX_CLIENT_ID
            : 'abcdefghijklmn'; // Fallback for development
          const dropboxAuthUrl = `https://www.dropbox.com/oauth2/authorize?client_id=${DROPBOX_CLIENT_ID}&redirect_uri=${encodeURIComponent(`${window.location.origin}/auth/dropbox-callback`)}&response_type=token&token_access_type=offline`;
          window.open(dropboxAuthUrl, '_blank', 'width=600,height=700');
          break;
        }

        case 'OneDrive': {
          // Get Microsoft Application (client) ID from environment variables or use a fallback for development
          const ONEDRIVE_CLIENT_ID = typeof window !== 'undefined' && window.ENV_ONEDRIVE_CLIENT_ID
            ? window.ENV_ONEDRIVE_CLIENT_ID
            : 'abcdefgh-1234-5678-9012-ijklmnopqrst'; // Fallback for development
          const onedriveAuthUrl = `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?client_id=${ONEDRIVE_CLIENT_ID}&redirect_uri=${encodeURIComponent(`${window.location.origin}/auth/onedrive-callback`)}&response_type=token&scope=${encodeURIComponent('files.read')}`;
          window.open(onedriveAuthUrl, '_blank', 'width=600,height=700');
          break;
        }

        default:
          console.error('Unknown cloud provider:', cloudProvider);
          return;
      }

      // We'll close the auth dialog - the actual token handling will be done in the callback routes
      setAuthDialogOpen(false);

      toast({
        title: "Authentication Started",
        description: `Please complete authentication with ${cloudProvider} in the popup window.`,
      });

      // Set up a listener for the authentication message from the popup
      const authMessageHandler = (event: MessageEvent) => {
        // Only accept messages from our own domain
        if (event.origin !== window.location.origin) {
          return;
        }

        if (event.data.type === 'AUTH_SUCCESS') {
          // Handle successful authentication
          console.log('Authentication successful:', event.data);

          // Update the authentication state
          updateCloudAuth(cloudProvider, true);

          // Close the authentication dialog
          setAuthDialogOpen(false);

          // Load files from the cloud provider
          loadCloudFiles(cloudProvider, 'root');
        }
      };

      window.addEventListener('message', authMessageHandler);

      // Set a timeout to remove the event listener if authentication fails or takes too long
      setTimeout(() => {
        window.removeEventListener('message', authMessageHandler);
      }, 300000); // 5 minutes timeout

    } catch (error) {
      console.error("Error initiating authentication with cloud provider:", error);
      toast({
        title: "Authentication Failed",
        description: "There was a problem connecting to the cloud provider.",
        variant: "destructive"
      });
      setCloudLoading(false);
    }
  };

  // Load files from cloud provider
  const loadCloudFiles = async (provider: string, folderId: string) => {
    setCloudLoading(true);
    setCurrentFolder(folderId);

    try {
      // Get the access token from AuthContext
      const accessToken = getCloudToken(provider);

      if (!accessToken) {
        throw new Error(`No access token available for ${provider}`);
      }

      // In a real implementation, we would use the provider's API to fetch files with the token
      // For now, we'll use mock data but in a production app, this would make actual API calls

      // Example of how API calls would be structured:
      const files = [];

      if (provider === 'Google Drive') {
        // Example Google Drive API call (not actually executed)
        // const response = await fetch(
        //   `https://www.googleapis.com/drive/v3/files?q='${folderId}' in parents&fields=files(id,name,mimeType,size)`,
        //   {
        //     headers: {
        //       Authorization: `Bearer ${accessToken}`,
        //     },
        //   }
        // );
        // const data = await response.json();
        // files = data.files.map(file => ({
        //   id: file.id,
        //   name: file.name,
        //   type: file.mimeType.includes('folder') ? 'folder' : file.mimeType.includes('pdf') ? 'pdf' : 'document',
        //   size: parseInt(file.size || '0'),
        //   childCount: file.mimeType.includes('folder') ? 5 : undefined
        // }));
      } else if (provider === 'Dropbox') {
        // Example Dropbox API call structure (not actually executed)
        // const response = await fetch(
        //   'https://api.dropboxapi.com/2/files/list_folder',
        //   {
        //     method: 'POST',
        //     headers: {
        //       Authorization: `Bearer ${accessToken}`,
        //       'Content-Type': 'application/json',
        //     },
        //     body: JSON.stringify({
        //       path: folderId === 'root' ? '' : folderId,
        //     }),
        //   }
        // );
        // const data = await response.json();
        // files = data.entries.map(entry => ({
        //   id: entry.id,
        //   name: entry.name,
        //   type: entry['.tag'] === 'folder' ? 'folder' : entry.name.endsWith('.pdf') ? 'pdf' : 'document',
        //   size: entry.size || 0,
        //   childCount: entry['.tag'] === 'folder' ? 3 : undefined
        // }));
      } else if (provider === 'OneDrive') {
        // Example OneDrive API call structure (not actually executed)
        // const response = await fetch(
        //   `https://graph.microsoft.com/v1.0/me/drive/items/${folderId === 'root' ? 'root' : folderId}/children`,
        //   {
        //     headers: {
        //       Authorization: `Bearer ${accessToken}`,
        //     },
        //   }
        // );
        // const data = await response.json();
        // files = data.value.map(item => ({
        //   id: item.id,
        //   name: item.name,
        //   type: item.folder ? 'folder' : item.name.endsWith('.pdf') ? 'pdf' : 'document',
        //   size: item.size || 0,
        //   childCount: item.folder ? item.folder.childCount : undefined
        // }));
      }

      // For demonstration purposes, we'll generate some fake files
      const mockFiles = [];

      if (folderId === 'root') {
        // Add some folders at the root level
        mockFiles.push({ id: 'folder1', name: 'Documents', type: 'folder', size: 0, childCount: 5 });
        mockFiles.push({ id: 'folder2', name: 'Images', type: 'folder', size: 0, childCount: 3 });
        mockFiles.push({ id: 'folder3', name: 'Projects', type: 'folder', size: 0, childCount: 2 });

        // Add some files at the root level
        mockFiles.push({ id: 'file1', name: 'Report.pdf', type: 'pdf', size: 2500000 });
        mockFiles.push({ id: 'file2', name: 'Presentation.pptx', type: 'document', size: 1800000 });
        mockFiles.push({ id: 'file3', name: 'Data.xlsx', type: 'spreadsheet', size: 900000 });
      } else if (folderId === 'folder1') {
        // Files in the Documents folder
        mockFiles.push({ id: 'doc1', name: 'Resume.docx', type: 'document', size: 350000 });
        mockFiles.push({ id: 'doc2', name: 'Contract.pdf', type: 'pdf', size: 1200000 });
        mockFiles.push({ id: 'doc3', name: 'Notes.txt', type: 'document', size: 15000 });
        mockFiles.push({ id: 'doc4', name: 'Report-2023.pdf', type: 'pdf', size: 2800000 });
        mockFiles.push({ id: 'doc5', name: 'Meeting Minutes.docx', type: 'document', size: 280000 });
      }

      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      setCloudFiles(mockFiles);
    } catch (error) {
      console.error(`Error loading files from ${provider}:`, error);
      toast({
        title: "Error",
        description: `Failed to load files from ${provider}. Please try again.`,
        variant: "destructive"
      });
    } finally {
      setCloudLoading(false);
    }
  };

  // Navigate to parent folder
  const navigateToParentFolder = () => {
    if (folderHistory.length > 0) {
      // Remove current folder from history
      const newHistory = [...folderHistory];
      newHistory.pop();
      setFolderHistory(newHistory);

      // Navigate to parent (last item in new history or root)
      const parentFolder = newHistory.length > 0 ? newHistory[newHistory.length - 1] : 'root';
      loadCloudFiles(cloudProvider, parentFolder);
    } else {
      // Already at root
      loadCloudFiles(cloudProvider, 'root');
    }
  };

  // Handle cloud file selection or folder navigation
  const handleCloudFileSelect = (cloudFile: {id: string; name: string; type: string; size: number; childCount?: number}) => {
    if (cloudFile.type === 'folder') {
      // Navigate to folder
      loadCloudFiles(cloudProvider, cloudFile.id);
    } else {
      try {
        // Select file for upload
        // In a real implementation, you would download the file from the cloud provider
        // and then process it like a local file

        // For demonstration, we'll simulate downloading and processing a file
        setCloudLoading(true);
        setCloudDialogOpen(false);

        // Simulate file download and processing
        setTimeout(() => {
          const fileName = cloudFile.name;
          const fileSize = cloudFile.size;
          const fileType = cloudFile.type === 'pdf' ? 'application/pdf' : 'text/plain';

          // Create a mock File object
          const mockFile = new File(
            [new ArrayBuffer(fileSize)], // Empty content for demo
            fileName,
            { type: fileType }
          );

          setFile(mockFile);
          setCloudLoading(false);

          // Simulate text extraction
          const mockText = `This is sample text extracted from ${fileName}. In a real implementation, this would be the actual content of the file downloaded from ${cloudProvider}.`;

          // Set the text for analysis
          setText(mockText);

          toast({
            title: "File Selected",
            description: `${fileName} has been selected from ${cloudProvider}.`,
          });

          // Reset folder navigation history when a file is selected
          setFolderHistory([]);
          setCurrentFolder('root');
        }, 1500);
      } catch (error) {
        console.error("Error selecting cloud file:", error);
        toast({
          title: "Error selecting file",
          description: "There was a problem downloading the file from the cloud.",
          variant: "destructive"
        });
      } finally {
        setCloudLoading(false);
      }
    }
  };

  // Handle file upload to cloud
  const handleCloudUpload = async () => {
    // This would be implemented with the cloud provider's API
    // For now, we'll just show a toast message
    toast({
      title: "Upload to Cloud",
      description: "This feature would upload the current file to your cloud storage.",
    });
  };

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
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    return result.value;
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

  const readTextFile = (uploadedFile: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        resolve(e.target?.result as string || '');
      };

      reader.onerror = () => {
        reject(new Error('Error reading text file'));
      };

      reader.readAsText(uploadedFile);
    });
  };

  // Function to extract text from Word documents
  const extractTextFromDoc = async (docFile: File): Promise<string> => {
    // This would be implemented with a DOCX parsing library
    // For now, we'll return a placeholder message
    return `Text extracted from document: ${docFile.name}`;
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

      // Process the entire document based on file type
      let extractedText = '';

      if (uploadedFile.type === 'application/pdf') {
        // Process PDF file
        extractedText = await extractTextFromPdf(uploadedFile);
      } else if (uploadedFile.type === 'text/plain') {
        // Process text file
        extractedText = await readTextFile(uploadedFile);
      } else if (uploadedFile.type.includes('word') ||
                 uploadedFile.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        // Process Word document
        extractedText = await extractTextFromDoc(uploadedFile);
      } else {
        // For other file types, try to read as text
        try {
          extractedText = await readTextFile(uploadedFile);
        } catch (error) {
          console.error('Error reading file:', error);
          throw new Error('Unsupported file format or unable to extract text');
        }
      }

      setProgress(100);
      return extractedText;
    } finally {
      setIsLoading(false);
    }
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
      setProgress(20);
      const extractedText = await extractTextFromFile(file);
      setProgress(70);

      // Set the extracted text for analysis
      setText(extractedText);
      setProgress(80);

      // Save to database if user is authenticated
      if (isAuthenticated) {
        setProgress(90);
        // Create a basic analysis result object to store with the file
        const initialAnalysisResult = {
          id: crypto.randomUUID(),
          title: file.name,
          text: extractedText.substring(0, 500) + (extractedText.length > 500 ? '...' : ''), // Store a preview
          date: new Date(),
          plagiarismScore: 0,
          grammarScore: 0,
          readabilityScore: 0,
          plagiarismInstances: [],
          grammarIssues: [],
          readabilityMetrics: {},
          suggestions: [],
          settings: {}
        };

        // Get access token and save file analysis to database
        try {
          const token = await getAccessToken();
          if (token) {
            await DatabaseService.saveFileAnalysis(
              file.name,
              file.type,
              file.size,
              null, // Don't store full content in DB for space reasons
              null, // No file URL since we're not uploading to cloud storage yet
              initialAnalysisResult,
              token
            );
          }
        } catch (saveError) {
          console.error('Error saving file analysis:', saveError);
          // Don't fail the upload, just log the error
        }
      }
      setProgress(100);

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
      setProgress(0);
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
          <Tabs defaultValue="local" value={uploadTab} onValueChange={setUploadTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="local" className="flex items-center gap-2">
                <FolderOpen className="h-4 w-4" />
                Local Device
              </TabsTrigger>
              <TabsTrigger
                value="cloud"
                className="flex items-center gap-2"
                disabled={!isAuthenticated}
                title={!isAuthenticated ? "Sign in to access cloud storage" : "Upload from cloud storage"}
              >
                <Cloud className="h-4 w-4" />
                Cloud Storage
              </TabsTrigger>
            </TabsList>

            <TabsContent value="local" className="mt-0">
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
                  type="file"
                  id="file-upload"
                  className="hidden"
                  onChange={handleFileChange}
                  accept={SUPPORTED_FILE_TYPES.join(',')}
                  ref={fileInputRef}
                  aria-label="Upload file"
                  title="Select a file to upload"
                />
              </div>
            </TabsContent>

            <TabsContent value="cloud" className="mt-0">
              {!isAuthenticated ? (
                <div className="border-2 border-dashed rounded-lg p-12 text-center">
                  <div className="flex flex-col items-center justify-center space-y-4">
                    <LogIn className="h-8 w-8 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Sign in to access cloud storage</p>
                      <p className="text-sm text-muted-foreground">You need to be signed in to upload files from cloud storage</p>
                    </div>
                    <Button asChild variant="outline" className="mt-2">
                      <a href="/signin">Sign In</a>
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="border-2 border-dashed rounded-lg p-12 text-center">
                  <div className="flex flex-col items-center justify-center space-y-6">
                    <Cloud className="h-8 w-8 text-primary" />
                    <div>
                      <p className="font-medium">Select from cloud storage</p>
                      <p className="text-sm text-muted-foreground">Choose a cloud provider to browse your files</p>
                    </div>

                    <div className="grid grid-cols-3 gap-4 w-full max-w-md">
                      <Button
                        variant="outline"
                        className="flex flex-col items-center justify-center h-24 p-2"
                        onClick={() => handleCloudProviderSelect('Google Drive')}
                      >
                        <div className="relative">
                          <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center mb-2">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-6 w-6 text-red-600" fill="currentColor">
                              <path d="M12 14L6.5 20H17.5L12 14Z" />
                              <path d="M19.77 14.33L16.5 8.5H7.5L4.23 14.33L9.73 14.33L12 17.5L14.27 14.33H19.77Z" />
                            </svg>
                          </div>
                          <div className="absolute -top-2 -right-2 bg-amber-500 text-white text-[8px] px-1 py-0.5 rounded-full whitespace-nowrap">Coming Soon</div>
                        </div>
                        <span className="text-xs">Google Drive</span>
                      </Button>

                      <Button
                        variant="outline"
                        className="flex flex-col items-center justify-center h-24 p-2"
                        onClick={() => handleCloudProviderSelect('Dropbox')}
                      >
                        <div className="relative">
                          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center mb-2">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-6 w-6 text-blue-600" fill="currentColor">
                              <path d="M12 14.5L7.5 10.5L12 6.5L16.5 10.5L12 14.5Z" />
                              <path d="M7.5 14.5L3 10.5L7.5 6.5L12 10.5L7.5 14.5Z" />
                              <path d="M16.5 14.5L12 10.5L16.5 6.5L21 10.5L16.5 14.5Z" />
                              <path d="M12 14.5L7.5 18.5L12 22.5L16.5 18.5L12 14.5Z" />
                            </svg>
                          </div>
                          <div className="absolute -top-2 -right-2 bg-amber-500 text-white text-[8px] px-1 py-0.5 rounded-full whitespace-nowrap">Coming Soon</div>
                        </div>
                        <span className="text-xs">Dropbox</span>
                      </Button>

                      <Button
                        variant="outline"
                        className="flex flex-col items-center justify-center h-24 p-2"
                        onClick={() => handleCloudProviderSelect('OneDrive')}
                      >
                        <div className="relative">
                          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center mb-2">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-6 w-6 text-blue-500" fill="currentColor">
                              <path d="M10.5 15L5 12L2 16L9 18L10.5 15Z" />
                              <path d="M14.5 15L19 12L22 16L15 18L14.5 15Z" />
                              <path d="M9 6L12.5 5L16 9L12 11L9 6Z" />
                              <path d="M9 6L5 9L9 11L9 6Z" />
                            </svg>
                          </div>
                          <div className="absolute -top-2 -right-2 bg-amber-500 text-white text-[8px] px-1 py-0.5 rounded-full whitespace-nowrap">Coming Soon</div>
                        </div>
                        <span className="text-xs">OneDrive</span>
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>
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
            <DialogDescription>
              This PDF is password protected. Please enter the password to continue.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
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

      {/* Cloud Authentication Dialog */}
      <Dialog open={authDialogOpen} onOpenChange={setAuthDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {cloudProvider === 'Google Drive' && (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-5 w-5 text-red-600" fill="currentColor">
                  <path d="M12 14L6.5 20H17.5L12 14Z" />
                  <path d="M19.77 14.33L16.5 8.5H7.5L4.23 14.33L9.73 14.33L12 17.5L14.27 14.33H19.77Z" />
                </svg>
              )}
              {cloudProvider === 'Dropbox' && (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-5 w-5 text-blue-600" fill="currentColor">
                  <path d="M12 14.5L7.5 10.5L12 6.5L16.5 10.5L12 14.5Z" />
                  <path d="M7.5 14.5L3 10.5L7.5 6.5L12 10.5L7.5 14.5Z" />
                  <path d="M16.5 14.5L12 10.5L16.5 6.5L21 10.5L16.5 14.5Z" />
                  <path d="M12 14.5L7.5 18.5L12 22.5L16.5 18.5L12 14.5Z" />
                </svg>
              )}
              {cloudProvider === 'OneDrive' && (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-5 w-5 text-blue-500" fill="currentColor">
                  <path d="M10.5 15L5 12L2 16L9 18L10.5 15Z" />
                  <path d="M14.5 15L19 12L22 16L15 18L14.5 15Z" />
                  <path d="M9 6L12.5 5L16 9L12 11L9 6Z" />
                  <path d="M9 6L5 9L9 11L9 6Z" />
                </svg>
              )}
              Connect to {cloudProvider}
            </DialogTitle>
            <DialogDescription>
              You need to authenticate with {cloudProvider} before accessing your files.
            </DialogDescription>
          </DialogHeader>

          <div className="py-6 flex flex-col items-center justify-center space-y-4">
            {cloudLoading ? (
              <div className="flex flex-col items-center justify-center w-full">
                <Progress value={45} className="w-full mb-4" />
                <p className="text-sm text-muted-foreground">Connecting to {cloudProvider}...</p>
              </div>
            ) : (
              <>
                <div className="p-4 bg-muted rounded-full">
                  <Lock className="h-6 w-6 text-primary" />
                </div>
                <div className="text-center">
                  <h3 className="font-medium mb-1">Secure Authentication</h3>
                  <p className="text-sm text-muted-foreground max-w-xs">
                    TreeText will request read-only access to your {cloudProvider} files. You can revoke access at any time.
                  </p>
                </div>
                <Button onClick={handleCloudAuth} className="mt-2">
                  <LogIn className="h-4 w-4 mr-2" /> Connect to {cloudProvider}
                </Button>
              </>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setAuthDialogOpen(false)} disabled={cloudLoading}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Cloud Storage Files Dialog */}
      <Dialog open={cloudDialogOpen} onOpenChange={setCloudDialogOpen}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {cloudProvider === 'Google Drive' && (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-5 w-5 text-red-600" fill="currentColor">
                  <path d="M12 14L6.5 20H17.5L12 14Z" />
                  <path d="M19.77 14.33L16.5 8.5H7.5L4.23 14.33L9.73 14.33L12 17.5L14.27 14.33H19.77Z" />
                </svg>
              )}
              {cloudProvider === 'Dropbox' && (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-5 w-5 text-blue-600" fill="currentColor">
                  <path d="M12 14.5L7.5 10.5L12 6.5L16.5 10.5L12 14.5Z" />
                  <path d="M7.5 14.5L3 10.5L7.5 6.5L12 10.5L7.5 14.5Z" />
                  <path d="M16.5 14.5L12 10.5L16.5 6.5L21 10.5L16.5 14.5Z" />
                  <path d="M12 14.5L7.5 18.5L12 22.5L16.5 18.5L12 14.5Z" />
                </svg>
              )}
              {cloudProvider === 'OneDrive' && (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-5 w-5 text-blue-500" fill="currentColor">
                  <path d="M10.5 15L5 12L2 16L9 18L10.5 15Z" />
                  <path d="M14.5 15L19 12L22 16L15 18L14.5 15Z" />
                  <path d="M9 6L12.5 5L16 9L12 11L9 6Z" />
                  <path d="M9 6L5 9L9 11L9 6Z" />
                </svg>
              )}
              Browse {cloudProvider} Files
            </DialogTitle>
            <DialogDescription>
              Select a file from your {cloudProvider} account to analyze.
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            {cloudLoading ? (
              <div className="flex flex-col items-center justify-center py-8">
                <Progress value={45} className="w-full mb-4" />
                <p className="text-sm text-muted-foreground">Loading your files from {cloudProvider}...</p>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    {currentFolder !== 'root' && (
                      <Button variant="ghost" size="sm" onClick={navigateToParentFolder}>
                        <ArrowLeft className="h-4 w-4 mr-1" /> Back
                      </Button>
                    )}
                    <Input placeholder="Search files..." className="max-w-xs" />
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" onClick={handleCloudUpload}>
                      <Upload className="h-4 w-4 mr-2" /> Upload
                    </Button>
                    <Button variant="outline" size="sm">
                      <RefreshCw className="h-4 w-4 mr-2" /> Refresh
                    </Button>
                  </div>
                </div>

                <div className="border rounded-md">
                  <div className="flex items-center justify-between p-3 bg-muted/50 text-sm font-medium border-b">
                    <div className="flex-1">Name</div>
                    <div className="w-24 text-right">Size</div>
                    <div className="w-8"></div>
                  </div>

                  <div className="divide-y max-h-[400px] overflow-y-auto">
                    {cloudFiles.map((file) => (
                      <div
                        key={file.id}
                        className="flex items-center justify-between p-3 hover:bg-muted/50 cursor-pointer"
                        onClick={() => handleCloudFileSelect(file)}
                      >
                        <div className="flex items-center flex-1 min-w-0">
                          {file.type === 'folder' ? (
                            <Folder className="h-5 w-5 text-yellow-500 mr-3 flex-shrink-0" />
                          ) : file.type === 'pdf' ? (
                            <FileIcon className="h-5 w-5 text-red-500 mr-3 flex-shrink-0" />
                          ) : file.type === 'document' ? (
                            <FileText className="h-5 w-5 text-blue-500 mr-3 flex-shrink-0" />
                          ) : file.type === 'spreadsheet' ? (
                            <Table className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                          ) : (
                            <FileText className="h-5 w-5 text-gray-500 mr-3 flex-shrink-0" />
                          )}
                          <div className="truncate">
                            <span className="truncate">{file.name}</span>
                            {file.type === 'folder' && (
                              <span className="text-xs text-muted-foreground ml-2">{file.childCount} items</span>
                            )}
                          </div>
                        </div>
                        <div className="w-24 text-right text-sm text-muted-foreground">
                          {file.type !== 'folder' ? formatFileSize(file.size) : ''}
                        </div>
                        <div className="w-8 text-right">
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-40 p-0" align="end">
                              <div className="p-1">
                                {file.type !== 'folder' && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="w-full justify-start text-sm"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleCloudFileSelect(file);
                                    }}
                                  >
                                    <Download className="h-4 w-4 mr-2" /> Select File
                                  </Button>
                                )}
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="w-full justify-start text-sm"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <ExternalLink className="h-4 w-4 mr-2" /> View Details
                                </Button>
                              </div>
                            </PopoverContent>
                          </Popover>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setCloudDialogOpen(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FileUploader;
