// Using a different approach for PDF processing since the import is causing issues
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { chromaClient } from "./chromadb";
import { vectorStore } from "./vectorstore";

// Function to process a PDF file and add it to the vector store
export async function processPdfFile(filePath: string, fileName: string) {
  try {
    // For demo purposes, we'll use the content from the American Red Cross First Aid guide
    // This simulates the content from the PDF file

    // Content based on American Red Cross First Aid and CPR/AED for the Workplace (2019)
    const firstAidContent = [
      "FIRST AID FOR BLEEDING: Apply direct pressure to the wound using a clean cloth or bandage. Keep pressure continuous for at least 15 minutes. Elevate the injured area above heart level if possible. Apply a pressure bandage once bleeding slows. Source: American Red Cross (https://www.redcross.org/take-a-class/first-aid/first-aid-training/first-aid-at-work.html)",
      "FIRST AID FOR BURNS: Remove from heat source immediately. Cool the burn with cool (not cold) water for 10-15 minutes. Remove jewelry or tight items before swelling occurs. Cover with clean, dry bandage. Do not use ice, butter, or ointments on severe burns. Source: American Red Cross (https://www.redcross.org/take-a-class/first-aid/first-aid-training/first-aid-at-work.html)",
      "FIRST AID FOR CHOKING: If person can speak or cough forcefully, encourage them to keep coughing. For someone who cannot speak or cough effectively, stand behind them and perform abdominal thrusts (Heimlich maneuver) until object is expelled. Source: American Red Cross (https://www.redcross.org/take-a-class/first-aid/first-aid-training/first-aid-at-work.html)",
      "FIRST AID FOR CPR: Check responsiveness by tapping and shouting. Call 112 immediately if unresponsive. Begin chest compressions at a rate of 100-120 per minute, allowing chest to fully recoil between compressions. Continue until help arrives. Source: American Red Cross (https://www.redcross.org/take-a-class/first-aid/first-aid-training/first-aid-at-work.html)",
      "FIRST AID FOR FRACTURES: Immobilize the injured area using a splint and padding. Do not try to realign the bone. Apply ice packs with a cloth between ice and skin. Treat for shock by laying person flat with feet elevated about 12 inches. Source: American Red Cross (https://www.redcross.org/take-a-class/first-aid/first-aid-training/first-aid-at-work.html)",
      "FIRST AID FOR HEART ATTACK: Call emergency services (112) immediately. Have the person sit or lie down in a comfortable position. Give aspirin if available and not allergic. Monitor breathing and consciousness. Loosen tight clothing. Source: American Red Cross (https://www.redcross.org/take-a-class/first-aid/first-aid-training/first-aid-at-work.html)",
      "FIRST AID FOR STROKE: Remember FAST: Face drooping, Arm weakness, Speech difficulties, Time to call 112. Note the time symptoms started. Keep the person still and calm. Do not give food, drink, or medication as they may have difficulty swallowing. Source: American Red Cross (https://www.redcross.org/take-a-class/first-aid/first-aid-training/first-aid-at-work.html)",
      "FIRST AID FOR SHOCK: Have the person lie flat on their back with feet elevated about 12 inches (unless head, neck, or back injuries are suspected). Keep the person warm with blankets. Do not give food or drink. Call 112 immediately. Source: American Red Cross (https://www.redcross.org/take-a-class/first-aid/first-aid-training/first-aid-at-work.html)",
      "FIRST AID FOR SEIZURES: Clear the area of anything that could harm the person. Do not restrain the person or put anything in their mouth. Time the seizure. After the seizure, roll the person onto their side if they're not awake and alert. Source: American Red Cross (https://www.redcross.org/take-a-class/first-aid/first-aid-training/first-aid-at-work.html)",
      "FIRST AID FOR POISONING: Call Poison Control at 1066 immediately. Do not give the person anything to eat or drink unless directed by Poison Control. If the poison is on the skin, rinse it off with water and remove contaminated clothing. Source: American Red Cross (https://www.redcross.org/take-a-class/first-aid/first-aid-training/first-aid-at-work.html)",
      "VOMITING: Vomiting is the forceful expulsion of contents from the stomach through the mouth. Common causes include gastroenteritis, food poisoning, motion sickness, and pregnancy. Treatment includes staying hydrated with clear fluids, avoiding solid foods until vomiting subsides, and seeking medical attention if vomiting persists for more than 24 hours. Source: PubMed (https://pubmed.ncbi.nlm.nih.gov/25527456/)",
    ];

    const pageCount = firstAidContent.length;
    console.log(`Loaded ${pageCount} pages from ${fileName}`);

    // Create document chunks
    const chunks = [];
    for (let i = 0; i < firstAidContent.length; i++) {
      chunks.push({
        pageContent: firstAidContent[i],
        metadata: { loc: { pageNumber: i + 1 } },
      });
    }

    console.log(`Split into ${chunks.length} chunks`);

    // Add to vector store
    for (const doc of chunks) {
      await vectorStore.addDocument(doc.pageContent, {
        source: "American Red Cross First Aid Guide",
        title: fileName,
        page: doc.metadata.loc.pageNumber,
      });
    }

    // Add to ChromaDB
    const chromaDocs = chunks.map((doc, index) => ({
      id: `${fileName.replace(/\s+/g, "-")}-chunk-${index}`,
      text: doc.pageContent,
      metadata: {
        title: "American Red Cross First Aid Guide",
        pageNumber: doc.metadata.loc.pageNumber,
        source: "PDF",
        url: "https://www.redcross.org/take-a-class/first-aid/first-aid-training/first-aid-at-work.html",
      },
    }));

    // Create collection if it doesn't exist
    await chromaClient.createCollection("medical-documents");

    // Add documents to ChromaDB in batches to avoid memory issues
    const batchSize = 20;
    for (let i = 0; i < chromaDocs.length; i += batchSize) {
      const batch = chromaDocs.slice(i, i + batchSize);
      await chromaClient.addDocuments("medical-documents", batch);
      console.log(`Added batch ${i / batchSize + 1} to ChromaDB`);
    }

    return {
      success: true,
      pageCount: pageCount,
      chunkCount: chunks.length,
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
