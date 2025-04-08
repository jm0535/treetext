
import React from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Github, Heart, Coffee, Globe, BookOpen, Code } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-grow py-12">
        <div className="kopitree-container">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold mb-4 kopitree-text-gradient">About treeText</h1>
            <p className="text-xl text-muted-foreground mb-12">
              A free, open-source text analysis tool created for students, by students
            </p>
            
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
              <p className="mb-4">
                treeText was created with a simple but powerful mission: to provide students, academics, and researchers 
                with free access to high-quality plagiarism detection and grammar checking tools — with no strings attached.
              </p>
              <p className="mb-4">
                We believe that academic integrity tools should be accessible to everyone, regardless of budget constraints. 
                The name "treeText" combines the concept of "copy" (text) with "tree" (branching knowledge), 
                reflecting our goal of helping users nurture original content within the broader academic ecosystem.
              </p>
              <p className="mb-4">
                Unlike commercial alternatives that charge substantial fees or limit functionality behind paywalls, 
                treeText is and always will be completely free, with full features available to all users.
              </p>
            </div>
            
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-4">Our Commitment</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <Card>
                  <CardContent className="pt-6 text-center">
                    <div className="mb-4 flex justify-center">
                      <div className="bg-kopitree-blue/10 dark:bg-kopitree-teal/10 p-3 rounded-full">
                        <Globe className="h-6 w-6 text-kopitree-blue dark:text-kopitree-teal" />
                      </div>
                    </div>
                    <h3 className="font-bold mb-2">Free for Everyone</h3>
                    <p className="text-muted-foreground text-sm">
                      No subscription fees, no premium tiers, no user limits, no ads. Ever.
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="pt-6 text-center">
                    <div className="mb-4 flex justify-center">
                      <div className="bg-kopitree-blue/10 dark:bg-kopitree-teal/10 p-3 rounded-full">
                        <Code className="h-6 w-6 text-kopitree-blue dark:text-kopitree-teal" />
                      </div>
                    </div>
                    <h3 className="font-bold mb-2">Open Source</h3>
                    <p className="text-muted-foreground text-sm">
                      Transparent, auditable code that anyone can inspect, improve, or learn from.
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="pt-6 text-center">
                    <div className="mb-4 flex justify-center">
                      <div className="bg-kopitree-blue/10 dark:bg-kopitree-teal/10 p-3 rounded-full">
                        <BookOpen className="h-6 w-6 text-kopitree-blue dark:text-kopitree-teal" />
                      </div>
                    </div>
                    <h3 className="font-bold mb-2">Education Focused</h3>
                    <p className="text-muted-foreground text-sm">
                      Built specifically for students and educators, with their needs at the center.
                    </p>
                  </CardContent>
                </Card>
              </div>
              <p>
                Our commitment goes beyond just creating a tool. We're dedicated to improving academic 
                integrity and writing skills through accessible technology. We will never sell user data, 
                restrict features based on payment, or compromise the privacy of our users.
              </p>
            </div>
            
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-4">The Team Behind treeText</h2>
              <p className="mb-8">
                treeText is developed and maintained by a small team of volunteer developers, educators, 
                and students who believe in democratizing access to educational tools. The project started 
                as a response to the high costs of commercial plagiarism checkers that put them out of reach 
                for many students, particularly those in resource-constrained environments.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-8 justify-center items-center mb-8">
                <img 
                  src="/placeholder.svg" 
                  alt="Team Placeholder" 
                  className="w-64 h-64 rounded-md object-cover"
                />
                <div>
                  <h3 className="text-xl font-bold mb-2">A Community Effort</h3>
                  <p className="mb-4">
                    Today, treeText benefits from contributions from developers, linguists, 
                    and educators around the world who share our vision of free, high-quality 
                    academic integrity tools.
                  </p>
                  <p>
                    We're always looking for new contributors who want to help improve treeText 
                    and make it even more useful for students and educators worldwide.
                  </p>
                </div>
              </div>
            </div>
            
            <Separator className="my-8" />
            
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-6 text-center">Help Support treeText</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="flex flex-col items-center text-center">
                  <div className="mb-4 p-3 bg-muted rounded-full">
                    <Github className="h-6 w-6 text-kopitree-blue dark:text-kopitree-teal" />
                  </div>
                  <h3 className="font-medium mb-2">Contribute Code</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Help us improve treeText by contributing to our GitHub repository
                  </p>
                  <Button variant="outline" size="sm" asChild>
                    <a href="https://github.com/jm0535/treetext" target="_blank" rel="noopener noreferrer">
                      Join on GitHub
                    </a>
                  </Button>
                </div>
                
                <div className="flex flex-col items-center text-center">
                  <div className="mb-4 p-3 bg-muted rounded-full">
                    <Heart className="h-6 w-6 text-red-500" />
                  </div>
                  <h3 className="font-medium mb-2">Spread the Word</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Tell other students and academics about this free alternative
                  </p>
                  <Button variant="outline" size="sm">Share treeText</Button>
                </div>
                
                <div className="flex flex-col items-center text-center">
                  <div className="mb-4 p-3 bg-muted rounded-full">
                    <Coffee className="h-6 w-6 text-amber-600" />
                  </div>
                  <h3 className="font-medium mb-2">Buy Us a Coffee</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Support server costs and development with a small donation
                  </p>
                  <Button variant="outline" size="sm">Donate</Button>
                </div>
              </div>
            </div>
            
            <div className="bg-muted p-6 rounded-lg">
              <h2 className="text-xl font-bold mb-4">Get in Touch</h2>
              <p className="mb-4">
                Have questions, suggestions, or want to report a bug? We'd love to hear from you!
              </p>
              <Button className="bg-kopitree-blue hover:bg-kopitree-blue/90 dark:bg-kopitree-teal dark:hover:bg-kopitree-teal/90">
                Contact Us
              </Button>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default AboutPage;
