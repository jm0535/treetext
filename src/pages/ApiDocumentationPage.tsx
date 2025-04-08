
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';

const ApiDocumentationPage: React.FC = () => {
  return (
    <div className="treeText-container py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">API Documentation</h1>
          
          <p className="text-muted-foreground mb-8">
            Integrate treeText's powerful plagiarism and grammar checking capabilities into your own applications
            with our easy-to-use API. Below you'll find everything you need to get started.
          </p>
          
          <Tabs defaultValue="overview">
            <TabsList className="mb-6">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="authentication">Authentication</TabsTrigger>
              <TabsTrigger value="endpoints">Endpoints</TabsTrigger>
              <TabsTrigger value="examples">Examples</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview">
              <Card>
                <CardContent className="pt-6">
                  <h2 className="text-xl font-semibold mb-4">API Overview</h2>
                  <p className="text-muted-foreground mb-4">
                    The treeText API allows you to programmatically access our text analysis tools, including:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4 mb-4">
                    <li>Plagiarism detection</li>
                    <li>Grammar and spelling checks</li>
                    <li>Citation generation</li>
                    <li>Text statistics</li>
                  </ul>
                  <p className="text-muted-foreground">
                    Our API uses standard REST principles and returns data in JSON format. All API requests 
                    must be made over HTTPS, and all responses will include appropriate status codes.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="authentication">
              <Card>
                <CardContent className="pt-6">
                  <h2 className="text-xl font-semibold mb-4">Authentication</h2>
                  <p className="text-muted-foreground mb-4">
                    To use the treeText API, you'll need an API key. Once registered, include your API key in all requests.
                  </p>
                  <div className="bg-muted p-4 rounded-md font-mono text-sm mb-4">
                    Authorization: Bearer YOUR_API_KEY
                  </div>
                  <p className="text-muted-foreground">
                    Keep your API key secure. Do not expose it in client-side code or public repositories.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="endpoints">
              <Card>
                <CardContent className="pt-6">
                  <h2 className="text-xl font-semibold mb-4">API Endpoints</h2>
                  
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium mb-2">POST /api/v1/analyze</h3>
                      <p className="text-muted-foreground mb-2">
                        Analyzes text for plagiarism and grammar issues
                      </p>
                      <div className="bg-muted p-4 rounded-md font-mono text-sm">
                        {`{
  "text": "Your text to analyze",
  "checks": ["plagiarism", "grammar"],
  "language": "en-US" // Optional, defaults to en-US
}`}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium mb-2">POST /api/v1/citations</h3>
                      <p className="text-muted-foreground mb-2">
                        Generates citations in different formats
                      </p>
                      <div className="bg-muted p-4 rounded-md font-mono text-sm">
                        {`{
  "title": "Article Title",
  "authors": ["Author Name"],
  "date": "2025-04-03",
  "url": "https://example.com/article",
  "format": "apa" // Supported: apa, mla, chicago, harvard
}`}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="examples">
              <Card>
                <CardContent className="pt-6">
                  <h2 className="text-xl font-semibold mb-4">Example Requests</h2>
                  
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium mb-2">JavaScript Example</h3>
                      <div className="bg-muted p-4 rounded-md font-mono text-sm">
                        {`fetch('https://api.treetext.app/v1/analyze', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_API_KEY'
  },
  body: JSON.stringify({
    text: 'Text to analyze for plagiarism and grammar.',
    checks: ['plagiarism', 'grammar']
  })
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error('Error:', error));`}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium mb-2">Python Example</h3>
                      <div className="bg-muted p-4 rounded-md font-mono text-sm">
                        {`import requests

url = "https://api.treetext.app/v1/analyze"
headers = {
    "Content-Type": "application/json",
    "Authorization": "Bearer YOUR_API_KEY"
}
payload = {
    "text": "Text to analyze for plagiarism and grammar.",
    "checks": ["plagiarism", "grammar"]
}

response = requests.post(url, json=payload, headers=headers)
data = response.json()
print(data)`}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
    </div>
  );
};

export default ApiDocumentationPage;
