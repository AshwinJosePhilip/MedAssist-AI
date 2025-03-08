import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, Clock, Calendar } from "lucide-react";
import {
  FileText,
  MapPin,
  Pill,
  Apple,
  Phone,
  Dumbbell,
  AlertCircle,
} from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

type ResponseCardProps = {
  type:
    | "medical-advice"
    | "first-aid"
    | "hospital-info"
    | "diet-plan"
    | "workout-plan"
    | "first-aid-guide";
  title?: string;
  content?: string | React.ReactNode;
  details?: {
    location?: string;
    phone?: string;
    instructions?: string[];
    medications?: string[];
    meals?: { time: string; food: string[] }[];
    workouts?: Array<{
      name: string;
      exercises: Array<{
        name: string;
        sets: number;
        reps: string;
        rest?: string;
      }>;
      duration?: string;
      frequency?: string;
    }>;
    firstAidSteps?: Array<{
      instruction: string;
      description?: string;
      important?: boolean;
    }>;
    emergencyContact?: string;
    timeFrame?: string;
    doNotDo?: string[];
    condition?: string;
    emergency?: boolean;
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
      case "first-aid-guide":
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case "hospital-info":
        return <MapPin className="h-5 w-5" />;
      case "diet-plan":
        return <Apple className="h-5 w-5" />;
      case "workout-plan":
        return <Dumbbell className="h-5 w-5" />;
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
      case "first-aid-guide":
        return (
          <div>
            {details.emergencyContact && (
              <div className="bg-red-500/20 border border-red-500/30 rounded-md p-3 flex items-start gap-2 mb-4">
                <Phone className="h-5 w-5 text-red-500 mt-0.5" />
                <div>
                  <p className="font-semibold text-red-400">
                    Emergency - Call {details.emergencyContact}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Seek immediate medical attention
                  </p>
                </div>
              </div>
            )}

            {details.condition && (
              <div className="mb-4">
                <h3 className="text-lg font-semibold">{details.condition}</h3>
              </div>
            )}

            {details.timeFrame && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                <Clock className="h-4 w-4" />
                <span>{details.timeFrame}</span>
              </div>
            )}

            {details.firstAidSteps ? (
              <div className="space-y-4">
                <h4 className="font-medium">Follow these steps:</h4>
                <ol className="space-y-3">
                  {details.firstAidSteps.map((step, index) => (
                    <li key={index} className="pl-2">
                      <div
                        className={`flex gap-2 ${step.important ? "text-red-400" : ""}`}
                      >
                        <span className="font-bold">{index + 1}.</span>
                        <div>
                          <p className="font-medium">{step.instruction}</p>
                          {step.description && (
                            <p className="text-sm text-muted-foreground">
                              {step.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            ) : (
              <ul className="list-disc pl-5 space-y-1">
                {details.instructions?.map((instruction, index) => (
                  <li key={index}>{instruction}</li>
                ))}
              </ul>
            )}

            {details.doNotDo && details.doNotDo.length > 0 && (
              <div className="mt-6 bg-muted/30 p-4 rounded-md">
                <h4 className="font-medium mb-2">Important: Do NOT</h4>
                <ul className="space-y-2">
                  {details.doNotDo.map((item, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-red-500 font-bold">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {sources && sources.length > 0 && (
              <div className="mt-4 pt-2 border-t border-primary/10">
                <p className="text-sm font-medium mb-2">Source:</p>
                {sources.map(
                  (source, index) =>
                    index === 0 && (
                      <a
                        key={index}
                        href={source.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-primary hover:underline inline-flex items-center gap-1"
                      >
                        {source.title} <FileText className="h-3 w-3" />
                      </a>
                    ),
                )}
              </div>
            )}
          </div>
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
      case "workout-plan":
        return (
          <div className="space-y-6">
            {details.workouts?.map((workout, index) => (
              <div key={index} className="space-y-3">
                <h3 className="font-semibold text-lg">{workout.name}</h3>

                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-3">
                  {workout.duration && (
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{workout.duration}</span>
                    </div>
                  )}
                  {workout.frequency && (
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>{workout.frequency}</span>
                    </div>
                  )}
                </div>

                <div className="bg-muted/30 rounded-md overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-muted/50">
                      <tr>
                        <th className="text-left p-2">Exercise</th>
                        <th className="p-2 text-center">Sets</th>
                        <th className="p-2 text-center">Reps/Duration</th>
                        <th className="p-2 text-center">Rest</th>
                      </tr>
                    </thead>
                    <tbody>
                      {workout.exercises.map((exercise, exIndex) => (
                        <tr key={exIndex} className="border-t border-muted/20">
                          <td className="p-2">{exercise.name}</td>
                          <td className="p-2 text-center">{exercise.sets}</td>
                          <td className="p-2 text-center">{exercise.reps}</td>
                          <td className="p-2 text-center">
                            {exercise.rest || "N/A"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto bg-card/90 backdrop-blur-sm shadow-md hover:shadow-lg transition-all border border-primary/20 hover:border-primary/40">
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
