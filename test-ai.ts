import { analyzeRequest } from "./lib/services/aiService";

// Mock the environment variable if loading from .env fails in standalone script
if (!process.env.GEMINI_API_KEY) {
  // You can hardcode your key here TEMPORARILY for this test if .env isn't loading
  // process.env.GEMINI_API_KEY = "AIza..."; 
}

async function main() {
  console.log("🤖 Testing Gemini AI...");
  
  const text = "My grandmother is having chest pains and we are trapped on the second floor!";
  console.log(`Input: "${text}"`);
  
  const result = await analyzeRequest(text);
  
  console.log("-----------------------------");
  console.log("Output:", result);
  console.log("-----------------------------");
}

main();