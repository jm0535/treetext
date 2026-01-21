import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';

import { Home, User, Shield, Hash, CreditCard, CheckCircle2 } from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import { Badge } from '@/components/ui/badge';

const ProfilePage: React.FC = () => {
  const { user, dbUser } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: user?.user_metadata?.full_name || '',
    email: user?.email || '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Placeholder for profile update logic - typically handled via Auth0 Dashboard
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulation
    setTimeout(() => {
        setIsLoading(false);
        toast({
            title: "Managed by Auth0",
            description: "Please update your profile details in the Auth0 Dashboard.",
            variant: "default",
        });
    }, 500);
  };

  return (
    <div className="container max-w-3xl mx-auto px-4 py-8">
      <div className="flex flex-col space-y-8">
        <PageHeader
          title="Profile Settings"
          description="Manage your account information and preferences"
          breadcrumbs={[
            { label: 'Dashboard', path: '/dashboard', icon: <Home className="h-4 w-4 mr-1" /> },
            { label: 'Profile', path: '/profile', icon: <User className="h-4 w-4 mr-1" /> }
          ]}
        />

        <Card>
          <form onSubmit={handleSubmit}>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Update your personal details here</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <Avatar className="h-24 w-24 border-2 border-primary/20">
                  <AvatarFallback className="bg-primary/10 text-primary font-bold text-2xl">
                    {user?.email?.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="font-medium text-lg mb-1">Profile Picture</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    This feature will be available soon. For now, we use your initials.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    name="fullName"
                    placeholder="Your full name"
                    value={formData.fullName}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    disabled
                    className="bg-muted/50"
                  />
                  <p className="text-xs text-muted-foreground">
                    Email address cannot be changed. Contact support if you need to update your email.
                  </p>
                </div>

                <div className="grid gap-2">
                  <Label>Account Tier</Label>
                  <div className="flex items-center gap-2">
                    <Badge variant={dbUser?.role === 'admin' ? 'default' : 'secondary'} className={cn(
                      "capitalize py-1 px-3 border-none",
                      dbUser?.role === 'admin' ? "bg-primary text-primary-foreground" : "bg-green-600 text-white"
                    )}>
                      {dbUser?.role === 'admin' && <Shield className="h-3 w-3 mr-1" />}
                      {dbUser?.role === 'admin' ? 'Enterprise Admin' : 'Professional Pro'}
                    </Badge>
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label>Internal ID</Label>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/30 p-2 rounded">
                    <Hash className="h-3 w-3" />
                    <code className="truncate">{dbUser?.id || 'Pending sync...'}</code>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button
                variant="outline"
                type="button"
                onClick={() => navigate('/dashboard')}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="bg-primary hover:bg-primary/90"
              >
                {isLoading ? "Saving..." : "Save Changes"}
              </Button>
            </CardFooter>
          </form>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-primary" />
              Subscription Plan
            </CardTitle>
            <CardDescription>Your current TreeText service tier</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border border-primary/10">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-lg">
                    {dbUser?.role === 'admin' ? 'Enterprise' : 'Professional'}
                  </span>
                  <Badge className="bg-primary/20 text-primary border-none">ACTIVE</Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {dbUser?.role === 'admin'
                    ? 'Full global system access and management controls.'
                    : 'Unlimited text analysis and file uploads.'}
                </p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold">$0<span className="text-sm font-normal text-muted-foreground">/mo</span></div>
                <p className="text-xs text-muted-foreground">Beta Phase Pricing</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <span>Unlimited Plagiarism Checks</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <span>Advanced Grammar Correction</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <span>Bulk File Processing</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <span>Priority UI Support</span>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">Manage Subscription</Button>
          </CardFooter>
        </Card>

        <Card className="border-destructive/20">
          <CardHeader>
            <CardTitle className="text-destructive">Danger Zone</CardTitle>
            <CardDescription>Irreversible account actions</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Once you delete your account, there is no going back. Please be certain.
            </p>
            <Button
              variant="destructive"
              onClick={() => {
                toast({
                  title: "Feature coming soon",
                  description: "Account deletion will be available in a future update.",
                  variant: "default",
                });
              }}
            >
              Delete Account
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProfilePage;
