import React, { useState } from 'react';
import { useTextAnalysis } from '@/hooks/useTextAnalysis';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  CardFooter
} from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { Settings, Check, Zap, BookOpen, Briefcase, Microscope, FileText, X, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AnalysisSettings as SettingsType, LanguageModelCategory, LanguageModelType } from '@/types';
import { LANGUAGE_MODEL_STRUCTURE } from '@/utils/constants';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface AnalysisSettingsProps {
  className?: string;
  onClose?: () => void;
}

const AnalysisSettings: React.FC<AnalysisSettingsProps> = ({ className, onClose }) => {
  const { settings, updateSettings } = useTextAnalysis();

  const handleToggleChange = (key: keyof SettingsType) => (checked: boolean) => {
    if (typeof settings[key] === 'boolean') {
      updateSettings({ [key]: checked });
    }
  };

  const [selectedCategory, setSelectedCategory] = useState<LanguageModelCategory>(settings.languageModelCategory || 'general');

  const handleCategoryChange = (category: LanguageModelCategory) => {
    setSelectedCategory(category);
  };

  const handleLanguageModelChange = (value: string) => {
    // Find the category this model belongs to
    let category: LanguageModelCategory = 'general';
    
    for (const [key, data] of Object.entries(LANGUAGE_MODEL_STRUCTURE)) {
      if (data.models.some(model => model.id === value)) {
        category = key as LanguageModelCategory;
        break;
      }
    }
    
    updateSettings({ 
      languageModel: value as LanguageModelType,
      languageModelCategory: category
    });
  };
  
  const handleAdaptiveAnalysisChange = (checked: boolean) => {
    updateSettings({
      adaptiveAnalysis: checked
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
      case 'academic':
        return <BookOpen className="h-3.5 w-3.5 text-blue-500" />;
      case 'business':
        return <Briefcase className="h-3.5 w-3.5 text-amber-500" />;
      case 'specialized':
        return <Microscope className="h-3.5 w-3.5 text-purple-500" />;
      case 'general':
      default:
        return <FileText className="h-3.5 w-3.5 text-green-500" />;
    }
  };

  return (
    <Card className={`${className} shadow-lg border-opacity-50 flex flex-col max-h-[85vh]`}>
      <CardHeader className="pb-4 border-b bg-muted/10">
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
      <CardContent className="overflow-y-auto flex-grow">
        <div className="space-y-7">
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium flex items-center text-primary">
                <Check className="mr-2 h-4 w-4" />
                Analysis Features
              </h3>
              <div className="text-xs text-muted-foreground bg-muted/30 px-2 py-1 rounded-md">Core</div>
            </div>
            <div className="space-y-4 pl-1">
              <div className="flex items-center justify-between bg-muted/30 p-3 rounded-lg hover:bg-muted/50 transition-all duration-200 hover:shadow-sm">
                <Label htmlFor="check-plagiarism" className="flex items-center cursor-pointer">
                  <div className="h-6 w-6 rounded-full bg-green-100 flex items-center justify-center mr-3">
                    <Check className="h-3.5 w-3.5 text-green-600" />
                  </div>
                  <div>
                    <span className="font-medium">Plagiarism Detection</span>
                    <p className="text-xs text-muted-foreground mt-0.5">Identify matching content from external sources</p>
                  </div>
                </Label>
                <div className="relative">
                  <Switch 
                    id="check-plagiarism" 
                    checked={settings.checkPlagiarism}
                    onCheckedChange={handleToggleChange('checkPlagiarism')}
                    className="data-[state=checked]:bg-green-600 data-[state=checked]:shadow-inner transition-all duration-200"
                  />
                  {settings.checkPlagiarism && (
                    <div className="absolute -top-1 -right-1 h-2 w-2 bg-green-500 rounded-full animate-pulse" />
                  )}
                </div>
              </div>
              <div className="flex items-center justify-between bg-muted/30 p-3 rounded-lg hover:bg-muted/50 transition-all duration-200 hover:shadow-sm">
                <Label htmlFor="check-grammar" className="flex items-center cursor-pointer">
                  <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                    <Check className="h-3.5 w-3.5 text-blue-600" />
                  </div>
                  <div>
                    <span className="font-medium">Grammar Checking</span>
                    <p className="text-xs text-muted-foreground mt-0.5">Detect grammar and style issues</p>
                  </div>
                </Label>
                <div className="relative">
                  <Switch 
                    id="check-grammar" 
                    checked={settings.checkGrammar}
                    onCheckedChange={handleToggleChange('checkGrammar')}
                    className="data-[state=checked]:bg-blue-600 data-[state=checked]:shadow-inner transition-all duration-200"
                  />
                  {settings.checkGrammar && (
                    <div className="absolute -top-1 -right-1 h-2 w-2 bg-blue-500 rounded-full animate-pulse" />
                  )}
                </div>
              </div>
              <div className="flex items-center justify-between bg-muted/30 p-3 rounded-lg hover:bg-muted/50 transition-all duration-200 hover:shadow-sm">
                <Label htmlFor="check-readability" className="flex items-center cursor-pointer">
                  <div className="h-6 w-6 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                    <Check className="h-3.5 w-3.5 text-purple-600" />
                  </div>
                  <div>
                    <span className="font-medium">Readability Analysis</span>
                    <p className="text-xs text-muted-foreground mt-0.5">Evaluate reading level and complexity</p>
                  </div>
                </Label>
                <div className="relative">
                  <Switch 
                    id="check-readability" 
                    checked={settings.checkReadability}
                    onCheckedChange={handleToggleChange('checkReadability')}
                    className="data-[state=checked]:bg-purple-600 data-[state=checked]:shadow-inner transition-all duration-200"
                  />
                  {settings.checkReadability && (
                    <div className="absolute -top-1 -right-1 h-2 w-2 bg-purple-500 rounded-full animate-pulse" />
                  )}
                </div>
              </div>
              <div className="flex items-center justify-between bg-muted/30 p-3 rounded-lg hover:bg-muted/50 transition-all duration-200 hover:shadow-sm">
                <Label htmlFor="check-sentiment" className="flex items-center cursor-pointer">
                  <div className="h-6 w-6 rounded-full bg-amber-100 flex items-center justify-center mr-3">
                    <Check className="h-3.5 w-3.5 text-amber-600" />
                  </div>
                  <div>
                    <span className="font-medium">Sentiment Analysis</span>
                    <p className="text-xs text-muted-foreground mt-0.5">Evaluate tone and emotional content</p>
                  </div>
                </Label>
                <div className="relative">
                  <Switch 
                    id="check-sentiment" 
                    checked={settings.checkSentiment}
                    onCheckedChange={handleToggleChange('checkSentiment')}
                    className="data-[state=checked]:bg-amber-600 data-[state=checked]:shadow-inner transition-all duration-200"
                  />
                  {settings.checkSentiment && (
                    <div className="absolute -top-1 -right-1 h-2 w-2 bg-amber-500 rounded-full animate-pulse" />
                  )}
                </div>
              </div>
            </div>
          </div>
          
          <Separator className="my-6" />
          
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium flex items-center text-primary">
                <Zap className="mr-2 h-4 w-4" />
                Language Model
              </h3>
              <div className="text-xs text-muted-foreground bg-muted/30 px-2 py-1 rounded-md">AI-Powered</div>
            </div>
            
            <div>
              <div className="flex mb-5 bg-muted/30 p-1 rounded-md overflow-hidden">
                {Object.entries(LANGUAGE_MODEL_STRUCTURE).map(([category, data]) => (
                  <button
                    key={category}
                    type="button"
                    onClick={() => handleCategoryChange(category as LanguageModelCategory)}
                    className={`flex-1 h-9 flex items-center justify-center ${selectedCategory === category ? 'bg-primary/10 text-primary shadow-sm' : 'hover:bg-muted/50'} rounded-sm transition-colors`}
                  >
                    <div className="flex items-center">
                      <span className="w-4 h-4 flex items-center justify-center">
                        {getCategoryIcon(category as LanguageModelCategory)}
                      </span>
                      <span className="ml-1.5 text-xs font-medium">{data.name}</span>
                    </div>
                  </button>
                ))}
              </div>
              
              {Object.entries(LANGUAGE_MODEL_STRUCTURE).map(([category, data]) => (
                <div key={category} className={`mt-0 ${selectedCategory === category ? 'block' : 'hidden'}`}>
                  <div className="mb-2">
                    <div className="p-3 bg-gradient-to-r from-muted/20 to-muted/5 border border-muted rounded-lg mb-4 shadow-sm">
                      <p className="text-sm text-muted-foreground flex items-center">
                        {getCategoryIcon(category as LanguageModelCategory)}
                        <span className="ml-2">{data.description}</span>
                      </p>
                    </div>
                    <RadioGroup 
                      value={settings.languageModel} 
                      onValueChange={handleLanguageModelChange}
                      className="grid grid-cols-2 gap-3 px-2"
                    >
                      {data.models.map(model => (
                        <div 
                          key={model.id} 
                          className={`flex items-center p-3 rounded-md transition-all duration-200 border ${settings.languageModel === model.id ? 'bg-muted/50 border-muted shadow-sm' : 'border-transparent hover:bg-muted/20 hover:shadow-sm'}`}
                        >
                          <div className="flex items-center justify-center mr-3 relative">
                            <div className={`h-4 w-4 rounded-full border transition-colors duration-200 ${settings.languageModel === model.id ? 'border-primary bg-primary shadow-sm' : 'border-muted-foreground'} flex items-center justify-center`}>
                              {settings.languageModel === model.id && (
                                <div className="h-1.5 w-1.5 rounded-full bg-white" />
                              )}
                            </div>
                            <RadioGroupItem value={model.id} id={model.id} className="sr-only" />
                          </div>
                          <Label htmlFor={model.id} className="flex-1 flex items-center cursor-pointer">
                            <div className="flex flex-col w-full overflow-hidden">
                              <div className="flex items-center">
                                <span className="font-medium">{model.name}</span>
                                {settings.languageModel === model.id && 
                                  <span className="ml-2 text-xs bg-muted/50 text-muted-foreground px-2 py-0.5 rounded-full">Selected</span>
                                }
                              </div>
                              <span className="text-xs text-muted-foreground mt-1 truncate">
                                {model.description}
                              </span>
                            </div>
                          </Label>
                        </div>
                      ))}                      
                    </RadioGroup>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <Separator className="my-6" />
          
          {/* AI-Assisted Calibration */}
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium flex items-center text-primary">
                <FileText className="mr-2 h-4 w-4" />
                AI-Assisted Calibration
              </h3>
              <div className="text-xs text-muted-foreground bg-muted/30 px-2 py-1 rounded-md">Advanced</div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between bg-muted/30 p-3 rounded-lg hover:bg-muted/50 transition-all duration-200 hover:shadow-sm">
                <Label htmlFor="adaptive-analysis" className="flex items-center cursor-pointer">
                  <div className="h-6 w-6 rounded-full bg-teal-100 flex items-center justify-center mr-3">
                    <Check className="h-3.5 w-3.5 text-teal-600" />
                  </div>
                  <div>
                    <span className="font-medium">Adaptive Analysis</span>
                    <p className="text-xs text-muted-foreground mt-0.5">Learns from your writing style over time</p>
                  </div>
                </Label>
                <div className="relative">
                  <Switch 
                    id="adaptive-analysis" 
                    checked={settings.adaptiveAnalysis || false}
                    onCheckedChange={handleAdaptiveAnalysisChange}
                    className="data-[state=checked]:bg-teal-600 data-[state=checked]:shadow-inner transition-all duration-200"
                  />
                  {(settings.adaptiveAnalysis || false) && (
                    <div className="absolute -top-1 -right-1 h-2 w-2 bg-teal-500 rounded-full animate-pulse" />
                  )}
                </div>
              </div>
              
              {settings.adaptiveAnalysis && (
                <div className="mt-4 p-4 bg-gradient-to-r from-muted/20 to-muted/5 rounded-lg border border-muted shadow-sm">
                  <h4 className="text-sm font-medium mb-3 flex items-center">
                    <div className="h-5 w-5 rounded-full bg-teal-100 flex items-center justify-center mr-2">
                      <FileText className="h-3 w-3 text-teal-600" />
                    </div>
                    Learning Status
                  </h4>
                  <div className="space-y-3 text-sm">
                    <div className="flex">
                      <div className="w-1/3 font-medium text-muted-foreground">Document types:</div>
                      <div className="w-2/3">{settings.userFeedback?.documentTypes.length ? 
                        settings.userFeedback.documentTypes.join(', ') : 
                        <span className="text-muted-foreground italic">No data yet</span>}
                      </div>
                    </div>
                    <div className="flex">
                      <div className="w-1/3 font-medium text-muted-foreground">Style preferences:</div>
                      <div className="w-2/3">{settings.userFeedback?.preferredStyles.length ? 
                        settings.userFeedback.preferredStyles.join(', ') : 
                        <span className="text-muted-foreground italic">No data yet</span>}
                      </div>
                    </div>
                    <div className="flex">
                      <div className="w-1/3 font-medium text-muted-foreground">Last calibration:</div>
                      <div className="w-2/3">{settings.userFeedback?.lastFeedbackDate ? 
                        new Date(settings.userFeedback.lastFeedbackDate).toLocaleDateString() : 
                        <span className="text-muted-foreground italic">Never</span>}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-primary/5 to-primary/10 p-4 rounded-lg text-sm mt-6 border border-primary/10 shadow-sm">
            <div className="flex items-start">
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                <Settings className="h-4 w-4 text-primary" />
              </div>
              <div>
                <h4 className="text-sm font-medium mb-1 text-primary/80">About Analysis Settings</h4>
                <p className="text-muted-foreground">
                  These settings affect how your text is analyzed. Different language models are optimized for different types of writing. The AI-assisted calibration helps the system learn from your specific writing style over time, adjusting analysis weights based on your document types and preferences.
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between border-t pt-5 pb-3 bg-muted/5 sticky bottom-0 mt-auto">
        <Button variant="outline" onClick={onClose} className="transition-all duration-200 hover:bg-muted/50">
          <X className="mr-2 h-4 w-4" />
          Close
        </Button>
        <Button onClick={handleSaveSettings} className="transition-all duration-200 hover:shadow-md bg-gradient-to-r from-primary to-primary/90 hover:translate-y-[-1px]">
          <Save className="mr-2 h-4 w-4" />
          Save Settings
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AnalysisSettings;
