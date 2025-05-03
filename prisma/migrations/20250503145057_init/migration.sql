-- CreateEnum
CREATE TYPE "Role" AS ENUM ('user', 'system');

-- CreateTable
CREATE TABLE "chats" (
    "id" TEXT NOT NULL,
    "pdf_Name" TEXT NOT NULL,
    "pdf_url" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "file_key" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "chats_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "message" (
    "id" TEXT NOT NULL,
    "chat_id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "chatsId" TEXT,

    CONSTRAINT "message_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "message" ADD CONSTRAINT "message_chatsId_fkey" FOREIGN KEY ("chatsId") REFERENCES "chats"("id") ON DELETE SET NULL ON UPDATE CASCADE;
