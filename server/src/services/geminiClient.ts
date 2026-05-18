import { GoogleGenAI } from '@google/genai';
import { env } from '../env.js';

const ai = new GoogleGenAI({ apiKey: env.GEMINI_API_KEY });

export const geminiClient = {
  async complete(prompt: string): Promise<string> {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text ?? '';
  },
};
