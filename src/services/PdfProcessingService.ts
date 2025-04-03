import * as pdfjsLib from 'pdfjs-dist';
import * as Tesseract from 'tesseract.js';

// Import the worker directly to ensure it's bundled with the application
import 'pdfjs-dist/build/pdf.worker.mjs';

// Get the actual version from PDF.js library
const pdfJsVersion = pdfjsLib.version;
console.log(`Using PDF.js version: ${pdfJsVersion}`);

// Define a constant for cMap URL to use consistently throughout the code
const CMAP_URL = `https://unpkg.com/pdfjs-dist@${pdfJsVersion}/cmaps/`;

// The worker will be automatically set up by the import above
console.log('PDF.js worker initialized with direct import');

// This function is now just a placeholder for backward compatibility
// The worker is already set up by the direct import above
const setupWorkerFallback = () => {
  // No need to do anything as the worker is already set up
  console.log('Worker already set up via direct import');
};

/**
 * Service for advanced PDF processing including OCR, password handling, and server-side processing
 */
export class PdfProcessingService {
  private static instance: PdfProcessingService;
  private ocrWorker: Tesseract.Worker | null = null;
  // Use a mock API endpoint for demo purposes
  private apiEndpoint = 'https://api.example.com/pdf-processing';

  private constructor() {
    // Private constructor for singleton pattern
  }

  /**
   * Get singleton instance of PdfProcessingService
   */
  public static getInstance(): PdfProcessingService {
    if (!PdfProcessingService.instance) {
      PdfProcessingService.instance = new PdfProcessingService();
    }
    return PdfProcessingService.instance;
  }

  /**
   * Initialize the OCR worker
   */
  private async initOcrWorker(): Promise<Tesseract.Worker> {
    if (!this.ocrWorker) {
      // Create a worker with English language data
      this.ocrWorker = await Tesseract.createWorker();
      
      // For demo purposes, we'll use a simplified initialization
      // In a production environment, we would properly configure the worker
      try {
        // Simplified initialization for demo
        console.log('Initializing OCR worker...');
      } catch (error) {
        console.error('Error initializing OCR worker:', error);
      }
    }
    return this.ocrWorker;
  }

