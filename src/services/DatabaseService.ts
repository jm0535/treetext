import { supabase } from "@/lib/supabase";
import { AnalysisResult } from "@/types";

/**
 * Service for database operations related to analysis history
 */
class DatabaseService {
  private static instance: DatabaseService;

  private constructor() {}
  
  /**
   * Check if the current user is an administrator
   * @returns Promise resolving to boolean indicating if user is admin
   */
  public async isUserAdmin(): Promise<boolean> {
    try {
      // Get current user
      const { data: sessionData } = await supabase.auth.getSession();
      const user = sessionData?.session?.user;
      
      if (!user) {
        return false;
      }
      
      // Check if user is Jimmy Moses (admin)
      if (user.email === 'jimmy.moses@pnguot.ac.pg') {
        return true;
      }
      
      // Check user metadata for admin role
      return user.user_metadata?.role === 'admin';
    } catch (error) {
      console.error("Error checking admin status:", error);
      return false;
    }
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
   * @param allUsers If true, fetch for all users (admin only)
   * @returns Promise resolving to array of analysis results
   */
  public async getTextAnalysisHistory(limit: number = 10, allUsers: boolean = false): Promise<AnalysisResult[]> {
    try {
      // Check if user is admin when allUsers is true
      if (allUsers) {
        const isAdmin = await this.isUserAdmin();
        if (!isAdmin) {
          console.error("Access denied: Only admins can view all users' data");
          return [];
        }
      }

      // Build query - RLS will automatically filter by user_id for non-admins
      let query = supabase
        .from('text_analysis_history')
        .select('*')
        .order('created_at', { ascending: false });
      
      // Apply limit
      if (limit > 0) {
        query = query.limit(limit);
      }

      const { data, error } = await query;

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
        userId: record.user_id, // Include user ID for admin views
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
   * @param allUsers If true, fetch for all users (admin only)
   * @returns Promise resolving to array of file analysis results
   */
  public async getFileAnalysisHistory(limit: number = 10, allUsers: boolean = false): Promise<any[]> {
    try {
      // Check if user is admin when allUsers is true
      if (allUsers) {
        const isAdmin = await this.isUserAdmin();
        if (!isAdmin) {
          console.error("Access denied: Only admins can view all users' data");
          return [];
        }
      }

      // Build query - RLS will automatically filter by user_id for non-admins
      let query = supabase
        .from('file_upload_history')
        .select('*')
        .order('created_at', { ascending: false });
      
      // Apply limit
      if (limit > 0) {
        query = query.limit(limit);
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching file analysis history:", error);
        return [];
      }

      // Convert database records to a more usable format
      return data.map(record => ({
        id: record.id,
        fileName: record.file_name,
        fileType: record.file_type,
        fileSize: record.file_size,
        fileUrl: record.file_url,
        date: new Date(record.created_at),
        userId: record.user_id, // Include user ID for admin views
        plagiarismScore: record.plagiarism_score,
        grammarScore: record.grammar_score,
        readabilityScore: record.readability_score,
        results: record.results || {}
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
  
  /**
   * Get user dashboard statistics
   * @param targetUserId Optional user ID for admin to view specific user stats
   * @returns Promise resolving to user statistics object
   */
  public async getUserDashboardStats(targetUserId?: string): Promise<any> {
    try {
      // Get current user
      const { data: sessionData } = await supabase.auth.getSession();
      const currentUserId = sessionData?.session?.user?.id;
      
      if (!currentUserId) {
        console.error("Cannot fetch user stats: User not authenticated");
        return null;
      }
      
      // If targetUserId is provided and different from current user, verify admin status
      if (targetUserId && targetUserId !== currentUserId) {
        const isAdmin = await this.isUserAdmin();
        if (!isAdmin) {
          console.error("Access denied: Only admins can view other users' data");
          return null;
        }
      }
      
      // Use the appropriate user ID for queries
      const userId = targetUserId || currentUserId;
      
      // Get total text analyses count for this user
      const { count: textCount, error: textError } = await supabase
        .from('text_analysis_history')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId);

      // Get total file analyses count for this user
      const { count: fileCount, error: fileError } = await supabase
        .from('file_upload_history')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId);
        
      // Get average scores for this user
      const { data: textScores, error: scoresError } = await supabase
        .from('text_analysis_history')
        .select('plagiarism_score, grammar_score, readability_score')
        .eq('user_id', userId);
        
      // Calculate average scores if data exists
      let avgPlagiarismScore = 0;
      let avgGrammarScore = 0;
      let avgReadabilityScore = 0;
      let improvementScore = 0;
      
      if (textScores && textScores.length > 0) {
        // Calculate averages
        avgPlagiarismScore = textScores.reduce((sum, item) => sum + (item.plagiarism_score || 0), 0) / textScores.length;
        avgGrammarScore = textScores.reduce((sum, item) => sum + (item.grammar_score || 0), 0) / textScores.length;
        avgReadabilityScore = textScores.reduce((sum, item) => sum + (item.readability_score || 0), 0) / textScores.length;
        
        // Calculate improvement score (if there are multiple analyses)
        if (textScores.length >= 2) {
          // Sort by created_at (assuming it exists in the data)
          const sortedScores = [...textScores].sort((a, b) => {
            return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
          });
          
          // Compare first and last analysis
          const firstAnalysis = sortedScores[0];
          const lastAnalysis = sortedScores[sortedScores.length - 1];
          
          // Calculate improvement as percentage change in grammar and readability
          const grammarImprovement = ((lastAnalysis.grammar_score || 0) - (firstAnalysis.grammar_score || 0)) / (firstAnalysis.grammar_score || 1) * 100;
          const readabilityImprovement = ((lastAnalysis.readability_score || 0) - (firstAnalysis.readability_score || 0)) / (firstAnalysis.readability_score || 1) * 100;
          
          // Average the improvements
          improvementScore = (grammarImprovement + readabilityImprovement) / 2;
        }
      }

      if (textError || fileError || scoresError) {
        console.error("Error fetching user statistics");
        return null;
      }

      return {
        totalAnalyses: (textCount || 0) + (fileCount || 0),
        textAnalysesCount: textCount || 0,
        fileAnalysesCount: fileCount || 0,
        avgPlagiarismScore,
        avgGrammarScore,
        avgReadabilityScore,
        improvementScore: improvementScore.toFixed(2),
        lastUpdated: new Date(),
        userId // Include the user ID for reference
      };
    } catch (error) {
      console.error("Failed to fetch user statistics:", error);
      return null;
    }
  }
  /**
   * Get all analysis records (text and file) for all users since a deployment date
   * @param deploymentDate Date from which to start aggregation (inclusive)
   * @param allUsers If true, fetch for all users (admin only)
   * @returns Promise resolving to an array of analysis objects with metadata
   */
  public async getAllAnalysesSince(deploymentDate: Date, allUsers: boolean = false): Promise<any[]> {
    try {
      // Check if user is admin when allUsers is true
      if (allUsers) {
        const isAdmin = await this.isUserAdmin();
        if (!isAdmin) {
          console.error("Access denied: Only admins can view all users' data");
          return [];
        }
      }

      // Get current user for filtering if not admin view
      const { data: sessionData } = await supabase.auth.getSession();
      const userId = sessionData?.session?.user?.id;

      if (!userId && !allUsers) {
        console.error("User not authenticated");
        return [];
      }

      const sinceDateStr = deploymentDate.toISOString();

      // Build text analyses query
      let textQuery = supabase
        .from('text_analysis_history')
        .select('id, title, created_at, user_id, plagiarism_score, grammar_score, readability_score')
        .gte('created_at', sinceDateStr);

      // Apply user filter if not admin or allUsers is false
      if (!allUsers) {
        textQuery = textQuery.eq('user_id', userId);
      }

      const { data: textData, error: textError } = await textQuery;

      // Build file analyses query
      let fileQuery = supabase
        .from('file_upload_history')
        .select('id, file_name, created_at, user_id, plagiarism_score, grammar_score, readability_score')
        .gte('created_at', sinceDateStr);

      // Apply user filter if not admin or allUsers is false
      if (!allUsers) {
        fileQuery = fileQuery.eq('user_id', userId);
      }

      const { data: fileData, error: fileError } = await fileQuery;

      if (textError || fileError) {
        console.error('Error fetching analyses:', textError || fileError);
        return [];
      }

      // Format and combine the results
      const formattedTextAnalyses = (textData ?? []).map(item => ({
        id: item.id,
        type: 'text',
        title: item.title || 'Untitled Analysis',
        date: new Date(item.created_at),
        userId: item.user_id,
        plagiarismScore: item.plagiarism_score,
        grammarScore: item.grammar_score,
        readabilityScore: item.readability_score
      }));

      const formattedFileAnalyses = (fileData ?? []).map(item => ({
        id: item.id,
        type: 'file',
        title: item.file_name || 'Unnamed File',
        date: new Date(item.created_at),
        userId: item.user_id,
        plagiarismScore: item.plagiarism_score,
        grammarScore: item.grammar_score,
        readabilityScore: item.readability_score
      }));

      // Combine and sort by date (newest first)
      return [...formattedTextAnalyses, ...formattedFileAnalyses]
        .sort((a, b) => b.date.getTime() - a.date.getTime());
    } catch (error) {
      console.error('Failed to fetch analyses:', error);
      return [];
    }
  }
}

export default DatabaseService.getInstance();
