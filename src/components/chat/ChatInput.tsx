import React from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";

interface ChatInputProps {
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onSend?: () => void;
  disabled?: boolean;
  placeholder?: string;
}

const ChatInput = ({
  value = "",
  onChange = () => {},
  onSend = () => {},
  disabled = false,
  placeholder = "Type your message here...",
}: ChatInputProps) => {
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <div className="border-t bg-background/80 backdrop-blur-sm p-4 shadow-lg sticky bottom-0 left-0 right-0 z-20">
      <div className="mx-auto flex max-w-4xl items-center gap-2">
        <Textarea
          value={value}
          onChange={onChange}
          placeholder={placeholder || "Type your message..."}
          className="min-h-12 resize-none border-0 focus-visible:ring-0 focus-visible:ring-transparent flex-1"
          onKeyDown={handleKeyPress}
          disabled={disabled}
        />
        <Button
          onClick={onSend}
          disabled={disabled || !value.trim()}
          size="icon"
        >
          <Send className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};

export default ChatInput;
