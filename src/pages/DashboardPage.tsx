import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { FileText, BarChart2, Settings, User, Clock, Star, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '@/components/PageHeader';

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
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
              <CardDescription>Your latest text analyses</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3].map((_, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-md hover:bg-muted/50 transition-colors cursor-pointer" onClick={() => navigate('/')}>
                    <div className="bg-primary/10 p-2 rounded-md">
                      <FileText className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">Sample Text Analysis {i + 1}</p>
                      <p className="text-xs text-muted-foreground">{new Date(Date.now() - i * 86400000).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="ghost" size="sm" className="w-full" onClick={() => navigate('/history')}>
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
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="bg-primary/10 p-2 rounded-md">
                      <FileText className="h-4 w-4 text-primary" />
                    </div>
                    <span className="text-sm font-medium">Total Analyses</span>
                  </div>
                  <span className="font-bold">3</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="bg-primary/10 p-2 rounded-md">
                      <BarChart2 className="h-4 w-4 text-primary" />
                    </div>
                    <span className="text-sm font-medium">Improvement Score</span>
                  </div>
                  <span className="font-bold text-primary">+15%</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="ghost" size="sm" className="w-full" onClick={() => navigate('/analytics')}>
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
