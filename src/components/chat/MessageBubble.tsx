import React from "react";
import { cn } from "@/lib/utils";
import { Avatar } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";

interface MessageBubbleProps {
  isBot?: boolean;
  message?: string;
  timestamp?: string;
  avatar?: string;
}

const MessageBubble = ({
  isBot = false,
  message = "Hello! How can I help you today?",
  timestamp = new Date().toLocaleTimeString(),
  avatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${isBot ? "medbot" : "user"}`,
}: MessageBubbleProps) => {
  return (
    <div
      className={cn(
        "flex w-full gap-3 p-4",
        isBot ? "bg-white" : "bg-gray-50",
        isBot ? "justify-start" : "justify-end",
      )}
    >
      {isBot && (
        <Avatar className="h-8 w-8">
          <img src={avatar} alt="Bot Avatar" className="h-full w-full" />
        </Avatar>
      )}

      <Card
        className={cn(
          "max-w-[70%] p-3 shadow-sm",
          isBot ? "bg-primary/10" : "bg-primary text-primary-foreground",
        )}
      >
        <p className="text-sm">{message}</p>
        <span className="mt-1 block text-xs opacity-50">{timestamp}</span>
      </Card>

      {!isBot && (
        <Avatar className="h-8 w-8">
          <img src={avatar} alt="User Avatar" className="h-full w-full" />
        </Avatar>
      )}
    </div>
  );
};

export default MessageBubble;
