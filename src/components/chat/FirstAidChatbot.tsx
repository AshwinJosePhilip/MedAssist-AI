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

const FirstAidChatbot = () => {
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
        "Hello! I'm your First Aid assistant. I can provide emergency instructions and guidance. What emergency situation do you need help with?",
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
      const cachedMessages = localStorage.getItem('firstaid_cachedMessages');
      const cachedResponses = localStorage.getItem('firstaid_cachedResponses');
      
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
      localStorage.setItem('firstaid_cachedMessages', JSON.stringify(messages));
    }
    if (responses.length > 0) {
      localStorage.setItem('firstaid_cachedResponses', JSON.stringify(responses));
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
              "Hello! I'm your First Aid assistant. I can provide emergency instructions and guidance. What emergency situation do you need help with?",
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
    localStorage.removeItem('firstaid_cachedMessages');
    localStorage.removeItem('firstaid_cachedResponses');
    
    navigate("/chat/firstaid");
    setCurrentSessionId(null);
    const welcomeMessage = {
      id: "welcome",
      isBot: true,
      message:
        "Hello! I'm your First Aid assistant. I can provide emergency instructions and guidance. What emergency situation do you need help with?",
      timestamp: new Date().toLocaleTimeString(),
    };
    setMessages([welcomeMessage]);
    setResponses([]);
    setSidebarOpen(false);

    // Create a new session for the welcome message if user is logged in
    if (user) {
      const newSessionId = await createChatSession(
        user.id,
        "New First Aid Chat",
        "firstaid"
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
          "firstaid",
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
      } else {
        console.log("No session ID available to save message. User may not be logged in.");
      }

      const messageHistory = messages.map((msg) => ({
        role: msg.isBot ? "assistant" : "user",
        content: msg.message,
      }));

      const { response, firstAidGuide, sources, pubmedResults } =
        await chatWithMistral([
          {
            role: "system",
            content:
              "You are a first aid assistant AI. Provide clear, step-by-step emergency instructions. Always emphasize that calling emergency services (911) is the first priority in serious situations. Focus exclusively on first aid guidance.",
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
        pubmedArticles: pubmedResults,
      };

      setMessages((prev) => [...prev, botResponse]);

      // Save the bot response to the session
      if (currentSessionId) {
        await saveChatMessage(currentSessionId, botResponse);
      }

      // Add response cards based on the type of information
      const newResponses = [];

      if (firstAidGuide) {
        newResponses.push({
          id: (Date.now() + 4).toString(),
          type: "first-aid-guide",
          title: `First Aid: ${firstAidGuide.condition}`,
          content: firstAidGuide.emergency
            ? "EMERGENCY: Call for help immediately"
            : "Follow these first aid steps carefully",
          details: {
            sources,
            condition: firstAidGuide.condition,
            emergency: firstAidGuide.emergency,
            emergencyContact: firstAidGuide.emergencyContact,
            timeFrame: firstAidGuide.timeFrame,
            firstAidSteps: firstAidGuide.steps,
            doNotDo: firstAidGuide.doNotDo,
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
    <div className="flex h-full">
      <ChatSidebar
        currentChatId={currentSessionId || undefined}
        onSelectChat={handleSelectChat}
        onNewChat={handleNewChat}
        isOpen={sidebarOpen}
      />

      <div className="flex-1 flex flex-col h-full">
        <ChatHeader
          botName="First Aid Assistant"
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
            placeholder="Describe the emergency situation..."
          />
        </div>
      </div>
    </div>
  );
};

export default FirstAidChatbot;
