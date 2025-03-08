import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, Search, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import FirstAidGuide from "@/components/firstaid/FirstAidGuide";
import { getFirstAidGuide } from "@/lib/firstaid";

export default function FirstAid() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const emergencyGuides = [
    {
      id: "cpr",
      title: "CPR Instructions",
      condition: "CPR (Cardiopulmonary Resuscitation)",
      emergency: true,
    },
    {
      id: "choking",
      title: "Choking First Aid",
      condition: "Choking",
      emergency: true,
    },
    {
      id: "bleeding",
      title: "Severe Bleeding",
      condition: "Severe Bleeding",
      emergency: true,
    },
    {
      id: "burns",
      title: "Burn Treatment",
      condition: "Burns",
      emergency: true,
    },
    {
      id: "heart-attack",
      title: "Heart Attack",
      condition: "Heart Attack",
      emergency: true,
    },
    {
      id: "stroke",
      title: "Stroke",
      condition: "Stroke",
      emergency: true,
    },
  ];

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setLoading(true);
    try {
      const guide = await getFirstAidGuide(searchQuery);
      setSearchResults(guide);
    } catch (error) {
      console.error("Error searching for first aid guide:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleGuideClick = async (condition: string) => {
    setLoading(true);
    try {
      const guide = await getFirstAidGuide(condition);
      setSearchResults(guide);
    } catch (error) {
      console.error("Error loading first aid guide:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen pt-16">
      <div className="bg-red-900/20 border-y border-red-500/30 py-2 px-4 text-center">
        <p className="text-sm text-red-400">
          For life-threatening emergencies, always call 112 or 1066 (poison
          control) immediately.
        </p>
      </div>

      <main className="flex-1 container py-12">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <AlertCircle className="h-8 w-8 text-red-500" />
            <h1 className="text-3xl font-bold">First Aid Guide</h1>
          </div>

          <p className="text-muted-foreground mb-8">
            Access step-by-step first aid instructions for common emergencies.
            This information is not a substitute for professional medical
            training or emergency services.
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="mb-10">
            <div className="flex gap-2">
              <Input
                placeholder="Search for first aid instructions (e.g., choking, burns, CPR)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1"
              />
              <Button type="submit" disabled={loading}>
                {loading ? "Searching..." : <Search className="h-4 w-4" />}
              </Button>
            </div>
          </form>

          {/* Search Results */}
          {searchResults && (
            <div className="mb-10">
              <FirstAidGuide
                title={`First Aid: ${searchResults.condition}`}
                emergency={searchResults.emergency}
                content={
                  searchResults.emergency
                    ? "EMERGENCY: Call for help immediately"
                    : "Follow these first aid steps carefully"
                }
                details={{
                  condition: searchResults.condition,
                  steps: searchResults.steps,
                  emergencyContact: searchResults.emergencyContact,
                  timeFrame: searchResults.timeFrame,
                  doNotDo: searchResults.doNotDo,
                }}
              />
            </div>
          )}

          {/* Common Emergency Guides */}
          <h2 className="text-2xl font-semibold mb-4">
            Common Emergency Guides
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
            {emergencyGuides.map((guide) => (
              <Card
                key={guide.id}
                className="border-red-500/30 hover:border-red-500/50 hover:shadow-md transition-all cursor-pointer"
                onClick={() => handleGuideClick(guide.condition)}
              >
                <CardContent className="p-4 flex items-center gap-3">
                  <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
                  <span className="font-medium">{guide.title}</span>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Interactive Chatbot CTA */}
          <div className="bg-muted/20 rounded-lg p-6 border border-primary/20">
            <h2 className="text-xl font-semibold mb-2">
              Need Interactive Guidance?
            </h2>
            <p className="text-muted-foreground mb-4">
              Use our First Aid Chatbot for step-by-step emergency instructions
              tailored to your specific situation.
            </p>
            <Button
              onClick={() => navigate("/chat/firstaid")}
              className="gap-2 bg-red-600 hover:bg-red-700"
            >
              Open First Aid Chatbot <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
