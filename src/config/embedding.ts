import { GoogleGenAI } from "@google/genai";

export async function getEmbedding(text: string) {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.OPEN_AI_KEY });

    const response = await ai.models.embedContent({
      model: "text-embedding-004",
      contents: text,
    });

    if (!response.embeddings || response.embeddings.length === 0) {
      throw new Error("No embeddings returned from the model.");
    }

    const embedding = response.embeddings[0].values;
    console.log("🚀 ~ getEmbedding ~ embedding:", embedding);
    return embedding;
  } catch (error) {
    console.log("🚀 ~ getEmbedding ~ error:", error);
    throw error;
  }
}
