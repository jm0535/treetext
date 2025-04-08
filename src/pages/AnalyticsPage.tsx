import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart2, Home, TrendingUp, PieChart, Calendar, ArrowUpRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '@/components/PageHeader';

const AnalyticsPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Sample analytics data
  const analyticsData = [
    { 
      title: 'Text Complexity', 
      value: '72/100', 
      change: '+5%', 
      trend: 'up',
      description: 'Average complexity score of your text analyses'
    },
    { 
      title: 'Grammar Score', 
      value: '89/100', 
      change: '+2%', 
      trend: 'up',
      description: 'Average grammar score of your text analyses'
    },
    { 
      title: 'Readability', 
      value: '65/100', 
      change: '-3%', 
      trend: 'down',
      description: 'Average readability score of your text analyses'
    },
    { 
      title: 'Vocabulary Diversity', 
      value: '78/100', 
      change: '+8%', 
      trend: 'up',
      description: 'Unique words used across all analyses'
    }
  ];

  // Monthly activity data
  const monthlyActivity = [
    { month: 'Jan', count: 2 },
    { month: 'Feb', count: 5 },
    { month: 'Mar', count: 3 },
    { month: 'Apr', count: 7 },
    { month: 'May', count: 4 },
    { month: 'Jun', count: 6 }
  ];

  return (
    <div className="container max-w-6xl mx-auto px-4 py-8">
      <div className="flex flex-col space-y-8">
        <PageHeader
          title="Detailed Analytics"
          description="View your text analysis metrics and performance over time"
          breadcrumbs={[
            { label: 'Dashboard', path: '/dashboard', icon: <Home className="h-4 w-4 mr-1" /> },
            { label: 'Analytics', path: '/analytics', icon: <BarChart2 className="h-4 w-4 mr-1" /> }
          ]}
        />

        {/* Analytics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {analyticsData.map((item, i) => (
            <Card key={i} className="border-primary/20">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{item.title}</p>
                    <h3 className="text-2xl font-bold mt-1">{item.value}</h3>
                  </div>
                  <div className={`flex items-center ${item.trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                    <span className="text-sm font-medium">{item.change}</span>
                    {item.trend === 'up' ? 
                      <TrendingUp className="h-4 w-4 ml-1" /> : 
                      <TrendingUp className="h-4 w-4 ml-1 transform rotate-180" />
                    }
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-2">{item.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Detailed Analytics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Monthly Activity</CardTitle>
                <Calendar className="h-5 w-5 text-muted-foreground" />
              </div>
              <CardDescription>Number of analyses per month</CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="h-60 flex items-end justify-between gap-2 pt-4">
                {monthlyActivity.map((month, i) => (
                  <div key={i} className="flex flex-col items-center gap-2">
                    <div 
                      className="bg-primary/80 rounded-t-sm w-10" 
                      style={{ height: `${month.count * 30}px` }}
                    ></div>
                    <span className="text-xs font-medium">{month.month}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Analysis Breakdown</CardTitle>
                <PieChart className="h-5 w-5 text-muted-foreground" />
              </div>
              <CardDescription>Types of analyses performed</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center h-60">
                <div className="relative w-40 h-40">
                  {/* Simple pie chart visualization */}
                  <div className="absolute inset-0 rounded-full border-8 border-primary/70" style={{ clipPath: 'polygon(50% 50%, 0 0, 0 50%, 0 100%, 50% 100%, 100% 100%, 100% 0, 50% 0)' }}></div>
                  <div className="absolute inset-0 rounded-full border-8 border-primary/40" style={{ clipPath: 'polygon(50% 50%, 100% 0, 100% 50%, 100% 100%, 50% 100%, 0 100%, 0 50%, 0 0)' }}></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-lg font-bold">3</span>
                  </div>
                </div>
                <div className="ml-6 space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-primary/70 rounded-sm"></div>
                    <span className="text-sm">Academic (60%)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-primary/40 rounded-sm"></div>
                    <span className="text-sm">Business (40%)</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Improvements */}
        <Card>
          <CardHeader>
            <CardTitle>Improvement Trends</CardTitle>
            <CardDescription>Your text quality improvements over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Grammar</span>
                  <span className="text-sm text-muted-foreground">+12%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full" style={{ width: '75%' }}></div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Vocabulary</span>
                  <span className="text-sm text-muted-foreground">+8%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full" style={{ width: '60%' }}></div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Structure</span>
                  <span className="text-sm text-muted-foreground">+15%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full" style={{ width: '85%' }}></div>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" onClick={() => navigate('/history')}>
              View Analysis History
              <ArrowUpRight className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default AnalyticsPage;
