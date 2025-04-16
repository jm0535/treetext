import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { FileText, BarChart2, Settings, User, Clock, Star, Home, Loader2, TrendingUp, Type, BookOpen, CheckCircle, AlertCircle, Lightbulb, Calendar, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '@/components/PageHeader';
import DatabaseService from '@/services/DatabaseService';
import { AnalysisResult } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';

// Define types for our dashboard data
interface ActivityItem {
  id: string;
  title: string;
  date: Date;
  type: 'text' | 'file';
  grammarScore?: number;
  readabilityScore?: number;
  plagiarismScore?: number;
  fileType?: string;
  fileName?: string;
}

interface UserStats {
  totalAnalyses: number;
  textAnalysesCount: number;
  fileAnalysesCount: number;
  avgGrammarScore: number;
  avgReadabilityScore: number;
  avgPlagiarismScore: number;
  improvementScore: string;
  lastUpdated: Date;
}

interface WeeklyActivity {
  day: string;
  count: number;
}

interface RecommendationItem {
  title: string;
  description: string;
  icon: React.ReactNode;
  actionText: string;
  actionLink: string;
  type: 'tip' | 'warning' | 'info';
}

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(true);
  const [recentAnalyses, setRecentAnalyses] = useState<AnalysisResult[]>([]);
  const [recentFileAnalyses, setRecentFileAnalyses] = useState<any[]>([]);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [activeFilter, setActiveFilter] = useState<'all' | 'text' | 'file'>('all');
  const [weeklyActivity, setWeeklyActivity] = useState<WeeklyActivity[]>([]);
  const [recommendations, setRecommendations] = useState<RecommendationItem[]>([]);
  
  // Format date for last login
  const formatDate = (timestamp: string | null) => {
    if (!timestamp) return 'N/A';
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Helper function to format activity items
  const formatActivityItem = (item: any, type: 'text' | 'file'): ActivityItem => {
    return {
      id: item.id,
      title: type === 'text' ? (item.title || 'Untitled Analysis') : (item.fileName || 'Untitled File'),
      date: item.date,
      type,
      grammarScore: item.grammarScore,
      readabilityScore: item.readabilityScore,
      plagiarismScore: item.plagiarismScore,
      fileType: type === 'file' ? item.fileType : undefined,
      fileName: type === 'file' ? item.fileName : undefined
    };
  };

  // Calculate weekly activity data
  const calculateWeeklyActivity = (textAnalyses: AnalysisResult[], fileAnalyses: any[]) => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const today = new Date();
    const weeklyData: WeeklyActivity[] = [];
    
    // Initialize with zero counts for the past 7 days
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(today.getDate() - i);
      weeklyData.push({
        day: days[date.getDay()],
        count: 0
      });
    }
    
    // Count analyses for each day
    const allAnalyses = [...textAnalyses, ...fileAnalyses];
    allAnalyses.forEach(analysis => {
      const analysisDate = new Date(analysis.date);
      const daysDiff = Math.floor((today.getTime() - analysisDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysDiff >= 0 && daysDiff < 7) {
        weeklyData[6 - daysDiff].count += 1;
      }
    });
    
    return weeklyData;
  };

  // Generate personalized recommendations based on user stats
  const generateRecommendations = (stats: UserStats | null): RecommendationItem[] => {
    const recommendations: RecommendationItem[] = [];
    
    if (!stats) return recommendations;
    
    // Recommendation for low grammar score
    if (stats.avgGrammarScore < 70) {
      recommendations.push({
        title: 'Improve Your Grammar Score',
        description: 'Your recent analyses show opportunities to improve sentence structure and grammar.',
        icon: <BookOpen className="h-5 w-5 text-amber-500" />,
        actionText: 'View Grammar Tips',
        actionLink: '/tips/grammar',
        type: 'tip'
      });
    }
    
    // Recommendation for infrequent usage
    if (stats.totalAnalyses < 5) {
      recommendations.push({
        title: 'Analyze More Documents',
        description: 'Regular analysis helps build a more accurate profile of your writing style.',
        icon: <CheckCircle className="h-5 w-5 text-blue-500" />,
        actionText: 'Start New Analysis',
        actionLink: '/',
        type: 'info'
      });
    }
    
    // Recommendation for readability improvement
    if (stats.avgReadabilityScore < 65) {
      recommendations.push({
        title: 'Enhance Text Readability',
        description: 'Consider using shorter sentences and simpler vocabulary to improve readability.',
        icon: <Lightbulb className="h-5 w-5 text-yellow-500" />,
        actionText: 'Readability Guide',
        actionLink: '/tips/readability',
        type: 'tip'
      });
    }
    
    // Always add at least one recommendation
    if (recommendations.length === 0) {
      recommendations.push({
        title: 'Explore Advanced Features',
        description: 'Try analyzing different document types to see how TreeText can help with various writing tasks.',
        icon: <Star className="h-5 w-5 text-primary" />,
        actionText: 'View Features',
        actionLink: '/guide',
        type: 'info'
      });
    }
    
    return recommendations.slice(0, 2); // Limit to 2 recommendations
  };

  // Load user data from database
  useEffect(() => {
    const loadUserData = async () => {
      setLoading(true);
      try {
        // Fetch recent text analyses
        const textAnalyses = await DatabaseService.getTextAnalysisHistory(10); // Get more for weekly activity
        setRecentAnalyses(textAnalyses);
        
        // Fetch recent file uploads
        const fileAnalyses = await DatabaseService.getFileAnalysisHistory(10); // Get more for weekly activity
        setRecentFileAnalyses(fileAnalyses);
        
        // Fetch user statistics
        const stats = await DatabaseService.getUserDashboardStats();
        setUserStats(stats);
        
        // Calculate weekly activity
        const weeklyData = calculateWeeklyActivity(textAnalyses, fileAnalyses);
        setWeeklyActivity(weeklyData);
        
        // Generate personalized recommendations
        const recs = generateRecommendations(stats);
        setRecommendations(recs);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    if (user) {
      loadUserData();
    } else {
      setLoading(false);
    }
  }, [user]);

  // Combine text and file analyses for recent activity
  const combinedRecentActivity = [...recentAnalyses, ...recentFileAnalyses]
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .slice(0, 5);

  const lastLoginTime = user?.last_sign_in_at ? formatDate(user.last_sign_in_at) : 'First login';
  
  // Helper function to render activity item
  const renderActivityItem = (item: AnalysisResult | Record<string, any>, type: 'text' | 'file') => {
    const isFileAnalysis = type === 'file';
    const title = isFileAnalysis ? item.fileName || 'Untitled File' : item.title || 'Untitled Analysis';
    const path = isFileAnalysis ? `/file-analysis/${item.id}` : `/analysis/${item.id}`;
    
    return (
      <div 
        key={item.id} 
        className="flex items-start space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
        onClick={() => navigate(path)}
      >
        <div className={`p-2 rounded-full ${isFileAnalysis ? 'bg-blue-100' : 'bg-primary/10'}`}>
          <FileText className={`h-4 w-4 ${isFileAnalysis ? 'text-blue-600' : 'text-primary'}`} />
        </div>
        <div className="flex-1 space-y-1 min-w-0">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium truncate">{title}</p>
            <Badge variant={isFileAnalysis ? 'secondary' : 'default'} className="text-xs">
              {isFileAnalysis ? 'File' : 'Text'}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground">{formatDate(item.date)}</p>
          {(item.grammarScore !== undefined || item.readabilityScore !== undefined) && (
            <div className="flex gap-2 mt-1">
              {item.grammarScore !== undefined && (
                <div className="flex items-center gap-1">
                  <div className="h-2 w-2 rounded-full bg-green-500"></div>
                  <span className="text-xs">G: {item.grammarScore.toFixed(0)}</span>
                </div>
              )}
              {item.readabilityScore !== undefined && (
                <div className="flex items-center gap-1">
                  <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                  <span className="text-xs">R: {item.readabilityScore.toFixed(0)}</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  // Helper function to render stat card
  const renderStatCard = (icon: React.ReactNode, title: string, value: string | number, change?: string, changeType?: 'positive' | 'negative' | 'neutral') => {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-between items-start">
            <div className="p-2 rounded-full bg-primary/10">
              {icon}
            </div>
            {change && (
              <Badge variant={changeType === 'positive' ? 'default' : changeType === 'negative' ? 'destructive' : 'outline'} className="text-xs">
                {change}
              </Badge>
            )}
          </div>
          <div className="mt-4">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <h3 className="text-2xl font-bold mt-1">{value}</h3>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="container max-w-6xl mx-auto px-4 py-8">
      <PageHeader
        title={`Welcome back, ${user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User'}`}
        description="Here's an overview of your TreeText activity"
        breadcrumbs={[
          { label: 'Dashboard', path: '/dashboard', icon: <Home className="h-4 w-4 mr-1" /> }
        ]}
        showBackButton={false}
        actions={
          <Button 
            onClick={() => navigate('/')} 
            className="bg-primary hover:bg-primary/90"
          >
            <FileText className="mr-2 h-4 w-4" />
            New Text Analysis
          </Button>
        }
      />

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
          <Skeleton className="h-[120px] rounded-lg" />
          <Skeleton className="h-[120px] rounded-lg" />
          <Skeleton className="h-[120px] rounded-lg" />
          <Skeleton className="h-[120px] rounded-lg" />
          <Skeleton className="h-[300px] rounded-lg md:col-span-2" />
          <Skeleton className="h-[300px] rounded-lg md:col-span-2" />
        </div>
      ) : (
        <div className="flex flex-col space-y-8 mt-8">
          {/* Stats Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {renderStatCard(
              <FileText className="h-5 w-5 text-primary" />,
              "Total Analyses",
              userStats?.totalAnalyses || 0,
              userStats?.totalAnalyses > 5 ? "+" + (userStats?.totalAnalyses - 5) : undefined,
              "positive"
            )}
            {renderStatCard(
              <Type className="h-5 w-5 text-amber-500" />,
              "Grammar Score",
              userStats?.avgGrammarScore?.toFixed(1) || "N/A",
              userStats?.improvementScore ? userStats.improvementScore : undefined,
              userStats?.improvementScore?.startsWith("+") ? "positive" : "negative"
            )}
            {renderStatCard(
              <BookOpen className="h-5 w-5 text-blue-500" />,
              "Readability",
              userStats?.avgReadabilityScore?.toFixed(1) || "N/A"
            )}
            {renderStatCard(
              <Calendar className="h-5 w-5 text-indigo-500" />,
              "Last Login",
              formatDate(user?.last_sign_in_at || "").split(' at')[0]
            )}
          </div>
          
          {/* Main Dashboard Content */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Activity & Progress Section */}
            <div className="md:col-span-2 space-y-6">
              {/* Weekly Activity */}
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">Weekly Activity</CardTitle>
                      <CardDescription>Your analysis activity for the past 7 days</CardDescription>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => navigate('/analytics')}>
                      <BarChart2 className="h-5 w-5" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="h-[180px] flex items-end justify-between gap-2">
                    {weeklyActivity.map((day, index) => (
                      <div key={index} className="flex flex-col items-center flex-1">
                        <div className="w-full flex-1 flex flex-col-reverse">
                          <div 
                            className="w-full bg-primary/80 rounded-t-sm" 
                            style={{ 
                              height: `${Math.max(15, (day.count / Math.max(...weeklyActivity.map(d => d.count), 1)) * 120)}px`,
                              minHeight: day.count > 0 ? '15px' : '4px',
                              backgroundColor: day.count > 0 ? undefined : 'var(--muted)'
                            }}
                          ></div>
                        </div>
                        <span className="text-xs mt-2 text-muted-foreground">{day.day}</span>
                        <span className="text-xs font-medium">{day.count}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              {/* Recent Activity with Filters */}
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Recent Activity</CardTitle>
                    <div className="flex items-center space-x-2">
                      <Button 
                        variant={activeFilter === 'all' ? 'default' : 'ghost'} 
                        size="sm" 
                        className="h-8 gap-1" 
                        onClick={() => setActiveFilter('all')}
                      >
                        <Filter className="h-4 w-4" />
                        <span>All</span>
                      </Button>
                      <Button 
                        variant={activeFilter === 'text' ? 'default' : 'ghost'} 
                        size="sm" 
                        className="h-8 gap-1" 
                        onClick={() => setActiveFilter('text')}
                      >
                        <Type className="h-4 w-4" />
                        <span>Text</span>
                      </Button>
                      <Button 
                        variant={activeFilter === 'file' ? 'default' : 'ghost'} 
                        size="sm" 
                        className="h-8 gap-1" 
                        onClick={() => setActiveFilter('file')}
                      >
                        <FileText className="h-4 w-4" />
                        <span>Files</span>
                      </Button>
                    </div>
                  </div>
                  <CardDescription>Your latest analyses and uploads</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="max-h-[320px] overflow-y-auto">
                    {recentAnalyses.length === 0 && recentFileAnalyses.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-8">
                        <p className="text-muted-foreground text-sm">No recent activity</p>
                        <Button className="mt-4" onClick={() => navigate('/')}>
                          Start New Analysis
                        </Button>
                      </div>
                    ) : (
                      <div className="divide-y">
                        {/* Text analyses */}
                        {activeFilter !== 'file' && recentAnalyses.map(analysis => 
                          renderActivityItem(analysis, 'text')
                        )}
                        
                        {/* File analyses */}
                        {activeFilter !== 'text' && recentFileAnalyses.map(file => 
                          renderActivityItem(file, 'file')
                        )}
                      </div>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="border-t bg-muted/50 py-3">
                  <Button variant="outline" size="sm" className="w-full" onClick={() => navigate('/history')}>
                    View Complete History
                  </Button>
                </CardFooter>
              </Card>
            </div>
            
            {/* Right Sidebar */}
            <div className="space-y-6">
              {/* User Profile Card */}
              <Card className="border-primary/20">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Your Profile</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16 border-2 border-primary/20">
                      <AvatarFallback className="bg-primary/10 text-primary font-bold text-xl">
                        {user?.email?.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-medium text-lg">
                        {user?.user_metadata?.full_name || user?.email?.split('@')[0]}
                      </h3>
                      <p className="text-sm text-muted-foreground">{user?.email}</p>
                      <div className="flex items-center mt-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3 mr-1" />
                        Last login: {lastLoginTime}
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => navigate('/profile')}
                  >
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => navigate('/settings')}
                  >
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </Button>
                </CardFooter>
              </Card>
              
              {/* Progress Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Writing Progress</CardTitle>
                  <CardDescription>Your improvement over time</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Grammar Score */}
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Grammar Score</span>
                      <span className="text-sm font-medium">{userStats?.avgGrammarScore?.toFixed(0) || 'N/A'}/100</span>
                    </div>
                    <Progress value={userStats?.avgGrammarScore || 0} className="h-2" />
                  </div>
                  
                  {/* Readability Score */}
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Readability</span>
                      <span className="text-sm font-medium">{userStats?.avgReadabilityScore?.toFixed(0) || 'N/A'}/100</span>
                    </div>
                    <Progress value={userStats?.avgReadabilityScore || 0} className="h-2" />
                  </div>
                  
                  {/* Plagiarism Score */}
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Originality</span>
                      <span className="text-sm font-medium">{userStats?.avgPlagiarismScore?.toFixed(0) || 'N/A'}/100</span>
                    </div>
                    <Progress value={userStats?.avgPlagiarismScore || 0} className="h-2" />
                  </div>
                </CardContent>
              </Card>
              
              {/* Personalized Recommendations */}
              <Card className="border-primary/20">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Recommendations</CardTitle>
                  <CardDescription>Personalized tips to improve your writing</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {recommendations.length > 0 ? (
                    recommendations.map((rec, index) => (
                      <div key={index} className="p-3 rounded-lg bg-muted/50">
                        <div className="flex items-start space-x-3">
                          <div className="shrink-0 mt-0.5">
                            {rec.icon}
                          </div>
                          <div className="space-y-1">
                            <p className="font-medium text-sm">{rec.title}</p>
                            <p className="text-xs text-muted-foreground">{rec.description}</p>
                            <Button 
                              variant="link" 
                              className="h-auto p-0 text-xs" 
                              onClick={() => navigate(rec.actionLink)}
                            >
                              {rec.actionText}
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-sm text-muted-foreground">No recommendations available</p>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              {/* Quick Actions */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3">
                    <Button onClick={() => navigate('/')} className="flex flex-col items-center justify-center h-20 space-y-2">
                      <FileText className="h-5 w-5" />
                      <span className="text-xs">New Analysis</span>
                    </Button>
                    <Button onClick={() => navigate('/', { state: { inputMethod: 'file' } })} variant="outline" className="flex flex-col items-center justify-center h-20 space-y-2">
                      <FileText className="h-5 w-5" />
                      <span className="text-xs">Upload File</span>
                    </Button>
                    <Button onClick={() => navigate('/analytics')} variant="outline" className="flex flex-col items-center justify-center h-20 space-y-2">
                      <BarChart2 className="h-5 w-5" />
                      <span className="text-xs">Analytics</span>
                    </Button>
                    <Button onClick={() => navigate('/settings')} variant="outline" className="flex flex-col items-center justify-center h-20 space-y-2">
                      <Settings className="h-5 w-5" />
                      <span className="text-xs">Settings</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
