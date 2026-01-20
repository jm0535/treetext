import { AnalysisResult } from "@/types";

/**
 * Service for database operations related to analysis history
 */
class DatabaseService {
  private static instance: DatabaseService;
  private API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

  private constructor() {}

  /**
   * Check if the current user is an administrator
   * @param token Auth0 Access Token
   * @returns Promise resolving to boolean indicating if user is admin
   */
  public async isUserAdmin(token?: string): Promise<boolean> {
    // For now, rely on backend to handle admin checks or decode token
    // TODO: Implement proper role check
    return false;
  }

  /**
   * Get singleton instance
   */
  public static getInstance(): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService();
    }
    return DatabaseService.instance;
  }

  /**
   * Save text analysis result to database
   * @param result Analysis result to save
   * @param token Auth0 Access Token
   * @returns Promise resolving to the saved record ID or null if failed
   */
  public async saveTextAnalysis(result: AnalysisResult, token: string): Promise<string | null> {
    try {
      const response = await fetch(`${this.API_URL}/analysis/text`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
           text: result.text,
           title: result.title,
           results: {
             plagiarismScore: result.plagiarismScore,
             grammarScore: result.grammarScore,
             readabilityScore: result.readabilityScore,
             plagiarismInstances: result.plagiarismInstances,
             grammarIssues: result.grammarIssues,
             readabilityMetrics: result.readabilityMetrics,
             suggestions: result.suggestions
           },
           settings: result.settings
        })
      });

      if (!response.ok) throw new Error('Failed to save analysis');
      const data = await response.json();
      return data.id;
    } catch (error) {
      console.error("Failed to save text analysis:", error);
      return null;
    }
  }

  /**
   * Save file upload analysis result to database
   * @param fileName Name of the uploaded file
   * @param fileType MIME type of the file
   * @param fileSize Size of the file in bytes
   * @param fileContent Text content of the file (if applicable)
   * @param fileUrl URL to the file (if stored)
   * @param result Analysis result
   * @param token Auth0 Access Token
   * @returns Promise resolving to the saved record ID or null if failed
   */
  public async saveFileAnalysis(
    fileName: string,
    fileType: string,
    fileSize: number,
    fileContent: string | null,
    fileUrl: string | null,
    result: AnalysisResult,
    token: string
  ): Promise<string | null> {
    try {
      const response = await fetch(`${this.API_URL}/analysis/file`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          fileName,
          fileType,
          fileSize,
          fileContent,
          fileUrl,
          results: {
             plagiarismScore: result.plagiarismScore,
             grammarScore: result.grammarScore,
             readabilityScore: result.readabilityScore,
             plagiarismInstances: result.plagiarismInstances,
             grammarIssues: result.grammarIssues,
             readabilityMetrics: result.readabilityMetrics,
             suggestions: result.suggestions
          },
          settings: result.settings
        })
      });

      if (!response.ok) throw new Error('Failed to save file analysis');
      const data = await response.json();
      return data.id;
    } catch (error) {
      console.error("Failed to save file analysis:", error);
      return null;
    }
  }

  /**
   * Get text analysis history for current user
   * @param limit Maximum number of records to retrieve
   * @param token Auth0 Access Token
   * @returns Promise resolving to array of analysis results
   */
  public async getTextAnalysisHistory(token: string, limit: number = 10): Promise<AnalysisResult[]> {
    try {
      const response = await fetch(`${this.API_URL}/history?type=text&limit=${limit}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) return [];

      const data = await response.json();
      // Filter locally for now effectively
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return data.filter((d: any) => d.type === 'text').map((record: any) => ({
        id: record.id,
        text: record.textContent,
        title: record.title,
        date: new Date(record.createdAt),
        userId: record.userId,
        plagiarismScore: record.plagiarismScore,
        grammarScore: record.grammarScore,
        readabilityScore: record.readabilityScore,
        plagiarismInstances: record.results?.plagiarismInstances || [],
        grammarIssues: record.results?.grammarIssues || [],
        readabilityMetrics: record.results?.readabilityMetrics || {},
        suggestions: record.results?.suggestions || [],
        settings: record.analysisSettings || {}
      }));
    } catch (error) {
      console.error("Failed to fetch text history:", error);
      return [];
    }
  }

  /**
   * Get file upload history for current user
   * @param limit Maximum number of records to retrieve
   * @param token Auth0 Access Token
   * @returns Promise resolving to array of file analysis results
   */
  public async getFileAnalysisHistory(token: string, limit: number = 10): Promise<any[]> {
    try {
      const response = await fetch(`${this.API_URL}/history?type=file&limit=${limit}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) return [];

      const data = await response.json();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return data.filter((d: any) => d.type === 'file').map((record: any) => ({
        id: record.id,
        fileName: record.fileName,
        fileType: record.fileType,
        fileSize: record.fileSize,
        fileUrl: record.fileUrl,
        date: new Date(record.createdAt),
        userId: record.userId,
        plagiarismScore: record.plagiarismScore,
        grammarScore: record.grammarScore,
        readabilityScore: record.readabilityScore,
        results: record.results || {}
      }));
    } catch (error) {
       console.error("Failed to fetch file history:", error);
       return [];
    }
  }

  /**
   * Delete a text analysis record
   * @param id ID of the record to delete
   * @param token Auth0 Access Token
   * @returns Promise resolving to boolean indicating success
   */
  public async deleteTextAnalysis(id: string, token: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.API_URL}/history/${id}?type=text`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      return response.ok;
    } catch (error) {
      return false;
    }
  }

  /**
   * Delete a file analysis record
   * @param id ID of the record to delete
   * @param token Auth0 Access Token
   * @returns Promise resolving to boolean indicating success
   */
  public async deleteFileAnalysis(id: string, token: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.API_URL}/history/${id}?type=file`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      return response.ok;
    } catch (error) {
      return false;
    }
  }

  /**
   * Get statistics for admin dashboard
   * @param token Auth0 Access Token
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public async getAdminStatistics(token: string): Promise<any> {
      // TODO: Implement admin stats endpoint
      return null;
  }

  /**
   * Get user dashboard statistics
   * @param token Auth0 Access Token
   * @param targetUserId Optional user ID for admin to view specific user stats
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public async getUserDashboardStats(token: string, targetUserId?: string): Promise<any> {
    // TODO: Implement stats endpoint
    return null;
  }

  /**
   * Get all analysis records (text and file) for all users since a deployment date
   * @param deploymentDate Date from which to start aggregation (inclusive)
   * @param token Auth0 Access Token
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public async getAllAnalysesSince(deploymentDate: Date, token: string, allUsers: boolean = false): Promise<any[]> {
    // TODO: Implement all analyses endpoint
    return [];
  }
}

export default DatabaseService.getInstance();
