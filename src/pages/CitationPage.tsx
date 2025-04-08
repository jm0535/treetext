
import React, { useState } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Copy } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const CitationPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('apa');
  
  const currentYear = new Date().getFullYear();
  const currentDate = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  
  const citations = {
    apa: `treeText. (${currentYear}). treeText: A free, open-source plagiarism and grammar checker [Computer software]. Retrieved from https://treetext.app`,
    mla: `"treeText: A Free, Open-Source Plagiarism and Grammar Checker." treeText, ${currentYear}, treetext.app. Accessed ${currentDate}.`,
    chicago: `treeText. ${currentYear}. "treeText: A Free, Open-Source Plagiarism and Grammar Checker." Software. treetext.app.`,
    harvard: `treeText (${currentYear}) treeText: A free, open-source plagiarism and grammar checker [Computer software]. Available at: https://treetext.app (Accessed: ${currentDate}).`,
    bibtex: `@software{treeText${currentYear},
  title = {treeText: A Free, Open-Source Plagiarism and Grammar Checker},
  author = {{treeText Team}},
  year = {${currentYear}},
  url = {https://treetext.app},
  note = {Accessed: ${currentDate}}
}`
  };
  
  const handleCopy = (format: string) => {
    navigator.clipboard.writeText(citations[format as keyof typeof citations]);
    toast({
      title: "Citation Copied",
      description: `The ${format.toUpperCase()} citation has been copied to your clipboard.`,
    });
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-grow kopitree-container py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6 kopitree-text-gradient">How to Cite treeText</h1>
          
          <p className="mb-8 text-lg text-muted-foreground">
            If you've used treeText in your research or academic work, please consider citing it. 
            Below are citation formats for different styles. Choose the one that suits your needs.
          </p>
          
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Citation Formats</CardTitle>
              <CardDescription>
                Select a citation format to see how to cite treeText in your work.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="apa" value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="mb-6">
                  <TabsTrigger value="apa">APA</TabsTrigger>
                  <TabsTrigger value="mla">MLA</TabsTrigger>
                  <TabsTrigger value="chicago">Chicago</TabsTrigger>
                  <TabsTrigger value="harvard">Harvard</TabsTrigger>
                  <TabsTrigger value="bibtex">BibTeX</TabsTrigger>
                </TabsList>
                
                {Object.entries(citations).map(([format, citation]) => (
                  <TabsContent key={format} value={format} className="relative">
                    <div className="bg-muted p-4 rounded-md font-mono text-sm whitespace-pre-wrap">
                      {citation}
                    </div>
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="absolute top-2 right-2"
                      onClick={() => handleCopy(format)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </TabsContent>
                ))}
              </Tabs>
            </CardContent>
          </Card>
          
          <div className="border-t pt-8">
            <h2 className="text-2xl font-bold mb-4">Why Cite treeText?</h2>
            <p className="mb-4">
              Citing treeText helps support the open-source community and gives recognition to the tools 
              you use in your academic or research work. It also helps others discover these free resources.
            </p>
            <h2 className="text-2xl font-bold mb-4 mt-8">Contributing to treeText</h2>
            <p className="mb-4">
              treeText is 100% free and open-source. If you'd like to contribute to its development, 
              please visit our GitHub repository or consider supporting the project through donations.
            </p>
            <div className="flex flex-wrap gap-4 mt-6">
              <Button asChild className="bg-kopitree-blue hover:bg-kopitree-blue/90 dark:bg-kopitree-teal dark:hover:bg-kopitree-teal/90">
                <a href="https://github.com/jm0535/treetext" target="_blank" rel="noopener noreferrer">
                  GitHub Repository
                </a>
              </Button>
              <Button variant="outline" asChild>
                <a href="https://github.com/sponsors/jm0535" target="_blank" rel="noopener noreferrer">
                  Support the Project
                </a>
              </Button>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default CitationPage;
