
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Users,
  FileText,
  BarChart,
  Shield,
  Settings,
  Activity,
  ArrowUpRight,
  UserCheck,
  UserPlus
} from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import PageHeader from '@/components/PageHeader';

const AdminDashboard: React.FC = () => {
  const { dbUser } = useAuth();
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeToday: 0,
    totalAnalyses: 0,
    newUsers: 0
  });

  // Mock data for demo
  useEffect(() => {
    setStats({
      totalUsers: 142,
      activeToday: 28,
      totalAnalyses: 1240,
      newUsers: 12
    });
  }, []);

  const recentUsers = [
    { id: '1', name: 'John Doe', email: 'john@example.com', role: 'user', joined: '2024-01-20' },
    { id: '2', name: 'Jane Smith', email: 'jane@example.com', role: 'user', joined: '2024-01-19' },
    { id: '3', name: 'Admin Moses', email: 'j.moses0131@gmail.com', role: 'admin', joined: '2024-01-15' },
    { id: '4', name: 'Bob Wilson', email: 'bob@example.com', role: 'user', joined: '2024-01-18' },
    { id: '5', name: 'Alice Brown', email: 'alice@example.com', role: 'user', joined: '2024-01-17' },
  ];

  return (
    <div className="container max-w-7xl mx-auto px-4 py-8 space-y-8">
      <PageHeader
        title={
          <div className="flex items-center gap-3">
            <Shield className="h-8 w-8 text-primary" />
            Admin Control Center
          </div>
        }
        description="Global system overview and management"
      />

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
              <span className="text-green-500 font-medium flex items-center">
                <ArrowUpRight className="h-3 w-3" /> +{stats.newUsers}%
              </span> from last month
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Today</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeToday}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Users currently exploring the app
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Analyses</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalAnalyses}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Accumulated since launch
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Health</CardTitle>
            <Shield className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">100%</div>
            <p className="text-xs text-muted-foreground mt-1">
              All backend services operational
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Recent Users Table */}
        <Card className="lg:col-span-4">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Users</CardTitle>
              <CardDescription>Newest members of the TreeText community</CardDescription>
            </div>
            <Button variant="outline" size="sm">View All</Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead className="text-right">Joined</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium">{user.name}</span>
                        <span className="text-xs text-muted-foreground">{user.email}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={user.role === 'admin' ? 'default' : 'secondary'} className="capitalize">
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right text-muted-foreground text-sm">
                      {user.joined}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common administrative tasks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button className="w-full justify-start gap-3" variant="outline">
              <UserPlus className="h-4 w-4" /> Add New User
            </Button>
            <Button className="w-full justify-start gap-3" variant="outline">
              <Shield className="h-4 w-4" /> Manage Permissions
            </Button>
            <Button className="w-full justify-start gap-3" variant="outline">
              <Settings className="h-4 w-4" /> Global Settings
            </Button>
            <Button className="w-full justify-start gap-3" variant="outline">
              <BarChart className="h-4 w-4" /> Export System Report
            </Button>
            <div className="pt-6 border-t">
              <div className="flex items-center gap-2 px-2 py-1 text-xs text-muted-foreground">
                <Activity className="h-3 w-3" /> Recent Activity
              </div>
              <div className="space-y-3 mt-4">
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-2 h-2 rounded-full bg-blue-500" />
                  <span className="flex-1">System update successful</span>
                  <span className="text-xs text-muted-foreground">2m ago</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <span className="flex-1">New user registered</span>
                  <span className="text-xs text-muted-foreground">15m ago</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-2 h-2 rounded-full bg-yellow-500" />
                  <span className="flex-1">Backup completed</span>
                  <span className="text-xs text-muted-foreground">1h ago</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
