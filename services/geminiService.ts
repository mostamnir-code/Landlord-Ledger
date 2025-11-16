import { GoogleGenAI } from "@google/genai";
import type { Property, Transaction, Tenant } from '../types';

if (!process.env.API_KEY) {
  console.warn("API_KEY environment variable not set. AI Assistant will not work.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

export const getFinancialInsight = async (
  query: string, 
  properties: Property[], 
  transactions: Transaction[],
  tenants: Tenant[]
): Promise<string> => {
  if (!process.env.API_KEY) {
    return "API key is not configured. Please set the API_KEY environment variable.";
  }

  const model = 'gemini-2.5-flash';
  
  const dataContext = JSON.stringify({ properties, transactions, tenants }, null, 2);

  const systemInstruction = `You are an expert financial analyst for a small landlord. Your role is to analyze the provided JSON data about properties, transactions, and tenants and answer the user's questions. Provide clear, concise, and helpful insights. All calculations should be based *only* on the data provided. Today's date is ${new Date().toISOString().split('T')[0]}.`;

  const prompt = `
    Here is the landlord's data:
    \`\`\`json
    ${dataContext}
    \`\`\`

    Here is the landlord's question:
    "${query}"
  `;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
      }
    });
    return response.text;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    if (error instanceof Error) {
        return `An error occurred while analyzing your data: ${error.message}`;
    }
    return "An unknown error occurred while analyzing your data.";
  }
};
