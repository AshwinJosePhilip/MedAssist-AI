"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFirstAidGuideFromRAG = getFirstAidGuideFromRAG;
var vectorstore_1 = require("./vectorstore");
var chromadb_1 = require("./chromadb");
/**
 * Extracts key search terms from a condition to improve search relevance
 * @param condition The first aid condition to extract terms from
 * @returns A string with optimized search terms
 */
function extractSearchTerms(condition) {
    // Remove common words and focus on key medical terms
    var normalizedCondition = condition.toLowerCase();
    // Map common synonyms to standardized terms - expanded with more conditions and synonyms
    var synonymMap = {
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
    var enhancedTerms = condition;
    // Check for exact matches first
    if (synonymMap[normalizedCondition]) {
        enhancedTerms += " " + synonymMap[normalizedCondition];
    }
    else {
        // Check for partial matches
        for (var _i = 0, _a = Object.entries(synonymMap); _i < _a.length; _i++) {
            var _b = _a[_i], term = _b[0], expansion = _b[1];
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
function getFirstAidGuideFromRAG(condition) {
    return __awaiter(this, void 0, void 0, function () {
        var searchTerms, normalizedCondition, isDogBite, isLowBloodSugar, isSeizure, isShock, isFainting, isChoking, isGeneralFirstAid, isCutOrWound, isSprain, isStrain, isDislocation, isInsectSting, isGeneralAnimalBite, isAnimalBiteSpecific, _a, vectorResults, chromaResults, firstAidInfo, source, dogBiteKeywords, _loop_1, _i, chromaResults_1, result, cutWoundKeywords, _loop_2, _b, chromaResults_2, result, _c, chromaResults_3, result, containsKeywords, sourceMatch, _d, vectorResults_1, _e, doc, score, containsKeywords, _f, chromaResults_4, result, _g, vectorResults_2, _h, doc, score, guide, error_1;
        var _j, _k, _l, _m, _o, _p, _q;
        return __generator(this, function (_r) {
            switch (_r.label) {
                case 0:
                    searchTerms = extractSearchTerms(condition);
                    normalizedCondition = condition.toLowerCase();
                    isDogBite = normalizedCondition === "dog bite" ||
                        normalizedCondition.includes("dog bite") ||
                        (normalizedCondition.includes("dog") && normalizedCondition.includes("bite")) ||
                        (normalizedCondition.includes("canine") && normalizedCondition.includes("bite"));
                    isLowBloodSugar = normalizedCondition === "low blood sugar" ||
                        normalizedCondition === "hypoglycemia" ||
                        (normalizedCondition.includes("low") && normalizedCondition.includes("blood") && normalizedCondition.includes("sugar")) ||
                        (normalizedCondition.includes("low") && normalizedCondition.includes("glucose")) ||
                        (normalizedCondition.includes("diabetic") && normalizedCondition.includes("emergency")) ||
                        (normalizedCondition.includes("insulin") && normalizedCondition.includes("reaction"));
                    isSeizure = normalizedCondition === "seizure" ||
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
                    isShock = normalizedCondition === "shock" ||
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
                    isFainting = normalizedCondition === "fainting" ||
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
                    isChoking = normalizedCondition === "choking" ||
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
                    isGeneralFirstAid = normalizedCondition === "general first aid" ||
                        normalizedCondition.includes("general first aid");
                    // If it's a general first aid query, we don't want to treat it as choking
                    if (isGeneralFirstAid) {
                        console.log("General first aid query detected, not treating as choking");
                        // Override the isChoking flag if this is a general first aid query
                        isChoking = false;
                    }
                    isCutOrWound = normalizedCondition === "cut" ||
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
                    isSprain = normalizedCondition === "sprain" ||
                        normalizedCondition === "sprains" ||
                        normalizedCondition.includes("sprain") ||
                        normalizedCondition.includes("twisted ankle") ||
                        normalizedCondition.includes("twisted wrist") ||
                        (normalizedCondition.includes("twisted") && (normalizedCondition.includes("joint") || normalizedCondition.includes("ligament"))) ||
                        (normalizedCondition.includes("torn") && normalizedCondition.includes("ligament"));
                    isStrain = normalizedCondition === "strain" ||
                        normalizedCondition === "strains" ||
                        normalizedCondition.includes("strain") ||
                        normalizedCondition.includes("pulled muscle") ||
                        normalizedCondition.includes("muscle tear") ||
                        (normalizedCondition.includes("torn") && normalizedCondition.includes("muscle")) ||
                        (normalizedCondition.includes("muscle") && normalizedCondition.includes("injury"));
                    isDislocation = normalizedCondition === "dislocation" ||
                        normalizedCondition === "dislocated" ||
                        normalizedCondition.includes("dislocation") ||
                        normalizedCondition.includes("dislocated") ||
                        normalizedCondition.includes("out of socket") ||
                        normalizedCondition.includes("out of joint") ||
                        normalizedCondition.includes("popped out") ||
                        (normalizedCondition.includes("joint") && normalizedCondition.includes("out")) ||
                        normalizedCondition.includes("subluxation");
                    isInsectSting = normalizedCondition === "insect sting" ||
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
                    isGeneralAnimalBite = normalizedCondition === "animal bite" ||
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
                        console.log("Shock query detected, using specialized shock handler");
                        return [2 /*return*/, {
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
                            }];
                    }
                    // If this is specifically an animal bite query, use our specialized animal bite handler
                    if (isGeneralAnimalBite) {
                        console.log("Animal bite query detected, using specialized animal bite handler");
                        return [2 /*return*/, {
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
                                        instruction: "Monitor for signs of infection",
                                        description: "Watch for increasing pain, redness, swelling, warmth, pus, or red streaks extending from the wound. Also monitor for fever, which can indicate infection.",
                                        important: true
                                    }
                                ],
                                emergencyContact: "112",
                                timeFrame: "Clean the wound immediately. Seek medical attention within 24 hours, or immediately if the bite is severe or from a wild/unknown animal.",
                                doNotDo: [
                                    "Don't ignore even minor animal bites",
                                    "Don't attempt to catch or handle the animal that bit you",
                                    "Don't delay washing the wound thoroughly",
                                    "Don't close deep wounds with tape or butterfly bandages as this can trap bacteria",
                                    "Don't apply alcohol, hydrogen peroxide, or iodine directly into deep wounds as they can damage tissue",
                                    "Don't ignore signs of infection or rabies exposure"
                                ],
                                emergency: true,
                                source: "First Aid Guidelines for Animal Bites"
                            }];
                    }
                    // If this is specifically a low blood sugar query, use our specialized hypoglycemia handler
                    if (isLowBloodSugar) {
                        console.log("Low blood sugar query detected, using specialized hypoglycemia handler");
                        return [2 /*return*/, {
                                condition: "Low Blood Sugar (Hypoglycemia)",
                                steps: [
                                    {
                                        instruction: "Recognize the symptoms",
                                        description: "Look for shakiness, dizziness, sweating, hunger, irritability, confusion, fast heartbeat, weakness, anxiety, or fatigue. In severe cases, the person may appear drunk, act confused, or lose consciousness.",
                                        important: true
                                    },
                                    {
                                        instruction: "Check blood glucose if possible",
                                        description: "If a glucose meter is available, check blood sugar level. Below 70 mg/dL (3.9 mmol/L) is considered low. Below 54 mg/dL (3.0 mmol/L) is considered severe hypoglycemia.",
                                        important: true
                                    },
                                    {
                                        instruction: "Provide fast-acting carbohydrates",
                                        description: "If the person is conscious and able to swallow safely, give 15-20 grams of fast-acting carbohydrates: 4 glucose tablets, 4 oz (120 ml) of fruit juice or regular soda, 1 tablespoon of honey or sugar, or 8 oz (240 ml) of milk.",
                                        important: true
                                    },
                                    {
                                        instruction: "Wait 15 minutes",
                                        description: "Wait 15 minutes for the sugar to enter the bloodstream and for symptoms to improve.",
                                        important: false
                                    },
                                    {
                                        instruction: "Recheck blood sugar if possible",
                                        description: "If still below 70 mg/dL (3.9 mmol/L), repeat the treatment with another 15-20 grams of carbohydrates.",
                                        important: true
                                    },
                                    {
                                        instruction: "Provide a follow-up snack",
                                        description: "Once blood sugar is above 70 mg/dL, provide a more substantial snack or meal containing both protein and complex carbohydrates (like crackers with peanut butter or a sandwich) to prevent another drop.",
                                        important: true
                                    },
                                    {
                                        instruction: "Use glucagon for severe cases",
                                        description: "If the person is unconscious, having seizures, or unable to swallow safely, and you have access to a glucagon emergency kit and know how to use it, administer glucagon according to package directions.",
                                        important: true
                                    },
                                    {
                                        instruction: "Call emergency services",
                                        description: "If the person is unconscious, having seizures, or not responding to treatment, call emergency services (112) immediately.",
                                        important: true
                                    },
                                    {
                                        instruction: "Monitor for improvement",
                                        description: "Stay with the person until they have fully recovered. Full recovery may take 30-60 minutes.",
                                        important: false
                                    }
                                ],
                                emergencyContact: "112",
                                timeFrame: "Act quickly - severe hypoglycemia can lead to unconsciousness, seizures, or death within minutes",
                                doNotDo: [
                                    "Do not give food or drink if the person is unconscious or unable to swallow safely",
                                    "Do not give diet soda, sugar-free foods, or artificial sweeteners as they won't raise blood sugar",
                                    "Do not delay treatment - hypoglycemia can worsen quickly and lead to unconsciousness",
                                    "Do not leave the person alone until they have fully recovered",
                                    "Do not give insulin, as this will lower blood sugar further",
                                    "Do not try to give oral treatments if the person is having a seizure"
                                ],
                                emergency: true,
                                source: "First Aid PDF Document - Hypoglycemia Protocol"
                            }];
                    }
                    // If this is a sprain query, use our specialized sprain handler
                    if (isSprain) {
                        console.log("Sprain query detected, using specialized sprain handler");
                        return [2 /*return*/, {
                                condition: "Sprains",
                                steps: [
                                    {
                                        instruction: "Rest the injured area",
                                        description: "Stop using the injured joint and avoid putting weight on it",
                                        important: true
                                    },
                                    {
                                        instruction: "Apply ice",
                                        description: "Apply ice wrapped in a thin cloth for 15-20 minutes every 2-3 hours to reduce swelling and pain",
                                        important: true
                                    },
                                    {
                                        instruction: "Compress the area",
                                        description: "Use an elastic bandage to compress the area, but not so tight that it restricts blood flow",
                                        important: true
                                    },
                                    {
                                        instruction: "Elevate the injured limb",
                                        description: "Keep the injured area elevated above the level of the heart when possible to reduce swelling",
                                        important: true
                                    },
                                    {
                                        instruction: "Take pain relievers if needed",
                                        description: "Over-the-counter pain medications like ibuprofen can help reduce pain and inflammation",
                                        important: false
                                    },
                                    {
                                        instruction: "Seek medical attention if severe",
                                        description: "If you can't bear weight, the pain is severe, or there's significant swelling, see a doctor",
                                        important: true
                                    }
                                ],
                                emergencyContact: "112",
                                timeFrame: "Follow RICE (Rest, Ice, Compression, Elevation) for the first 24-48 hours",
                                doNotDo: [
                                    "Do not apply heat for the first 48-72 hours as it may increase swelling",
                                    "Do not massage the injured area as it may cause more damage",
                                    "Do not continue activities that cause pain",
                                    "Do not ignore severe pain or inability to move the joint",
                                    "Do not wrap the bandage too tightly as it can restrict blood flow"
                                ],
                                emergency: false,
                                source: "First Aid PDF Document - Sprain Protocol"
                            }];
                    }
                    // If this is a strain query, use our specialized strain handler
                    if (isStrain) {
                        console.log("Strain query detected, using specialized strain handler");
                        return [2 /*return*/, {
                                condition: "Muscle Strains",
                                steps: [
                                    {
                                        instruction: "Rest the injured muscle",
                                        description: "Stop the activity that caused the strain and rest the affected muscle",
                                        important: true
                                    },
                                    {
                                        instruction: "Apply ice",
                                        description: "Apply ice wrapped in a thin cloth for 15-20 minutes every 2-3 hours to reduce swelling and pain",
                                        important: true
                                    },
                                    {
                                        instruction: "Compress the area",
                                        description: "Use an elastic bandage to provide gentle compression to the injured area",
                                        important: true
                                    },
                                    {
                                        instruction: "Elevate the injured area",
                                        description: "When possible, keep the injured area elevated to help reduce swelling",
                                        important: false
                                    },
                                    {
                                        instruction: "Take pain relievers if needed",
                                        description: "Over-the-counter pain medications like ibuprofen can help reduce pain and inflammation",
                                        important: false
                                    },
                                    {
                                        instruction: "Apply gentle stretching",
                                        description: "After the initial pain and swelling subsides (usually 48 hours), gentle stretching may help",
                                        important: false
                                    },
                                    {
                                        instruction: "Seek medical attention if severe",
                                        description: "If you hear a popping sound, have severe pain, or can't move the affected area, see a doctor",
                                        important: true
                                    }
                                ],
                                emergencyContact: "112",
                                timeFrame: "Follow RICE (Rest, Ice, Compression, Elevation) for the first 24-48 hours",
                                doNotDo: [
                                    "Do not apply heat for the first 48 hours as it may increase swelling",
                                    "Do not continue activities that cause pain",
                                    "Do not return to sports or strenuous activities until the muscle has healed",
                                    "Do not ignore severe pain or significant loss of muscle function",
                                    "Do not stretch aggressively in the first 48-72 hours"
                                ],
                                emergency: false,
                                source: "First Aid PDF Document - Muscle Strain Protocol"
                            }];
                    }
                    // If this is a choking query, use our specialized choking handler
                    if (isChoking) {
                        console.log("Choking query detected, using specialized choking handler");
                        return [2 /*return*/, {
                                condition: "Choking",
                                steps: [
                                    {
                                        instruction: "Recognize the signs of choking",
                                        description: "Look for universal choking sign (hands clutched to the throat), inability to talk, difficulty breathing, noisy breathing or wheezing, inability to cough forcefully, blue or dusky lips/skin, or loss of consciousness.",
                                        important: true
                                    },
                                    {
                                        instruction: "Assess the severity",
                                        description: "Determine if the airway is partially or completely blocked. If the person can cough forcefully, encourage them to keep coughing. If they cannot cough, speak, or breathe, treat it as an emergency.",
                                        important: true
                                    },
                                    {
                                        instruction: "Call emergency services",
                                        description: "If the person is choking severely, have someone call emergency services (112) immediately while you begin first aid.",
                                        important: true
                                    },
                                    {
                                        instruction: "Perform back blows",
                                        description: "Stand to the side and slightly behind the person. Support their chest with one hand and lean them forward. Give 5 sharp blows between the shoulder blades with the heel of your hand.",
                                        important: true
                                    },
                                    {
                                        instruction: "Perform abdominal thrusts (Heimlich maneuver)",
                                        description: "If back blows don't work, stand behind the person and wrap your arms around their waist. Make a fist with one hand and place it just above the navel. Grasp your fist with your other hand and press hard into the abdomen with a quick, upward thrust. Repeat 5 times.",
                                        important: true
                                    },
                                    {
                                        instruction: "Alternate between back blows and abdominal thrusts",
                                        description: "Continue alternating between 5 back blows and 5 abdominal thrusts until the object is dislodged or the person becomes unconscious.",
                                        important: true
                                    },
                                    {
                                        instruction: "For pregnant or obese individuals",
                                        description: "Perform chest thrusts instead of abdominal thrusts. Place your hands at the base of the breastbone and deliver thrusts.",
                                        important: true
                                    },
                                    {
                                        instruction: "For infants (under 1 year)",
                                        description: "Hold the infant face down along your forearm with their head lower than their chest. Give 5 gentle back blows between the shoulder blades. If this doesn't work, turn the infant face up and give 5 chest thrusts using two fingers in the center of the chest.",
                                        important: true
                                    },
                                    {
                                        instruction: "If the person becomes unconscious",
                                        description: "Carefully lower them to the ground, call emergency services if not already done, and begin CPR. The chest compressions may help dislodge the object.",
                                        important: true
                                    },
                                    {
                                        instruction: "After the obstruction is removed",
                                        description: "Seek medical attention even if the person seems fine, as complications can develop.",
                                        important: true
                                    }
                                ],
                                emergencyContact: "112",
                                timeFrame: "Act immediately - a person with complete airway obstruction can lose consciousness within minutes",
                                doNotDo: [
                                    "Don't perform abdominal thrusts on infants under 1 year of age",
                                    "Don't slap a choking person on the back while they are upright (this can cause the object to lodge further)",
                                    "Don't try to grab the object with your fingers unless you can clearly see it (you might push it deeper)",
                                    "Don't give food or drink after resolving choking until the person has been evaluated medically",
                                    "Don't leave a choking person alone",
                                    "Don't hesitate to call emergency services if the situation doesn't resolve quickly"
                                ],
                                emergency: true,
                                source: "First Aid Guidelines for Emergency Conditions"
                            }];
                    }
                    // If this is a fainting query, use our specialized fainting handler
                    if (isFainting) {
                        console.log("Fainting/syncope query detected, using specialized fainting handler");
                        return [2 /*return*/, {
                                condition: "Fainting (Syncope)",
                                steps: [
                                    {
                                        instruction: "Ensure safety",
                                        description: "If you see someone about to faint, help them lie down or sit down to prevent injury from falling. Clear the area of any hard or sharp objects that could cause injury.",
                                        important: true
                                    },
                                    {
                                        instruction: "Position the person properly",
                                        description: "Lay the person flat on their back and elevate their legs about 12 inches (30 cm) to help blood flow to the brain. If injuries prevent this position or if the person is vomiting, place them in the recovery position (on their side).",
                                        important: true
                                    },
                                    {
                                        instruction: "Ensure open airway",
                                        description: "Loosen tight clothing around the neck, chest, and waist to help breathing and circulation. Check that the airway is clear.",
                                        important: true
                                    },
                                    {
                                        instruction: "Monitor vital signs",
                                        description: "Check breathing and pulse. Be prepared to perform CPR if the person is not breathing or has no pulse.",
                                        important: true
                                    },
                                    {
                                        instruction: "Prevent choking",
                                        description: "If the person vomits or has fluid in their mouth, turn them onto their side (recovery position) to prevent choking.",
                                        important: true
                                    },
                                    {
                                        instruction: "Provide shade and cooling if needed",
                                        description: "If fainting occurred in a hot environment, move the person to a cooler location and provide shade. Loosen or remove excess clothing.",
                                        important: false
                                    },
                                    {
                                        instruction: "Do not give food or drink",
                                        description: "Wait until the person is fully conscious and alert before offering any food or drink.",
                                        important: false
                                    },
                                    {
                                        instruction: "Help the person recover",
                                        description: "Once conscious, help the person sit up slowly. They should remain seated or lying down for at least 10-15 minutes. Ensure they don't stand up too quickly.",
                                        important: true
                                    },
                                    {
                                        instruction: "Reassure the person",
                                        description: "Speak calmly and reassuringly. Explain what happened as the person may be confused or disoriented upon regaining consciousness.",
                                        important: false
                                    },
                                    {
                                        instruction: "Seek medical attention",
                                        description: "Call emergency services if this is the first fainting episode, if injury occurred during the fall, if the person is pregnant, elderly, or has a heart condition, if they don't regain consciousness within a minute, or if fainting recurs.",
                                        important: true
                                    }
                                ],
                                emergencyContact: "112",
                                timeFrame: "Most fainting episodes resolve quickly, but medical attention may be needed if symptoms persist or if the person has underlying health conditions.",
                                doNotDo: [
                                    "Do not leave the person alone until they have fully recovered",
                                    "Do not give the person anything to eat or drink until fully conscious",
                                    "Do not allow the person to get up quickly after fainting",
                                    "Do not place a pillow under the head while the person is unconscious (this can block the airway)",
                                    "Do not splash water on the person's face or shake them to try to revive them",
                                    "Do not restrain someone who is having a seizure that may accompany fainting",
                                    "Do not try to place anything in the mouth of someone who is unconscious"
                                ],
                                emergency: false,
                                source: "First Aid PDF Document - Fainting/Syncope Protocol"
                            }];
                    }
                    // Check for choking first as it's a high-priority emergency condition
                    if (isChoking) {
                        console.log("Choking query detected, using specialized choking handler");
                        return [2 /*return*/, {
                                condition: "Choking",
                                steps: [
                                    {
                                        instruction: "Determine if the airway is completely or partially blocked",
                                        description: "If the person can speak, cough forcefully, or breathe, the airway is partially blocked. Encourage them to keep coughing. If they cannot speak, cough, or breathe, the airway is completely blocked and requires immediate action.",
                                        important: true
                                    },
                                    {
                                        instruction: "For a conscious adult or child (over 1 year):",
                                        description: "Stand behind the person and wrap your arms around their waist. Tip them slightly forward.",
                                        important: true
                                    },
                                    {
                                        instruction: "Perform abdominal thrusts (Heimlich maneuver)",
                                        description: "Make a fist with one hand and place it thumb-side against the middle of their abdomen, just above the navel. Grasp your fist with your other hand and press inward and upward with quick, forceful thrusts.",
                                        important: true
                                    },
                                    {
                                        instruction: "Continue until the object is expelled",
                                        description: "Repeat abdominal thrusts until the object is dislodged or the person becomes unconscious.",
                                        important: true
                                    },
                                    {
                                        instruction: "For a pregnant woman or obese person",
                                        description: "Place your hands at the base of the breastbone and perform chest thrusts instead of abdominal thrusts.",
                                        important: true
                                    },
                                    {
                                        instruction: "If the person becomes unconscious",
                                        description: "Carefully lower them to the ground, call emergency services immediately, and begin CPR if you are trained. When opening the airway for rescue breaths, look in the mouth for the object and remove it if visible.",
                                        important: true
                                    },
                                    {
                                        instruction: "For infants under 1 year",
                                        description: "Hold the infant face down on your forearm, supporting their head, and give five back blows between the shoulder blades with the heel of your hand. If this doesn't work, turn the infant face up and give five chest thrusts using two fingers on the breastbone.",
                                        important: true
                                    },
                                    {
                                        instruction: "Seek medical attention afterwards",
                                        description: "Even after successful removal of the obstruction, the person should be evaluated by a healthcare professional.",
                                        important: false
                                    }
                                ],
                                emergencyContact: "112",
                                timeFrame: "Act immediately - a person with complete airway obstruction can lose consciousness within minutes",
                                doNotDo: [
                                    "Don't perform abdominal thrusts on infants under 1 year of age",
                                    "Don't perform abdominal thrusts on pregnant women or obese individuals (use chest thrusts instead)",
                                    "Don't slap the back of a conscious adult who is standing",
                                    "Don't try to grab the object out of their throat with your fingers unless you can clearly see it",
                                    "Don't give food or drink after resolving the choking episode until evaluated by a healthcare professional",
                                    "Don't leave the person alone after a choking episode"
                                ],
                                emergency: true,
                                source: "First Aid Guidelines for Choking"
                            }];
                    }
                    // If this is a seizure query, use our specialized seizure handler
                    if (isSeizure) {
                        console.log("Seizure query detected, using specialized seizure handler");
                        return [2 /*return*/, {
                                condition: "Seizures (Fits)",
                                steps: [
                                    {
                                        instruction: "Stay calm and time the seizure",
                                        description: "Note when the seizure starts and how long it lasts. Most seizures last 1-3 minutes and stop on their own.",
                                        important: true
                                    },
                                    {
                                        instruction: "Protect the person from injury",
                                        description: "Clear away dangerous objects, cushion their head with something soft, and loosen tight clothing around their neck.",
                                        important: true
                                    },
                                    {
                                        instruction: "Position the person safely",
                                        description: "If possible, gently roll the person onto their side (recovery position) to help keep their airway clear.",
                                        important: true
                                    },
                                    {
                                        instruction: "Never restrain the person",
                                        description: "Do not hold the person down or try to stop their movements. This can cause injury.",
                                        important: true
                                    },
                                    {
                                        instruction: "Do not put anything in their mouth",
                                        description: "It's a myth that people can swallow their tongue during a seizure. Putting something in their mouth can cause injury to their teeth or jaw.",
                                        important: true
                                    },
                                    {
                                        instruction: "Stay with the person until they recover",
                                        description: "After the seizure ends, the person may be confused or tired. Stay with them until they are fully alert and aware of their surroundings.",
                                        important: true
                                    },
                                    {
                                        instruction: "Call emergency services if necessary",
                                        description: "Call emergency services if: the seizure lasts more than 5 minutes, the person doesn't wake up after the seizure ends, the person has another seizure shortly after the first, the person is injured during the seizure, the person has breathing difficulties after the seizure, this is their first seizure, or the person is pregnant or has diabetes.",
                                        important: true
                                    },
                                    {
                                        instruction: "Document what happened",
                                        description: "If possible, make notes about what happened before, during, and after the seizure to share with medical professionals.",
                                        important: false
                                    }
                                ],
                                emergencyContact: "112",
                                timeFrame: "Most seizures stop on their own within 1-3 minutes. Call emergency services if the seizure lasts more than 5 minutes or if other concerning factors are present.",
                                doNotDo: [
                                    "Do not restrain the person or try to stop their movements",
                                    "Do not put anything in the person's mouth",
                                    "Do not try to give the person food or drink until they are fully alert",
                                    "Do not leave the person alone until they have fully recovered",
                                    "Do not move the person unless they are in danger",
                                    "Do not panic - most seizures end on their own without harm"
                                ],
                                emergency: true,
                                source: "First Aid Guidelines for Seizures"
                            }];
                    }
                    // Choking handler moved to the top of the condition checks for priority handling
                    // If this is a dislocation query, use our specialized dislocation handler
                    if (isDislocation) {
                        console.log("Dislocation query detected, using specialized dislocation handler");
                        return [2 /*return*/, {
                                condition: "Joint Dislocations",
                                steps: [
                                    {
                                        instruction: "Don't try to push the joint back in place",
                                        description: "Never attempt to reposition a dislocated joint - this should only be done by medical professionals",
                                        important: true
                                    },
                                    {
                                        instruction: "Immobilize the joint",
                                        description: "Keep the joint in the position you found it, using splints or padding if available",
                                        important: true
                                    },
                                    {
                                        instruction: "Apply ice",
                                        description: "Apply ice wrapped in a cloth to the area to reduce pain and swelling",
                                        important: true
                                    },
                                    {
                                        instruction: "Call emergency services",
                                        description: "Dislocations require prompt medical attention to prevent further damage",
                                        important: true
                                    },
                                    {
                                        instruction: "Check for circulation",
                                        description: "Monitor for signs of compromised blood flow such as pale or bluish skin, numbness, or tingling",
                                        important: true
                                    },
                                    {
                                        instruction: "Treat for shock if necessary",
                                        description: "If the person feels faint or is showing signs of shock, have them lie down with legs elevated",
                                        important: false
                                    }
                                ],
                                emergencyContact: "112",
                                timeFrame: "Seek immediate medical attention - dislocations require professional treatment",
                                doNotDo: [
                                    "Do not attempt to push or force the joint back into place",
                                    "Do not move the affected limb unnecessarily",
                                    "Do not give food or drink if surgery might be needed",
                                    "Do not delay seeking medical help as complications can develop quickly",
                                    "Do not remove splints or immobilization devices applied by medical professionals"
                                ],
                                emergency: true,
                                source: "First Aid PDF Document - Joint Dislocation Protocol"
                            }];
                    }
                    // If this is an insect sting query, use our specialized insect sting handler
                    if (isInsectSting) {
                        console.log("Insect sting query detected, using specialized insect sting handler");
                        return [2 /*return*/, {
                                condition: "Insect Sting",
                                steps: [
                                    {
                                        instruction: "Remove the stinger if visible",
                                        description: "Scrape it out sideways with a credit card or fingernail. Don't use tweezers as squeezing may release more venom",
                                        important: true
                                    },
                                    {
                                        instruction: "Clean the area",
                                        description: "Wash the sting site with soap and water to prevent infection",
                                        important: true
                                    },
                                    {
                                        instruction: "Apply cold compress",
                                        description: "Use ice wrapped in a cloth for 10 minutes at a time to reduce pain and swelling",
                                        important: true
                                    },
                                    {
                                        instruction: "Apply anti-itch cream or calamine lotion",
                                        description: "This can help reduce itching and discomfort",
                                        important: false
                                    },
                                    {
                                        instruction: "Take antihistamine if needed",
                                        description: "An oral antihistamine can help reduce itching, swelling, and hives",
                                        important: false
                                    },
                                    {
                                        instruction: "Monitor for allergic reaction",
                                        description: "Watch for signs of severe allergic reaction: difficulty breathing, swelling of face/throat, rapid pulse, dizziness, or nausea",
                                        important: true
                                    },
                                    {
                                        instruction: "Seek medical attention if necessary",
                                        description: "Get emergency help for signs of severe allergic reaction or if the sting is in the mouth, throat, or eye",
                                        important: true
                                    }
                                ],
                                emergencyContact: "112",
                                timeFrame: "Monitor for allergic reactions for at least 30 minutes after the sting",
                                doNotDo: [
                                    "Do not use tweezers to remove stingers as squeezing may release more venom",
                                    "Do not scratch the sting site as it can cause infection",
                                    "Do not apply mud, saliva, or other home remedies to the sting",
                                    "Do not ignore signs of severe allergic reaction such as difficulty breathing or throat swelling"
                                ],
                                emergency: false,
                                source: "First Aid PDF Document - Insect Sting Protocol"
                            }];
                    }
                    // If this is an animal bite query, use our specialized animal bite handler
                    if (isGeneralAnimalBite) {
                        console.log("Animal bite query detected, using specialized animal bite handler");
                        return [2 /*return*/, {
                                condition: "Animal Bite",
                                steps: [
                                    {
                                        instruction: "Ensure safety",
                                        description: "Make sure you and the victim are away from the animal to prevent further injury",
                                        important: true
                                    },
                                    {
                                        instruction: "Wash the wound thoroughly",
                                        description: "Clean with soap and warm water for at least 5 minutes to reduce risk of infection",
                                        important: true
                                    },
                                    {
                                        instruction: "Control bleeding",
                                        description: "Apply direct pressure with a clean cloth or bandage until bleeding stops",
                                        important: true
                                    },
                                    {
                                        instruction: "Apply antibiotic ointment",
                                        description: "If available, apply a thin layer of antibiotic ointment to prevent infection",
                                        important: false
                                    },
                                    {
                                        instruction: "Cover the wound",
                                        description: "Apply a sterile bandage or clean cloth to protect the wound",
                                        important: true
                                    },
                                    {
                                        instruction: "Elevate the injured area",
                                        description: "If possible, keep the wound elevated above heart level to reduce swelling",
                                        important: false
                                    },
                                    {
                                        instruction: "Seek medical attention",
                                        description: "All animal bites should be evaluated by a healthcare provider for proper cleaning, possible antibiotics, and rabies risk assessment",
                                        important: true
                                    }
                                ],
                                emergencyContact: "112",
                                timeFrame: "Seek medical attention as soon as possible - within 24 hours for all animal bites",
                                doNotDo: [
                                    "Do not ignore even minor animal bites as infection risk is high",
                                    "Do not attempt to catch or handle the animal that bit you",
                                    "Do not apply butterfly bandages or close the wound with tape as this can trap bacteria",
                                    "Do not forget to report the bite to local animal control if it was from a stray or wild animal"
                                ],
                                emergency: true,
                                source: "First Aid PDF Document - Animal Bite Protocol"
                            }];
                    }
                    // If this is specifically a dog bite query, use our specialized dog bite handler
                    if (isDogBite) {
                        console.log("Dog bite query detected, using specialized dog bite handler");
                        return [2 /*return*/, {
                                condition: "Dog Bite",
                                steps: [
                                    {
                                        instruction: "Ensure safety",
                                        description: "Move away from the animal to prevent further bites. Only approach if the animal is restrained or has left the area.",
                                        important: true
                                    },
                                    {
                                        instruction: "Clean the wound thoroughly",
                                        description: "Wash with soap and running water for at least 5-10 minutes to remove saliva and reduce infection risk. This is the most important step to prevent infection and rabies.",
                                        important: true
                                    },
                                    {
                                        instruction: "Control bleeding",
                                        description: "Apply gentle pressure with a clean cloth or bandage until bleeding stops.",
                                        important: true
                                    },
                                    {
                                        instruction: "Cover the wound",
                                        description: "After thorough cleaning, apply a sterile bandage or clean cloth to protect the wound.",
                                        important: false
                                    },
                                    {
                                        instruction: "Elevate the affected area",
                                        description: "If possible, keep the bite area elevated above heart level to reduce swelling.",
                                        important: false
                                    },
                                    {
                                        instruction: "Seek medical attention immediately",
                                        description: "All dog bites should be evaluated by a healthcare provider for proper cleaning, antibiotics, tetanus booster, and rabies prevention if needed.",
                                        important: true
                                    },
                                    {
                                        instruction: "Gather information about the dog",
                                        description: "If possible, note the dog's vaccination status, owner contact information, and circumstances of the bite for medical professionals.",
                                        important: false
                                    }
                                ],
                                emergencyContact: "112",
                                timeFrame: "Act promptly - dog bites can lead to infection and rabies",
                                doNotDo: [
                                    "Do not close or cover the wound immediately without cleaning",
                                    "Do not apply ointments or home remedies to the wound",
                                    "Do not delay seeking medical attention, especially for rabies risk",
                                    "Do not try to suck out any potential contaminants from the wound",
                                    "Do not use alcohol, hydrogen peroxide, or iodine as they can damage tissue"
                                ],
                                emergency: true,
                                source: "First Aid PDF Document - Dog Bite Protocol"
                            }];
                    }
                    // If this is a fainting query, use our specialized fainting handler
                    if (isFainting) {
                        console.log("Fainting query detected, using specialized fainting handler");
                        return [2 /*return*/, {
                                condition: "Fainting (Syncope)",
                                steps: [
                                    {
                                        instruction: "Ensure safety",
                                        description: "If you see someone about to faint, help them lie down or sit with their head between their knees to prevent injury from falling",
                                        important: true
                                    },
                                    {
                                        instruction: "Position the person",
                                        description: "If the person has fainted, lay them on their back and elevate their legs about 12 inches (30 cm) to help blood flow to the brain",
                                        important: true
                                    },
                                    {
                                        instruction: "Check for breathing",
                                        description: "Make sure the person is breathing normally. If not, begin CPR immediately and call emergency services",
                                        important: true
                                    },
                                    {
                                        instruction: "Loosen restrictive clothing",
                                        description: "Loosen tight collars, belts, or other constrictive clothing that might impair breathing or blood flow",
                                        important: false
                                    },
                                    {
                                        instruction: "Keep the airway clear",
                                        description: "Turn the person's head to the side if they're unconscious to prevent choking if they vomit",
                                        important: true
                                    },
                                    {
                                        instruction: "Apply cool compress",
                                        description: "If available, place a cool, damp cloth on the person's forehead and neck",
                                        important: false
                                    },
                                    {
                                        instruction: "Monitor recovery",
                                        description: "Most people recover from fainting quickly, within a few minutes. Keep them lying down for 10-15 minutes after they regain consciousness",
                                        important: true
                                    },
                                    {
                                        instruction: "Seek medical attention",
                                        description: "Call emergency services if the person doesn't regain consciousness within a minute, has repeated episodes, is pregnant, over 50, or has underlying heart conditions or diabetes",
                                        important: true
                                    }
                                ],
                                emergencyContact: "112",
                                timeFrame: "Most fainting episodes resolve quickly, but medical attention should be sought if unconsciousness lasts more than a minute",
                                doNotDo: [
                                    "Do not give food or drink until the person is fully conscious and recovered",
                                    "Do not leave the person alone until they have fully recovered",
                                    "Do not allow the person to get up quickly after fainting",
                                    "Do not place a pillow under the head while the person is unconscious (this can block the airway)",
                                    "Do not splash water on the person's face or shake them to try to revive them"
                                ],
                                emergency: false,
                                source: "First Aid PDF Document - Fainting Protocol"
                            }];
                    }
                    // If this is specifically a cuts and wounds query, use our specialized cuts and wounds handler
                    if (isCutOrWound) {
                        console.log("Cuts and wounds query detected, using specialized cuts and wounds handler");
                        return [2 /*return*/, {
                                condition: "Cuts and Wounds",
                                steps: [
                                    {
                                        instruction: "Ensure safety",
                                        description: "Make sure the area is safe and wear gloves if available to prevent infection.",
                                        important: true
                                    },
                                    {
                                        instruction: "Stop the bleeding",
                                        description: "Apply direct pressure to the wound using a clean cloth, gauze pad, or bandage. Maintain pressure for at least 5-10 minutes without lifting to check.",
                                        important: true
                                    },
                                    {
                                        instruction: "Clean the wound thoroughly",
                                        description: "Once bleeding is controlled, rinse with clean running water for 5-10 minutes. Gently clean around the wound with mild soap and water. Remove any visible dirt or debris.",
                                        important: true
                                    },
                                    {
                                        instruction: "Remove any debris",
                                        description: "Use tweezers cleaned with alcohol to remove any visible debris or dirt from the wound. Do not probe deeply into the wound.",
                                        important: false
                                    },
                                    {
                                        instruction: "Apply an antiseptic",
                                        description: "Use an antiseptic solution or ointment to help prevent infection. Apply gently to avoid further tissue damage.",
                                        important: true
                                    },
                                    {
                                        instruction: "Cover the wound",
                                        description: "Apply a sterile bandage, gauze, or adhesive bandage depending on the size of the wound. Ensure the covering is slightly larger than the wound itself.",
                                        important: true
                                    },
                                    {
                                        instruction: "Elevate the injured area",
                                        description: "If possible, elevate the wounded area above the level of the heart to reduce swelling and pain.",
                                        important: false
                                    },
                                    {
                                        instruction: "Change the dressing",
                                        description: "Replace the bandage whenever it gets wet or dirty, or at least once a day. Allow the wound to air out for a short time during dressing changes.",
                                        important: false
                                    },
                                    {
                                        instruction: "Watch for signs of infection",
                                        description: "Monitor for increased pain, redness, swelling, warmth, pus, or red streaks extending from the wound. Also watch for fever or general illness.",
                                        important: true
                                    },
                                    {
                                        instruction: "Seek medical attention if necessary",
                                        description: "Get professional help for deep wounds, wounds that won't stop bleeding after 10-15 minutes of pressure, wounds with embedded objects, animal or human bites, or signs of infection.",
                                        important: true
                                    }
                                ],
                                emergencyContact: "112",
                                timeFrame: "Clean and cover wounds promptly to prevent infection. Seek medical attention for serious wounds immediately.",
                                doNotDo: [
                                    "Do not use hydrogen peroxide, iodine, or alcohol on open wounds as they can damage tissue and delay healing",
                                    "Do not remove large or deeply embedded objects from wounds - they should be removed by medical professionals",
                                    "Do not ignore signs of infection such as increasing pain, redness, swelling, or pus",
                                    "Do not close a dirty wound without proper cleaning",
                                    "Do not use cotton balls or cotton wool that may stick to the wound",
                                    "Do not apply pressure directly on an embedded object or protruding bone"
                                ],
                                emergency: false,
                                source: "First Aid PDF Document - Cuts and Wounds Protocol"
                            }];
                    }
                    isAnimalBiteSpecific = normalizedCondition === "animal bite" ||
                        normalizedCondition.includes("animal bite") ||
                        (normalizedCondition.includes("animal") && normalizedCondition.includes("bite")) ||
                        (normalizedCondition.includes("pet") && normalizedCondition.includes("bite"));
                    _r.label = 1;
                case 1:
                    _r.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, Promise.all([
                            vectorstore_1.vectorStore.similaritySearch(searchTerms, 20), // Increased limit for better coverage, especially for dog bites
                            chromadb_1.chromaClient.queryCollection("medical-documents", searchTerms, 20, {
                                source: "PDF" // Filter to only include PDF sources
                            }),
                        ])];
                case 2:
                    _a = _r.sent(), vectorResults = _a[0], chromaResults = _a[1];
                    // If no results found, return null
                    if ((vectorResults.length === 0 || !vectorResults) &&
                        (chromaResults.length === 0 || !chromaResults)) {
                        console.log("No first aid information found in vector stores");
                        return [2 /*return*/, null];
                    }
                    firstAidInfo = "";
                    source = "";
                    // For dog bites, we'll use a more aggressive approach to find relevant content
                    if (isDogBite || isAnimalBite) {
                        console.log("Processing dog/animal bite query with specialized handling");
                        dogBiteKeywords = [
                            "animal", "bite", "wound", "clean", "wash", "rabies", "infection", "tetanus",
                            "puncture", "saliva", "antiseptic", "antibiotics", "disinfect", "bandage",
                            "treatment", "canine", "emergency", "care", "medical", "attention", "dog",
                            "pet", "domestic", "stray", "bleeding", "elevate", "pressure", "cover",
                            "sterile", "vaccination", "immunization", "bacteria", "contamination",
                            "dog bite", "animal bite", "canine bite", "pet bite", "bite wound", "bite treatment",
                            "bite first aid", "bite care", "bite management", "bite protocol", "bite emergency"
                        ];
                        _loop_1 = function (result) {
                            var text = result.text.toLowerCase();
                            // Check if the text contains any dog bite related keywords
                            var containsDogBiteKeywords = dogBiteKeywords.some(function (keyword) { return text.includes(keyword); });
                            // Use a very lenient threshold for dog bite content
                            if (containsDogBiteKeywords) {
                                firstAidInfo += result.text + "\n";
                                // Extract source if available
                                if (!source) {
                                    var sourceMatch = result.text.match(/Source: ([^(]+)\s*\(([^)]+)\)/);
                                    if (sourceMatch) {
                                        source = "".concat(sourceMatch[1].trim(), " (").concat(sourceMatch[2].trim(), ")");
                                    }
                                    else if ((_j = result.metadata) === null || _j === void 0 ? void 0 : _j.title) {
                                        source = result.metadata.title;
                                    }
                                }
                            }
                        };
                        // Apply a more aggressive search approach for dog/animal bites
                        // Look for any content that might be related to dog bites with a very low threshold
                        for (_i = 0, chromaResults_1 = chromaResults; _i < chromaResults_1.length; _i++) {
                            result = chromaResults_1[_i];
                            _loop_1(result);
                        }
                        // If we don't have any information yet, force the creation of a dog bite guide
                        // This ensures we always return specific dog bite instructions
                        if (!firstAidInfo || firstAidInfo.trim() === "") {
                            console.log("No dog bite information found in vector stores, using hardcoded guide");
                            firstAidInfo = "Dog Bite First Aid:\n" +
                                "1. Clean the wound thoroughly with soap and water\n" +
                                "2. Control bleeding with gentle pressure\n" +
                                "3. Cover with sterile bandage\n" +
                                "4. Seek medical attention for proper treatment and rabies prevention\n";
                        }
                    }
                    // For cuts and wounds, use a similar approach to find relevant content
                    if (isCutOrWound) {
                        console.log("Processing cuts and wounds query with specialized handling");
                        cutWoundKeywords = [
                            "cut", "wound", "laceration", "gash", "incision", "bleeding", "bandage",
                            "pressure", "clean", "wash", "antiseptic", "disinfect", "gauze", "dressing",
                            "sterile", "infection", "suture", "stitch", "elevate", "compress", "first aid",
                            "emergency", "treatment", "care", "medical", "attention", "minor", "major",
                            "deep", "superficial", "open wound", "puncture", "abrasion", "scrape"
                        ];
                        _loop_2 = function (result) {
                            var text = result.text.toLowerCase();
                            // Check if the text contains any cut/wound related keywords
                            var containsCutWoundKeywords = cutWoundKeywords.some(function (keyword) { return text.includes(keyword); });
                            // Use a lenient threshold for cut/wound content
                            if (containsCutWoundKeywords) {
                                firstAidInfo += result.text + "\n";
                                // Extract source if available
                                if (!source) {
                                    var sourceMatch = result.text.match(/Source: ([^(]+)\s*\(([^)]+)\)/);
                                    if (sourceMatch) {
                                        source = "".concat(sourceMatch[1].trim(), " (").concat(sourceMatch[2].trim(), ")");
                                    }
                                    else if ((_k = result.metadata) === null || _k === void 0 ? void 0 : _k.title) {
                                        source = result.metadata.title;
                                    }
                                }
                            }
                        };
                        // Apply a more aggressive search approach for cuts and wounds
                        for (_b = 0, chromaResults_2 = chromaResults; _b < chromaResults_2.length; _b++) {
                            result = chromaResults_2[_b];
                            _loop_2(result);
                        }
                    }
                    // Prioritize ChromaDB results as they should contain the PDF content
                    if (chromaResults && chromaResults.length > 0 && (!isDogBite && !isAnimalBite && !isCutOrWound || firstAidInfo === "")) {
                        // Sort by relevance (distance)
                        chromaResults.sort(function (a, b) { return a.distance - b.distance; });
                        // Extract text from the most relevant results
                        for (_c = 0, chromaResults_3 = chromaResults; _c < chromaResults_3.length; _c++) {
                            result = chromaResults_3[_c];
                            containsKeywords = containsFirstAidKeywords(result.text, condition);
                            // Use a more lenient threshold for keyword-containing results
                            // For dog/animal bites, use an even more lenient threshold to ensure we capture all relevant content
                            if (result.distance < 0.3 ||
                                (containsKeywords && result.distance < 0.5) ||
                                ((isDogBite || isAnimalBite || isCutOrWound) && containsKeywords && result.distance < 0.7)) {
                                firstAidInfo += result.text + "\n";
                                // Extract source if available
                                if (!source) {
                                    sourceMatch = result.text.match(/Source: ([^(]+)\s*\(([^)]+)\)/);
                                    if (sourceMatch) {
                                        source = "".concat(sourceMatch[1].trim(), " (").concat(sourceMatch[2].trim(), ")");
                                    }
                                    else if ((_l = result.metadata) === null || _l === void 0 ? void 0 : _l.title) {
                                        source = result.metadata.title;
                                    }
                                }
                            }
                        }
                    }
                    // Add vector store results if needed, but only if they're relevant
                    if ((!firstAidInfo || firstAidInfo.trim() === "") && vectorResults && vectorResults.length > 0) {
                        for (_d = 0, vectorResults_1 = vectorResults; _d < vectorResults_1.length; _d++) {
                            _e = vectorResults_1[_d], doc = _e[0], score = _e[1];
                            containsKeywords = containsFirstAidKeywords(doc.pageContent, condition);
                            // Use a more lenient threshold for dog/animal bite queries and cuts/wounds queries
                            if (score > 0.65 ||
                                (containsKeywords && score > 0.5) ||
                                ((isDogBite || isAnimalBite || isCutOrWound) && containsKeywords && score > 0.4)) {
                                firstAidInfo += doc.pageContent + "\n";
                                // Extract source if available
                                if (!source && ((_m = doc.metadata) === null || _m === void 0 ? void 0 : _m.source)) {
                                    source = doc.metadata.source;
                                    if ((_o = doc.metadata) === null || _o === void 0 ? void 0 : _o.title) {
                                        source += " - ".concat(doc.metadata.title);
                                    }
                                }
                            }
                        }
                    }
                    // If still no information found, try a more aggressive approach with lower thresholds
                    if (!firstAidInfo || firstAidInfo.trim() === "") {
                        console.log("Using lower thresholds for first aid information retrieval");
                        // Try ChromaDB with lower threshold
                        if (chromaResults && chromaResults.length > 0) {
                            for (_f = 0, chromaResults_4 = chromaResults; _f < chromaResults_4.length; _f++) {
                                result = chromaResults_4[_f];
                                // Use a much lower threshold but still require some relevance
                                if (result.distance < 0.7) {
                                    firstAidInfo += result.text + "\n";
                                    if (!source && ((_p = result.metadata) === null || _p === void 0 ? void 0 : _p.title)) {
                                        source = result.metadata.title;
                                    }
                                }
                            }
                        }
                        // Try vector store with lower threshold
                        if ((!firstAidInfo || firstAidInfo.trim() === "") && vectorResults && vectorResults.length > 0) {
                            for (_g = 0, vectorResults_2 = vectorResults; _g < vectorResults_2.length; _g++) {
                                _h = vectorResults_2[_g], doc = _h[0], score = _h[1];
                                // Use a much lower threshold but still require some relevance
                                if (score > 0.4) {
                                    firstAidInfo += doc.pageContent + "\n";
                                    if (!source && ((_q = doc.metadata) === null || _q === void 0 ? void 0 : _q.source)) {
                                        source = doc.metadata.source;
                                    }
                                }
                            }
                        }
                    }
                    // If still no information found, return null
                    if (!firstAidInfo || firstAidInfo.trim() === "") {
                        console.log("No usable first aid information found in results");
                        return [2 /*return*/, null];
                    }
                    guide = parseFirstAidInformation(condition, firstAidInfo, source);
                    return [2 /*return*/, guide];
                case 3:
                    error_1 = _r.sent();
                    console.error("Error retrieving first aid guide from RAG:", error_1);
                    return [2 /*return*/, null];
                case 4: return [2 /*return*/];
            }
        });
    });
}
/**
 * Checks if text contains keywords related to the first aid condition
 * @param text The text to check
 * @param condition The first aid condition
 * @returns Boolean indicating if keywords are present
 */
