
import React from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';

const BlogPage: React.FC = () => {
  const blogPosts = [
    {
      id: 1,
      title: 'How to Avoid Plagiarism in Academic Writing',
      excerpt: 'Learn the best practices for citing sources and avoiding unintentional plagiarism in your research papers.',
      date: 'May 15, 2023',
      author: 'Dr. Sarah Johnson',
      readTime: '8 min read',
      category: 'Academic Writing'
    },
    {
      id: 2,
      title: 'The Importance of Grammar in Professional Communication',
      excerpt: 'Discover why proper grammar is essential for effective communication in the workplace and how it impacts your professional image.',
      date: 'April 22, 2023',
      author: 'Michael Chen',
      readTime: '6 min read',
      category: 'Professional Development'
    },
    {
      id: 3,
      title: 'Top 10 Common Grammar Mistakes and How to Fix Them',
      excerpt: 'A comprehensive guide to the most frequent grammar errors made by writers and simple solutions to correct them.',
      date: 'March 10, 2023',
      author: 'Emily Rodriguez',
      readTime: '10 min read',
      category: 'Grammar Tips'
    },
    {
      id: 4,
      title: 'How to Properly Cite Sources in Different Citation Styles',
      excerpt: 'A detailed comparison of APA, MLA, Chicago, and Harvard citation styles with examples for various source types.',
      date: 'February 28, 2023',
      author: 'Prof. David Wilson',
      readTime: '12 min read',
      category: 'Citation Guides'
    },
    {
      id: 5,
      title: 'The Evolution of Plagiarism Detection Technology',
      excerpt: 'From manual checking to AI-powered tools: How technology has transformed the way we detect and prevent plagiarism.',
      date: 'January 15, 2023',
      author: 'Alex Thompson',
      readTime: '7 min read',
      category: 'Technology'
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-grow treeText-container py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">treeText Blog</h1>
          <p className="text-muted-foreground mb-8">
            Insights, tips, and resources on academic writing, plagiarism prevention, and grammar improvement
          </p>
          
          <div className="grid gap-6 mb-8">
            {blogPosts.map(post => (
              <Card key={post.id}>
                <CardHeader className="pb-4">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-sm text-muted-foreground">{post.category}</span>
                    <span className="text-sm text-muted-foreground">{post.date}</span>
                  </div>
                  <CardTitle className="text-xl">{post.title}</CardTitle>
                </CardHeader>
                <CardContent className="pb-4">
                  <p className="text-muted-foreground">{post.excerpt}</p>
                </CardContent>
                <CardFooter className="flex justify-between border-t pt-4">
                  <div className="text-sm text-muted-foreground">
                    By {post.author} · {post.readTime}
                  </div>
                  <Link to={`#`} className="text-primary font-medium">
                    Read more →
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
          
          <div className="flex justify-center">
            <div className="flex gap-2">
              <Link to="#" className="px-4 py-2 border rounded hover:bg-muted">1</Link>
              <Link to="#" className="px-4 py-2 border rounded hover:bg-muted">2</Link>
              <span className="px-4 py-2">...</span>
              <Link to="#" className="px-4 py-2 border rounded hover:bg-muted">Next →</Link>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default BlogPage;
