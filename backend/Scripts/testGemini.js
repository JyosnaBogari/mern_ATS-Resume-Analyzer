import {
  testGeminiConnection
} from '../Services/aiService.js';

console.log('\n🧪 Testing Gemini API...\n');

const result =
  await testGeminiConnection();

if (result) {

  console.log(
    '\n✅ Gemini API Working\n'
  );

} else {

  console.log(
    '\n❌ Gemini API Failed\n'
  );
}