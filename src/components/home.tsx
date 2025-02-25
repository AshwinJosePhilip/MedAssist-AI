import React from "react";
import ChatHeader from "./chat/ChatHeader";
import ChatWindow from "./chat/ChatWindow";
import ChatInput from "./chat/ChatInput";
import { chatWithMistral } from "@/lib/api";

const Home = () => {
  const [messages, setMessages] = React.useState([
    {
      id: "1",
      isBot: true,
      message: "Hello! I'm your medical assistant. How can I help you today?",
      timestamp: new Date().toLocaleTimeString(),
    },
  ]);
  const [responses, setResponses] = React.useState([]);
  const [inputValue, setInputValue] = React.useState("");
  const [isTyping, setIsTyping] = React.useState(false);

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
      const messageHistory = messages.map((msg) => ({
        role: msg.isBot ? "assistant" : "user",
        content: msg.message,
      }));

      const { response, hospitals, nutritionPlan, isFirstAid, sources } =
        await chatWithMistral([
          {
            role: "system",
            content:
              "You are a medical assistant AI. Provide helpful medical advice while being clear that you are not a replacement for professional medical care.",
          },
          ...messageHistory,
          { role: "user", content: inputValue },
        ]);

      const botResponse = {
        id: (Date.now() + 1).toString(),
        isBot: true,
        message: response,
        timestamp: new Date().toLocaleTimeString(),
      };

      setMessages((prev) => [...prev, botResponse]);

      // Add response cards based on the type of information
      const newResponses = [];

      // Add medical advice card with sources
      newResponses.push({
        id: Date.now().toString(),
        type: "medical-advice",
        title: "Medical Information",
        content: response,
        details: {
          sources,
        },
      });

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

      if (isFirstAid) {
        newResponses.push({
          id: (Date.now() + 3).toString(),
          type: "first-aid",
          title: "First Aid Instructions",
          content: "Important: Call emergency services if condition is severe.",
          details: {
            sources,
            instructions: [
              "Remain calm and assess the situation",
              "Ensure the area is safe",
              "Check for responsiveness if applicable",
              "Follow specific first aid protocols",
              "Seek professional medical help",
            ],
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
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex h-screen w-full flex-col bg-background">
      <ChatHeader status={isTyping ? "typing" : "online"} />
      <main className="flex-1 pt-16">
        <ChatWindow messages={messages} responses={responses} />
      </main>
      <ChatInput
        value={inputValue}
        onChange={setInputValue}
        onSend={handleSendMessage}
        disabled={isTyping}
      />
    </div>
  );
};

export default Home;
