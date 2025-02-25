import axios from "axios";

const PUBMED_API_URL = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils";

export async function searchPubMed(query: string) {
  try {
    // First get IDs
    const searchResponse = await axios.get(`${PUBMED_API_URL}/esearch.fcgi`, {
      params: {
        db: "pubmed",
        term: query,
        retmax: 3,
        retmode: "json",
      },
    });

    const ids = searchResponse.data.esearchresult.idlist;

    // Then get summaries
    const summaryResponse = await axios.get(`${PUBMED_API_URL}/esummary.fcgi`, {
      params: {
        db: "pubmed",
        id: ids.join(","),
        retmode: "json",
      },
    });

    return Object.values(summaryResponse.data.result).filter(
      (item) => typeof item === "object",
    );
  } catch (error) {
    console.error("Error searching PubMed:", error);
    return [];
  }
}
