import axios from "axios";
import { searchMedlinePlus } from "./medline";
import { searchPubMed } from "./pubmed";
import { vectorStore } from "./vectorstore";
import { findNearbyHospitals } from "./hospitals";
import { getNutritionPlan } from "./nutrition";

const MISTRAL_API_URL = "https://api.mistral.ai/v1/chat/completions";

async function getRelevantContext(query: string) {
  // Determine query type
  const isFirstAid =
    /emergency|first aid|urgent|bleeding|burn|injury|wound|accident/i.test(
      query,
    );
  const isHospital =
    /hospital|clinic|emergency room|doctor|physician|medical center/i.test(
      query,
    );
  const isNutrition = /diet|nutrition|food|meal|eating|weight/i.test(query);

  try {
    // Get information from APIs based on query type
    const [medlineResults, pubmedResults, hospitals, nutritionPlan] =
      await Promise.all([
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
        });
        sources.push({ type: "PubMed", title: doc.title });
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

    return {
      context,
      sources,
      hospitals: isHospital ? hospitals : undefined,
      nutritionPlan: isNutrition ? nutritionPlan : undefined,
      isFirstAid,
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
    const { context, sources, hospitals, nutritionPlan, isFirstAid } =
      await getRelevantContext(userMessage);

    // Add context to the system message
    const systemMessage = {
      role: "system",
      content: `You are a medical AI assistant. Use the following verified medical information to provide accurate responses. Always cite your sources and include disclaimers when appropriate. Remember to emphasize that you are not a replacement for professional medical care.\n\nRelevant Medical Information:\n${context}`,
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
      isFirstAid,
    };
  } catch (error) {
    console.error("Error calling Mistral API:", error);
    throw error;
  }
};
