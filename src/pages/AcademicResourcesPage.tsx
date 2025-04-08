import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BookOpen, FileText, GraduationCap, Library, ExternalLink, BookMarked, Award, Globe } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const AcademicResourcesPage: React.FC = () => {
  return (
    <div className="treeText-container py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Academic Resources</h1>
        
        <p className="text-xl text-muted-foreground mb-8">
          A curated collection of free and premium resources to support your academic writing and research.
        </p>
        
        <Tabs defaultValue="writing" className="mb-12">
          <TabsList className="mb-6">
            <TabsTrigger value="writing" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Writing Resources
            </TabsTrigger>
            <TabsTrigger value="research" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Research Tools
            </TabsTrigger>
            <TabsTrigger value="citation" className="flex items-center gap-2">
              <BookMarked className="h-4 w-4" />
              Citation Guides
            </TabsTrigger>
            <TabsTrigger value="courses" className="flex items-center gap-2">
              <GraduationCap className="h-4 w-4" />
              Free Courses
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="writing" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ResourceCard 
                title="Purdue OWL"
                description="Comprehensive writing resources and instructional material from Purdue University."
                link="https://owl.purdue.edu/"
                tags={["Free", "Grammar", "Style Guides"]}
                icon={<GraduationCap className="h-5 w-5" />}
              />
              
              <ResourceCard 
                title="Grammarly"
                description="AI-powered writing assistant that checks grammar, spelling, and style."
                link="https://www.grammarly.com/"
                tags={["Free/Premium", "Grammar", "Style"]}
                icon={<FileText className="h-5 w-5" />}
              />
              
              <ResourceCard 
                title="Hemingway Editor"
                description="Makes your writing bold and clear by highlighting complex sentences and common errors."
                link="https://hemingwayapp.com/"
                tags={["Free", "Readability", "Editing"]}
                icon={<FileText className="h-5 w-5" />}
              />
              
              <ResourceCard 
                title="Academic Phrasebank"
                description="Collection of academic phrases and sentences organized by function."
                link="https://www.phrasebank.manchester.ac.uk/"
                tags={["Free", "Academic Writing", "Phrases"]}
                icon={<BookOpen className="h-5 w-5" />}
              />
              
              <ResourceCard 
                title="Thesaurus.com"
                description="Find synonyms and antonyms to enhance your vocabulary."
                link="https://www.thesaurus.com/"
                tags={["Free", "Vocabulary", "Synonyms"]}
                icon={<BookOpen className="h-5 w-5" />}
              />
              
              <ResourceCard 
                title="ProWritingAid"
                description="Grammar checker, style editor, and writing mentor in one package."
                link="https://prowritingaid.com/"
                tags={["Free/Premium", "Grammar", "Style"]}
                icon={<FileText className="h-5 w-5" />}
              />
            </div>
          </TabsContent>
          
          <TabsContent value="research" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ResourceCard 
                title="Google Scholar"
                description="Search across a wide range of scholarly literature."
                link="https://scholar.google.com/"
                tags={["Free", "Research", "Citations"]}
                icon={<Globe className="h-5 w-5" />}
              />
              
              <ResourceCard 
                title="JSTOR"
                description="Digital library of academic journals, books, and primary sources."
                link="https://www.jstor.org/"
                tags={["Free/Premium", "Research", "Journals"]}
                icon={<Library className="h-5 w-5" />}
              />
              
              <ResourceCard 
                title="ResearchGate"
                description="Social networking site for scientists and researchers to share papers."
                link="https://www.researchgate.net/"
                tags={["Free", "Networking", "Papers"]}
                icon={<Globe className="h-5 w-5" />}
              />
              
              <ResourceCard 
                title="Sci-Hub"
                description="Research paper repository providing free access to millions of papers."
                link="https://sci-hub.se/"
                tags={["Free", "Research Papers", "Access"]}
                icon={<Library className="h-5 w-5" />}
              />
              
              <ResourceCard 
                title="arXiv"
                description="Open access repository of electronic preprints and postprints."
                link="https://arxiv.org/"
                tags={["Free", "Preprints", "STEM"]}
                icon={<BookOpen className="h-5 w-5" />}
              />
              
              <ResourceCard 
                title="Zotero"
                description="Free, open-source reference management software."
                link="https://www.zotero.org/"
                tags={["Free", "Reference Management", "Citations"]}
                icon={<BookMarked className="h-5 w-5" />}
              />
            </div>
          </TabsContent>
          
          <TabsContent value="citation" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ResourceCard 
                title="Citation Machine"
                description="Automatically generate citations in MLA, APA, Chicago, and more."
                link="https://www.citationmachine.net/"
                tags={["Free/Premium", "Citations", "Multiple Styles"]}
                icon={<BookMarked className="h-5 w-5" />}
              />
              
              <ResourceCard 
                title="Cite This For Me"
                description="Create citations in thousands of styles with our free citation generator."
                link="https://www.citethisforme.com/"
                tags={["Free/Premium", "Citations", "Multiple Styles"]}
                icon={<BookMarked className="h-5 w-5" />}
              />
              
              <ResourceCard 
                title="APA Style Guide"
                description="Official APA Style website with guidelines and examples."
                link="https://apastyle.apa.org/"
                tags={["Free", "APA Style", "Guidelines"]}
                icon={<BookOpen className="h-5 w-5" />}
              />
              
              <ResourceCard 
                title="MLA Style Center"
                description="The official site of MLA style with guidelines and tools."
                link="https://style.mla.org/"
                tags={["Free", "MLA Style", "Guidelines"]}
                icon={<BookOpen className="h-5 w-5" />}
              />
              
              <ResourceCard 
                title="Chicago Manual of Style Online"
                description="The authoritative guide for Chicago style with guidelines and examples."
                link="https://www.chicagomanualofstyle.org/"
                tags={["Premium", "Chicago Style", "Guidelines"]}
                icon={<BookOpen className="h-5 w-5" />}
              />
              
              <ResourceCard 
                title="BibGuru"
                description="Fast and free citation generator for APA, MLA, Chicago, and more."
                link="https://www.bibguru.com/"
                tags={["Free", "Citations", "Multiple Styles"]}
                icon={<BookMarked className="h-5 w-5" />}
              />
            </div>
          </TabsContent>
          
          <TabsContent value="courses" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ResourceCard 
                title="Coursera"
                description="Online courses from top universities and companies."
                link="https://www.coursera.org/"
                tags={["Free/Premium", "Courses", "Certificates"]}
                icon={<GraduationCap className="h-5 w-5" />}
              />
              
              <ResourceCard 
                title="edX"
                description="Free online courses from Harvard, MIT, and more."
                link="https://www.edx.org/"
                tags={["Free/Premium", "Courses", "Certificates"]}
                icon={<GraduationCap className="h-5 w-5" />}
              />
              
              <ResourceCard 
                title="Khan Academy"
                description="Free educational content for students of all ages."
                link="https://www.khanacademy.org/"
                tags={["Free", "Education", "All Subjects"]}
                icon={<GraduationCap className="h-5 w-5" />}
              />
              
              <ResourceCard 
                title="MIT OpenCourseWare"
                description="Free web-based publication of virtually all MIT course content."
                link="https://ocw.mit.edu/"
                tags={["Free", "Courses", "MIT"]}
                icon={<GraduationCap className="h-5 w-5" />}
              />
              
              <ResourceCard 
                title="FutureLearn"
                description="Online courses from leading universities and cultural institutions."
                link="https://www.futurelearn.com/"
                tags={["Free/Premium", "Courses", "Certificates"]}
                icon={<GraduationCap className="h-5 w-5" />}
              />
              
              <ResourceCard 
                title="Open Yale Courses"
                description="Free access to a selection of introductory courses taught by Yale faculty."
                link="https://oyc.yale.edu/"
                tags={["Free", "Courses", "Yale"]}
                icon={<GraduationCap className="h-5 w-5" />}
              />
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="bg-muted/50 border rounded-lg p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">Suggest a Resource</h2>
          <p className="mb-4 text-muted-foreground">
            Know of a great academic resource that should be included here? We're always looking to expand our collection.
          </p>
          <Button asChild>
            <a href="/contact-us">Contact Us with Suggestions</a>
          </Button>
        </div>
        
        <div className="text-sm text-muted-foreground">
          <p className="mb-2">
            <strong>Disclaimer:</strong> treeText is not affiliated with any of the resources listed above. 
            Links are provided for educational purposes only. Some resources may require payment or subscription.
          </p>
          <p>
            Last updated: April 8, 2025
          </p>
        </div>
      </div>
    </div>
  );
};

interface ResourceCardProps {
  title: string;
  description: string;
  link: string;
  tags: string[];
  icon: React.ReactNode;
}

const ResourceCard: React.FC<ResourceCardProps> = ({ title, description, link, tags, icon }) => {
  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-md">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            <div className="bg-primary/10 p-2 rounded-full">
              {icon}
            </div>
            <CardTitle className="text-lg">{title}</CardTitle>
          </div>
        </div>
        <CardDescription className="mt-2">{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2 mb-4">
          {tags.map((tag, index) => (
            <Badge key={index} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
        <Button variant="outline" size="sm" className="w-full" asChild>
          <a href={link} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-1">
            Visit Resource
            <ExternalLink className="h-3 w-3 ml-1" />
          </a>
        </Button>
      </CardContent>
    </Card>
  );
};

export default AcademicResourcesPage;
