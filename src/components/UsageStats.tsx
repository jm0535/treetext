import React, { useEffect, useState } from 'react';
import UsageService from '@/services/UsageService';
import { UsageLimit } from '@/types';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { InfoCircledIcon } from '@radix-ui/react-icons';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

/**
 * Component to display usage statistics and limits
 */
const UsageStats: React.FC = () => {
  const [usageStats, setUsageStats] = useState<UsageLimit | null>(null);
  const [remainingUsage, setRemainingUsage] = useState({
    dailyAnalysisPercent: 100,
    monthlyAnalysisPercent: 100,
    dailyTokenPercent: 100,
    monthlyTokenPercent: 100
  });

  useEffect(() => {
    // Get initial usage stats
    const stats = UsageService.getUsageStats();
    setUsageStats(stats);
    setRemainingUsage(UsageService.getRemainingUsage());

    // Set up interval to refresh stats every minute
    const interval = setInterval(() => {
      const updatedStats = UsageService.getUsageStats();
      setUsageStats(updatedStats);
      setRemainingUsage(UsageService.getRemainingUsage());
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  if (!usageStats) {
    return null;
  }

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center justify-between">
          <span>Usage Limits</span>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <InfoCircledIcon className="h-4 w-4 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent className="max-w-sm">
                <p>Usage limits help manage API costs. Limits reset daily and monthly.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardTitle>
        <CardDescription>
          Track your analysis usage and limits
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Daily Analysis */}
        <div className="space-y-1">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Daily Analyses</span>
            <span className="font-medium">{usageStats.dailyAnalysisCount}/{usageStats.dailyAnalysisLimit}</span>
          </div>
          <Progress value={remainingUsage.dailyAnalysisPercent} 
            className={remainingUsage.dailyAnalysisPercent < 20 ? "text-destructive" : ""} />
        </div>

        {/* Monthly Analysis */}
        <div className="space-y-1">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Monthly Analyses</span>
            <span className="font-medium">{usageStats.monthlyAnalysisCount}/{usageStats.monthlyAnalysisLimit}</span>
          </div>
          <Progress value={remainingUsage.monthlyAnalysisPercent} 
            className={remainingUsage.monthlyAnalysisPercent < 20 ? "text-destructive" : ""} />
        </div>

        {/* Daily Tokens */}
        <div className="space-y-1">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Daily Tokens</span>
            <span className="font-medium">{Math.round(usageStats.dailyTokenCount).toLocaleString()}/{usageStats.dailyTokenLimit.toLocaleString()}</span>
          </div>
          <Progress value={remainingUsage.dailyTokenPercent} 
            className={remainingUsage.dailyTokenPercent < 20 ? "text-destructive" : ""} />
        </div>

        {/* Monthly Tokens */}
        <div className="space-y-1">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Monthly Tokens</span>
            <span className="font-medium">{Math.round(usageStats.monthlyTokenCount).toLocaleString()}/{usageStats.monthlyTokenLimit.toLocaleString()}</span>
          </div>
          <Progress value={remainingUsage.monthlyTokenPercent} 
            className={remainingUsage.monthlyTokenPercent < 20 ? "text-destructive" : ""} />
        </div>

        <div className="text-xs text-muted-foreground mt-2 pt-2 border-t">
          <p>Limits reset daily at midnight and monthly on the 1st.</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default UsageStats;
