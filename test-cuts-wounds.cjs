// Test script for cuts and wounds first aid functionality
const { getFirstAidGuide } = require('./src/lib/firstaid');

async function testCutsAndWounds() {
  try {
    console.log('Testing cuts and wounds first aid...');
    const result = await getFirstAidGuide('cut');
    console.log(JSON.stringify(result, null, 2));
    
    // Also test with variations
    console.log('\nTesting variation: "wound"...');
    const woundResult = await getFirstAidGuide('wound');
    console.log(JSON.stringify(woundResult, null, 2));
    
    console.log('\nTesting variation: "bleeding"...');
    const bleedingResult = await getFirstAidGuide('bleeding');
    console.log(JSON.stringify(bleedingResult, null, 2));
    
    // Verify that cuts and wounds queries return the specific cuts and wounds guide
    if (result.condition === "Cuts and Wounds" && 
        woundResult.condition === "Cuts and Wounds" && 
        bleedingResult.condition === "Cuts and Wounds") {
      console.log('\n✅ SUCCESS: Cuts and wounds detection is working correctly!');
    } else {
      console.log('\n❌ FAILURE: Cuts and wounds detection is not working as expected.');
    }
  } catch (error) {
    console.error('Error testing cuts and wounds first aid:', error);
  }
}

testCutsAndWounds();