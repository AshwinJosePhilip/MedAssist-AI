import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Pill,
  AlertCircle,
  Dumbbell,
  MessageSquare,
  Clock,
} from "lucide-react";
import { getChatSessions, ChatSession } from "@/lib/chatHistory";

export default function ChatbotSelection() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [recentChats, setRecentChats] = useState<ChatSession[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadRecentChats();
    } else {
      setLoading(false);
    }
  }, [user]);

  const loadRecentChats = async () => {
    try {
      setLoading(true);
      const sessions = await getChatSessions(user.id);
      setRecentChats(sessions.slice(0, 5)); // Get the 5 most recent chats
    } catch (error) {
      console.error("Error loading recent chats:", error);
    } finally {
      setLoading(false);
    }
  };

  const chatbots = [
    {
      id: "medical",
      title: "Medical Assistant",
      description:
        "Get reliable medical information and advice from trusted sources",
      icon: <Pill className="h-10 w-10 text-primary" />,
      color: "from-blue-500/20 to-blue-600/20",
      borderColor: "border-blue-500/30",
      route: "/chat/medical",
    },
    {
      id: "firstaid",
      title: "First Aid Support",
      description:
        "Emergency first aid instructions and guidance for urgent situations",
      icon: <AlertCircle className="h-10 w-10 text-red-500" />,
      color: "from-red-500/20 to-red-600/20",
      borderColor: "border-red-500/30",
      route: "/chat/firstaid",
    },
    {
      id: "fitness",
      title: "Fitness & Nutrition",
      description:
        "Personalized workout plans and dietary advice for your health goals",
      icon: <Dumbbell className="h-10 w-10 text-green-500" />,
      color: "from-green-500/20 to-green-600/20",
      borderColor: "border-green-500/30",
      route: "/chat/fitness",
    },
  ];

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

  return (
    <div className="flex flex-col min-h-screen pt-16">
      <main className="flex-1 container py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">
            Choose Your Health Assistant
          </h1>
          <p className="text-muted-foreground mb-8">
            Select the specialized AI assistant that best fits your current
            needs
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {chatbots.map((bot) => (
              <Card
                key={bot.id}
                className={`overflow-hidden hover:shadow-lg transition-all cursor-pointer border ${bot.borderColor}`}
                onClick={() => navigate(bot.route)}
              >
                <div className={`h-2 bg-gradient-to-r ${bot.color}`}></div>
                <CardContent className="p-6">
                  <div className="mb-4">{bot.icon}</div>
                  <h2 className="text-xl font-semibold mb-2">{bot.title}</h2>
                  <p className="text-muted-foreground text-sm mb-4">
                    {bot.description}
                  </p>
                  <Button
                    variant="outline"
                    className="w-full mt-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(bot.route);
                    }}
                  >
                    Start New Chat
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Recent Chats Section */}
          {user && (
            <div className="mt-12">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold">Recent Conversations</h2>
                <Button
                  variant="outline"
                  onClick={() => navigate("/chat/history")}
                  className="gap-2"
                >
                  <Clock className="h-4 w-4" />
                  View All History
                </Button>
              </div>
              {loading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-pulse text-muted-foreground">
                    Loading recent chats...
                  </div>
                </div>
              ) : recentChats.length === 0 ? (
                <div className="text-center py-8 bg-muted/20 rounded-lg border border-border">
                  <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p className="text-muted-foreground">
                    No recent conversations
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Start a new chat with one of our assistants above
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-3">
                  {recentChats.map((chat) => (
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
              )}
            </div>
          )}

          <div className="mt-12 p-6 bg-muted/20 rounded-lg border border-border">
            <h2 className="text-xl font-semibold mb-2">
              How Our Specialized Assistants Work
            </h2>
            <p className="text-muted-foreground mb-4">
              Each of our AI assistants is trained on specific medical domains
              to provide you with the most relevant and accurate information:
            </p>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <Pill className="h-5 w-5 text-primary mt-0.5" />
                <span>
                  <strong>Medical Assistant:</strong> Powered by RAG technology
                  that retrieves information from trusted medical sources like
                  MedlinePlus and PubMed.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
                <span>
                  <strong>First Aid Support:</strong> Provides step-by-step
                  emergency instructions based on official first aid protocols
                  and guidelines.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Dumbbell className="h-5 w-5 text-green-500 mt-0.5" />
                <span>
                  <strong>Fitness & Nutrition:</strong> Offers personalized
                  workout routines and dietary recommendations based on your
                  health profile and goals.
                </span>
              </li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}
