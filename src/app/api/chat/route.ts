import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.OPEN_AI_KEY!);

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    const lastUserMessage = messages?.[messages.length - 1]?.content;

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const result = await model.generateContent(lastUserMessage);

    const text = result.response?.candidates?.[0]?.content?.parts?.[0]?.text;
    console.log("🚀 ~ POST ~ text:", text);

    return Response.json({ message: [{ role: "assistant", content: text }] });
  } catch (error) {
    console.error("🚀 ~ POST ~ error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
