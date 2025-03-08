interface FirstAidStep {
  instruction: string;
  description?: string;
  important?: boolean;
}

interface FirstAidGuide {
  condition: string;
  steps: FirstAidStep[];
  emergencyContact: string;
  timeFrame: string;
  doNotDo: string[];
  emergency: boolean;
}

export async function getFirstAidGuide(
  condition: string,
): Promise<FirstAidGuide | null> {
  // Map of first aid guides for different conditions
  const guides: Record<string, FirstAidGuide> = {
    bleeding: {
      condition: "Severe Bleeding",
      steps: [
        {
          instruction: "Apply direct pressure",
          description:
            "Use a clean cloth or bandage and apply firm pressure directly to the wound",
          important: true,
        },
        {
          instruction: "Keep pressure continuous",
          description:
            "Maintain pressure for at least 15 minutes without removing the cloth",
        },
        {
          instruction: "Elevate the wound",
          description:
            "If possible, raise the injured area above the level of the heart",
        },
        {
          instruction: "Apply a pressure bandage",
          description:
            "Once bleeding slows, wrap the wound firmly with a bandage",
        },
        {
          instruction: "Seek medical attention",
          description:
            "Get professional help, especially if bleeding doesn't stop or is severe",
          important: true,
        },
      ],
      emergencyContact: "112",
      timeFrame: "Act immediately - blood loss can be life-threatening",
      doNotDo: [
        "Don't remove the first cloth if it becomes soaked - add another on top",
        "Don't apply a tourniquet unless you have proper training",
        "Don't clean a wound that's bleeding severely - focus on stopping the bleeding first",
      ],
      emergency: true,
    },
    burn: {
      condition: "Burns",
      steps: [
        {
          instruction: "Remove from heat source",
          description: "Stop the burning process immediately",
          important: true,
        },
        {
          instruction: "Cool the burn",
          description:
            "Run cool (not cold) water over the burn for 10-15 minutes",
          important: true,
        },
        {
          instruction: "Remove jewelry or tight items",
          description: "Take off rings, watches, etc. before swelling occurs",
        },
        {
          instruction: "Cover with clean, dry bandage",
          description: "Use sterile, non-stick bandages and wrap loosely",
        },
        {
          instruction: "Take pain reliever if needed",
          description:
            "Over-the-counter medications like ibuprofen can help with pain",
        },
      ],
      emergencyContact: "112",
      timeFrame:
        "Cool burns immediately, seek medical attention for serious burns",
      doNotDo: [
        "Don't use ice, as it can damage tissue",
        "Don't apply butter, oil, or ointments to severe burns",
        "Don't break blisters",
        "Don't remove clothing stuck to burned skin",
      ],
      emergency: true,
    },
    choking: {
      condition: "Choking",
      steps: [
        {
          instruction: "Determine if they can speak or cough",
          description:
            "If the person can speak or cough forcefully, encourage them to keep coughing",
          important: true,
        },
        {
          instruction: "Stand behind the person",
          description:
            "Wrap your arms around their waist if they cannot speak or cough effectively",
        },
        {
          instruction: "Perform abdominal thrusts (Heimlich maneuver)",
          description:
            "Make a fist with one hand, place it thumb side against the middle of their abdomen, just above the navel. Grasp your fist with your other hand and press inward and upward with quick thrusts",
          important: true,
        },
        {
          instruction: "Continue until object is expelled",
          description:
            "Repeat thrusts until the object is dislodged or the person becomes unconscious",
        },
        {
          instruction: "If the person becomes unconscious",
          description:
            "Lower them to the ground, call 112, and begin CPR if trained",
          important: true,
        },
      ],
      emergencyContact: "112",
      timeFrame:
        "Act immediately - a person can lose consciousness within minutes",
      doNotDo: [
        "Don't slap their back if they're still conscious and standing",
        "Don't perform abdominal thrusts on pregnant women or obese individuals (use chest thrusts instead)",
        "Don't try to grab the object out of their throat with your fingers unless you can clearly see it",
      ],
      emergency: true,
    },
    fracture: {
      condition: "Fractures (Broken Bones)",
      steps: [
        {
          instruction: "Stop any bleeding",
          description:
            "Apply pressure to the wound with a sterile bandage or clean cloth",
        },
        {
          instruction: "Immobilize the injured area",
          description:
            "Don't try to realign the bone, but stabilize the area using a splint and padding",
          important: true,
        },
        {
          instruction: "Apply ice packs",
          description:
            "Use a cloth between the ice and skin, apply for 10 minutes at a time",
        },
        {
          instruction: "Treat for shock",
          description:
            "Lay the person flat, elevate the feet about 12 inches, and cover them with a coat or blanket",
        },
        {
          instruction: "Get professional help",
          description:
            "Call emergency services or transport to hospital for proper treatment",
          important: true,
        },
      ],
      emergencyContact: "112",
      timeFrame:
        "Immobilize immediately, seek medical attention as soon as possible",
      doNotDo: [
        "Don't move the person unless absolutely necessary",
        "Don't attempt to straighten a broken bone",
        "Don't move joints or bones where a fracture is suspected",
        "Don't allow the injured person to eat or drink, in case surgery is needed",
      ],
      emergency: true,
    },
    "heart attack": {
      condition: "Heart Attack",
      steps: [
        {
          instruction: "Call emergency services immediately",
          description: "Call 112 even if you're not sure it's a heart attack",
          important: true,
        },
        {
          instruction: "Have the person sit or lie down",
          description:
            "Help them into a comfortable position, typically sitting up with knees bent",
        },
        {
          instruction: "Give aspirin if available and not allergic",
          description:
            "A single adult dose (325 mg) or 4 low-dose (81 mg) tablets can help reduce damage",
          important: true,
        },
        {
          instruction: "Monitor breathing and consciousness",
          description:
            "Be prepared to perform CPR if the person becomes unconscious and stops breathing normally",
        },
        {
          instruction: "Loosen tight clothing",
          description: "Loosen collar, belt, or other restrictive clothing",
        },
      ],
      emergencyContact: "112",
      timeFrame: "Immediate action required - every minute counts",
      doNotDo: [
        "Don't leave the person alone except to call for help",
        "Don't let the person drive themselves to the hospital",
        "Don't wait to see if symptoms go away",
        "Don't give anything other than aspirin unless prescribed (like nitroglycerin)",
      ],
      emergency: true,
    },
    stroke: {
      condition: "Stroke",
      steps: [
        {
          instruction: "Remember FAST: Face, Arms, Speech, Time",
          description:
            "Check for facial drooping, arm weakness, speech difficulties, and time to call 112",
          important: true,
        },
        {
          instruction: "Call emergency services immediately",
          description: "Call 112 at the first sign of stroke",
          important: true,
        },
        {
          instruction: "Note the time symptoms started",
          description: "This is critical information for medical personnel",
        },
        {
          instruction: "Keep the person still and calm",
          description:
            "Help them lie down on their side with head slightly elevated",
        },
        {
          instruction: "Do not give food, drink, or medication",
          description: "The person may have difficulty swallowing",
        },
      ],
      emergencyContact: "112",
      timeFrame: "Immediate action required - treatment is time-sensitive",
      doNotDo: [
        "Don't give aspirin for a suspected stroke",
        "Don't let the person go to sleep or talk you out of calling 112",
        "Don't give food or drinks",
        "Don't wait to see if symptoms improve",
      ],
      emergency: true,
    },
    poison: {
      condition: "Poisoning",
      steps: [
        {
          instruction: "Call Poison Control Center or 112",
          description: "Call 1066 (Poison Control) or 112 immediately",
          important: true,
        },
        {
          instruction: "Remove the person from danger",
          description:
            "If poison is in the air, get to fresh air. If on skin, remove contaminated clothing and rinse skin",
          important: true,
        },
        {
          instruction: "Identify the poison if possible",
          description: "Keep containers or labels to show medical personnel",
        },
        {
          instruction: "Follow instructions from Poison Control",
          description:
            "Do not induce vomiting or give anything to drink unless specifically instructed",
        },
        {
          instruction: "Monitor vital signs",
          description:
            "Watch breathing and alertness, be prepared to perform CPR if needed",
        },
      ],
      emergencyContact: "1066 or 112",
      timeFrame: "Call immediately - quick action can prevent serious harm",
      doNotDo: [
        "Don't induce vomiting unless specifically told to by a medical professional",
        "Don't give the person anything to drink without medical advice",
        "Don't use syrup of ipecac (no longer recommended)",
        "Don't wait for symptoms to appear before calling for help",
      ],
      emergency: true,
    },
    cpr: {
      condition: "CPR (Cardiopulmonary Resuscitation)",
      steps: [
        {
          instruction: "Check responsiveness",
          description: "Tap the person and shout 'Are you OK?'",
          important: true,
        },
        {
          instruction: "Call 112",
          description: "If unresponsive, have someone call 112 immediately",
          important: true,
        },
        {
          instruction: "Start chest compressions",
          description:
            "Place hands in center of chest, push hard and fast at a rate of 100-120 compressions per minute, allowing chest to fully recoil between compressions",
          important: true,
        },
        {
          instruction: "Open the airway",
          description:
            "Tilt the head back slightly and lift the chin (if no suspected neck injury)",
        },
        {
          instruction: "Give rescue breaths if trained",
          description:
            "If trained in CPR, give 2 breaths after every 30 compressions. If untrained, continue chest compressions only",
        },
        {
          instruction: "Continue until help arrives",
          description:
            "Don't stop CPR until medical professionals take over, an AED is ready to use, or the person shows signs of life",
          important: true,
        },
      ],
      emergencyContact: "112",
      timeFrame: "Begin immediately - brain damage can occur within minutes",
      doNotDo: [
        "Don't delay starting compressions",
        "Don't push too slowly or too softly",
        "Don't lean on the chest between compressions",
        "Don't interrupt compressions for more than 10 seconds",
      ],
      emergency: true,
    },
  };

  // Find the appropriate guide based on the condition
  for (const [key, guide] of Object.entries(guides)) {
    if (condition.toLowerCase().includes(key)) {
      return guide;
    }
  }

  // Return a general first aid guide if no specific condition is matched
  return {
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
        description: "If the situation is serious, call 112 immediately",
        important: true,
      },
      {
        instruction: "Provide care according to your training",
        description: "Only perform procedures you are trained to do",
      },
    ],
    emergencyContact: "112",
    timeFrame: "Act quickly - seconds matter in emergencies",
    doNotDo: [
      "Don't move a seriously injured person unless in immediate danger",
      "Don't give food or water to an unconscious person",
      "Don't remove embedded objects from wounds",
    ],
    emergency: false,
  };
}
