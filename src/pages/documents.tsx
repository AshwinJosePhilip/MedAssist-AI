import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PDFUploader from "@/components/pdf/PDFUploader";
import PDFDocumentList from "@/components/pdf/PDFDocumentList";
import { useAuth } from "@/lib/auth";
import { Navigate, useSearchParams } from "react-router-dom";

export default function Documents() {
  const { user, loading } = useAuth();
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState("documents");
  const [selectedDocumentId, setSelectedDocumentId] = useState<string | null>(
    null,
  );

  useEffect(() => {
    // Check URL parameters to set the active tab
    const tabParam = searchParams.get("tab");
    if (tabParam === "upload") {
      setActiveTab("upload");
    }
  }, [searchParams]);

  if (loading) {
    return <div className="flex justify-center p-8">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  const handleUploadComplete = () => {
    setActiveTab("documents");
  };

  const handleSelectDocument = (documentId: string) => {
    setSelectedDocumentId(documentId);
    // In a real implementation, you might navigate to a document viewer
    // or open a modal with the document content
  };

  return (
    <div className="container py-8 mt-16">
      <h1 className="text-3xl font-bold mb-6">Medical Document Repository</h1>
      <p className="text-muted-foreground mb-8">
        Upload and manage medical PDFs for the AI assistant to reference when
        answering your questions.
      </p>

      <Tabs
        defaultValue="documents"
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="grid w-full max-w-md grid-cols-2 mb-8">
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="upload">Upload New</TabsTrigger>
        </TabsList>

        <TabsContent value="documents" className="space-y-4">
          <PDFDocumentList
            onSelectDocument={handleSelectDocument}
            onAddDocument={() => setActiveTab("upload")}
          />
        </TabsContent>

        <TabsContent value="upload">
          <PDFUploader onUploadComplete={handleUploadComplete} />
        </TabsContent>
      </Tabs>

      {selectedDocumentId && (
        <div className="mt-8 p-4 border rounded-md bg-muted/20">
          <h2 className="text-xl font-semibold mb-2">
            Document ID: {selectedDocumentId}
          </h2>
          <p className="text-muted-foreground">
            In a complete implementation, this would display the document
            content or provide a viewer interface.
          </p>
        </div>
      )}
    </div>
  );
}
