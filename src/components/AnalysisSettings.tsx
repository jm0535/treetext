import React from 'react';
import { useTextAnalysis } from '@/hooks/useTextAnalysis';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { Settings, Check, Zap } from 'lucide-react';
import { AnalysisSettings as SettingsType } from '@/types';

interface AnalysisSettingsProps {
  className?: string;
}

const AnalysisSettings: React.FC<AnalysisSettingsProps> = ({ className }) => {
  const { settings, updateSettings } = useTextAnalysis();

  const handleToggleChange = (key: keyof SettingsType) => (checked: boolean) => {
    if (typeof settings[key] === 'boolean') {
      updateSettings({ [key]: checked });
    }
  };

  const handleLanguageModelChange = (value: string) => {
    updateSettings({ 
      languageModel: value as 'standard' | 'academic' | 'creative' 
    });
  };

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl flex items-center">
              <Settings className="mr-2 h-5 w-5 text-muted-foreground" />
              Analysis Settings
            </CardTitle>
            <CardDescription>
              Configure how your text will be analyzed
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Analysis Features</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="check-plagiarism" className="flex items-center">
                  <Check className="mr-2 h-4 w-4 text-green-500" />
                  Plagiarism Detection
                </Label>
                <Switch 
                  id="check-plagiarism" 
                  checked={settings.checkPlagiarism}
                  onCheckedChange={handleToggleChange('checkPlagiarism')}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="check-grammar" className="flex items-center">
                  <Check className="mr-2 h-4 w-4 text-blue-500" />
                  Grammar Checking
                </Label>
                <Switch 
                  id="check-grammar" 
                  checked={settings.checkGrammar}
                  onCheckedChange={handleToggleChange('checkGrammar')}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="check-readability" className="flex items-center">
                  <Check className="mr-2 h-4 w-4 text-purple-500" />
                  Readability Analysis
                </Label>
                <Switch 
                  id="check-readability" 
                  checked={settings.checkReadability}
                  onCheckedChange={handleToggleChange('checkReadability')}
                />
              </div>
            </div>
          </div>
          
          <Separator />
          
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Language Model</h3>
            <RadioGroup 
              value={settings.languageModel} 
              onValueChange={handleLanguageModelChange}
              className="space-y-3"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="standard" id="standard" />
                <Label htmlFor="standard" className="flex items-center">
                  <Zap className="mr-2 h-4 w-4 text-yellow-500" />
                  Standard
                  <span className="ml-2 text-xs text-muted-foreground">
                    (Balanced analysis for general text)
                  </span>
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="academic" id="academic" />
                <Label htmlFor="academic" className="flex items-center">
                  <Zap className="mr-2 h-4 w-4 text-blue-500" />
                  Academic
                  <span className="ml-2 text-xs text-muted-foreground">
                    (Optimized for scholarly writing)
                  </span>
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="creative" id="creative" />
                <Label htmlFor="creative" className="flex items-center">
                  <Zap className="mr-2 h-4 w-4 text-purple-500" />
                  Creative
                  <span className="ml-2 text-xs text-muted-foreground">
                    (For creative writing and storytelling)
                  </span>
                </Label>
              </div>
            </RadioGroup>
          </div>
          
          <div className="bg-muted p-3 rounded-md text-sm">
            <p className="text-muted-foreground">
              These settings affect how your text is analyzed. Different language models are optimized for different types of writing.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AnalysisSettings;
