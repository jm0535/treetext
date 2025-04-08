import React from 'react';
import { BlogPost } from './index';

const post4: BlogPost = {
  id: 4,
  title: 'How to Properly Cite Sources in Different Citation Styles',
  excerpt: 'A detailed comparison of APA, MLA, Chicago, and Harvard citation styles with examples for various source types.',
  date: 'February 28, 2023',
  author: 'treeText Team',
  readTime: '12 min read',
  category: 'Citation Guides',
  content: (
    <>
      <p className="lead text-xl text-foreground/90 mb-8 font-medium border-l-4 border-primary/70 pl-4 py-2">
        Proper citation is a fundamental aspect of academic writing. This guide explores the major citation styles 
        and provides examples to help you correctly attribute sources in your work.
      </p>
      
      <h2>Why Proper Citation Matters</h2>
      <p>
        Citing sources correctly serves several important purposes:
      </p>
      <ul>
        <li>Gives credit to original authors for their work and ideas</li>
        <li>Helps readers locate your sources for further reading</li>
        <li>Demonstrates the research foundation of your arguments</li>
        <li>Avoids plagiarism and maintains academic integrity</li>
        <li>Shows your familiarity with the academic conversation in your field</li>
      </ul>
      
      <h2>Major Citation Styles</h2>
      
      <h3>APA Style (American Psychological Association)</h3>
      <p>
        <strong>Common in:</strong> Social sciences, education, psychology, and business
      </p>
      <p>
        <strong>In-text citation format:</strong> (Author, Year, p. X)
      </p>
      <p>
        <strong>Example:</strong> Research indicates that regular exercise improves cognitive function (Johnson, 2020, p. 45).
      </p>
      <p>
        <strong>Reference list entry for a book:</strong><br />
        Author, A. A. (Year). <em>Title of book</em>. Publisher.
      </p>
      <p>
        <strong>Example:</strong><br />
        Johnson, M. (2020). <em>The cognitive benefits of physical activity</em>. Academic Press.
      </p>
      
      <h3>MLA Style (Modern Language Association)</h3>
      <p>
        <strong>Common in:</strong> Humanities, especially language and literature
      </p>
      <p>
        <strong>In-text citation format:</strong> (Author Page)
      </p>
      <p>
        <strong>Example:</strong> Shakespeare explores the theme of ambition throughout the play (Smith 42).
      </p>
      <p>
        <strong>Works Cited entry for a book:</strong><br />
        Author. <em>Title of Book</em>. Publisher, Year.
      </p>
      <p>
        <strong>Example:</strong><br />
        Smith, John. <em>Themes in Shakespeare's Tragedies</em>. Oxford University Press, 2019.
      </p>
      
      <h3>Chicago Style</h3>
      <p>
        <strong>Common in:</strong> History, arts, and some humanities
      </p>
      <p>
        Chicago offers two documentation systems:
      </p>
      <ol>
        <li><strong>Notes-Bibliography:</strong> Uses footnotes/endnotes with a bibliography</li>
        <li><strong>Author-Date:</strong> Similar to APA with in-text citations and a reference list</li>
      </ol>
      
      <p>
        <strong>Notes-Bibliography example (footnote):</strong><br />
        1. Robert Johnson, <em>American History: A New Perspective</em> (New York: Historical Press, 2018), 156.
      </p>
      <p>
        <strong>Bibliography entry:</strong><br />
        Johnson, Robert. <em>American History: A New Perspective</em>. New York: Historical Press, 2018.
      </p>
      
      <h3>Harvard Style</h3>
      <p>
        <strong>Common in:</strong> Universities in the UK, Australia, and other countries across various disciplines
      </p>
      <p>
        <strong>In-text citation format:</strong> (Author, Year, p. X)
      </p>
      <p>
        <strong>Example:</strong> Recent studies show significant climate changes in polar regions (Thompson, 2021, p. 78).
      </p>
      <p>
        <strong>Reference list entry for a book:</strong><br />
        Author, Initials. (Year) <em>Title of book</em>. Place of publication: Publisher.
      </p>
      <p>
        <strong>Example:</strong><br />
        Thompson, J. (2021) <em>Climate Change in the 21st Century</em>. Cambridge: Science Press.
      </p>
      
      <h2>Citing Different Source Types</h2>
      
      <h3>Journal Articles</h3>
      <p>
        <strong>APA:</strong><br />
        Author, A. A., & Author, B. B. (Year). Title of article. <em>Journal Name, Volume</em>(Issue), page range. DOI or URL
      </p>
      <p>
        <strong>MLA:</strong><br />
        Author. "Title of Article." <em>Journal Name</em>, vol. X, no. X, Year, pp. XX-XX. DOI or URL.
      </p>
      
      <h3>Websites</h3>
      <p>
        <strong>APA:</strong><br />
        Author, A. A. (Year, Month Day). Title of page. Site Name. URL
      </p>
      <p>
        <strong>MLA:</strong><br />
        Author. "Title of Page." <em>Website Name</em>, Publisher (if different from website name), Date, URL.
      </p>
      
      <h3>Online Videos</h3>
      <p>
        <strong>APA:</strong><br />
        Author, A. A. [Username]. (Year, Month Day). Title of video [Video]. Platform. URL
      </p>
      <p>
        <strong>MLA:</strong><br />
        Username. "Title of Video." <em>Platform</em>, uploaded by Creator, Date, URL.
      </p>
      
      <h2>Citation Management Tools</h2>
      <p>
        Several tools can help you manage citations and format them correctly:
      </p>
      <ul>
        <li><strong>treeText:</strong> Offers citation generation in multiple formats</li>
        <li><strong>Zotero:</strong> Free, open-source reference management software</li>
        <li><strong>Mendeley:</strong> Reference manager with PDF annotation features</li>
        <li><strong>EndNote:</strong> Comprehensive reference management software</li>
      </ul>
      
      <h2>Common Citation Mistakes to Avoid</h2>
      <ul>
        <li>Inconsistent formatting within the same document</li>
        <li>Incomplete information (missing page numbers, publication dates, etc.)</li>
        <li>Incorrect punctuation in citations</li>
        <li>Citing the wrong source type (e.g., citing a website as a journal article)</li>
        <li>Forgetting to cite paraphrased information</li>
      </ul>
      
      <h2>Conclusion</h2>
      <p>
        Mastering citation styles takes practice, but it's an essential skill for academic and professional writing. 
        Always check the specific requirements for your institution or publication, as there may be slight variations 
        in how these styles are applied. When in doubt, consult the official style guides or use treeText's citation 
        tools to ensure accuracy.
      </p>
    </>
  )
};

export default post4;
