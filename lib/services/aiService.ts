import 'dotenv/config';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Type definition for the AI analysis result
export interface AnalysisResult {
  category: 'MEDICAL' | 'FOOD' | 'RESCUE' | 'OTHER';
  urgency: number;
  summary: string;
}

// Fallback response when AI fails
const FALLBACK_RESPONSE: AnalysisResult = {
  category: 'OTHER',
  urgency: 5,
  summary: 'Uncategorized Incident',
};

/**
 * Analyze a disaster distress message using Google's Gemini AI.
 * 
 * @param text - The distress message to analyze
 * @returns AnalysisResult with category, urgency (1-10), and summary
 */
export async function analyzeRequest(text: string): Promise<AnalysisResult> {
  try {
    // Validate input
    if (!text || text.trim().length === 0) {
      console.warn('Empty text provided to analyzeRequest');
      return FALLBACK_RESPONSE;
    }

    // Check for API key
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error('GEMINI_API_KEY is not set in environment variables');
      return FALLBACK_RESPONSE;
    }

    // Initialize the Gemini API
    const genAI = new GoogleGenerativeAI(apiKey);
    // Using Gemini 2.5 Flash - fast and efficient
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    // Construct the prompt
    const prompt = `Analyze this disaster distress message: '${text}'.

Return ONLY raw JSON. No markdown backticks. No explanation. Just the JSON object.

Required format:
{
  "category": "MEDICAL" or "FOOD" or "RESCUE" or "OTHER",
  "urgency": integer from 1 to 10 (10 is critical/life-threatening),
  "summary": "string with max 5 words"
}

Return ONLY the JSON object above. No other text.`;

    // Generate content
    const result = await model.generateContent(prompt);
    const response = result.response;
    const textResponse = response.text();

    // Robust cleaning: Remove markdown code blocks if AI adds them
    let cleanedResponse = textResponse.trim();
    
    // Remove ```json and ``` markers
    cleanedResponse = cleanedResponse.replace(/```json/g, '');
    cleanedResponse = cleanedResponse.replace(/```/g, '');
    
    // Remove any leading/trailing whitespace again
    cleanedResponse = cleanedResponse.trim();

    // Parse the JSON response
    const parsed = JSON.parse(cleanedResponse) as AnalysisResult;

    // Validate the response structure
    if (!parsed.category || !parsed.urgency || !parsed.summary) {
      console.warn('Invalid response structure from AI:', parsed);
      return FALLBACK_RESPONSE;
    }

    // Validate category
    const validCategories = ['MEDICAL', 'FOOD', 'RESCUE', 'OTHER'];
    if (!validCategories.includes(parsed.category)) {
      console.warn(`Invalid category from AI: ${parsed.category}`);
      parsed.category = 'OTHER';
    }

    // Validate and clamp urgency to 1-10
    parsed.urgency = Math.max(1, Math.min(10, Math.floor(parsed.urgency)));

    // Truncate summary if too long
    if (parsed.summary.length > 50) {
      parsed.summary = parsed.summary.substring(0, 47) + '...';
    }

    return parsed;
  } catch (error) {
    console.error('Error analyzing request with AI:', error);
    
    // Log more details for debugging
    if (error instanceof Error) {
      console.error('Error details:', error.message);
    }
    
    return FALLBACK_RESPONSE;
  }
}

/**
 * Batch analyze multiple requests (useful for processing multiple messages)
 * 
 * @param texts - Array of distress messages to analyze
 * @returns Array of AnalysisResult objects
 */
export async function analyzeRequestsBatch(texts: string[]): Promise<AnalysisResult[]> {
  // Process all texts in parallel
  const promises = texts.map((text) => analyzeRequest(text));
  return Promise.all(promises);
}
