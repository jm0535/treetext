import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { BarChart2, Home, Clock, Search, Filter, Eye, Download, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '@/components/PageHeader';

const HistoryPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  
  // Sample history data
  const historyData = [
    { 
      id: 'analysis-001',
      title: 'Sample Text Analysis 1',
      date: '2025-04-08',
      type: 'academic',
      wordCount: 1250,
      score: 85,
      status: 'completed'
    },
    { 
      id: 'analysis-002',
      title: 'Sample Text Analysis 2',
      date: '2025-04-05',
      type: 'business',
      wordCount: 750,
      score: 78,
      status: 'completed'
    },
    { 
      id: 'analysis-003',
      title: 'Sample Text Analysis 3',
      date: '2025-04-01',
      type: 'academic',
      wordCount: 1800,
      score: 92,
      status: 'completed'
    },
    { 
      id: 'analysis-004',
      title: 'Draft Business Proposal',
      date: '2025-03-28',
      type: 'business',
      wordCount: 920,
      score: 81,
      status: 'completed'
    },
    { 
      id: 'analysis-005',
      title: 'Research Paper Introduction',
      date: '2025-03-20',
      type: 'academic',
      wordCount: 1100,
      score: 88,
      status: 'completed'
    }
  ];

  // Filter and search functionality
  const filteredHistory = historyData
    .filter(item => filterType === 'all' || item.type === filterType)
    .filter(item => 
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.type.toLowerCase().includes(searchTerm.toLowerCase())
    );

  return (
    <div className="container max-w-6xl mx-auto px-4 py-8">
      <div className="flex flex-col space-y-8">
        <PageHeader
          title="Analysis History"
          description="View and manage your previous text analyses"
          breadcrumbs={[
            { label: 'Dashboard', path: '/dashboard', icon: <Home className="h-4 w-4 mr-1" /> },
            { label: 'History', path: '/history', icon: <Clock className="h-4 w-4 mr-1" /> }
          ]}
        />

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search analyses..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="academic">Academic</SelectItem>
                <SelectItem value="business">Business</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* History Table */}
        <Card>
          <CardHeader>
            <CardTitle>Analysis History</CardTitle>
            <CardDescription>Your recent text analyses and their results</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="text-right">Words</TableHead>
                  <TableHead className="text-right">Score</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredHistory.length > 0 ? (
                  filteredHistory.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.title}</TableCell>
                      <TableCell>{item.date}</TableCell>
                      <TableCell>
                        <Badge variant={item.type === 'academic' ? 'default' : 'secondary'}>
                          {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">{item.wordCount}</TableCell>
                      <TableCell className="text-right font-medium">{item.score}/100</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" title="View">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" title="Download">
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" title="Delete">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                      No analysis history found matching your criteria
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => navigate('/dashboard')}>
              Back to Dashboard
            </Button>
            <Button variant="outline" onClick={() => navigate('/analytics')}>
              View Analytics
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default HistoryPage;
