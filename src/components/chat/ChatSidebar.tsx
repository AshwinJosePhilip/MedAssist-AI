import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import {
  getChatSessions,
  deleteChatSession,
  ChatSession,
} from "@/lib/chatHistory";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Pill,
  AlertCircle,
  Dumbbell,
  MessageSquare,
  Trash2,
  Plus,
  History,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface ChatSidebarProps {
  currentChatId?: string;
  onSelectChat?: (sessionId: string) => void;
  onNewChat?: () => void;
  isOpen?: boolean;
}

export default function ChatSidebar({
  currentChatId,
  onSelectChat,
  onNewChat,
  isOpen = false,
}: ChatSidebarProps) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [chatCount, setChatCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [sessionToDelete, setSessionToDelete] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      loadChatSessions();
    }
  }, [user]);

  const loadChatSessions = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const chatSessions = await getChatSessions(user.id);
      setSessions(chatSessions);
      setChatCount(chatSessions.length);
    } catch (error) {
      console.error("Error loading chat sessions:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSession = async () => {
    if (!sessionToDelete) return;

    try {
      const success = await deleteChatSession(sessionToDelete);
      if (success) {
        setSessions(
          sessions.filter((session) => session.id !== sessionToDelete),
        );

        // If the current chat was deleted, navigate to chat selection
        if (currentChatId === sessionToDelete) {
          navigate("/chat");
        }
      }
    } catch (error) {
      console.error("Error deleting chat session:", error);
    } finally {
      setDeleteDialogOpen(false);
      setSessionToDelete(null);
    }
  };

  const getChatTypeIcon = (type: string) => {
    switch (type) {
      case "medical":
        return <Pill className="h-4 w-4 text-blue-500" />;
      case "firstaid":
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case "fitness":
        return <Dumbbell className="h-4 w-4 text-green-500" />;
      default:
        return <MessageSquare className="h-4 w-4 text-primary" />;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  // Apply conditional styling based on isOpen prop
  const sidebarClasses = `w-64 h-full border-r border-border bg-background/95 flex flex-col ${isOpen ? 'block' : 'hidden md:block'}`;

  return (
    <>
      <div className={sidebarClasses}>
        <div className="p-4 border-b border-border">
          <Button
            variant="default"
            size="sm"
            className="w-full flex items-center gap-2"
            onClick={onNewChat}
          >
            <Plus className="h-4 w-4" />
            New Chat
          </Button>
        </div>

        <div className="flex items-center justify-between px-4 py-2 border-b border-border">
          <h3 className="text-sm font-medium">Chat History ({chatCount})</h3>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 w-7 p-0 hover:bg-muted/50"
            onClick={() => navigate("/chat/history")}
          >
            <History className="h-4 w-4" />
          </Button>
        </div>

        <ScrollArea className="flex-1 h-[calc(100vh-10rem)]">
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-pulse text-muted-foreground">
                Loading chats...
              </div>
            </div>
          ) : sessions.length === 0 ? (
            <div className="text-center py-8 px-4">
              <p className="text-sm text-muted-foreground">
                No chat history yet
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                Start a new chat to see your history
              </p>
            </div>
          ) : (
            <div className="p-2">
              {sessions.map((session) => (
                <div
                  key={session.id}
                  className={`flex items-center justify-between p-2 rounded-md hover:bg-muted/50 cursor-pointer ${currentChatId === session.id ? "bg-muted" : ""}`}
                  onClick={() => {
                    if (onSelectChat) {
                      onSelectChat(session.id);
                      navigate(`/chat/${session.chatType}?session=${session.id}`);
                    }
                  }}
                >
                  <div className="flex items-center gap-2 overflow-hidden">
                    {getChatTypeIcon(session.chatType)}
                    <div className="overflow-hidden">
                      <p className="text-sm font-medium truncate">
                        {session.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(session.updatedAt)}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 p-0 opacity-0 group-hover:opacity-100 hover:opacity-100"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSessionToDelete(session.id);
                      setDeleteDialogOpen(true);
                    }}
                  >
                    <Trash2 className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Chat</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this chat? This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteSession}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
