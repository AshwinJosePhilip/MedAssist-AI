// Test Low Blood Sugar Guide
const fs = require('fs');
const path = require('path');

// Read the firstaid.ts file directly
const firstaidContent = fs.readFileSync('./src/lib/firstaid.ts', 'utf8');

// Check if low blood sugar guide exists in the file
console.log('Checking for low blood sugar guide in firstaid.ts...');
const hasLowBloodSugar = firstaidContent.includes('low blood sugar');
console.log(`Low blood sugar guide exists: ${hasLowBloodSugar}`);

// Check for specific instructions that should be in the guide
const hasConsumeFastActingCarbs = firstaidContent.includes('Consume fast-acting carbohydrates');
console.log(`Guide includes fast-acting carbohydrates instruction: ${hasConsumeFastActingCarbs}`);

const hasEmergencyInfo = firstaidContent.includes('severe hypoglycemia can lead to unconsciousness');
console.log(`Guide includes emergency information: ${hasEmergencyInfo}`);

// Check firstaidRAG.ts for hypoglycemia keywords
const firstaidRAGContent = fs.readFileSync('./src/lib/firstaidRAG.ts', 'utf8');
const hasHypoglycemiaKeywords = firstaidRAGContent.includes('low blood sugar hypoglycemia glucose diabetes insulin');
console.log(`FirstaidRAG includes hypoglycemia keywords: ${hasHypoglycemiaKeywords}`);