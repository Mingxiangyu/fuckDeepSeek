"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Mic, Image } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
}

export default function ChatInput({ onSendMessage }: ChatInputProps) {
  const [message, setMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message);
      setMessage("");
      // 重置文本区域高度
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    }
  };

  // 自动调整文本区域高度
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
    }
  }, [message]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative max-w-3xl mx-auto">
      <div className="relative flex items-center border border-slate-200 rounded-lg bg-white">
        <textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="给 DeepSeek 发送消息"
          className="flex-1 py-3 pl-4 pr-16 max-h-[200px] resize-none bg-transparent outline-none text-sm"
          rows={1}
        />
        <div className="absolute right-2 bottom-2 flex items-center gap-1">
          <Button 
            type="button" 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 rounded-md text-slate-400 hover:bg-slate-100"
          >
            <Image size={18} />
          </Button>
          <Button 
            type="button" 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 rounded-md text-slate-400 hover:bg-slate-100"
          >
            <Mic size={18} />
          </Button>
          <Button 
            type="submit" 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 rounded-md text-blue-500 hover:bg-blue-50 disabled:opacity-50"
            disabled={!message.trim()}
          >
            <Send size={18} />
          </Button>
        </div>
      </div>
      <div className="flex justify-center items-center gap-4 mt-2">
        <button className="flex items-center gap-1 text-xs text-slate-500 hover:text-blue-500">
          <span className="flex items-center justify-center w-5 h-5 bg-slate-100 rounded-full">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 16C14.2091 16 16 14.2091 16 12C16 9.79086 14.2091 8 12 8C9.79086 8 8 9.79086 8 12C8 14.2091 9.79086 16 12 16Z" fill="currentColor"/>
              <path d="M21.2799 10.4899C21.7599 11.9499 22.0099 13.4899 21.9999 14.9999C21.9999 15.9999 21.8999 16.9999 21.6999 17.9999C20.8999 21.9999 17.9999 23.9999 13.9999 23.9999H9.99994C5.99994 23.9999 2.99994 21.9999 2.29994 17.9999C2.09994 16.9999 1.99994 15.9999 1.99994 14.9999C1.99994 13.4899 2.24994 11.9499 2.72994 10.4899C3.45994 8.20994 4.91994 6.51994 6.99994 5.62994C8.17994 5.08994 9.45994 4.82994 10.7399 4.82994H13.2699C14.5399 4.82994 15.8199 5.08994 16.9999 5.62994C19.0799 6.51994 20.5399 8.20994 21.2799 10.4899Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M7.99994 2V5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M16 2V5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </span>
          <span>深度思考 (R1)</span>
        </button>
        <button className="flex items-center gap-1 text-xs text-slate-500 hover:text-blue-500">
          <span className="flex items-center justify-center w-5 h-5 bg-slate-100 rounded-full">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21Z" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M3.6001 8.25H20.4001" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M3.6001 15.75H20.4001" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 20.6999C13.9882 20.6999 15.6 16.7511 15.6 11.9999C15.6 7.24873 13.9882 3.2999 12 3.2999C10.0118 3.2999 8.3999 7.24873 8.3999 11.9999C8.3999 16.7511 10.0118 20.6999 12 20.6999Z" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </span>
          <span>联网搜索</span>
        </button>
        <div className="text-xs text-slate-400">
          内容由 AI 生成，请仔细甄别
        </div>
      </div>
    </form>
  );
}
