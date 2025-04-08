import React from 'react';
import SignInForm from '@/components/auth/SignInForm';
import { Card, CardContent } from '@/components/ui/card';

const SignInPage: React.FC = () => {
  return (
    <div className="bg-background relative">
      <div className="bg-gradient-to-b from-primary/5 to-transparent h-64 absolute top-0 left-0 right-0 z-0"></div>
      
      <div className="flex items-center justify-center p-4 py-16 relative z-10">
        <Card className="w-full max-w-md shadow-lg border border-border/30">
          <CardContent className="pt-6">
            <SignInForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SignInPage;
