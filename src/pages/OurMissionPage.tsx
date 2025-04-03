
import React from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { FileText, Users, Lock, Globe } from 'lucide-react';

const OurMissionPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-grow treeText-container py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Our Mission</h1>
          
          <div className="mb-12">
            <p className="text-xl text-muted-foreground mb-6">
              At treeText, our mission is to empower students and writers worldwide by providing free, accessible, 
              and powerful tools to improve their writing and uphold academic integrity.
            </p>
            
            <div className="border-l-4 pl-6 py-2 my-8">
              <p className="text-lg italic">
                "We believe that quality writing tools should be available to everyone, regardless of financial means.
                Academic integrity and clear communication are foundations of education that everyone deserves access to."
              </p>
              <p className="mt-2 font-medium">— The treeText Team</p>
            </div>
          </div>
          
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-6">Our Core Values</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex items-start">
                <div className="mr-4 mt-1">
                  <FileText className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-medium mb-2">Accessibility</h3>
                  <p className="text-muted-foreground">
                    We're committed to removing barriers to quality education tools. Our platform is free, open-source, 
                    and designed to be user-friendly for all.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="mr-4 mt-1">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-medium mb-2">Community-Driven</h3>
                  <p className="text-muted-foreground">
                    We believe in the power of collaboration. Our tools are built and improved by a global community
                    of educators, developers, and users who share our mission.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="mr-4 mt-1">
                  <Lock className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-medium mb-2">Privacy-Focused</h3>
                  <p className="text-muted-foreground">
                    We respect your privacy. We don't sell your data, and we're transparent about what information
                    we collect and how we use it.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="mr-4 mt-1">
                  <Globe className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-medium mb-2">Global Impact</h3>
                  <p className="text-muted-foreground">
                    We aim to support writers and students around the world, breaking down language barriers and 
                    promoting effective communication across cultures.
                  </p>
                </div>
              </div>
            </div>
          </section>
          
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-6">Our Story</h2>
            
            <p className="text-muted-foreground mb-4">
              treeText began as a collaborative project among graduate students who were frustrated with the high cost
              of plagiarism detection and grammar checking tools. Believing that these resources should be accessible
              to all students, they created an open-source alternative.
            </p>
            
            <p className="text-muted-foreground mb-4">
              What started as a small project has grown into a global community effort, with contributions from
              developers, educators, and linguists around the world. Today, treeText serves thousands of users
              daily, helping them improve their writing and maintain academic integrity without financial barriers.
            </p>
            
            <p className="text-muted-foreground">
              Our team remains committed to the original vision: providing free, high-quality writing tools for everyone,
              everywhere. We continue to improve our platform based on user feedback and community contributions.
            </p>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold mb-6">Join Our Mission</h2>
            
            <p className="text-muted-foreground mb-6">
              There are many ways to support and contribute to treeText's mission:
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border p-6 rounded">
                <h3 className="text-xl font-medium mb-2">Contribute Code</h3>
                <p className="text-muted-foreground mb-4">
                  Help improve our platform by contributing to our open-source codebase. Whether you're fixing bugs,
                  adding features, or improving documentation, every contribution matters.
                </p>
                <a href="#" className="text-primary font-medium">Learn how to contribute →</a>
              </div>
              
              <div className="border p-6 rounded">
                <h3 className="text-xl font-medium mb-2">Spread the Word</h3>
                <p className="text-muted-foreground mb-4">
                  Help us reach more students and writers who could benefit from our tools. Share treeText with
                  your network and educational institutions.
                </p>
                <a href="#" className="text-primary font-medium">Share treeText →</a>
              </div>
            </div>
          </section>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default OurMissionPage;
