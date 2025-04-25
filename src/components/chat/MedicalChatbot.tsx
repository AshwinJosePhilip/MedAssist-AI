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
import { searchPubMed } from "@/lib/pubmed";
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
        "Hello! I'm your PubMed-powered medical assistant. I exclusively use PubMed research articles as my source of information. How can I help you today?",
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
    let isValidSession = true;
    
    const loadData = async () => {
      if (sessionId) {
        await loadChatHistory(sessionId);
        if (isValidSession) {
          setCurrentSessionId(sessionId);
          // Clear cached messages when loading a session
          localStorage.removeItem('medical_cachedMessages');
          localStorage.removeItem('medical_cachedResponses');
        }
      } else {
        // If no session ID but we have cached messages, restore them
        const cachedMessages = localStorage.getItem('medical_cachedMessages');
        const cachedResponses = localStorage.getItem('medical_cachedResponses');
        
        if (cachedMessages) {
          try {
            const parsedMessages = JSON.parse(cachedMessages);
            if (parsedMessages.length > 0 && isValidSession) {
              setMessages(parsedMessages);
            }
          } catch (error) {
            console.error("Error parsing cached messages:", error);
          }
        }
        
        if (cachedResponses) {
          try {
            const parsedResponses = JSON.parse(cachedResponses);
            if (parsedResponses.length > 0 && isValidSession) {
              setResponses(parsedResponses);
            }
          } catch (error) {
            console.error("Error parsing cached responses:", error);
          }
        }
      }
    };

    loadData();
    
    return () => {
      isValidSession = false;
      if (!sessionId) {
        // Save state when unmounting without a session
        localStorage.setItem('medical_cachedMessages', JSON.stringify(messages));
        localStorage.setItem('medical_cachedResponses', JSON.stringify(responses));
      }
    };
  }, [sessionId]);

  // Update localStorage whenever messages or responses change
  useEffect(() => {
    if (!currentSessionId) {
      if (messages.length > 0) {
        localStorage.setItem('medical_cachedMessages', JSON.stringify(messages));
      }
      if (responses.length > 0) {
        localStorage.setItem('medical_cachedResponses', JSON.stringify(responses));
      }
    }
  }, [messages, responses, currentSessionId]);

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
            "Hello! I'm your PubMed-powered medical assistant. I exclusively use PubMed research articles as my source of information. How can I help you today?",
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
    localStorage.removeItem('medical_cachedMessages');
    localStorage.removeItem('medical_cachedResponses');
    
    navigate("/chat/medical");
    setCurrentSessionId(null);
    const welcomeMessage = {
      id: "welcome",
      isBot: true,
      message:
        "Hello! I'm your PubMed-powered medical assistant. I exclusively use PubMed research articles as my source of information. How can I help you today?",
      timestamp: new Date().toLocaleTimeString(),
    };
    setMessages([welcomeMessage]);
    setResponses([]);
    setSidebarOpen(false);

    // Create a new session for the welcome message if user is logged in
    if (user) {
      const newSessionId = await createChatSession(
        user.id,
        "New Medical Chat",
        "medical"
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
      // All medical queries should be treated as PubMed queries since we're exclusively using PubMed
      const isPubMedQuery = true; // Always use PubMed as our exclusive source
      
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
      } else {
        console.log("No session ID available to save message. User may not be logged in.");
      }

      const messageHistory = messages.map((msg) => ({
        role: msg.isBot ? "assistant" : "user",
        content: msg.message,
      }));
      
      // Always search PubMed first for any medical query
      let pubmedResults = [];
      try {
        pubmedResults = await searchPubMed(inputValue);
        console.log("PubMed search results:", pubmedResults);
      } catch (error) {
        console.error("Error searching PubMed:", error);
      }

      const {
        response,
        hospitals,
        nutritionPlan,
        workoutPlan,
        firstAidGuide,
        isFirstAid,
        sources,
        pubmedResults: apiPubmedResults,
      } = await chatWithMistral([
        {
          role: "system",
          content:
            "You are a medical assistant AI powered exclusively by PubMed research. Provide helpful medical information based solely on peer-reviewed scientific literature. Always cite your PubMed sources. Be clear that you are not a replacement for professional medical care. Format your responses in a clear, structured way with concise paragraphs and bullet points when appropriate. When answering, prioritize accuracy, clarity, and scientific evidence.",
        },
        ...messageHistory,
        { role: "user", content: inputValue },
      ]);
      
      // Combine PubMed results from direct search and API if needed
      if (apiPubmedResults && apiPubmedResults.length > 0) {
        // Merge and deduplicate by UID
        const existingUids = new Set(pubmedResults.map(article => article.uid));
        for (const article of apiPubmedResults) {
          if (!existingUids.has(article.uid)) {
            pubmedResults.push(article);
          }
        }
      }

      // Always use PubMed as the source
      let sourceLink = undefined;
      if (pubmedResults && pubmedResults.length > 0) {
        sourceLink = {
          title: "PubMed",
          url: pubmedResults[0].formattedUrl || `https://pubmed.ncbi.nlm.nih.gov/${pubmedResults[0].uid}/`
        };
      }

      // Add source link to the bot response if available
      const botResponse = {
        id: (Date.now() + 1).toString(),
        isBot: true,
        message: response,
        timestamp: new Date().toLocaleTimeString(),
        sourceLink: sourceLink,
        pubmedArticles: pubmedResults, 
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
        message:
          "I'm sorry, I encountered an error while processing your request. Please try again later.",
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
          botName="Medical Assistant" 
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
            placeholder="Ask about medical conditions, treatments, or health concerns..."
            disabled={isTyping}
          />
        </div>
      </div>
    </div>
  );
};

export default MedicalChatbot;
