import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ChevronDown,
  ChevronUp,
  MapPin,
  Pill,
  Apple,
  Phone,
} from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

type ResponseCardProps = {
  type: "medical-advice" | "first-aid" | "hospital-info" | "diet-plan";
  title?: string;
  content?: string | React.ReactNode;
  details?: {
    location?: string;
    phone?: string;
    instructions?: string[];
    medications?: string[];
    meals?: { time: string; food: string[] }[];
    sources?: Array<{
      type: string;
      title: string;
      url: string;
    }>;
  };
};

const ResponseCard = ({
  type = "medical-advice",
  title = "Medical Information",
  content = "Here is some medical information that might be helpful.",
  details = {
    location: "123 Medical Center Dr",
    phone: "(555) 123-4567",
    instructions: ["Rest well", "Stay hydrated", "Take prescribed medication"],
    medications: ["Medication A - 2 times daily", "Medication B - as needed"],
    meals: [
      { time: "Breakfast", food: ["Oatmeal", "Fresh fruit", "Green tea"] },
      { time: "Lunch", food: ["Grilled chicken", "Quinoa", "Vegetables"] },
      { time: "Dinner", food: ["Fish", "Brown rice", "Steamed vegetables"] },
    ],
  },
}: ResponseCardProps) => {
  const [isOpen, setIsOpen] = React.useState(true);

  const renderIcon = () => {
    switch (type) {
      case "medical-advice":
        return <Pill className="h-5 w-5" />;
      case "first-aid":
        return <Phone className="h-5 w-5" />;
      case "hospital-info":
        return <MapPin className="h-5 w-5" />;
      case "diet-plan":
        return <Apple className="h-5 w-5" />;
      default:
        return <Pill className="h-5 w-5" />;
    }
  };

  const renderDetails = () => {
    const sources = details?.sources;

    switch (type) {
      case "hospital-info":
        return (
          <div className="space-y-2">
            <p className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              {details.location}
            </p>
            <p className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              {details.phone}
            </p>
          </div>
        );
      case "medical-advice":
      case "first-aid":
        return (
          <ul className="list-disc pl-5 space-y-1">
            {details.instructions?.map((instruction, index) => (
              <li key={index}>{instruction}</li>
            ))}
          </ul>
        );
      case "diet-plan":
        return (
          <div className="space-y-4">
            {details.meals?.map((meal, index) => (
              <div key={index} className="space-y-2">
                <h4 className="font-medium">{meal.time}</h4>
                <ul className="list-disc pl-5">
                  {meal.food.map((item, foodIndex) => (
                    <li key={foodIndex}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        );
      default:
        return null;
    }

    // Add sources section if available
    return (
      <div className="space-y-4">
        {renderDetails()}
        {sources && sources.length > 0 && (
          <div className="mt-4 pt-4 border-t">
            <h4 className="text-sm font-medium mb-2">Sources:</h4>
            <ul className="space-y-1">
              {sources.map((source, index) => (
                <li
                  key={index}
                  className="text-sm text-blue-600 hover:underline"
                >
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    [{source.type}] {source.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  };

  return (
    <Card className="w-full max-w-2xl mx-auto bg-white shadow-md hover:shadow-lg transition-shadow">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xl flex items-center gap-2">
            {renderIcon()}
            {title}
          </CardTitle>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm">
              {isOpen ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
          </CollapsibleTrigger>
        </CardHeader>
        <CollapsibleContent>
          <CardContent>
            <div className="space-y-4">
              {typeof content === "string" ? (
                <p className="text-gray-600">{content}</p>
              ) : (
                content
              )}
              {renderDetails()}
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};

export default ResponseCard;
