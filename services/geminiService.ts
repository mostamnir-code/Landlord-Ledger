
import { GoogleGenerativeAI } from "@google/generative-ai";
import type { Property, Transaction, Tenant, Unit } from '../types';

const apiKey = import.meta.env.VITE_API_KEY;

if (!apiKey) {
  console.warn("VITE_API_KEY environment variable not set. AI Assistant will not work.");
}

const genAI = new GoogleGenerativeAI(apiKey || "");

export const getFinancialInsight = async (
  query: string, 
  properties: Property[], 
  transactions: Transaction[],
  tenants: Tenant[],
  units: Unit[],
): Promise<string> => {
  if (!apiKey) {
    return "API key is not configured. Please set the VITE_API_KEY environment variable.";
  }

  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash"});
  
  const dataContext = JSON.stringify({ properties, units, transactions, tenants }, null, 2);

  const prompt = `
    You are an expert financial assistant for a landlord. 
    Analyze the following data and answer the user's query.
    User Query: "${query}"
    Data:
    ${dataContext}
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Error getting financial insight:", error);
    return "An error occurred while analyzing the data. Please check the console for details.";
  }
};
