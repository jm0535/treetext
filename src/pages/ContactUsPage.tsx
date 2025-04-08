
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { MailIcon, MessageSquare, Phone, Users } from 'lucide-react';

const ContactUsPage: React.FC = () => {
  return (
    <div className="treeText-container py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Contact Us</h1>
          
          <p className="text-xl text-muted-foreground mb-8">
            Have questions, feedback, or need assistance? We're here to help. Choose the best way to reach us below.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Contact Form
                </CardTitle>
                <CardDescription>
                  Send us a message and we'll get back to you as soon as possible.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="firstName" className="text-sm font-medium">
                        First Name
                      </label>
                      <Input id="firstName" placeholder="Your first name" />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="lastName" className="text-sm font-medium">
                        Last Name
                      </label>
                      <Input id="lastName" placeholder="Your last name" />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium">
                      Email Address
                    </label>
                    <Input id="email" type="email" placeholder="your.email@example.com" />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="subject" className="text-sm font-medium">
                      Subject
                    </label>
                    <Input id="subject" placeholder="What is your message about?" />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="message" className="text-sm font-medium">
                      Message
                    </label>
                    <Textarea id="message" placeholder="Type your message here" rows={4} />
                  </div>
                </form>
              </CardContent>
              <CardFooter>
                <Button className="w-full">Send Message</Button>
              </CardFooter>
            </Card>
            
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MailIcon className="h-5 w-5" />
                    Email Us
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    For general inquiries, support requests, or feedback:
                  </p>
                  <a href="mailto:contact@treetext.app" className="text-primary font-medium">
                    contact@treetext.app
                  </a>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Community Support
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Join our community forums to get help from other users and our team:
                  </p>
                  <a href="#" className="text-primary font-medium">
                    treeText Community Forum
                  </a>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Phone className="h-5 w-5" />
                    Phone Support
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    For urgent matters, our phone support is available Monday to Friday, 9 AM - 5 PM (EST):
                  </p>
                  <a href="tel:+1-800-123-4567" className="text-primary font-medium">
                    +1-800-123-4567
                  </a>
                </CardContent>
              </Card>
            </div>
          </div>
          
          <section>
            <h2 className="text-2xl font-semibold mb-6">Frequently Asked Questions</h2>
            
            <div className="space-y-4">
              <div className="border p-6 rounded">
                <h3 className="text-xl font-medium mb-2">How quickly do you respond to inquiries?</h3>
                <p className="text-muted-foreground">
                  We typically respond to all inquiries within 24-48 hours during business days. For urgent matters,
                  please use our phone support line.
                </p>
              </div>
              
              <div className="border p-6 rounded">
                <h3 className="text-xl font-medium mb-2">I found a bug in the application. How do I report it?</h3>
                <p className="text-muted-foreground">
                  You can report bugs through our contact form or, preferably, by opening an issue on our GitHub repository
                  with details about the bug and steps to reproduce it.
                </p>
              </div>
              
              <div className="border p-6 rounded">
                <h3 className="text-xl font-medium mb-2">Do you offer technical support for API integration?</h3>
                <p className="text-muted-foreground">
                  Yes, we provide technical support for API integration. Please contact us with details about your
                  integration needs, and our development team will assist you.
                </p>
              </div>
              
              <div className="border p-6 rounded">
                <h3 className="text-xl font-medium mb-2">I'm interested in contributing to treeText. Who should I contact?</h3>
                <p className="text-muted-foreground">
                  We welcome contributions! Please visit our "Contribute" page for information on how to get started,
                  or contact our development team directly at dev@treetext.app.
                </p>
              </div>
            </div>
          </section>
        </div>
    </div>
  );
};

export default ContactUsPage;