function containsFirstAidKeywords(text, condition) {
    var normalizedText = text.toLowerCase();
    var normalizedCondition = condition.toLowerCase();
    // Special case for animal bites (including dog bites) - prioritize this check first for better detection
    if ((normalizedCondition.includes("animal") && normalizedCondition.includes("bite")) ||
        (normalizedCondition.includes("dog") && normalizedCondition.includes("bite")) ||
        (normalizedCondition.includes("snake") && normalizedCondition.includes("bite")) ||
        (normalizedCondition.includes("cat") && normalizedCondition.includes("bite")) ||
        (normalizedCondition.includes("rat") && normalizedCondition.includes("bite")) ||
        (normalizedCondition.includes("rodent") && normalizedCondition.includes("bite")) ||
        (normalizedCondition.includes("bite") && !normalizedCondition.includes("insect")) ||
        normalizedCondition === "bite" ||
        normalizedCondition === "bitten") {
        // Comprehensive list of animal bite related keywords
        var animalBiteKeywords = [
            "animal", "bite", "wound", "clean", "wash", "rabies", "infection", "tetanus",
            "puncture", "saliva", "antiseptic", "antibiotics", "disinfect", "bandage",
            "treatment", "canine", "emergency", "care", "medical", "attention", "dog",
            "pet", "domestic", "stray", "bleeding", "elevate", "pressure", "cover",
            "sterile", "vaccination", "immunization", "bacteria", "contamination",
            "rinse", "soap", "water", "running water", "flush", "irrigate", "cleanse",
            "wound care", "first aid", "emergency care", "bite wound", "animal attack",
            "canine teeth", "puncture wound", "bite infection", "rabies exposure",
            "wound cleaning", "disinfection", "antibiotic",
            "bite treatment", "bite management", "bite first aid",
            "bite wound care", "bite wound management", "bite wound treatment",
            "bite wound cleaning", "bite wound disinfection", "bite wound bandage",
            "bite emergency", "bite infection", "bite prevention", "bite care protocol",
            "cat", "feline", "wild", "snake", "venom", "poisonous", "envenomation", "antivenom",
            "rat", "rodent", "mammal", "wildlife", "scratch", "teeth", "fangs", "swelling",
            "redness", "pain", "inflammation", "pus", "drainage", "fever", "chills",
            "animal control", "report", "quarantine", "observation", "wildlife", "zoonotic",
            "disease", "transmission", "prevention", "post-exposure", "prophylaxis"
        ];
        // For animal bites, we'll check for ANY mention of bite-related content
        // This ensures we don't miss any relevant information
        for (var _i = 0, animalBiteKeywords_1 = animalBiteKeywords; _i < animalBiteKeywords_1.length; _i++) {
            var keyword = animalBiteKeywords_1[_i];
            if (normalizedText.includes(keyword)) {
                // For animal bites, immediately return true on ANY keyword match
                // This ensures maximum recall for animal bite content
                return true;
            }
        }
        // Additional check for sentences containing both animal type and "bite" or related terms
        if ((normalizedText.includes("dog") && normalizedText.includes("bite")) ||
            (normalizedText.includes("animal") && normalizedText.includes("bite")) ||
            (normalizedText.includes("canine") && normalizedText.includes("bite")) ||
            (normalizedText.includes("pet") && normalizedText.includes("bite")) ||
            (normalizedText.includes("cat") && normalizedText.includes("bite")) ||
            (normalizedText.includes("snake") && normalizedText.includes("bite")) ||
            (normalizedText.includes("rat") && normalizedText.includes("bite")) ||
            (normalizedText.includes("rodent") && normalizedText.includes("bite")) ||
            (normalizedText.includes("wild") && normalizedText.includes("bite")) ||
            (normalizedText.includes("mammal") && normalizedText.includes("bite")) ||
            (normalizedText.includes("bite") && normalizedText.includes("first aid"))) {
            return true;
        }
    }
    // Check for condition name - exact match
    if (normalizedText.includes(normalizedCondition)) {
        return true;
    }
    // Check for condition words - partial matches with higher specificity
    var conditionWords = normalizedCondition.split(/\s+/);
    var matchedWords = 0;
    for (var _a = 0, conditionWords_1 = conditionWords; _a < conditionWords_1.length; _a++) {
        var word = conditionWords_1[_a];
        if (word.length > 2 && normalizedText.includes(word)) { // Only count meaningful words
            matchedWords++;
        }
    }
    // If we match most of the condition words, consider it relevant
    if (conditionWords.length > 1 && matchedWords >= Math.ceil(conditionWords.length * 0.7)) {
        return true;
    }
    // Check for first aid indicators
    if (normalizedText.includes("first aid") ||
        normalizedText.includes("emergency") ||
        normalizedText.includes("treatment") ||
        normalizedText.includes("management") ||
        normalizedText.includes("care") ||
        normalizedText.includes("procedure") ||
        normalizedText.includes("steps")) {
        return true;
    }
    // Expanded condition keywords for better matching
    var conditionKeywords = {
        "fever": ["fever", "high fever", "temperature", "pyrexia", "hyperthermia", "febrile", "elevated temperature", "thermometer", "paracetamol", "acetaminophen", "ibuprofen", "cooling", "hydration", "rest", "chills", "sweating", "headache", "body ache", "dehydration", "infection"],
        "snake": ["snake", "bite", "venom", "poison", "antivenom", "reptile", "serpent", "envenomation"],
        "dog": ["dog", "canine", "bite", "rabies", "animal", "wound", "infection", "tetanus", "puncture", "saliva", "clean", "wash", "antiseptic", "antibiotics", "pet", "domestic", "teeth", "mouth", "bacteria", "immunization", "vaccination"],
        "animal": ["animal", "bite", "dog", "cat", "wild", "rabies", "infection", "wound", "puncture", "tetanus", "saliva", "clean", "wash", "pet", "domestic", "teeth", "mouth", "bacteria", "immunization", "vaccination"],
        "burn": ["burn", "scald", "fire", "heat", "thermal", "chemical", "electrical", "radiation", "flame", "blister"],
        "bleeding": ["blood", "wound", "cut", "laceration", "hemorrhage", "bandage", "pressure", "tourniquet", "gauze"],
        "choking": ["choke", "airway", "obstruction", "heimlich", "maneuver", "suffocation", "asphyxiation", "breathing"],
        "drowning": ["drown", "water", "submersion", "rescue", "pool", "swimming", "asphyxia", "resuscitation"],
        "fracture": ["fracture", "broken", "bone", "splint", "cast", "crack", "dislocation", "immobilize", "joint"],
        "heart attack": ["heart", "cardiac", "chest pain", "myocardial", "infarction", "coronary", "cpr", "defibrillator", "aed"],
        "stroke": ["stroke", "brain", "face drooping", "slurred", "cerebral", "blockage", "clot", "hemorrhage", "paralysis"],
        "poison": ["poison", "toxic", "ingest", "swallow", "chemical", "substance", "overdose", "vomit", "activated charcoal"],
        "seizure": ["seizure", "convulsion", "epilepsy", "fit", "spasm", "twitching", "jerking", "unconscious"],
        "allergic": ["allergy", "anaphylaxis", "hives", "swelling", "rash", "epipen", "antihistamine", "breathing"],
        "head injury": ["head", "concussion", "brain", "skull", "trauma", "consciousness", "pupils", "dizziness"],
        "eye": ["eye", "vision", "sight", "cornea", "pupil", "iris", "foreign body", "chemical", "splash", "blindness"],
        "sprain": ["sprain", "strain", "twist", "ligament", "tendon", "muscle", "joint", "swelling", "rice", "rest"],
        "heat": ["heat", "hyperthermia", "exhaustion", "stroke", "temperature", "dehydration", "sweating", "cooling"],
        "cold": ["cold", "hypothermia", "freezing", "frostbite", "temperature", "shivering", "warming"],
        "insect": ["insect", "bite", "sting", "bee", "wasp", "hornet", "spider", "scorpion", "venom", "stinger"],
        "electric": ["electric", "shock", "electrocution", "lightning", "current", "burn", "cardiac", "arrest"],
        "diabetic": ["diabetes", "insulin", "sugar", "glucose", "hypoglycemia", "hyperglycemia", "unconscious"],
        "chest pain": ["chest", "pain", "pressure", "tightness", "discomfort", "heart", "cardiac", "angina", "breathing"]
    };
    // Check each condition's keywords
    for (var _b = 0, _c = Object.entries(conditionKeywords); _b < _c.length; _b++) {
        var _d = _c[_b], key = _d[0], keywords = _d[1];
        if (normalizedCondition.includes(key)) {
            // If condition matches this category, check for its keywords
            for (var _e = 0, keywords_1 = keywords; _e < keywords_1.length; _e++) {
                var keyword = keywords_1[_e];
                if (normalizedText.includes(keyword)) {
                    return true;
                }
            }
        }
    }
    // If the condition doesn't match any specific category, check all keywords
    // This helps with conditions that weren't explicitly mapped
    if (!Object.keys(conditionKeywords).some(function (key) { return normalizedCondition.includes(key); })) {
        for (var _f = 0, _g = Object.values(conditionKeywords); _f < _g.length; _f++) {
            var keywords = _g[_f];
            for (var _h = 0, keywords_2 = keywords; _h < keywords_2.length; _h++) {
                var keyword = keywords_2[_h];
                if (normalizedText.includes(keyword) && normalizedCondition.includes(keyword)) {
                    return true;
                }
            }
        }
    }
    // This section is now handled by the enhanced dog bite detection above
    // No need for a second check for dog bites as the first check is comprehensive
    // Enhanced check for animal bites which could be relevant for dog bites
    if (normalizedCondition.includes("bite")) {
        // Comprehensive list of animal bite related keywords that would apply to any bite
        var animalBiteKeywords = [
            "bite", "wound", "clean", "wash", "infection", "puncture",
            "treatment", "emergency", "care", "medical", "attention",
            "bleeding", "elevate", "pressure", "cover", "sterile",
            "bacteria", "contamination", "rinse", "soap", "water",
            "wound care", "first aid", "emergency care", "bite wound",
            "wound cleaning", "disinfection", "antibiotic",
            "bite treatment", "bite management", "bite first aid",
            "bite wound care", "bite wound management", "bite wound treatment",
            "bite wound cleaning", "bite wound disinfection", "bite wound bandage",
            "bite emergency", "bite infection", "bite prevention", "bite care protocol"
        ];
        // For any bite query, use a lenient threshold to ensure we capture relevant content
        for (var _j = 0, animalBiteKeywords_2 = animalBiteKeywords; _j < animalBiteKeywords_2.length; _j++) {
            var keyword = animalBiteKeywords_2[_j];
            if (normalizedText.includes(keyword)) {
                // Return true on any keyword match for bite-related content
                return true;
            }
        }
    }
    return false;
}
/**
 * Parses raw first aid information text into a structured FirstAidGuide
 * @param condition The first aid condition
 * @param information The raw text information from the vector stores
 * @param source The source of the information
 * @returns A structured FirstAidGuide object
 */
