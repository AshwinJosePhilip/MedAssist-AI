import { supabase } from "./supabase";

export interface ChatMessage {
  id: string;
  isBot: boolean;
  message: string;
  timestamp: string;
  sourceLink?: {
    title: string;
    url: string;
  };
  pubmedArticles?: any[]; // Store PubMed search results
  responseType?: string; // Type of response (e.g., hospital-info, nutrition-plan)
  additionalData?: any; // Any additional structured data
}

export interface ChatSession {
  id: string;
  userId: string;
  title: string;
  lastMessage: string;
  createdAt: string;
  updatedAt: string;
  chatType: "medical" | "firstaid" | "fitness";
}

// Function to create a new chat session
export async function createChatSession(
  userId: string,
  title: string,
  chatType: "medical" | "firstaid" | "fitness",
): Promise<string | null> {
  // Summarize the title if it's too long
  if (title.length > 30) {
    title = title.substring(0, 30) + "...";
  }
  try {
    const { data, error } = await supabase
      .from("chat_sessions")
      .insert([
        {
          user_id: userId,
          title,
          last_message: "",
          chat_type: chatType,
        },
      ])
      .select("id")
      .single();

    if (error) {
      console.error("Error creating chat session:", error);
      return null;
    }

    return data.id;
  } catch (error) {
    console.error("Error in createChatSession:", error);
    return null;
  }
}

// Function to save a message to a chat session
export async function saveChatMessage(
  sessionId: string,
  message: Omit<ChatMessage, "id"> | ChatMessage,
): Promise<string | null> {
  // Update cache immediately with a temporary ID
  const tempId = 'temp-' + Date.now();
  const cached = getCachedMessages(sessionId);
  cached.push({ ...message, id: tempId });
  cacheMessages(sessionId, cached);
  try {
    console.log("Saving message to session:", sessionId, message);
    
    // Validate inputs before saving
    if (!sessionId) {
      console.error("Error saving chat message: sessionId is null or undefined");
      return null;
    }
    
    if (!message || !message.message) {
      console.error("Error saving chat message: message is null, undefined, or empty");
      return null;
    }
    
    // Prepare the message data with proper type handling
    const messageData = {
      session_id: sessionId,
      is_bot: Boolean(message.isBot),
      message: String(message.message),
      timestamp: message.timestamp || new Date().toLocaleTimeString(),
      source_title: message.sourceLink?.title || null,
      source_url: message.sourceLink?.url || null,
      pubmed_articles: Array.isArray(message.pubmedArticles) ? message.pubmedArticles : null,
      response_type: message.responseType || null,
      additional_data: message.additionalData || null,
    };
    
    // Save the message with all its details
    const { data, error } = await supabase
      .from("chat_messages")
      .insert([messageData])
      .select("id")
      .single();

    if (error) {
      console.error("Error saving chat message:", error);
      console.error("Error details:", error.details, error.hint, error.code);
      console.error("Message that failed to save:", JSON.stringify(messageData));
      
      // Check for specific error types
      if (error.code === "23503") {
        console.error("Foreign key violation: The session_id may not exist in the chat_sessions table");
      } else if (error.code === "23502") {
        console.error("Not null violation: A required field is missing");
      } else if (error.code === "22P02") {
        console.error("Invalid text representation: Data type mismatch");
      }
      
      return null;
    }

    // Update the last message in the session
    try {
      const { error: updateError } = await supabase
        .from("chat_sessions")
        .update({
          last_message: message.message,
          updated_at: new Date().toISOString(),
        })
        .eq("id", sessionId);
        
      if (updateError) {
        console.error("Error updating chat session last message:", updateError);
        console.error("Session ID:", sessionId);
      }
    } catch (updateErr) {
      console.error("Exception in updating chat session:", updateErr);
    }

    // Update cache with final message
    const finalMessage = { ...message, id: data.id };
    const updatedCache = cached.filter(m => m.id !== tempId).concat(finalMessage);
    cacheMessages(sessionId, updatedCache);

return data.id;
  } catch (error) {
    console.error("Error in saveChatMessage:", error);
    return null;
  }
}

