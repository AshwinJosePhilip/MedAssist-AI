import React from "react";
import { Button } from "@/components/ui/button";
import { Settings, Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ChatHeaderProps {
  botName?: string;
  status?: "online" | "offline" | "typing";
  onSettingsClick?: () => void;
  onInfoClick?: () => void;
}

const ChatHeader = ({
  botName = "Medical Assistant",
  status = "online",
  onSettingsClick = () => {},
  onInfoClick = () => {},
}: ChatHeaderProps) => {
  return (
    <div className="fixed top-0 left-0 right-0 z-10 flex h-16 items-center justify-between border-b bg-white px-4 shadow-sm">
      <div className="flex items-center gap-3">
        <h1 className="text-xl font-semibold text-primary">{botName}</h1>
        <span
          className={`inline-flex h-2 w-2 rounded-full ${status === "online" ? "bg-green-500" : status === "typing" ? "bg-yellow-500" : "bg-gray-500"}`}
        />
        <span className="text-sm text-muted-foreground capitalize">
          {status}
        </span>
      </div>

      <div className="flex items-center gap-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={onInfoClick}
                className="h-9 w-9"
              >
                <Info className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>System Information</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={onSettingsClick}
                className="h-9 w-9"
              >
                <Settings className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Settings</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};

export default ChatHeader;
