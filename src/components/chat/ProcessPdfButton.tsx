import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { FileText, Loader2, Check } from "lucide-react";
import { processFirstAidPdf } from "@/lib/pdfProcessor";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useToast } from "@/components/ui/use-toast";

export default function ProcessPdfButton() {
  const [loading, setLoading] = useState(false);
  const [processed, setProcessed] = useState(false);
  const { toast } = useToast();

  // Check if the PDF has been processed before
  useEffect(() => {
    const hasProcessedPdf = localStorage.getItem("firstAidPdfProcessed");
    if (hasProcessedPdf === "true") {
      setProcessed(true);
    }
  }, []);

  const handleProcessPdf = async () => {
    setLoading(true);
    try {
      const result = await processFirstAidPdf();

      if (result.success) {
        toast({
          title: "PDF Processing Complete",
          description: `Successfully processed ${result.pageCount} pages into ${result.chunkCount} chunks for RAG.`,
          variant: "default",
        });
        setProcessed(true);
        localStorage.setItem("firstAidPdfProcessed", "true");
      } else {
        toast({
          title: "PDF Processing Failed",
          description: result.error || "An unknown error occurred",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error processing PDF:", error);
      toast({
        title: "PDF Processing Failed",
        description:
          error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={processed ? "ghost" : "outline"}
            size="icon"
            onClick={handleProcessPdf}
            disabled={loading}
            className={`h-9 w-9 relative ${processed ? "bg-green-900/20 text-green-500 hover:text-green-400 hover:bg-green-900/30" : ""}`}
          >
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : processed ? (
              <Check className="h-5 w-5" />
            ) : (
              <FileText className="h-5 w-5" />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          {processed
            ? "First Aid PDF Processed"
            : "Process First Aid PDF for RAG"}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
