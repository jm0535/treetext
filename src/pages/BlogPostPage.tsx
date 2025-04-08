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
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <Link to="/blog" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to all articles
            </Link>
            
            <div className="mb-2">
              <span className="inline-block bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
                {post.category}
              </span>
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold mb-4">{post.title}</h1>
            
            <div className="flex items-center gap-4 mb-6">
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
          
          <div className="prose prose-slate dark:prose-invert max-w-none mb-8">
            {post.content}
          </div>
          
          <div className="border-t pt-6 mt-8">
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
            
            <div className="bg-muted p-6 rounded-lg">
              <h2 className="text-xl font-bold mb-4">Related Articles</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {blogPosts
                  .filter(p => p.id !== post.id && p.category === post.category)
                  .slice(0, 2)
                  .map(relatedPost => (
                    <Link 
                      key={relatedPost.id} 
                      to={`/blog/${relatedPost.id}`}
                      className="block p-4 border rounded-md hover:bg-background transition-colors"
                    >
                      <h3 className="font-medium mb-2">{relatedPost.title}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">{relatedPost.excerpt}</p>
                    </Link>
                  ))}
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
