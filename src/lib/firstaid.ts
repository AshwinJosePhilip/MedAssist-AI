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

import { getFirstAidGuideFromRAG } from "./firstaidRAG.ts";

export async function getFirstAidGuide(
  condition: string,
): Promise<FirstAidGuide | null> {
  // First try to get the guide from the RAG system (vectorized PDF)
  const ragGuide = await getFirstAidGuideFromRAG(condition);
  if (ragGuide) {
    return ragGuide;
  }
  
  // Fallback to hardcoded guides if RAG system doesn't return results
  // Map of first aid guides for different conditions
  // Find the appropriate guide based on the condition
  const guides: Record<string, FirstAidGuide> = {
    "shock": {
      condition: "Shock",
      steps: [
        {
          instruction: "Recognize the signs of shock",
          description: "Look for pale, cold, clammy skin, rapid/weak pulse, rapid breathing, enlarged pupils, confusion, weakness, dizziness, nausea, thirst, or decreased urine output. In severe cases, the person may lose consciousness.",
          important: true,
        },
        {
          instruction: "Call emergency services immediately",
          description: "Shock is a life-threatening condition that requires immediate medical attention.",
          important: true,
        },
        {
          instruction: "Lay the person down",
          description: "Have them lie flat on their back with legs elevated about 12 inches (30 cm) unless head, neck, or spine injuries are suspected or this position causes discomfort.",
          important: true,
        },
        {
          instruction: "Prevent heat loss",
          description: "Keep the person warm by covering them with blankets or coats, but don't overheat them.",
          important: true,
        },
        {
          instruction: "Turn the person on their side if unconscious but breathing",
          description: "This helps maintain an open airway and prevents choking if the person vomits.",
          important: true,
        },
        {
          instruction: "Do not give food or drink",
          description: "The person may need surgery, or they could choke if they lose consciousness.",
          important: true,
        },
        {
          instruction: "Treat visible injuries if possible",
          description: "Control any external bleeding with direct pressure. Do not remove any embedded objects.",
          important: true,
        },
        {
          instruction: "Monitor vital signs",
          description: "Check breathing, pulse, and level of consciousness regularly until emergency help arrives.",
          important: true,
        }
      ],
      emergencyContact: "112",
      timeFrame: "Act immediately - shock is life-threatening and requires urgent medical care",
      doNotDo: [
        "Don't give the person anything to eat or drink",
        "Don't move the person unless necessary for safety",
        "Don't wait to see if symptoms improve before calling emergency services",
        "Don't let the person walk or move unnecessarily",
        "Don't raise the head if the person has difficulty breathing",
        "Don't place a pillow under the head"
      ],
      emergency: true,
    },
    "insect sting": {
      condition: "Insect Sting",
      steps: [
        {
          instruction: "Remove the stinger if visible",
          description: "Scrape it out sideways with a credit card or fingernail. Don't use tweezers as squeezing may release more venom",
          important: true,
        },
        {
          instruction: "Clean the area",
          description: "Wash the sting site with soap and water to prevent infection",
          important: true,
        },
        {
          instruction: "Apply cold compress",
          description: "Use ice wrapped in a cloth for 10 minutes at a time to reduce pain and swelling",
          important: true,
        },
        {
          instruction: "Apply anti-itch cream or calamine lotion",
          description: "This can help reduce itching and discomfort",
        },
        {
          instruction: "Take antihistamine if needed",
          description: "An oral antihistamine can help reduce itching, swelling, and hives",
        },
        {
          instruction: "Monitor for allergic reaction",
          description: "Watch for signs of severe allergic reaction: difficulty breathing, swelling of face/throat, rapid pulse, dizziness, or nausea",
          important: true,
        },
        {
          instruction: "Seek medical attention if necessary",
          description: "Get emergency help for signs of severe allergic reaction or if the sting is in the mouth, throat, or eye",
          important: true,
        },
      ],
      emergencyContact: "112",
      timeFrame: "Monitor for allergic reactions for at least 30 minutes after the sting",
      doNotDo: [
        "Don't use tweezers to remove stingers as squeezing may release more venom",
        "Don't scratch the sting site as it can cause infection",
        "Don't apply mud, saliva, or other home remedies to the sting",
        "Don't ignore signs of severe allergic reaction such as difficulty breathing or throat swelling"
      ],
      emergency: false,
    },
    "animal bite": {
      condition: "Animal Bite",
      steps: [
        {
          instruction: "Ensure safety",
          description: "Make sure you and the victim are away from the animal to prevent further injury",
          important: true,
        },
        {
          instruction: "Wash the wound thoroughly",
          description: "Clean with soap and warm water for at least 5 minutes to reduce risk of infection",
          important: true,
        },
        {
          instruction: "Control bleeding",
          description: "Apply direct pressure with a clean cloth or bandage until bleeding stops",
          important: true,
        },
        {
          instruction: "Apply antibiotic ointment",
          description: "If available, apply a thin layer of antibiotic ointment to prevent infection",
        },
        {
          instruction: "Cover the wound",
          description: "Apply a sterile bandage or clean cloth to protect the wound",
          important: true,
        },
        {
          instruction: "Elevate the injured area",
          description: "If possible, keep the wound elevated above heart level to reduce swelling",
        },
        {
          instruction: "Seek medical attention",
          description: "All animal bites should be evaluated by a healthcare provider for proper cleaning, possible antibiotics, and rabies risk assessment",
          important: true,
        },
      ],
      emergencyContact: "112",
      timeFrame: "Seek medical attention as soon as possible - within 24 hours for all animal bites",
      doNotDo: [
        "Don't ignore even minor animal bites as infection risk is high",
        "Don't attempt to catch or handle the animal that bit you",
        "Don't apply butterfly bandages or close the wound with tape as this can trap bacteria",
        "Don't forget to report the bite to local animal control if it was from a stray or wild animal"
      ],
      emergency: true,
    },
    "dog bite": {
      condition: "Dog Bite",
      steps: [
        {
          instruction: "Ensure safety",
          description: "Move away from the dog to prevent further injury",
          important: true,
        },
        {
          instruction: "Wash the wound thoroughly",
          description: "Clean with soap and warm water for at least 5 minutes to reduce risk of infection",
          important: true,
        },
        {
          instruction: "Control bleeding",
          description: "Apply direct pressure with a clean cloth or bandage until bleeding stops",
          important: true,
        },
        {
          instruction: "Apply antibiotic ointment",
          description: "If available, apply a thin layer of antibiotic ointment",
        },
        {
          instruction: "Cover the wound",
          description: "Apply a sterile bandage or clean cloth",
          important: true,
        },
        {
          instruction: "Seek medical attention",
          description: "Dog bites often require professional cleaning, antibiotics, and assessment for rabies risk",
          important: true,
        },
        {
          instruction: "Document the incident",
          description: "If possible, get information about the dog's vaccination status and owner contact details",
        },
      ],
      emergencyContact: "112",
      timeFrame: "Seek medical attention as soon as possible - within 8 hours for best outcomes",
      doNotDo: [
        "Don't ignore even minor dog bites as infection risk is high",
        "Don't attempt to catch or handle the dog",
        "Don't apply butterfly bandages or close the wound with tape",
        "Don't forget to report the bite to local animal control if it was from a stray dog"
      ],
      emergency: true,
    },
    "scorpion sting": {
      condition: "Scorpion Sting",
      steps: [
        {
          instruction: "Clean the wound",
          description: "Wash the area with soap and water",
          important: true,
        },
        {
          instruction: "Apply cold compress",
          description: "Use ice wrapped in a cloth to reduce pain and swelling for 10 minutes at a time",
          important: true,
        },
        {
          instruction: "Keep the affected area immobile",
          description: "Minimize movement of the affected limb to slow venom spread",
          important: true,
        },
        {
          instruction: "Remove jewelry or tight items",
          description: "Take off rings, watches, or tight clothing near the sting site before swelling occurs",
        },
        {
          instruction: "Take pain relievers if needed",
          description: "Over-the-counter pain medications like ibuprofen can help with pain",
        },
        {
          instruction: "Seek medical attention immediately",
          description: "All scorpion stings should be evaluated by a healthcare provider, especially for children or elderly",
          important: true,
        },
        {
          instruction: "Monitor for severe symptoms",
          description: "Watch for difficulty breathing, muscle twitching, unusual head/neck/eye movements, drooling, sweating, or vomiting",
          important: true,
        },
      ],
      emergencyContact: "112",
      timeFrame: "Seek immediate medical attention, especially for children or if severe symptoms develop",
      doNotDo: [
        "Don't apply a tourniquet",
        "Don't cut the wound or try to suck out the venom",
        "Don't give sedatives or alcohol to the victim",
        "Don't ignore symptoms that worsen over time"
      ],
      emergency: true,
    },
    fever: {
      condition: "High Fever",
      steps: [
        {
          instruction: "Take temperature",
          description: "Use a thermometer to confirm fever (above 38°C or 100.4°F)",
          important: true,
        },
        {
          instruction: "Keep hydrated",
          description: "Drink plenty of fluids to prevent dehydration",
          important: true,
        },
        {
          instruction: "Take fever-reducing medication",
          description: "Use appropriate dose of paracetamol/acetaminophen or ibuprofen if temperature is high",
          important: true,
        },
        {
          instruction: "Rest",
          description: "Get plenty of rest to help the body fight infection",
        },
        {
          instruction: "Use cooling measures",
          description: "Apply a cool, damp cloth to forehead, wrists, or neck. Take a lukewarm bath",
        },
        {
          instruction: "Wear light clothing",
          description: "Dress in lightweight clothing and use light bedding",
        },
        {
          instruction: "Seek medical attention if necessary",
          description: "Contact a doctor if fever is very high (above 39.4°C or 103°F), lasts more than 3 days, or is accompanied by severe symptoms",
          important: true,
        },
      ],
      emergencyContact: "112",
      timeFrame: "Monitor temperature regularly and seek medical help if fever is severe or persistent",
      doNotDo: [
        "Don't use alcohol or ice baths to reduce fever",
        "Don't bundle up in heavy blankets or clothing",
        "Don't give aspirin to children or teenagers",
        "Don't ignore a fever in infants, very young children, elderly, or those with compromised immune systems"
      ],
      emergency: false,
    },
    "low blood sugar": {
      condition: "Low Blood Sugar (Hypoglycemia)",
      steps: [
        {
          instruction: "Recognize the symptoms",
          description: "Look for shakiness, dizziness, sweating, hunger, irritability, confusion, fast heartbeat, or weakness",
          important: true,
        },
        {
          instruction: "Check blood glucose if possible",
          description: "If a glucose meter is available, check blood sugar level. Below 70 mg/dL (3.9 mmol/L) is considered low",
        },
        {
          instruction: "Consume fast-acting carbohydrates",
          description: "Give 15-20 grams of fast-acting carbohydrates: 4 glucose tablets, 4 oz (120 ml) of fruit juice or regular soda, 1 tablespoon of honey or sugar, or 8 oz (240 ml) of milk",
          important: true,
        },
        {
          instruction: "Wait 15 minutes",
          description: "Wait 15 minutes for the sugar to enter the bloodstream",
        },
        {
          instruction: "Recheck blood sugar if possible",
          description: "If still below 70 mg/dL (3.9 mmol/L), repeat the treatment",
        },
        {
          instruction: "Eat a small meal or snack",
          description: "Once blood sugar is above 70 mg/dL, eat a small meal containing protein and complex carbohydrates to prevent another drop",
          important: true,
        },
        {
          instruction: "Monitor for improvement",
          description: "Watch for signs of improvement within 10-15 minutes after treatment",
        },
      ],
      emergencyContact: "112",
      timeFrame: "Act quickly - severe hypoglycemia can lead to unconsciousness within minutes",
      doNotDo: [
        "Don't give food or drink if the person is unconscious",
        "Don't give diet soda or sugar-free foods as they won't raise blood sugar",
        "Don't delay treatment - hypoglycemia can worsen quickly",
        "Don't leave the person alone if they show signs of confusion or unusual behavior"
      ],
      emergency: true,
    },
    "cuts": {
      condition: "Cuts and Wounds",
      steps: [
        {
          instruction: "Ensure safety",
          description: "Make sure the area is safe and wear gloves if available to prevent infection",
          important: true,
        },
        {
          instruction: "Stop the bleeding",
          description: "Apply direct pressure to the wound using a clean cloth, gauze pad, or bandage",
          important: true,
        },
        {
          instruction: "Clean the wound thoroughly",
          description: "Rinse with clean running water for 5-10 minutes. Gently clean around the wound with mild soap and water",
          important: true,
        },
        {
          instruction: "Remove any debris",
          description: "Use tweezers cleaned with alcohol to remove any visible debris or dirt from the wound",
        },
        {
          instruction: "Apply an antiseptic",
          description: "Use an antiseptic solution or ointment to help prevent infection",
        },
        {
          instruction: "Cover the wound",
          description: "Apply a sterile bandage, gauze, or adhesive bandage depending on the size of the wound",
          important: true,
        },
        {
          instruction: "Change the dressing",
          description: "Replace the bandage whenever it gets wet or dirty, or at least once a day",
        },
        {
          instruction: "Watch for signs of infection",
          description: "Monitor for increased pain, redness, swelling, warmth, pus, or red streaks extending from the wound",
          important: true,
        },
        {
          instruction: "Seek medical attention if necessary",
          description: "Get professional help for deep wounds, wounds that won't stop bleeding after 10-15 minutes of pressure, wounds with embedded objects, animal or human bites, or signs of infection",
          important: true,
        },
      ],
      emergencyContact: "112",
      timeFrame: "Clean and cover wounds promptly to prevent infection",
      doNotDo: [
        "Don't use hydrogen peroxide, iodine, or alcohol on open wounds as they can damage tissue",
        "Don't remove large or deeply embedded objects from wounds",
        "Don't ignore signs of infection such as increasing pain, redness, or pus",
        "Don't close a dirty wound without proper cleaning",
        "Don't use cotton balls or cotton wool that may stick to the wound"
      ],
      emergency: false,
    },
    "wound": {
      condition: "Cuts and Wounds",
      steps: [
        {
          instruction: "Ensure safety",
          description: "Make sure the area is safe and wear gloves if available to prevent infection",
          important: true,
        },
        {
          instruction: "Stop the bleeding",
          description: "Apply direct pressure to the wound using a clean cloth, gauze pad, or bandage",
          important: true,
        },
        {
          instruction: "Clean the wound thoroughly",
          description: "Rinse with clean running water for 5-10 minutes. Gently clean around the wound with mild soap and water",
          important: true,
        },
        {
          instruction: "Remove any debris",
          description: "Use tweezers cleaned with alcohol to remove any visible debris or dirt from the wound",
        },
        {
          instruction: "Apply an antiseptic",
          description: "Use an antiseptic solution or ointment to help prevent infection",
        },
        {
          instruction: "Cover the wound",
          description: "Apply a sterile bandage, gauze, or adhesive bandage depending on the size of the wound",
          important: true,
        },
        {
          instruction: "Change the dressing",
          description: "Replace the bandage whenever it gets wet or dirty, or at least once a day",
        },
        {
          instruction: "Watch for signs of infection",
          description: "Monitor for increased pain, redness, swelling, warmth, pus, or red streaks extending from the wound",
          important: true,
        },
        {
          instruction: "Seek medical attention if necessary",
          description: "Get professional help for deep wounds, wounds that won't stop bleeding after 10-15 minutes of pressure, wounds with embedded objects, animal or human bites, or signs of infection",
          important: true,
        },
      ],
      emergencyContact: "112",
      timeFrame: "Clean and cover wounds promptly to prevent infection",
      doNotDo: [
        "Don't use hydrogen peroxide, iodine, or alcohol on open wounds as they can damage tissue",
        "Don't remove large or deeply embedded objects from wounds",
        "Don't ignore signs of infection such as increasing pain, redness, or pus",
        "Don't close a dirty wound without proper cleaning",
        "Don't use cotton balls or cotton wool that may stick to the wound"
      ],
      emergency: false,
    },
    snake: {
      condition: "Snake Bite",
      steps: [
        {
          instruction: "Lay the patient down",
          description: "Keep the victim calm and still to slow the spread of venom",
          important: true,
        },
        {
          instruction: "Give complete rest",
          description: "Minimize movement to reduce venom circulation",
          important: true,
        },
        {
          instruction: "Calm and reassure the patient",
          description: "Anxiety can increase heart rate and speed up venom spread",
        },
        {
          instruction: "Apply tourniquet above bite",
          description: "Tie a piece of cloth tightly above the bite to prevent venous blood return. Loosen for a few seconds every 10 minutes",
          important: true,
        },
        {
          instruction: "Clean the wound",
          description: "Wash cuts gently with normal saline or antiseptic lotion if available, otherwise with soapy water",
        },
        {
          instruction: "Apply a clean dressing",
          description: "Cover the wound with a sterile bandage",
        },
        {
          instruction: "Immobilize the affected limb",
          description: "Keep the bitten area still and below heart level",
          important: true,
        },
        {
          instruction: "Apply ice packs",
          description: "Place ice packs on the wound to slow venom spread and reduce pain",
        },
        {
          instruction: "Seek medical help immediately",
          description: "Shift the patient to hospital immediately",
          important: true,
        },
      ],
      emergencyContact: "112",
      timeFrame: "Act immediately - snake bites can be life-threatening",
      doNotDo: [
        "Don't make the patient walk",
        "Don't cut the wound or try to suck out the venom",
        "Don't give the patient food or drink",
        "Don't apply a tight tourniquet that cuts off blood flow completely"
      ],
      emergency: true,
    },
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
    sprain: {
      condition: "Sprains",
      steps: [
        {
          instruction: "Rest the injured area",
          description: "Stop using the injured joint and avoid putting weight on it",
          important: true,
        },
        {
          instruction: "Apply ice",
          description: "Apply ice wrapped in a thin cloth for 15-20 minutes every 2-3 hours to reduce swelling and pain",
          important: true,
        },
        {
          instruction: "Compress the area",
          description: "Use an elastic bandage to compress the area, but not so tight that it restricts blood flow",
          important: true,
        },
        {
          instruction: "Elevate the injured limb",
          description: "Keep the injured area elevated above the level of the heart when possible to reduce swelling",
          important: true,
        },
        {
          instruction: "Take pain relievers if needed",
          description: "Over-the-counter pain medications like ibuprofen can help reduce pain and inflammation",
        },
        {
          instruction: "Seek medical attention if severe",
          description: "If you can't bear weight, the pain is severe, or there's significant swelling, see a doctor",
          important: true,
        },
      ],
      emergencyContact: "112",
      timeFrame: "Follow RICE (Rest, Ice, Compression, Elevation) for the first 24-48 hours",
      doNotDo: [
        "Don't apply heat for the first 48-72 hours as it may increase swelling",
        "Don't massage the injured area as it may cause more damage",
        "Don't continue activities that cause pain",
        "Don't ignore severe pain or inability to move the joint",
        "Don't wrap the bandage too tightly as it can restrict blood flow"
      ],
      emergency: false,
    },
    strain: {
      condition: "Muscle Strains",
      steps: [
        {
          instruction: "Rest the injured muscle",
          description: "Stop the activity that caused the strain and rest the affected muscle",
          important: true,
        },
        {
          instruction: "Apply ice",
          description: "Apply ice wrapped in a thin cloth for 15-20 minutes every 2-3 hours to reduce swelling and pain",
          important: true,
        },
        {
          instruction: "Compress the area",
          description: "Use an elastic bandage to provide gentle compression to the injured area",
        },
        {
          instruction: "Elevate the injured area",
          description: "When possible, keep the injured area elevated to help reduce swelling",
        },
        {
          instruction: "Take pain relievers if needed",
          description: "Over-the-counter pain medications like ibuprofen can help reduce pain and inflammation",
        },
        {
          instruction: "Apply gentle stretching",
          description: "After the initial pain and swelling subsides (usually 48 hours), gentle stretching may help",
        },
        {
          instruction: "Seek medical attention if severe",
          description: "If you hear a popping sound, have severe pain, or can't move the affected area, see a doctor",
          important: true,
        },
      ],
      emergencyContact: "112",
      timeFrame: "Follow RICE (Rest, Ice, Compression, Elevation) for the first 24-48 hours",
      doNotDo: [
        "Don't apply heat for the first 48 hours as it may increase swelling",
        "Don't continue activities that cause pain",
        "Don't return to sports or strenuous activities until the muscle has healed",
        "Don't ignore severe pain or significant loss of muscle function",
        "Don't stretch aggressively in the first 48-72 hours"
      ],
      emergency: false,
    },
    dislocation: {
      condition: "Joint Dislocations",
      steps: [
        {
          instruction: "Don't try to push the joint back in place",
          description: "Never attempt to reposition a dislocated joint - this should only be done by medical professionals",
          important: true,
        },
        {
          instruction: "Immobilize the joint",
          description: "Keep the joint in the position you found it, using splints or padding if available",
          important: true,
        },
        {
          instruction: "Apply ice",
          description: "Apply ice wrapped in a cloth to the area to reduce pain and swelling",
        },
        {
          instruction: "Call emergency services",
          description: "Dislocations require prompt medical attention to prevent further damage",
          important: true,
        },
        {
          instruction: "Check for circulation",
          description: "Monitor for signs of compromised blood flow such as pale or bluish skin, numbness, or tingling",
          important: true,
        },
        {
          instruction: "Treat for shock if necessary",
          description: "If the person feels faint or is showing signs of shock, have them lie down with legs elevated",
        },
      ],
      emergencyContact: "112",
      timeFrame: "Seek immediate medical attention - dislocations require professional treatment",
      doNotDo: [
        "Don't attempt to push or force the joint back into place",
        "Don't move the affected limb unnecessarily",
        "Don't give food or drink if surgery might be needed",
        "Don't delay seeking medical help as complications can develop quickly",
        "Don't remove splints or immobilization devices applied by medical professionals"
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