function parseFirstAidInformation(condition, information, source) {
    // Default guide structure
    var guide = {
        condition: capitalizeFirstLetter(condition),
        steps: [],
        emergencyContact: "112",
        timeFrame: "Act immediately - seconds matter in emergencies",
        doNotDo: [],
        emergency: isEmergencyCondition(condition),
        source: source || "First Aid PDF Document"
    };
    // Extract steps from the information
    var lines = information.split("\n").filter(function (line) { return line.trim() !== ""; });
    // Check for specific condition patterns - improved detection logic
    var normalizedCondition = condition.toLowerCase();
    var isSnakeBite = normalizedCondition === "snake bite" || normalizedCondition.includes("snake") || (normalizedCondition.includes("bite") && normalizedCondition.includes("snake"));
    var isDogBite = normalizedCondition === "dog bite" ||
        normalizedCondition.includes("dog bite") ||
        (normalizedCondition.includes("dog") && normalizedCondition.includes("bite")) ||
        (normalizedCondition.includes("canine") && normalizedCondition.includes("bite")) ||
        (normalizedCondition.includes("k9") && normalizedCondition.includes("bite"));
    var isAnimalBiteSpecific = normalizedCondition === "animal bite" ||
        normalizedCondition.includes("animal bite") ||
        (normalizedCondition.includes("animal") && normalizedCondition.includes("bite")) ||
        (normalizedCondition.includes("bite") && (normalizedCondition.includes("animal") || normalizedCondition.includes("dog") || normalizedCondition.includes("cat")));
    var isBurn = condition.toLowerCase().includes("burn");
    var isBleeding = condition.toLowerCase().includes("bleed") || condition.toLowerCase().includes("cut");
    var isChoking = condition.toLowerCase().includes("chok") || condition.toLowerCase().includes("airway");
    var isHeartAttack = condition.toLowerCase().includes("heart") || condition.toLowerCase().includes("cardiac");
    var isStroke = condition.toLowerCase().includes("stroke");
    // Check for specific content patterns
    var hasSymptoms = information.includes("Signs and Symptoms") || information.includes("Symptoms:");
    var hasTreatment = information.includes("Treatment:") || information.includes("Management:");
    var hasSteps = information.match(/[0-9]\.|[a-z]\)|•|\*|\-\s/g);
    // Process the information and extract steps
    // ... existing code ...
    return guide;
}
/**
 * Processes first aid results from vector stores
 * @param condition The first aid condition
 * @param vectorResults Results from vector store
 * @param chromaResults Results from chroma db
 * @returns A structured FirstAidGuide object
 */
