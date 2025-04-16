import React from 'react';
import { Badge } from '@/components/ui/badge';

interface ChangelogItem {
  date: string;
  version: string;
  title: string;
  description: string;
  changes: string[];
  commitId?: string;
}

const ChangelogPage: React.FC = () => {
  const changelog: ChangelogItem[] = [
    {
      date: 'April 16, 2025',
      version: '1.3.4',
      title: 'Settings UI Redesign & Navigation Improvements',
      description: 'Completely redesigned settings interface and fixed navigation issues for better user experience',
      changes: [
        'Implemented tabbed interface in settings panel for better organization of options',
        'Enhanced feature toggles with improved visibility and accessibility',
        'Added color-coded indicators for different analysis features',
        'Improved visual hierarchy with better spacing and grouping of related settings',
        'Fixed Upload File button navigation to properly redirect to the file upload tab',
        'Implemented state-based navigation between components to prevent 404 errors',
        'Added responsive design to settings panel for better mobile experience',
        'Improved tooltips and help text for better user guidance'
      ],
      commitId: 'j7k8l9m'
    },
    {
      date: 'April 16, 2025',
      version: '1.3.3',
      title: 'Dashboard UI Overhaul',
      description: 'Comprehensive redesign of the user dashboard with enhanced visualizations and personalized insights',
      changes: [
        'Implemented activity summary metrics with visual indicators for improvement trends',
        'Added enhanced recent activity display with filtering capabilities',
        'Created weekly activity visualization chart for tracking usage patterns',
        'Added progress visualization with mini-charts for grammar, readability, and originality scores',
        'Implemented personalized recommendations based on user writing patterns',
        'Added quick filters for accessing different types of analyses',
        'Improved visual hierarchy for better usability and information architecture',
        'Enhanced responsive design for optimal viewing on all devices'
      ],
      commitId: 'e4f5g6h'
    },
    {
      date: 'April 16, 2025',
      version: '1.3.2',
      title: 'Analytics Dashboard Enhancements',
      description: 'Improved analytics dashboard with real user activity data and dynamic visualizations',
      changes: [
        'Updated Monthly Activity chart to display real analysis counts from database',
        'Enhanced Improvement Trends section with actual user progress metrics',
        'Replaced static analytics cards with real-time user statistics',
        'Added dynamic bar scaling for better visualization of usage patterns',
        'Implemented loading states and error handling for all analytics components',
        'Improved date formatting for better readability',
        'Added current score indicators to improvement metrics'
      ],
      commitId: 'a1b2c3d'
    },
    {
      date: 'April 16, 2025',
      version: '1.3.1',
      title: 'User Guide Bug Fix',
      description: 'Fixed a critical bug in the User Guide page that was causing 404 errors',
      changes: [
        'Fixed missing Sparkles component import in UserGuidePage.tsx',
        'Resolved "ReferenceError: Sparkles is not defined" error',
        'Improved User Guide page stability and accessibility'
      ],
      commitId: 'x9y8z7w'
    },
    {
      date: 'April 10, 2025',
      version: '1.3.0',
      title: 'Cloud Storage Integration and Live Dashboard',
      description: 'Added cloud storage integration for file uploads and implemented live dashboard with real-time database updates',
      changes: [
        'Enhanced FileUploader with cloud storage integration (Google Drive, Dropbox, OneDrive)',
        'Improved dashboard to display real-time data from the database',
        'Removed dummy/sample data from user dashboard and history pages',
        'Added loading states with skeleton UI for better user experience',
        'Implemented comprehensive history page with unified view of text and file analyses',
        'Added file upload history tracking in the database',
        'Improved user statistics with calculation of improvement scores',
        'Enhanced empty states for new users with helpful guidance',
        'Added delete functionality with confirmation dialog for history items'
      ],
      commitId: 'n8p0q2r'
    },
    {
      date: 'April 10, 2025',
      version: '1.2.0',
      title: 'Administrator Role and Database Storage for Analysis History',
      description: 'Added administrator role and implemented database storage for analysis history with Row-Level Security',
      changes: [
        'Set up administrator role for the application',
        'Implemented Row-Level Security (RLS) for proper data access control',
        'Created database tables for storing text analysis and file upload history',
        'Added DatabaseService for persistent storage of analysis results',
        'Updated TextAnalysisService to use database storage with local storage fallback',
        'Modified TextAnalysisContext to work with asynchronous database operations',
        'Improved security with role-based access control for all data',
        'Enhanced user experience with persistent analysis history across devices'
      ],
      commitId: 'j7k9l1m'
    },
    {
      date: 'April 10, 2025',
      version: '1.1.1',
      title: 'Large Document Analysis Improvements and Bug Fixes',
      description: 'Enhanced readability analysis for large documents and fixed critical variable reference issues',
      changes: [
        'Fixed "Cannot read properties of undefined" errors in TextAnalysisService',
        'Enhanced readability analysis for scientific documents with section header detection',
        'Added specialized analysis for thesis-length documents (10,000+ words)',
        'Improved academic document structure recognition (abstracts, introductions, conclusions)',
        'Fixed variable scope issues in plagiarism detection simulation',
        'Optimized text processing for 120+ page documents',
        'Updated user guide with information about large document analysis capabilities'
      ],
      commitId: 'e5f7g9h'
    },
    {
      date: 'April 9, 2025',
      version: '1.1.0',
      title: 'Enhanced AI Calibration and Language Model Integration',
      description: 'Improved AI calibration with intelligent language model recommendations and fixed code issues',
      changes: [
        'Enhanced AI calibration to automatically recommend appropriate language models based on document type',
        'Implemented tiered language model structure with specialized models for different content types',
        'Added document type recognition for more accurate analysis settings',
        'Improved weight adjustment system for different document categories',
        'Fixed variable redefinition issues in TextAnalysisService',
        'Added user feedback notifications for AI calibration updates',
        'Updated user guide with comprehensive AI features documentation'
      ],
      commitId: 'b2c4d6e'
    },
    {
      date: 'April 9, 2025',
      version: '0.6.0',
      title: 'Improved Plagiarism Detection and API Fallbacks',
      description: 'Enhanced plagiarism detection with multiple API fallbacks and improved source linking',
      changes: [
        'Changed from Originality Score to Similarity Index for industry standard alignment',
        'Fixed source URL generation for better reference linking',
        'Added Cohere API as first fallback for plagiarism detection',
        'Added HuggingFace API as second fallback for plagiarism detection',
        'Improved source URL relevance by generating contextual search queries',
        'Fixed UI issues in the plagiarism detection tab'
      ],
      commitId: 'f8d2e7b'
    },
    {
      date: 'April 9, 2025',
      version: '0.5.0',
      title: 'Usage Limits and Authentication Requirements',
      description: 'Implemented user rate limits and authentication for API access',
      changes: [
        'Added usage statistics UI component to visualize API usage',
        'Implemented daily and monthly analysis limits to manage API costs',
        'Added token usage tracking for OpenAI API calls',
        'Restricted OpenAI API access to authenticated users only',
        'Enhanced user feedback for limit notifications',
        'Added graceful fallbacks for non-authenticated users'
      ],
      commitId: 'a7b9c3d'
    },
    {
      date: 'April 8, 2025',
      version: '0.4.0',
      title: 'Deployment Fixes and Performance Improvements',
      description: 'Fixed deployment issues and improved application performance',
      changes: [
        'Fixed Supabase authentication integration',
        'Removed Stripe integration to resolve deployment issues',
        'Optimized bundle size with improved build configuration',
        'Added Academic Resources page with categorized learning materials',
        'Fixed routing issues for better compatibility with static hosting',
        'Updated branding with "Powered by in4metrix" in footer'
      ],
      commitId: '45012e4'
    },
    {
      date: 'April 8, 2025',
      version: '0.3.0',
      title: 'User Guide and UI Improvements',
      description: 'Added comprehensive user documentation and fixed UI issues',
      changes: [
        'Added detailed User Guide with step-by-step instructions',
        'Fixed duplicate navigation and footer components',
        'Improved mobile responsiveness across all pages',
        'Added beta badge to indicate current development status',
        'Added changelog page to track version history'
      ],
      commitId: '8f3e7a2'
    },
    {
      date: 'April 7, 2025',
      version: '0.2.5',
      title: 'Stripe Integration',
      description: 'Added payment processing capabilities',
      changes: [
        'Integrated Stripe for payment processing',
        'Created sponsorship page with multiple donation options',
        'Implemented payment intent API using serverless functions',
        'Added webhook handler for payment events',
        'Temporarily disabled sponsorship links pending banking setup'
      ],
      commitId: '6d2c9b4'
    },
    {
      date: 'April 5, 2025',
      version: '0.2.0',
      title: 'Enhanced Text Analysis',
      description: 'Improved plagiarism detection and grammar checking',
      changes: [
        'Enhanced plagiarism detection algorithm',
        'Added support for academic citation formats',
        'Improved grammar checking accuracy',
        'Added readability analysis with Flesch-Kincaid scores',
        'Optimized text processing performance'
      ],
      commitId: '3a7f9e1'
    },
    {
      date: 'April 4, 2025',
      version: '0.1.5',
      title: 'User Interface Improvements',
      description: 'Enhanced user experience and accessibility',
      changes: [
        'Implemented dark mode support',
        'Improved accessibility with ARIA attributes',
        'Added keyboard navigation support',
        'Enhanced mobile responsiveness',
        'Optimized page load times'
      ],
      commitId: '2b5d8c3'
    },
    {
      date: 'April 3, 2025',
      version: '0.1.0',
      title: 'Initial Release',
      description: 'First beta release of treeText',
      changes: [
        'Core text analysis functionality',
        'Basic plagiarism detection',
        'Simple grammar checking',
        'User account system',
        'Responsive design foundation'
      ],
      commitId: '1a2b3c4'
    }
  ];

  return (
    <div className="treeText-container py-12">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <h1 className="text-3xl font-bold">Changelog</h1>
          <Badge variant="outline" className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-800">Beta</Badge>
        </div>
        
        <p className="text-muted-foreground mb-8">
          Track the development progress of treeText. This changelog documents all notable changes, improvements, and fixes.
        </p>
        
        <div className="relative border-l-2 border-primary/30 pl-8 ml-4 space-y-10">
          {changelog.map((item, index) => (
            <div key={index} className="relative">
              {/* Git-style commit node */}
              <div className="absolute -left-[42px] top-0 w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-background"></div>
              </div>
              
              {/* Version tag */}
              <div className="absolute -left-[120px] top-0 text-sm font-mono text-muted-foreground">
                {item.version}
              </div>
              
              {/* Content */}
              <div className="relative">
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-xl font-semibold">{item.title}</h2>
                  <Badge variant="secondary" className="font-mono text-xs">
                    {item.date}
                  </Badge>
                </div>
                
                <p className="text-muted-foreground mb-4">{item.description}</p>
                
                <div className="bg-muted/30 border rounded-md p-4 mb-2">
                  <ul className="space-y-2">
                    {item.changes.map((change, changeIndex) => (
                      <li key={changeIndex} className="flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        <span>{change}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                {item.commitId && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground font-mono">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="4" />
                      <path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 0 0-10-10" />
                      <path d="M2 9V8a10 10 0 0 1 10-10" />
                    </svg>
                    <span>commit {item.commitId}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChangelogPage;
