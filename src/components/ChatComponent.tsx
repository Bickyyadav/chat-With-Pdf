"use client";
import React from "react";
import { Input } from "./ui/input";
import { useChat } from "@ai-sdk/react";
import { Button } from "./ui/button";
import { Send } from "lucide-react";
import MessageList from "@/config/MessageList";
import { useEffect } from "react";
import axios from "axios";

const ChatComponent = ({ chat_Id }: { chat_Id: string }) => {
  const { input, handleInputChange, handleSubmit, messages, setMessages } =
    useChat({
      api: "/api/chat",
      body: {
        chat_Id,
      },
      onResponse: async (response) => {
        const data = await response.json();
        const assistantMessage = data.message[0];
        setMessages((prev) => [...prev, assistantMessage]);
      },
    });
  console.log("🚀 ~ ChatComponent ~ messages:", messages);

  useEffect(() => {
    const getMessages = async () => {
      const response = await axios.post("/api/get-messages", {
        chat_Id,
      });
      setMessages(response.data);
    };
    getMessages();
  }, [chat_Id]);

  return (
    <div className="relative max-h-screen overflow-scroll">
      {/* header */}
      <div className="sticky top-0 inset-x-0 p-2 bg-white h-fit">
        <h3 className="text-xl font-bold">Chat</h3>
      </div>
      {/* message list */}
      <MessageList messages={messages} />
      <form
        onSubmit={handleSubmit}
        className="sticky bottom-0 inset-x-0 px-2 py-2 bg-white"
      >
        <div className="flex">
          <Input
            value={input}
            onChange={handleInputChange}
            placeholder="Ask Any Question..."
            className="w-full"
          />
          <Button className="bg-blue-600 ml-2">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ChatComponent;
