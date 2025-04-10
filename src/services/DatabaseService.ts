import { supabase } from "@/lib/supabase";
import { AnalysisResult } from "@/types";

/**
 * Service for database operations related to analysis history
 */
class DatabaseService {
  private static instance: DatabaseService;

  private constructor() {}

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
   * @returns Promise resolving to the saved record ID or null if failed
   */
  public async saveTextAnalysis(result: AnalysisResult): Promise<string | null> {
    try {
      // Get current user
      const { data: sessionData } = await supabase.auth.getSession();
      const userId = sessionData?.session?.user?.id;
      
      if (!userId) {
        console.error("Cannot save analysis: User not authenticated");
        return null;
      }

      // Prepare data for database
      const analysisData = {
        user_id: userId,
        text_content: result.text,
        title: result.title || `Analysis ${new Date().toLocaleString()}`,
        plagiarism_score: result.plagiarismScore,
        grammar_score: result.grammarScore,
        readability_score: result.readabilityScore,
        analysis_settings: result.settings,
        results: {
          plagiarismInstances: result.plagiarismInstances,
          grammarIssues: result.grammarIssues,
          readabilityMetrics: result.readabilityMetrics,
          suggestions: result.suggestions
        }
      };

      // Insert into database
      const { data, error } = await supabase
        .from('text_analysis_history')
        .insert(analysisData)
        .select('id')
        .single();

      if (error) {
        console.error("Error saving text analysis to database:", error);
        return null;
      }

      return data.id;
    } catch (error) {
      console.error("Failed to save text analysis to database:", error);
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
   * @returns Promise resolving to the saved record ID or null if failed
   */
  public async saveFileAnalysis(
    fileName: string,
    fileType: string,
    fileSize: number,
    fileContent: string | null,
    fileUrl: string | null,
    result: AnalysisResult
  ): Promise<string | null> {
    try {
      // Get current user
      const { data: sessionData } = await supabase.auth.getSession();
      const userId = sessionData?.session?.user?.id;
      
      if (!userId) {
        console.error("Cannot save file analysis: User not authenticated");
        return null;
      }

      // Prepare data for database
      const analysisData = {
        user_id: userId,
        file_name: fileName,
        file_type: fileType,
        file_size: fileSize,
        file_content: fileContent,
        file_url: fileUrl,
        plagiarism_score: result.plagiarismScore,
        grammar_score: result.grammarScore,
        readability_score: result.readabilityScore,
        analysis_settings: result.settings,
        results: {
          plagiarismInstances: result.plagiarismInstances,
          grammarIssues: result.grammarIssues,
          readabilityMetrics: result.readabilityMetrics,
          suggestions: result.suggestions
        }
      };

      // Insert into database
      const { data, error } = await supabase
        .from('file_upload_history')
        .insert(analysisData)
        .select('id')
        .single();

      if (error) {
        console.error("Error saving file analysis to database:", error);
        return null;
      }

      return data.id;
    } catch (error) {
      console.error("Failed to save file analysis to database:", error);
      return null;
    }
  }

  /**
   * Get text analysis history for current user
   * @param limit Maximum number of records to retrieve
   * @returns Promise resolving to array of analysis results
   */
  public async getTextAnalysisHistory(limit: number = 10): Promise<AnalysisResult[]> {
    try {
      const { data, error } = await supabase
        .from('text_analysis_history')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.error("Error fetching text analysis history:", error);
        return [];
      }

      // Convert database records to AnalysisResult format
      return data.map(record => ({
        id: record.id,
        text: record.text_content,
        title: record.title,
        date: new Date(record.created_at),
        plagiarismScore: record.plagiarism_score,
        grammarScore: record.grammar_score,
        readabilityScore: record.readability_score,
        plagiarismInstances: record.results?.plagiarismInstances || [],
        grammarIssues: record.results?.grammarIssues || [],
        readabilityMetrics: record.results?.readabilityMetrics || {},
        suggestions: record.results?.suggestions || [],
        settings: record.analysis_settings || {}
      }));
    } catch (error) {
      console.error("Failed to fetch text analysis history:", error);
      return [];
    }
  }

  /**
   * Get file upload history for current user
   * @param limit Maximum number of records to retrieve
   * @returns Promise resolving to array of file analysis results
   */
  public async getFileAnalysisHistory(limit: number = 10): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('file_upload_history')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.error("Error fetching file analysis history:", error);
        return [];
      }

      // Return the file history records
      return data.map(record => ({
        id: record.id,
        fileName: record.file_name,
        fileType: record.file_type,
        fileSize: record.file_size,
        fileUrl: record.file_url,
        date: new Date(record.created_at),
        plagiarismScore: record.plagiarism_score,
        grammarScore: record.grammar_score,
        readabilityScore: record.readability_score,
        results: record.results || {},
        settings: record.analysis_settings || {}
      }));
    } catch (error) {
      console.error("Failed to fetch file analysis history:", error);
      return [];
    }
  }

  /**
   * Delete a text analysis record
   * @param id ID of the record to delete
   * @returns Promise resolving to boolean indicating success
   */
  public async deleteTextAnalysis(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('text_analysis_history')
        .delete()
        .eq('id', id);

      if (error) {
        console.error("Error deleting text analysis:", error);
        return false;
      }

      return true;
    } catch (error) {
      console.error("Failed to delete text analysis:", error);
      return false;
    }
  }

  /**
   * Delete a file analysis record
   * @param id ID of the record to delete
   * @returns Promise resolving to boolean indicating success
   */
  public async deleteFileAnalysis(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('file_upload_history')
        .delete()
        .eq('id', id);

      if (error) {
        console.error("Error deleting file analysis:", error);
        return false;
      }

      return true;
    } catch (error) {
      console.error("Failed to delete file analysis:", error);
      return false;
    }
  }

  /**
   * Get statistics for admin dashboard
   * Only accessible by admin users (enforced by RLS)
   * @returns Promise resolving to statistics object
   */
  public async getAdminStatistics(): Promise<any> {
    try {
      // Get total text analyses count
      const { data: textCount, error: textError } = await supabase
        .from('text_analysis_history')
        .select('id', { count: 'exact', head: true });

      // Get total file analyses count
      const { data: fileCount, error: fileError } = await supabase
        .from('file_upload_history')
        .select('id', { count: 'exact', head: true });

      // Get user count
      const { data: userCount, error: userError } = await supabase
        .from('auth.users')
        .select('id', { count: 'exact', head: true });

      if (textError || fileError || userError) {
        console.error("Error fetching admin statistics");
        return null;
      }

      return {
        textAnalysesCount: textCount,
        fileAnalysesCount: fileCount,
        userCount: userCount,
        lastUpdated: new Date()
      };
    } catch (error) {
      console.error("Failed to fetch admin statistics:", error);
      return null;
    }
  }
}

export default DatabaseService.getInstance();
