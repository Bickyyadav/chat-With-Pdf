import { prisma_client } from "@/config/prismaClient";

export async function POST(req: Request) {
  const { chat_id } = await req.json();
  if (!chat_id) {
    return Response.json("Invalid User id", {
      status: 400,
    });
  }

  const getMessages = await prisma_client.message.findMany({
    where: {
      chat_id: chat_id,
    },
  });

  return Response.json(getMessages);
}
