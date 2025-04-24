import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Upload, FileText, Check, AlertCircle } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { uploadPDF, storePDFMetadata, storePDFContent } from "@/lib/pdf";
import { chromaClient } from "@/lib/chromadb";

interface PDFUploaderProps {
  onUploadComplete?: () => void;
}

export default function PDFUploader({ onUploadComplete }: PDFUploaderProps) {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [shouldSummarize, setShouldSummarize] = useState(true);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type !== "application/pdf") {
        setError("Please upload a PDF file");
        return;
      }
      setFile(selectedFile);
      // Auto-fill title from filename if not set
      if (!title) {
        setTitle(selectedFile.name.replace(/\.pdf$/i, ""));
      }
      setError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError("Please select a PDF file");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // Upload PDF to storage
      const filePath = await uploadPDF(file);
      if (!filePath) {
        throw new Error("Failed to upload PDF");
      }

      // Store metadata in database
      const documentId = await storePDFMetadata(
        filePath,
        title || file.name,
        author,
        0, // Page count will be updated after processing
        file.size,
        shouldSummarize, // Pass the summarization flag
      );

      if (!documentId) {
        throw new Error("Failed to store PDF metadata");
      }

      // In a real implementation, you would extract text from the PDF
      // For this example, we'll simulate it with a mock text extraction
      const mockExtractedText = [
        `This is page 1 of ${title}. It contains medical information about various treatments.`,
        `This is page 2 of ${title}. It discusses diagnosis procedures and patient care.`,
        `This is page 3 of ${title}. It covers medication dosages and side effects.`,
      ];

      // Store extracted text in database
      for (let i = 0; i < mockExtractedText.length; i++) {
        await storePDFContent(documentId, i + 1, mockExtractedText[i]);
      }

      // Create or get ChromaDB collection
      const collectionName = "medical-documents";
      await chromaClient.createCollection(collectionName);

      // Add documents to ChromaDB
      await chromaClient.addDocuments(
        collectionName,
        mockExtractedText.map((text, index) => ({
          id: `${documentId}-page-${index + 1}`,
          text,
          metadata: {
            documentId,
            pageNumber: index + 1,
            title,
            author,
          },
        })),
      );

      setSuccess(true);
      setFile(null);
      setTitle("");
      setAuthor("");

      // Call the callback if provided
      if (onUploadComplete) {
        onUploadComplete();
      }
    } catch (err) {
      console.error("Error uploading PDF:", err);
      setError(err instanceof Error ? err.message : "Failed to process PDF");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto bg-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Upload Medical PDF
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="bg-green-900/20 text-green-400 border-green-900">
              <Check className="h-4 w-4" />
              <AlertDescription>
                PDF uploaded and processed successfully!
                {shouldSummarize &&
                  " A summary will be generated for this document."}
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="pdf-file">PDF File</Label>
            <div className="flex items-center gap-2">
              <Input
                id="pdf-file"
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                className="flex-1"
              />
            </div>
            {file && (
              <p className="text-xs text-muted-foreground">
                {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Document Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter document title"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="author">Author (Optional)</Label>
            <Input
              id="author"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="Enter author name"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="summarize"
              checked={shouldSummarize}
              onCheckedChange={(checked) =>
                setShouldSummarize(checked as boolean)
              }
            />
            <Label htmlFor="summarize" className="text-sm cursor-pointer">
              Generate AI summary of this document
            </Label>
          </div>

          <Button type="submit" className="w-full" disabled={loading || !file}>
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="animate-spin">⏳</span> Processing...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Upload className="h-4 w-4" /> Upload PDF
              </span>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
