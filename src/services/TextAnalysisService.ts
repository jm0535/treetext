
import { toast } from "@/hooks/use-toast";
import ApiClient from "./ApiClient";
import { STORAGE_KEYS, API_CONFIG, DEFAULT_ANALYSIS_SETTINGS } from "@/utils/constants";
import { 
  AnalysisResult, 
  PlagiarismInstance, 
  GrammarIssue, 
  ReadabilityMetrics,
  AnalysisSettings,
  ApiError
} from "@/types";

/**
 * Service for text analysis operations
 */
class TextAnalysisService {
  private static instance: TextAnalysisService;
  private analysisResults: AnalysisResult[] = [];
  private settings: AnalysisSettings;
  
  private constructor() {
    // Load cached results from local storage
    this.loadFromLocalStorage();
    
    // Initialize with default settings
    this.settings = {
      checkPlagiarism: DEFAULT_ANALYSIS_SETTINGS.checkPlagiarism,
      checkGrammar: DEFAULT_ANALYSIS_SETTINGS.checkGrammar,
      checkReadability: DEFAULT_ANALYSIS_SETTINGS.checkReadability,
      languageModel: DEFAULT_ANALYSIS_SETTINGS.languageModel as "standard" | "academic" | "creative"
    };
  }
  
  /**
   * Get singleton instance
   */
  public static getInstance(): TextAnalysisService {
    if (!TextAnalysisService.instance) {
      TextAnalysisService.instance = new TextAnalysisService();
    }
    return TextAnalysisService.instance;
  }
  
  /**
   * Load cached analysis results from local storage
   */
  private loadFromLocalStorage(): void {
    try {
      const storedResults = localStorage.getItem(STORAGE_KEYS.RECENT_ANALYSES);
      if (storedResults) {
        const parsedResults = JSON.parse(storedResults) as AnalysisResult[];
        // Convert string dates back to Date objects
        this.analysisResults = parsedResults.map(result => ({
          ...result,
          date: new Date(result.date)
        }));
      }
    } catch (error) {
      console.error('Failed to load analysis results from local storage:', error);
      // If loading fails, start with empty results
      this.analysisResults = [];
    }
  }
  
  /**
   * Save analysis results to local storage
   */
  private saveToLocalStorage(): void {
    try {
      localStorage.setItem(
        STORAGE_KEYS.RECENT_ANALYSES, 
        JSON.stringify(this.analysisResults)
      );
    } catch (error) {
      console.error('Failed to save analysis results to local storage:', error);
    }
  }
  
  /**
   * Update analysis settings
   */
  public updateSettings(newSettings: Partial<AnalysisSettings>): void {
    this.settings = { ...this.settings, ...newSettings };
  }
  
  /**
   * Get current analysis settings
   */
  public getSettings(): AnalysisSettings {
    return { ...this.settings };
  }

  /**
   * Analyze text using API or fallback to local analysis
   */
  public async analyzeText(text: string): Promise<AnalysisResult> {
    if (!text.trim()) {
      throw new Error('Text is empty');
    }
    
    try {
      // Try to use the API for analysis if enabled in settings
      if (API_CONFIG.USE_API && API_CONFIG.BASE_URL) {
        try {
          return await this.analyzeTextWithApi(text);
        } catch (apiError) {
          // Log the API error
          console.error('API analysis failed:', apiError);
          
          // Always fall back to local analysis for any API error
          toast({
            title: 'Using Offline Mode',
            description: 'API is unavailable. Using local analysis instead.',
            variant: 'default'
          });
        }
      }
      
      // If API is disabled or API call failed, use local analysis
      return this.analyzeTextLocally(text);
    } catch (error) {
      // Handle any errors from local analysis
      console.error('Analysis failed:', error);
      
      // Show error message and rethrow
      toast({
        title: 'Analysis Error',
        description: error instanceof Error ? error.message : 'An unknown error occurred',
        variant: 'destructive'
      });
      throw error;
    }
  }
  
