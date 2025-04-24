import React, { useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import MessageBubble from "./MessageBubble";
import ResponseCard from "./ResponseCard";
import HeartbeatLoadingAnimation from "./HeartbeatLoadingAnimation";

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
  isTyping?: boolean;
}

const ChatWindow = ({
  messages = [],
  responses = [],
  isTyping = false,
}: ChatWindowProps) => {
  const messagesEndRef = React.useRef<HTMLDivElement>(null);
  
  // Store messages and responses in localStorage when they change
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('cachedMessages', JSON.stringify(messages));
    }
    if (responses.length > 0) {
      localStorage.setItem('cachedResponses', JSON.stringify(responses));
    }
  }, [messages, responses]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, responses, isTyping]);

  return (
    <ScrollArea className="h-[calc(100vh-13rem)] w-full bg-background/30">
      <div className="flex flex-col flex-grow min-h-full pt-16 p-4 space-y-4">
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
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-muted/50 backdrop-blur-sm rounded-lg p-4 max-w-[80%]">
              <HeartbeatLoadingAnimation text="AI is thinking..." />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} className="h-0" />
      </div>
    </ScrollArea>
  );
};

export default ChatWindow;
