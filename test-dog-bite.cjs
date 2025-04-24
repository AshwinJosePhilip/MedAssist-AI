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
  } catch (error) {
    console.error('Error testing dog bite first aid:', error);
  }
}

testDogBite();