// Function to get all chat sessions for a user
export async function getChatSessions(userId: string): Promise<ChatSession[]> {
  try {
    const { data, error } = await supabase
      .from("chat_sessions")
      .select("*")
      .eq("user_id", userId)
      .order("updated_at", { ascending: false });

    if (error) {
      console.error("Error getting chat sessions:", error);
      return [];
    }

    return data.map((session) => ({
      id: session.id,
      userId: session.user_id,
      title: session.title,
      lastMessage: session.last_message,
      createdAt: session.created_at,
      updatedAt: session.updated_at,
      chatType: session.chat_type,
    }));
  } catch (error) {
    console.error("Error in getChatSessions:", error);
    return [];
  }
}

// Function to get all messages for a chat session
export async function getChatMessages(
  sessionId: string,
): Promise<ChatMessage[]> {
  // Check cache first
  const cached = getCachedMessages(sessionId);
  if (cached.length > 0) {
    // Update cache async
    setTimeout(async () => {
      const freshData = await fetchMessagesFromDB(sessionId);
      cacheMessages(sessionId, freshData);
    }, 0);
    return cached;
  }

  try {
    const freshData = await fetchMessagesFromDB(sessionId);
    cacheMessages(sessionId, freshData);
    return freshData;
  } catch (error) {
    console.error("Error in getChatMessages:", error);
    return [];
  }
}

// Cache management helpers
const getCachedMessages = (sessionId: string): ChatMessage[] => {
  try {
    return JSON.parse(localStorage.getItem(`chat-${sessionId}`) || '[]');
  } catch {
    return [];
  }
};

const cacheMessages = (sessionId: string, messages: ChatMessage[]) => {
  localStorage.setItem(`chat-${sessionId}`, JSON.stringify(messages));
};

const clearChatCache = (sessionId: string) => {
  localStorage.removeItem(`chat-${sessionId}`);
};

const convertMessage = (message: any): ChatMessage => ({
  id: message.id,
  isBot: message.is_bot,
  message: message.message,
  timestamp: message.timestamp,
  sourceLink: message.source_title
    ? {
        title: message.source_title,
        url: message.source_url,
      }
    : undefined,
  pubmedArticles: message.pubmed_articles || [],
  responseType: message.response_type,
  additionalData: message.additional_data,
});

const fetchMessagesFromDB = async (sessionId: string) => {
  const { data, error } = await supabase
    .from("chat_messages")
    .select("*")
    .eq("session_id", sessionId)
    .order("timestamp", { ascending: true });

  return error ? [] : data.map(convertMessage);
};

// Function to delete a chat session
export async function deleteChatSession(sessionId: string): Promise<boolean> {
  clearChatCache(sessionId);
  try {
    // First delete all messages in the session
    const { error: messagesError } = await supabase
      .from("chat_messages")
      .delete()
      .eq("session_id", sessionId);

    if (messagesError) {
      console.error("Error deleting chat messages:", messagesError);
      return false;
    }

    // Then delete the session itself
    const { error: sessionError } = await supabase
      .from("chat_sessions")
      .delete()
      .eq("id", sessionId);

    if (sessionError) {
      console.error("Error deleting chat session:", sessionError);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error in deleteChatSession:", error);
    return false;
  }
}

// Function to rename a chat session
export async function renameChatSession(sessionId: string, newTitle: string): Promise<boolean> {
  // Summarize the title if it's too long
  if (newTitle.length > 30) {
    newTitle = newTitle.substring(0, 30) + "...";
  }

  try {
    const { error } = await supabase
      .from("chat_sessions")
      .update({ title: newTitle })
      .eq("id", sessionId);

    if (error) {
      console.error("Error renaming chat session:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error in renameChatSession:", error);
    return false;
  }
}
