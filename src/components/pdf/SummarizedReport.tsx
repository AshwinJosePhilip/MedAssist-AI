import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SummarizedReportProps {
  documentId: string;
  title: string;
  summary: string;
  createdAt: string;
  onClose?: () => void;
  error?: string;
  loading?: boolean;
}

export default function SummarizedReport({
  documentId,
  title,
  summary,
  createdAt,
  onClose,
  error,
  loading = false,
}: SummarizedReportProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <Card className="w-full bg-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Summarizing Report
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center py-8">
            <div className="animate-pulse text-muted-foreground">
              Generating summary...
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full bg-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-destructive" />
            Summary Error
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-destructive mb-4">{error}</div>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full bg-card">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Report Summary: {title}
          </div>
          <div className="text-sm font-normal text-muted-foreground">
            {formatDate(createdAt)}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="rounded-md bg-muted/50 p-4">
            <h3 className="mb-2 font-medium">Key Findings</h3>
            <div className="whitespace-pre-wrap text-sm">{summary}</div>
          </div>
          <div className="flex justify-end">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
