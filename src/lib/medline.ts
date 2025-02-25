import axios from "axios";

const MEDLINE_API_URL = "https://wsearch.nlm.nih.gov/ws/query";

interface MedlinePlusResult {
  title: string;
  snippet: string;
  url: string;
}

export async function searchMedlinePlus(
  query: string,
): Promise<MedlinePlusResult[]> {
  try {
    const response = await axios.get(MEDLINE_API_URL, {
      params: {
        db: "healthTopics",
        term: query,
        retmax: 5,
      },
      headers: {
        Accept: "application/xml",
      },
    });

    // Parse XML response
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(response.data, "text/xml");
    const documents = xmlDoc.getElementsByTagName("document");

    const results: MedlinePlusResult[] = [];

    for (let i = 0; i < documents.length; i++) {
      const doc = documents[i];
      const title =
        doc
          .getElementsByTagName("content")[0]
          ?.getElementsByTagName("title")?.[0]?.textContent || "";
      const snippet =
        doc
          .getElementsByTagName("content")?.[0]
          ?.getElementsByTagName("FullSummary")?.[0]?.textContent || "";
      const url =
        doc
          .getElementsByTagName("content")?.[0]
          ?.getElementsByTagName("url")?.[0]?.textContent || "";

      results.push({
        title,
        snippet,
        url,
      });
    }

    return results;
  } catch (error) {
    console.error("Error searching MedlinePlus:", error);
    return [];
  }
}
