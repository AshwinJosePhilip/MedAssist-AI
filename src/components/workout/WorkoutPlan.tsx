import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Dumbbell, Clock, Calendar } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

type WorkoutPlanProps = {
  title?: string;
  content?: string | React.ReactNode;
  details?: {
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
  };
};

const WorkoutPlan = ({
  title = "Recommended Workout Plan",
  content = "Here is a personalized workout plan based on your condition:",
  details = {
    workouts: [
      {
        name: "Cardiovascular Health",
        exercises: [
          { name: "Brisk Walking", sets: 1, reps: "30 minutes", rest: "N/A" },
          { name: "Cycling", sets: 1, reps: "20 minutes", rest: "N/A" },
          { name: "Swimming", sets: 1, reps: "20 minutes", rest: "N/A" },
        ],
        duration: "30-45 minutes",
        frequency: "3-5 times per week",
      },
      {
        name: "Strength Training",
        exercises: [
          {
            name: "Bodyweight Squats",
            sets: 3,
            reps: "10-15",
            rest: "60 seconds",
          },
          { name: "Wall Push-ups", sets: 3, reps: "10-12", rest: "60 seconds" },
          { name: "Chair Dips", sets: 3, reps: "8-10", rest: "60 seconds" },
        ],
        duration: "20-30 minutes",
        frequency: "2-3 times per week",
      },
    ],
  },
}: WorkoutPlanProps) => {
  const [isOpen, setIsOpen] = React.useState(true);

  return (
    <Card className="w-full max-w-2xl mx-auto bg-card/90 backdrop-blur-sm shadow-md hover:shadow-lg transition-all border border-primary/20 hover:border-primary/40">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xl flex items-center gap-2">
            <Dumbbell className="h-5 w-5" />
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
                            <tr
                              key={exIndex}
                              className="border-t border-muted/20"
                            >
                              <td className="p-2">{exercise.name}</td>
                              <td className="p-2 text-center">
                                {exercise.sets}
                              </td>
                              <td className="p-2 text-center">
                                {exercise.reps}
                              </td>
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
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};

export default WorkoutPlan;
