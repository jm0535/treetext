import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Type, Upload, FileText, Check, AlertTriangle, BookOpen, 
  Quote, Bookmark, ArrowRight, Search, Settings, Info
} from 'lucide-react';

const UserGuidePage: React.FC = () => {
  return (
    <div className="treeText-container py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">treeText User Guide</h1>
        <p className="text-muted-foreground mb-8">
          A comprehensive guide to using treeText's plagiarism and grammar checking tools
        </p>
        
        <div className="bg-muted/30 border rounded-lg p-6 mb-10">
          <div className="flex items-start gap-4">
            <Info className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
            <div>
              <h2 className="text-lg font-medium mb-2">About This Guide</h2>
              <p className="text-muted-foreground mb-2">
                This user guide was last updated on April 9, 2025 and is based on treeText version 1.1.0, initially released on April 3, 2025.
              </p>
              <p className="text-muted-foreground">
                If you need additional help beyond this guide, please visit our <a href="/help" className="text-primary hover:underline">Help Center</a> or <a href="/contact-us" className="text-primary hover:underline">contact our support team</a>.
              </p>
            </div>
          </div>
        </div>
        
        <Tabs defaultValue="getting-started" className="mb-12">
          <TabsList className="grid grid-cols-2 md:grid-cols-5 mb-6">
            <TabsTrigger value="getting-started">Getting Started</TabsTrigger>
            <TabsTrigger value="text-analysis">Text Analysis</TabsTrigger>
            <TabsTrigger value="features">Features</TabsTrigger>
            <TabsTrigger value="ai-features">AI Features</TabsTrigger>
            <TabsTrigger value="faq">FAQ</TabsTrigger>
          </TabsList>
          
          <TabsContent value="getting-started">
            <div className="space-y-8">
              <section>
                <h2 className="text-2xl font-semibold mb-4">Welcome to treeText</h2>
                <p className="text-muted-foreground mb-4">
                  treeText is a free, open-source plagiarism and grammar checker designed to help students, researchers, and writers improve their writing. This guide will help you get started with treeText and make the most of its features.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="bg-primary/10 p-2 rounded-full">
                          <Type className="h-5 w-5 text-primary" />
                        </div>
                        <h3 className="font-medium">Text Input</h3>
                      </div>
                      <p className="text-muted-foreground text-sm">
                        Enter or paste your text directly into the editor for instant analysis.
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="bg-primary/10 p-2 rounded-full">
                          <Upload className="h-5 w-5 text-primary" />
                        </div>
                        <h3 className="font-medium">File Upload</h3>
                      </div>
                      <p className="text-muted-foreground text-sm">
                        Upload documents in various formats (DOCX, PDF, TXT) for analysis.
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </section>
              
              <section>
                <h2 className="text-2xl font-semibold mb-4">Quick Start Guide</h2>
                <ol className="space-y-6 mt-4">
                  <li className="flex gap-4">
                    <div className="flex-shrink-0 bg-primary/10 rounded-full h-8 w-8 flex items-center justify-center text-primary font-medium">1</div>
                    <div>
                      <h3 className="font-medium mb-1">Visit the Homepage</h3>
                      <p className="text-muted-foreground">
                        Navigate to the treeText homepage at <span className="text-foreground font-mono text-sm">https://treetext.in4metrix.dev</span>
                      </p>
                    </div>
                  </li>
                  
                  <li className="flex gap-4">
                    <div className="flex-shrink-0 bg-primary/10 rounded-full h-8 w-8 flex items-center justify-center text-primary font-medium">2</div>
                    <div>
                      <h3 className="font-medium mb-1">Choose Input Method</h3>
                      <p className="text-muted-foreground">
                        Click "Enter Text" to type or paste your content, or "Upload Document" to analyze a file.
                      </p>
                    </div>
                  </li>
                  
                  <li className="flex gap-4">
                    <div className="flex-shrink-0 bg-primary/10 rounded-full h-8 w-8 flex items-center justify-center text-primary font-medium">3</div>
                    <div>
                      <h3 className="font-medium mb-1">Analyze Your Text</h3>
                      <p className="text-muted-foreground">
                        After entering or uploading your text, the analysis will run automatically. You'll see results for plagiarism, grammar, and readability.
                      </p>
                    </div>
                  </li>
                  
                  <li className="flex gap-4">
                    <div className="flex-shrink-0 bg-primary/10 rounded-full h-8 w-8 flex items-center justify-center text-primary font-medium">4</div>
                    <div>
                      <h3 className="font-medium mb-1">Review Results</h3>
                      <p className="text-muted-foreground">
                        Examine the detailed analysis provided in the results section. Click on highlighted issues to see suggestions and explanations.
                      </p>
                    </div>
                  </li>
                  
                  <li className="flex gap-4">
                    <div className="flex-shrink-0 bg-primary/10 rounded-full h-8 w-8 flex items-center justify-center text-primary font-medium">5</div>
                    <div>
                      <h3 className="font-medium mb-1">Make Corrections</h3>
                      <p className="text-muted-foreground">
                        Apply suggested corrections to improve your text. You can accept suggestions directly or make manual edits.
                      </p>
                    </div>
                  </li>
                </ol>
              </section>
            </div>
          </TabsContent>
          
          <TabsContent value="text-analysis">
            <div className="space-y-8">
              <section>
                <h2 className="text-2xl font-semibold mb-4">Text Analysis Features</h2>
                <p className="text-muted-foreground mb-6">
                  treeText offers comprehensive text analysis tools to help improve your writing. Here's how to use each feature:
                </p>
                
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="plagiarism">
                    <AccordionTrigger className="text-lg font-medium">
                      <div className="flex items-center gap-2">
                        <Search className="h-5 w-5 text-red-500" />
                        Plagiarism Checking
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground space-y-4 px-4">
                      <p>
                        Our plagiarism checker compares your text against a vast database of academic papers, websites, and publications to identify potential matches.
                      </p>
                      <div className="bg-muted p-4 rounded-md">
                        <h4 className="font-medium mb-2">How to use:</h4>
                        <ol className="list-decimal list-inside space-y-2">
                          <li>Enter your text or upload a document</li>
                          <li>The system automatically checks for plagiarism</li>
                          <li>Review highlighted sections that match existing sources</li>
                          <li>Click on highlighted text to see the source and similarity percentage</li>
                          <li>Revise your text or add proper citations as needed</li>
                        </ol>
                      </div>
                      <div className="flex items-start gap-3 bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-md">
                        <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
                        <p className="text-yellow-700 dark:text-yellow-300 text-sm">
                          Remember that not all matches indicate plagiarism. Common phrases, quotations, and properly cited material may be flagged. Always review results carefully.
                        </p>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="grammar">
                    <AccordionTrigger className="text-lg font-medium">
                      <div className="flex items-center gap-2">
                        <Check className="h-5 w-5 text-green-500" />
                        Grammar & Style Checking
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground space-y-4 px-4">
                      <p>
                        Our grammar checker identifies spelling errors, punctuation issues, grammatical mistakes, and style improvements to enhance your writing.
                      </p>
                      <div className="bg-muted p-4 rounded-md">
                        <h4 className="font-medium mb-2">How to use:</h4>
                        <ol className="list-decimal list-inside space-y-2">
                          <li>Enter your text or upload a document</li>
                          <li>Grammar issues are automatically highlighted</li>
                          <li>Different colors indicate different types of issues (spelling, grammar, style)</li>
                          <li>Hover over highlighted text to see suggested corrections</li>
                          <li>Click on a suggestion to apply it to your text</li>
                        </ol>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                        <div className="border rounded-md p-3">
                          <h4 className="font-medium text-sm mb-1">Grammar Issues</h4>
                          <p className="text-sm">Identifies subject-verb agreement, tense consistency, article usage, etc.</p>
                        </div>
                        <div className="border rounded-md p-3">
                          <h4 className="font-medium text-sm mb-1">Style Suggestions</h4>
                          <p className="text-sm">Highlights wordiness, passive voice, redundancies, and unclear phrasing.</p>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="readability">
                    <AccordionTrigger className="text-lg font-medium">
                      <div className="flex items-center gap-2">
                        <BookOpen className="h-5 w-5 text-blue-500" />
                        Readability Analysis
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground space-y-4 px-4">
                      <p>
                        Our readability analyzer evaluates the complexity of your text and provides metrics to help you target your writing to the appropriate audience.
                      </p>
                      <div className="bg-muted p-4 rounded-md">
                        <h4 className="font-medium mb-2">Metrics included:</h4>
                        <ul className="list-disc list-inside space-y-2">
                          <li>Flesch-Kincaid Reading Ease score</li>
                          <li>Grade level estimate</li>
                          <li>Average sentence length</li>
                          <li>Word complexity analysis</li>
                          <li>Paragraph structure evaluation</li>
                        </ul>
                      </div>
                      <p>
                        Use these metrics to adjust your writing for your target audience. Academic papers typically have lower readability scores (more complex), while general content should aim for higher scores (more accessible).
                      </p>
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="citations">
                    <AccordionTrigger className="text-lg font-medium">
                      <div className="flex items-center gap-2">
                        <Quote className="h-5 w-5 text-purple-500" />
                        Citation Generation
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground space-y-4 px-4">
                      <p>
                        Our citation tool helps you properly attribute sources in various academic formats.
                      </p>
                      <div className="bg-muted p-4 rounded-md">
                        <h4 className="font-medium mb-2">Supported citation styles:</h4>
                        <ul className="list-disc list-inside space-y-2">
                          <li>APA (7th edition)</li>
                          <li>MLA (9th edition)</li>
                          <li>Chicago (17th edition)</li>
                          <li>Harvard</li>
                        </ul>
                      </div>
                      <div className="bg-muted p-4 rounded-md mt-4">
                        <h4 className="font-medium mb-2">How to use:</h4>
                        <ol className="list-decimal list-inside space-y-2">
                          <li>Navigate to the Citation Generator page</li>
                          <li>Select your desired citation style</li>
                          <li>Choose the source type (book, journal, website, etc.)</li>
                          <li>Enter the required information for your source</li>
                          <li>Click "Generate Citation" to create properly formatted citations</li>
                          <li>Copy the citation to your clipboard or add it to your bibliography</li>
                        </ol>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </section>
            </div>
          </TabsContent>
          
          <TabsContent value="features">
            <div className="space-y-8">
              <section>
                <h2 className="text-2xl font-semibold mb-4">Additional Features</h2>
                <p className="text-muted-foreground mb-6">
                  Beyond the core text analysis tools, treeText offers several additional features to enhance your writing experience:
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="bg-primary/10 p-2 rounded-full">
                          <Bookmark className="h-5 w-5 text-primary" />
                        </div>
                        <h3 className="font-medium">History Tracking</h3>
                      </div>
                      <p className="text-muted-foreground text-sm mb-3">
                        treeText saves your previous analyses, allowing you to revisit and compare earlier versions of your work.
                      </p>
                      <ul className="text-sm space-y-2">
                        <li className="flex items-start gap-2">
                          <ArrowRight className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                          <span>Access your analysis history from the main dashboard</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <ArrowRight className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                          <span>View timestamps and summaries of previous checks</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <ArrowRight className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                          <span>Compare different versions to track improvements</span>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="bg-primary/10 p-2 rounded-full">
                          <FileText className="h-5 w-5 text-primary" />
                        </div>
                        <h3 className="font-medium">Document Export</h3>
                      </div>
                      <p className="text-muted-foreground text-sm mb-3">
                        Export your analyzed text with corrections and annotations in various formats.
                      </p>
                      <ul className="text-sm space-y-2">
                        <li className="flex items-start gap-2">
                          <ArrowRight className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                          <span>Export as DOCX, PDF, or plain text</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <ArrowRight className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                          <span>Include or exclude annotations and suggestions</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <ArrowRight className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                          <span>Generate summary reports of identified issues</span>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="bg-primary/10 p-2 rounded-full">
                          <Settings className="h-5 w-5 text-primary" />
                        </div>
                        <h3 className="font-medium">Customization Options</h3>
                      </div>
                      <p className="text-muted-foreground text-sm mb-3">
                        Tailor treeText to your specific writing needs and preferences.
                      </p>
                      <ul className="text-sm space-y-2">
                        <li className="flex items-start gap-2">
                          <ArrowRight className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                          <span>Adjust grammar checking strictness</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <ArrowRight className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                          <span>Select your preferred writing style (academic, business, casual)</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <ArrowRight className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                          <span>Choose between American, British, or Australian English</span>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="bg-primary/10 p-2 rounded-full">
                          <BookOpen className="h-5 w-5 text-primary" />
                        </div>
                        <h3 className="font-medium">Learning Resources</h3>
                      </div>
                      <p className="text-muted-foreground text-sm mb-3">
                        Access educational content to improve your writing skills.
                      </p>
                      <ul className="text-sm space-y-2">
                        <li className="flex items-start gap-2">
                          <ArrowRight className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                          <span>Grammar guides and explanations</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <ArrowRight className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                          <span>Citation style tutorials</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <ArrowRight className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                          <span>Academic writing best practices</span>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </section>
            </div>
          </TabsContent>
          
          <TabsContent value="ai-features">
            <div className="space-y-8">
              <section>
                <h2 className="text-2xl font-semibold mb-4">AI-Powered Analysis</h2>
                <p className="text-muted-foreground mb-6">
                  treeText leverages advanced AI models to provide intelligent analysis tailored to your specific content type and writing style.
                </p>
                
                <div className="space-y-6">
                  <div className="border rounded-lg p-5">
                    <h3 className="text-xl font-medium mb-3">Adaptive AI Calibration</h3>
                    <p className="text-muted-foreground mb-4">
                      Our adaptive AI calibration system automatically adjusts analysis parameters based on your document type and feedback.
                    </p>
                    
                    <div className="bg-muted/30 p-4 rounded-md space-y-3">
                      <div className="flex items-start gap-3">
                        <div className="bg-primary/10 p-2 rounded-full mt-1">
                          <Settings className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-medium">Automatic Weight Adjustment</h4>
                          <p className="text-sm text-muted-foreground">The system intelligently adjusts weights for plagiarism detection, grammar checking, and readability analysis based on your document type.</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <div className="bg-primary/10 p-2 rounded-full mt-1">
                          <BookOpen className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-medium">Document Type Recognition</h4>
                          <p className="text-sm text-muted-foreground">The system recognizes different document types (academic, business, creative, technical) and applies appropriate analysis standards.</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <div className="bg-primary/10 p-2 rounded-full mt-1">
                          <Check className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-medium">Feedback Integration</h4>
                          <p className="text-sm text-muted-foreground">Your ratings and feedback are used to continuously improve analysis accuracy for your specific writing style.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border rounded-lg p-5">
                    <h3 className="text-xl font-medium mb-3">Tiered Language Models</h3>
                    <p className="text-muted-foreground mb-4">
                      treeText offers specialized language models for different types of content, providing more accurate and relevant analysis.
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="border rounded-md p-4">
                        <h4 className="font-medium mb-2">Academic Models</h4>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          <li>• Academic General: For essays, term papers, and general academic writing</li>
                          <li>• Scientific: For research papers, lab reports, and scientific articles</li>
                          <li>• Statistical: For data-driven papers and quantitative research</li>
                          <li>• Legal: For legal briefs, case studies, and law-related documents</li>
                        </ul>
                      </div>
                      
                      <div className="border rounded-md p-4">
                        <h4 className="font-medium mb-2">Business Models</h4>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          <li>• Business General: For reports, proposals, and business correspondence</li>
                          <li>• Marketing: For promotional content, sales materials, and advertising</li>
                          <li>• Technical: For specifications, documentation, and technical reports</li>
                        </ul>
                      </div>
                      
                      <div className="border rounded-md p-4">
                        <h4 className="font-medium mb-2">Specialized Models</h4>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          <li>• Journalism: For news articles, blog posts, and journalistic writing</li>
                          <li>• Medical: For clinical reports, health information, and medical content</li>
                          <li>• Documentation: For user guides, manuals, and instructional content</li>
                        </ul>
                      </div>
                      
                      <div className="border rounded-md p-4">
                        <h4 className="font-medium mb-2">General Models</h4>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          <li>• Standard: For general purpose writing and everyday content</li>
                          <li>• Creative: For stories, fiction, and creative writing projects</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border rounded-lg p-5">
                    <h3 className="text-xl font-medium mb-3">AI-Driven Recommendations</h3>
                    <p className="text-muted-foreground mb-4">
                      treeText provides intelligent recommendations to improve your writing based on analysis results.
                    </p>
                    
                    <div className="bg-muted/30 p-4 rounded-md space-y-3">
                      <div className="flex items-start gap-3">
                        <div className="bg-primary/10 p-2 rounded-full mt-1">
                          <AlertTriangle className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-medium">Context-Aware Suggestions</h4>
                          <p className="text-sm text-muted-foreground">Receive suggestions that consider the specific context and purpose of your document.</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <div className="bg-primary/10 p-2 rounded-full mt-1">
                          <Type className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-medium">Style-Specific Feedback</h4>
                          <p className="text-sm text-muted-foreground">Get feedback tailored to your chosen writing style and document type.</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <div className="bg-primary/10 p-2 rounded-full mt-1">
                          <FileText className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-medium">Adaptive Learning</h4>
                          <p className="text-sm text-muted-foreground">The system learns from your preferences and improves recommendations over time.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </TabsContent>
          
          <TabsContent value="faq">
            <div className="space-y-8">
              <section>
                <h2 className="text-2xl font-semibold mb-4">Frequently Asked Questions</h2>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="free">
                    <AccordionTrigger>Is treeText completely free?</AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      Yes, treeText is completely free and open-source. We believe that quality writing tools should be accessible to everyone. The project is supported by community contributions and optional donations.
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="accuracy">
                    <AccordionTrigger>How accurate is the plagiarism checker?</AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      Our plagiarism checker compares your text against a comprehensive database of academic and web content. While we strive for high accuracy, no plagiarism checker is 100% perfect. We recommend using the results as a guide and always conducting a final review yourself, especially for academic submissions.
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="privacy">
                    <AccordionTrigger>Is my text kept private?</AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      Yes, your privacy is important to us. We do not store your submitted text on our servers beyond what's necessary for the analysis process. Your text is processed securely and is not shared with third parties. For more details, please review our Privacy Policy.
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="formats">
                    <AccordionTrigger>What file formats are supported?</AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      treeText currently supports the following file formats:
                      <ul className="list-disc list-inside mt-2 space-y-1">
                        <li>Plain text (.txt)</li>
                        <li>Microsoft Word (.docx, .doc)</li>
                        <li>PDF (.pdf)</li>
                        <li>Rich Text Format (.rtf)</li>
                        <li>OpenDocument Text (.odt)</li>
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="limit">
                    <AccordionTrigger>Is there a word limit?</AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      The free version of treeText allows you to check documents up to 5,000 words at a time. For longer documents, we recommend breaking them into smaller sections for analysis.
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="languages">
                    <AccordionTrigger>What languages are supported?</AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      Currently, treeText primarily supports English (American, British, and Australian variants). We're working on adding support for additional languages in future updates.
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="ai-calibration">
                    <AccordionTrigger>How does the AI calibration work?</AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      The AI calibration feature automatically adjusts analysis settings based on your document type and style preferences. When enabled, treeText will recommend the most appropriate language model for your content and fine-tune analysis weights for plagiarism detection, grammar checking, and readability metrics. You can provide feedback on analysis results to further improve the calibration for your specific needs.
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="language-models">
                    <AccordionTrigger>What are the different language models available?</AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      treeText offers several specialized language models organized in categories:
                      <ul className="list-disc list-inside mt-2 space-y-1">
                        <li><strong>Academic:</strong> General academic, Scientific, Statistical, and Legal</li>
                        <li><strong>Business:</strong> General business, Marketing, and Technical</li>
                        <li><strong>Specialized:</strong> Journalism, Medical, and Documentation</li>
                        <li><strong>General:</strong> Standard and Creative writing</li>
                      </ul>
                      Each model is optimized for specific content types and writing styles, providing more accurate and relevant analysis results.
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="account">
                    <AccordionTrigger>Do I need to create an account?</AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      No, you can use treeText's basic features without creating an account. However, creating a free account allows you to access additional features like saving your analysis history and customizing your preferences.
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="contribute">
                    <AccordionTrigger>How can I contribute to treeText?</AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      As an open-source project, we welcome contributions! You can contribute by:
                      <ul className="list-disc list-inside mt-2 space-y-1">
                        <li>Reporting bugs or suggesting features on our GitHub repository</li>
                        <li>Contributing code if you're a developer</li>
                        <li>Helping with documentation or translations</li>
                        <li>Spreading the word about treeText</li>
                      </ul>
                      Visit our <a href="/contribute" className="text-primary hover:underline">Contribute page</a> to learn more.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </section>
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="bg-muted/30 border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Need More Help?</h2>
          <p className="text-muted-foreground mb-4">
            If you couldn't find what you're looking for in this guide, there are several ways to get additional support:
          </p>
          <ul className="space-y-2 text-muted-foreground">
            <li className="flex items-start gap-2">
              <ArrowRight className="h-4 w-4 text-primary flex-shrink-0 mt-1" />
              <span>Visit our <a href="/help" className="text-primary hover:underline">Help Center</a> for more articles and tutorials</span>
            </li>
            <li className="flex items-start gap-2">
              <ArrowRight className="h-4 w-4 text-primary flex-shrink-0 mt-1" />
              <span>Check out our <a href="/blog" className="text-primary hover:underline">Blog</a> for writing tips and best practices</span>
            </li>
            <li className="flex items-start gap-2">
              <ArrowRight className="h-4 w-4 text-primary flex-shrink-0 mt-1" />
              <span>Contact our support team at <a href="mailto:support@treetext.in4metrix.dev" className="text-primary hover:underline">support@treetext.in4metrix.dev</a></span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default UserGuidePage;