  /**
   * Analyze text using the API
   */
  private async analyzeTextWithApi(text: string): Promise<AnalysisResult> {
    try {
      const result = await ApiClient.post<AnalysisResult>(
        API_CONFIG.ENDPOINTS.TEXT_ANALYSIS,
        {
          text,
          settings: this.settings
        }
      );
      
      // Save the result to history
      this.analysisResults.push(result);
      this.saveToLocalStorage();
      
      return result;
    } catch (error) {
      console.error('API analysis error:', error);
      throw error;
    }
  }
  
  /**
   * Analyze text locally (fallback when API is unavailable)
   */
  private analyzeTextLocally(text: string): AnalysisResult {
    // Create a basic analysis using local algorithms
    const result: AnalysisResult = {
      id: this.generateId(),
      originalText: text,
      plagiarismScore: this.calculatePlagiarismScore(text),
      grammarScore: this.calculateGrammarScore(text),
      readabilityScore: this.calculateReadabilityScore(text),
      plagiarismInstances: this.detectPlagiarism(text),
      grammarIssues: this.detectGrammarIssues(text),
      readabilityMetrics: this.calculateReadabilityMetrics(text),
      date: new Date()
    };
    
    // Save the result to history
    this.analysisResults.push(result);
    this.saveToLocalStorage();
    
    return result;
  }
  
  /**
   * Get recent analysis results
   */
  public getRecentResults(limit: number = 5): AnalysisResult[] {
    return [...this.analysisResults]
      .sort((a, b) => b.date.getTime() - a.date.getTime())
      .slice(0, limit);
  }
  
  /**
   * Get a specific analysis result by ID
   */
  public getResultById(id: string): AnalysisResult | undefined {
    return this.analysisResults.find(result => result.id === id);
  }
  
  /**
   * Delete a specific analysis result
   */
  public deleteResult(id: string): boolean {
    const initialLength = this.analysisResults.length;
    this.analysisResults = this.analysisResults.filter(result => result.id !== id);
    
    if (this.analysisResults.length !== initialLength) {
      this.saveToLocalStorage();
      return true;
    }
    
    return false;
  }
  
  /**
   * Clear all analysis results
   */
  public clearAllResults(): void {
    this.analysisResults = [];
    this.saveToLocalStorage();
  }
  
