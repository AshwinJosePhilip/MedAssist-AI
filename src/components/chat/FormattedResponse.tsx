import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import FormattedWorkoutPlan from "../workout/FormattedWorkoutPlan";
import FormattedMedicalResponse from "../medical/FormattedMedicalResponse";
import HospitalList from "../medical/HospitalList";

interface FormattedResponseProps {
  content: string;
  type: "workout" | "nutrition" | "medical";
  data?: any;
}

export default function FormattedResponse({
  content,
  type,
  data,
}: FormattedResponseProps) {
  // For hospital search results
  if (type === "medical" && data?.hospitals?.length > 0) {
    return (
      <>
        <Card className="w-full bg-card/90 backdrop-blur-sm shadow-md border border-primary/20">
          <CardContent className="p-4 whitespace-pre-line">{content}</CardContent>
        </Card>
        <HospitalList hospitals={data.hospitals} />
      </>
    );
  }

  // For medical research responses with PubMed data
  if (type === "medical" && data?.pubmedArticles?.length > 0) {
    return (
      <FormattedMedicalResponse
        title="PubMed Research Evidence"
        articles={data.pubmedArticles}
      />
    );
  }

  // For workout plans, parse the content and format it
  if (type === "workout" && content.includes("Day 1:")) {
    // Parse the workout plan from the text
    const days = [];
    const dayRegex = /Day (\d+):\s*([\s\S]*?)(?=Day \d+:|$)/g;
    const notes = [];

    // Extract notes from the end of the content
    const notesSection =
      content.split("Remember")[1] || content.split("Note:")[1];
    if (notesSection) {
      const notesList = notesSection
        .split(/\r?\n/)
        .filter((line) => line.trim().length > 0);
      notesList.forEach((note) => {
        notes.push(note.trim());
      });
    }

    // Extract workout days
    let match;
    while ((match = dayRegex.exec(content)) !== null) {
      const dayNumber = parseInt(match[1]);
      const exercises = [];

      // Parse exercises for this day
      const exerciseLines = match[2]
        .split(/\r?\n/)
        .filter((line) => line.trim().length > 0);
      exerciseLines.forEach((line) => {
        const exerciseMatch = line.match(
          /(.*?):\s*(\d+)\s*sets\s*of\s*(\d+-\d+|\d+)\s*reps/i,
        );
        if (exerciseMatch) {
          exercises.push({
            name: exerciseMatch[1].trim(),
            sets: parseInt(exerciseMatch[2]),
            reps: exerciseMatch[3],
          });
        }
      });

      if (exercises.length > 0) {
        days.push({
          day: dayNumber,
          exercises,
        });
      }
    }

    // If we successfully parsed the workout plan, render it with the formatted component
    if (days.length > 0) {
      return <FormattedWorkoutPlan days={days} notes={notes} />;
    }
  }

  // Default rendering for other types or if parsing failed
  return (
    <Card className="w-full bg-card/90 backdrop-blur-sm shadow-md border border-primary/20">
      <CardContent className="p-4 whitespace-pre-line">{content}</CardContent>
    </Card>
  );
}
