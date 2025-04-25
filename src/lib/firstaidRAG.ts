import { vectorStore } from "./vectorstore";
import { chromaClient } from "./chromadb";




export interface FirstAidStep {
  instruction: string;
  description?: string;
  important?: boolean;
}

export interface FirstAidGuide {
  condition: string;
  steps: FirstAidStep[];
  emergencyContact: string;
  timeFrame: string;
  doNotDo: string[];
  emergency: boolean;
  source?: string;
}

/**
 * Extracts key search terms from a condition to improve search relevance
 * @param condition The first aid condition to extract terms from
 * @returns A string with optimized search terms
 */
function extractSearchTerms(condition: string): string {
  // Remove common words and focus on key medical terms
  const normalizedCondition = condition.toLowerCase();
  
  // Map common synonyms to standardized terms - expanded with more conditions and synonyms
  const synonymMap: Record<string, string> = {
    "fever": "high fever temperature pyrexia hyperthermia febrile elevated temperature thermometer paracetamol acetaminophen ibuprofen cooling hydration rest chills sweating headache body ache dehydration infection",
    "high fever": "fever temperature pyrexia hyperthermia febrile elevated temperature thermometer paracetamol acetaminophen ibuprofen cooling hydration rest chills sweating headache body ache dehydration infection",
    "heart attack": "cardiac arrest myocardial infarction chest pain heart failure coronary",
    "shock": "circulatory shock hypovolemic shock cardiogenic shock septic shock anaphylactic shock neurogenic shock distributive shock hypoperfusion low blood pressure hypotension pale skin cold clammy skin rapid weak pulse confusion dizziness fainting unconsciousness decreased urine output",
    "snake bite": "snakebite venom poisonous reptile envenomation serpent venomous snake antivenom fang puncture wound swelling pain redness tissue damage neurotoxin hemotoxin cytotoxin antivenin first aid emergency treatment",
    "bite": "animal bite dog bite cat bite snake bite rat bite rodent bite mammal bite wild animal bite pet bite domestic animal bite rabies infection wound puncture tetanus bacteria cleaning antiseptic antibiotics treatment washing disinfection bandage emergency care first aid bite management",
    "fainting": "syncope unconscious pass out passed out collapse faint dizzy dizziness blackout loss of consciousness vasovagal vertigo lightheaded lightheadedness blood pressure drop recovery position unconsciousness temporary blackout fainting spell syncope episode vasovagal syncope orthostatic hypotension postural hypotension recovery position first aid consciousness loss blacking out falling down passing out person collapsed sudden collapse sudden fall sudden unconsciousness transient loss of consciousness brief loss of consciousness momentary blackout pre-syncope near-fainting feeling faint feeling woozy head rush grayout vasovagal attack neurally mediated syncope cardiac syncope situational syncope heat syncope emotional syncope",
    "insect sting": "bee wasp hornet yellow jacket ant mosquito spider scorpion stinger venom swelling pain redness itching allergic reaction anaphylaxis epinephrine antihistamine ice compress remove stinger scrape tweezers calamine lotion hydrocortisone cream benadryl diphenhydramine swelling hives rash difficulty breathing throat swelling",
    "animal bite": "dog cat wild animal rabies infection wound puncture tetanus bacteria cleaning antiseptic antibiotics treatment washing disinfection bandage emergency care first aid bite management pet bite domestic animal bite wound care rabies prevention tetanus booster bite wound care animal attack pet injury teeth puncture wound bite infection risk rabies exposure wound cleaning disinfection antibiotic prophylaxis animal control report",
    "dog bite": "canine bite animal bite rabies wound infection tetanus puncture dog canine animal wound rabies infection tetanus puncture saliva cleaning antiseptic antibiotics treatment washing disinfection bandage emergency care first aid dog bite management pet bite domestic animal bite wound care rabies prevention tetanus booster bite wound care animal attack pet injury canine teeth puncture wound bite infection risk rabies exposure wound cleaning disinfection antibiotic prophylaxis animal control report animal bite first aid emergency treatment dog bite first aid dog bite treatment animal bite treatment bite wound management canine attack k9 bite pet dog bite dog teeth dog mouth dog saliva dog attack dog wound dog injury dog emergency dog first aid dog treatment dog infection dog rabies dog tetanus dog puncture dog cleaning dog antiseptic dog antibiotics dog disinfection dog bandage dog care dog management dog prevention dog booster dog animal dog domestic dog pet dog canine dog k9 dog bite wound management canine bite first aid canine bite treatment canine bite emergency canine bite infection canine bite rabies canine bite tetanus canine bite cleaning canine bite antiseptic canine bite antibiotics canine bite disinfection canine bite bandage canine bite care canine bite management canine bite prevention canine bite booster",
    "animal_bite": "bite wound rabies infection puncture tetanus dog cat wild animal canine feline rabies infection wound puncture saliva cleaning antiseptic antibiotics treatment pet bite domestic animal bite wound care rabies prevention tetanus booster bite wound care animal attack pet injury canine teeth puncture wound bite infection risk rabies exposure wound cleaning disinfection antibiotic prophylaxis animal control report animal bite first aid emergency treatment dog bite first aid dog bite treatment animal bite treatment bite wound management mammal bite dog bite canine bite k9 bite pet bite domestic bite wild bite feline bite cat bite mammal bite dog bite wound management canine bite first aid canine bite treatment canine bite emergency canine bite infection canine bite rabies canine bite tetanus canine bite cleaning canine bite antiseptic canine bite antibiotics canine bite disinfection canine bite bandage canine bite care canine bite management canine bite prevention canine bite booster",
    "cut": "bleeding wound laceration gash incision slice",
    "burn": "burns scalding fire thermal chemical electrical radiation heat",
    "choking": "airway obstruction heimlich maneuver suffocation asphyxiation foreign body obstruction abdominal thrust back blow chest thrust coughing inability to speak inability to breathe universal choking sign clutching throat emergency procedure rescue technique blockage food stuck lodged object trachea windpipe respiratory distress silent cough blue lips cyanosis loss of consciousness adult choking child choking infant choking cafe coronary",
    "drowning": "submersion water rescue near-drowning asphyxia",
    "fracture": "broken bone splint crack dislocation",
    "poison": "poisoning toxin ingestion swallow chemical toxic substance",
    "stroke": "cerebral brain clot hemorrhage blockage facial drooping slurred speech",
    "seizure": "convulsion epilepsy fit spasm twitching",
    "allergic reaction": "anaphylaxis allergy hives swelling rash difficulty breathing",
    "head injury": "concussion traumatic brain injury skull fracture head trauma",
    "eye injury": "eye trauma foreign body chemical splash corneal abrasion",
    "sprain": "sprain strain twist ligament tendon muscle injury swelling pain rice rest ice compression elevation joint ankle wrist mobility range motion bruising torn stretched inflammation sports athletic injury twisted rolled ankle wrist elbow shoulder knee joint mobility movement pain relief nsaids support brace wrap bandage recovery rehabilitation physical therapy movement restriction immobilization mild moderate severe grade first second third degree",
    "strain": "strain sprain muscle tear pulled muscle tendon injury overexertion stretching tearing fibers pain swelling bruising stiffness weakness muscle spasm inflammation limited mobility flexibility hamstring calf quadriceps back neck shoulder sports injury gradual sudden onset rest ice compression elevation nsaids gentle stretching recovery rehabilitation physical therapy",
    "dislocation": "dislocation joint displacement subluxation shoulder knee finger elbow hip jaw socket bone out of place severe pain visible deformity swelling inability to move joint numbness tingling reduced circulation immobilization sling splint reduction emergency medical attention joint instability popping sensation",
    "heat stroke": "hyperthermia heat exhaustion overheating dehydration",
    "hypothermia": "cold exposure freezing low body temperature frostbite",
    "insect bite": "sting bee wasp hornet spider scorpion",
    "electric shock": "electrocution lightning strike electrical injury",
    "diabetic emergency": "hypoglycemia hyperglycemia insulin sugar glucose",
    "chest pain": "angina heart attack cardiac discomfort pressure tightness",
    "low blood sugar": "hypoglycemia glucose diabetes insulin diabetic shakiness dizziness sweating hunger irritability confusion fast heartbeat weakness fainting seizure unconsciousness sugar level carbohydrates juice honey glucose tablets treatment emergency diabetic reaction insulin shock",
    "hypoglycemia": "low blood sugar glucose diabetes insulin diabetic shakiness dizziness sweating hunger irritability confusion fast heartbeat weakness fainting seizure unconsciousness sugar level carbohydrates juice honey glucose tablets treatment emergency diabetic reaction insulin shock"
  };
  
  // Add relevant terms based on condition keywords
  let enhancedTerms = condition;
  
  // Check for exact matches first
  if (synonymMap[normalizedCondition]) {
    enhancedTerms += " " + synonymMap[normalizedCondition];
  } else {
    // Check for partial matches
    for (const [term, expansion] of Object.entries(synonymMap)) {
      if (normalizedCondition.includes(term)) {
        enhancedTerms += " " + expansion;
      }
    }
  }
  
  // Add general first aid terms to improve search
  enhancedTerms += " first aid emergency treatment urgent care medical help";
  
  // Add specific terms for dog bites to improve search relevance
  if (normalizedCondition.includes("dog") && normalizedCondition.includes("bite")) {
    enhancedTerms += " dog bite canine bite animal bite rabies wound infection tetanus puncture cleaning antiseptic antibiotics dog bite first aid dog bite treatment animal bite first aid animal bite treatment bite wound management canine attack k9 bite pet dog bite";
  }
  
  // Add specific terms for animal bites
  if (normalizedCondition.includes("bite") || normalizedCondition.includes("bitten")) {
    enhancedTerms += " animal bite wound care management emergency treatment first aid protocol bite wound management mammal bite pet bite domestic animal bite wild animal bite cat bite snake bite rat bite rodent bite rabies infection puncture wound tetanus bacteria cleaning antiseptic antibiotics treatment washing disinfection bandage";
  }
  
  // Add specific terms for snake bites
  if (normalizedCondition.includes("snake") || (normalizedCondition.includes("snake") && normalizedCondition.includes("bite"))) {
    enhancedTerms += " snake bite snakebite venom poisonous reptile envenomation serpent venomous snake antivenom fang puncture wound swelling pain redness tissue damage neurotoxin hemotoxin cytotoxin antivenin first aid emergency treatment";
  }
  
  // Add specific terms for cuts and wounds
  if (normalizedCondition.includes("cut") || normalizedCondition.includes("wound") || normalizedCondition.includes("bleeding") || normalizedCondition.includes("laceration")) {
    enhancedTerms += " cut wound bleeding laceration gash incision slice scrape abrasion puncture injury trauma open wound deep cut superficial cut minor cut major cut severe cut bleeding control pressure bandage gauze antiseptic cleaning disinfection infection prevention wound care wound management wound treatment wound cleaning wound disinfection wound bandage wound dressing wound healing";
  }
  
  // Add specific terms for low blood sugar/hypoglycemia
  if (normalizedCondition.includes("blood sugar") || normalizedCondition.includes("glucose") || normalizedCondition.includes("hypoglycemia") || normalizedCondition.includes("diabetic")) {
    enhancedTerms += " low blood sugar hypoglycemia glucose diabetes insulin diabetic shakiness dizziness sweating hunger irritability confusion fast heartbeat weakness fainting seizure unconsciousness sugar level carbohydrates juice honey glucose tablets treatment emergency diabetic reaction insulin shock";
  }
  
  return enhancedTerms;
}

