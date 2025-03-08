interface Exercise {
  name: string;
  sets: number;
  reps: string;
  rest?: string;
}

interface Workout {
  name: string;
  exercises: Exercise[];
  duration?: string;
  frequency?: string;
}

export interface WorkoutPlan {
  workouts: Workout[];
}

export async function getWorkoutPlan(condition: string): Promise<WorkoutPlan> {
  // Simulated response based on condition
  const plans = {
    cardio: {
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
            {
              name: "Wall Push-ups",
              sets: 3,
              reps: "10-12",
              rest: "60 seconds",
            },
            { name: "Chair Dips", sets: 3, reps: "8-10", rest: "60 seconds" },
          ],
          duration: "20-30 minutes",
          frequency: "2-3 times per week",
        },
      ],
    },
    strength: {
      workouts: [
        {
          name: "Upper Body",
          exercises: [
            {
              name: "Dumbbell Bench Press",
              sets: 3,
              reps: "8-12",
              rest: "90 seconds",
            },
            {
              name: "Bent-Over Rows",
              sets: 3,
              reps: "8-12",
              rest: "90 seconds",
            },
            {
              name: "Shoulder Press",
              sets: 3,
              reps: "8-12",
              rest: "90 seconds",
            },
            { name: "Bicep Curls", sets: 3, reps: "10-15", rest: "60 seconds" },
            {
              name: "Tricep Extensions",
              sets: 3,
              reps: "10-15",
              rest: "60 seconds",
            },
          ],
          duration: "45-60 minutes",
          frequency: "2 times per week",
        },
        {
          name: "Lower Body",
          exercises: [
            { name: "Squats", sets: 4, reps: "8-12", rest: "120 seconds" },
            {
              name: "Lunges",
              sets: 3,
              reps: "10 each leg",
              rest: "90 seconds",
            },
            { name: "Leg Press", sets: 3, reps: "10-12", rest: "90 seconds" },
            { name: "Calf Raises", sets: 3, reps: "15-20", rest: "60 seconds" },
            {
              name: "Hamstring Curls",
              sets: 3,
              reps: "10-12",
              rest: "90 seconds",
            },
          ],
          duration: "45-60 minutes",
          frequency: "2 times per week",
        },
      ],
    },
    beginner: {
      workouts: [
        {
          name: "Full Body Workout",
          exercises: [
            {
              name: "Bodyweight Squats",
              sets: 2,
              reps: "10-12",
              rest: "60 seconds",
            },
            {
              name: "Modified Push-ups",
              sets: 2,
              reps: "5-10",
              rest: "60 seconds",
            },
            {
              name: "Walking Lunges",
              sets: 2,
              reps: "8 each leg",
              rest: "60 seconds",
            },
            { name: "Seated Rows", sets: 2, reps: "10-12", rest: "60 seconds" },
            {
              name: "Plank",
              sets: 2,
              reps: "20-30 seconds",
              rest: "60 seconds",
            },
          ],
          duration: "30 minutes",
          frequency: "3 times per week",
        },
        {
          name: "Cardio Starter",
          exercises: [
            { name: "Brisk Walking", sets: 1, reps: "15 minutes", rest: "N/A" },
            {
              name: "Stationary Bike",
              sets: 1,
              reps: "10 minutes",
              rest: "N/A",
            },
            {
              name: "Light Stretching",
              sets: 1,
              reps: "5 minutes",
              rest: "N/A",
            },
          ],
          duration: "30 minutes",
          frequency: "2-3 times per week",
        },
      ],
    },
  };

  // Determine which plan to return based on the condition
  if (condition.includes("strength") || condition.includes("muscle")) {
    return plans.strength;
  } else if (condition.includes("beginner") || condition.includes("new")) {
    return plans.beginner;
  } else {
    return plans.cardio; // Default to cardio plan
  }
}
