"use client";
import { chats } from "@prisma/client";
import Link from "next/link";
import React from "react";
import { Button } from "./ui/button";
import { MessageCircle, PlusCircle } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  chats: chats[];
  chatId: string;
};

const ChatSideBar = ({ chatId, chats }: Props) => {
  return (
    <div className="w-full h-screen p-4 text-gray-500 bg-gray-800">
      <Link href="">
        <Button className="w-full  border-dashed border-white border">
          <PlusCircle className="mr-2 w-4 h-4" /> New Chat
        </Button>
      </Link>

      <div className="flex flex-col gap-2 mt-4">
        {chats.map((chat) => (
          <Link href="" key={chat.id}>
            <div
              className={cn(
                " rounded-lg p-3 text-slate-300 flex items-center",
                {
                  "bg-blue-600 text-white": chat.id === chatId,
                  "hover:text-white": chat.id !== chatId,
                }
              )}
            >
              <MessageCircle className="mr-2" />
              <p className="w-full overflow-hidden text-sm truncate whitespace-normal text-ellipses">
                {chat.pdf_Name}
              </p>
            </div>
          </Link>
          
        ))}
      </div>
    </div>
  );
};

export default ChatSideBar;