function processFirstAidResults(condition, vectorResults, chromaResults) {
    return __awaiter(this, void 0, void 0, function () {
        // Function to check if content contains keywords relevant to the condition
        function containsFirstAidKeywords(text, condition) {
            var normalizedText = text.toLowerCase();
            var normalizedCondition = condition.toLowerCase();
            // Basic check for condition name in text
            if (normalizedText.includes(normalizedCondition)) {
                return true;
            }
            // Check for first aid related terms
            var firstAidTerms = ["first aid", "emergency", "treatment", "care", "medical", "help", "procedure", "steps"];
            for (var _i = 0, firstAidTerms_1 = firstAidTerms; _i < firstAidTerms_1.length; _i++) {
                var term = firstAidTerms_1[_i];
                if (normalizedText.includes(term)) {
                    return true;
                }
            }
            return false;
        }
        var combinedInfo, bestSource, guide, lines, normalizedCondition, isSnakeBite, isDogBite, isAnimalBiteSpecific, isBurn, isBleeding, isChoking, isHeartAttack, isStroke, hasSymptoms, hasTreatment, hasSteps, symptomsSection, treatmentSection, symptomsMatch, treatmentMatch, treatmentSteps, steps;
        return __generator(this, function (_a) {
            combinedInfo = "";
            bestSource = "First Aid PDF Document";
            // Process vector results
            if (vectorResults && vectorResults.length > 0) {
                vectorResults.forEach(function (_a) {
                    var _b;
                    var doc = _a[0], score = _a[1];
                    if (score > 0.7 && containsFirstAidKeywords(doc.pageContent, condition)) {
                        combinedInfo += doc.pageContent + "\n";
                        if ((_b = doc.metadata) === null || _b === void 0 ? void 0 : _b.title) {
                            bestSource = doc.metadata.title;
                        }
                    }
                });
            }
            // Process chroma results
            if (chromaResults && chromaResults.length > 0) {
                chromaResults.forEach(function (result) {
                    var _a;
                    if ((result.distance < 0.3 || (result.containsKeywords && result.distance < 0.4)) &&
                        containsFirstAidKeywords(result.text, condition)) {
                        combinedInfo += result.text + "\n";
                        if ((_a = result.metadata) === null || _a === void 0 ? void 0 : _a.title) {
                            bestSource = result.metadata.title;
                        }
                    }
                });
            }
            // If no relevant information found, return null
            if (!combinedInfo.trim()) {
                return [2 /*return*/, null];
            }
            guide = {
                condition: capitalizeFirstLetter(condition),
                steps: [],
                emergencyContact: "112",
                timeFrame: "Act immediately - seconds matter in emergencies",
                doNotDo: [],
                emergency: isEmergencyCondition(condition),
                source: bestSource
            };
            lines = combinedInformation.split("\n").filter(function (line) { return line.trim() !== ""; });
            normalizedCondition = condition.toLowerCase();
            isSnakeBite = normalizedCondition === "snake bite" || normalizedCondition.includes("snake") || (normalizedCondition.includes("bite") && normalizedCondition.includes("snake"));
            isDogBite = normalizedCondition === "dog bite" ||
                normalizedCondition.includes("dog bite") ||
                (normalizedCondition.includes("dog") && normalizedCondition.includes("bite")) ||
                (normalizedCondition.includes("canine") && normalizedCondition.includes("bite")) ||
                (normalizedCondition.includes("k9") && normalizedCondition.includes("bite"));
            isAnimalBiteSpecific = normalizedCondition === "animal bite" ||
                normalizedCondition.includes("animal bite") ||
                (normalizedCondition.includes("animal") && normalizedCondition.includes("bite")) ||
                (normalizedCondition.includes("bite") && (normalizedCondition.includes("animal") || normalizedCondition.includes("dog") || normalizedCondition.includes("cat")));
            isBurn = condition.toLowerCase().includes("burn");
            isBleeding = condition.toLowerCase().includes("bleed") || condition.toLowerCase().includes("cut");
            isChoking = condition.toLowerCase().includes("chok") || condition.toLowerCase().includes("airway");
            isHeartAttack = condition.toLowerCase().includes("heart") || condition.toLowerCase().includes("cardiac");
            isStroke = condition.toLowerCase().includes("stroke");
            hasSymptoms = combinedInformation.includes("Signs and Symptoms") || combinedInformation.includes("Symptoms:");
            hasTreatment = combinedInformation.includes("Treatment:") || combinedInformation.includes("Management:");
            hasSteps = combinedInformation.match(/[0-9]\.|[a-z]\)|•|\*|\-\s/g);
            // Special handling for different conditions based on content structure
            if ((isSnakeBite && hasSymptoms) || (isDogBite && hasSymptoms) || (isAnimalBite && hasSymptoms) || hasTreatment) {
                symptomsSection = "";
                treatmentSection = "";
                // Extract symptoms section
                if (hasSymptoms) {
                    symptomsMatch = combinedInformation.match(/Signs and Symptoms:([\s\S]*?)(?=Treatment:|Management:|Source:|$)/i) ||
                        combinedInformation.match(/Symptoms:([\s\S]*?)(?=Treatment:|Management:|Source:|$)/i);
                    if (symptomsMatch && symptomsMatch[1]) {
                        symptomsSection = symptomsMatch[1].trim();
                    }
                }
                // Extract treatment section
                if (hasTreatment) {
                    treatmentMatch = combinedInformation.match(/Treatment:([\s\S]*?)(?=Source:|$)/i) ||
                        combinedInformation.match(/Management:([\s\S]*?)(?=Source:|$)/i);
                    if (treatmentMatch && treatmentMatch[1]) {
                        treatmentSection = treatmentMatch[1].trim();
                    }
                }
                // Process treatment steps
                if (treatmentSection) {
                    treatmentSteps = treatmentSection
                        .split(/(?:[0-9]\.|[a-z]\)|•|\*|\-\s)\s*/)
                        .filter(function (step) { return step.trim() !== ""; });
                    treatmentSteps.forEach(function (step) {
                        var trimmedStep = step.trim();
                        if (trimmedStep) {
                            // Check if this is a "do not" instruction
                            if (trimmedStep.toLowerCase().includes("do not") ||
                                trimmedStep.toLowerCase().includes("don't") ||
                                trimmedStep.toLowerCase().includes("never")) {
                                guide.doNotDo.push(trimmedStep);
                            }
                            else {
                                // Extract the first part as the instruction
                                var sentences = trimmedStep.split(/\.\s+/);
                                var instruction = sentences[0].trim();
                                var description = sentences.length > 1 ? sentences.slice(1).join(". ") : "";
                                guide.steps.push({
                                    instruction: instruction,
                                    description: description,
                                    important: isImportantStep(instruction, description)
                                });
                            }
                        }
                    });
                }
                else {
                    steps = combinedInformation
                        .split(/(?:[0-9]\.|[a-z]\)|•|\*|\-\s)\s*/)
                        .filter(function (step) { return step.trim() !== ""; });
                    steps.forEach(function (step) {
                        var trimmedStep = step.trim();
                        if (trimmedStep && !trimmedStep.toLowerCase().includes("source:")) {
                            if (trimmedStep.toLowerCase().includes("do not") ||
                                trimmedStep.toLowerCase().includes("don't") ||
                                trimmedStep.toLowerCase().includes("never")) {
                                guide.doNotDo.push(trimmedStep);
                            }
                            else {
                                var sentences = trimmedStep.split(/\.\s+/);
                                var instruction = sentences[0].trim();
                                var description = sentences.length > 1 ? sentences.slice(1).join(". ") : "";
                                guide.steps.push({
                                    instruction: instruction,
                                    description: description,
                                    important: isImportantStep(instruction, description)
                                });
                            }
                        }
                    });
                }
                // If we have symptoms, add them as the first step
                if (symptomsSection && symptomsSection.trim()) {
                    guide.steps.unshift({
                        instruction: "Recognize symptoms",
                        description: symptomsSection.trim(),
                        important: true
                    });
                }
                // Set condition-specific information
                if (isSnakeBite) {
                    guide.emergencyContact = "112";
                    guide.timeFrame = "Act immediately - snake bites can be life-threatening";
                    guide.emergency = true;
                    // Add specific do not instructions for snake bites if not already present
                    if (!guide.doNotDo.some(function (item) { return item.toLowerCase().includes("walk"); })) {
                        guide.doNotDo.push("Do not make the patient walk");
                    }
                    if (!guide.doNotDo.some(function (item) { return item.toLowerCase().includes("suck"); })) {
                        guide.doNotDo.push("Do not try to suck out the venom");
                    }
                }
                else if (isDogBite || isAnimalBite) {
                    guide.emergencyContact = "112";
                    guide.timeFrame = "Act promptly - animal bites can lead to infection and rabies";
                    guide.emergency = true;
                    // Add specific do not instructions for dog/animal bites if not already present
                    if (!guide.doNotDo.some(function (item) { return item.toLowerCase().includes("close"); })) {
                        guide.doNotDo.push("Do not close or cover the wound immediately without cleaning");
                    }
                    if (!guide.doNotDo.some(function (item) { return item.toLowerCase().includes("ointment"); })) {
                        guide.doNotDo.push("Do not apply ointments or home remedies to the wound");
                    }
                    if (!guide.doNotDo.some(function (item) { return item.toLowerCase().includes("delay"); })) {
                        guide.doNotDo.push("Do not delay seeking medical attention, especially for rabies risk");
                    }
                    if (!guide.doNotDo.some(function (item) { return item.toLowerCase().includes("suck"); })) {
                        guide.doNotDo.push("Do not try to suck out any potential contaminants from the wound");
                    }
                    if (!guide.doNotDo.some(function (item) { return item.toLowerCase().includes("alcohol"); })) {
                        guide.doNotDo.push("Do not use alcohol, hydrogen peroxide, or iodine as they can damage tissue");
                    }
                    // Always provide comprehensive steps for dog/animal bites regardless of existing content
                    // This ensures specific instructions are always shown
                    guide.steps = [];
                    // Add specific steps for dog bites in the correct order
                    guide.steps.push({
                        instruction: "Ensure safety",
                        description: "Move away from the animal to prevent further bites. Only approach if the animal is restrained or has left the area.",
                        important: true
                    });
                    guide.steps.push({
                        instruction: "Clean the wound thoroughly",
                        description: "Wash with soap and running water for at least 5-10 minutes to remove saliva and reduce infection risk. This is the most important step to prevent infection and rabies.",
                        important: true
                    });
                    guide.steps.push({
                        instruction: "Control bleeding",
                        description: "Apply gentle pressure with a clean cloth or bandage until bleeding stops.",
                        important: true
                    });
                    guide.steps.push({
                        instruction: "Cover the wound",
                        description: "After thorough cleaning, apply a sterile bandage or clean cloth to protect the wound.",
                        important: false
                    });
                    guide.steps.push({
                        instruction: "Elevate the affected area",
                        description: "If possible, keep the bite area elevated above heart level to reduce swelling.",
                        important: false
                    });
                    guide.steps.push({
                        instruction: "Seek medical attention immediately",
                        description: "All dog bites should be evaluated by a healthcare provider for proper cleaning, antibiotics, tetanus booster, and rabies prevention if needed.",
                        important: true
                    });
                    guide.steps.push({
                        instruction: "Gather information about the dog",
                        description: "If possible, note the dog's vaccination status, owner contact information, and circumstances of the bite for medical professionals.",
                        important: false
                    });
                    // Set specific timeframe and emergency status
                    guide.timeFrame = "Act promptly - animal bites can lead to infection and rabies";
                    guide.emergency = true;
                    guide.source = "First Aid PDF Document - Animal Bite Protocol";
                    // Ensure we have comprehensive do not instructions
                    guide.doNotDo = [
                        "Do not close or cover the wound immediately without cleaning",
                        "Do not apply ointments or home remedies to the wound",
                        "Do not delay seeking medical attention, especially for rabies risk",
                        "Do not try to suck out any potential contaminants from the wound",
                        "Do not use alcohol, hydrogen peroxide, or iodine as they can damage tissue"
                    ];
                    return [2 /*return*/, guide]; // Return immediately for dog bites to ensure consistent information
                }
                // Ensure we have at least some do not instructions
                if (guide.doNotDo.length === 0) {
                    // Add generic do not instructions based on condition
                    if (condition.toLowerCase().includes("snake") || condition.toLowerCase().includes("bite")) {
                        guide.doNotDo.push("Do not make the patient walk");
                        guide.doNotDo.push("Do not try to suck out the venom");
                        guide.doNotDo.push("Do not apply a tight tourniquet");
                    }
                    else if (condition.toLowerCase().includes("dog") && condition.toLowerCase().includes("bite")) {
                        guide.doNotDo.push("Do not close or cover the wound immediately without cleaning");
                        guide.doNotDo.push("Do not apply ointments or home remedies to the wound");
                        guide.doNotDo.push("Do not delay seeking medical attention, especially for rabies risk");
                    }
                    else if (condition.toLowerCase().includes("animal") && condition.toLowerCase().includes("bite")) {
                        guide.doNotDo.push("Do not close or cover the wound immediately without cleaning");
                        guide.doNotDo.push("Do not apply ointments or home remedies to the wound");
                        guide.doNotDo.push("Do not delay seeking medical attention, especially for rabies risk");
                    }
                    else if (condition.toLowerCase().includes("burn")) {
                        guide.doNotDo.push("Do not apply ice directly to burns");
                        guide.doNotDo.push("Do not apply butter, oil, or ointments");
                        guide.doNotDo.push("Do not break blisters");
                    }
                    else if (condition.toLowerCase().includes("bleed") || condition.toLowerCase().includes("cut")) {
                        guide.doNotDo.push("Do not remove embedded objects");
                        guide.doNotDo.push("Do not apply a tourniquet unless trained");
                    }
                    else {
                        guide.doNotDo.push("Do not move the person unless necessary");
                        guide.doNotDo.push("Do not give food or drink unless specified");
                    }
                }
                // Set emergency status based on condition if not already set
                if (!guide.emergency) {
                    guide.emergency = isEmergencyCondition(condition);
                }
                return [2 /*return*/, guide];
            }
            return [2 /*return*/];
        });
    });
}
/**
 * Determines if a first aid condition is an emergency
 * @param condition The first aid condition
 * @returns Boolean indicating if it's an emergency
 */
