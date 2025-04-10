
import React from 'react';
import { Button } from "@/components/ui/button";
import { BookOpen, Upload, Type } from "lucide-react";
import { Link } from 'react-router-dom';
import { useTextAnalysis } from '@/hooks/useTextAnalysis';

interface HeroProps {
  onInputMethodChange: (method: string) => void;
}

const Hero: React.FC<HeroProps> = ({ onInputMethodChange }) => {
  const { setText } = useTextAnalysis();
  
  const handleCheckText = () => {
    onInputMethodChange('text');
    setTimeout(() => {
      const textEditor = document.querySelector('#text-editor');
      if (textEditor) {
        textEditor.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };
  
  const handleUploadDocument = () => {
    onInputMethodChange('file');
    setTimeout(() => {
      const fileUploader = document.querySelector('#file-uploader');
      if (fileUploader) {
        fileUploader.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };
  
  return (
    <section className="py-12 md:py-20">
      <div className="kopitree-container">
        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
          <div className="flex-1 space-y-6">
            <div className="space-y-2">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                The Free Plagiarism, Grammar & Readability Checker
              </h1>
              <p className="text-xl text-muted-foreground">
                Improve your writing with treeText's open-source alternative to Turnitin and Grammarly.
              </p>
              <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-300 mb-2">Sign up for premium features!</h3>
                <ul className="space-y-2 text-sm text-blue-700 dark:text-blue-200">
                  <li className="flex items-center"><span className="mr-2 text-blue-500">✓</span> Full AI capabilities with advanced analysis</li>
                  <li className="flex items-center"><span className="mr-2 text-blue-500">✓</span> Persistent history storage across all devices</li>
                  <li className="flex items-center"><span className="mr-2 text-blue-500">✓</span> Upload files directly from cloud storage services</li>
                  <li className="flex items-center"><span className="mr-2 text-blue-500">✓</span> Enhanced analytics and detailed reports</li>
                </ul>
                <p className="mt-2 text-xs text-blue-600 dark:text-blue-300">Powered by Supabase authentication and PostgreSQL database for secure, reliable storage.</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button onClick={handleCheckText} className="bg-primary hover:bg-primary/90 h-11 px-6">
                <Type className="mr-2 h-5 w-5" />
                Enter Text
              </Button>
              <Button onClick={handleUploadDocument} variant="secondary" className="h-11 px-6">
                <Upload className="mr-2 h-5 w-5" />
                Upload Document
              </Button>
              <Button variant="outline" className="h-11 px-6 border-primary/30 text-primary" asChild>
                <Link to="/signup">
                  <span className="mr-2">👤</span>
                  Sign Up
                </Link>
              </Button>
              <Button variant="outline" className="h-11 px-6 border-2" asChild>
                <Link to="/features">
                  <BookOpen className="mr-2 h-5 w-5" />
                  Learn More
                </Link>
              </Button>
            </div>
            <div className="pt-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div 
                      key={i} 
                      className="h-8 w-8 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center"
                    >
                      <span className="text-xs font-medium text-gray-600">{i}</span>
                    </div>
                  ))}
                </div>
                <span>
                  <strong>40+</strong> students already trust treeText
                </span>
              </div>
              <div className="mt-3 flex items-center text-xs text-muted-foreground">
                <span className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 px-2 py-1 rounded-md mr-2">
                  New
                </span>
                <span>Upload files directly from Google Drive, Dropbox, and OneDrive</span>
              </div>
            </div>
          </div>
          <div className="flex-1 max-w-lg">
            <div className="rounded-md overflow-hidden border-2 border-border bg-card p-4">
              <div className="flex space-x-2 mb-3">
                <div className="h-3 w-3 rounded-full bg-red-400"></div>
                <div className="h-3 w-3 rounded-full bg-yellow-400"></div>
                <div className="h-3 w-3 rounded-full bg-green-400"></div>
              </div>
              <div className="bg-muted rounded-md p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <div className="flex space-x-2">
                    <div className="w-24 h-6 bg-primary/20 rounded-sm"></div>
                    <div className="w-20 h-6 bg-secondary/20 rounded-sm"></div>
                  </div>
                  <div className="w-24 h-6 bg-gray-200 rounded-sm"></div>
                </div>
                <div className="space-y-2">
                  <div className="w-full h-4 bg-gray-200 rounded-sm"></div>
                  <div className="w-4/5 h-4 bg-gray-200 rounded-sm"></div>
                  <div className="w-full h-4 bg-gray-200 rounded-sm"></div>
                </div>
                <div className="space-y-2">
                  <div className="w-full h-4 bg-red-100 rounded-sm"></div>
                  <div className="w-3/4 h-4 bg-gray-200 rounded-sm"></div>
                  <div className="w-full h-4 bg-gray-200 rounded-sm"></div>
                  <div className="w-5/6 h-4 bg-yellow-100 rounded-sm"></div>
                </div>
                <div className="pt-2 flex justify-end">
                  <div className="w-32 h-8 bg-primary/30 rounded-sm"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
