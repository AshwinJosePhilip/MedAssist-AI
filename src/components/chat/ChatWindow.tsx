import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import MessageBubble from "./MessageBubble";
import ResponseCard from "./ResponseCard";

interface Message {
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

interface Response {
  id: string;
  type: "medical-advice" | "first-aid" | "hospital-info" | "diet-plan";
  title: string;
  content: string;
  details?: {
    location?: string;
    phone?: string;
    instructions?: string[];
    medications?: string[];
    meals?: { time: string; food: string[] }[];
  };
}

interface ChatWindowProps {
  messages?: Message[];
  responses?: Response[];
}

const ChatWindow = ({
  messages = [
    {
      id: "1",
      isBot: true,
      message: "Hello! I'm your medical assistant. How can I help you today?",
      timestamp: new Date().toLocaleTimeString(),
    },
    {
      id: "2",
      isBot: false,
      message: "I have a headache and fever. What should I do?",
      timestamp: new Date().toLocaleTimeString(),
    },
  ],
  responses = [
    {
      id: "1",
      type: "medical-advice",
      title: "Headache & Fever Management",
      content: "Based on your symptoms, here are some recommendations:",
      details: {
        instructions: [
          "Rest in a quiet, dark room",
          "Stay hydrated",
          "Take over-the-counter pain relievers",
          "Monitor your temperature",
        ],
      },
    },
    {
      id: "2",
      type: "hospital-info",
      title: "Nearby Medical Facilities",
      content: "If symptoms persist, consider visiting:",
      details: {
        location: "City General Hospital - 2.5 miles away",
        phone: "(555) 123-4567",
      },
    },
  ],
}: ChatWindowProps) => {
  return (
    <div className="h-full w-full bg-background/30 flex flex-col overflow-auto">
      <div className="flex-1 p-4 space-y-4 pb-4 min-h-full">
        {messages.map((message) => (
          <MessageBubble
            key={message.id}
            isBot={message.isBot}
            message={message.message}
            timestamp={message.timestamp}
            sourceLink={message.sourceLink}
            pubmedArticles={message.pubmedArticles}
          />
        ))}
        {responses.map((response) => (
          <ResponseCard
            key={response.id}
            type={response.type}
            title={response.title}
            content={response.content}
            details={response.details}
          />
        ))}
      </div>
    </div>
  );
};

export default ChatWindow;
