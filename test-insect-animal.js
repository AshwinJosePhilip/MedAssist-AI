// Test script for insect stings and animal bites first aid functionality
const { getFirstAidGuide } = require('./src/lib/firstaid');

async function testInsectAndAnimalFirstAid() {
  try {
    console.log('Testing insect sting first aid guide...');
    const insectResult = await getFirstAidGuide('insect sting');
    console.log(JSON.stringify(insectResult, null, 2));
    
    console.log('\nTesting animal bite first aid guide...');
    const animalResult = await getFirstAidGuide('animal bite');
    console.log(JSON.stringify(animalResult, null, 2));
    
    // Test with variations of the queries
    console.log('\nTesting variation: "bee sting"...');
    const beeResult = await getFirstAidGuide('bee sting');
    console.log(JSON.stringify(beeResult, null, 2));
    
    console.log('\nTesting variation: "bitten by an animal"...');
    const bittenResult = await getFirstAidGuide('bitten by an animal');
    console.log(JSON.stringify(bittenResult, null, 2));
    
    // Verify that the queries return the specific guides
    if (insectResult.condition === "Insect Sting" && 
        beeResult.condition === "Insect Sting" && 
        animalResult.condition === "Animal Bite" &&
        bittenResult.condition === "Animal Bite") {
      console.log('\n✅ SUCCESS: Insect sting and animal bite detection is working correctly!');
    } else {
      console.log('\n❌ FAILURE: Insect sting and animal bite detection is not working as expected.');
    }
  } catch (error) {
    console.error('Error testing insect sting and animal bite first aid:', error);
  }
}

testInsectAndAnimalFirstAid();