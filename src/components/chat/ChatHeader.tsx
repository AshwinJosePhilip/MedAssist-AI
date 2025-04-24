import React from "react";
import { Button } from "@/components/ui/button";
import { Settings, Info, MessageSquare, Menu, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import ChatHistory from "./ChatHistory";
import ProcessPdfButton from "./ProcessPdfButton";

interface ChatHeaderProps {
  botName?: string;
  status?: "online" | "offline" | "typing";
  sessionId?: string;
  onSelectChat?: (sessionId: string) => void;
  onSettingsClick?: () => void;
  onInfoClick?: () => void;
  onMenuClick?: () => void;
  showMenuButton?: boolean;
  title?: string;
  onNewChat?: () => void;
  onToggleSidebar?: () => void;
  sidebarOpen?: boolean;
}

const ChatHeader = ({
  botName = "RAG Medical Assistant",
  status = "online",
  sessionId,
  onSelectChat,
  onSettingsClick = () => {},
  onInfoClick = () => {},
  onMenuClick = () => {},
  showMenuButton = false,
  title = "Medical Assistant",
  onNewChat,
  onToggleSidebar,
  sidebarOpen = false,
}: ChatHeaderProps) => {
  return (
    <div className="fixed top-0 left-0 right-0 z-10 flex h-16 items-center justify-between border-b bg-background/80 backdrop-blur-sm px-4 shadow-md">
      <div className="flex items-center gap-3">
        {showMenuButton && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onMenuClick}
            className="md:hidden h-9 w-9"
          >
            <MessageSquare className="h-5 w-5" />
          </Button>
        )}
        {onToggleSidebar && (
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden"
            onClick={onToggleSidebar}
            aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
          >
            <Menu className="h-5 w-5" />
          </Button>
        )}
        <h1 className="text-xl font-semibold text-primary">{botName}</h1>
        <span
          className={`inline-flex h-2 w-2 rounded-full ${status === "online" ? "bg-green-500" : status === "typing" ? "bg-yellow-500" : "bg-gray-500"}`}
        />
        <span className="text-sm text-muted-foreground capitalize">
          {status}
        </span>
      </div>

      <div className="flex items-center gap-2">
        <ChatHistory currentChatId={sessionId} onSelectChat={onSelectChat} />

        <TooltipProvider>
          <ProcessPdfButton />

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
