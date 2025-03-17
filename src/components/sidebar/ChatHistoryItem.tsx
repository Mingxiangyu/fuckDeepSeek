"use client";

import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";

interface ChatHistoryItemProps {
  title: string;
  isActive?: boolean;
  onClick?: () => void;
}

export default function ChatHistoryItem({
  title,
  isActive = false,
  onClick
}: ChatHistoryItemProps) {
  return (
    <Button
      variant="ghost"
      onClick={onClick}
      className={`w-full justify-start text-left h-auto py-2 px-3 mb-1 rounded-md ${
        isActive ? "bg-blue-50 text-blue-600" : "text-slate-600 hover:bg-slate-100"
      }`}
    >
      <div className="flex items-center gap-2">
        <MessageSquare size={16} className="flex-shrink-0 text-slate-400" />
        <span className="text-sm truncate">{title}</span>
      </div>
    </Button>
  );
}
