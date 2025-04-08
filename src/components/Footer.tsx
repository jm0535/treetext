
import React from 'react';
import { 
  FileText, 
  Github, 
  Heart, 
  Twitter, 
  Linkedin, 
  Mail, 
  ArrowRight, 
  ExternalLink
} from "lucide-react";
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const Footer: React.FC = () => {

  return (
    <footer className="border-t bg-muted/30 mt-24 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden opacity-10">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-secondary/20 rounded-full blur-3xl" />
      </div>
      
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-12 md:py-16 relative z-10">

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12">
          {/* Brand Column */}
          <div className="md:col-span-4 lg:col-span-5">
            <Link 
              to="/" 
              className="inline-flex items-center gap-1.5 mb-4 group relative"
              aria-label="TreeText Home"
            >
              <div className="absolute -inset-1 rounded-full bg-primary/10 scale-0 group-hover:scale-100 transition-transform duration-300" />
              <FileText className="h-6 w-6 text-primary relative" />
              <span className="font-bold text-xl relative">
                <span className="text-primary">tree</span>
                <span className="text-secondary">Text</span>
              </span>
            </Link>
            <p className="text-muted-foreground text-sm mb-6 max-w-md">
              TreeText is a free, open-source platform that helps students and professionals check their writing for plagiarism, 
              grammar issues, and readability. Our mission is to make high-quality writing tools accessible to everyone.
            </p>
            <div className="flex items-center gap-4 mb-6">
              <a 
                href="https://github.com/jm0535/treetext" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-muted-foreground hover:text-foreground transition-colors hover:scale-110 duration-200"
                aria-label="GitHub"
              >
                <Github className="h-5 w-5" />
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-muted-foreground hover:text-foreground transition-colors hover:scale-110 duration-200"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-muted-foreground hover:text-foreground transition-colors hover:scale-110 duration-200"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              <a 
                href="mailto:info@treetext.com" 
                className="text-muted-foreground hover:text-foreground transition-colors hover:scale-110 duration-200"
                aria-label="Email"
              >
                <Mail className="h-5 w-5" />
              </a>
            </div>
            <div className="flex items-center gap-1.5">
              <Heart className="h-4 w-4 text-red-500 animate-pulse" />
              <span className="text-sm text-muted-foreground">
                Made with love for students everywhere
              </span>
            </div>
          </div>
          
          {/* Links Columns */}
          <div className="md:col-span-8 lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-8">
            <div>
              <h3 className="font-medium text-base mb-4 text-foreground">Features</h3>
              <ul className="space-y-3">
                {[
                  { label: "Plagiarism Checker", path: "/" },
                  { label: "Grammar Checker", path: "/" },
                  { label: "Citation Generator", path: "/cite" },
                  { label: "Writing Resources", path: "/features" },
                  { label: "PDF Processing", path: "/features" },
                ].map((item, index) => (
                  <li key={index}>
                    <Link 
                      to={item.path} 
                      className="text-muted-foreground hover:text-foreground transition-colors text-sm inline-flex items-center group"
                    >
                      <span>{item.label}</span>
                      <ArrowRight className="ml-1.5 h-3 w-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h3 className="font-medium text-base mb-4 text-foreground border-b border-border/50 pb-2">Resources</h3>
              <ul className="space-y-3">
                {[
                  { label: "Help Center", path: "/help-center" },
                  { label: "API Documentation", path: "/api-documentation", external: true },
                  { label: "Blog", path: "/blog" },
                  { label: "Academic Resources", path: "/academic-resources" },
                  { label: "User Guides", path: "/user-guides" },
                ].map((item, index) => (
                  <li key={index}>
                    {item.external ? (
                      <a 
                        href={item.path} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-foreground transition-all duration-300 text-sm inline-flex items-center group hover:translate-x-1"
                      >
                        <span>{item.label}</span>
                        <ExternalLink className="ml-1.5 h-3 w-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-primary" />
                      </a>
                    ) : (
                      <Link 
                        to={item.path} 
                        className="text-muted-foreground hover:text-foreground transition-all duration-300 text-sm inline-flex items-center group hover:translate-x-1"
                      >
                        <span>{item.label}</span>
                        <ArrowRight className="ml-1.5 h-3 w-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-primary" />
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h3 className="font-medium text-base mb-4 text-foreground border-b border-border/50 pb-2">Company</h3>
              <ul className="space-y-3">
                {[
                  { label: "About Us", path: "/about" },
                  { label: "Our Mission", path: "/our-mission" },
                  { label: "Open Source", path: "/open-source" },
                  { label: "Contribute", path: "/contribute" },
                  { label: "Contact Us", path: "/contact-us" },
                ].map((item, index) => (
                  <li key={index}>
                    <Link 
                      to={item.path} 
                      className="text-muted-foreground hover:text-foreground transition-all duration-300 text-sm inline-flex items-center group hover:translate-x-1"
                    >
                      <span>{item.label}</span>
                      <ArrowRight className="ml-1.5 h-3 w-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-primary" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        
        {/* Copyright Section */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-16 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground"
        >
          <p className="flex items-center">
            © {new Date().getFullYear()} TreeText. All rights reserved. 
          </p>
          <div className="mt-4 md:mt-0 flex items-center gap-6">
            <Link to="/privacy-policy" className="text-muted-foreground transition-all duration-300 hover:text-primary">Privacy Policy</Link>
            <Link to="/terms-of-service" className="text-muted-foreground transition-all duration-300 hover:text-primary">Terms of Service</Link>
            <Link to="/cookies" className="text-muted-foreground transition-all duration-300 hover:text-primary">Cookie Policy</Link>
            <Link to="/sitemap" className="text-muted-foreground transition-all duration-300 hover:text-primary">Sitemap</Link>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
