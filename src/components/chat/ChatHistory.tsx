import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import {
  getChatSessions,
  deleteChatSession,
  renameChatSession,
  ChatSession,
} from "@/lib/chatHistory";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Pill,
  AlertCircle,
  Dumbbell,
  MessageSquare,
  Trash2,
  Plus,
  Pencil,
} from "lucide-react";

interface ChatHistoryProps {
  currentChatId?: string;
  onSelectChat?: (sessionId: string) => void;
}

export default function ChatHistory({
  currentChatId,
  onSelectChat,
}: ChatHistoryProps) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [chatCount, setChatCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [sessionToDelete, setSessionToDelete] = useState<string | null>(null);
  const [renameDialogOpen, setRenameDialogOpen] = useState(false);
  const [sessionToRename, setSessionToRename] = useState<string | null>(null);
  const [newTitle, setNewTitle] = useState("");
  const [sessionToRenameTitle, setSessionToRenameTitle] = useState("");

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

  const handleRenameSession = async () => {
    if (!sessionToRename || !newTitle.trim()) return;

    try {
      const success = await renameChatSession(sessionToRename, newTitle.trim());
      if (success) {
        setSessions(
          sessions.map((session) =>
            session.id === sessionToRename
              ? { ...session, title: newTitle.trim() }
              : session
          )
        );
      }
    } catch (error) {
      console.error("Error renaming chat session:", error);
    } finally {
      setRenameDialogOpen(false);
      setSessionToRename(null);
      setNewTitle("");
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
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="h-9 w-9 relative">
            <MessageSquare className="h-5 w-5" />
            <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-primary"></span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-80 sm:w-96">
          <SheetHeader className="pb-4">
            <SheetTitle className="text-xl">
              Chat History ({chatCount})
            </SheetTitle>
          </SheetHeader>

          <div className="flex justify-between items-center mb-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/chat")}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              New Chat
            </Button>
          </div>

          <ScrollArea className="h-[calc(100vh-8rem)]">
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="animate-pulse text-muted-foreground">
                  Loading chats...
                </div>
              </div>
            ) : sessions.length === 0 ? (
              <div className="text-center py-8 bg-muted/20 rounded-lg border border-border">
                <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-muted-foreground">No chat history yet</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Start a new conversation to see it here
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {sessions.map((session) => (
                  <div
                    key={session.id}
                    className={`p-4 rounded-md flex justify-between items-start cursor-pointer hover:bg-muted/50 transition-colors ${currentChatId === session.id ? "bg-muted border border-primary/30" : "border border-transparent hover:border-primary/20"}`}
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
                        <h3 className="font-medium truncate">
                          {session.title}
                        </h3>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">
                        {formatDate(session.updatedAt)}
                      </p>
                      <p className="text-sm text-muted-foreground truncate mt-2">
                        {session.lastMessage || "No messages yet"}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 opacity-50 hover:opacity-100"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSessionToRename(session.id);
                          setSessionToRenameTitle(session.title);
                          setNewTitle(session.title);
                          setRenameDialogOpen(true);
                        }}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 opacity-50 hover:opacity-100"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSessionToDelete(session.id);
                          setDeleteDialogOpen(true);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </SheetContent>
      </Sheet>

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
      <Dialog open={renameDialogOpen} onOpenChange={setRenameDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rename Chat</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Input
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Enter new title"
              className="w-full"
            />
          </div>
          <DialogFooter>
            <Button
              variant="secondary"
              onClick={() => {
                setRenameDialogOpen(false);
                setSessionToRename(null);
                setNewTitle("");
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleRenameSession}>Rename</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
