/**
 * Service for tracking and limiting API usage
 * Implements economical and realistic usage limits to control costs
 */

import { toast } from "@/hooks/use-toast";
import { UsageLimit } from "@/types";
import { STORAGE_KEYS } from "@/utils/constants";

// Default usage limits - professional tier
const DEFAULT_USAGE_LIMITS: UsageLimit = {
  // Daily limits (conservative to manage costs)
  dailyAnalysisLimit: 10,           // 10 analyses per day
  dailyAnalysisCount: 0,
  dailyTokenLimit: 50000,           // ~25 pages of text per day
  dailyTokenCount: 0,
  
  // Monthly limits
  monthlyAnalysisLimit: 100,        // 100 analyses per month
  monthlyAnalysisCount: 0,
  monthlyTokenLimit: 500000,        // ~250 pages of text per month
  monthlyTokenCount: 0,
  
  // Last reset timestamps
  lastDailyReset: new Date().toISOString(),
  lastMonthlyReset: new Date().toISOString()
};

// Token estimation constants
const AVG_TOKENS_PER_WORD = 1.5;   // Average tokens per word for embedding models

class UsageService {
  private static instance: UsageService;
  private usageLimit: UsageLimit;
  
  private constructor() {
    this.usageLimit = this.loadUsageLimits();
    this.checkAndResetLimits();
  }
  
  /**
   * Get singleton instance
   */
  public static getInstance(): UsageService {
    if (!UsageService.instance) {
      UsageService.instance = new UsageService();
    }
    return UsageService.instance;
  }
  
  /**
   * Load usage limits from local storage or use defaults
   */
  private loadUsageLimits(): UsageLimit {
    try {
      const storedLimits = localStorage.getItem(STORAGE_KEYS.USAGE_LIMITS);
      if (storedLimits) {
        return JSON.parse(storedLimits) as UsageLimit;
      }
    } catch (error) {
      console.error('Failed to load usage limits from local storage:', error);
    }
    
    // Return default limits if none found
    return { ...DEFAULT_USAGE_LIMITS };
  }
  
  /**
   * Save current usage limits to local storage
   */
  private saveUsageLimits(): void {
    try {
      localStorage.setItem(
        STORAGE_KEYS.USAGE_LIMITS,
        JSON.stringify(this.usageLimit)
      );
    } catch (error) {
      console.error('Failed to save usage limits to local storage:', error);
    }
  }
  
  /**
   * Check if daily/monthly limits need to be reset based on timestamps
   */
  private checkAndResetLimits(): void {
    const now = new Date();
    const lastDailyReset = new Date(this.usageLimit.lastDailyReset);
    const lastMonthlyReset = new Date(this.usageLimit.lastMonthlyReset);
    
    // Check if day has changed
    if (now.getDate() !== lastDailyReset.getDate() || 
        now.getMonth() !== lastDailyReset.getMonth() ||
        now.getFullYear() !== lastDailyReset.getFullYear()) {
      
      // Reset daily counts
      this.usageLimit.dailyAnalysisCount = 0;
      this.usageLimit.dailyTokenCount = 0;
      this.usageLimit.lastDailyReset = now.toISOString();
    }
    
    // Check if month has changed
    if (now.getMonth() !== lastMonthlyReset.getMonth() ||
        now.getFullYear() !== lastMonthlyReset.getFullYear()) {
      
      // Reset monthly counts
      this.usageLimit.monthlyAnalysisCount = 0;
      this.usageLimit.monthlyTokenCount = 0;
      this.usageLimit.lastMonthlyReset = now.toISOString();
    }
    
    // Save updated limits
    this.saveUsageLimits();
  }
  
