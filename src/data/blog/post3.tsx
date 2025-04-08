import React from 'react';
import { BlogPost } from './index';

const post3: BlogPost = {
  id: 3,
  title: 'Top 10 Common Grammar Mistakes and How to Fix Them',
  excerpt: 'A comprehensive guide to the most frequent grammar errors made by writers and simple solutions to correct them.',
  date: 'March 10, 2023',
  author: 'treeText Team',
  readTime: '10 min read',
  category: 'Grammar Tips',
  content: (
    <>
      <p className="lead">
        Even experienced writers make grammar mistakes. Identifying and correcting these common errors can 
        significantly improve your writing quality and help you communicate more effectively.
      </p>
      
      <h2>1. Comma Splices</h2>
      <p>
        A comma splice occurs when you join two independent clauses with only a comma.
      </p>
      <p>
        <strong>Incorrect:</strong> She finished her assignment, she submitted it early.<br />
        <strong>Correct:</strong> She finished her assignment, and she submitted it early.<br />
        <strong>Also correct:</strong> She finished her assignment. She submitted it early.<br />
        <strong>Also correct:</strong> She finished her assignment; she submitted it early.
      </p>
      
      <h2>2. Run-on Sentences</h2>
      <p>
        Run-on sentences occur when independent clauses are joined without proper punctuation or conjunctions.
      </p>
      <p>
        <strong>Incorrect:</strong> The meeting ran late everyone missed their train.<br />
        <strong>Correct:</strong> The meeting ran late, so everyone missed their train.<br />
        <strong>Also correct:</strong> The meeting ran late. Everyone missed their train.
      </p>
      
      <h2>3. Subject-Verb Agreement</h2>
      <p>
        The subject and verb in a sentence must agree in number (singular or plural).
      </p>
      <p>
        <strong>Incorrect:</strong> The group of students were discussing the assignment.<br />
        <strong>Correct:</strong> The group of students was discussing the assignment.
      </p>
      <p>
        <strong>Incorrect:</strong> Each of the participants have submitted their forms.<br />
        <strong>Correct:</strong> Each of the participants has submitted their forms.
      </p>
      
      <h2>4. Misplaced Modifiers</h2>
      <p>
        Modifiers should be placed close to the words they're modifying to avoid confusion.
      </p>
      <p>
        <strong>Incorrect:</strong> Walking through the forest, the trees looked beautiful.<br />
        <strong>Correct:</strong> Walking through the forest, I thought the trees looked beautiful.
      </p>
      
      <h2>5. Apostrophe Misuse</h2>
      <p>
        Apostrophes indicate possession or contraction, but they're often used incorrectly.
      </p>
      <p>
        <strong>Incorrect:</strong> The company celebrated it's anniversary.<br />
        <strong>Correct:</strong> The company celebrated its anniversary.
      </p>
      <p>
        <strong>Incorrect:</strong> The students grades have improved.<br />
        <strong>Correct:</strong> The students' grades have improved.
      </p>
      
      <h2>6. Pronoun-Antecedent Agreement</h2>
      <p>
        Pronouns must agree with their antecedents in number, gender, and person.
      </p>
      <p>
        <strong>Incorrect:</strong> Each student must bring their own materials.<br />
        <strong>Traditional correct:</strong> Each student must bring his or her own materials.<br />
        <strong>Modern acceptable:</strong> Each student must bring their own materials. (Singular "they" is increasingly accepted)
      </p>
      
      <h2>7. Dangling Participles</h2>
      <p>
        A participle should clearly refer to the subject of the sentence.
      </p>
      <p>
        <strong>Incorrect:</strong> Having finished the experiment, the results were recorded.<br />
        <strong>Correct:</strong> Having finished the experiment, the researcher recorded the results.
      </p>
      
      <h2>8. Incorrect Word Usage</h2>
      <p>
        Many words are commonly confused with others that sound or look similar.
      </p>
      <p>
        <strong>Incorrect:</strong> Your going to love this book.<br />
        <strong>Correct:</strong> You're going to love this book.
      </p>
      <p>
        <strong>Incorrect:</strong> The new policy will effect everyone.<br />
        <strong>Correct:</strong> The new policy will affect everyone.
      </p>
      
      <h2>9. Sentence Fragments</h2>
      <p>
        A complete sentence must contain a subject and a verb and express a complete thought.
      </p>
      <p>
        <strong>Incorrect:</strong> Because it was raining heavily.<br />
        <strong>Correct:</strong> Because it was raining heavily, we canceled the outdoor event.
      </p>
      
      <h2>10. Inconsistent Verb Tense</h2>
      <p>
        Maintain consistent verb tenses unless there's a logical reason to switch.
      </p>
      <p>
        <strong>Incorrect:</strong> She enters the room and took a seat.<br />
        <strong>Correct:</strong> She entered the room and took a seat.<br />
        <strong>Also correct:</strong> She enters the room and takes a seat.
      </p>
      
      <h2>Tools to Help You Avoid Grammar Mistakes</h2>
      <p>
        Several resources can help you identify and correct grammar errors:
      </p>
      <ul>
        <li><strong>Grammar checkers:</strong> Tools like treeText can automatically identify many common errors</li>
        <li><strong>Style guides:</strong> References like The Elements of Style provide clear grammar rules</li>
        <li><strong>Proofreading:</strong> Reading your work aloud can help you catch errors your eyes might miss</li>
        <li><strong>Peer review:</strong> Having someone else read your work can identify issues you've overlooked</li>
      </ul>
      
      <h2>Conclusion</h2>
      <p>
        Improving your grammar doesn't happen overnight, but being aware of these common mistakes is the first step. 
        Regular practice, careful proofreading, and using tools like treeText can help you develop stronger writing 
        skills over time. Remember that even professional writers make mistakes—the key is learning to identify and 
        correct them.
      </p>
    </>
  )
};

export default post3;
