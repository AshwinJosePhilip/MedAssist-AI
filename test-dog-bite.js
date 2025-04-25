// Test script for dog bite first aid functionality
const { getFirstAidGuide } = require('./src/lib/firstaid');

async function testDogBite() {
  try {
    console.log('Testing dog bite first aid...');
    const result = await getFirstAidGuide('dog bite');
    console.log(JSON.stringify(result, null, 2));
    
    // Also test with a general first aid query for comparison
    console.log('\nTesting general first aid...');
    const generalResult = await getFirstAidGuide('first aid');
    console.log(JSON.stringify(generalResult, null, 2));
    
    // Test with a variation of dog bite query
    console.log('\nTesting variation: "bitten by a dog"...');
    const variationResult = await getFirstAidGuide('bitten by a dog');
    console.log(JSON.stringify(variationResult, null, 2));
    
    // Verify that dog bite queries return the specific dog bite guide
    if (result.condition === "Dog Bite" && 
        variationResult.condition === "Dog Bite" && 
        generalResult.condition === "General First Aid") {
      console.log('\n✅ SUCCESS: Dog bite detection is working correctly!');
    } else {
      console.log('\n❌ FAILURE: Dog bite detection is not working as expected.');
    }
  } catch (error) {
    console.error('Error testing dog bite first aid:', error);
  }
}

testDogBite();