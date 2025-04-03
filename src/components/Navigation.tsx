
import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { 
  FileText, 
  BarChart2, 
  Search, 
  BookOpen, 
  HelpCircle, 
  Moon, 
  Sun, 
  Info, 
  Quote, 
  Menu, 
  X, 
  ChevronDown,
  ExternalLink 
} from "lucide-react";
import { useTheme } from './ThemeProvider';
import { Toggle } from "@/components/ui/toggle";
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuGroup,
  DropdownMenuLabel
} from "@/components/ui/dropdown-menu";

const Navigation: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const lastScrollY = useRef(0);
  
  // Track scroll position to add shadow when scrolled and hide on scroll down
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsScrolled(currentScrollY > 10);
      
      // Add smooth scroll-linked animations
      const header = document.querySelector('header');
      if (header) {
        if (currentScrollY > lastScrollY.current && currentScrollY > 80) {
          // Scrolling down - slightly hide the header
          header.style.transform = 'translateY(-8px)';
        } else {
          // Scrolling up - show the header
          header.style.transform = 'translateY(0)';
        }
      }
      
      lastScrollY.current = currentScrollY;
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const handleSignIn = () => {
    // In a real app, this would navigate to a sign-in page or open a sign-in modal
    console.log('Sign in button clicked');
    // For now, show a toast notification
    alert('Sign in functionality would be implemented here');
  };

  const handleGetStarted = () => {
    // Scroll to text editor on home page
    if (window.location.pathname === '/') {
      const textEditor = document.querySelector('#text-editor');
      if (textEditor) {
        textEditor.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      // Navigate to home and then scroll
      navigate('/');
      // Need to wait for navigation to complete before scrolling
      setTimeout(() => {
        const textEditor = document.querySelector('#text-editor');
        if (textEditor) {
          textEditor.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
    
    // Close mobile menu if open
    setMobileMenuOpen(false);
  };

  return (
    <header className={cn(
      "sticky top-0 z-50 bg-background/95 backdrop-blur-sm transition-all duration-300",
      isScrolled ? "shadow-md" : "border-b border-border"
    )}>
      <div className="container py-3 px-4 mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link 
          to="/" 
          className="flex items-center gap-1.5 relative group"
          aria-label="TreeText Home"
        >
          <div className="absolute -inset-1 rounded-full bg-primary/10 scale-0 group-hover:scale-100 transition-transform duration-300" />
          <FileText className="h-6 w-6 text-primary relative transition-transform group-hover:scale-110 duration-300" />
          <span className="font-bold text-xl relative">
            <span className="text-primary group-hover:text-primary/90 transition-colors duration-300">tree</span>
            <span className="text-secondary group-hover:text-secondary/90 transition-colors duration-300">Text</span>
          </span>
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1.5 ml-8">
          <Button 
            variant="ghost" 
            size="sm" 
            className={cn(
              "font-medium transition-all duration-300 hover:bg-muted/80 relative overflow-hidden group",
              location.pathname === "/" && "bg-muted"
            )} 
            asChild
          >
            <Link to="/">
              <span className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              <FileText className="h-4 w-4 mr-2 transition-transform group-hover:scale-110 duration-300" />
              <span className="relative">Check Text</span>
            </Link>
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className={cn(
              "font-medium transition-all duration-300 hover:bg-muted/80 relative overflow-hidden group",
              location.pathname === "/features" && "bg-muted"
            )} 
            asChild
          >
            <Link to="/features">
              <span className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              <BarChart2 className="h-4 w-4 mr-2 transition-transform group-hover:scale-110 duration-300" />
              <span className="relative">Features</span>
            </Link>
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className={cn(
              "font-medium transition-colors",
              location.pathname === "/about" && "bg-muted"
            )} 
            asChild
          >
            <Link to="/about">
              <Info className="h-4 w-4 mr-2" />
              About
            </Link>
          </Button>
          
          {/* Resources Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className="font-medium transition-colors flex items-center"
              >
                <BookOpen className="h-4 w-4 mr-2" />
                Resources
                <ChevronDown className="h-3 w-3 ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="center" className="w-48">
              <DropdownMenuItem asChild>
                <Link to="/cite" className="flex items-center">
                  <Quote className="h-4 w-4 mr-2" />
                  Citation Tools
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/help-center" className="flex items-center">
                  <HelpCircle className="h-4 w-4 mr-2" />
                  Help Center
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/blog" className="flex items-center">
                  <FileText className="h-4 w-4 mr-2" />
                  Blog
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>
        
        {/* Right Side Actions */}
        <div className="flex items-center gap-3">
          {/* Theme Toggle */}
          <Toggle
            aria-label="Toggle theme"
            pressed={theme === 'dark'}
            onPressedChange={toggleTheme}
            className="p-2 rounded-full hover:bg-muted transition-colors"
          >
            {theme === 'dark' ? 
              <Sun className="h-4 w-4 transition-transform duration-300 rotate-0" /> : 
              <Moon className="h-4 w-4 transition-transform duration-300 rotate-0" />
            }
          </Toggle>
          
          {/* Desktop Buttons */}
          <div className="hidden md:flex items-center gap-3 ml-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleSignIn}
              className="font-medium transition-all duration-300 hover:shadow-sm relative overflow-hidden group"
            >
              <span className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              <span className="relative z-10">Sign In</span>
            </Button>
            <Button 
              size="sm" 
              className="bg-primary hover:bg-primary/90 font-medium transition-all duration-300 hover:shadow-md relative overflow-hidden group" 
              onClick={handleGetStarted}
            >
              <span className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              <span className="relative z-10">Get Started</span>
            </Button>
          </div>
          
          {/* Mobile Menu Button */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden relative overflow-hidden group" 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            <span className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
            {mobileMenuOpen ? 
              <X className="h-5 w-5 transition-all duration-300 rotate-90 group-hover:rotate-0" /> : 
              <Menu className="h-5 w-5 transition-all duration-300 group-hover:scale-110" />
            }
          </Button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      <div className={cn(
        "md:hidden overflow-hidden transition-all duration-500 ease-in-out border-t border-border",
        mobileMenuOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
      )}>
        <div className="container px-4 py-4 flex flex-col space-y-3">
          <Button 
            variant="ghost" 
            size="sm" 
            className={cn(
              "font-medium justify-start transition-all duration-300 hover:translate-x-1",
              location.pathname === "/" && "bg-muted"
            )} 
            asChild
          >
            <Link to="/">
              <FileText className="h-4 w-4 mr-2 text-primary" />
              Check Text
            </Link>
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className={cn(
              "font-medium justify-start transition-all duration-300 hover:translate-x-1",
              location.pathname === "/features" && "bg-muted"
            )} 
            asChild
          >
            <Link to="/features">
              <BarChart2 className="h-4 w-4 mr-2 text-primary" />
              Features
            </Link>
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className={cn(
              "font-medium justify-start transition-all duration-300 hover:translate-x-1",
              location.pathname === "/about" && "bg-muted"
            )} 
            asChild
          >
            <Link to="/about">
              <Info className="h-4 w-4 mr-2 text-primary" />
              About
            </Link>
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className={cn(
              "font-medium justify-start transition-all duration-300 hover:translate-x-1",
              location.pathname === "/cite" && "bg-muted"
            )} 
            asChild
          >
            <Link to="/cite">
              <Quote className="h-4 w-4 mr-2 text-primary" />
              Citation Tools
            </Link>
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className={cn(
              "font-medium justify-start transition-all duration-300 hover:translate-x-1",
              location.pathname === "/help-center" && "bg-muted"
            )} 
            asChild
          >
            <Link to="/help-center">
              <HelpCircle className="h-4 w-4 mr-2 text-primary" />
              Help Center
            </Link>
          </Button>
          
          <div className="pt-4 mt-2 flex flex-col space-y-3 border-t border-border">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Switch theme</span>
              <Toggle
                variant="outline"
                size="sm"
                pressed={theme === 'dark'}
                onPressedChange={() => toggleTheme()}
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? 
                  <Moon className="h-4 w-4 transition-all duration-500 animate-in fade-in rotate-in" /> : 
                  <Sun className="h-4 w-4 transition-all duration-500 animate-in fade-in rotate-in" />
                }
              </Toggle>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleSignIn}
              className="font-medium w-full justify-center transition-all duration-300 hover:shadow-sm group"
            >
              <span className="group-hover:translate-x-0.5 transition-transform duration-300">Sign In</span>
            </Button>
            <Button 
              size="sm" 
              className="bg-primary hover:bg-primary/90 font-medium w-full justify-center transition-all duration-300 hover:shadow-md group" 
              onClick={handleGetStarted}
            >
              <span className="group-hover:translate-x-0.5 transition-transform duration-300">Get Started</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navigation;
