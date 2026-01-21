import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

interface BreadcrumbItem {
  label: string;
  path?: string;
  icon: React.ReactNode;
}

interface PageHeaderProps {
  title: string | React.ReactNode;
  description?: string;
  breadcrumbs?: BreadcrumbItem[];
  actions?: React.ReactNode;
  showBackButton?: boolean;
  backPath?: string;
  backLabel?: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  description,
  breadcrumbs,
  actions,
  showBackButton = true,
  backPath = '/dashboard',
  backLabel = 'Back to Dashboard',
}) => {
  const navigate = useNavigate();
  const isLastItem = (index: number) => index === breadcrumbs.length - 1;

  return (
    <div className="flex flex-col space-y-4 mb-8">
      {/* Breadcrumb navigation */}
      {breadcrumbs && breadcrumbs.length > 0 && (
        <Breadcrumb>
          <BreadcrumbList className="text-sm">
            {breadcrumbs.map((item, index) => (
              <React.Fragment key={item.label}>
                <BreadcrumbItem>
                  {isLastItem(index) ? (
                    <BreadcrumbPage className="flex items-center text-foreground font-medium">
                      {item.icon}
                      <span className="ml-1">{item.label}</span>
                    </BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink asChild className="flex items-center hover:text-primary transition-colors">
                      <Link to={item.path || '#'}>
                        {item.icon}
                        <span className="ml-1">{item.label}</span>
                      </Link>
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
                {!isLastItem(index) && <BreadcrumbSeparator />}
              </React.Fragment>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      )}

      {/* Header with title and actions */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
          {description && (
            <p className="text-muted-foreground mt-1">{description}</p>
          )}
        </div>
        <div className="flex items-center gap-3">
          {actions}
          {showBackButton && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate(backPath)}
              className="flex items-center gap-1"
            >
              <ChevronLeft className="h-4 w-4" />
              <span>{backLabel}</span>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PageHeader;
