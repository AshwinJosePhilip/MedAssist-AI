// This is a simplified interface to ChromaDB
// In a real implementation, you would use the ChromaDB client library

import axios from "axios";

// Define the ChromaDB collection interface
interface ChromaCollection {
  name: string;
  metadata?: Record<string, any>;
}

// Define the document interface for ChromaDB
interface ChromaDocument {
  id: string;
  text: string;
  metadata?: Record<string, any>;
  embedding?: number[];
}

// Define the query result interface
interface QueryResult {
  id: string;
  text: string;
  metadata: Record<string, any>;
  distance: number;
}

// Enhanced ChromaDB client class with improved vector search capabilities
export class ChromaClient {
  private baseUrl: string;
  private collections: Map<string, ChromaCollection>;
  private documents: Map<string, ChromaDocument[]>;

  constructor(baseUrl: string = "http://localhost:8000") {
    this.baseUrl = baseUrl;
    this.collections = new Map();
    this.documents = new Map();
  }

  // Create a new collection
  async createCollection(
    name: string,
    metadata?: Record<string, any>,
  ): Promise<boolean> {
    try {
      // In a real implementation, you would make an API call to ChromaDB
      // For now, we'll just store it in memory
      if (this.collections.has(name)) {
        console.warn(`Collection ${name} already exists`);
        return false;
      }

      this.collections.set(name, { name, metadata });
      this.documents.set(name, []);
      return true;
    } catch (error) {
      console.error("Error creating collection:", error);
      return false;
    }
  }

  // Get a collection by name
  async getCollection(name: string): Promise<ChromaCollection | null> {
    try {
      const collection = this.collections.get(name);
      return collection || null;
    } catch (error) {
      console.error("Error getting collection:", error);
      return null;
    }
  }

  // Add documents to a collection with improved metadata handling
  async addDocuments(
    collectionName: string,
    documents: Omit<ChromaDocument, "embedding">[],
  ): Promise<boolean> {
    try {
      if (!this.collections.has(collectionName)) {
        console.error(`Collection ${collectionName} does not exist`);
        return false;
      }

      // In a real implementation, you would generate embeddings using an embedding model
      // and then make an API call to ChromaDB
      const docsWithEmbeddings = documents.map((doc) => ({
        ...doc,
        embedding: this.mockGenerateEmbedding(doc.text),
      }));

      // Check for duplicate IDs and replace if they exist
      const collectionDocs = this.documents.get(collectionName) || [];
      const existingIds = new Set(collectionDocs.map(doc => doc.id));
      
      // Filter out existing documents that will be replaced
      const filteredDocs = collectionDocs.filter(doc => !docsWithEmbeddings.some(newDoc => newDoc.id === doc.id));
      
      // Add the new documents
      this.documents.set(collectionName, [
        ...filteredDocs,
        ...docsWithEmbeddings,
      ]);
      
      return true;
    } catch (error) {
      console.error("Error adding documents:", error);
      return false;
    }
  }

  // Query a collection with enhanced relevance ranking and filtering
  async queryCollection(
    collectionName: string,
    query: string,
    limit: number = 5,
    filters?: Record<string, any>,
  ): Promise<QueryResult[]> {
    try {
      if (!this.collections.has(collectionName)) {
        console.error(`Collection ${collectionName} does not exist`);
        return [];
      }

      // Generate query embedding
      const queryEmbedding = this.mockGenerateEmbedding(query);

      // Get documents from collection
      const documents = this.documents.get(collectionName) || [];

      // Enhanced filtering with improved relevance scoring
      const results = documents
        .filter((doc) => {
          if (!filters) return true;
          
          // Check if document matches all filters
          return Object.entries(filters).every(([key, value]) => {
            return doc.metadata?.[key] === value;
          });
        })
        .map((doc) => {
          // Calculate cosine similarity with improved precision
          const similarity = this.cosineSimilarity(queryEmbedding, doc.embedding || []);
          const distance = 1 - similarity; // Convert similarity to distance (lower is better)

          // Extract keywords from query for additional relevance check
          const queryKeywords = query.toLowerCase().split(/\s+/).filter(word => word.length > 3);
          const textContainsKeywords = queryKeywords.some(keyword => 
            doc.text.toLowerCase().includes(keyword));
          
          // Boost relevance score for documents containing query keywords
          const adjustedDistance = textContainsKeywords ? distance * 0.8 : distance;

          return {
            id: doc.id,
            text: doc.text,
            metadata: doc.metadata || {},
            distance: adjustedDistance,
            originalDistance: distance,
            containsKeywords: textContainsKeywords
          };
        })
        .sort((a, b) => a.distance - b.distance) // Sort by adjusted distance (ascending)
        .filter(result => result.distance < 0.4 || result.containsKeywords) // Only include highly relevant results
        .slice(0, limit); // Limit results

      return results;
    } catch (error) {
      console.error("Error querying collection:", error);
      return [];
    }
  }

  // Helper method to generate mock embeddings
  private mockGenerateEmbedding(text: string): number[] {
    // In a real implementation, you would use an embedding model
    // For now, we'll generate a random embedding based on the text
    const hash = this.simpleHash(text);
    const embedding = new Array(128).fill(0).map((_, i) => {
      // Generate a deterministic but seemingly random value based on the hash and position
      return Math.sin(hash * (i + 1)) * 0.5 + 0.5;
    });
    
    // Normalize the embedding
    const magnitude = Math.sqrt(embedding.reduce((sum, val) => sum + val * val, 0));
    return embedding.map(val => val / magnitude);
  }

  // Simple string hash function for deterministic embeddings
  private simpleHash(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return hash;
  }

  // Calculate cosine similarity between two vectors
  private cosineSimilarity(a: number[], b: number[]): number {
    if (a.length !== b.length) {
      throw new Error("Vectors must have the same length");
    }

    let dotProduct = 0;
    let magnitudeA = 0;
    let magnitudeB = 0;

    for (let i = 0; i < a.length; i++) {
      dotProduct += a[i] * b[i];
      magnitudeA += a[i] * a[i];
      magnitudeB += b[i] * b[i];
    }

    magnitudeA = Math.sqrt(magnitudeA);
    magnitudeB = Math.sqrt(magnitudeB);

    if (magnitudeA === 0 || magnitudeB === 0) {
      return 0;
    }

    return dotProduct / (magnitudeA * magnitudeB);
  }
}

// Export a singleton instance
export const chromaClient = new ChromaClient();
