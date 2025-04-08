import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Home, Activity, Search, Filter, FileText, Settings, User, Clock, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '@/components/PageHeader';

const ActivityPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterPeriod, setFilterPeriod] = useState('all');
  
  // Sample activity data
  const activityData = [
    { 
      id: 'activity-001',
      type: 'analysis',
      title: 'Completed Text Analysis',
      description: 'Sample Text Analysis 1',
      date: '2025-04-08T14:30:00',
      icon: <FileText className="h-5 w-5" />
    },
    { 
      id: 'activity-002',
      type: 'settings',
      title: 'Updated Account Settings',
      description: 'Changed notification preferences',
      date: '2025-04-08T10:15:00',
      icon: <Settings className="h-5 w-5" />
    },
    { 
      id: 'activity-003',
      type: 'analysis',
      title: 'Completed Text Analysis',
      description: 'Sample Text Analysis 2',
      date: '2025-04-05T16:45:00',
      icon: <FileText className="h-5 w-5" />
    },
    { 
      id: 'activity-004',
      type: 'profile',
      title: 'Updated Profile Information',
      description: 'Changed profile name and details',
      date: '2025-04-03T09:20:00',
      icon: <User className="h-5 w-5" />
    },
    { 
      id: 'activity-005',
      type: 'analysis',
      title: 'Completed Text Analysis',
      description: 'Sample Text Analysis 3',
      date: '2025-04-01T11:10:00',
      icon: <FileText className="h-5 w-5" />
    },
    { 
      id: 'activity-006',
      type: 'analysis',
      title: 'Started Text Analysis',
      description: 'Draft Business Proposal',
      date: '2025-03-28T15:30:00',
      icon: <FileText className="h-5 w-5" />
    },
    { 
      id: 'activity-007',
      type: 'settings',
      title: 'Changed Password',
      description: 'Updated account security',
      date: '2025-03-25T08:45:00',
      icon: <Settings className="h-5 w-5" />
    },
    { 
      id: 'activity-008',
      type: 'analysis',
      title: 'Completed Text Analysis',
      description: 'Research Paper Introduction',
      date: '2025-03-20T13:15:00',
      icon: <FileText className="h-5 w-5" />
    }
  ];

  // Filter activities
  const filteredActivities = activityData
    .filter(item => {
      if (filterType === 'all') return true;
      return item.type === filterType;
    })
    .filter(item => {
      const now = new Date();
      const activityDate = new Date(item.date);
      const daysDiff = Math.floor((now.getTime() - activityDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (filterPeriod === 'all') return true;
      if (filterPeriod === 'today') return daysDiff < 1;
      if (filterPeriod === 'week') return daysDiff < 7;
      if (filterPeriod === 'month') return daysDiff < 30;
      return true;
    })
    .filter(item => 
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return `Today at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else if (diffDays === 1) {
      return `Yesterday at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString([], { year: 'numeric', month: 'short', day: 'numeric' });
    }
  };

  // Group activities by date
  const groupActivitiesByDate = (activities) => {
    const groups = {};
    
    activities.forEach(activity => {
      const date = new Date(activity.date);
      const dateKey = date.toISOString().split('T')[0];
      
      if (!groups[dateKey]) {
        groups[dateKey] = {
          date: date,
          activities: []
        };
      }
      
      groups[dateKey].activities.push(activity);
    });
    
    return Object.values(groups).sort((a, b) => b.date - a.date);
  };

  const groupedActivities = groupActivitiesByDate(filteredActivities);

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8">
      <div className="flex flex-col space-y-8">
        <PageHeader
          title="Activity Log"
          description="View all your recent activities and interactions"
          breadcrumbs={[
            { label: 'Dashboard', path: '/dashboard', icon: <Home className="h-4 w-4 mr-1" /> },
            { label: 'Activity', path: '/activity', icon: <Activity className="h-4 w-4 mr-1" /> }
          ]}
        />

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search activities..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Activity Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="analysis">Analyses</SelectItem>
                <SelectItem value="profile">Profile</SelectItem>
                <SelectItem value="settings">Settings</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={filterPeriod} onValueChange={setFilterPeriod}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Time Period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Activity Timeline */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Activity Timeline</CardTitle>
                <CardDescription>Your recent actions and interactions</CardDescription>
              </div>
              <Calendar className="h-5 w-5 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            {groupedActivities.length > 0 ? (
              <div className="space-y-8">
                {groupedActivities.map((group, groupIndex) => (
                  <div key={groupIndex} className="space-y-4">
                    <div className="sticky top-0 bg-background z-10 py-1">
                      <h3 className="text-sm font-medium text-muted-foreground">
                        {new Date(group.date).toLocaleDateString([], {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </h3>
                      <Separator className="mt-1" />
                    </div>
                    
                    <div className="space-y-4">
                      {group.activities.map((activity) => (
                        <div key={activity.id} className="flex gap-4">
                          <div className="mt-1 flex-shrink-0">
                            <div className={`p-2 rounded-full 
                              ${activity.type === 'analysis' ? 'bg-primary/10 text-primary' : 
                                activity.type === 'profile' ? 'bg-orange-500/10 text-orange-500' : 
                                'bg-blue-500/10 text-blue-500'}`}>
                              {activity.icon}
                            </div>
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="text-base font-medium">{activity.title}</h4>
                                <p className="text-sm text-muted-foreground">{activity.description}</p>
                              </div>
                              <Badge variant="outline" className="text-xs">
                                {new Date(activity.date).toLocaleTimeString([], { 
                                  hour: '2-digit', 
                                  minute: '2-digit'
                                })}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Clock className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No activities found</h3>
                <p className="text-sm text-muted-foreground">
                  {searchTerm || filterType !== 'all' || filterPeriod !== 'all' ? 
                    "No activities match your search criteria" : 
                    "You don't have any recorded activities yet"}
                </p>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" onClick={() => navigate('/dashboard')}>
              Back to Dashboard
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default ActivityPage;
