
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, Book, FileText, HelpCircle, Video, Lightbulb, MailIcon, HeadphonesIcon, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';

const HelpCenterPage: React.FC = () => {
  return (
    <div className="treeText-container py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">How can we help you?</h1>
          <p className="text-muted-foreground mb-4">Search our knowledge base or browse categories below</p>
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 mb-8 flex items-start gap-4">
            <BookOpen className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
            <div>
              <h2 className="font-medium text-lg mb-1">New User Guide Available!</h2>
              <p className="text-muted-foreground mb-2">
                We've created a comprehensive user guide to help you get the most out of treeText. It includes detailed instructions, tips, and best practices.
              </p>
              <Button asChild variant="outline" className="bg-primary/10 hover:bg-primary/20 border-primary/20">
                <Link to="/user-guide">
                  View User Guide
                </Link>
              </Button>
            </div>
          </div>
          
          <div className="relative mb-12">
            <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
            <Input
              className="pl-10 py-6"
              placeholder="Search for help articles..."
            />
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            <Card className="hover:shadow-md transition-all">
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <Book className="h-5 w-5 text-kopitree-blue" />
                  <CardTitle className="text-lg">Getting Started</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Quick start guide</li>
                  <li>• Basic features overview</li>
                  <li>• Account setup</li>
                </ul>
              </CardContent>
            </Card>
            <Card className="hover:shadow-md transition-all">
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="h-5 w-5 text-kopitree-blue" />
                  <CardTitle className="text-lg">Text Analysis</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Plagiarism checking</li>
                  <li>• Grammar correction</li>
                  <li>• Citation generation</li>
                </ul>
              </CardContent>
            </Card>
            <Card className="hover:shadow-md transition-all">
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <Video className="h-5 w-5 text-kopitree-blue" />
                  <CardTitle className="text-lg">Tutorials</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Video guides</li>
                  <li>• Step-by-step tutorials</li>
                  <li>• Best practices</li>
                </ul>
              </CardContent>
            </Card>
          </div>
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-6">Popular Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Lightbulb className="h-5 w-5 text-kopitree-blue" />
                    <CardTitle className="text-lg">Getting Started</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-medium mb-2">How to Check for Plagiarism</h3>
                    <p className="text-muted-foreground text-sm">Learn how to use our plagiarism checker effectively</p>
                  </div>
                  <div>
                    <h3 className="font-medium mb-2">Understanding Your Results</h3>
                    <p className="text-muted-foreground text-sm">A guide to interpreting plagiarism and grammar reports</p>
                  </div>
                  <div>
                    <h3 className="font-medium mb-2">Citation Basics</h3>
                    <p className="text-muted-foreground text-sm">Learn how to properly cite sources in different formats</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <HelpCircle className="h-5 w-5 text-kopitree-blue" />
                    <CardTitle className="text-lg">Common Questions</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-medium mb-2">Is treeText Free?</h3>
                    <p className="text-muted-foreground text-sm">Yes! treeText is completely free and open-source.</p>
                  </div>
                  <div>
                    <h3 className="font-medium mb-2">How Accurate is the Grammar Checker?</h3>
                    <p className="text-muted-foreground text-sm">Our AI-powered grammar checker has high accuracy but we recommend final human review.</p>
                  </div>
                  <div>
                    <h3 className="font-medium mb-2">Can I Use treeText Offline?</h3>
                    <p className="text-muted-foreground text-sm">Internet connection is required for full functionality.</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>
          
          <section className="bg-muted p-8 rounded-lg mb-12">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="flex-1">
                <h2 className="text-2xl font-semibold mb-2">Need More Help?</h2>
                <p className="text-muted-foreground mb-4">
                  Our support team is available 24/7 to assist you with any questions or issues.
                </p>
                <Button variant="outline" className="w-fit" asChild>
                  <a href="/contact-us">
                    <MailIcon className="h-4 w-4 mr-2" />
                    Submit Support Ticket
                  </a>
                </Button>
              </div>
              <div className="flex-shrink-0 bg-muted-foreground/5 rounded-lg p-8">
                <HeadphonesIcon className="w-32 h-32 text-kopitree-blue" />
              </div>
            </div>
          </section>
        </div>
    </div>
  );
};

export default HelpCenterPage;
