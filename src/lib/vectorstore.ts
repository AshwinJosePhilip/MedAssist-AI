import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { pipeline } from "@xenova/transformers";

class VectorStore {
  private store: MemoryVectorStore | null = null;
  private embedder: any;
  private initialized = false;

  async initialize() {
    if (!this.initialized) {
      this.embedder = await pipeline(
        "feature-extraction",
        "Xenova/all-MiniLM-L6-v2",
      );

      // Create memory vector store
      this.store = new MemoryVectorStore(this.embedder);
      this.initialized = true;
    }
  }

  async addDocument(text: string, metadata: Record<string, any> = {}) {
    await this.initialize();

    // Generate embedding
    const output = await this.embedder(text, { pooling: "mean" });
    const embedding = Array.from(output.data);

    // Add to memory store
    await this.store?.addDocuments([
      {
        pageContent: text,
        metadata
      },
    ]);
  }

  async similaritySearch(query: string, k: number = 3) {
    await this.initialize();

    // Generate query embedding
    const output = await this.embedder(query, { pooling: "mean" });
    const embedding = Array.from(output.data);

    // Search using cosine similarity
    // Convert embedding to number[] to fix type error
    const numberEmbedding = embedding.map(val => Number(val));
    return this.store?.similaritySearchVectorWithScore(numberEmbedding, k) || [];
  }
}

export const vectorStore = new VectorStore();
