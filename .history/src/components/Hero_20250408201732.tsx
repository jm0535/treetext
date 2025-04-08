
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
                Free Plagiarism & Grammar Checker for All
              </h1>
              <p className="text-xl text-muted-foreground">
                Improve your writing with treeText's open-source alternative to Turnitin and Grammarly.
              </p>
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
