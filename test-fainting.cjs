// Test script for fainting/syncope first aid responses
const { getFirstAidGuideFromRAG } = require('./src/lib/firstaidRAG');

async function testFaintingResponses() {
  console.log('Testing fainting/syncope first aid responses...');
  
  // Test different variations of fainting queries
  const queries = [
    'fainting',
    'fainted',
    'someone passed out',
    'syncope',
    'person collapsed',
    'loss of consciousness',
    'what to do if someone faints'
  ];
  
  for (const query of queries) {
    console.log(`\nTesting query: "${query}"`);
    const result = await getFirstAidGuideFromRAG(query);
    
    if (result) {
      console.log(`✅ Found first aid guide for: ${query}`);
      console.log(`Condition: ${result.condition}`);
      console.log(`Number of steps: ${result.steps.length}`);
      
      // Check for key elements in the response
      const hasPositioningInfo = result.steps.some(step => 
        step.instruction.toLowerCase().includes('position') || 
        step.description.toLowerCase().includes('elevate their legs'));
      
      const hasSafetyInfo = result.steps.some(step => 
        step.instruction.toLowerCase().includes('safety') || 
        step.description.toLowerCase().includes('prevent injury'));
      
      console.log(`Has positioning information: ${hasPositioningInfo ? '✅ Yes' : '❌ No'}`);
      console.log(`Has safety information: ${hasSafetyInfo ? '✅ Yes' : '❌ No'}`);
    } else {
      console.log(`❌ No first aid guide found for: ${query}`);
    }
  }
}

testFaintingResponses().catch(console.error);