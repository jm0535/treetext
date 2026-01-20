
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { AlertCircle, FileText, Upload, FileUp, Clipboard, Check } from "lucide-react";
import { checkText } from "@/utils/textAnalysis";
import { toast } from "@/hooks/use-toast";

const TextEditor: React.FC = () => {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [hasChecked, setHasChecked] = useState(false);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    if (hasChecked) {
      setHasChecked(false);
    }
  };

  const handleCheck = () => {
    if (text.trim().length < 50) {
      toast({
        title: "Text too short",
        description: "Please enter at least 50 characters to check.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    // Simulate analysis delay
    setTimeout(() => {
      checkText(text);
      setLoading(false);
      setHasChecked(true);
      toast({
        title: "Analysis complete",
        description: "Your text has been checked for plagiarism and grammar issues.",
      });
    }, 3000);
  };

  const handlePaste = async () => {
    try {
      const clipboardText = await navigator.clipboard.readText();
      setText(clipboardText);
      toast({
        title: "Text pasted",
        description: "Text has been pasted from clipboard.",
      });
    } catch (err) {
      toast({
        title: "Permission denied",
        description: "Please grant clipboard access to use this feature.",
        variant: "destructive",
      });
    }
  };

  return (
    <section className="py-8 md:py-12">
      <div className="kopitree-container">
        <Card className="shadow-lg border-muted">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-kopitree-blue" />
              <span>Text Checker</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="input" className="w-full">
              <TabsList className="grid grid-cols-2 w-full max-w-md mb-4">
                <TabsTrigger value="input">Input Text</TabsTrigger>
                <TabsTrigger value="upload">Upload File</TabsTrigger>
              </TabsList>

              <TabsContent value="input" className="space-y-4">
                <div className="flex items-center justify-end gap-2 mb-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                    onClick={handlePaste}
                  >
                    <Clipboard className="h-4 w-4" />
                    Paste
                  </Button>
                </div>

                <Textarea
                  id="text-input"
                  name="text-input"
                  autoComplete="off"
                  placeholder="Enter or paste your text here to check for plagiarism and grammar issues..."
                  className="min-h-[300px] text-base p-4"
                  value={text}
                  onChange={handleTextChange}
                />

                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    <span>
                      {text.length > 0
                        ? `${text.length} characters, ~${Math.ceil(text.length / 6)} words`
                        : "Enter text to analyze"}
                    </span>
                  </div>
                  <span>Recommended: 300+ words for best results</span>
                </div>
              </TabsContent>

              <TabsContent value="upload" className="min-h-[400px]">
                <div className="h-80 border-2 border-dashed border-muted rounded-lg flex flex-col items-center justify-center p-6">
                  <FileUp className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">Upload a document</h3>
                  <p className="text-muted-foreground text-center mb-6">
                    Drag and drop a file here, or click to select a file
                  </p>
                  <Button>
                    <Upload className="h-4 w-4 mr-2" />
                    Select File
                  </Button>
                  <p className="text-xs text-muted-foreground mt-4">
                    Supported formats: .txt, .doc, .docx, .pdf (Max size: 10MB)
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button
              className="bg-kopitree-blue hover:bg-kopitree-blue/90 px-8"
              disabled={text.trim().length < 50 || loading}
              onClick={handleCheck}
            >
              {loading ? (
                <>
                  <div className="h-4 w-4 border-2 border-t-transparent border-white rounded-full animate-spin mr-2"></div>
                  Analyzing...
                </>
              ) : hasChecked ? (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  View Results
                </>
              ) : (
                "Check Text"
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </section>
  );
};

export default TextEditor;
