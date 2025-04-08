import React from 'react';
import ResetPasswordForm from '@/components/auth/ResetPasswordForm';
import { Card, CardContent } from '@/components/ui/card';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

const ResetPasswordPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <div className="bg-gradient-to-b from-primary/5 to-transparent h-64 absolute top-0 left-0 right-0 z-0"></div>
      <Navigation />
      
      <main className="flex-grow flex items-center justify-center p-4 relative z-10">
        <Card className="w-full max-w-md shadow-lg border border-border/30">
          <CardContent className="pt-6">
            <ResetPasswordForm />
          </CardContent>
        </Card>
      </main>
      
      <Footer />
    </div>
  );
};

export default ResetPasswordPage;
