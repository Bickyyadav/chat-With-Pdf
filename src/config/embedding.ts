import { GoogleGenAI } from "@google/genai";

export async function getEmbedding(text: string) {
  console.log("🚀 ~ main ~ process.env.OPEN_AI_KEY:", process.env.OPEN_AI_KEY);
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.OPEN_AI_KEY });

    const response = await ai.models.embedContent({
      model: "gemini-embedding-exp-03-07",
      contents: text.replace(/\n/g, " "),
    });

    console.log(response.embeddings as number[]);
  } catch (error) {
    // console.log("🚀 ~ getEmbedding ~ error:", error);
    throw error;
  }
}

// getEmbedding("What is the meaning of life?");
