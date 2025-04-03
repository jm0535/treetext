import React from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Github, Code, Users, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

const OpenSourcePage: React.FC = () => {
  // Array of contributors - we can add more as needed
  const contributors = [
    { id: "jm0535", name: "jm0535", github: "https://github.com/jm0535" },
    // Other contributors can be added here
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-grow treeText-container py-12">
        <div className="max-w-4xl mx-auto">
          <div className="mb-12 text-center">
            <h1 className="text-3xl font-bold mb-6">treeText: Open Source</h1>
            <p className="text-xl text-muted-foreground mb-6">
              treeText is proudly open source. We believe in transparency, collaboration, and community-driven development.
            </p>
            <div className="flex justify-center gap-4">
              <Button className="gap-2">
                <Github className="h-5 w-5" />
                Star on GitHub
              </Button>
              <Button variant="outline" className="gap-2">
                <Code className="h-5 w-5" />
                View Source Code
              </Button>
            </div>
          </div>
          
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-6">Why Open Source Matters</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="border p-6 rounded">
                <h3 className="text-xl font-medium mb-3">Transparency</h3>
                <p className="text-muted-foreground">
                  Our open-source approach means anyone can inspect our code to see exactly how our plagiarism detection
                  and grammar checking algorithms work. No black boxes or hidden processes.
                </p>
              </div>
              
              <div className="border p-6 rounded">
                <h3 className="text-xl font-medium mb-3">Community Improvement</h3>
                <p className="text-muted-foreground">
                  By making treeText open source, we enable developers, educators, and linguists around the world to
                  contribute improvements and keep our tools cutting-edge.
                </p>
              </div>
              
              <div className="border p-6 rounded">
                <h3 className="text-xl font-medium mb-3">Accessibility</h3>
                <p className="text-muted-foreground">
                  Our open-source license ensures that treeText will always remain free and accessible to everyone,
                  regardless of financial means.
                </p>
              </div>
              
              <div className="border p-6 rounded">
                <h3 className="text-xl font-medium mb-3">Educational Value</h3>
                <p className="text-muted-foreground">
                  Students and developers can learn from our codebase, using it as a resource for understanding
                  natural language processing, plagiarism detection, and web application development.
                </p>
              </div>
            </div>
          </section>
          
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-6">Our Technology Stack</h2>
            
            <p className="text-muted-foreground mb-6">
              treeText is built using modern, reliable technologies that enable us to provide a fast, accessible experience:
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
              <div className="border p-4 rounded text-center">
                <h3 className="font-medium">React</h3>
                <p className="text-sm text-muted-foreground">Frontend Framework</p>
              </div>
              <div className="border p-4 rounded text-center">
                <h3 className="font-medium">TypeScript</h3>
                <p className="text-sm text-muted-foreground">Type Safety</p>
              </div>
              <div className="border p-4 rounded text-center">
                <h3 className="font-medium">Tailwind CSS</h3>
                <p className="text-sm text-muted-foreground">Styling</p>
              </div>
              <div className="border p-4 rounded text-center">
                <h3 className="font-medium">Node.js</h3>
                <p className="text-sm text-muted-foreground">Backend Runtime</p>
              </div>
              <div className="border p-4 rounded text-center">
                <h3 className="font-medium">NLP Libraries</h3>
                <p className="text-sm text-muted-foreground">Text Analysis</p>
              </div>
              <div className="border p-4 rounded text-center">
                <h3 className="font-medium">SQLite</h3>
                <p className="text-sm text-muted-foreground">Database</p>
              </div>
            </div>
            
            <p className="text-muted-foreground">
              Our architecture is designed to be modular and extensible, making it easy for contributors to understand
              the codebase and add new features or improvements.
            </p>
          </section>
          
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-6">Meet Our Contributors</h2>
            
            <p className="text-muted-foreground mb-6">
              treeText is made possible by a global community of contributors who donate their time and expertise:
            </p>
            
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              {/* Featured contributor - you */}
              <a href="https://github.com/jm0535" target="_blank" rel="noopener noreferrer" className="group">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center transition-transform group-hover:scale-110">
                  <Avatar className="h-full w-full">
                    <AvatarFallback className="bg-primary/10 text-primary">JM</AvatarFallback>
                  </Avatar>
                </div>
                <div className="mt-2 text-center text-sm">jm0535</div>
              </a>
              
              {/* Other anonymous contributors */}
              {[1, 2, 3, 4, 5, 6, 7].map(id => (
                <div key={id} className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                  <Users className="h-8 w-8 text-muted-foreground" />
                </div>
              ))}
            </div>
            
            <div className="text-center">
              <p className="text-muted-foreground mb-4">
                Plus many more amazing contributors who help make treeText better every day!
              </p>
              <Button variant="outline" className="gap-2">
                <Star className="h-5 w-5" />
                View All Contributors
              </Button>
            </div>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold mb-6">Get Involved</h2>
            
            <p className="text-muted-foreground mb-6">
              There are many ways to contribute to treeText, regardless of your technical background:
            </p>
            
            <div className="space-y-4">
              <div className="border p-6 rounded">
                <h3 className="text-xl font-medium mb-2">Code Contributions</h3>
                <p className="text-muted-foreground mb-4">
                  Help us improve treeText by fixing bugs, adding features, or optimizing performance. Our GitHub
                  repository has a list of issues labeled "good first issue" for newcomers.
                </p>
                <Button variant="outline">Visit GitHub Repository</Button>
              </div>
              
              <div className="border p-6 rounded">
                <h3 className="text-xl font-medium mb-2">Documentation</h3>
                <p className="text-muted-foreground mb-4">
                  Help us improve our documentation to make treeText more accessible to users and new contributors.
                </p>
                <Button variant="outline">View Documentation</Button>
              </div>
              
              <div className="border p-6 rounded">
                <h3 className="text-xl font-medium mb-2">Testing & Bug Reports</h3>
                <p className="text-muted-foreground mb-4">
                  Use treeText and report any issues you find. Detailed bug reports are invaluable for improving our platform.
                </p>
                <Button variant="outline">Submit a Bug Report</Button>
              </div>
              
              <div className="border p-6 rounded">
                <h3 className="text-xl font-medium mb-2">Translations</h3>
                <p className="text-muted-foreground mb-4">
                  Help make treeText available in more languages by contributing translations.
                </p>
                <Button variant="outline">Contribute Translations</Button>
              </div>
            </div>
          </section>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default OpenSourcePage;
