"use client";

import { WhaleIcon } from "@/components/WhaleIcon";
import { Avatar } from "@/components/ui/avatar";
import { User } from "lucide-react";
import { ThumbsUp, ThumbsDown, RotateCcw, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";

export type MessageType = {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
};

interface MessageBubbleProps {
  message: MessageType;
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === "user";

  return (
    <div className={`mb-4 sm:mb-6 max-w-3xl mx-auto px-1 sm:px-0 ${isUser ? 'flex flex-row-reverse' : 'flex items-start'} gap-2 sm:gap-3`}>
      {/* Avatar - Only for AI Assistant */}
      {!isUser && (
        <div className="flex-shrink-0 mt-1">
          <WhaleIcon size={28} className="w-7 h-7 sm:w-8 sm:h-8" />
        </div>
      )}

      {/* Message Content */}
      <div className={`flex-1 text-slate-700 overflow-hidden max-w-[85%] ${isUser ? 'items-end' : ''}`}>
        {/* Message Body */}
        <div className={`text-sm sm:text-base leading-relaxed whitespace-pre-wrap break-words rounded-lg p-3 ${
          isUser ? 'bg-blue-50 text-slate-700' : 'bg-white'
        }`}>
          {message.content}
        </div>

        {/* Message Footer - Only for AI messages */}
        {!isUser && (
          <div className="flex items-center gap-1 mt-1 text-slate-400">
            <Button variant="ghost" size="icon" className="h-6 w-6 rounded-md hover:bg-slate-100">
              <Copy size={14} />
            </Button>
            <Button variant="ghost" size="icon" className="h-6 w-6 rounded-md hover:bg-slate-100">
              <RotateCcw size={14} />
            </Button>
            <Button variant="ghost" size="icon" className="h-6 w-6 rounded-md hover:bg-slate-100">
              <ThumbsUp size={14} />
            </Button>
            <Button variant="ghost" size="icon" className="h-6 w-6 rounded-md hover:bg-slate-100">
              <ThumbsDown size={14} />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