  /**
   * Check if user can perform an analysis based on current usage
   * @param textLength Length of text to analyze (in characters)
   * @returns Boolean indicating if analysis is allowed
   */
  public canPerformAnalysis(textLength: number): boolean {
    // Refresh limits in case day/month has changed
    this.checkAndResetLimits();
    
    // Estimate token count (words * avg tokens per word)
    const wordCount = textLength / 5; // Rough estimate: 5 chars per word
    const estimatedTokens = Math.ceil(wordCount * AVG_TOKENS_PER_WORD);
    
    // Check daily analysis count limit
    if (this.usageLimit.dailyAnalysisCount >= this.usageLimit.dailyAnalysisLimit) {
      toast({
        title: 'Daily Limit Reached',
        description: `You've reached your limit of ${this.usageLimit.dailyAnalysisLimit} analyses per day.`,
        variant: 'destructive'
      });
      return false;
    }
    
    // Check monthly analysis count limit
    if (this.usageLimit.monthlyAnalysisCount >= this.usageLimit.monthlyAnalysisLimit) {
      toast({
        title: 'Monthly Limit Reached',
        description: `You've reached your limit of ${this.usageLimit.monthlyAnalysisLimit} analyses per month.`,
        variant: 'destructive'
      });
      return false;
    }
    
    // Check daily token limit
    if (this.usageLimit.dailyTokenCount + estimatedTokens > this.usageLimit.dailyTokenLimit) {
      toast({
        title: 'Daily Token Limit Reached',
        description: 'You\'ve reached your daily token limit. Try a shorter text or try again tomorrow.',
        variant: 'destructive'
      });
      return false;
    }
    
    // Check monthly token limit
    if (this.usageLimit.monthlyTokenCount + estimatedTokens > this.usageLimit.monthlyTokenLimit) {
      toast({
        title: 'Monthly Token Limit Reached',
        description: 'You\'ve reached your monthly token limit. Try a shorter text or try again next month.',
        variant: 'destructive'
      });
      return false;
    }
    
    // All checks passed
    return true;
  }
  
  /**
   * Record usage after a successful analysis
   * @param textLength Length of text analyzed (in characters)
   * @param actualTokens Actual tokens used (if available, otherwise estimated)
   */
  public recordUsage(textLength: number, actualTokens?: number): void {
    // Estimate token count if not provided
    const wordCount = textLength / 5; // Rough estimate: 5 chars per word
    const tokenCount = actualTokens || Math.ceil(wordCount * AVG_TOKENS_PER_WORD);
    
    // Update usage counts
    this.usageLimit.dailyAnalysisCount += 1;
    this.usageLimit.monthlyAnalysisCount += 1;
    this.usageLimit.dailyTokenCount += tokenCount;
    this.usageLimit.monthlyTokenCount += tokenCount;
    
    // Save updated limits
    this.saveUsageLimits();
    
    // Log usage for monitoring
    console.log(`Usage recorded: +1 analysis, +${tokenCount} tokens`);
    console.log(`Daily usage: ${this.usageLimit.dailyAnalysisCount}/${this.usageLimit.dailyAnalysisLimit} analyses, ${this.usageLimit.dailyTokenCount}/${this.usageLimit.dailyTokenLimit} tokens`);
  }
  
  /**
   * Get current usage statistics
   * @returns Current usage limits and counts
   */
  public getUsageStats(): UsageLimit {
    // Refresh limits in case day/month has changed
    this.checkAndResetLimits();
    return { ...this.usageLimit };
  }
  
  /**
   * Update usage limits (e.g., for different user tiers)
   * @param newLimits New usage limits to apply
   */
  public updateLimits(newLimits: Partial<UsageLimit>): void {
    this.usageLimit = {
      ...this.usageLimit,
      ...newLimits
    };
    this.saveUsageLimits();
  }
  
  /**
   * Calculate remaining usage as percentages
   * @returns Object with remaining usage percentages
   */
  public getRemainingUsage(): {
    dailyAnalysisPercent: number;
    monthlyAnalysisPercent: number;
    dailyTokenPercent: number;
    monthlyTokenPercent: number;
  } {
    // Refresh limits in case day/month has changed
    this.checkAndResetLimits();
    
    // Calculate percentage remaining for each limit type
    // Ensure values are capped between 0-100%
    const dailyAnalysisPercent = Math.max(
      0, 
      Math.min(
        100, 
        100 - (this.usageLimit.dailyAnalysisCount / this.usageLimit.dailyAnalysisLimit * 100)
      )
    );
    
    const monthlyAnalysisPercent = Math.max(
      0, 
      Math.min(
        100, 
        100 - (this.usageLimit.monthlyAnalysisCount / this.usageLimit.monthlyAnalysisLimit * 100)
      )
    );
    
    const dailyTokenPercent = Math.max(
      0, 
      Math.min(
        100, 
        100 - (this.usageLimit.dailyTokenCount / this.usageLimit.dailyTokenLimit * 100)
      )
    );
    
    const monthlyTokenPercent = Math.max(
      0, 
      Math.min(
        100, 
        100 - (this.usageLimit.monthlyTokenCount / this.usageLimit.monthlyTokenLimit * 100)
      )
    );
    
    return {
      dailyAnalysisPercent,
      monthlyAnalysisPercent,
      dailyTokenPercent,
      monthlyTokenPercent
    };
  }
}

export default UsageService.getInstance();
