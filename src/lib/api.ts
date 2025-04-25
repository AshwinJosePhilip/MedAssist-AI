import axios from "axios";
import { searchMedlinePlus } from "./medline";
import { searchPubMed } from "./pubmed";
import { vectorStore } from "./vectorstore";
import { searchPDFContent, summarizePDFDocument } from "./pdf";
import { chromaClient } from "./chromadb";
import { findNearbyHospitals } from "./hospitals";
import { getNutritionPlan } from "./nutrition";
import { getWorkoutPlan } from "./workout";
import { getFirstAidGuide } from "./firstaid";

const MISTRAL_API_URL = "https://api.mistral.ai/v1/chat/completions";

async function getRelevantContext(query: string) {
  // Determine query type
  const isFirstAid =
    /emergency|first aid|urgent|bleeding|burn|injury|wound|accident|cpr|choking|fracture|poison|heart attack|stroke|seizure|shock|circulatory shock|hypovolemic shock|animal bite|dog bite|snake bite|bite|bitten/i.test(
      query,
    );
  const isHospital =
    /hospital|clinic|emergency room|doctor|physician|medical center/i.test(
      query,
    );
  const isNutrition = /diet|nutrition|food|meal|eating|weight/i.test(query);
  const isWorkout =
    /workout|exercise|fitness|training|gym|cardio|strength/i.test(query);

  try {
    // This is a RAG (Retrieval-Augmented Generation) system that retrieves information exclusively from PubMed for medical queries
    // Get information from APIs based on query type
    const [
      pubmedResults,
      hospitals,
      nutritionPlan,
      workoutPlan,
      firstAidGuide,
      pdfResults,
      chromaResults,
      similarDocs,
    ] = await Promise.all([
      searchPubMed(query),
      isHospital ? findNearbyHospitals(query) : Promise.resolve([]),
      isNutrition
        ? getNutritionPlan(
            query.toLowerCase().includes("diabetes")
              ? "diabetes"
              : "hypertension",
          )
        : Promise.resolve(null),
      isWorkout
        ? getWorkoutPlan(
            query.toLowerCase().includes("strength")
              ? "strength"
              : query.toLowerCase().includes("beginner")
                ? "beginner"
                : "cardio",
          )
        : Promise.resolve(null),
      isFirstAid ? getFirstAidGuide(query) : Promise.resolve(null),
      searchPDFContent(query),
      chromaClient
        .queryCollection("medical-documents", query, 5, {
          source: "PDF" // Filter to only include PDF sources
        })
        .catch(() => []),
      vectorStore.similaritySearch(query),
    ]);

    let context = "";
    let sources = [];
    
    // For first aid queries, ONLY use PDF and ChromaDB results
    if (isFirstAid) {
      // Clear any existing context to ensure we only use PDF-based information
      context = "";
      sources = [];
      
      // Add ChromaDB results if available - prioritize these for first aid as they contain the PDF content
      if (chromaResults && chromaResults.length > 0) {
        // Sort by relevance (distance)
        chromaResults.sort((a, b) => a.distance - b.distance);
        
        context += "\nFIRST AID INFORMATION FROM MEDICAL DOCUMENTS (STRICTLY FROM PDF):\n";
        chromaResults.forEach((result) => {
          // Only include highly relevant results with stricter threshold (distance < 0.25)
          // This ensures only the most relevant content is used
          if (result.distance < 0.25 || (result.containsKeywords && result.distance < 0.35)) {            
            context += `- ${result.text}\n`;
            // Extract source information from the text if it contains "Source:" at the end
            const sourceMatch = result.text.match(/Source: ([^(]+)\s*\(([^)]+)\)/);
            if (sourceMatch) {
              sources.push({
                type: "PDF",
                title: sourceMatch[1].trim(),
                url: sourceMatch[2].trim(),
              });
            } else {
              sources.push({
                type: "PDF",
                title: result.metadata.title || "First Aid Document",
                page: result.metadata.pageNumber,
                url: result.metadata.url || "",
              });
            }
          }
        });
      }
      
      // Add PDF content if available and we don't have ChromaDB results
      if ((context === "" || sources.length === 0) && pdfResults.length > 0) {
        context += "\nFIRST AID INFORMATION FROM MEDICAL DOCUMENTS:\n";
        pdfResults.forEach((doc) => {
          context += `- ${doc.text}\n`;
          sources.push({ type: "PDF", title: `First Aid Document page ${doc.pageNumber}` });
        });
      }
      
      // If we still don't have any context, use vector store as last resort
      if (context === "" && similarDocs && similarDocs.length > 0) {
        context += "\nFIRST AID INFORMATION FROM MEDICAL KNOWLEDGE BASE:\n";
        similarDocs.forEach(([doc, score]) => {
          if (doc.pageContent.toLowerCase().includes("first aid") && score > 0.7) {
            context += `- ${doc.pageContent}\n`;
            sources.push({
              type: "PDF",
              title: doc.metadata?.title || "First Aid Document",
              url: doc.metadata?.url || "",
            });
          }
        });
      }
      
      // If we have a structured first aid guide from firstaidRAG, use it
      if (firstAidGuide) {
        context += `\nSTRUCTURED FIRST AID GUIDE FOR ${firstAidGuide.condition.toUpperCase()}:\n`;
        context += `Emergency: ${firstAidGuide.emergency ? "Yes" : "No"}\n`;
        context += `Time Frame: ${firstAidGuide.timeFrame}\n`;
        context += "Steps:\n";
        firstAidGuide.steps.forEach((step, index) => {
          context += `${index + 1}. ${step.instruction}${step.important ? " (IMPORTANT)" : ""}\n`;
          if (step.description) {
            context += `   ${step.description}\n`;
          }
        });
        context += "\nDo NOT:\n";
        firstAidGuide.doNotDo.forEach((item) => {
          context += `- ${item}\n`;
        });
        
        // Add source if available
        if (firstAidGuide.source) {
          context += `\nSource: ${firstAidGuide.source}\n`;
          sources.push({
            type: "PDF",
            title: firstAidGuide.source,
            url: "",
          });
        }
      }
      
      // Return early for first aid queries to ensure we ONLY use PDF content
      return {
        context,
        sources,
        hospitals: undefined,
        nutritionPlan: undefined,
        workoutPlan: undefined,
        firstAidGuide,
        isFirstAid,
        pubmedResults: [],
      };
    }

    // We're exclusively using PubMed as our medical information source

    // Process PubMed results - EXCLUSIVE source for medical information
    if (pubmedResults.length > 0) {
      // Clear any existing context to ensure we ONLY use PubMed
      context = "\nEXCLUSIVE SOURCE - Medical Research from PubMed:\n";
      sources = [];
      
      for (const doc of pubmedResults) {
        const text = `${doc.title}\n${doc.description || doc.abstract || ""}`;
        context += `- ${text}\n`;
        // Store in vector database
        await vectorStore.addDocument(text, {
          source: "PubMed",
          title: doc.title,
          url: `https://pubmed.ncbi.nlm.nih.gov/${doc.uid}/`,
        });
        // Add to sources array - PubMed is our only source
        sources.push({
          type: "PubMed",
          title: doc.title,
          url: `https://pubmed.ncbi.nlm.nih.gov/${doc.uid}/`,
        });
      }
    }

    // Add similar content from vector store
    if (similarDocs.length > 0) {
      context += "\nRelated Medical Information:\n";
      similarDocs.forEach(([doc, score]) => {
        // Only include highly relevant results (score > 0.7)
        if (score > 0.7) {
          context += `- [${doc.metadata?.source || "Source"}] ${doc.pageContent}\n`;
        }
      });
    }

    // Add PDF content if available
    if (pdfResults.length > 0) {
      context += "\nFrom Medical Documents:\n";
      pdfResults.forEach((doc) => {
        context += `- [PDF Document] ${doc.text}\n`;
        sources.push({ type: "PDF", title: `Document page ${doc.pageNumber}` });
      });
    }

    // Add ChromaDB results if available
    if (chromaResults.length > 0) {
      context += "\nFrom Medical Knowledge Base:\n";
      chromaResults.forEach((result) => {
        // Only include highly relevant results (distance < 0.3)
        if (result.distance < 0.3) {
          context += `- [${result.metadata.title || "Medical Document"}] ${result.text}\n`;
          // Extract source information from the text if it contains "Source:" at the end
          const sourceMatch = result.text.match(/Source: ([^(]+)\s*\(([^)]+)\)/);
          if (sourceMatch) {
            sources.push({
              type: "PDF",
              title: sourceMatch[1].trim(),
              url: sourceMatch[2].trim(),
            });
          } else {
            sources.push({
              type: "PDF",
              title: result.metadata.title || "Medical Document",
              page: result.metadata.pageNumber,
              url: result.metadata.url || "",
            });
          }
        }
      });
    }

    // Add hospital information if available
    if (isHospital && hospitals.length > 0) {
      context += "\nNearby Hospitals:\n";
      hospitals.forEach((hospital) => {
        context += `- ${hospital.name} (${hospital.distance}): ${hospital.address}\nPhone: ${hospital.phone}\n`;
      });
    }

    // Add nutrition plan if available
    if (isNutrition && nutritionPlan) {
      context += "\nRecommended Meal Plan:\n";
      nutritionPlan.meals.forEach((meal) => {
        context += `${meal.time}:\n- ${meal.food.join("\n- ")}\n`;
      });
    }

    // Add workout plan if available
    if (isWorkout && workoutPlan) {
      context += "\nRecommended Workout Plan:\n";
      workoutPlan.workouts.forEach((workout) => {
        context += `${workout.name} (${workout.duration}, ${workout.frequency}):\n`;
        workout.exercises.forEach((exercise) => {
          context += `- ${exercise.name}: ${exercise.sets} sets of ${exercise.reps}\n`;
        });
      });
    }

    // Add first aid guide if available
    if (isFirstAid && firstAidGuide) {
      context += `\nFirst Aid Guide for ${firstAidGuide.condition}:\n`;
      context += `Emergency: ${firstAidGuide.emergency ? "Yes" : "No"}\n`;
      context += `Time Frame: ${firstAidGuide.timeFrame}\n`;
      context += "Steps:\n";
      firstAidGuide.steps.forEach((step, index) => {
        context += `${index + 1}. ${step.instruction}${step.important ? " (IMPORTANT)" : ""}\n`;
        if (step.description) {
          context += `   ${step.description}\n`;
        }
      });
      context += "\nDo NOT:\n";
      firstAidGuide.doNotDo.forEach((item) => {
        context += `- ${item}\n`;
      });
    }

    return {
      context,
      sources,
      hospitals: isHospital ? hospitals : undefined,
      nutritionPlan: isNutrition ? nutritionPlan : undefined,
      workoutPlan: isWorkout ? workoutPlan : undefined,
      firstAidGuide: isFirstAid ? firstAidGuide : undefined,
      isFirstAid,
      pubmedResults,
    };
  } catch (error) {
    console.error("Error fetching medical context:", error);
    return { context: "", sources: [] };
  }
}

