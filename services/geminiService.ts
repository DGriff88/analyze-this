import { GoogleGenAI } from "@google/genai";
import type { GroundingChunk } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeText = async (prompt: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-pro',
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error analyzing text:", error);
    throw new Error("Failed to get response from Gemini API.");
  }
};

export const analyzeImage = async (prompt: string, imageBase64: string, mimeType: string): Promise<string> => {
  try {
    const imagePart = {
      inlineData: {
        data: imageBase64,
        mimeType: mimeType,
      },
    };
    const textPart = { text: prompt };

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: { parts: [imagePart, textPart] },
    });
    return response.text;
  } catch (error) {
    console.error("Error analyzing image:", error);
    throw new Error("Failed to get response from Gemini API for image analysis.");
  }
};

export const searchWeb = async (query: string): Promise<{ text: string, sources: GroundingChunk[] }> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: query,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const text = response.text;
    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    
    return { text, sources: sources as GroundingChunk[] };
  } catch (error) {
    console.error("Error with web search:", error);
    throw new Error("Failed to get response from Gemini API for web search.");
  }
};