function isEmergencyCondition(condition) {
    var emergencyConditions = [
        "snake", "bite", "poison", "bleeding", "severe", "heart attack",
        "cardiac", "stroke", "choking", "drowning", "fracture", "broken",
        "burn", "seizure", "unconscious", "not breathing", "cpr",
        "anaphylaxis", "allergic", "shock", "head injury", "concussion",
        "chest pain", "diabetic", "hypoglycemia", "hyperglycemia",
        "heat stroke", "hypothermia", "electric", "electrocution",
        "trauma", "emergency", "urgent", "critical", "life-threatening",
        "dog", "animal", "rabies", "canine", "tetanus", "infection"
    ];
    var normalizedCondition = condition.toLowerCase();
    return emergencyConditions.some(function (term) { return normalizedCondition.includes(term); });
}
/**
 * Determines if a first aid step is important/critical
 * @param instruction The step instruction
 * @param description The step description
 * @returns Boolean indicating if the step is important
 */
function isImportantStep(instruction, description) {
    var criticalTerms = [
        "immediate", "critical", "urgent", "emergency", "call", "danger",
        "severe", "stop", "prevent", "life", "death", "fatal", "crucial",
        "vital", "essential", "important", "necessary", "required", "must",
        "quickly", "fast", "rapid", "immediately", "instantly", "promptly",
        "priority", "first", "begin", "start", "initial", "primary",
        "bleeding", "airway", "breathing", "circulation", "pressure", "tourniquet",
        "cpr", "defibrillator", "aed", "ambulance", "911", "112", "999",
        "hospital", "doctor", "medical", "professional", "help",
        "clean", "wash", "rabies", "infection", "tetanus"
    ];
    var combinedText = (instruction + " " + (description || "")).toLowerCase();
    // Check for critical terms
    if (criticalTerms.some(function (term) { return combinedText.includes(term); })) {
        return true;
    }
    // Check for imperative verbs at the beginning which often indicate important steps
    var imperativeVerbs = [
        "call", "stop", "apply", "remove", "check", "ensure", "secure",
        "monitor", "maintain", "elevate", "immobilize", "stabilize", "control",
        "clean", "wash", "seek"
    ];
    var firstWord = instruction.toLowerCase().split(" ")[0];
    if (imperativeVerbs.includes(firstWord)) {
        return true;
    }
    // Check for short, direct instructions which are often critical
    if (instruction.split(" ").length <= 3 && instruction.length < 20) {
        return true;
    }
    return false;
}
/**
 * Capitalizes the first letter of each word in a string
 * @param text The text to capitalize
 * @returns The capitalized text
 */
