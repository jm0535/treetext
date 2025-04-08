
import React from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { blogPosts } from '@/data/blog';

const BlogPage: React.FC = () => {

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
                  <Link to={`/blog/${post.id}`} className="text-primary font-medium hover:underline">
                    Read more →
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
          
          <div className="flex justify-center">
            <div className="flex gap-2">
              <Link to="/blog?page=1" className="px-4 py-2 border rounded bg-primary/10 hover:bg-primary/20 text-primary font-medium">1</Link>
              <Link to="/blog?page=2" className="px-4 py-2 border rounded hover:bg-muted">2</Link>
              <span className="px-4 py-2">...</span>
              <Link to="/blog?page=2" className="px-4 py-2 border rounded hover:bg-muted flex items-center gap-1">
                <span>Next</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-right">
                  <path d="m9 18 6-6-6-6"/>
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default BlogPage;