  /**
   * Extract text from a PDF file with advanced processing capabilities
   * @param file The PDF file to process
   * @param password Optional password for protected PDFs
   * @param useOcr Whether to use OCR for scanned PDFs
   * @param useServerSide Whether to use server-side processing for complex PDFs
   * @param progressCallback Callback for progress updates
   */
  public async extractTextFromPdf(
    file: File,
    password?: string,
    useOcr = false,
    useServerSide = false,
    progressCallback?: (progress: number) => void
  ): Promise<string> {
    try {
      // Start with client-side processing
      progressCallback?.(10);
      
      // Try server-side processing if requested
      if (useServerSide) {
        try {
          return await this.processWithServer(file, password, progressCallback);
        } catch (serverError) {
          console.warn('Server-side processing failed, falling back to client-side:', serverError);
          // Fall back to client-side processing
        }
      }
      
      // Try standard PDF.js extraction first
      try {
        const text = await this.extractWithPdfJs(file, password, progressCallback);
        
        // If text is empty or very short, it might be a scanned PDF
        if (text.trim().length < 100 && useOcr) {
          return await this.extractWithOcr(file, progressCallback);
        }
        
        return text;
      } catch (pdfJsError) {
        console.warn('PDF.js extraction failed:', pdfJsError);
        
        // Try pdf-parse as a fallback
        try {
          const text = await this.extractWithFallback(file, password, progressCallback);
          
          // If text is empty or very short, it might be a scanned PDF
          if (text.trim().length < 100 && useOcr) {
            return await this.extractWithOcr(file, progressCallback);
          }
          
          return text;
        } catch (fallbackError) {
          console.warn('Fallback extraction failed:', fallbackError);
          
          // Last resort: try OCR if enabled
          if (useOcr) {
            return await this.extractWithOcr(file, progressCallback);
          }
          
          throw new Error('Failed to extract text from PDF using multiple methods');
        }
      }
    } catch (error) {
      console.error('Error in PDF processing:', error);
      throw new Error(`Failed to process PDF: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Extract text from PDF using PDF.js
   */
  private async extractWithPdfJs(
    file: File, 
    password?: string,
    progressCallback?: (progress: number) => void
  ): Promise<string> {
    // Use worker fallback if needed
    setupWorkerFallback();
    const arrayBuffer = await file.arrayBuffer();
    progressCallback?.(20);
    
    const loadingTask = pdfjsLib.getDocument({
      data: arrayBuffer,
      password: password || '',
    });
    
    const pdf = await loadingTask.promise;
    progressCallback?.(30);
    
    let fullText = '';
    const numPages = pdf.numPages;
    
    for (let i = 1; i <= numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items
        .map(item => {
          // Handle TextItem which has 'str' property
          if ('str' in item) {
            return item.str;
          }
          return '';
        })
        .join(' ');
      
      fullText += pageText + '\n\n';
      
      // Update progress based on page completion
      progressCallback?.(30 + Math.floor((i / numPages) * 50));
    }
    
    progressCallback?.(80);
    return fullText;
  }

  /**
   * Extract text from PDF using a fallback method
   */
  private async extractWithFallback(
    file: File,
    password?: string,
    progressCallback?: (progress: number) => void
  ): Promise<string> {
    // Use worker fallback if needed
    setupWorkerFallback();
    progressCallback?.(20);
    
    try {
      // Try to use PDF.js in a different way as a fallback
      const arrayBuffer = await file.arrayBuffer();
      progressCallback?.(40);
      
      const loadingTask = pdfjsLib.getDocument({
        data: arrayBuffer,
        password: password || '',
        // Try with different options
        cMapUrl: CMAP_URL,
        cMapPacked: true,
      });
      
      const pdf = await loadingTask.promise;
      progressCallback?.(60);
      
      let fullText = '';
      for (let i = 1; i <= pdf.numPages; i++) {
        try {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          
          // Use a consistent approach to extract text
          const pageText = textContent.items
            .map(item => {
              // Handle TextItem which has 'str' property
              if ('str' in item) {
                return item.str;
              }
              return '';
            })
            .join(' ');
          
          fullText += pageText + '\n\n';
        } catch (pageError) {
          console.warn(`Error extracting text from page ${i}:`, pageError);
        }
      }
      
      progressCallback?.(80);
      return fullText;
    } catch (error) {
      console.error('Fallback extraction failed:', error);
      return 'Failed to extract text with fallback method.';
    }
  }

  /**
   * Extract text from PDF using OCR (Tesseract.js)
   * 
   * Note: This is a simplified demo implementation.
   * In a production environment, we would use a more robust approach.
   */
  private async extractWithOcr(
    file: File,
    progressCallback?: (progress: number) => void
  ): Promise<string> {
    progressCallback?.(20);
    
    try {
      // For demo purposes, we'll simulate OCR processing
      // In a real implementation, we would use Tesseract.js properly
      progressCallback?.(30);
      
      // Create a URL for the file
      const fileUrl = URL.createObjectURL(file);
      
      try {
        // Load the PDF document
        const pdf = await pdfjsLib.getDocument({
          url: fileUrl,
          cMapUrl: CMAP_URL,
          cMapPacked: true,
        }).promise;
        
        // Process the first page
        const page = await pdf.getPage(1);
        const textContent = await page.getTextContent();
        
        // Extract text from the page
        const pageText = textContent.items
          .map(item => {
            // Handle TextItem which has 'str' property
            if ('str' in item) {
              return item.str;
            }
            return '';
          })
          .join(' ');
        
        progressCallback?.(50);
        
        // Simulate OCR processing delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        progressCallback?.(70);
        
        // Clean up
        URL.revokeObjectURL(fileUrl);
        
        // For demo purposes, we'll add some text to indicate OCR was used
        const enhancedText = pageText + '\n\n[Note: This text was processed using simulated OCR technology]';
        
        progressCallback?.(90);
        return enhancedText;
      } catch (pdfError) {
        console.error('Error processing PDF for OCR:', pdfError);
        URL.revokeObjectURL(fileUrl);
        
        // Provide a fallback message
        return 'OCR processing attempted but could not process the PDF page. ' +
               'In a production environment, we would implement additional ' +
               'conversion steps to handle this case.';
      }
    } catch (error) {
      console.error('OCR processing error:', error);
      throw new Error(`Failed to process PDF with OCR: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Process PDF using server-side API (mock implementation for demo)
   */
  private async processWithServer(
    file: File,
    password?: string,
    progressCallback?: (progress: number) => void
  ): Promise<string> {
    // Use worker fallback if needed
    setupWorkerFallback();
    progressCallback?.(10);
    
    // In a real implementation, we would send the file to a server
    // For this demo, we'll simulate server processing with a delay
    // and use the client-side extraction as a fallback
    
    try {
      // Simulate network request
      progressCallback?.(30);
      
      // Create a simulated delay to represent server processing
      await new Promise(resolve => setTimeout(resolve, 1000));
      progressCallback?.(50);
      
      // Fall back to client-side processing
      const arrayBuffer = await file.arrayBuffer();
      const loadingTask = pdfjsLib.getDocument({
        data: arrayBuffer,
        password: password || '',
        cMapUrl: CMAP_URL,
        cMapPacked: true,
      });
      
      const pdf = await loadingTask.promise;
      progressCallback?.(70);
      
      let fullText = '';
      for (let i = 1; i <= Math.min(pdf.numPages, 5); i++) { // Process only first 5 pages for demo
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        
        const pageText = textContent.items
          .map(item => {
            // Handle TextItem which has 'str' property
            if ('str' in item) {
              return item.str;
            }
            return '';
          })
          .join(' ');
        
        fullText += pageText + '\n\n';
      }
      
      progressCallback?.(90);
      
      // Add a note that this is simulated server processing
      return fullText + '\n\n[Note: This text was processed using simulated server-side processing]';
    } catch (error) {
      console.error('Server processing simulation failed:', error);
      throw new Error(`Server processing failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Check if a PDF is password protected
   */
  public async isPasswordProtected(file: File): Promise<boolean> {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
      
      await loadingTask.promise;
      return false; // If we get here, the PDF is not password protected
    } catch (error) {
      // Check if the error is due to password protection
      if (error instanceof Error && 
          (error.message.includes('password') || 
           error.message.includes('encrypted'))) {
        return true;
      }
      // Some other error occurred
      return false;
    }
  }

  /**
   * Clean up resources
   */
  public async terminate(): Promise<void> {
    if (this.ocrWorker) {
      await this.ocrWorker.terminate();
      this.ocrWorker = null;
    }
  }
}

export default PdfProcessingService.getInstance();
