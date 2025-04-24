import { supabase } from "./supabase";

// Interface for PDF document metadata
interface PDFDocumentMetadata {
  id: string;
  title: string;
  author?: string;
  uploadedAt: string;
  fileSize: number;
  pageCount: number;
  hasSummary?: boolean;
  summaryId?: string;
}

// Interface for extracted PDF content
interface PDFContent {
  documentId: string;
  pageNumber: number;
  text: string;
  embedding?: number[];
}

// Interface for summarized report
export interface SummarizedReport {
  id: string;
  documentId: string;
  summary: string;
  createdAt: string;
}

// Function to search PDF content
export async function searchPDFContent(query: string): Promise<PDFContent[]> {
  try {
    // Mock search results for demo purposes
    if (
      query.toLowerCase().includes("first aid") ||
      query.toLowerCase().includes("emergency") ||
      query.toLowerCase().includes("bleeding") ||
      query.toLowerCase().includes("burn") ||
      query.toLowerCase().includes("cpr") ||
      query.toLowerCase().includes("choking")
    ) {
      // Return mock results based on the query
      const mockResults = [];

      if (query.toLowerCase().includes("bleeding")) {
        mockResults.push({
          documentId: "mock-doc-1",
          pageNumber: 1,
          text: "FIRST AID FOR BLEEDING: Apply direct pressure to the wound using a clean cloth or bandage. Keep pressure continuous for at least 15 minutes. Elevate the injured area above heart level if possible. Apply a pressure bandage once bleeding slows.",
        });
      }

      if (query.toLowerCase().includes("burn")) {
        mockResults.push({
          documentId: "mock-doc-1",
          pageNumber: 2,
          text: "FIRST AID FOR BURNS: Remove from heat source immediately. Cool the burn with cool (not cold) water for 10-15 minutes. Remove jewelry or tight items before swelling occurs. Cover with clean, dry bandage. Do not use ice, butter, or ointments on severe burns.",
        });
      }

      if (query.toLowerCase().includes("choking")) {
        mockResults.push({
          documentId: "mock-doc-1",
          pageNumber: 3,
          text: "FIRST AID FOR CHOKING: If person can speak or cough forcefully, encourage them to keep coughing. For someone who cannot speak or cough effectively, stand behind them and perform abdominal thrusts (Heimlich maneuver) until object is expelled.",
        });
      }

      if (query.toLowerCase().includes("cpr")) {
        mockResults.push({
          documentId: "mock-doc-1",
          pageNumber: 4,
          text: "FIRST AID FOR CPR: Check responsiveness by tapping and shouting. Call 911 immediately if unresponsive. Begin chest compressions at a rate of 100-120 per minute, allowing chest to fully recoil between compressions. Continue until help arrives.",
        });
      }

      // If no specific matches or general first aid query, return a general result
      if (mockResults.length === 0) {
        mockResults.push({
          documentId: "mock-doc-1",
          pageNumber: 1,
          text: "GENERAL FIRST AID: Always ensure the scene is safe before providing assistance. For any serious emergency, call 911 immediately. Keep the person still and calm. Monitor breathing and consciousness. Do not move a seriously injured person unless in immediate danger.",
        });
      }

      return mockResults;
    }

    // Return empty array for non-first aid queries
    return [];
  } catch (error) {
    console.error("Error searching PDF content:", error);
    return [];
  }
}

// Function to upload a PDF file
export async function uploadPDF(file: File): Promise<string | null> {
  // Mock implementation
  return "mock-pdf-path";
}

// Function to store PDF metadata
export async function storePDFMetadata(
  filePath: string,
  title: string,
  author: string,
  pageCount: number,
  fileSize: number,
  shouldSummarize: boolean = false,
): Promise<string | null> {
  // Mock implementation
  const documentId = "mock-doc-1";

  // If summarization is requested, generate a summary
  if (shouldSummarize) {
    await summarizePDFDocument(documentId);
  }

  return documentId;
}

// Function to store PDF content
export async function storePDFContent(
  documentId: string,
  pageNumber: number,
  text: string,
): Promise<boolean> {
  // Mock implementation
  return true;
}

// Function to summarize a PDF document
export async function summarizePDFDocument(
  documentId: string,
): Promise<SummarizedReport | null> {
  try {
    // Mock implementation - in a real app, this would call an AI service
    // to generate a summary of the document
    const mockSummary = {
      id: "summary-1",
      documentId,
      summary:
        "This document covers essential first aid procedures for common emergency conditions. Key points include:\n\n- Bleeding control techniques: Apply direct pressure to wounds\n- CPR guidelines: 30 compressions to 2 breaths ratio\n- Burn treatment: Cool with water, do not use ice\n- Choking response: Abdominal thrusts for adults\n- Fracture care: Immobilize the area, do not attempt to realign\n\nThe document emphasizes the importance of calling emergency services promptly and provides step-by-step instructions for each condition.",
      createdAt: new Date().toISOString(),
    };

    // In a real implementation, you would update the document metadata
    // to indicate that it has a summary

    return mockSummary;
  } catch (error) {
    console.error("Error summarizing PDF document:", error);
    return null;
  }
}

// Function to get a summarized report
export async function getSummarizedReport(
  summaryId: string,
): Promise<SummarizedReport | null> {
  try {
    // Mock implementation
    return {
      id: summaryId,
      documentId: "mock-doc-1",
      summary:
        "This document covers essential first aid procedures for common emergency conditions. Key points include:\n\n- Bleeding control techniques: Apply direct pressure to wounds\n- CPR guidelines: 30 compressions to 2 breaths ratio\n- Burn treatment: Cool with water, do not use ice\n- Choking response: Abdominal thrusts for adults\n- Fracture care: Immobilize the area, do not attempt to realign\n\nThe document emphasizes the importance of calling emergency services promptly and provides step-by-step instructions for each condition.",
      createdAt: new Date().toISOString(),
    };
  } catch (error) {
    console.error("Error getting summarized report:", error);
    return null;
  }
}

// Function to get PDF document metadata
export async function getPDFDocumentMetadata(
  documentId: string,
): Promise<PDFDocumentMetadata | null> {
  try {
    // Mock metadata for demo purposes
    return {
      id: "mock-doc-1",
      title: "FIRST AID IN COMMON EMERGENCY CONDITIONS",
      author: "Medical Association",
      uploadedAt: new Date().toISOString(),
      fileSize: 1024 * 1024, // 1MB
      pageCount: 7,
      hasSummary: true,
      summaryId: "summary-1",
    };
  } catch (error) {
    console.error("Error in getPDFDocumentMetadata:", error);
    return null;
  }
}

// Function to get all PDF documents
export async function getAllPDFDocuments(): Promise<PDFDocumentMetadata[]> {
  try {
    // Mock document list for demo purposes
    return [
      {
        id: "mock-doc-1",
        title: "FIRST AID IN COMMON EMERGENCY CONDITIONS",
        author: "Medical Association",
        uploadedAt: new Date().toISOString(),
        fileSize: 1024 * 1024, // 1MB
        pageCount: 7,
        hasSummary: true,
        summaryId: "summary-1",
      },
    ];
  } catch (error) {
    console.error("Error in getAllPDFDocuments:", error);
    return [];
  }
}
