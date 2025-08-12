import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const getSummaryByAI = async (text: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Provide a concise summary of the following text, focusing on the main points, if there is no text, return "No text to summarize.":
${text}`,
    });
    return response.text ?? "No summary generated.";
  } catch (error) {
    console.error("Error getting summary:", error);
    return "Error generating summary. Please try again later.";
  }
};
