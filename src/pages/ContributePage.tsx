
import React from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Github, Code, MessageSquare, BookOpen, Globe, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const ContributePage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-grow treeText-container py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Contribute to treeText</h1>
          
          <p className="text-xl text-muted-foreground mb-8">
            treeText is an open-source project that thrives on contributions from the community. 
            There are many ways to contribute, whether you're a developer, writer, translator, or user.
          </p>
          
          <Tabs defaultValue="code">
            <TabsList className="mb-8">
              <TabsTrigger value="code" className="gap-2">
                <Code className="h-4 w-4" />
                Code
              </TabsTrigger>
              <TabsTrigger value="documentation" className="gap-2">
                <BookOpen className="h-4 w-4" />
                Documentation
              </TabsTrigger>
              <TabsTrigger value="translation" className="gap-2">
                <Globe className="h-4 w-4" />
                Translation
              </TabsTrigger>
              <TabsTrigger value="community" className="gap-2">
                <MessageSquare className="h-4 w-4" />
                Community
              </TabsTrigger>
              <TabsTrigger value="donate" className="gap-2">
                <Heart className="h-4 w-4" />
                Donate
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="code">
              <div className="space-y-6">
                <section>
                  <h2 className="text-2xl font-semibold mb-4">Contributing Code</h2>
                  <p className="text-muted-foreground mb-4">
                    We welcome code contributions of all sizes, from simple bug fixes to major feature implementations.
                    Here's how to get started:
                  </p>
                  
                  <ol className="list-decimal list-inside space-y-4 text-muted-foreground ml-4 mb-6">
                    <li>
                      <span className="font-medium">Fork the repository</span>
                      <p className="ml-6 mt-1">
                        Start by forking the treeText repository on GitHub to your own account.
                      </p>
                    </li>
                    <li>
                      <span className="font-medium">Set up your development environment</span>
                      <p className="ml-6 mt-1">
                        Clone your fork to your local machine and follow the setup instructions in the README.
                      </p>
                    </li>
                    <li>
                      <span className="font-medium">Find an issue to work on</span>
                      <p className="ml-6 mt-1">
                        Browse our list of open issues on GitHub. Issues labeled "good first issue" are perfect for newcomers.
                      </p>
                    </li>
                    <li>
                      <span className="font-medium">Make your changes</span>
                      <p className="ml-6 mt-1">
                        Implement your feature or fix the bug, making sure to adhere to our coding standards.
                      </p>
                    </li>
                    <li>
                      <span className="font-medium">Submit a pull request</span>
                      <p className="ml-6 mt-1">
                        Push your changes to your fork and submit a pull request to the main repository.
                      </p>
                    </li>
                  </ol>
                  
                  <div className="flex gap-4">
                    <Button className="gap-2">
                      <Github className="h-5 w-5" />
                      View GitHub Repository
                    </Button>
                    <Button variant="outline">View Open Issues</Button>
                  </div>
                </section>
                
                <section>
                  <h2 className="text-2xl font-semibold mb-4">Coding Standards</h2>
                  <p className="text-muted-foreground mb-4">
                    To maintain code quality and consistency, please follow these guidelines:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                    <li>Use TypeScript for type safety</li>
                    <li>Follow our ESLint configuration</li>
                    <li>Write tests for new features and bug fixes</li>
                    <li>Keep components small and focused</li>
                    <li>Use clear, descriptive variable and function names</li>
                    <li>Comment complex code sections</li>
                  </ul>
                </section>
              </div>
            </TabsContent>
            
            <TabsContent value="documentation">
              <div className="space-y-6">
                <section>
                  <h2 className="text-2xl font-semibold mb-4">Improving Documentation</h2>
                  <p className="text-muted-foreground mb-4">
                    Good documentation is crucial for any project. Help us improve our documentation to make
                    treeText more accessible to users and developers alike.
                  </p>
                  
                  <h3 className="text-xl font-medium mb-3">Ways to Contribute to Documentation</h3>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4 mb-6">
                    <li>Fix typos and grammar errors</li>
                    <li>Clarify existing documentation</li>
                    <li>Add examples and use cases</li>
                    <li>Create new guides or tutorials</li>
                    <li>Improve API documentation</li>
                    <li>Create diagrams or other visual aids</li>
                  </ul>
                  
                  <p className="text-muted-foreground mb-4">
                    Our documentation is stored in the GitHub repository alongside the code. You can contribute
                    to documentation using the same workflow as code contributions.
                  </p>
                  
                  <Button variant="outline">View Documentation Repository</Button>
                </section>
              </div>
            </TabsContent>
            
            <TabsContent value="translation">
              <div className="space-y-6">
                <section>
                  <h2 className="text-2xl font-semibold mb-4">Translation Contributions</h2>
                  <p className="text-muted-foreground mb-4">
                    Help make treeText accessible to users around the world by contributing translations.
                  </p>
                  
                  <h3 className="text-xl font-medium mb-3">Currently Supported Languages</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
                    <div className="border p-3 rounded">English (US)</div>
                    <div className="border p-3 rounded">Spanish</div>
                    <div className="border p-3 rounded">French</div>
                    <div className="border p-3 rounded">German</div>
                    <div className="border p-3 rounded">Chinese (Simplified)</div>
                    <div className="border p-3 rounded">Japanese</div>
                  </div>
                  
                  <h3 className="text-xl font-medium mb-3">How to Contribute Translations</h3>
                  <p className="text-muted-foreground mb-4">
                    We use a localization platform that makes it easy to contribute translations without needing
                    to understand the codebase. You can help translate the interface, error messages, and documentation.
                  </p>
                  
                  <ol className="list-decimal list-inside space-y-2 text-muted-foreground ml-4 mb-6">
                    <li>Sign up for our localization platform</li>
                    <li>Choose a language to work on</li>
                    <li>Start translating strings</li>
                    <li>Submit your translations for review</li>
                  </ol>
                  
                  <Button variant="outline">Join Translation Team</Button>
                </section>
              </div>
            </TabsContent>
            
            <TabsContent value="community">
              <div className="space-y-6">
                <section>
                  <h2 className="text-2xl font-semibold mb-4">Community Contributions</h2>
                  <p className="text-muted-foreground mb-4">
                    A strong community is essential for any open-source project. Here's how you can help grow
                    and support the treeText community:
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="border p-6 rounded">
                      <h3 className="text-xl font-medium mb-3">Answer Questions</h3>
                      <p className="text-muted-foreground mb-4">
                        Help other users by answering questions on our community forums, GitHub discussions, or
                        Stack Overflow.
                      </p>
                      <Button variant="outline" size="sm">Visit Forum</Button>
                    </div>
                    
                    <div className="border p-6 rounded">
                      <h3 className="text-xl font-medium mb-3">Report Bugs</h3>
                      <p className="text-muted-foreground mb-4">
                        If you encounter issues while using treeText, submitting detailed bug reports helps us
                        improve the platform.
                      </p>
                      <Button variant="outline" size="sm">Report a Bug</Button>
                    </div>
                    
                    <div className="border p-6 rounded">
                      <h3 className="text-xl font-medium mb-3">Share Knowledge</h3>
                      <p className="text-muted-foreground mb-4">
                        Write tutorials, create videos, or share tips about using treeText effectively.
                      </p>
                      <Button variant="outline" size="sm">Submit a Tutorial</Button>
                    </div>
                    
                    <div className="border p-6 rounded">
                      <h3 className="text-xl font-medium mb-3">Spread the Word</h3>
                      <p className="text-muted-foreground mb-4">
                        Share treeText with friends, colleagues, and on social media to help more people discover our tools.
                      </p>
                      <Button variant="outline" size="sm">Share treeText</Button>
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-medium mb-3">Join Our Communication Channels</h3>
                  <div className="flex flex-wrap gap-4">
                    <Button variant="outline" size="sm">Discord Server</Button>
                    <Button variant="outline" size="sm">Twitter</Button>
                    <Button variant="outline" size="sm" asChild>
                      <a href="https://github.com/jm0535/treetext/discussions" target="_blank" rel="noopener noreferrer">
                        GitHub Discussions
                      </a>
                    </Button>
                    <Button variant="outline" size="sm">Mailing List</Button>
                  </div>
                </section>
              </div>
            </TabsContent>
            
            <TabsContent value="donate">
              <div className="space-y-6">
                <section>
                  <h2 className="text-2xl font-semibold mb-4">Support treeText</h2>
                  <p className="text-muted-foreground mb-4">
                    While treeText is free and open-source, running the service does incur costs. Your donations help us
                    cover server expenses, development tools, and other operational costs.
                  </p>
                  
                  <div className="border p-6 rounded mb-8">
                    <h3 className="text-xl font-medium mb-4">Why Donate?</h3>
                    <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4 mb-6">
                      <li>Keep treeText free for everyone</li>
                      <li>Support ongoing development of new features</li>
                      <li>Help improve server performance and reliability</li>
                      <li>Enable us to add more powerful analysis capabilities</li>
                    </ul>
                    
                    <div className="flex flex-wrap gap-4">
                      <Button>Make a One-time Donation</Button>
                      <Button variant="outline">Become a Monthly Supporter</Button>
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-medium mb-4">Other Ways to Support</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="border p-6 rounded">
                      <h4 className="text-lg font-medium mb-2">Corporate Sponsorship</h4>
                      <p className="text-muted-foreground mb-4">
                        If your organization uses treeText or values our mission, consider becoming a corporate sponsor.
                      </p>
                      <Button variant="outline" size="sm">Learn About Sponsorship</Button>
                    </div>
                    
                    <div className="border p-6 rounded">
                      <h4 className="text-lg font-medium mb-2">GitHub Sponsors</h4>
                      <p className="text-muted-foreground mb-4">
                        Support us through GitHub Sponsors, which matches your contribution for the first year.
                      </p>
                      <Button variant="outline" size="sm" asChild>
                        <a href="https://github.com/sponsors/jm0535" target="_blank" rel="noopener noreferrer">
                          Sponsor on GitHub
                        </a>
                      </Button>
                    </div>
                  </div>
                </section>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ContributePage;