export const chatWithMistral = async (
  messages: Array<{ role: string; content: string }>,
) => {
  try {
    // Get the user's latest message
    const userMessage = messages[messages.length - 1].content;

    // Fetch relevant medical information
    const {
      context,
      sources,
      hospitals,
      nutritionPlan,
      workoutPlan,
      firstAidGuide,
      isFirstAid,
      pubmedResults,
    } = await getRelevantContext(userMessage);

    // Add context to the system message
    const systemMessage = {
      role: "system",
      content: isFirstAid
        ? `You are a first aid assistant. You MUST ONLY use the following information from the official First Aid PDF document to provide accurate responses. You MUST NOT use any other knowledge or make up information that is not explicitly stated in the provided context. If the specific information requested is not in the provided context, clearly state that you don't have that specific information from the First Aid PDF. Always cite your sources by mentioning "According to the First Aid PDF" in your response. Here is the relevant information from the vectorized PDF content: ${context}`
        : `You are a medical assistant providing health information based EXCLUSIVELY on PubMed research. You MUST ONLY use the PubMed information provided in the context to answer the user's question. Do not reference or use information from Mayo Clinic, WebMD, MedlinePlus, or any other general medical websites. If the information is not available in the provided PubMed context, acknowledge the limitations and suggest that more specific PubMed research might be needed. Always cite PubMed as your source. Here is the relevant information from PubMed: ${context}`
    };

    // Create a new array with the system message first, followed by user messages
    const messagesWithContext = [systemMessage, ...messages];

    // Make the API call to Mistral
    const response = await axios.post(
      MISTRAL_API_URL,
      {
        model: "mistral-medium", // Use appropriate model
        messages: messagesWithContext,
        temperature: 0.7,
        max_tokens: 1024,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_MISTRAL_API_KEY}`,
        },
      }
    );

    // Extract the assistant's response
    const assistantResponse = response.data.choices[0].message.content;

    // Determine query types based on the user message
    const isHospital = /hospital|clinic|emergency room|doctor|physician|medical center/i.test(userMessage);
    const isNutrition = /diet|nutrition|food|meal|eating|weight/i.test(userMessage);
    const isWorkout = /workout|exercise|fitness|training|gym|cardio|strength/i.test(userMessage);
    
    // Return both the context information and the generated response
    return {
      context,
      sources,
      hospitals: isHospital ? hospitals : undefined,
      nutritionPlan: isNutrition ? nutritionPlan : undefined,
      workoutPlan: isWorkout ? workoutPlan : undefined,
      firstAidGuide: isFirstAid ? firstAidGuide : undefined,
      isFirstAid,
      pubmedResults,
      response: assistantResponse,
    };
  } catch (error) {
    console.error("Error in chatWithMistral:", error);
    return { context: "", sources: [], response: "Sorry, I encountered an error processing your request." };
  }
<<<<<<< HEAD
};

// Function to generate a summary of a medical document using AI
export async function generateDocumentSummary(documentId: string) {
  try {
    // In a real implementation, this would call an AI service to generate a summary
    // For now, we'll use the mock implementation in pdf.ts
    const summary = await summarizePDFDocument(documentId);
    return summary;
  } catch (error) {
    console.error("Error generating document summary:", error);
    throw error;
  }
=======
>>>>>>> 60ad4590a28d38bff88b365648d8f84d72beb42f
}
