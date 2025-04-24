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
  pubmedArticles?: any[];
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
  message: Omit<ChatMessage, "id">,
): Promise<string | null> {
  try {
    // Prepare the message data for insertion
    const messageData: any = {
      session_id: sessionId,
      is_bot: message.isBot,
      message: message.message,
      timestamp: message.timestamp,
      source_title: message.sourceLink?.title || null,
      source_url: message.sourceLink?.url || null,
    };

    // Add pubmedArticles if they exist
    if (message.pubmedArticles && message.pubmedArticles.length > 0) {
      messageData.pubmed_articles = message.pubmedArticles;
    }

    const { data, error } = await supabase
      .from("chat_messages")
      .insert([messageData])
      .select("id")
      .single();

    if (error) {
      console.error("Error saving chat message:", error);
      return null;
    }

    // Update the last message in the session
    await supabase
      .from("chat_sessions")
      .update({
        last_message: message.message,
        updated_at: new Date().toISOString(),
      })
      .eq("id", sessionId);

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
  try {
    const { data, error } = await supabase
      .from("chat_messages")
      .select("*")
      .eq("session_id", sessionId)
      .order("timestamp", { ascending: true });

    if (error) {
      console.error("Error getting chat messages:", error);
      return [];
    }

    return data.map((message) => ({
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
    }));
  } catch (error) {
    console.error("Error in getChatMessages:", error);
    return [];
  }
}

// Function to delete a chat session
export async function deleteChatSession(sessionId: string): Promise<boolean> {
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
