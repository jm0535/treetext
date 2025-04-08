import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, ArrowLeft } from 'lucide-react';

const SponsorMaintenancePage: React.FC = () => {
  return (
    <div className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <Badge variant="outline" className="mb-4 px-3 py-1 bg-primary/5 text-primary border-primary/20">
          <Clock className="h-3.5 w-3.5 mr-1.5" />
          Coming Soon
        </Badge>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 text-foreground tracking-tight">
          Sponsorship Temporarily Unavailable
        </h1>
        <p className="text-lg md:text-xl text-foreground/80 mb-8 leading-relaxed max-w-3xl mx-auto">
          We're currently setting up our payment processing system. Sponsorship options will be available soon.
        </p>
      </div>

      <Card className="max-w-2xl mx-auto border-primary/20 shadow-lg">
        <CardHeader>
          <CardTitle>Sponsorship Under Maintenance</CardTitle>
          <CardDescription>
            We're working on making sponsorships available
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-muted/30 p-6 rounded-lg border border-border">
            <h3 className="text-lg font-semibold mb-4">Why is this feature unavailable?</h3>
            <p className="mb-4">
              We're currently setting up our banking integration with our payment processor. This ensures that all transactions will be secure and properly processed.
            </p>
            <p className="text-sm text-muted-foreground">
              We expect this feature to be available within the next few weeks. Thank you for your patience!
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild variant="outline" className="flex items-center gap-2">
              <Link to="/">
                <ArrowLeft className="h-4 w-4" />
                Return to Home
              </Link>
            </Button>
            <Button asChild className="bg-primary hover:bg-primary/90">
              <Link to="/contribute">
                Other Ways to Contribute
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SponsorMaintenancePage;