  /**
   * Generate a unique ID
   */
  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substring(2, 9);
  }
  
  /**
   * Calculate plagiarism score based on text content
   * @param text Text to analyze
   * @returns Score from 0-100 (higher is more original)
   */
  private calculatePlagiarismScore(text: string): number {
    // This is a simplified algorithm for local analysis
    // In production, this would use a proper plagiarism detection service
    
    const words = text.toLowerCase().split(/\s+/);
    
    // Common academic phrases that might indicate plagiarism
    const commonPhrases = [
      "in this paper", "according to research", "it can be concluded that",
      "the results indicate", "based on the findings", "previous studies have shown",
      "the data suggests", "as mentioned earlier", "in conclusion", "the analysis shows"
    ];
    
    // Calculate matches
    let matches = 0;
    for (const phrase of commonPhrases) {
      if (text.toLowerCase().includes(phrase)) {
        matches++;
      }
    }
    
    // Check for repeated sentences (potential self-plagiarism)
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const uniqueSentences = new Set(sentences.map(s => s.trim().toLowerCase()));
    const repetitionFactor = 1 - (uniqueSentences.size / sentences.length);
    
    // Calculate final score (higher = more original)
    const baseScore = 100 - (matches * 3) - (repetitionFactor * 20);
    
    // Ensure score is within valid range
    return Math.max(0, Math.min(100, baseScore));
  }
  
  /**
   * Calculate grammar score based on text content
   * @param text Text to analyze
   * @returns Score from 0-100 (higher is better grammar)
   */
  private calculateGrammarScore(text: string): number {
    // This is a simplified algorithm for local analysis
    // In production, this would use a proper grammar checking service
    
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    
    // Start with a baseline score
    let score = 95;
    
    // Grammar and style checks
    const commonErrors = [
      // Commonly confused words
      { pattern: /\b(its|it's)\b/g, penalty: 2 },
      { pattern: /\b(their|there|they're)\b/g, penalty: 2 },
      { pattern: /\b(your|you're)\b/g, penalty: 2 },
      { pattern: /\b(to|too|two)\b/g, penalty: 2 },
      { pattern: /\b(affect|effect)\b/g, penalty: 2 },
      
      // Formatting issues
      { pattern: /\s\s+/g, penalty: 1 },  // Double spaces
      { pattern: /[,.!?][A-Za-z]/g, penalty: 2 }, // Missing space after punctuation
      { pattern: /\s+[,.!?]/g, penalty: 1 }, // Space before punctuation
      
      // Sentence structure issues
      { pattern: /\b(and|but|or|because|so) (and|but|or|because|so)\b/gi, penalty: 3 }, // Double conjunctions
      { pattern: /\b(very|really|extremely|quite|actually) (very|really|extremely|quite|actually)\b/gi, penalty: 2 }, // Double intensifiers
      
      // Passive voice (simplified detection)
      { pattern: /\b(is|are|was|were|be|been|being) [a-zA-Z]+ed\b/g, penalty: 1 }
    ];
    
    // Apply penalties for detected errors
    commonErrors.forEach(error => {
      const matches = text.match(error.pattern);
      if (matches) {
        score -= matches.length * error.penalty;
      }
    });
    
    // Penalize very short or very long sentences
    const avgWordsPerSentence = text.split(/\s+/).length / Math.max(1, sentences.length);
    if (avgWordsPerSentence > 30) {
      score -= Math.min(10, (avgWordsPerSentence - 30) * 0.5);
    } else if (avgWordsPerSentence < 5 && sentences.length > 3) {
      score -= Math.min(10, (5 - avgWordsPerSentence) * 2);
    }
    
    // Ensure score is within valid range
    return Math.max(0, Math.min(100, score));
  }
  
  /**
   * Calculate readability score based on text metrics
   * @param text Text to analyze
   * @returns Score from 0-100 (higher is more readable)
   */
  private calculateReadabilityScore(text: string): number {
    const metrics = this.calculateReadabilityMetrics(text);
    
    // Implement a simplified Flesch-Kincaid reading ease score
    // Original formula: 206.835 - 1.015 * (words/sentences) - 84.6 * (syllables/words)
    // We'll approximate syllables using average word length
    
    // Adjust the formula to produce a score between 0-100
    // Higher score = easier to read
    let readabilityScore = 206.835 - (1.015 * metrics.avgSentenceLength) - (84.6 * (metrics.avgWordLength / 3));
    
    // Scale to 0-100 range
    readabilityScore = (readabilityScore / 120) * 100;
    
    // Apply penalties for very long paragraphs
    const avgSentencesPerParagraph = metrics.totalSentences / Math.max(1, metrics.totalParagraphs);
    if (avgSentencesPerParagraph > 7) {
      readabilityScore -= Math.min(15, (avgSentencesPerParagraph - 7) * 2);
    }
    
    // Ensure score is within valid range
    return Math.max(0, Math.min(100, readabilityScore));
  }
  
  /**
   * Calculate readability metrics for text
   * @param text Text to analyze
   * @returns Readability metrics
   */
  private calculateReadabilityMetrics(text: string): ReadabilityMetrics {
    // Basic text statistics
    const cleanText = text.trim();
    const words = cleanText.split(/\s+/).filter(w => w.length > 0);
    const sentences = cleanText.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const paragraphs = cleanText.split(/\n\s*\n/).filter(p => p.trim().length > 0);
    
    // Calculate average word length
    let totalChars = 0;
    for (const word of words) {
      totalChars += word.length;
    }
    const avgWordLength = words.length > 0 ? totalChars / words.length : 0;
    
    // Calculate average sentence length
    const avgSentenceLength = sentences.length > 0 ? words.length / sentences.length : 0;
    
    // Calculate approximate reading time (average reading speed is ~200-250 words per minute)
    const readingTimeMinutes = words.length / 225;
    
    // Calculate Flesch-Kincaid score
    // Formula: 206.835 - 1.015 × (words/sentences) - 84.6 × (syllables/words)
    // We'll approximate syllables using word length
    const estimatedSyllablesPerWord = Math.min(1.5, Math.max(1, avgWordLength / 3));
    let fleschKincaid = 206.835 - (1.015 * avgSentenceLength) - (84.6 * estimatedSyllablesPerWord);
    
    // Ensure score is in reasonable bounds (0-100)
    fleschKincaid = Math.max(0, Math.min(100, fleschKincaid));
    
    return {
      fleschKincaidScore: fleschKincaid,
      avgSentenceLength,
      avgWordLength,
      totalWords: words.length,
      totalSentences: sentences.length,
      totalParagraphs: paragraphs.length,
      readingTime: Math.max(0.5, Math.round(readingTimeMinutes * 10) / 10) // Round to 1 decimal place, minimum 0.5
    };
  }
  
  /**
   * Detect potential plagiarism in text
   * @param text Text to analyze
   * @returns Array of plagiarism instances
   */
  private detectPlagiarism(text: string): PlagiarismInstance[] {
    const instances: PlagiarismInstance[] = [];
    
    // Common academic phrases that might trigger plagiarism detection
    // In a real app, this would check against databases of content
    const commonPlagiarismPhrases = [
      {
        text: "according to research",
        source: "Common Academic Phrase",
        match: 65,
        url: "https://example.com/academic-writing"
      },
      {
        text: "it can be concluded that",
        source: "Journal of Academic Writing, 2025",
        match: 78,
        url: "https://example.com/journal-academic-writing"
      },
      {
        text: "the results indicate",
        source: "Scientific Reports Database",
        match: 70,
        url: "https://example.com/scientific-reports"
      },
      {
        text: "previous studies have shown",
        source: "Research Methodology Handbook",
        match: 72,
        url: "https://example.com/research-methodology"
      },
      {
        text: "in conclusion",
        source: "Common Academic Phrase",
        match: 60,
        url: "https://example.com/academic-writing"
      }
    ];
    
    // Check for exact matches of common phrases
    for (const phrase of commonPlagiarismPhrases) {
      const regex = new RegExp(phrase.text, 'gi');
      let match;
      
      while ((match = regex.exec(text)) !== null) {
        instances.push({
          id: this.generateId(),
          text: match[0],
          startIndex: match.index,
          endIndex: match.index + match[0].length,
          matchedSource: phrase.source,
          matchPercentage: phrase.match,
          sourceUrl: phrase.url
        });
      }
    }
    
    // Check for longer text segments that might be plagiarized
    // In a real implementation, this would use more sophisticated algorithms
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    
    // Identify sentences that might be plagiarized based on certain characteristics
    for (let i = 0; i < sentences.length; i++) {
      const sentence = sentences[i].trim();
      
      // Skip very short sentences
      if (sentence.split(/\s+/).length < 8) continue;
      
      // Check for sentences that have formal academic structure
      // This is a very simplified heuristic for demonstration
      if (
        (sentence.includes("study") || sentence.includes("research") || sentence.includes("analysis")) &&
        (sentence.includes("show") || sentence.includes("demonstrate") || sentence.includes("indicate") || sentence.includes("suggest"))
      ) {
        // Find the position in the original text
        const sentenceIndex = text.indexOf(sentence);
        
        if (sentenceIndex !== -1 && !instances.some(instance => 
          (instance.startIndex <= sentenceIndex && instance.endIndex >= sentenceIndex) ||
          (instance.startIndex <= sentenceIndex + sentence.length && instance.endIndex >= sentenceIndex + sentence.length)
        )) {
          instances.push({
            id: this.generateId(),
            text: sentence,
            startIndex: sentenceIndex,
            endIndex: sentenceIndex + sentence.length,
            matchedSource: "Potential match in academic literature",
            matchPercentage: 60 + (Math.random() * 15),
            sourceUrl: "https://example.com/search"
          });
        }
      }
    }
    
    return instances;
  }
  
  /**
   * Detect grammar and style issues in text
   * @param text Text to analyze
   * @returns Array of grammar issues
   */
  private detectGrammarIssues(text: string): GrammarIssue[] {
    const issues: GrammarIssue[] = [];
    
    // Common grammar issues to detect
    // In a real app, this would use a proper grammar checking API
    const grammarChecks = [
      {
        pattern: /\bit's\b(?![ \t\n]*[a-z]+ing|[ \t\n]*[a-z]+ed|[ \t\n]*a |[ \t\n]*the |[ \t\n]*an )/gi,
        issueType: "Possible Contraction Error",
        suggestion: "Check if you meant 'its' (possessive) instead of 'it's' (it is)",
        severity: "medium" as const
      },
      {
        pattern: /\b(i|we|they|you|he|she) (is|am|are|was|were) ([\w\s]+?), (but|however|though)/gi,
        issueType: "Comma Splice",
        suggestion: "Consider using a semicolon or period instead of a comma",
        severity: "medium" as const
      },
      {
        pattern: /\b(their|they're|there)\b/gi,
        issueType: "Commonly Confused Words",
        suggestion: "Verify correct usage of 'their/they're/there'",
        severity: "medium" as const
      },
      {
        pattern: /\b(your|you're)\b/gi,
        issueType: "Commonly Confused Words",
        suggestion: "Verify correct usage of 'your/you're'",
        severity: "medium" as const
      },
      {
        pattern: /\b(to|too|two)\b/gi,
        issueType: "Commonly Confused Words",
        suggestion: "Verify correct usage of 'to/too/two'",
        severity: "medium" as const
      },
      {
        pattern: /\b(affect|effect)\b/gi,
        issueType: "Commonly Confused Words",
        suggestion: "Verify correct usage of 'affect/effect'",
        severity: "medium" as const
      },
      {
        pattern: /\s{2,}/g,
        issueType: "Extra Spacing",
        suggestion: "Remove extra spaces",
        severity: "low" as const
      },
      {
        pattern: /[,.!?][A-Za-z]/g,
        issueType: "Missing Space After Punctuation",
        suggestion: "Add a space after punctuation marks",
        severity: "medium" as const
      },
      {
        pattern: /\s+[,.!?]/g,
        issueType: "Space Before Punctuation",
        suggestion: "Remove space before punctuation marks",
        severity: "low" as const
      },
      {
        pattern: /\b(and|but|or|because|so) (and|but|or|because|so)\b/gi,
        issueType: "Double Conjunction",
        suggestion: "Use only one conjunction",
        severity: "high" as const
      },
      {
        pattern: /\b(very|really|extremely|quite|actually) (very|really|extremely|quite|actually)\b/gi,
        issueType: "Double Intensifier",
        suggestion: "Use only one intensifier",
        severity: "medium" as const
      },
      {
        pattern: /\b(is|are|was|were|be|been|being) [a-zA-Z]+ed\b/g,
        issueType: "Passive Voice",
        suggestion: "Consider using active voice for stronger writing",
        severity: "low" as const
      }
    ];
    
    // Check each pattern
    for (const check of grammarChecks) {
      let match;
      while ((match = check.pattern.exec(text)) !== null) {
        issues.push({
          id: this.generateId(),
          text: match[0],
          startIndex: match.index,
          endIndex: match.index + match[0].length,
          issueType: check.issueType,
          suggestion: check.suggestion,
          severity: check.severity
        });
      }
    }
    
    // Check for sentence fragments (very simplified)
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    for (let i = 0; i < sentences.length; i++) {
      const sentence = sentences[i].trim();
      const words = sentence.split(/\s+/);
      
      // Very short sentences might be fragments
      if (words.length >= 2 && words.length <= 3) {
        // Find the position in the original text
        const sentenceIndex = text.indexOf(sentence);
        
        if (sentenceIndex !== -1 && !issues.some(issue => 
          (issue.startIndex <= sentenceIndex && issue.endIndex >= sentenceIndex) ||
          (issue.startIndex <= sentenceIndex + sentence.length && issue.endIndex >= sentenceIndex + sentence.length)
        )) {
          issues.push({
            id: this.generateId(),
            text: sentence,
            startIndex: sentenceIndex,
            endIndex: sentenceIndex + sentence.length,
            issueType: "Possible Sentence Fragment",
            suggestion: "This may be an incomplete sentence. Consider revising.",
            severity: "medium"
          });
        }
      }
    }
    
    return issues;
  }
  

}

export default TextAnalysisService.getInstance();
