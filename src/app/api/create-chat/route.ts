import { loadS3IntoPinecone } from "@/config/pinecone";
import { prisma_client } from "@/config/prismaClient";
import { getS3Url } from "@/config/s3";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  try {
    const body = await req.json();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { file_key, file_name } = body;
    await loadS3IntoPinecone(file_key);
    const createChat = await prisma_client.chats.create({
      data: {
        pdf_Name: file_name,
        pdf_url: getS3Url(file_key),
        file_key: file_key,
        user_id: userId,
      },

      select: {
        id: true,
      },
    });
    return NextResponse.json(
      { message: "Success", chat_id: createChat.id },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.log("🚀 ~ POST ~ error:", error);
    return NextResponse.json({ error: "Internal server error", status: 500 });
  }
}
