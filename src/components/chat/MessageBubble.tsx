import React from "react";
import { cn } from "@/lib/utils";
import { Avatar } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { FileText, ExternalLink } from "lucide-react";
import FormattedResponse from "./FormattedResponse";

interface MessageBubbleProps {
  isBot?: boolean;
  message?: string;
  timestamp?: string;
  avatar?: string;
  sourceLink?: {
    title: string;
    url: string;
  };
  pubmedArticles?: any[];
}

const MessageBubble = ({
  isBot = false,
  message = "Hello! How can I help you today?",
  timestamp = new Date().toLocaleTimeString(),
  avatar = `https://api.dicebear.com/7.x/bottts-neutral/svg?seed=${isBot ? "medbot" : "user"}&backgroundColor=${isBot ? "1a56e8" : "0a0a0a"}&scale=80`,
  sourceLink,
  pubmedArticles = [],
}: MessageBubbleProps) => {
  // Check if this is a workout plan response
  const isWorkoutPlan =
    isBot &&
    message.includes("Day 1:") &&
    message.includes("sets") &&
    message.includes("reps");

  // Check if this is a medical research response with PubMed articles
  const hasPubMedArticles =
    isBot && pubmedArticles && pubmedArticles.length > 0;

  return (
    <div
      className={cn(
        "flex w-full gap-3 p-4",
        isBot ? "bg-muted/30" : "bg-primary/10",
        isBot ? "justify-start" : "justify-end",
      )}
    >
      {isBot && (
        <Avatar className="h-8 w-8">
          <img src={avatar} alt="Bot Avatar" className="h-full w-full" />
        </Avatar>
      )}

      {isWorkoutPlan ? (
        <div className="max-w-[85%]">
          <FormattedResponse content={message} type="workout" />
          <span className="mt-1 block text-xs opacity-50 pl-3">
            {timestamp}
          </span>
        </div>
      ) : hasPubMedArticles ? (
        <div className="max-w-[85%]">
          <Card
            className={cn(
              "max-w-full p-3 shadow-sm mb-3",
              "bg-card text-card-foreground",
            )}
          >
            <p className="text-sm whitespace-pre-line">{message}</p>
            <span className="mt-1 block text-xs opacity-50">{timestamp}</span>
            {isBot && message.includes("Source: PubMed") && (
              <div className="mt-2 pt-2 border-t border-primary/10">
                <p className="text-xs text-primary inline-flex items-center gap-1">
                  <ExternalLink className="h-3 w-3" /> Retrieved from PubMed
                  database
                </p>
              </div>
            )}
          </Card>
          <FormattedResponse
            content=""
            type="medical"
            data={{ pubmedArticles }}
          />
        </div>
      ) : (
        <Card
          className={cn(
            "max-w-[70%] p-3 shadow-sm",
            isBot
              ? "bg-card text-card-foreground"
              : "bg-primary text-primary-foreground",
          )}
        >
          <p className="text-sm whitespace-pre-line">{message}</p>
          <span className="mt-1 block text-xs opacity-50">{timestamp}</span>
          {isBot && message.includes("Source: PubMed") && (
            <div className="mt-2 pt-2 border-t border-primary/10">
              <p className="text-xs text-primary inline-flex items-center gap-1">
                <ExternalLink className="h-3 w-3" /> Retrieved from PubMed
                database
              </p>
            </div>
          )}
        </Card>
      )}

      {!isBot && (
        <Avatar className="h-8 w-8">
          <img src={avatar} alt="User Avatar" className="h-full w-full" />
        </Avatar>
      )}
    </div>
  );
};

export default MessageBubble;
