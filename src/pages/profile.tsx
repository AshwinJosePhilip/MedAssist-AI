<<<<<<< HEAD
import React, { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Mail, Phone, MapPin, Shield, FileText } from "lucide-react";

export default function Profile() {
  const { user, signOut } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [profile, setProfile] = useState({
    fullName: "",
    email: "",
    phone: "",
    location: "",
    avatarUrl: "",
  });

  useEffect(() => {
    if (user) {
      loadUserProfile();
    }
  }, [user]);

  const loadUserProfile = async () => {
    if (!user) return;

    setLoading(true);
    try {
      // Get profile data from Supabase
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error) throw error;

      if (data) {
        setProfile({
          fullName: data.full_name || user.user_metadata?.full_name || "",
          email: user.email || "",
          phone: data.phone || "",
          location: data.location || "",
          avatarUrl:
            data.avatar_url ||
            `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`,
        });
      }
    } catch (error) {
      console.error("Error loading profile:", error);
      setError("Failed to load profile data");
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const { error } = await supabase.from("profiles").upsert({
        id: user.id,
        full_name: profile.fullName,
        phone: profile.phone,
        location: profile.location,
        avatar_url: profile.avatarUrl,
        updated_at: new Date().toISOString(),
      });

      if (error) throw error;

      setSuccess("Profile updated successfully");
    } catch (error) {
      console.error("Error updating profile:", error);
      setError("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="container mx-auto py-10 px-4">
        <Alert>
          <AlertDescription>
            Please sign in to view your profile
          </AlertDescription>
        </Alert>
=======
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
>>>>>>> 60ad4590a28d38bff88b365648d8f84d72beb42f
      </div>
    );
  }

<<<<<<< HEAD
  return (
    <div className="container mx-auto py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Your Profile</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Profile Card */}
          <Card className="md:col-span-1">
            <CardContent className="pt-6 flex flex-col items-center">
              <Avatar className="h-24 w-24 mb-4">
                <AvatarImage src={profile.avatarUrl} alt={profile.fullName} />
                <AvatarFallback className="text-lg">
                  {profile.fullName
                    ?.split(" ")
                    .map((n) => n[0])
                    .join("") || user.email?.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <h2 className="text-xl font-semibold">
                {profile.fullName || "User"}
              </h2>
              <p className="text-muted-foreground">{profile.email}</p>

              <div className="w-full mt-6 space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{profile.email}</span>
                </div>
                {profile.phone && (
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{profile.phone}</span>
                  </div>
                )}
                {profile.location && (
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{profile.location}</span>
                  </div>
                )}
              </div>

              <Button
                variant="outline"
                className="mt-6 w-full"
                onClick={() => signOut()}
              >
                Sign Out
              </Button>
            </CardContent>
          </Card>

          {/* Edit Profile */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Edit Profile</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="personal">
                <TabsList className="mb-4">
                  <TabsTrigger
                    value="personal"
                    className="flex items-center gap-2"
                  >
                    <User className="h-4 w-4" />
                    Personal Info
                  </TabsTrigger>
                  <TabsTrigger
                    value="security"
                    className="flex items-center gap-2"
                  >
                    <Shield className="h-4 w-4" />
                    Security
                  </TabsTrigger>
                  <TabsTrigger
                    value="documents"
                    className="flex items-center gap-2"
                  >
                    <FileText className="h-4 w-4" />
                    Documents
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="personal">
                  <form onSubmit={updateProfile} className="space-y-4">
                    {error && (
                      <Alert variant="destructive">
                        <AlertDescription>{error}</AlertDescription>
                      </Alert>
                    )}
                    {success && (
                      <Alert>
                        <AlertDescription>{success}</AlertDescription>
                      </Alert>
                    )}

                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name</Label>
                      <Input
                        id="fullName"
                        value={profile.fullName}
                        onChange={(e) =>
                          setProfile({ ...profile, fullName: e.target.value })
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" value={profile.email} disabled />
                      <p className="text-xs text-muted-foreground">
                        Email cannot be changed
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        value={profile.phone}
                        onChange={(e) =>
                          setProfile({ ...profile, phone: e.target.value })
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        value={profile.location}
                        onChange={(e) =>
                          setProfile({ ...profile, location: e.target.value })
                        }
                        placeholder="City, Country"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="avatarUrl">Avatar URL</Label>
                      <Input
                        id="avatarUrl"
                        value={profile.avatarUrl}
                        onChange={(e) =>
                          setProfile({ ...profile, avatarUrl: e.target.value })
                        }
                        placeholder="https://example.com/avatar.jpg"
                      />
                    </div>

                    <Button type="submit" disabled={loading}>
                      {loading ? "Saving..." : "Save Changes"}
                    </Button>
                  </form>
                </TabsContent>

                <TabsContent value="security">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Security Settings</h3>
                    <p className="text-muted-foreground">
                      Manage your password and security preferences.
                    </p>
                    <div className="border rounded-md p-4">
                      <h4 className="font-medium mb-2">Change Password</h4>
                      <p className="text-sm text-muted-foreground mb-4">
                        To change your password, please use the password reset
                        functionality from the login page.
                      </p>
                      <Button variant="outline" onClick={() => signOut()}>
                        Sign Out & Reset Password
                      </Button>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="documents">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Your Documents</h3>
                    <p className="text-muted-foreground">
                      View and manage your uploaded medical documents.
                    </p>
                    <Button
                      variant="outline"
                      onClick={() => (window.location.href = "/documents")}
                    >
                      Go to Documents
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
=======
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
>>>>>>> 60ad4590a28d38bff88b365648d8f84d72beb42f
