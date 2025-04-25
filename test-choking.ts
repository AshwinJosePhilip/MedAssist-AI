// Test script for choking detection in firstaidRAG.ts

import { getFirstAidGuideFromRAG } from './src/lib/firstaidRAG';

async function testChokingDetection() {
  console.log('Testing choking detection...');
  
  try {
    // Test with direct 'choking' query
    const result1 = await getFirstAidGuideFromRAG('choking');
    console.log('\nTest 1: Direct "choking" query');
    console.log('Detected condition:', result1?.condition);
    console.log('Is emergency:', result1?.emergency);
    console.log('Number of steps:', result1?.steps?.length);
    
    // Test with 'general first aid' query (should now detect choking)
    const result2 = await getFirstAidGuideFromRAG('general first aid');
    console.log('\nTest 2: "general first aid" query');
    console.log('Detected condition:', result2?.condition);
    console.log('Is emergency:', result2?.emergency);
    console.log('Number of steps:', result2?.steps?.length);
    
    // Test with 'heimlich maneuver' query
    const result3 = await getFirstAidGuideFromRAG('heimlich maneuver');
    console.log('\nTest 3: "heimlich maneuver" query');
    console.log('Detected condition:', result3?.condition);
    console.log('Is emergency:', result3?.emergency);
    console.log('Number of steps:', result3?.steps?.length);
  } catch (error) {
    console.error('Error testing choking detection:', error);
  }
}

// Run the test
testChokingDetection();