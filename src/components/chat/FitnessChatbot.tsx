import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import ChatHeader from "./ChatHeader";
import ChatWindow from "./ChatWindow";
import ChatInput from "./ChatInput";
import ChatSidebar from "./ChatSidebar";
import HeartbeatLoadingAnimation from "./HeartbeatLoadingAnimation";
import { chatWithMistral } from "@/lib/api";
import { summarizeChatTitle } from "@/lib/titleSummarizer";
import {
  createChatSession,
  saveChatMessage,
  getChatMessages,
  ChatMessage,
} from "@/lib/chatHistory";

const FitnessChatbot = () => {
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
        "Hello! I'm your Fitness & Nutrition assistant. I can help with workout plans, diet recommendations, and health goals. What would you like assistance with today?",
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
    } else {
      // If no session ID but we have cached messages, restore them
      const cachedMessages = localStorage.getItem('fitness_cachedMessages');
      const cachedResponses = localStorage.getItem('fitness_cachedResponses');
      
      if (cachedMessages) {
        try {
          const parsedMessages = JSON.parse(cachedMessages);
          if (parsedMessages.length > 0) {
            setMessages(parsedMessages);
          }
        } catch (error) {
          console.error("Error parsing cached messages:", error);
        }
      }
      
      if (cachedResponses) {
        try {
          const parsedResponses = JSON.parse(cachedResponses);
          if (parsedResponses.length > 0) {
            setResponses(parsedResponses);
          }
        } catch (error) {
          console.error("Error parsing cached responses:", error);
        }
      }
    }
  }, [sessionId]);

  // Update localStorage whenever messages or responses change
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('fitness_cachedMessages', JSON.stringify(messages));
    }
    if (responses.length > 0) {
      localStorage.setItem('fitness_cachedResponses', JSON.stringify(responses));
    }
  }, [messages, responses]);

  const loadChatHistory = async (chatSessionId: string) => {
    try {
      const chatMessages = await getChatMessages(chatSessionId);
      if (chatMessages.length > 0) {
        setMessages(chatMessages);
      } else {
        // If no messages exist, add the welcome message
        const welcomeMessage = {
          id: "welcome",
          isBot: true,
          message:
            "Hello! I'm your Fitness & Nutrition assistant. I can help with workout plans, diet recommendations, and health goals. What would you like assistance with today?",
          timestamp: new Date().toLocaleTimeString(),
        };
        setMessages([welcomeMessage]);
        await saveChatMessage(chatSessionId, welcomeMessage);
      }
    } catch (error) {
      console.error("Error loading chat history:", error);
    }
  };

  const handleSelectChat = (sessionId: string) => {
    setSearchParams({ session: sessionId });
    setSidebarOpen(false);
  };

  const handleNewChat = async () => {
    // Clear cached messages when starting a new chat
    localStorage.removeItem('fitness_cachedMessages');
    localStorage.removeItem('fitness_cachedResponses');
    
    navigate("/chat/fitness");
    setCurrentSessionId(null);
    const welcomeMessage = {
      id: "welcome",
      isBot: true,
      message:
        "Hello! I'm your Fitness & Nutrition assistant. I can help with workout plans, diet recommendations, and health goals. What would you like assistance with today?",
      timestamp: new Date().toLocaleTimeString(),
    };
    setMessages([welcomeMessage]);
    setResponses([]);
    setSidebarOpen(false);

    // Create a new session for the welcome message if user is logged in
    if (user) {
      const newSessionId = await createChatSession(
        user.id,
        "New Fitness Chat",
        "fitness"
      );
      if (newSessionId) {
        setCurrentSessionId(newSessionId);
        setSearchParams({ session: newSessionId });
        await saveChatMessage(newSessionId, welcomeMessage);
      }
    }
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
          "fitness",
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

      const { response, nutritionPlan, workoutPlan, sources } =
        await chatWithMistral([
          {
            role: "system",
            content:
              "You are a fitness and nutrition assistant AI. Provide helpful workout plans, diet recommendations, and health advice. Focus on fitness, exercise, nutrition, and healthy lifestyle guidance.",
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
      };

      setMessages((prev) => [...prev, botResponse]);

      // Save the bot response to the session
      if (currentSessionId) {
        await saveChatMessage(currentSessionId, botResponse);
      }

      // Add response cards based on the type of information
      const newResponses = [];

      if (nutritionPlan) {
        newResponses.push({
          id: (Date.now() + 2).toString(),
          type: "diet-plan",
          title: "Recommended Meal Plan",
          content: "Based on your goals, here's a suggested meal plan:",
          details: {
            meals: nutritionPlan.meals,
          },
        });
      }

      if (workoutPlan) {
        newResponses.push({
          id: (Date.now() + 3).toString(),
          type: "workout-plan",
          title: "Recommended Workout Plan",
          content: "Here's a personalized workout plan based on your needs:",
          details: {
            workouts: workoutPlan.workouts,
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
    <div className="flex h-full overflow-hidden">
      <div className="h-full overflow-hidden">
        <ChatSidebar
          currentChatId={currentSessionId || undefined}
          onSelectChat={handleSelectChat}
          onNewChat={handleNewChat}
          isOpen={sidebarOpen}
        />
      </div>

      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <ChatHeader
          botName="Fitness & Nutrition Assistant"
          status={isTyping ? "typing" : "online"}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          sidebarOpen={sidebarOpen}
          onNewChat={handleNewChat}
        />

        <div className="flex-1 overflow-hidden">
          <ChatWindow 
            messages={messages} 
            responses={responses} 
            isTyping={isTyping}
          />
        </div>

        <div className="p-4 border-t border-border">
          <ChatInput
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onSend={handleSendMessage}
            disabled={isTyping}
            placeholder="Ask about fitness, nutrition, or workout plans..."
          />
        </div>
      </div>
    </div>
  );
};

export default FitnessChatbot;
