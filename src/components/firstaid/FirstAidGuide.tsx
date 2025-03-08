import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import { AlertCircle, Phone, Clock, CheckCircle } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

type FirstAidGuideProps = {
  title?: string;
  content?: string | React.ReactNode;
  emergency?: boolean;
  details?: {
    condition?: string;
    steps?: Array<{
      instruction: string;
      description?: string;
      important?: boolean;
    }>;
    emergencyContact?: string;
    timeFrame?: string;
    doNotDo?: string[];
  };
};

const FirstAidGuide = ({
  title = "First Aid Instructions",
  content = "Follow these steps carefully in case of emergency:",
  emergency = false,
  details = {
    condition: "General First Aid",
    steps: [
      {
        instruction: "Check the scene for safety",
        description: "Ensure there are no hazards to you or the victim",
        important: true,
      },
      {
        instruction: "Check responsiveness",
        description: "Tap and shout to see if the person responds",
      },
      {
        instruction: "Call emergency services",
        description: "If the situation is serious, call 911 immediately",
        important: true,
      },
      {
        instruction: "Provide care according to your training",
        description: "Only perform procedures you are trained to do",
      },
    ],
    emergencyContact: "911",
    timeFrame: "Act quickly - seconds matter in emergencies",
    doNotDo: [
      "Don't move a seriously injured person unless in immediate danger",
      "Don't give food or water to an unconscious person",
      "Don't remove embedded objects from wounds",
    ],
  },
}: FirstAidGuideProps) => {
  const [isOpen, setIsOpen] = React.useState(true);

  return (
    <Card
      className={`w-full max-w-2xl mx-auto shadow-md hover:shadow-lg transition-all border ${emergency ? "border-red-500/50 bg-red-950/20" : "border-primary/20 bg-card/90"} backdrop-blur-sm`}
    >
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CardHeader
          className={`flex flex-row items-center justify-between space-y-0 pb-2 ${emergency ? "bg-red-950/30" : ""}`}
        >
          <CardTitle className="text-xl flex items-center gap-2">
            <AlertCircle
              className={`h-5 w-5 ${emergency ? "text-red-500" : "text-primary"}`}
            />
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
              {emergency && (
                <div className="bg-red-500/20 border border-red-500/30 rounded-md p-3 flex items-start gap-2">
                  <Phone className="h-5 w-5 text-red-500 mt-0.5" />
                  <div>
                    <p className="font-semibold text-red-400">
                      Emergency - Call {details.emergencyContact || "911"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Seek immediate medical attention
                    </p>
                  </div>
                </div>
              )}

              {typeof content === "string" ? (
                <p className="text-gray-300">{content}</p>
              ) : (
                content
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

              <div className="space-y-4">
                <h4 className="font-medium">Follow these steps:</h4>
                <ol className="space-y-3">
                  {details.steps?.map((step, index) => (
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
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};

export default FirstAidGuide;
