// ES Module version of the snake bite test
import { getFirstAidGuide } from './src/lib/firstaid.js';

async function testSnakeBite() {
  try {
    console.log('Testing snake bite first aid guide...');
    const guide = await getFirstAidGuide('snake bite');
    console.log(JSON.stringify(guide, null, 2));
    console.log('Test completed successfully!');
  } catch (error) {
    console.error('Error:', error);
  }
}

testSnakeBite();