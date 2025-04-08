import { ReactNode } from 'react';
import post1 from './post1';
import post2 from './post2';
import post3 from './post3';
import post4 from './post4';
import post5 from './post5';

export interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  date: string;
  author: string;
  readTime: string;
  category: string;
  lastUpdated?: string;
  content: ReactNode;
}

export const blogPosts: BlogPost[] = [
  post1,
  post2,
  post3,
  post4,
  post5
];

export default blogPosts;
