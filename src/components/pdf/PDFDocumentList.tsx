import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Calendar, User, FileUp, Trash2 } from "lucide-react";
import { getAllPDFDocuments } from "@/lib/pdf";

interface PDFDocument {
  id: string;
  title: string;
  author?: string;
  uploadedAt: string;
  fileSize: number;
  pageCount: number;
}

interface PDFDocumentListProps {
  onSelectDocument?: (documentId: string) => void;
}

export default function PDFDocumentList({
  onSelectDocument,
}: PDFDocumentListProps) {
  const [documents, setDocuments] = useState<PDFDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    try {
      setLoading(true);
      const docs = await getAllPDFDocuments();
      setDocuments(docs);
      setError(null);
    } catch (err) {
      console.error("Error loading documents:", err);
      setError("Failed to load documents");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  };

  if (loading) {
    return (
      <Card className="w-full bg-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Medical Documents
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center py-8">
            <div className="animate-pulse text-muted-foreground">
              Loading documents...
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
            <FileText className="h-5 w-5" />
            Medical Documents
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-destructive text-center py-4">{error}</div>
          <Button variant="outline" className="w-full" onClick={loadDocuments}>
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  // If a summary is selected or loading, show the summary view instead of the document list
  if (selectedSummary || summaryLoading || summaryError) {
    return (
      <div className="space-y-4">
        {selectedSummary && (
          <SummarizedReport
            documentId={selectedSummary.documentId}
            title={selectedSummary.title}
            summary={selectedSummary.summary}
            createdAt={selectedSummary.createdAt}
            onClose={closeSummary}
            loading={summaryLoading}
            error={summaryError || undefined}
          />
        )}

        {!selectedSummary && summaryLoading && (
          <SummarizedReport
            documentId=""
            title=""
            summary=""
            createdAt=""
            loading={true}
          />
        )}

        {!selectedSummary && !summaryLoading && summaryError && (
          <SummarizedReport
            documentId=""
            title=""
            summary=""
            createdAt=""
            error={summaryError}
            onClose={closeSummary}
          />
        )}

        <Button variant="outline" className="w-full" onClick={closeSummary}>
          Back to Documents
        </Button>
      </div>
    );
  }

  return (
    <Card className="w-full bg-card">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Medical Documents
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onAddDocument && onAddDocument()}
            >
              <FileUp className="h-4 w-4 mr-2" />
              Upload
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                onAddDocument && onAddDocument();
                // Set summarize=true in the URL
                const url = new URL(window.location.href);
                url.searchParams.set("summarize", "true");
                window.history.pushState({}, "", url);
              }}
            >
              <FileDigit className="h-4 w-4 mr-2" />
              Summarize
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {documents.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <FileUp className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No documents uploaded yet</p>
            <p className="text-sm mt-2">
              Upload a PDF to start building your medical knowledge base
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className="p-4 border rounded-md hover:bg-muted/20 transition-colors"
              >
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <h3 className="font-medium text-lg">{doc.title}</h3>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                      {doc.author && (
                        <div className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          <span>{doc.author}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>{formatDate(doc.uploadedAt)}</span>
                      </div>
                      <div>
                        {formatFileSize(doc.fileSize)} •{" "}
                        {doc.pageCount > 0
                          ? `${doc.pageCount} pages`
                          : "Processing"}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {doc.hasSummary && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => viewSummary(doc.id)}
                      >
                        View Summary
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        onSelectDocument && onSelectDocument(doc.id)
                      }
                    >
                      View Document
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        <Button
          variant="outline"
          className="w-full mt-4"
          onClick={loadDocuments}
        >
          Refresh List
        </Button>
      </CardContent>
    </Card>
  );
}
