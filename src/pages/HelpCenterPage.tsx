
import React from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

const HelpCenterPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-grow treeText-container py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Help Center</h1>
          
          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4">Frequently Asked Questions</h2>
            <div className="space-y-6">
              <div className="border-b pb-4">
                <h3 className="text-xl font-medium mb-2">How does the plagiarism checker work?</h3>
                <p className="text-muted-foreground">
                  Our plagiarism checker compares your text against millions of sources online to identify any matching content. 
                  When matches are found, we provide detailed source information to help you properly cite your sources.
                </p>
              </div>
              
              <div className="border-b pb-4">
                <h3 className="text-xl font-medium mb-2">Is treeText free to use?</h3>
                <p className="text-muted-foreground">
                  Yes! treeText is completely free and open-source. We believe educational tools should be accessible to everyone.
                  Our service is maintained by a community of volunteers and supported by optional donations.
                </p>
              </div>
              
              <div className="border-b pb-4">
                <h3 className="text-xl font-medium mb-2">How accurate is the grammar checker?</h3>
                <p className="text-muted-foreground">
                  Our grammar checker uses advanced algorithms to detect common grammatical errors, spelling mistakes, 
                  punctuation issues, and style inconsistencies. While it's highly accurate, we always recommend a final human review.
                </p>
              </div>
            </div>
          </section>
          
          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4">Getting Started</h2>
            <p className="text-muted-foreground mb-4">
              New to treeText? Follow these simple steps to get started:
            </p>
            <ol className="list-decimal list-inside space-y-2 text-muted-foreground ml-4">
              <li>Simply paste your text into the editor on our home page</li>
              <li>Choose which checks you want to run (plagiarism, grammar, or both)</li>
              <li>Click "Analyze" and wait for the results</li>
              <li>Review the suggestions and make corrections as needed</li>
            </ol>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold mb-4">Contact Support</h2>
            <p className="text-muted-foreground mb-4">
              Still have questions? Our support team is here to help.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a href="mailto:support@treetext.app" className="inline-block px-4 py-2 border rounded text-center">
                Email Support
              </a>
              <a href="#" className="inline-block px-4 py-2 border rounded text-center">
                Submit Ticket
              </a>
            </div>
          </section>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default HelpCenterPage;
