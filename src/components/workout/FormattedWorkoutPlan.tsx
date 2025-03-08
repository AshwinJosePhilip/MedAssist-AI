import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dumbbell, Clock, Calendar } from "lucide-react";

interface WorkoutDay {
  day: number;
  exercises: Array<{
    name: string;
    sets: number;
    reps: string;
  }>;
}

interface FormattedWorkoutPlanProps {
  title?: string;
  days: WorkoutDay[];
  notes?: string[];
}

export default function FormattedWorkoutPlan({
  title = "3-Day Tricep Workout Routine",
  days = [
    {
      day: 1,
      exercises: [
        { name: "Tricep Dips", sets: 3, reps: "12-15" },
        { name: "Tricep Pushdowns", sets: 3, reps: "12-15" },
        { name: "Tricep Extensions", sets: 3, reps: "12-15" },
      ],
    },
    {
      day: 2,
      exercises: [
        { name: "Overhead Tricep Extension", sets: 3, reps: "12-15" },
        { name: "Tricep Kickbacks", sets: 3, reps: "12-15" },
        { name: "Skull Crushers", sets: 3, reps: "12-15" },
      ],
    },
    {
      day: 3,
      exercises: [
        { name: "Tricep Dips with a Bench", sets: 3, reps: "12-15" },
        { name: "Close-grip Bench Press", sets: 3, reps: "12-15" },
        { name: "Tricep Pushdowns with a Rope", sets: 3, reps: "12-15" },
      ],
    },
  ],
  notes = [
    "Remember to keep proper form during all exercises",
    "Allow your body enough time to recover between workouts",
    "Consider taking a rest day after completing this 3-day routine",
    "For a balanced workout routine, include cardio, strength training, and flexibility exercises",
  ],
}: FormattedWorkoutPlanProps) {
  return (
    <Card className="w-full bg-card/90 backdrop-blur-sm shadow-md border border-primary/20">
      <CardHeader className="pb-2 border-b border-border/50">
        <CardTitle className="flex items-center gap-2 text-xl">
          <Dumbbell className="h-5 w-5 text-primary" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-6">
          {days.map((day) => (
            <div key={day.day} className="space-y-3">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <Calendar className="h-4 w-4 text-primary" />
                <span>Day {day.day}</span>
              </h3>

              <div className="bg-muted/30 rounded-md overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="text-left p-2">Exercise</th>
                      <th className="p-2 text-center">Sets</th>
                      <th className="p-2 text-center">Reps</th>
                    </tr>
                  </thead>
                  <tbody>
                    {day.exercises.map((exercise, index) => (
                      <tr key={index} className="border-t border-muted/20">
                        <td className="p-2">{exercise.name}</td>
                        <td className="p-2 text-center">{exercise.sets}</td>
                        <td className="p-2 text-center">{exercise.reps}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}

          {notes && notes.length > 0 && (
            <div className="mt-4 pt-4 border-t border-border/50">
              <h3 className="font-semibold mb-2">Important Notes:</h3>
              <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                {notes.map((note, index) => (
                  <li key={index}>{note}</li>
                ))}
              </ul>
              <div className="mt-3 text-xs text-muted-foreground">
                <p>
                  Source: American Council on Exercise (ACE) - "Tricep
                  Exercises"
                </p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
