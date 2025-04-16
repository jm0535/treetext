import React, { useState } from "react";
import { useTextAnalysis } from "@/hooks/useTextAnalysis";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import {
  Settings,
  Check,
  Zap,
  BookOpen,
  Briefcase,
  Microscope,
  FileText,
  X,
  Save,
  AlertCircle,
  BookText,
  MessageSquareText,
  Brain,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AnalysisSettings as SettingsType,
  LanguageModelCategory,
  LanguageModelType,
} from "@/types";
import { LANGUAGE_MODEL_STRUCTURE } from "@/utils/constants";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface AnalysisSettingsProps {
  className?: string;
  onClose?: () => void;
}

const AnalysisSettings: React.FC<AnalysisSettingsProps> = ({
  className,
  onClose,
}) => {
  const { settings, updateSettings } = useTextAnalysis();
  const [activeTab, setActiveTab] = useState<string>("features");

  const handleToggleChange =
    (key: keyof SettingsType) => (checked: boolean) => {
      if (typeof settings[key] === "boolean") {
        updateSettings({ [key]: checked });
      }
    };

  const [selectedCategory, setSelectedCategory] =
    useState<LanguageModelCategory>(
      settings.languageModelCategory || "general",
    );

  const handleCategoryChange = (category: LanguageModelCategory) => {
    setSelectedCategory(category);

    // If no model is selected in this category, select the first one by default
    const categoryData = LANGUAGE_MODEL_STRUCTURE[category];
    if (categoryData) {
      const currentModelInCategory = categoryData.models.some(
        (model) => model.id === settings.languageModel,
      );

      if (!currentModelInCategory && categoryData.models.length > 0) {
        const defaultModel = categoryData.models[0].id;
        handleLanguageModelChange(defaultModel);
      }
    }
  };

  const handleLanguageModelChange = (value: string) => {
    // Find the category this model belongs to
    let category: LanguageModelCategory = "general";

    for (const [key, data] of Object.entries(LANGUAGE_MODEL_STRUCTURE)) {
      if (data.models.some((model) => model.id === value)) {
        category = key as LanguageModelCategory;
        break;
      }
    }

    // Update both the settings and the selected category state
    setSelectedCategory(category);
    updateSettings({
      languageModel: value as LanguageModelType,
      languageModelCategory: category,
    });
  };

  const handleAdaptiveAnalysisChange = (checked: boolean) => {
    updateSettings({
      adaptiveAnalysis: checked,
    });
  };

  const handleSaveSettings = () => {
    // Settings are already saved in real-time since they update on change
    // Just close the popover
    onClose && onClose();
  };

  // Get the icon for a category
  const getCategoryIcon = (category: LanguageModelCategory) => {
    switch (category) {
      case "academic":
        return <BookOpen className="h-4 w-4 text-blue-500" />;
      case "business":
        return <Briefcase className="h-4 w-4 text-amber-500" />;
      case "specialized":
        return <Microscope className="h-4 w-4 text-purple-500" />;
      case "general":
      default:
        return <FileText className="h-4 w-4 text-green-500" />;
    }
  };

  return (
    <Card
      className={`${className} shadow-lg border border-primary/10 flex flex-col max-h-[85vh] overflow-hidden`}
    >
      <CardHeader className="pb-3 border-b bg-gradient-to-r from-primary/5 to-primary/10">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl flex items-center">
              <Settings className="mr-2 h-5 w-5 text-primary" />
              Analysis Settings
            </CardTitle>
            <CardDescription className="mt-1 text-sm">
              Configure how your text will be analyzed
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <Tabs defaultValue="features" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="px-6 pt-3 border-b">
          <TabsList className="grid w-full grid-cols-3 mb-1">
            <TabsTrigger value="features" className="flex items-center justify-center">
              <Check className="h-4 w-4 mr-1.5" />
              <span>Features</span>
            </TabsTrigger>
            <TabsTrigger value="model" className="flex items-center justify-center">
              <Brain className="h-4 w-4 mr-1.5" />
              <span>Model</span>
            </TabsTrigger>
            <TabsTrigger value="advanced" className="flex items-center justify-center">
              <Zap className="h-4 w-4 mr-1.5" />
              <span>Advanced</span>
            </TabsTrigger>
          </TabsList>
        </div>

        <CardContent className="p-0 overflow-hidden">
          <ScrollArea className="h-[350px] md:h-[400px] w-full">
            <TabsContent value="features" className="p-6 mt-0">
              <div className="space-y-6">
                <h3 className="text-base font-medium flex items-center">
                  <Check className="h-4 w-4 mr-2 text-primary" />
                  Analysis Features
                  <Badge variant="outline" className="ml-2 text-xs bg-primary/5">Core</Badge>
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Plagiarism Detection */}
                  <div className="flex flex-col p-4 border rounded-lg hover:border-primary/50 hover:bg-primary/5 transition-all duration-200 cursor-pointer group">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900/30 dark:to-green-800/20 flex items-center justify-center mr-3 shadow-sm">
                          <FileText className="h-5 w-5 text-green-600" />
                        </div>
                        <Label
                          htmlFor="plagiarism-toggle"
                          className="font-medium text-base cursor-pointer"
                        >
                          Plagiarism Detection
                        </Label>
                      </div>
                      <Switch
                        id="plagiarism-toggle"
                        checked={settings.checkPlagiarism}
                        onCheckedChange={handleToggleChange("checkPlagiarism")}
                        aria-label="Toggle plagiarism detection"
                        className="data-[state=checked]:bg-green-600"
                      />
                    </div>
                    <p className="text-sm text-muted-foreground pl-[52px]">
                      Identify matching content from external sources
                    </p>
                  </div>

                  {/* Grammar Checking */}
                  <div className="flex flex-col p-4 border rounded-lg hover:border-primary/50 hover:bg-primary/5 transition-all duration-200 cursor-pointer group">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/20 flex items-center justify-center mr-3 shadow-sm">
                          <BookOpen className="h-5 w-5 text-blue-600" />
                        </div>
                        <Label
                          htmlFor="grammar-toggle"
                          className="font-medium text-base cursor-pointer"
                        >
                          Grammar Checking
                        </Label>
                      </div>
                      <Switch
                        id="grammar-toggle"
                        checked={settings.checkGrammar}
                        onCheckedChange={handleToggleChange("checkGrammar")}
                        aria-label="Toggle grammar checking"
                        className="data-[state=checked]:bg-blue-600"
                      />
                    </div>
                    <p className="text-sm text-muted-foreground pl-[52px]">
                      Detect grammar and style issues
                    </p>
                  </div>

                  {/* Readability Analysis */}
                  <div className="flex flex-col p-4 border rounded-lg hover:border-primary/50 hover:bg-primary/5 transition-all duration-200 cursor-pointer group">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900/30 dark:to-purple-800/20 flex items-center justify-center mr-3 shadow-sm">
                          <BookText className="h-5 w-5 text-purple-600" />
                        </div>
                        <Label
                          htmlFor="readability-toggle"
                          className="font-medium text-base cursor-pointer"
                        >
                          Readability Analysis
                        </Label>
                      </div>
                      <Switch
                        id="readability-toggle"
                        checked={settings.checkReadability}
                        onCheckedChange={handleToggleChange("checkReadability")}
                        aria-label="Toggle readability analysis"
                        className="data-[state=checked]:bg-purple-600"
                      />
                    </div>
                    <p className="text-sm text-muted-foreground pl-[52px]">
                      Evaluate reading level and complexity
                    </p>
                  </div>

                  {/* Sentiment Analysis */}
                  <div className="flex flex-col p-4 border rounded-lg hover:border-primary/50 hover:bg-primary/5 transition-all duration-200 cursor-pointer group">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-amber-100 to-amber-200 dark:from-amber-900/30 dark:to-amber-800/20 flex items-center justify-center mr-3 shadow-sm">
                          <MessageSquareText className="h-5 w-5 text-amber-600" />
                        </div>
                        <Label
                          htmlFor="sentiment-toggle"
                          className="font-medium text-base cursor-pointer"
                        >
                          Sentiment Analysis
                        </Label>
                      </div>
                      <Switch
                        id="sentiment-toggle"
                        checked={settings.checkSentiment}
                        onCheckedChange={handleToggleChange("checkSentiment")}
                        aria-label="Toggle sentiment analysis"
                        className="data-[state=checked]:bg-amber-600"
                      />
                    </div>
                    <p className="text-sm text-muted-foreground pl-[52px]">
                      Evaluate tone and emotional content
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="model" className="p-6 mt-0">
              <div className="space-y-6">
                <h3 className="text-base font-medium flex items-center">
                  <Brain className="h-4 w-4 mr-2 text-primary" />
                  Language Model
                  <Badge variant="outline" className="ml-2 text-xs bg-primary/5">AI-Powered</Badge>
                </h3>

                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                    {Object.entries(LANGUAGE_MODEL_STRUCTURE).map(([category, data]) => (
                      <div 
                        key={category}
                        className={`flex items-center justify-center p-3 border rounded-md cursor-pointer transition-all duration-200 ${
                          selectedCategory === category 
                            ? "border-primary bg-primary/5 shadow-sm" 
                            : "border-muted hover:border-primary/30 hover:bg-primary/5"
                        }`}
                        onClick={() => handleCategoryChange(category as LanguageModelCategory)}
                      >
                        <div className="flex flex-col items-center text-center">
                          <div className="h-8 w-8 rounded-full bg-muted/50 flex items-center justify-center mb-1">
                            {getCategoryIcon(category as LanguageModelCategory)}
                          </div>
                          <span className="text-sm font-medium capitalize">{category}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border rounded-lg p-4 bg-muted/5">
                    <h4 className="text-sm font-medium mb-3 capitalize">
                      {selectedCategory} Models
                    </h4>
                    <RadioGroup 
                      value={settings.languageModel} 
                      onValueChange={handleLanguageModelChange}
                      className="grid grid-cols-1 md:grid-cols-2 gap-2"
                    >
                      {LANGUAGE_MODEL_STRUCTURE[selectedCategory]?.models.map((model) => (
                        <div key={model.id} className="flex items-start space-x-2">
                          <RadioGroupItem value={model.id} id={model.id} />
                          <div className="grid gap-1.5">
                            <Label htmlFor={model.id} className="font-medium">
                              {model.name}
                              {model.isDefault && (
                                <Badge className="ml-2 bg-primary/10 text-primary text-[10px]">Default</Badge>
                              )}
                            </Label>
                            <p className="text-xs text-muted-foreground">{model.description}</p>
                          </div>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="advanced" className="p-6 mt-0">
              <div className="space-y-6">
                <h3 className="text-base font-medium flex items-center">
                  <Zap className="h-4 w-4 mr-2 text-primary" />
                  Advanced Settings
                  <Badge variant="outline" className="ml-2 text-xs bg-primary/5">Personalization</Badge>
                </h3>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg hover:border-primary/50 hover:bg-primary/5 transition-all duration-200">
                    <div>
                      <h4 className="text-base font-medium flex items-center">
                        <Zap className="h-4 w-4 mr-2 text-amber-500" />
                        Adaptive Analysis
                      </h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        Learns from your writing style over time
                      </p>
                    </div>
                    <Switch
                      checked={settings.adaptiveAnalysis}
                      onCheckedChange={handleAdaptiveAnalysisChange}
                      aria-label="Toggle adaptive analysis"
                      className="data-[state=checked]:bg-amber-500"
                    />
                  </div>

                  {settings.adaptiveAnalysis && settings.userFeedback && (
                    <div className="border rounded-lg p-4 bg-muted/5">
                      <h4 className="text-sm font-medium mb-3 flex items-center">
                        <Info className="h-4 w-4 mr-2 text-primary" />
                        Learning Status
                      </h4>
                      <div className="space-y-3 text-sm">
                        <div className="flex">
                          <div className="w-1/3 font-medium text-muted-foreground">
                            Document types:
                          </div>
                          <div className="w-2/3">
                            {settings.userFeedback?.documentTypes.length ? (
                              settings.userFeedback.documentTypes.join(", ")
                            ) : (
                              <span className="text-muted-foreground italic">
                                No data yet
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex">
                          <div className="w-1/3 font-medium text-muted-foreground">
                            Style preferences:
                          </div>
                          <div className="w-2/3">
                            {settings.userFeedback?.preferredStyles.length ? (
                              settings.userFeedback.preferredStyles.join(", ")
                            ) : (
                              <span className="text-muted-foreground italic">
                                No data yet
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex">
                          <div className="w-1/3 font-medium text-muted-foreground">
                            Last calibration:
                          </div>
                          <div className="w-2/3">
                            {settings.userFeedback?.lastFeedbackDate ? (
                              new Date(
                                settings.userFeedback.lastFeedbackDate,
                              ).toLocaleDateString()
                            ) : (
                              <span className="text-muted-foreground italic">
                                Never
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="bg-gradient-to-r from-primary/5 to-primary/10 p-4 rounded-lg text-sm mt-2 border border-primary/10 shadow-sm">
                    <div className="flex items-start">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                        <Settings className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <h4 className="text-sm font-medium mb-1 text-primary/80">
                          About Analysis Settings
                        </h4>
                        <p className="text-muted-foreground">
                          These settings affect how your text is analyzed. Different
                          language models are optimized for different types of writing.
                          The AI-assisted calibration helps the system learn from your
                          specific writing style over time, adjusting analysis weights
                          based on your document types and preferences.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </ScrollArea>
        </CardContent>
      </Tabs>

      <CardFooter className="flex justify-between border-t pt-4 pb-3 bg-muted/5 sticky bottom-0 mt-auto">
        <Button
          variant="outline"
          onClick={onClose}
          className="transition-all duration-200 hover:bg-muted/50"
        >
          <X className="mr-2 h-4 w-4" />
          Close
        </Button>
        <Button
          onClick={handleSaveSettings}
          className="transition-all duration-200 hover:shadow-md bg-gradient-to-r from-primary to-primary/90 hover:translate-y-[-1px]"
        >
          <Save className="mr-2 h-4 w-4" />
          Save Settings
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AnalysisSettings;
