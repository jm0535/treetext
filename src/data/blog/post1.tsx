import React from 'react';
import { BlogPost } from './index';

const post1: BlogPost = {
  id: 1,
  title: 'How to Avoid Plagiarism in Academic Writing',
  excerpt: 'Learn the best practices for citing sources and avoiding unintentional plagiarism in your research papers.',
  date: 'May 15, 2023',
  author: 'treeText Team',
  readTime: '8 min read',
  category: 'Academic Writing',
  content: (
    <>
      <p className="lead text-xl text-foreground/90 mb-8 font-medium border-l-4 border-primary/70 pl-4 py-2">
        <strong>Plagiarism is a serious academic offense</strong> that can have severe consequences for students and researchers.
        Understanding how to properly attribute sources and incorporate others' ideas into your work is essential
        for maintaining academic integrity.
      </p>
      
      <h2 id="what-is-plagiarism">What is Plagiarism?</h2>
      <p>
        Plagiarism is the act of using someone else's words, ideas, or work without proper attribution. It can be 
        intentional or unintentional, but both forms are considered academic dishonesty. Types of plagiarism include:
      </p>
      
      <ul>
        <li><strong>Direct plagiarism:</strong> Copying text word-for-word without quotation marks or citation</li>
        <li><strong>Mosaic plagiarism:</strong> Borrowing phrases without quotation marks or paraphrasing without proper attribution</li>
        <li><strong>Self-plagiarism:</strong> Reusing your own previous work without acknowledgment</li>
        <li><strong>Accidental plagiarism:</strong> Forgetting to cite sources or incorrectly citing them</li>
      </ul>
      
      <h2 id="best-practices-for-avoiding-plagiarism">Best Practices for Avoiding Plagiarism</h2>
      
      <h3><span>1</span>Understand When to Cite</h3>
      <p>
        You should cite sources whenever you:
      </p>
      <ul>
        <li>Quote directly from a source</li>
        <li>Paraphrase or summarize someone else's ideas</li>
        <li>Use data, statistics, or figures from another source</li>
        <li>Present information that isn't common knowledge</li>
      </ul>
      
      <h3><span>2</span>Take Effective Notes</h3>
      <p>
        When researching, clearly distinguish between your own ideas and those from sources:
      </p>
      <ul>
        <li>Use different colored notes or highlighting for direct quotes</li>
        <li>Always record full citation information immediately</li>
        <li>Put quotation marks around exact wording in your notes</li>
        <li>Summarize in your own words, but still note the source</li>
      </ul>
      
      <h3><span>3</span>Learn to Paraphrase Properly</h3>
      <p>
        Paraphrasing means restating information in your own words while preserving the original meaning. 
        To paraphrase effectively:
      </p>
      <ul>
        <li>Read the original text and understand it thoroughly</li>
        <li>Set it aside and write your version without looking at the original</li>
        <li>Use your own vocabulary and sentence structure</li>
        <li>Check your version against the original to ensure accuracy</li>
        <li>Always cite the source even when paraphrasing</li>
      </ul>
      
      <h3><span>4</span>Use Plagiarism Detection Tools</h3>
      <p>
        Before submitting your work, run it through a plagiarism checker like treeText. These tools can help identify:
      </p>
      <ul>
        <li>Unintentional similarities to published sources</li>
        <li>Missing citations or quotation marks</li>
        <li>Passages that need better paraphrasing</li>
      </ul>
      
      <h2 id="the-importance-of-proper-citation">The Importance of Proper Citation</h2>
      <p>
        Citations serve multiple important purposes in academic writing:
      </p>
      <ul>
        <li>They give credit to original authors and their work</li>
        <li>They allow readers to locate and verify your sources</li>
        <li>They demonstrate the research foundation of your work</li>
        <li>They place your ideas within the broader academic conversation</li>
      </ul>
      
      <h2 id="common-citation-styles">Common Citation Styles</h2>
      <p>
        Different disciplines use different citation styles. The most common include:
      </p>
      <ul>
        <li><strong>APA (American Psychological Association):</strong> Used in psychology, education, and social sciences</li>
        <li><strong>MLA (Modern Language Association):</strong> Used in humanities, especially language and literature</li>
        <li><strong>Chicago/Turabian:</strong> Used in history, arts, and some humanities</li>
        <li><strong>Harvard:</strong> Used in universities across various disciplines</li>
      </ul>
      
      <h2 id="conclusion">Conclusion</h2>
      <p>
        Avoiding plagiarism is not just about following rules—it's about respecting intellectual property and 
        contributing meaningfully to academic discourse. By developing good research habits, learning proper 
        citation techniques, and using tools like treeText to check your work, you can maintain academic integrity 
        while developing your own scholarly voice.
      </p>
    </>
  )
};

export default post1;
