"use client";

import { useState, useEffect } from "react";
import ChatContainer from "@/components/chat/ChatContainer";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export default function PreviewPage() {
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const message = event.data;
      if (message && message.role && message.content) {
        const newMessage = {
          role: message.role,
          content: message.content,
          timestamp: new Date(message.timestamp),
          id: message.id || Math.random().toString(36).substr(2, 9)
        };
        setMessages(prev => [...prev, newMessage]);
        // 触发自定义事件，让ChatContainer组件更新消息
        const customEvent = new CustomEvent('playMessage', { detail: newMessage });
        document.dispatchEvent(customEvent);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-4">
        <ChatContainer className="h-[calc(100vh-2rem)]" messages={messages} />
      </div>
    </div>
  );
}