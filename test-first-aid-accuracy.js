// First Aid Accuracy Test Script
// Note: This test script is designed to work with the compiled JavaScript files
// To run this test, first compile the TypeScript files with 'npm run build'

// Import the functions from the compiled JavaScript files
import { getFirstAidGuide } from "./src/lib/firstaid.js";
import { processFirstAidPdf } from "./src/lib/pdfProcessor.js";

// Ensure the imports work correctly
try {
  console.log("Imported modules successfully");
} catch (error) {
  console.error("Error importing modules:", error);
}

// List of first aid conditions to test
const testConditions = [
  "snake bite",
  "bleeding",
  "burn",
  "choking",
  "drowning",
  "fracture",
  "heart attack",
  "stroke",
  "poisoning",
  "electric shock",
  "heat stroke",
  "scorpion sting",
  "shock",
  // Additional conditions that might not be in the PDF
  "dog bite",
  "high fever",
  "sprain",
  "insect sting",
  "frostbite",
  "seizure",
  "allergic reaction",
  "head injury"
];

// Expected keywords for each condition
const expectedKeywords = {
  "snake bite": ["bite", "venom", "tourniquet", "hospital"],
  "bleeding": ["pressure", "bandage", "elevate"],
  "burn": ["cool", "water", "cover", "clothing"],
  "choking": ["heimlich", "cough", "breathe"],
  "drowning": ["water", "cpr", "breathing"],
  "fracture": ["immobilize", "splint", "bone"],
  "heart attack": ["chest", "pain", "aspirin"],
  "stroke": ["FAST", "face", "arm", "speech"],
  "shock": ["emergency", "lay down", "elevate legs", "warm", "monitor"],
  "poisoning": ["poison", "vomit", "control"],
  "electric shock": ["electricity", "source", "burn"],
  "heat stroke": ["cool", "water", "temperature"],
  "scorpion sting": ["clean", "compress", "pain"],
  "dog bite": ["clean", "rabies", "wound"],
  "high fever": ["temperature", "cool", "fluids"],
  "sprain": ["ice", "compress", "elevate"],
  "insect sting": ["stinger", "allergic", "swelling"],
  "frostbite": ["warm", "cold", "skin"],
  "seizure": ["protect", "side", "airway"],
  "allergic reaction": ["allergen", "swelling", "breathing"],
  "head injury": ["concussion", "consciousness", "bleeding"]
};

// Function to check if guide contains expected keywords
function checkAccuracy(guide, condition) {
  if (!guide) {
    return {
      condition,
      found: false,
      accuracy: 0,
      missingKeywords: expectedKeywords[condition] || [],
      message: "No guide found"
    };
  }

  const keywords = expectedKeywords[condition] || [];
  const foundKeywords = [];
  const missingKeywords = [];
  
  // Convert guide to string for easier searching
  const guideText = JSON.stringify(guide).toLowerCase();
  
  // Check for each expected keyword
  keywords.forEach(keyword => {
    if (guideText.includes(keyword.toLowerCase())) {
      foundKeywords.push(keyword);
    } else {
      missingKeywords.push(keyword);
    }
  });
  
  const accuracy = keywords.length > 0 ? foundKeywords.length / keywords.length : 0;
  
  return {
    condition,
    found: true,
    accuracy: accuracy,
    foundKeywords,
    missingKeywords,
    message: accuracy >= 0.7 ? "Good accuracy" : "Poor accuracy",
    emergency: guide.emergency,
    stepCount: guide.steps.length,
    source: guide.source
  };
}

// Main test function
async function testFirstAidAccuracy() {
  console.log("Starting First Aid Accuracy Test...");
  console.log("==================================");
  
  // Ensure PDF is processed
  console.log("Processing First Aid PDF...");
  await processFirstAidPdf();
  
  const results = [];
  let totalAccuracy = 0;
  let conditionsFound = 0;
  
  // Test each condition
  for (const condition of testConditions) {
    console.log(`Testing condition: ${condition}`);
    try {
      const guide = await getFirstAidGuide(condition);
      const result = checkAccuracy(guide, condition);
      
      if (result.found) {
        conditionsFound++;
        totalAccuracy += result.accuracy;
      }
      
      results.push(result);
      
      // Print result
      console.log(`  Found: ${result.found}`); 
      console.log(`  Accuracy: ${Math.round(result.accuracy * 100)}%`);
      console.log(`  Found keywords: ${result.foundKeywords.join(", ")}`);
      console.log(`  Missing keywords: ${result.missingKeywords.join(", ")}`);
      if (result.found) {
        console.log(`  Emergency: ${guide.emergency}`); 
        console.log(`  Steps: ${guide.steps.length}`);
        console.log(`  Source: ${guide.source}`);
      }
      console.log("----------------------------------");
      
    } catch (error) {
      console.error(`Error testing ${condition}:`, error);
      results.push({
        condition,
        found: false,
        accuracy: 0,
        error: error.message
      });
    }
  }
  
  // Calculate overall statistics
  const overallAccuracy = conditionsFound > 0 ? totalAccuracy / conditionsFound : 0;
  const coverageRate = conditionsFound / testConditions.length;
  
  console.log("==================================");
  console.log("First Aid Accuracy Test Results");
  console.log("==================================");
  console.log(`Conditions tested: ${testConditions.length}`);
  console.log(`Conditions found: ${conditionsFound} (${Math.round(coverageRate * 100)}% coverage)`);
  console.log(`Overall accuracy: ${Math.round(overallAccuracy * 100)}%`);
  
  // Identify conditions with poor accuracy
  const poorAccuracyConditions = results
    .filter(r => r.found && r.accuracy < 0.7)
    .map(r => r.condition);
  
  if (poorAccuracyConditions.length > 0) {
    console.log("\nConditions with poor accuracy:");
    console.log(poorAccuracyConditions.join(", "));
  }
  
  // Identify conditions not found
  const notFoundConditions = results
    .filter(r => !r.found)
    .map(r => r.condition);
  
  if (notFoundConditions.length > 0) {
    console.log("\nConditions not found:");
    console.log(notFoundConditions.join(", "));
  }
  
  return {
    results,
    overallAccuracy,
    coverageRate,
    conditionsFound,
    totalConditions: testConditions.length
  };
}

// Run the test
testFirstAidAccuracy()
  .then(() => {
    console.log("Test completed.");
    process.exit(0);
  })
  .catch(error => {
    console.error("Test failed:", error);
    process.exit(1);
  });