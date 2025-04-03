
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import { ErrorBoundary as ReactErrorBoundary } from "react-error-boundary";
import { ThemeProvider } from "./components/ThemeProvider";
import { TextAnalysisProvider } from "./contexts/TextAnalysisContext.tsx";

// Lazy-loaded components for better performance
const Index = lazy(() => import("./pages/Index"));
const NotFound = lazy(() => import("./pages/NotFound"));
const CitationPage = lazy(() => import("./pages/CitationPage"));
const FeaturesPage = lazy(() => import("./pages/FeaturesPage"));
const AboutPage = lazy(() => import("./pages/AboutPage"));
const HelpCenterPage = lazy(() => import("./pages/HelpCenterPage"));
const ApiDocumentationPage = lazy(() => import("./pages/ApiDocumentationPage"));
const BlogPage = lazy(() => import("./pages/BlogPage"));
const TermsOfServicePage = lazy(() => import("./pages/TermsOfServicePage"));
const OurMissionPage = lazy(() => import("./pages/OurMissionPage"));
const OpenSourcePage = lazy(() => import("./pages/OpenSourcePage"));
const ContributePage = lazy(() => import("./pages/ContributePage"));
const ContactUsPage = lazy(() => import("./pages/ContactUsPage"));

// Error Boundary component
const ErrorBoundary = ({ children }: { children: React.ReactNode }) => {
  return (
    <ReactErrorBoundary
      fallback={
        <div className="flex items-center justify-center min-h-screen p-4 text-center">
          <div className="p-6 bg-destructive/10 rounded-lg max-w-md">
            <h2 className="text-2xl font-bold text-destructive mb-4">Something went wrong</h2>
            <p className="mb-4">We're sorry, but there was an error loading this page.</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
            >
              Reload page
            </button>
          </div>
        </div>
      }
    >
      {children}
    </ReactErrorBoundary>
  );
};

// Loading component
const Loading = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
  </div>
);

// Configure QueryClient with better error handling and retries
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ErrorBoundary>
      <ThemeProvider>
        <TextAnalysisProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Suspense fallback={<Loading />}>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/cite" element={<CitationPage />} />
                  <Route path="/features" element={<FeaturesPage />} />
                  <Route path="/about" element={<AboutPage />} />
                  <Route path="/help-center" element={<HelpCenterPage />} />
                  <Route path="/api-documentation" element={<ApiDocumentationPage />} />
                  <Route path="/blog" element={<BlogPage />} />
                  <Route path="/terms-of-service" element={<TermsOfServicePage />} />
                  <Route path="/our-mission" element={<OurMissionPage />} />
                  <Route path="/open-source" element={<OpenSourcePage />} />
                  <Route path="/contribute" element={<ContributePage />} />
                  <Route path="/contact-us" element={<ContactUsPage />} />
                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </BrowserRouter>
          </TooltipProvider>
        </TextAnalysisProvider>
      </ThemeProvider>
    </ErrorBoundary>
  </QueryClientProvider>
);

export default App;
