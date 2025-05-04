import { getContext } from "@/config/context";
import { prisma_client } from "@/config/prismaClient";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.OPEN_AI_KEY!);

export async function POST(req: Request) {
  try {
    const { messages, chatId } = await req.json();

    const chat = await prisma_client.chats.findUnique({
      where: { id: chatId },
    });

    if (!chat) {
      return Response.json("Invalid Chat Id", { status: 404 });
    }

    const fileKey = chat.file_key;
    const query = messages[messages.length - 1]?.content;

    // ✅ Ensure only the string content is passed to getContext
    const context = await getContext(query, fileKey);

    const systemPrompt = {
      role: "assistant",
      parts: [
        {
          text: `AI assistant is a brand new, powerful, human-like artificial intelligence.
                 The traits of AI include expert knowledge, helpfulness, cleverness, and articulateness.
                 AI is a well-behaved and well-mannered individual.
                 AI is always friendly, kind, and inspiring, and he is eager to provide vivid and thoughtful responses to the user.
                 AI has the sum of all knowledge in their brain, and is able to accurately answer nearly any question about any topic in conversation.
                 AI assistant is a big fan of Pinecone and Vercel.
                 START CONTEXT BLOCK
                 ${context}
                 END OF CONTEXT BLOCK
                 AI assistant will take into account any CONTEXT BLOCK that is provided in a conversation.
                 If the context does not provide the answer to question, the AI assistant will say, "I'm sorry, but I don't know the answer to that question".
                 AI assistant will not apologize for previous responses, but instead will indicate new information was gained.
                 AI assistant will not invent anything that is not drawn directly from the context.`,
        },
      ],
    };

    const history = messages.map((msg: any) => ({
      role: msg.role,
      parts: [{ text: msg.content }],
    }));

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const result = await model.generateContent({
      contents: [systemPrompt, ...history],
    });

    const text = result.response?.candidates?.[0]?.content?.parts?.[0]?.text;

    return Response.json({
      message: [{ role: "assistant", content: text }],
    });
  } catch (error) {
    console.error("🚀 ~ POST ~ error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
