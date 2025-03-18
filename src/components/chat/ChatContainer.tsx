"use client";

import { useState, useEffect, useRef } from "react";
import ChatInput from "./ChatInput";
import MessageBubble, { MessageType } from "./MessageBubble";
import { WhaleIcon } from "@/components/WhaleIcon";
import { v4 as uuidv4 } from "uuid";

interface Props {
  className?: string;
  messages?: MessageType[];
}

export default function ChatContainer({ className, messages: externalMessages }: Props) {
  const [messages, setMessages] = useState<MessageType[]>(externalMessages || [
    {
      id: "1",
      content: "你好！请问有什么我可以帮助你的吗？如果有具体问题或需要信息，请告诉我！",
      role: "assistant",
      timestamp: new Date(),
    },
    {
      id: "2",
      content: "好的! 如果你是在测试我的功能或响应速度，请随时告诉我具体要测试的内容或问题，我会尽力配合并提供帮助。你可以向我任何问题，比如知识查询、建议、解释概念等。😊",
      role: "assistant",
      timestamp: new Date(),
    }
  ]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const handlePlayMessage = (event: CustomEvent) => {
      const message = event.detail;
      const newMessage: MessageType = {
        id: uuidv4(),
        content: message.content,
        role: message.role,
        timestamp: new Date(message.timestamp)
      };
      setMessages(prev => [...prev, newMessage]);
    };

    // 添加自定义事件监听器
    document.addEventListener('playMessage', handlePlayMessage as EventListener);

    return () => {
      document.removeEventListener('playMessage', handlePlayMessage as EventListener);
    };
  }, []);

  const handleSendMessage = (content: string) => {
    // Add user message
    const userMessage: MessageType = {
      id: uuidv4(),
      content,
      role: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: MessageType = {
        id: uuidv4(),
        content: getAIResponse(content),
        role: "assistant",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);
      setLoading(false);
    }, 1000);
  };

  // Simple mock AI response function
  const getAIResponse = (input: string) => {
    if (input.toLowerCase().includes("hello") || input.toLowerCase().includes("hi") || input.includes("你好")) {
      return "你好！有什么我可以帮助你的吗？";
    } else if (input.toLowerCase().includes("how are you") || input.includes("最近")) {
      return "我很好，谢谢关心！我随时准备为您提供帮助。";
    } else if (input.toLowerCase().includes("what can you do") || input.includes("能做什么")) {
      return "我可以回答问题、提供信息、解释概念、给出建议，或者只是陪您聊天。您今天想探讨什么话题呢？";
    } else {
      return "我是DeepSeek人工智能助手，我能帮您解答各种问题。您想了解什么呢？";
    }
  };

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="flex-1 overflow-y-auto px-3 sm:px-4 py-4">
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}

        {loading && (
          <div className="max-w-3xl mx-auto px-2 flex items-start gap-3">
            <div className="h-7 w-7 sm:h-8 sm:w-8 flex items-center justify-center">
              <WhaleIcon size={28} className="sm:w-8 sm:h-8" />
            </div>
            <div className="flex items-center gap-2 text-slate-400 mt-2">
              <div className="flex gap-1">
                <div className="h-2 w-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                <div className="h-2 w-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                <div className="h-2 w-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
              </div>
              <span className="text-xs">正在输入...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className="p-2 sm:p-4 border-t border-slate-100">
        <ChatInput onSendMessage={handleSendMessage} />
      </div>
    </div>
  );
}
