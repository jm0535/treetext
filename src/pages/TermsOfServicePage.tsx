
import React from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

const TermsOfServicePage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-grow treeText-container py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
          
          <p className="text-muted-foreground mb-8">
            Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
          
          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
              <p className="text-muted-foreground">
                Welcome to treeText ("we," "our," or "us"). By accessing or using our website, services, or applications
                (collectively, the "Services"), you agree to be bound by these Terms of Service ("Terms"). 
                If you do not agree to these Terms, please do not use our Services.
              </p>
            </section>
            
            <section>
              <h2 className="text-2xl font-semibold mb-4">2. Use of Services</h2>
              <p className="text-muted-foreground mb-4">
                Our Services are designed to help users check for plagiarism, improve grammar, and generate citations.
                You may use our Services only for lawful purposes and in accordance with these Terms.
              </p>
              <p className="text-muted-foreground">
                You agree not to:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li>Use the Services in any way that violates applicable laws or regulations</li>
                <li>Circumvent, disable, or interfere with security features of the Services</li>
                <li>Use automated means to access or collect data from the Services</li>
                <li>Introduce malicious code or attack our servers</li>
                <li>Attempt to reverse engineer any part of the Services</li>
              </ul>
            </section>
            
            <section>
              <h2 className="text-2xl font-semibold mb-4">3. Intellectual Property</h2>
              <p className="text-muted-foreground mb-4">
                The Services and their content, features, and functionality are owned by treeText and are protected by
                copyright, trademark, and other intellectual property laws. Our software is open-source and is available
                under the MIT License.
              </p>
              <p className="text-muted-foreground">
                While using our Services, you retain ownership of any content you submit. By submitting content to our
                Services, you grant us a worldwide, non-exclusive license to use, store, and process that content solely
                for the purpose of providing and improving our Services.
              </p>
            </section>
            
            <section>
              <h2 className="text-2xl font-semibold mb-4">4. Privacy</h2>
              <p className="text-muted-foreground">
                Your privacy is important to us. Our Privacy Policy describes how we collect, use, and share information
                about you when you use our Services. By using our Services, you agree to the collection, use, and sharing
                of your information as described in our Privacy Policy.
              </p>
            </section>
            
            <section>
              <h2 className="text-2xl font-semibold mb-4">5. Disclaimer of Warranties</h2>
              <p className="text-muted-foreground">
                THE SERVICES ARE PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR
                IMPLIED. TO THE FULLEST EXTENT PERMITTED BY LAW, WE DISCLAIM ALL WARRANTIES, INCLUDING BUT NOT LIMITED TO
                WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
              </p>
            </section>
            
            <section>
              <h2 className="text-2xl font-semibold mb-4">6. Changes to Terms</h2>
              <p className="text-muted-foreground">
                We may revise these Terms from time to time. The most current version will always be posted on our website.
                If a revision is material, we will provide notice prior to the new terms taking effect. By continuing to
                access or use our Services after revisions become effective, you agree to be bound by the revised Terms.
              </p>
            </section>
            
            <section>
              <h2 className="text-2xl font-semibold mb-4">7. Contact Us</h2>
              <p className="text-muted-foreground">
                If you have any questions about these Terms, please contact us at legal@treetext.app.
              </p>
            </section>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default TermsOfServicePage;
