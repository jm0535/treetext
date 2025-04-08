import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const DirectLinkPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-3xl font-bold mb-6">treeText Navigation Helper</h1>
      <div className="grid gap-4 max-w-md w-full">
        <Button asChild size="lg" className="w-full">
          <Link to="/user-guide">
            Go to User Guide
          </Link>
        </Button>
        <Button asChild size="lg" variant="outline" className="w-full">
          <Link to="/help-center">
            Go to Help Center
          </Link>
        </Button>
        <Button asChild size="lg" variant="secondary" className="w-full">
          <Link to="/">
            Return to Home
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default DirectLinkPage;
