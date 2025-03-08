import { supabase } from "./supabase";
import { ChatSession } from "./chatHistory";

// Function to get all chat sessions for a user by type
export async function getUserChatSessionsByType(
  userId: string,
  chatType: "medical" | "firstaid" | "fitness",
): Promise<ChatSession[]> {
  try {
    const { data, error } = await supabase
      .from("chat_sessions")
      .select("*")
      .eq("user_id", userId)
      .eq("chat_type", chatType)
      .order("updated_at", { ascending: false });

    if (error) {
      console.error(`Error getting ${chatType} chat sessions:`, error);
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
    console.error(`Error in getUserChatSessionsByType for ${chatType}:`, error);
    return [];
  }
}

// Function to get chat session statistics for a user
export async function getUserChatStats(userId: string) {
  try {
    const { data, error } = await supabase
      .from("chat_sessions")
      .select("chat_type, count")
      .eq("user_id", userId)
      .group("chat_type");

    if (error) {
      console.error("Error getting chat stats:", error);
      return {
        medical: 0,
        firstaid: 0,
        fitness: 0,
        total: 0,
      };
    }

    const stats = {
      medical: 0,
      firstaid: 0,
      fitness: 0,
      total: 0,
    };

    data.forEach((item) => {
      stats[item.chat_type as keyof typeof stats] = parseInt(item.count);
      stats.total += parseInt(item.count);
    });

    return stats;
  } catch (error) {
    console.error("Error in getUserChatStats:", error);
    return {
      medical: 0,
      firstaid: 0,
      fitness: 0,
      total: 0,
    };
  }
}

// Function to get recent chats across all types
export async function getRecentChats(
  userId: string,
  limit: number = 5,
): Promise<ChatSession[]> {
  try {
    const { data, error } = await supabase
      .from("chat_sessions")
      .select("*")
      .eq("user_id", userId)
      .order("updated_at", { ascending: false })
      .limit(limit);

    if (error) {
      console.error("Error getting recent chats:", error);
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
    console.error("Error in getRecentChats:", error);
    return [];
  }
}
