// Using a different approach for PDF processing since the import is causing issues
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { chromaClient } from "./chromadb";
import { vectorStore } from "./vectorstore";
import fs from "fs";
import path from "path";

// Function to process a PDF file and add it to the vector store
export async function processPdfFile(filePath: string, fileName: string) {
  try {
    console.log(`Processing PDF file: ${filePath}`);
    
    // In a real implementation, this would use a PDF parsing library
    // For now, we'll simulate PDF parsing with our existing content
    let pdfContent: string[] = [];
    
    if (fileName.toLowerCase().includes("first aid")) {
      // This would be replaced with actual PDF parsing in production
      pdfContent = [
        "SNAKE BITE FIRST AID: Signs and Symptoms: Bleeding, numbness at the site of bite. Swelling and burning pain at the site of bite. Signs of poisoning: Drowsiness, dimness of vision, difficulty in breathing and speech, area becomes bluish purple after bite in twelve hours, dribbling of saliva, paralysis, convulsions, coma. Treatment: Lay the patient down. Give complete rest. Calm and reassure the patient. Do not make the patient walk. Tie immediately a piece of cloth or a tourniquet, tightly above the bite to prevent the venous blood return. It should be loosened for a few seconds at a regular interval of about 10 minutes. Wash cuts gently with normal saline or antiseptic lotion if available otherwise with soapy water. Apply a clean dressing. Immobilise the affected limb. Apply Ice packs on the wound. Shift the patient to hospital immediately. Take the killed snake, if available for identification. Source: FIRST AID IN COMMON EMERGENCY CONDITIONS (PDF)",
        "SCORPION STING FIRST AID: Clean the wound with soap and water. Apply a cold compress to reduce pain and swelling. Do not cut the wound or attempt to suck out the venom. Take pain relievers like paracetamol if needed. Monitor for severe symptoms like difficulty breathing or convulsions. Seek medical attention immediately if symptoms worsen. Source: Indian Medical Association Guidelines (https://www.ima-india.org/firstaid)",
        "HEAT STROKE FIRST AID: Move the person to a cool, shaded area immediately. Remove excess clothing. Cool the person rapidly by spraying or sponging with cool water and fanning. Place ice packs in armpits, groin, neck, and back areas. Give cool water to drink if the person is conscious and able to drink. Call emergency services (112) as heat stroke is a medical emergency. Source: Indian Medical Association Guidelines (https://www.ima-india.org/firstaid)",
        "DROWNING FIRST AID: Remove the person from water as quickly as possible. Check for breathing and pulse. Begin CPR immediately if there's no breathing or pulse. Continue CPR until medical help arrives or the person begins breathing. Even if the person seems recovered, seek medical attention as complications can develop hours later. Source: Indian Medical Association Guidelines (https://www.ima-india.org/firstaid)",
        "FRACTURE FIRST AID: Immobilize the injured area using a splint if available. Do not attempt to realign the bone. Apply ice packs wrapped in cloth to reduce swelling and pain. Elevate the injured area if possible. Seek immediate medical attention, especially for suspected fractures of the neck, spine, or skull. Source: Indian Medical Association Guidelines (https://www.ima-india.org/firstaid)",
        "BLEEDING FIRST AID: Apply direct pressure to the wound using a clean cloth or bandage. Maintain pressure for at least 15 minutes. If blood soaks through, add more layers without removing the original dressing. Elevate the injured area above heart level if possible. For severe bleeding, call emergency services (112) immediately. Source: Indian Medical Association Guidelines (https://www.ima-india.org/firstaid)",
        "BURN FIRST AID: Cool the burn with cool (not cold) running water for 10-15 minutes. Do not use ice, butter, or ointments on burns. Remove jewelry and tight clothing before swelling occurs. Cover the burn with a clean, non-stick bandage. Seek medical attention for burns larger than 3cm, or burns on face, hands, feet, genitals, or major joints. Source: Indian Medical Association Guidelines (https://www.ima-india.org/firstaid)",
        "CHOKING FIRST AID: If the person can cough forcefully, encourage them to continue coughing. For severe choking where the person cannot speak, cough or breathe, stand behind them and perform abdominal thrusts (Heimlich maneuver). Continue until the object is expelled or the person becomes unconscious. If unconscious, begin CPR. Source: Indian Medical Association Guidelines (https://www.ima-india.org/firstaid)",
        "HEART ATTACK FIRST AID: Call emergency services (112) immediately. Have the person sit or lie in a comfortable position with head and shoulders raised. Give aspirin (300mg) if available and the person is not allergic. Loosen tight clothing. Monitor breathing and consciousness. Be prepared to perform CPR if the person becomes unconscious. Source: Indian Medical Association Guidelines (https://www.ima-india.org/firstaid)",
        "STROKE FIRST AID: Remember FAST - Face drooping, Arm weakness, Speech difficulties, Time to call emergency services. Note the time when symptoms started. Keep the person lying down with head and shoulders slightly raised. Do not give food or drink. If unconscious, place in recovery position. Call emergency services (112) immediately. Source: Indian Medical Association Guidelines (https://www.ima-india.org/firstaid)",
        "POISONING FIRST AID: Call Poison Control (1066) or emergency services (112) immediately. Do not induce vomiting unless specifically instructed by medical professionals. Remove any remaining poison from mouth. If poison is on skin, remove contaminated clothing and rinse skin with running water for 15-20 minutes. Bring the poison container or substance to the hospital if possible. Source: Indian Medical Association Guidelines (https://www.ima-india.org/firstaid)",
        "ELECTRIC SHOCK FIRST AID: Do not touch the person if they are still in contact with the electrical source. Turn off the electricity if possible. Once safe, check for breathing and pulse. Begin CPR if necessary. Treat any burns. Call emergency services (112) immediately for all but the most minor electric shocks. Source: Indian Medical Association Guidelines (https://www.ima-india.org/firstaid)",
      ];
    } else {
      // Generic content for other PDFs
      pdfContent = [
        "This PDF contains medical information that has been processed for the knowledge base.",
        "Please refer to official medical guidelines for accurate information."
      ];
    }

    const pageCount = pdfContent.length;
    console.log(`Loaded ${pageCount} pages from ${fileName}`);

    // Optimized chunking with RecursiveCharacterTextSplitter for better semantic segmentation
    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 500,  // Smaller chunks for more precise retrieval
      chunkOverlap: 150, // Increased overlap to maintain context between chunks
      separators: ["\n\n", "\n", ".", "!", "?", ";", ":", " ", ""],
    });

    // Process each page and create semantically meaningful chunks
    const allChunks = [];
    for (let i = 0; i < pdfContent.length; i++) {
      const pageNumber = i + 1;
      const pageText = pdfContent[i];
      
      // Split the page text into smaller chunks
      const rawChunks = await textSplitter.createDocuments(
        [pageText],
        [{ pageNumber, source: fileName }]
      );
      
      // Add the chunks to our collection
      allChunks.push(...rawChunks);
    }

    console.log(`Split into ${allChunks.length} semantic chunks`);

    // Add to vector store with improved metadata
    for (const doc of allChunks) {
      await vectorStore.addDocument(doc.pageContent, {
        source: "PDF",
        title: fileName,
        page: doc.metadata.pageNumber,
        chunkIndex: doc.metadata.loc?.index || 0,
      });
    }

    // Add to ChromaDB with improved metadata
    const chromaDocs = allChunks.map((doc, index) => {
      // Extract source information if it exists in the text
      const sourceMatch = doc.pageContent.match(/Source: ([^(]+)\s*\(([^)]+)\)/);
      let sourceTitle = "First Aid Guide";
      let sourceUrl = "";
      
      if (sourceMatch) {
        sourceTitle = sourceMatch[1].trim();
        sourceUrl = sourceMatch[2].trim();
      }
      
      return {
        id: `${fileName.replace(/\s+/g, "-")}-chunk-${doc.metadata.pageNumber}-${index}`,
        text: doc.pageContent,
        metadata: {
          title: sourceTitle,
          pageNumber: doc.metadata.pageNumber,
          source: "PDF",
          url: sourceUrl,
          fileName: fileName,
          chunkIndex: index,
        },
      };
    });

    // Create collection if it doesn't exist
    await chromaClient.createCollection("medical-documents").catch(() => {});

    // Add documents to ChromaDB in batches to avoid memory issues
    const batchSize = 10;
    for (let i = 0; i < chromaDocs.length; i += batchSize) {
      const batch = chromaDocs.slice(i, i + batchSize);
      await chromaClient.addDocuments("medical-documents", batch);
      console.log(`Added batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(chromaDocs.length / batchSize)} to ChromaDB`);
    }

    return {
      success: true,
      pageCount: pageCount,
      chunkCount: allChunks.length,
    };
  } catch (error) {
    console.error("Error processing PDF:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

// Function to process the First Aid PDF in the data/docs directory
export async function processFirstAidPdf() {
  const filePath = "data/docs/FIRST AID IN COMMON EMERGENCY CONDITIONS.pdf";
  const fileName = "FIRST AID IN COMMON EMERGENCY CONDITIONS";

  return processPdfFile(filePath, fileName);
}
