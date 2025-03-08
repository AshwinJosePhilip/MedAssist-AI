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
}

export default function ChatSidebar({
  currentChatId,
  onSelectChat,
  onNewChat,
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

  return (
    <>
      <div className="w-64 h-full border-r border-border bg-background/95 flex flex-col">
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
            className="h-7 w-7 p-0"
            onClick={() => navigate("/chat/history")}
          >
            <History className="h-4 w-4" />
          </Button>
        </div>

        <ScrollArea className="flex-1">
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
                Start a new conversation
              </p>
            </div>
          ) : (
            <div className="space-y-1 p-2">
              {sessions.map((session) => (
                <div
                  key={session.id}
                  className={`p-2 rounded-md flex justify-between items-start cursor-pointer hover:bg-muted/50 transition-colors text-sm ${currentChatId === session.id ? "bg-muted border border-primary/30" : "border border-transparent hover:border-primary/20"}`}
                  onClick={() => {
                    if (onSelectChat) {
                      onSelectChat(session.id);
                    } else {
                      // Navigate based on chat type
                      navigate(
                        `/chat/${session.chatType}?session=${session.id}`,
                      );
                    }
                  }}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      {getChatTypeIcon(session.chatType)}
                      <h3 className="font-medium truncate">{session.title}</h3>
                    </div>
                    <p className="text-xs text-muted-foreground truncate mt-1">
                      {session.lastMessage || "No messages yet"}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 opacity-50 hover:opacity-100 ml-1"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSessionToDelete(session.id);
                      setDeleteDialogOpen(true);
                    }}
                  >
                    <Trash2 className="h-3 w-3" />
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
            <AlertDialogAction
              onClick={handleDeleteSession}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
