import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import ChatHeader from "./ChatHeader";
import ChatWindow from "./ChatWindow";
import ChatInput from "./ChatInput";
import ChatSidebar from "./ChatSidebar";
import { chatWithMistral } from "@/lib/api";
import { summarizeChatTitle } from "@/lib/titleSummarizer";
import {
  createChatSession,
  saveChatMessage,
  getChatMessages,
  ChatMessage,
} from "@/lib/chatHistory";

const MedicalChatbot = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const sessionId = searchParams.get("session");

  const [messages, setMessages] = React.useState<ChatMessage[]>([
    {
      id: "welcome",
      isBot: true,
      message:
        "Hello! I'm your RAG-powered medical assistant. How can I help you today?",
      timestamp: new Date().toLocaleTimeString(),
    },
  ]);
  const [responses, setResponses] = React.useState([]);
  const [inputValue, setInputValue] = React.useState("");
  const [isTyping, setIsTyping] = React.useState(false);
  const [currentSessionId, setCurrentSessionId] = React.useState<string | null>(
    sessionId,
  );

  // Load chat history if a session ID is provided
  useEffect(() => {
    if (sessionId) {
      loadChatHistory(sessionId);
      setCurrentSessionId(sessionId);
    }
  }, [sessionId]);

  const loadChatHistory = async (chatSessionId: string) => {
    try {
      const chatMessages = await getChatMessages(chatSessionId);
      if (chatMessages.length > 0) {
        setMessages(chatMessages);
      }
    } catch (error) {
      console.error("Error loading chat history:", error);
    }
  };

  const handleSelectChat = (sessionId: string) => {
    setSearchParams({ session: sessionId });
    setSidebarOpen(false);
  };

  const handleNewChat = () => {
    navigate("/chat/medical");
    setCurrentSessionId(null);
    setMessages([
      {
        id: "welcome",
        isBot: true,
        message:
          "Hello! I'm your RAG-powered medical assistant. How can I help you today?",
        timestamp: new Date().toLocaleTimeString(),
      },
    ]);
    setResponses([]);
    setSidebarOpen(false);
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const newMessage = {
      id: Date.now().toString(),
      isBot: false,
      message: inputValue,
      timestamp: new Date().toLocaleTimeString(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputValue("");
    setIsTyping(true);

    try {
      // Create a new session if one doesn't exist
      if (!currentSessionId && user) {
        // Create a summarized title from the user's query
        const sessionTitle = summarizeChatTitle(inputValue);

        const newSessionId = await createChatSession(
          user.id,
          sessionTitle,
          "medical",
        );

        if (newSessionId) {
          setCurrentSessionId(newSessionId);
          setSearchParams({ session: newSessionId });

          // Save the user message to the new session
          await saveChatMessage(newSessionId, newMessage);
        }
      } else if (currentSessionId) {
        // Save the user message to the existing session
        await saveChatMessage(currentSessionId, newMessage);
      }

      const messageHistory = messages.map((msg) => ({
        role: msg.isBot ? "assistant" : "user",
        content: msg.message,
      }));

      const {
        response,
        hospitals,
        nutritionPlan,
        workoutPlan,
        firstAidGuide,
        isFirstAid,
        sources,
        pubmedArticles,
      } = await chatWithMistral([
        {
          role: "system",
          content:
            "You are a medical assistant AI. Provide helpful medical advice while being clear that you are not a replacement for professional medical care.",
        },
        ...messageHistory,
        { role: "user", content: inputValue },
      ]);

      // Add source link to the bot response if available
      const botResponse = {
        id: (Date.now() + 1).toString(),
        isBot: true,
        message: response,
        timestamp: new Date().toLocaleTimeString(),
        sourceLink:
          sources && sources.length > 0
            ? {
                title: sources[0].title,
                url: sources[0].url,
              }
            : undefined,
        pubmedArticles: pubmedArticles,
      };

      setMessages((prev) => [...prev, botResponse]);

      // Save the bot response to the session
      if (currentSessionId) {
        await saveChatMessage(currentSessionId, botResponse);
      }

      // Add response cards based on the type of information
      const newResponses = [];

      if (hospitals?.length > 0) {
        newResponses.push({
          id: (Date.now() + 1).toString(),
          type: "hospital-info",
          title: "Nearby Medical Facilities",
          content: "Here are the closest medical facilities to your location:",
          details: {
            location: hospitals[0].address,
            phone: hospitals[0].phone,
          },
        });
      }

      if (nutritionPlan) {
        newResponses.push({
          id: (Date.now() + 2).toString(),
          type: "diet-plan",
          title: "Recommended Meal Plan",
          content: "Based on your condition, here's a suggested meal plan:",
          details: {
            meals: nutritionPlan.meals,
          },
        });
      }

      setResponses(newResponses);
    } catch (error) {
      console.error("Error getting response:", error);
      const errorMessage = {
        id: (Date.now() + 1).toString(),
        isBot: true,
        message: "I apologize, but I encountered an error. Please try again.",
        timestamp: new Date().toLocaleTimeString(),
      };
      setMessages((prev) => [...prev, errorMessage]);

      // Save the error message to the session
      if (currentSessionId) {
        await saveChatMessage(currentSessionId, errorMessage);
      }
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex h-screen w-full bg-background/80 backdrop-blur-sm chat-pages">
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      <div
        className={`fixed top-0 bottom-0 left-0 z-50 md:relative md:z-0 transition-transform duration-300 ease-in-out ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
      >
        <ChatSidebar
          currentChatId={currentSessionId || undefined}
          onSelectChat={handleSelectChat}
          onNewChat={handleNewChat}
        />
      </div>

      <div className="flex flex-col flex-1 overflow-hidden">
        <ChatHeader
          botName="RAG Medical Assistant"
          status={isTyping ? "typing" : "online"}
          sessionId={currentSessionId || undefined}
          onSelectChat={handleSelectChat}
          onMenuClick={() => setSidebarOpen(!sidebarOpen)}
          showMenuButton={true}
        />
        <main className="flex-1 pt-16 overflow-auto h-[calc(100vh-8rem)]">
          <ChatWindow messages={messages} responses={responses} />
        </main>
        <ChatInput
          value={inputValue}
          onChange={setInputValue}
          onSend={handleSendMessage}
          disabled={isTyping}
          placeholder="Ask about medical conditions, symptoms, or treatments..."
        />
      </div>
    </div>
  );
};

export default MedicalChatbot;
