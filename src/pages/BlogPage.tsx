import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { blogPosts } from '@/data/blog';
import { ChevronRight, Clock, Calendar, Search, BookOpen, Tag, TrendingUp, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

const BlogPage: React.FC = () => {
  // State for active category filter
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  // Get unique categories for filter buttons
  const categories = [...new Set(blogPosts.map(post => post.category))];

  // Filter posts based on active category
  const filteredPosts = activeCategory
    ? blogPosts.filter(post => post.category === activeCategory)
    : blogPosts;

  return (
    <div className="bg-background relative">
      {/* Background gradient header */}
      <div className="bg-gradient-to-b from-primary/5 to-transparent h-64 absolute top-0 left-0 right-0 z-0"></div>
      <div className="py-16 px-4 sm:px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          {/* Header section */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Badge variant="outline" className="mb-4 px-3 py-1 bg-primary/5 text-primary border-primary/20">
              <BookOpen className="h-3.5 w-3.5 mr-1.5" />
              Knowledge Base
            </Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 text-foreground tracking-tight">
              treeText Blog
            </h1>
            <p className="text-lg md:text-xl text-foreground/80 mb-8 leading-relaxed max-w-2xl mx-auto">
              Insights, tips, and resources on academic writing, plagiarism prevention, and grammar improvement
            </p>

            {/* Search and filter */}
            <div className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto">
              <div className="relative flex-grow">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-primary/70" />
                <Input
                  placeholder="Search articles..."
                  className="pl-12 py-6 bg-card border-border/50 focus:border-primary/30 rounded-xl shadow-sm"
                />
              </div>
              <Button
                variant="outline"
                className="bg-card border-border/50 hover:bg-primary/5 hover:border-primary/30 rounded-xl shadow-sm py-6 px-6"
              >
                <Filter className="h-4 w-4 mr-2 text-primary/70" />
                Filter
              </Button>
            </div>
          </div>

          {/* Category filters */}
          <div className="flex flex-wrap gap-3 mb-12 justify-center">
            <Button
              variant="outline"
              className={cn(
                "rounded-full px-5 py-2 border-2 transition-all duration-200",
                activeCategory === null
                  ? "bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 font-medium"
                  : "hover:bg-muted/80 hover:border-border/80"
              )}
              onClick={() => setActiveCategory(null)}
            >
              <Tag className="h-3.5 w-3.5 mr-2" />
              All Posts
            </Button>
            {categories.map((category, index) => (
              <Button
                key={index}
                variant="outline"
                className={cn(
                  "rounded-full px-5 py-2 border-2 transition-all duration-200",
                  activeCategory === category
                    ? "bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 font-medium"
                    : "hover:bg-muted/80 hover:border-border/80"
                )}
                onClick={() => setActiveCategory(category)}
              >
                <Tag className="h-3.5 w-3.5 mr-2" />
                {category}
              </Button>
            ))}
          </div>

          {/* Featured post section heading */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-primary" />
              <h2 className="text-xl font-bold text-foreground">Featured Article</h2>
            </div>
            <Link to="/blog" className="text-sm text-primary font-medium hover:underline">View all articles</Link>
          </div>

          {/* Featured post */}
          <div className="mb-16">
            <div className="bg-card rounded-2xl shadow-lg overflow-hidden border border-border/30 hover:shadow-xl transition-shadow duration-300">
              <div className="grid grid-cols-1 md:grid-cols-2">
                <div className="p-8 md:p-10 flex flex-col justify-center">
                  <div className="mb-5">
                    <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 px-4 py-1.5 rounded-full text-sm font-medium">
                      {filteredPosts[0].category}
                    </Badge>
                  </div>
                  <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-5 text-foreground leading-tight">
                    {filteredPosts[0].title}
                  </h2>
                  <p className="text-foreground/80 mb-8 leading-relaxed">
                    {filteredPosts[0].excerpt}
                  </p>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center text-sm text-muted-foreground bg-muted/30 px-4 py-2 rounded-full">
                      <Calendar className="h-4 w-4 mr-2 text-primary/70" />
                      <span className="mr-4">{filteredPosts[0].date}</span>
                      <Clock className="h-4 w-4 mr-2 text-primary/70" />
                      <span>{filteredPosts[0].readTime}</span>
                    </div>
                    <Link
                      to={`/blog/${filteredPosts[0].id}`}
                      className="text-primary font-medium flex items-center group bg-primary/5 hover:bg-primary/10 px-5 py-2 rounded-full transition-colors"
                    >
                      Read full article
                      <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-primary/5 to-primary/10 p-10 hidden md:flex items-center justify-center">
                  <div className="w-full h-full bg-card rounded-xl shadow-inner flex items-center justify-center border border-primary/10">
                    <svg xmlns="http://www.w3.org/2000/svg" width="140" height="140" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-primary/40">
                      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Blog posts section heading */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center">
              <BookOpen className="h-5 w-5 mr-2 text-primary" />
              <h2 className="text-xl font-bold text-foreground">Latest Articles</h2>
            </div>
            {activeCategory && (
              <Button
                variant="ghost"
                className="text-sm text-muted-foreground hover:text-foreground"
                onClick={() => setActiveCategory(null)}
              >
                Clear filter
              </Button>
            )}
          </div>

          {/* Blog post grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {filteredPosts.slice(activeCategory ? 0 : 1).map(post => (
              <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-all duration-300 border-border/30 group">
                <div className="bg-gradient-to-br from-muted/30 to-muted/50 h-48 flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center z-10 transform group-hover:scale-110 transition-transform duration-300">
                    <span className="text-primary font-bold text-2xl">{post.category.charAt(0)}</span>
                  </div>
                </div>
                <CardHeader className="pb-2 pt-6">
                  <div className="flex justify-between items-center mb-3">
                    <Badge variant="outline" className="bg-primary/5 text-primary/90 border-primary/20 font-medium">
                      {post.category}
                    </Badge>
                    <div className="flex items-center text-xs text-muted-foreground bg-muted/30 px-2 py-1 rounded-full">
                      <Calendar className="h-3 w-3 mr-1 text-primary/60" />
                      <span>{post.date}</span>
                    </div>
                  </div>
                  <CardTitle className="text-xl font-bold group-hover:text-primary transition-colors">
                    <Link to={`/blog/${post.id}`}>{post.title}</Link>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pb-6">
                  <p className="text-foreground/70 text-sm line-clamp-3 leading-relaxed">{post.excerpt}</p>
                </CardContent>
                <CardFooter className="flex justify-between border-t pt-4 pb-4">
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Clock className="h-3 w-3 mr-1 text-primary/60" />
                    <span>{post.readTime}</span>
                  </div>
                  <Link
                    to={`/blog/${post.id}`}
                    className="text-primary text-sm font-medium flex items-center group/link"
                  >
                    Read full article
                    <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover/link:translate-x-1" />
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center mb-16">
            <div className="flex gap-3 items-center bg-card px-6 py-3 rounded-full shadow-sm border border-border/30">
              <Button variant="outline" size="sm" className="rounded-full w-10 h-10 p-0 bg-primary/10 text-primary border-primary/20 shadow-sm">
                1
              </Button>
              <Button variant="outline" size="sm" className="rounded-full w-10 h-10 p-0 hover:bg-muted shadow-sm">
                2
              </Button>
              <span className="px-2 text-muted-foreground">...</span>
              <Button variant="outline" size="sm" className="rounded-full hover:bg-primary/5 flex items-center gap-1 px-5 shadow-sm">
                <span>Next</span>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Newsletter signup */}
          <div className="mt-16 bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 rounded-2xl shadow-lg overflow-hidden border border-primary/20">
            <div className="p-10 md:p-12 text-center">
              <Badge variant="outline" className="mb-4 px-3 py-1 bg-primary/10 text-primary border-primary/30 mx-auto">
                Newsletter
              </Badge>
              <h2 className="text-2xl md:text-3xl font-bold mb-4 text-foreground">Stay updated with our latest articles</h2>
              <p className="text-foreground/80 mb-8 max-w-2xl mx-auto leading-relaxed">
                Subscribe to our newsletter to receive updates on new articles, tips, and resources for academic writing and plagiarism prevention.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <Input
                  placeholder="Your email address"
                  className="py-6 rounded-xl border-primary/20 bg-card/80 backdrop-blur-sm focus:border-primary/40 shadow-sm"
                />
                <Button className="bg-primary hover:bg-primary/90 py-6 rounded-xl shadow-md">
                  Subscribe
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogPage;
