import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ArrowLeft, Calendar, Clock, Share2, Bookmark, ThumbsUp, ChevronRight, Tag, BookOpen, ChevronUp } from 'lucide-react';
import { blogPosts } from '@/data/blog';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

const BlogPostPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const postId = parseInt(id || '1');
  const [showBackToTop, setShowBackToTop] = useState(false);

  // Find the post with the matching ID
  const post = blogPosts.find(post => post.id === postId);

  // Handle scroll for back-to-top button
  useEffect(() => {
    const handleScroll = () => {
      // Show back-to-top button when scrolled down
      setShowBackToTop(window.scrollY > 500);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <div className="bg-gradient-to-b from-primary/5 to-transparent h-64 absolute top-0 left-0 right-0 z-0"></div>
        <Navigation />
        <main className="flex-grow py-16 px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center bg-card p-10 rounded-xl shadow-lg border border-border/30">
            <Badge variant="outline" className="mb-6 px-3 py-1 bg-primary/5 text-primary border-primary/20 mx-auto">
              <BookOpen className="h-3.5 w-3.5 mr-1.5" />
              Blog Post
            </Badge>
            <h1 className="text-3xl font-bold mb-4 text-foreground">Blog Post Not Found</h1>
            <p className="text-foreground/80 mb-8">
              Sorry, the blog post you're looking for doesn't exist or has been removed.
            </p>
            <Button asChild className="bg-primary hover:bg-primary/90 rounded-lg shadow-sm">
              <Link to="/blog">Return to Blog</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <div className="bg-gradient-to-b from-primary/5 to-transparent h-64 absolute top-0 left-0 right-0 z-0"></div>
      <Navigation />

      <main className="flex-grow py-16 px-4 sm:px-6 relative z-10">
          <div className="max-w-7xl mx-auto">
          {/* Back button */}
          <Link to="/blog" className="inline-flex items-center text-primary hover:text-primary/80 mb-10 font-medium transition-colors group">
            <ArrowLeft className="h-4 w-4 mr-2 transition-transform group-hover:-translate-x-1" />
            Back to all articles
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Main content */}
            <div className="lg:col-span-8">
              <div className="bg-card rounded-xl shadow-lg overflow-hidden border border-border/30">
                <div className="p-8 md:p-10">
                  {/* Category */}
                  <div className="mb-6">
                    <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 px-4 py-1.5 rounded-full text-sm font-medium">
                      <Tag className="h-3.5 w-3.5 mr-2" />
                      {post.category}
                    </Badge>
                  </div>

                  {/* Title */}
                  <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-8 leading-tight text-foreground tracking-tight">
                    {post.title}
                  </h1>

                  {/* Author info */}
                  <div className="flex items-center gap-4 mb-10 border-b border-border/50 pb-8">
                    <Avatar className="h-14 w-14 border-2 border-primary/20 shadow-sm">
                      <AvatarFallback className="bg-primary/10 text-primary font-bold text-lg">TT</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-bold text-foreground text-lg">{post.author}</div>
                      <div className="text-sm text-muted-foreground items-center gap-4 mt-2 bg-muted/30 px-3 py-1.5 rounded-lg flex">
                        <span className="flex items-center">
                          <Calendar className="h-3.5 w-3.5 mr-1.5 text-primary/70" />
                          {post.date}
                        </span>
                        <span className="flex items-center">
                          <Clock className="h-3.5 w-3.5 mr-1.5 text-primary/70" />
                          {post.readTime}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Article content */}
                  <article className="prose prose-lg dark:prose-invert max-w-none
                    /* Headers */
                    prose-headings:text-foreground prose-headings:font-bold prose-headings:tracking-tight
                    prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6 prose-h2:pb-3 prose-h2:border-b prose-h2:border-border prose-h2:font-extrabold
                    prose-h3:text-2xl prose-h3:mt-10 prose-h3:mb-4 prose-h3:font-bold
                    prose-h4:text-xl prose-h4:mt-8 prose-h4:mb-3 prose-h4:font-semibold

                    /* Paragraphs and text */
                    prose-p:text-foreground/80 prose-p:leading-relaxed prose-p:mb-6 prose-p:text-base
                    prose-strong:text-foreground prose-strong:font-bold
                    prose-em:text-foreground/90 prose-em:italic

                    /* Lists */
                    prose-ul:my-8 prose-ul:list-none prose-ul:pl-0 prose-ul:space-y-4
                    prose-ol:my-8 prose-ol:list-none prose-ol:pl-0 prose-ol:space-y-4 prose-ol:counter-reset-[item]
                    prose-li:mb-2 prose-li:text-foreground/80 prose-li:pl-9 prose-li:relative

                    /* List item styling */
                    [&_ul>li]:before:content-[''] [&_ul>li]:before:absolute [&_ul>li]:before:left-0 [&_ul>li]:before:top-[0.6em] [&_ul>li]:before:h-2 [&_ul>li]:before:w-2 [&_ul>li]:before:rounded-full [&_ul>li]:before:bg-primary
                    [&_ol>li]:before:content-[counter(item)] [&_ol>li]:before:counter-increment-[item] [&_ol>li]:before:absolute [&_ol>li]:before:left-0 [&_ol>li]:before:top-0 [&_ol>li]:before:flex [&_ol>li]:before:items-center [&_ol>li]:before:justify-center [&_ol>li]:before:h-6 [&_ol>li]:before:w-6 [&_ol>li]:before:rounded-full [&_ol>li]:before:bg-primary/10 [&_ol>li]:before:text-primary [&_ol>li]:before:text-sm [&_ol>li]:before:font-medium

                    /* Nested lists */
                    [&_li>ul]:mt-4 [&_li>ul]:space-y-3 [&_li>ol]:mt-4 [&_li>ol]:space-y-3

                    /* Emphasis, code, and other elements */
                    prose-code:text-primary prose-code:bg-primary/5 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:font-mono prose-code:text-sm
                    prose-blockquote:border-l-4 prose-blockquote:border-primary/30 prose-blockquote:pl-6 prose-blockquote:pr-2 prose-blockquote:py-1 prose-blockquote:my-8 prose-blockquote:italic prose-blockquote:text-foreground/75

                    /* Headings with numbers */
                    [&_h3]:flex [&_h3]:items-center [&_h3]:gap-3 [&_h3]:font-bold
                    [&_h3>span:first-child]:bg-primary/10 [&_h3>span:first-child]:text-primary [&_h3>span:first-child]:w-8 [&_h3>span:first-child]:h-8 [&_h3>span:first-child]:rounded-full [&_h3>span:first-child]:flex [&_h3>span:first-child]:items-center [&_h3>span:first-child]:justify-center [&_h3>span:first-child]:text-sm [&_h3>span:first-child]:font-bold
                    ">
                    {post.content}
                  </article>

                  {/* Article footer */}
                  <div className="border-t border-border pt-8 mt-12">
                    <div className="flex flex-wrap justify-between items-center gap-4">
                      <div className="flex flex-wrap gap-2">
                        <Button variant="outline" size="sm" className="gap-1.5 rounded-full px-4 hover:bg-primary/5 hover:text-primary">
                          <ThumbsUp className="h-4 w-4 text-primary" />
                          <span>Helpful</span>
                        </Button>
                        <Button variant="outline" size="sm" className="gap-1.5 rounded-full px-4 hover:bg-primary/5 hover:text-primary">
                          <Bookmark className="h-4 w-4 text-primary" />
                          <span>Save</span>
                        </Button>
                        <Button variant="outline" size="sm" className="gap-1.5 rounded-full px-4 hover:bg-primary/5 hover:text-primary">
                          <Share2 className="h-4 w-4 text-primary" />
                          <span>Share</span>
                        </Button>
                      </div>

                      <div className="text-sm text-muted-foreground">
                        Last updated: {post.lastUpdated || post.date}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-4 space-y-6">
              {/* Table of Contents */}
              <div className="bg-card rounded-xl shadow-md overflow-hidden sticky top-4 border border-border/30">
                <div className="p-6 border-b border-border bg-gradient-to-r from-primary/5 to-transparent">
                  <h3 className="text-xl font-bold text-foreground flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-3 h-5 w-5 text-primary">
                      <line x1="21" x2="3" y1="6" y2="6"></line>
                      <line x1="15" x2="3" y1="12" y2="12"></line>
                      <line x1="17" x2="3" y1="18" y2="18"></line>
                    </svg>
                    Table of Contents
                  </h3>
                </div>
                <div className="p-6">
                  <nav className="space-y-3">
                    {Array.from(post.content.props.children)
                      .filter(child => child.type === 'h2')
                      .map((heading, index) => (
                        <a
                          key={index}
                          href={`#${heading.props.children.toString().toLowerCase().replace(/\s+/g, '-')}`}
                          className={cn(
                            "block py-3 px-4 text-sm rounded-md transition-colors flex items-center",
                            "text-foreground/80 hover:text-primary hover:bg-primary/5 border border-transparent hover:border-primary/10"
                          )}
                        >
                          <span className="w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold mr-3">
                            {index + 1}
                          </span>
                          <span className="font-medium">{heading.props.children}</span>
                        </a>
                      ))
                    }
                  </nav>
                </div>
              </div>

              {/* Related Articles */}
              <div className="bg-card rounded-xl shadow-md overflow-hidden border border-border/30 mt-10">
                <div className="p-6 border-b border-border bg-muted/30">
                  <h2 className="text-lg font-bold text-foreground flex items-center">
                    <BookOpen className="mr-2 h-5 w-5 text-primary" />
                    Related Articles
                  </h2>
                </div>
                <div className="p-6 divide-y divide-border/50">
                  {blogPosts
                    .filter(p => p.id !== post.id && p.category === post.category)
                    .slice(0, 2)
                    .map(relatedPost => (
                      <div key={relatedPost.id} className="py-5 first:pt-0 last:pb-0">
                        <Link
                          to={`/blog/${relatedPost.id}`}
                          className="group"
                        >
                          <Badge variant="outline" className="bg-primary/5 text-primary/90 border-primary/20 font-medium mb-3">
                            {relatedPost.category}
                          </Badge>
                          <h3 className="font-bold mb-3 text-foreground group-hover:text-primary transition-colors text-lg">
                            {relatedPost.title}
                          </h3>
                          <p className="text-sm text-foreground/70 line-clamp-2 leading-relaxed mb-4">
                            {relatedPost.excerpt}
                          </p>
                          <div className="items-center text-sm text-primary font-medium bg-primary/5 px-4 py-2 rounded-full flex hover:bg-primary/10 transition-colors">
                            <span>Read full article</span>
                            <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                          </div>
                        </Link>
                      </div>
                    ))
                  }
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-4">
              <div className="lg:sticky lg:top-20 space-y-8">
                {/* Table of contents */}
                <div className="bg-card rounded-xl shadow-md overflow-hidden border border-border/30">
                  <div className="p-6 border-b border-border bg-muted/30">
                    <h3 className="text-lg font-bold text-foreground flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 text-primary">
                        <line x1="21" x2="3" y1="6" y2="6"></line>
                        <line x1="15" x2="3" y1="12" y2="12"></line>
                        <line x1="17" x2="3" y1="18" y2="18"></line>
                      </svg>
                      Table of Contents
                    </h3>
                  </div>
                  <div className="p-6">
                    <nav className="space-y-3">
                      {Array.from(post.content.props.children)
                        .filter(child => child.type === 'h2')
                        .map((heading, index) => (
                          <a
                            key={index}
                            href={`#${heading.props.children.toString().toLowerCase().replace(/\s+/g, '-')}`}
                            className={cn(
                              "py-3 px-4 text-sm rounded-md transition-colors flex items-center",
                              "text-foreground/80 hover:text-primary hover:bg-primary/5 border border-transparent hover:border-primary/10"
                            )}
                          >
                            <span className="w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold mr-3">
                              {index + 1}
                            </span>
                            <span className="font-medium">{heading.props.children}</span>
                          </a>
                        ))
                      }
                    </nav>
                  </div>
                </div>

                {/* Author info */}
                <div className="bg-gradient-to-br from-card to-muted/20 rounded-xl border border-border/30 p-6 shadow-sm">
                  <h3 className="text-lg font-bold mb-4 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 text-primary">
                      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                    About the Author
                  </h3>
                  <div className="flex items-center mb-6">
                    <Avatar className="h-14 w-14 border-2 border-primary/20 mr-4">
                      <AvatarFallback className="bg-primary/10 text-primary font-bold text-lg">TT</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-bold text-foreground">{post.author}</div>
                      <div className="text-sm text-primary/80 bg-primary/5 px-2 py-0.5 rounded-md inline-block mt-1">Content Writer</div>
                    </div>
                  </div>
                  <p className="text-sm text-foreground/80 mb-6 leading-relaxed">
                    Expert in academic writing and plagiarism prevention with over 5 years of experience in educational content creation.
                  </p>
                  <Button variant="outline" className="w-full rounded-lg bg-card hover:bg-primary/5 border-primary/20">
                    View Full Profile
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Back to top button */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 bg-primary text-primary-foreground p-3 rounded-full shadow-lg hover:bg-primary/90 transition-all duration-300 z-50"
          aria-label="Back to top"
        >
          <ChevronUp className="h-5 w-5" />
        </button>
      )}

      <Footer />
    </div>
  );
};

export default BlogPostPage;
