import { supabase } from "./supabase";

// Interface for PDF document metadata
interface PDFDocumentMetadata {
  id: string;
  title: string;
  author?: string;
  uploadedAt: string;
  fileSize: number;
  pageCount: number;
}

// Interface for extracted PDF content
interface PDFContent {
  documentId: string;
  pageNumber: number;
  text: string;
  embedding?: number[];
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
): Promise<string | null> {
  // Mock implementation
  return "mock-doc-1";
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
      },
    ];
  } catch (error) {
    console.error("Error in getAllPDFDocuments:", error);
    return [];
  }
}
