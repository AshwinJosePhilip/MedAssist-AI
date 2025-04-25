// TypeScript test script using ts-node
// Run with: npx ts-node test-snake-ts.js

import { getFirstAidGuide } from './src/lib/firstaid.ts';

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