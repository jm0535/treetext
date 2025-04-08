import React from 'react';
import { useParams, Link } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ArrowLeft, Calendar, Clock, Share2, Bookmark, ThumbsUp } from 'lucide-react';
import { blogPosts } from '@/data/blog';

const BlogPostPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const postId = parseInt(id || '1');
  
  // Find the post with the matching ID
  const post = blogPosts.find(post => post.id === postId);
  
  if (!post) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <main className="flex-grow treeText-container py-12">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl font-bold mb-4">Blog Post Not Found</h1>
            <p className="text-muted-foreground mb-6">
              Sorry, the blog post you're looking for doesn't exist or has been removed.
            </p>
            <Button asChild>
              <Link to="/blog">Return to Blog</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-grow treeText-container py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          <div className="lg:col-span-3">
          <div className="mb-8">
            <Link to="/blog" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to all articles
            </Link>
            
            <div className="mb-4">
              <span className="inline-block bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
                {post.category}
              </span>
            </div>
            
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight">{post.title}</h1>
            
            <div className="flex items-center gap-4 mb-10 border-b pb-6">
              <Avatar className="h-10 w-10">
                <AvatarFallback>TT</AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium">{post.author}</div>
                <div className="text-sm text-muted-foreground flex items-center gap-4">
                  <span className="flex items-center">
                    <Calendar className="h-3 w-3 mr-1" />
                    {post.date}
                  </span>
                  <span className="flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    {post.readTime}
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          <article className="prose prose-slate dark:prose-invert max-w-none mb-8 prose-headings:text-foreground prose-headings:font-bold prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4 prose-h3:text-xl prose-h3:mt-6 prose-h3:mb-3 prose-p:text-muted-foreground prose-p:leading-relaxed prose-p:mb-4 prose-strong:text-foreground prose-strong:font-semibold prose-ul:my-6 prose-ul:list-disc prose-ul:pl-6 prose-li:mb-2 prose-li:text-muted-foreground">
              {post.content}
          </article>
          
          <div className="border-t pt-8 mt-12">
            <div className="sticky top-4 hidden lg:block bg-muted/50 p-6 rounded-lg mb-8 border">
              <h3 className="text-lg font-semibold mb-3">Table of Contents</h3>
              <nav className="space-y-1">
                {Array.from(post.content.props.children)
                  .filter(child => child.type === 'h2')
                  .map((heading, index) => (
                    <a
                      key={index}
                      href={`#${heading.props.children.toString().toLowerCase().replace(/\s+/g, '-')}`}
                      className="block text-sm py-1 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {heading.props.children}
                    </a>
                  ))
                }
              </nav>
            </div>
            <div className="flex justify-between items-center mb-8">
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="gap-1">
                  <ThumbsUp className="h-4 w-4" />
                  <span>Helpful</span>
                </Button>
                <Button variant="outline" size="sm" className="gap-1">
                  <Bookmark className="h-4 w-4" />
                  <span>Save</span>
                </Button>
                <Button variant="outline" size="sm" className="gap-1">
                  <Share2 className="h-4 w-4" />
                  <span>Share</span>
                </Button>
              </div>
              
              <div className="text-sm text-muted-foreground">
                Last updated: {post.lastUpdated || post.date}
              </div>
            </div>
            
          </div>
          <div className="lg:col-span-1 space-y-8">
            <div className="bg-muted p-8 rounded-lg shadow-sm sticky top-4">
              <h2 className="text-xl font-bold mb-4">Related Articles</h2>
              <div className="grid gap-4 lg:grid-cols-1">
                {blogPosts
                  .filter(p => p.id !== post.id && p.category === post.category)
                  .slice(0, 2)
                  .map(relatedPost => (
                    <Link 
                      key={relatedPost.id} 
                      to={`/blog/${relatedPost.id}`}
                      className="block p-6 border rounded-md hover:bg-background transition-colors shadow-sm hover:shadow"
                    >
                      <h3 className="font-semibold mb-3 text-foreground">{relatedPost.title}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">{relatedPost.excerpt}</p>
                      <div className="mt-3 text-xs text-primary font-medium flex items-center">
                        <span>Read article</span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1 h-3 w-3">
                          <path d="M5 12h14"></path>
                          <path d="m12 5 7 7-7 7"></path>
                        </svg>
                      </div>
                    </Link>
                  ))}
              </div>
            </div>
          </div>
        </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default BlogPostPage;