/**
 * Retrieves first aid information from the vectorized PDF using RAG
 * @param condition The first aid condition to search for
 * @returns A FirstAidGuide object with information from the PDF
 */
export async function getFirstAidGuideFromRAG(
  condition: string
): Promise<FirstAidGuide | null> {
  // Extract key terms for better search
  const searchTerms = extractSearchTerms(condition);
  const normalizedCondition = condition.toLowerCase();
  
  // Check if this is a dog bite query for special handling - improved detection logic
  const isDogBite = normalizedCondition === "dog bite" || 
                  normalizedCondition.includes("dog bite") || 
                  (normalizedCondition.includes("dog") && normalizedCondition.includes("bite")) || 
                  (normalizedCondition.includes("canine") && normalizedCondition.includes("bite"));
  
  // Check if this is a low blood sugar query for special handling
  const isLowBloodSugar = normalizedCondition === "low blood sugar" ||
                        normalizedCondition === "hypoglycemia" ||
                        (normalizedCondition.includes("low") && normalizedCondition.includes("blood") && normalizedCondition.includes("sugar")) ||
                        (normalizedCondition.includes("low") && normalizedCondition.includes("glucose")) ||
                        (normalizedCondition.includes("diabetic") && normalizedCondition.includes("emergency")) ||
                        (normalizedCondition.includes("insulin") && normalizedCondition.includes("reaction"));
                        
  // Check if this is a seizure query for special handling
  const isSeizure = normalizedCondition === "seizure" ||
                  normalizedCondition === "fit" ||
                  normalizedCondition === "fits" ||
                  normalizedCondition === "convulsion" ||
                  normalizedCondition === "epilepsy" ||
                  normalizedCondition.includes("seizure") ||
                  normalizedCondition.includes("convulsion") ||
                  normalizedCondition.includes("epileptic") ||
                  normalizedCondition.includes("fit") ||
                  normalizedCondition.includes("epilepsy") ||
                  normalizedCondition.includes("twitching") ||
                  normalizedCondition.includes("jerking") ||
                  (normalizedCondition.includes("seizure") && normalizedCondition.includes("first aid"));
                  
  // Check if this is a shock query for special handling
  const isShock = normalizedCondition === "shock" ||
                normalizedCondition.includes("circulatory shock") ||
                normalizedCondition.includes("hypovolemic shock") ||
                normalizedCondition.includes("cardiogenic shock") ||
                normalizedCondition.includes("septic shock") ||
                normalizedCondition.includes("anaphylactic shock") ||
                normalizedCondition.includes("neurogenic shock") ||
                normalizedCondition.includes("distributive shock") ||
                (normalizedCondition.includes("shock") && !normalizedCondition.includes("electric")) ||
                (normalizedCondition.includes("hypoperfusion")) ||
                (normalizedCondition.includes("signs") && normalizedCondition.includes("shock"));
                        
  // Check if this is a fainting query for special handling - improved detection logic
  const isFainting = normalizedCondition === "fainting" ||
                    normalizedCondition === "faint" ||
                    normalizedCondition === "syncope" ||
                    normalizedCondition === "passed out" ||
                    normalizedCondition === "person collapsed" ||
                    normalizedCondition === "loss of consciousness" ||
                    normalizedCondition.includes("faint") ||
                    normalizedCondition.includes("syncope") ||
                    normalizedCondition.includes("pass out") ||
                    normalizedCondition.includes("passed out") ||
                    normalizedCondition.includes("collapse") ||
                    normalizedCondition.includes("unconscious") ||
                    normalizedCondition.includes("blackout") ||
                    normalizedCondition.includes("dizzy") ||
                    normalizedCondition.includes("lightheaded") ||
                    (normalizedCondition.includes("loss") && normalizedCondition.includes("consciousness")) ||
                    (normalizedCondition.includes("temporary") && normalizedCondition.includes("blackout"));
  
  // Check if this is a snake bite query for special handling
  const isSnakeBite = normalizedCondition === "snake bite" ||
                    normalizedCondition === "snakebite" ||
                    (normalizedCondition.includes("snake") && normalizedCondition.includes("bite")) ||
                    normalizedCondition.includes("serpent bite") ||
                    normalizedCondition.includes("venomous snake") ||
                    normalizedCondition.includes("snake venom") ||
                    normalizedCondition.includes("snake poison");

  // Check if this is a choking query for special handling - improved detection logic
  let isChoking = normalizedCondition === "choking" ||
                  normalizedCondition === "choke" ||
                  normalizedCondition === "heimlich" ||
                  normalizedCondition === "heimlich maneuver" ||
                  normalizedCondition.includes("choking") ||
                  normalizedCondition.includes("choke") ||
                  normalizedCondition.includes("heimlich") ||
                  normalizedCondition.includes("food stuck") ||
                  normalizedCondition.includes("airway obstruction") ||
                  normalizedCondition.includes("can't breathe") ||
                  normalizedCondition.includes("cannot breathe") ||
                  normalizedCondition.includes("something stuck in throat") ||
                  normalizedCondition.includes("object in throat") ||
                  normalizedCondition.includes("difficulty breathing") ||
                  normalizedCondition.includes("blocked airway") ||
                  normalizedCondition.includes("abdominal thrust") ||
                  normalizedCondition.includes("back blow") ||
                  normalizedCondition.includes("first aid choking") ||
                  (normalizedCondition.includes("foreign") && normalizedCondition.includes("object")) ||
                  (normalizedCondition.includes("something") && normalizedCondition.includes("stuck") && normalizedCondition.includes("throat"));
  
  // Explicitly check for general first aid query
  const isGeneralFirstAid = normalizedCondition === "general first aid" || 
                          normalizedCondition.includes("general first aid");
  
  // Only override choking if it's explicitly a general first aid query and no choking-related terms
  if (isGeneralFirstAid && !normalizedCondition.includes("chok") && !normalizedCondition.includes("heimlich")) {
    console.log("General first aid query detected, not treating as choking");
    isChoking = false;
  }
                  
  // Check if this is a cuts and wounds query for special handling
  const isCutOrWound = normalizedCondition === "cut" ||
                      normalizedCondition === "wound" ||
                      normalizedCondition === "cuts" ||
                      normalizedCondition === "wounds" ||
                      normalizedCondition === "bleeding" ||
                      normalizedCondition === "laceration" ||
                      normalizedCondition.includes("cut") ||
                      normalizedCondition.includes("wound") ||
                      normalizedCondition.includes("laceration") ||
                      (normalizedCondition.includes("bleeding") && !normalizedCondition.includes("nose")) ||
                      normalizedCondition.includes("gash") ||
                      normalizedCondition.includes("incision");
                      
  // Check if this is a sprain query for special handling
  const isSprain = normalizedCondition === "sprain" ||
                  normalizedCondition === "sprains" ||
                  normalizedCondition.includes("sprain") ||
                  normalizedCondition.includes("twisted ankle") ||
                  normalizedCondition.includes("twisted wrist") ||
                  (normalizedCondition.includes("twisted") && (normalizedCondition.includes("joint") || normalizedCondition.includes("ligament"))) ||
                  (normalizedCondition.includes("torn") && normalizedCondition.includes("ligament"));
                  
  // Check if this is a strain query for special handling
  const isStrain = normalizedCondition === "strain" ||
                  normalizedCondition === "strains" ||
                  normalizedCondition.includes("strain") ||
                  normalizedCondition.includes("pulled muscle") ||
                  normalizedCondition.includes("muscle tear") ||
                  (normalizedCondition.includes("torn") && normalizedCondition.includes("muscle")) ||
                  (normalizedCondition.includes("muscle") && normalizedCondition.includes("injury"));
                  
  // Check if this is a dislocation query for special handling
  const isDislocation = normalizedCondition === "dislocation" ||
                      normalizedCondition === "dislocated" ||
                      normalizedCondition.includes("dislocation") ||
                      normalizedCondition.includes("dislocated") ||
                      normalizedCondition.includes("out of socket") ||
                      normalizedCondition.includes("out of joint") ||
                      normalizedCondition.includes("popped out") ||
                      (normalizedCondition.includes("joint") && normalizedCondition.includes("out")) ||
                      normalizedCondition.includes("subluxation");
                      
  // Check if this is an insect sting query for special handling
  const isInsectSting = normalizedCondition === "insect sting" ||
                      normalizedCondition === "bee sting" ||
                      normalizedCondition === "wasp sting" ||
                      normalizedCondition === "hornet sting" ||
                      normalizedCondition.includes("insect sting") ||
                      normalizedCondition.includes("bee sting") ||
                      normalizedCondition.includes("wasp sting") ||
                      normalizedCondition.includes("hornet sting") ||
                      normalizedCondition.includes("yellow jacket") ||
                      (normalizedCondition.includes("insect") && normalizedCondition.includes("sting")) ||
                      (normalizedCondition.includes("bee") && normalizedCondition.includes("sting")) ||
                      (normalizedCondition.includes("wasp") && normalizedCondition.includes("sting")) ||
                      (normalizedCondition.includes("hornet") && normalizedCondition.includes("sting"));
                      
  // Check if this is an animal bite query for special handling (second check)
  const isGeneralAnimalBite = normalizedCondition === "animal bite" ||
                      normalizedCondition === "bite" ||
                      (normalizedCondition.includes("animal") && normalizedCondition.includes("bite")) ||
                      (normalizedCondition.includes("cat") && normalizedCondition.includes("bite")) ||
                      (normalizedCondition.includes("wild") && normalizedCondition.includes("bite")) ||
                      (normalizedCondition.includes("pet") && normalizedCondition.includes("bite")) ||
                      (normalizedCondition.includes("bitten") && normalizedCondition.includes("animal")) ||
                      (normalizedCondition.includes("bitten") && normalizedCondition.includes("cat")) ||
                      (normalizedCondition.includes("bitten") && normalizedCondition.includes("pet")) ||
                      (normalizedCondition.includes("snake") && normalizedCondition.includes("bite")) ||
                      (normalizedCondition.includes("rat") && normalizedCondition.includes("bite")) ||
                      (normalizedCondition.includes("rodent") && normalizedCondition.includes("bite")) ||
                      (normalizedCondition.includes("mammal") && normalizedCondition.includes("bite")) ||
                      (normalizedCondition.includes("animal") && normalizedCondition.includes("attack")) ||
                      (normalizedCondition.includes("bite") && !normalizedCondition.includes("insect") && !normalizedCondition.includes("spider"));
  
  // If this is specifically a shock query, use our specialized shock handler
  if (isShock) {
    console.log("Shock condition detected, using specialized shock handler");
    return {
      condition: "Shock",
      steps: [
        {
          instruction: "Recognize the signs of shock",
          description: "Look for pale, cold, clammy skin, rapid/weak pulse, rapid breathing, enlarged pupils, confusion, weakness, dizziness, nausea, thirst, or decreased urine output. In severe cases, the person may lose consciousness.",
          important: true
        },
        {
          instruction: "Call emergency services immediately",
          description: "Shock is a life-threatening condition that requires immediate medical attention.",
          important: true
        },
        {
          instruction: "Lay the person down",
          description: "Have them lie flat on their back with legs elevated about 12 inches (30 cm) unless head, neck, or spine injuries are suspected or this position causes discomfort.",
          important: true
        },
        {
          instruction: "Prevent heat loss",
          description: "Keep the person warm by covering them with blankets or coats, but don't overheat them.",
          important: true
        },
        {
          instruction: "Turn the person on their side if unconscious but breathing",
          description: "This helps maintain an open airway and prevents choking if the person vomits.",
          important: true
        },
        {
          instruction: "Do not give food or drink",
          description: "The person may need surgery, or they could choke if they lose consciousness.",
          important: true
        },
        {
          instruction: "Treat visible injuries if possible",
          description: "Control any external bleeding with direct pressure. Do not remove any embedded objects.",
          important: true
        },
        {
          instruction: "Monitor vital signs",
          description: "Check breathing, pulse, and level of consciousness regularly until emergency help arrives.",
          important: true
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
      source: "First Aid Guidelines for Emergency Conditions"
    };
  }

  // If this is specifically an animal bite query, use our specialized animal bite handler
  if (isGeneralAnimalBite) {
    console.log("Animal bite query detected, using specialized animal bite handler");
    return {
      condition: "Animal Bite",
      steps: [
        {
          instruction: "Ensure safety and prevent further injury",
          description: "Move away from the animal to prevent additional bites. If the animal is still present, do not approach it.",
          important: true
        },
        {
          instruction: "Wash the wound thoroughly",
          description: "Clean the bite wound immediately with soap and warm water for at least 5 minutes. Rinse thoroughly under running water to remove saliva, bacteria, and debris.",
          important: true
        },
        {
          instruction: "Control bleeding if necessary",
          description: "Apply direct pressure with a clean cloth or bandage if the wound is bleeding. Elevate the injured area if possible.",
          important: true
        },
        {
          instruction: "Apply an antiseptic",
          description: "After washing, apply an antiseptic solution or cream such as povidone-iodine or chlorhexidine to help prevent infection.",
          important: true
        },
        {
          instruction: "Cover the wound",
          description: "Apply a sterile bandage or dressing to keep the wound clean and protected.",
          important: true
        },
        {
          instruction: "Seek medical attention",
          description: "All animal bites should be evaluated by a healthcare professional, especially if the bite is from a wild or unknown animal, breaks the skin, or shows signs of infection.",
          important: true
        },
        {
          instruction: "Provide information about the animal",
          description: "If possible, note the type of animal, whether it's wild or domestic, and its behavior. This information is important for rabies risk assessment.",
          important: true
        },
        {
          instruction: "Watch for signs of infection",
          description: "Monitor the wound for increasing pain, redness, swelling, warmth, or discharge. Also watch for fever or swollen lymph nodes.",
          important: true
        }
      ],
      emergencyContact: "112",
      timeFrame: "Seek medical attention as soon as possible - within 24 hours for all animal bites",
      doNotDo: [
        "Do not attempt to catch or handle the animal that bit you",
        "Do not close or cover the wound without thorough cleaning first",
        "Do not apply butterfly bandages or tape to close the wound",
        "Do not ignore even minor animal bites as infection risk is high",
        "Do not delay seeking medical attention, especially for wild animal bites",
        "Do not apply alcohol, hydrogen peroxide, or iodine directly into deep wounds"
      ],
      emergency: true,
      source: "First Aid Guidelines for Animal Bites"
    };
  }

  // If this is specifically a snake bite query, use our specialized snake bite handler
  if (isSnakeBite) {
    return {
      condition: "Snake Bite",
      steps: [
        {
          instruction: "Call emergency services immediately",
          description: "Snake bites are potentially life-threatening and require urgent medical attention.",
          important: true,
        },
        {
          instruction: "Keep the person still and calm",
          description: "Movement can increase venom spread through the body. Keep the affected area below heart level.",
          important: true,
        },
        {
          instruction: "Remove any constricting items",
          description: "Take off jewelry, watches, or tight clothing near the bite site as swelling may occur.",
          important: true,
        },
        {
          instruction: "Clean the wound",
          description: "Gently clean the bite with soap and water. Cover with a clean, dry dressing.",
          important: true,
        },
        {
          instruction: "Note the snake's appearance",
          description: "If safe, remember the snake's color and pattern to help identify it. Do not attempt to catch or kill the snake.",
          important: true,
        },
        {
          instruction: "Monitor vital signs",
          description: "Check breathing, pulse, and consciousness. Be prepared to perform CPR if necessary.",
          important: true,
        }
      ],
      emergencyContact: "112",
      timeFrame: "Immediate medical attention required - every minute counts",
      doNotDo: [
        "Don't try to catch the snake",
        "Don't apply a tourniquet",
        "Don't try to suck out the venom",
        "Don't apply ice or immerse in cold water",
        "Don't give the person anything to eat or drink",
        "Don't raise the affected area above heart level",
        "Don't delay seeking medical help"
      ],
      emergency: true,
      source: "First Aid Guidelines"
    };
  }

  // If this is specifically a low blood sugar query, use our specialized hypoglycemia handler
  if (isLowBloodSugar) {
    console.log("Low blood sugar query detected, using specialized hypoglycemia handler");
    return {
      condition: "Low Blood Sugar (Hypoglycemia)",
      steps: [
        {
          instruction: "Recognize the symptoms",
          description: "Look for shakiness, dizziness, sweating, hunger, irritability, confusion, fast heartbeat, weakness, anxiety, or headache. Severe cases may include unconsciousness or seizures.",
          important: true
        },
        {
          instruction: "Check blood glucose level if possible",
          description: "If a glucose meter is available, check the person's blood sugar level. A reading below 70 mg/dL (3.9 mmol/L) indicates hypoglycemia."
        },
        {
          instruction: "Give fast-acting sugar",
          description: "If conscious and able to swallow safely, give 15-20 grams of fast-acting carbohydrates: glucose tablets, fruit juice, regular soda, or honey.",
          important: true
        },
        {
          instruction: "Wait and recheck",
          description: "Wait 15 minutes, then check blood sugar again. If still low, repeat the sugar intake."
        },
        {
          instruction: "Follow up with complex carbs",
          description: "Once blood sugar is normal, eat a small snack containing complex carbohydrates and protein to prevent sugar from dropping again."
        }
      ],
      emergencyContact: "112",
      timeFrame: "Act immediately - severe hypoglycemia can be life-threatening",
      doNotDo: [
        "Do not give food or drink if unconscious",
        "Do not delay treatment",
        "Do not leave the person alone",
        "Do not give complex carbohydrates as initial treatment",
        "Do not exercise or engage in physical activity"
      ],
      emergency: true,
      source: "First Aid Guidelines for Hypoglycemia"
    };
  }
}
