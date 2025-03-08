import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import {
  getUserChatSessionsByType,
  getUserChatStats,
} from "@/lib/userChatHistory";
import { ChatSession } from "@/lib/chatHistory";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Pill,
  AlertCircle,
  Dumbbell,
  MessageSquare,
  Clock,
  Calendar,
} from "lucide-react";

export default function UserChatHistory() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("all");
  const [medicalChats, setMedicalChats] = useState<ChatSession[]>([]);
  const [firstAidChats, setFirstAidChats] = useState<ChatSession[]>([]);
  const [fitnessChats, setFitnessChats] = useState<ChatSession[]>([]);
  const [chatStats, setChatStats] = useState({
    medical: 0,
    firstaid: 0,
    fitness: 0,
    total: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadChatHistory();
    }
  }, [user]);

  const loadChatHistory = async () => {
    if (!user) return;

    setLoading(true);
    try {
      // Load chat sessions by type
      const [medical, firstaid, fitness, stats] = await Promise.all([
        getUserChatSessionsByType(user.id, "medical"),
        getUserChatSessionsByType(user.id, "firstaid"),
        getUserChatSessionsByType(user.id, "fitness"),
        getUserChatStats(user.id),
      ]);

      setMedicalChats(medical);
      setFirstAidChats(firstaid);
      setFitnessChats(fitness);
      setChatStats(stats);
    } catch (error) {
      console.error("Error loading chat history:", error);
    } finally {
      setLoading(false);
    }
  };

  const getChatTypeIcon = (type: string) => {
    switch (type) {
      case "medical":
        return <Pill className="h-5 w-5 text-blue-500" />;
      case "firstaid":
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case "fitness":
        return <Dumbbell className="h-5 w-5 text-green-500" />;
      default:
        return <MessageSquare className="h-5 w-5 text-primary" />;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const renderChatList = (chats: ChatSession[]) => {
    if (chats.length === 0) {
      return (
        <div className="text-center py-8 bg-muted/20 rounded-lg border border-border">
          <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p className="text-muted-foreground">No conversations found</p>
          <p className="text-sm text-muted-foreground mt-2">
            Start a new chat to see your history here
          </p>
        </div>
      );
    }

    return (
      <div className="space-y-3">
        {chats.map((chat) => (
          <Card
            key={chat.id}
            className="hover:shadow-md transition-all cursor-pointer border border-primary/10 hover:border-primary/30"
            onClick={() =>
              navigate(`/chat/${chat.chatType}?session=${chat.id}`)
            }
          >
            <CardContent className="p-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  {getChatTypeIcon(chat.chatType)}
                  <h3 className="font-medium">{chat.title}</h3>
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  <span>{formatDate(chat.updatedAt)}</span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mt-2 truncate">
                {chat.lastMessage || "No messages yet"}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <div className="container py-8 mt-16">
      <h1 className="text-3xl font-bold mb-6">Your Chat History</h1>

      {/* Chat Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-4 flex flex-col items-center justify-center h-full">
            <div className="text-4xl font-bold text-primary mb-2">
              {chatStats.total}
            </div>
            <div className="text-sm text-muted-foreground">
              Total Conversations
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <Pill className="h-8 w-8 text-blue-500" />
            <div>
              <div className="text-2xl font-bold">{chatStats.medical}</div>
              <div className="text-sm text-muted-foreground">Medical Chats</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <AlertCircle className="h-8 w-8 text-red-500" />
            <div>
              <div className="text-2xl font-bold">{chatStats.firstaid}</div>
              <div className="text-sm text-muted-foreground">
                First Aid Chats
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <Dumbbell className="h-8 w-8 text-green-500" />
            <div>
              <div className="text-2xl font-bold">{chatStats.fitness}</div>
              <div className="text-sm text-muted-foreground">Fitness Chats</div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full max-w-md grid-cols-4 mb-8">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="medical">Medical</TabsTrigger>
          <TabsTrigger value="firstaid">First Aid</TabsTrigger>
          <TabsTrigger value="fitness">Fitness</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">All Conversations</h2>
            <Button onClick={() => navigate("/chat")} className="gap-2">
              <MessageSquare className="h-4 w-4" /> New Chat
            </Button>
          </div>
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-pulse text-muted-foreground">
                Loading chat history...
              </div>
            </div>
          ) : (
            renderChatList(
              [...medicalChats, ...firstAidChats, ...fitnessChats].sort(
                (a, b) =>
                  new Date(b.updatedAt).getTime() -
                  new Date(a.updatedAt).getTime(),
              ),
            )
          )}
        </TabsContent>

        <TabsContent value="medical" className="space-y-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Medical Conversations</h2>
            <Button onClick={() => navigate("/chat/medical")} className="gap-2">
              <Pill className="h-4 w-4" /> New Medical Chat
            </Button>
          </div>
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-pulse text-muted-foreground">
                Loading medical chats...
              </div>
            </div>
          ) : (
            renderChatList(medicalChats)
          )}
        </TabsContent>

        <TabsContent value="firstaid" className="space-y-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">First Aid Conversations</h2>
            <Button
              onClick={() => navigate("/chat/firstaid")}
              className="gap-2"
            >
              <AlertCircle className="h-4 w-4" /> New First Aid Chat
            </Button>
          </div>
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-pulse text-muted-foreground">
                Loading first aid chats...
              </div>
            </div>
          ) : (
            renderChatList(firstAidChats)
          )}
        </TabsContent>

        <TabsContent value="fitness" className="space-y-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">
              Fitness & Nutrition Conversations
            </h2>
            <Button onClick={() => navigate("/chat/fitness")} className="gap-2">
              <Dumbbell className="h-4 w-4" /> New Fitness Chat
            </Button>
          </div>
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-pulse text-muted-foreground">
                Loading fitness chats...
              </div>
            </div>
          ) : (
            renderChatList(fitnessChats)
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