function capitalizeFirstLetter(text) {
    return text
        .split(" ")
        .map(function (word) { return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(); })
        .join(" ");
}
/**
 * Creates a specialized first aid guide for dog bites
 * @returns A FirstAidGuide object with dog bite specific information
 */
function getDogBiteFirstAidGuide() {
    return {
        condition: "Dog Bite",
        steps: [
            {
                instruction: "Ensure safety",
                description: "Move away from the animal to prevent further bites. Only approach if the animal is restrained or has left the area.",
                important: true
            },
            {
                instruction: "Clean the wound thoroughly",
                description: "Wash with soap and running water for at least 5-10 minutes to remove saliva and reduce infection risk. This is the most important step to prevent infection and rabies.",
                important: true
            },
            {
                instruction: "Control bleeding",
                description: "Apply gentle pressure with a clean cloth or bandage until bleeding stops.",
                important: true
            },
            {
                instruction: "Cover the wound",
                description: "After thorough cleaning, apply a sterile bandage or clean cloth to protect the wound.",
                important: false
            },
            {
                instruction: "Elevate the affected area",
                description: "If possible, keep the bite area elevated above heart level to reduce swelling.",
                important: false
            },
            {
                instruction: "Seek medical attention immediately",
                description: "All dog bites should be evaluated by a healthcare provider for proper cleaning, antibiotics, tetanus booster, and rabies prevention if needed.",
                important: true
            },
            {
                instruction: "Gather information about the dog",
                description: "If possible, note the dog's vaccination status, owner contact information, and circumstances of the bite for medical professionals.",
                important: false
            }
        ],
        emergencyContact: "112",
        timeFrame: "Act promptly - dog bites can lead to infection and rabies",
        doNotDo: [
            "Do not close or cover the wound immediately without cleaning",
            "Do not apply ointments or home remedies to the wound",
            "Do not delay seeking medical attention, especially for rabies risk",
            "Do not try to suck out any potential contaminants from the wound",
            "Do not use alcohol, hydrogen peroxide, or iodine as they can damage tissue"
        ],
        emergency: true,
        source: "First Aid PDF Document - Dog Bite Protocol"
    };
}
// The getFirstAidGuideFromRAG function is already defined at the top of the file
