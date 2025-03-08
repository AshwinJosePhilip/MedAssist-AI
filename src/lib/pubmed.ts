import axios from "axios";

const PUBMED_API_URL = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils";
const PUBMED_API_KEY = import.meta.env.VITE_PUBMED_API_KEY;

export async function searchPubMed(query: string) {
  try {
    // First get IDs
    const searchResponse = await axios.get(`${PUBMED_API_URL}/esearch.fcgi`, {
      params: {
        db: "pubmed",
        term: query,
        retmax: 5,
        retmode: "json",
        api_key: PUBMED_API_KEY,
        sort: "relevance",
      },
    });

    const ids = searchResponse.data.esearchresult.idlist;

    if (ids.length === 0) {
      return [];
    }

    // Then get summaries
    const summaryResponse = await axios.get(`${PUBMED_API_URL}/esummary.fcgi`, {
      params: {
        db: "pubmed",
        id: ids.join(","),
        retmode: "json",
        api_key: PUBMED_API_KEY,
      },
    });

    // Process and enhance the results
    const results = Object.values(summaryResponse.data.result)
      .filter((item) => typeof item === "object")
      .map((item: any) => {
        // Add a formatted URL for each article
        if (item.uid) {
          item.formattedUrl = `https://pubmed.ncbi.nlm.nih.gov/${item.uid}/`;
        }
        return item;
      });

    // Add to vector store for future retrieval
    for (const article of results) {
      if (article.title && article.uid) {
        const content = `${article.title}\n${article.description || article.abstract || ""}\nSource: PubMed (https://pubmed.ncbi.nlm.nih.gov/${article.uid}/)`;

        // Add to ChromaDB collection
        try {
          const chromaClient = (await import("./chromadb")).chromaClient;
          await chromaClient
            .createCollection("medical-documents")
            .catch(() => {});
          await chromaClient.addDocuments("medical-documents", [
            {
              id: `pubmed-${article.uid}`,
              text: content,
              metadata: {
                title: "PubMed Article",
                source: "PubMed",
                url: `https://pubmed.ncbi.nlm.nih.gov/${article.uid}/`,
              },
            },
          ]);
        } catch (e) {
          console.error("Error adding PubMed article to ChromaDB:", e);
        }
      }
    }

    return results;
  } catch (error) {
    console.error("Error searching PubMed:", error);
    return [];
  }
}
