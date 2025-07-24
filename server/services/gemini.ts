import { GoogleGenAI } from "@google/genai";

// DON'T DELETE THIS COMMENT
// Follow these instructions when using this blueprint:
// - Note that the newest Gemini model series is "gemini-2.5-flash" or gemini-2.5-pro"
//   - do not change this unless explicitly requested by the user

// This API key is from Gemini Developer API Key, not vertex AI API Key
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export interface ExtractedForm16Data {
  employeeName: string;
  pan: string;
  employerName: string;
  grossSalary: number;
  basicSalary: number;
  hra: number;
  specialAllowance: number;
  deductions80C: number;
  deductions80D: number;
  standardDeduction: number;
  tdsDeducted: number;
  taxPayable: number;
  financialYear: string;
}

export interface TaxSuggestion {
  section: string;
  title: string;
  description: string;
  recommendedAmount: number;
  potentialSaving: number;
  category: string;
}

export async function extractForm16Data(ocrText: string): Promise<ExtractedForm16Data> {
  try {
    const prompt = `
    You are an expert at extracting structured data from Indian Form 16 documents. 
    Extract the following information from the OCR text and return it as JSON:
    
    {
      "employeeName": "string",
      "pan": "string",
      "employerName": "string", 
      "grossSalary": number,
      "basicSalary": number,
      "hra": number,
      "specialAllowance": number,
      "deductions80C": number,
      "deductions80D": number,
      "standardDeduction": number,
      "tdsDeducted": number,
      "taxPayable": number,
      "financialYear": "string"
    }
    
    If any field is not found, use appropriate default values (0 for numbers, empty string for text).
    
    OCR Text:
    ${ocrText}
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      config: {
        systemInstruction: "You are an expert at parsing Indian tax documents. Always respond with valid JSON.",
        responseMimeType: "application/json",
        responseSchema: {
          type: "object",
          properties: {
            employeeName: { type: "string" },
            pan: { type: "string" },
            employerName: { type: "string" },
            grossSalary: { type: "number" },
            basicSalary: { type: "number" },
            hra: { type: "number" },
            specialAllowance: { type: "number" },
            deductions80C: { type: "number" },
            deductions80D: { type: "number" },
            standardDeduction: { type: "number" },
            tdsDeducted: { type: "number" },
            taxPayable: { type: "number" },
            financialYear: { type: "string" }
          },
          required: ["employeeName", "pan", "employerName", "grossSalary", "basicSalary", "hra", "specialAllowance", "deductions80C", "deductions80D", "standardDeduction", "tdsDeducted", "taxPayable", "financialYear"]
        }
      },
      contents: prompt,
    });

    const result = JSON.parse(response.text || "{}");
    return result as ExtractedForm16Data;
  } catch (error) {
    throw new Error("Failed to extract Form 16 data: " + (error as Error).message);
  }
}

export async function generateTaxSuggestions(
  extractedData: ExtractedForm16Data, 
  userAge: number = 25
): Promise<TaxSuggestion[]> {
  try {
    const prompt = `
    Based on the following Form 16 data for a ${userAge}-year-old Indian professional, 
    provide personalized tax-saving suggestions under various sections like 80C, 80D, etc.
    
    User Data:
    - Gross Salary: ₹${extractedData.grossSalary}
    - Current 80C Deductions: ₹${extractedData.deductions80C}
    - Current 80D Deductions: ₹${extractedData.deductions80D}
    
    Return suggestions as JSON array:
    [
      {
        "section": "80C",
        "title": "ELSS Mutual Funds",
        "description": "Tax-saving mutual funds with potential for good returns",
        "recommendedAmount": number,
        "potentialSaving": number,
        "category": "investment"
      }
    ]
    
    Focus on practical suggestions for young professionals earning ₹3-20 LPA.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-pro",
      config: {
        systemInstruction: "You are a tax advisor specializing in Indian tax law for young professionals. Always respond with valid JSON.",
        responseMimeType: "application/json",
        responseSchema: {
          type: "object",
          properties: {
            suggestions: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  section: { type: "string" },
                  title: { type: "string" },
                  description: { type: "string" },
                  recommendedAmount: { type: "number" },
                  potentialSaving: { type: "number" },
                  category: { type: "string" }
                },
                required: ["section", "title", "description", "recommendedAmount", "potentialSaving", "category"]
              }
            }
          },
          required: ["suggestions"]
        }
      },
      contents: prompt,
    });

    const result = JSON.parse(response.text || '{"suggestions": []}');
    return result.suggestions || [];
  } catch (error) {
    throw new Error("Failed to generate tax suggestions: " + (error as Error).message);
  }
}

export async function generateChatbotResponse(
  message: string,
  context: string = ""
): Promise<string> {
  try {
    const systemPrompt = `You are TaxBot, a friendly AI assistant specializing in Indian tax law and ITR filing. 
    You help young professionals (0-3 years experience) understand tax concepts in simple language.
    Always be helpful, accurate, and explain complex terms in beginner-friendly way.
    Use emojis occasionally to make responses engaging but professional.
    If you're unsure about something, recommend consulting a CA.
    
    Context: ${context}`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      config: {
        systemInstruction: systemPrompt,
      },
      contents: message,
    });

    return response.text || "I'm sorry, I couldn't process your question. Please try again.";
  } catch (error) {
    throw new Error("Failed to generate chatbot response: " + (error as Error).message);
  }
}
