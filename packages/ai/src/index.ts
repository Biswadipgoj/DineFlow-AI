import { GoogleGenerativeAI } from '@google/generative-ai';

export { GoogleGenerativeAI };

export const GEMINI_MODEL = 'gemini-2.5-flash';

export function createGeminiClient(apiKey: string): GoogleGenerativeAI {
  return new GoogleGenerativeAI(apiKey);
}
