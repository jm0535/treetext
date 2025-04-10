import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { FileText, BarChart2, Settings, User, Clock, Star, Home, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '@/components/PageHeader';
import DatabaseService from '@/services/DatabaseService';
import { AnalysisResult } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(true);
  const [recentAnalyses, setRecentAnalyses] = useState<AnalysisResult[]>([]);
  const [recentFileAnalyses, setRecentFileAnalyses] = useState<any[]>([]);
  const [userStats, setUserStats] = useState<any>(null);
  
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

  // Load user data from database
  useEffect(() => {
    const loadUserData = async () => {
      setLoading(true);
      try {
        // Fetch recent text analyses
        const textAnalyses = await DatabaseService.getTextAnalysisHistory(3);
        setRecentAnalyses(textAnalyses);
        
        // Fetch recent file uploads
        const fileAnalyses = await DatabaseService.getFileAnalysisHistory(3);
        setRecentFileAnalyses(fileAnalyses);
        
        // Fetch user statistics
        const stats = await DatabaseService.getUserDashboardStats();
        setUserStats(stats);
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
    .slice(0, 3);

  const lastLoginTime = user?.last_sign_in_at ? formatDate(user.last_sign_in_at) : 'First login';

  return (
    <div className="container max-w-6xl mx-auto px-4 py-8">
      <div className="flex flex-col space-y-8">
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

        {/* User Profile Card */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="border-primary/20">
            <CardHeader className="pb-2">
              <CardTitle>Your Profile</CardTitle>
              <CardDescription>Account information and settings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 mb-4">
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
                Edit Profile
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

          {/* Recent Activity Card */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Your latest analyses</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center gap-3 p-3">
                      <Skeleton className="h-10 w-10 rounded-md" />
                      <div className="space-y-2 flex-1">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-3 w-1/2" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : combinedRecentActivity.length > 0 ? (
                <div className="space-y-4">
                  {combinedRecentActivity.map((item) => {
                    const isFileAnalysis = 'fileName' in item;
                    const title = isFileAnalysis ? item.fileName : (item.title || 'Untitled Analysis');
                    const path = isFileAnalysis ? `/file-analysis/${item.id}` : `/analysis/${item.id}`;
                    
                    return (
                      <div 
                        key={item.id} 
                        className="flex items-center gap-3 p-3 rounded-md hover:bg-muted/50 transition-colors cursor-pointer" 
                        onClick={() => navigate(path)}
                      >
                        <div className="bg-primary/10 p-2 rounded-md">
                          {isFileAnalysis ? (
                            <FileText className="h-4 w-4 text-primary" />
                          ) : (
                            <FileText className="h-4 w-4 text-primary" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">{title}</p>
                          <p className="text-xs text-muted-foreground">{item.date.toLocaleDateString()}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="py-8 text-center">
                  <p className="text-sm text-muted-foreground">No recent activity</p>
                  <p className="text-xs text-muted-foreground mt-1">Start analyzing text to see your activity here</p>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button 
                variant="ghost" 
                size="sm" 
                className="w-full" 
                onClick={() => navigate('/history')}
                disabled={combinedRecentActivity.length === 0}
              >
                View All Activity
              </Button>
            </CardFooter>
          </Card>

          {/* Stats Card */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Your Stats</CardTitle>
              <CardDescription>Text analysis metrics</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Skeleton className="h-8 w-8 rounded-md" />
                        <Skeleton className="h-4 w-24" />
                      </div>
                      <Skeleton className="h-4 w-8" />
                    </div>
                  ))}
                </div>
              ) : userStats ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="bg-primary/10 p-2 rounded-md">
                        <FileText className="h-4 w-4 text-primary" />
                      </div>
                      <span className="text-sm font-medium">Total Analyses</span>
                    </div>
                    <span className="font-bold">{userStats.totalAnalyses}</span>
                  </div>

                  {userStats.improvementScore !== '0.00' && (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="bg-primary/10 p-2 rounded-md">
                          <BarChart2 className="h-4 w-4 text-primary" />
                        </div>
                        <span className="text-sm font-medium">Improvement Score</span>
                      </div>
                      <span className={`font-bold ${parseFloat(userStats.improvementScore) > 0 ? 'text-green-600' : parseFloat(userStats.improvementScore) < 0 ? 'text-red-600' : 'text-primary'}`}>
                        {parseFloat(userStats.improvementScore) > 0 ? '+' : ''}{userStats.improvementScore}%
                      </span>
                    </div>
                  )}
                  
                  {userStats.avgGrammarScore > 0 && (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="bg-primary/10 p-2 rounded-md">
                          <Star className="h-4 w-4 text-primary" />
                        </div>
                        <span className="text-sm font-medium">Avg. Grammar Score</span>
                      </div>
                      <span className="font-bold">{userStats.avgGrammarScore.toFixed(1)}</span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="py-8 text-center">
                  <p className="text-sm text-muted-foreground">No stats available</p>
                  <p className="text-xs text-muted-foreground mt-1">Start analyzing text to see your statistics</p>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button 
                variant="ghost" 
                size="sm" 
                className="w-full" 
                onClick={() => navigate('/analytics')}
                disabled={!userStats || userStats.totalAnalyses === 0}
              >
                View Detailed Analytics
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { title: 'New Analysis', icon: <FileText className="h-5 w-5" />, path: '/' },
              { title: 'History', icon: <Clock className="h-5 w-5" />, path: '/history' },
              { title: 'Analytics', icon: <BarChart2 className="h-5 w-5" />, path: '/analytics' }
            ].map((action, i) => (
              <Card key={i} className="cursor-pointer hover:shadow-md transition-all" onClick={() => navigate(action.path)}>
                <CardContent className="flex flex-col items-center justify-center p-6">
                  <div className="bg-primary/10 p-3 rounded-full mb-3">
                    {action.icon}
                  </div>
                  <span className="font-medium">{action.title}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
