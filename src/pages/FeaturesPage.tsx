
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Lock, BookOpen, Zap, Github, FileText, BarChart2, RefreshCcw } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

const FeatureCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
}> = ({ icon, title, description }) => (
  <Card className="hover:shadow-md transition-all">
    <CardHeader className="pb-2">
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <CardTitle className="text-xl">{title}</CardTitle>
      </div>
      <Separator />
    </CardHeader>
    <CardContent>
      <CardDescription className="text-base">{description}</CardDescription>
    </CardContent>
  </Card>
);

const FeaturesPage: React.FC = () => {
  return (
    <div className="py-12">
        <div className="kopitree-container">
          <h1 className="text-4xl font-bold mb-2 kopitree-text-gradient text-center">treeText Features</h1>
          <p className="text-center text-lg text-muted-foreground mb-12">
            A comprehensive suite of free academic tools to help you write better
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            <FeatureCard
              icon={<FileText className="h-6 w-6 text-kopitree-blue" />}
              title="Plagiarism Checking"
              description="Compare your work against a vast database of academic papers, websites, and previously submitted assignments to ensure originality."
            />
            
            <FeatureCard
              icon={<Zap className="h-6 w-6 text-kopitree-blue" />}
              title="Grammar Correction"
              description="Identify and fix grammatical errors, spelling mistakes, and punctuation issues to improve the clarity of your writing."
            />
            
            <FeatureCard
              icon={<BarChart2 className="h-6 w-6 text-kopitree-blue" />}
              title="Readability Analysis"
              description="Get metrics on your text's readability score, sentence structure, and vocabulary usage to ensure your writing is accessible."
            />
            
            <FeatureCard
              icon={<CheckCircle className="h-6 w-6 text-kopitree-blue" />}
              title="Citation Checking"
              description="Verify that your citations are properly formatted and consistent throughout your document."
            />
            
            <FeatureCard
              icon={<BookOpen className="h-6 w-6 text-kopitree-blue" />}
              title="Educational Resources"
              description="Access writing guides, style manuals, and academic resources to improve your academic writing skills."
            />
            
            <FeatureCard
              icon={<RefreshCcw className="h-6 w-6 text-kopitree-blue" />}
              title="Unlimited Revisions"
              description="Check and revise your papers as many times as you need, with no usage limits or restrictions."
            />
          </div>
          
          <div className="bg-muted p-8 rounded-lg mb-16">
            <h2 className="text-2xl font-bold mb-4 text-center">What Makes treeText Different?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex flex-col items-center text-center">
                <Lock className="h-12 w-12 text-kopitree-teal mb-4" />
                <h3 className="text-xl font-bold mb-2">100% Free & Private</h3>
                <p className="text-muted-foreground">
                  We don't sell your data, show ads, or restrict features behind paywalls. 
                  Your work remains completely private and secure.
                </p>
              </div>
              
              <div className="flex flex-col items-center text-center">
                <Github className="h-12 w-12 text-kopitree-teal mb-4" />
                <h3 className="text-xl font-bold mb-2">Open Source</h3>
                <p className="text-muted-foreground">
                  Our codebase is public, transparent, and community-driven. 
                  Anyone can contribute improvements or verify how we process your data.
                </p>
              </div>
            </div>
          </div>
          
          <div className="mb-16">
            <h2 className="text-2xl font-bold mb-8 text-center">Built for Students & Researchers</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-background border rounded-lg p-6">
                <h3 className="font-bold mb-3">Students</h3>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                    <span>Check essays and assignments for originality</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                    <span>Improve grammar and writing style</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                    <span>Learn from detailed feedback</span>
                  </li>
                </ul>
              </div>
              
              <div className="bg-background border rounded-lg p-6">
                <h3 className="font-bold mb-3">Academics</h3>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                    <span>Verify student work for originality</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                    <span>Provide detailed writing feedback</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                    <span>Integrate with learning management systems</span>
                  </li>
                </ul>
              </div>
              
              <div className="bg-background border rounded-lg p-6">
                <h3 className="font-bold mb-3">Researchers</h3>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                    <span>Ensure research paper originality</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                    <span>Polish manuscripts before submission</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                    <span>Check for consistent academic style</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
    </div>
  );
};

export default FeaturesPage;
