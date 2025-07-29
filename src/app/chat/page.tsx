"use client";

import { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import MobileChatPage from "@/app/chat/MobileChatPage";
import DesktopChatPage from "@/app/chat/DesktopChatPage";
import useMediaQuery from "@/hooks/useMediaQuery";

interface Message {
  id: string;
  message: string;
  isUser: boolean;
  timestamp: Date;
  image?: string | null;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>(ALL_MESSAGES);
  const isMobile = useIsMobile();

  const meetsQuery = useMediaQuery(1100);

  const handleSendMessage = function (message: string, image?: string | null) {
    setMessages((prevMessages) => [
      ...prevMessages,
      {
        id: `${Date.now()}-${Math.random()}`,
        isUser: true,
        message: message,
        timestamp: new Date(),
        image: image || null
      }
    ]);
  };

  if (!meetsQuery) {
    return (
      <MobileChatPage
        messages={messages}
        onSendMessage={handleSendMessage}
        isMobile={isMobile ?? true}
      />
    );
  }

  return (
    <DesktopChatPage messages={messages} onSendMessage={handleSendMessage} />
  );
}

var ALL_MESSAGES = [
  {
    id: "1",
    message: "Hello! How can I help you today?",
    isUser: false,
    timestamp: new Date(Date.now() - 5 * 60 * 1000)
  },
  {
    id: "2",
    message: "I'd like to know more about this app's features.",
    isUser: true,
    timestamp: new Date(Date.now() - 3 * 60 * 1000)
  },
  {
    id: "3",
    message:
      "This is a modern chat application with camera integration. You can capture images and send messages in real-time. The interface is responsive and works great on both desktop and mobile devices.",
    isUser: false,
    timestamp: new Date(Date.now() - 1 * 60 * 1000)
  }
];
