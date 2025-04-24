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
    /emergency|first aid|urgent|bleeding|burn|injury|wound|accident|cpr|choking|fracture|poison|heart attack|stroke|seizure|shock/i.test(
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
    // This is a RAG (Retrieval-Augmented Generation) system that retrieves information from multiple sources
    // Get information from APIs based on query type
    const [
      medlineResults,
      pubmedResults,
      hospitals,
      nutritionPlan,
      workoutPlan,
      firstAidGuide,
      pdfResults,
      chromaResults,
    ] = await Promise.all([
      searchMedlinePlus(query),
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
        .queryCollection("medical-documents", query, 3)
        .catch(() => []),
    ]);

    let context = "";
    const sources = [];

    // Process MedlinePlus results
    if (medlineResults.length > 0) {
      context += "\nMedlinePlus Information:\n";
      for (const doc of medlineResults) {
        const text = `${doc.title}\n${doc.snippet}`;
        context += `- ${text}\n`;
        // Store in vector database
        await vectorStore.addDocument(text, {
          source: "MedlinePlus",
          title: doc.title,
          url: doc.url,
        });
        sources.push({ type: "MedlinePlus", title: doc.title, url: doc.url });
      }
    }

    // Process PubMed results
    if (pubmedResults.length > 0) {
      context += "\nRecent Research (PubMed):\n";
      for (const doc of pubmedResults) {
        const text = `${doc.title}\n${doc.description || doc.abstract || ""}`;
        context += `- ${text}\n`;
        // Store in vector database
        await vectorStore.addDocument(text, {
          source: "PubMed",
          title: doc.title,
          url: `https://pubmed.ncbi.nlm.nih.gov/${doc.uid}/`,
        });
        sources.push({
          type: "PubMed",
          title: doc.title,
          url: `https://pubmed.ncbi.nlm.nih.gov/${doc.uid}/`,
        });
      }
    }

    // Query vector store for similar content
    const similarDocs = await vectorStore.similaritySearch(query);
    if (similarDocs.length > 0) {
      context += "\nRelated Medical Information:\n";
      similarDocs.forEach(([doc, score]) => {
        context += `- [${doc.metadata?.source || "Source"}] ${doc.pageContent}\n`;
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
      content: `You are an Indian medical AI assistant. Use the following verified medical information from PubMed and other trusted sources to provide accurate responses. Keep your responses concise and user-friendly. Remember to emphasize that you are not a replacement for professional medical care. For emergencies, always recommend calling 112 (Indian emergency number) or 1066 (poison control) instead of 911. IMPORTANT: Always end your response with the source citation in the format "Source: PubMed (URL)". For example, "Source: PubMed (https://pubmed.ncbi.nlm.nih.gov/12345678/)". Only use PubMed as the source, even if the information comes from elsewhere.\n\nRelevant Medical Information:\n${context}`,
    };

    const response = await axios.post(
      MISTRAL_API_URL,
      {
        model: "mistral-tiny",
        messages: [systemMessage, ...messages],
        temperature: 0.7,
        max_tokens: 1000,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_MISTRAL_API_KEY}`,
        },
      },
    );

    return {
      response: response.data.choices[0].message.content,
      hospitals,
      nutritionPlan,
      workoutPlan,
      firstAidGuide,
      isFirstAid,
      sources,
      pubmedArticles: pubmedResults,
    };
  } catch (error) {
    console.error("Error calling Mistral API:", error);
    throw error;
  }
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
}
