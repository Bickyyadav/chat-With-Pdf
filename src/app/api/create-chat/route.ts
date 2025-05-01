import { loadS3IntoPinecone } from "@/config/pinecone";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { file_key, file_name } = body;
    const pages = await loadS3IntoPinecone(file_key);
    return NextResponse.json({ pages });
  } catch (error) {
    console.log("🚀 ~ POST ~ error:", error);
    return NextResponse.json({ error: "Internal server error", status: 500 });
  }
}
