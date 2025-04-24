import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import { getUserChatStats } from "@/lib/userChatHistory";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/use-toast";
import { User, MessageSquare, Calendar, FileText, Activity } from "lucide-react";

interface ProfileStats {
  medical: number;
  firstaid: number;
  fitness: number;
  total: number;
}

export default function Profile() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [fullName, setFullName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [stats, setStats] = useState<ProfileStats>({
    medical: 0,
    firstaid: 0,
    fitness: 0,
    total: 0,
  });

  useEffect(() => {
    async function loadProfile() {
      try {
        setLoading(true);
        if (!user) return;

        // Load profile data
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        if (error) {
          throw error;
        }

        if (data) {
          setFullName(data.full_name || "");
          setAvatarUrl(data.avatar_url || "");
        }

        // Load chat statistics
        const chatStats = await getUserChatStats(user.id);
        setStats(chatStats);
      } catch (error) {
        console.error("Error loading profile:", error);
        toast({
          title: "Error",
          description: "Failed to load profile data",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, [user]);

  async function updateProfile() {
    try {
      setUpdating(true);
      if (!user) return;

      const updates = {
        id: user.id,
        full_name: fullName,
        avatar_url: avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase.from("profiles").upsert(updates);

      if (error) {
        throw error;
      }

      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully",
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setUpdating(false);
    }
  }

  if (!user) {
    return (
      <div className="container max-w-6xl py-20 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Not Authenticated</CardTitle>
            <CardDescription>
              Please sign in to view your profile.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const createdAt = user.created_at
    ? new Date(user.created_at).toLocaleDateString()
    : "Unknown";

  return (
    <div className="container max-w-6xl py-20">
      <div className="space-y-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
          <p className="text-muted-foreground">
            Manage your account settings and view chat statistics
          </p>
        </div>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="statistics">Statistics</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>
                  Update your personal details and profile picture
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-col md:flex-row gap-6 items-start">
                  <div className="flex flex-col items-center gap-2">
                    <Avatar className="h-24 w-24 border-2 border-primary/20">
                      <AvatarImage
                        src={
                          avatarUrl ||
                          `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`
                        }
                        alt={fullName || user.email || ""}
                      />
                      <AvatarFallback className="text-2xl">
                        {(fullName || user.email || "")
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <p className="text-xs text-muted-foreground">
                      Avatar automatically generated
                    </p>
                  </div>

                  <div className="flex-1 space-y-4">
                    <div className="grid gap-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        value={user.email || ""}
                        disabled
                        className="bg-muted/50"
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Enter your full name"
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="created">Account Created</Label>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>{createdAt}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  onClick={updateProfile}
                  disabled={updating}
                  className="ml-auto"
                >
                  {updating ? "Updating..." : "Update Profile"}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="statistics" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Chat Statistics</CardTitle>
                <CardDescription>
                  Overview of your chat interactions with MedAssist AI
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        Total Chats
                      </CardTitle>
                      <MessageSquare className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{stats.total}</div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        Medical Chats
                      </CardTitle>
                      <User className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{stats.medical}</div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        First Aid Chats
                      </CardTitle>
                      <Activity className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{stats.firstaid}</div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        Fitness Chats
                      </CardTitle>
                      <FileText className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{stats.fitness}</div>
                    </CardContent>
                  </Card>
                </div>

                <Separator className="my-6" />

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Chat Distribution</h3>
                  <div className="flex flex-wrap gap-2">
                    {stats.medical > 0 && (
                      <Badge variant="outline" className="bg-blue-500/10">
                        Medical: {stats.medical}
                      </Badge>
                    )}
                    {stats.firstaid > 0 && (
                      <Badge variant="outline" className="bg-red-500/10">
                        First Aid: {stats.firstaid}
                      </Badge>
                    )}
                    {stats.fitness > 0 && (
                      <Badge variant="outline" className="bg-green-500/10">
                        Fitness: {stats.fitness}
                      </Badge>
                    )}
                    {stats.total === 0 && (
                      <p className="text-sm text-muted-foreground">
                        You haven't started any chats yet. Try our different chat
                        assistants to get personalized help.
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}