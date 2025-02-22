import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, BookOpen, FileText, Brain, Key, ListChecks } from "lucide-react";
import ReactMarkdown from 'react-markdown';
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ContentPanelProps {
  isLoading: boolean;
  content: string | null;
  onGenerateSummary: () => void;
  onCreateNotes: () => void;
  showSummary?: boolean;
}

export const ContentPanel: React.FC<ContentPanelProps> = ({
  isLoading,
  content,
  onGenerateSummary,
  onCreateNotes,
  showSummary = true,
}) => {
  const [activeButton, setActiveButton] = React.useState<'summary' | 'notes' | null>(null);
  const [activeTab, setActiveTab] = React.useState<'overview' | 'key-points' | 'details'>('overview');

  const handleGenerateSummary = () => {
    setActiveButton('summary');
    onGenerateSummary();
  };

  const handleCreateNotes = () => {
    setActiveButton('notes');
    onCreateNotes();
  };

  React.useEffect(() => {
    if (!isLoading) {
      setActiveButton(null);
    }
  }, [isLoading]);

  // Function to extract key points from content
  const extractKeyPoints = (content: string): string[] => {
    if (!content) return [];
    const lines = content.split('\n');
    return lines
      .filter(line => line.trim().startsWith('-') || line.trim().startsWith('*'))
      .map(line => line.trim().replace(/^[-*]\s*/, ''));
  };

  // Function to format the content for detailed view
  const formatDetailedContent = (content: string): string => {
    if (!content) return '';
    return content
      .split('\n\n')
      .filter(paragraph => paragraph.trim().length > 0)
      .join('\n\n');
  };

  // Function to get overview content
  const getOverviewContent = (content: string): string => {
    if (!content) return '';
    const paragraphs = content.split('\n\n');
    return paragraphs[0] || '';
  };

  // Function to safely render markdown content
  const renderMarkdown = (content: string | null) => {
    if (!content) return null;
    try {
      return <ReactMarkdown>{content}</ReactMarkdown>;
    } catch (error) {
      console.error('Error rendering markdown:', error);
      return <p className="text-red-500">Error rendering content</p>;
    }
  };

  const renderLoadingSkeleton = () => (
    <div className="animate-pulse space-y-6">
      <div className="space-y-4">
        <div className="h-4 bg-learning-100 rounded w-3/4"></div>
        <div className="h-4 bg-learning-100 rounded w-1/2"></div>
        <div className="h-4 bg-learning-100 rounded w-5/6"></div>
      </div>
      <div className="space-y-3">
        <div className="h-3 bg-learning-50 rounded w-2/3"></div>
        <div className="h-3 bg-learning-50 rounded w-3/4"></div>
        <div className="h-3 bg-learning-50 rounded w-1/2"></div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex gap-4">
        <Button
          onClick={handleGenerateSummary}
          disabled={isLoading}
          className={cn(
            "flex-1 bg-learning-600 hover:bg-learning-700",
            activeButton === 'summary' && "ring-2 ring-learning-200"
          )}
        >
          {isLoading && activeButton === 'summary' ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <FileText className="mr-2 h-4 w-4" />
          )}
          Generate Summary
        </Button>
        <Button
          onClick={handleCreateNotes}
          disabled={isLoading}
          variant="outline"
          className={cn(
            "flex-1 border-learning-200 hover:bg-learning-50",
            activeButton === 'notes' && "ring-2 ring-learning-200"
          )}
        >
          {isLoading && activeButton === 'notes' ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <BookOpen className="mr-2 h-4 w-4" />
          )}
          Create Interactive Notes
        </Button>
      </div>

      {showSummary && content && (
        <Card className="overflow-hidden bg-white border-learning-200">
          <CardHeader className="bg-gradient-to-r from-learning-50 to-white border-b border-learning-100">
            <CardTitle className="flex items-center gap-2 text-learning-800">
              <Brain className="h-5 w-5" />
              Video Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {isLoading ? (
              renderLoadingSkeleton()
            ) : (
              <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)} className="space-y-6">
                <TabsList className="bg-learning-50 text-learning-600">
                  <TabsTrigger value="overview" className="data-[state=active]:bg-white">
                    Overview
                  </TabsTrigger>
                  <TabsTrigger value="key-points" className="data-[state=active]:bg-white">
                    Key Points
                  </TabsTrigger>
                  <TabsTrigger value="details" className="data-[state=active]:bg-white">
                    Details
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="mt-6 space-y-4">
                  <div className="prose prose-learning max-w-none">
                    {renderMarkdown(getOverviewContent(content || ''))}
                  </div>
                </TabsContent>

                <TabsContent value="key-points" className="mt-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-learning-700 mb-4">
                      <Key className="h-4 w-4" />
                      <h3 className="font-semibold">Main Takeaways</h3>
                    </div>
                    <ul className="space-y-3">
                      {extractKeyPoints(content || '').map((point, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <ListChecks className="h-4 w-4 mt-1 text-learning-500" />
                          <span className="text-learning-700">{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </TabsContent>

                <TabsContent value="details" className="mt-6">
                  <div className="prose prose-learning max-w-none">
                    {renderMarkdown(formatDetailedContent(content || ''))}
                  </div>
                </TabsContent>
              </Tabs>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};
