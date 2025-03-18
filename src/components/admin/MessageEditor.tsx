"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Smile, Bold, Italic, List } from "lucide-react";

interface MessageEditorProps {
  title: string;
  placeholder?: string;
  onMessageChange: (content: string) => void;
  darkMode?: boolean;
}

export default function MessageEditor({
  title,
  placeholder = "请输入消息内容...",
  onMessageChange,
  darkMode = false
}: MessageEditorProps) {
  const [content, setContent] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);

  const handleContentChange = (value: string) => {
    setContent(value);
    onMessageChange(value);
  };

  const insertMarkdown = (tag: string) => {
    const textarea = document.querySelector("textarea");
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = content;
    const before = text.substring(0, start);
    const selected = text.substring(start, end);
    const after = text.substring(end);

    const newContent = `${before}${tag}${selected}${tag}${after}`;
    handleContentChange(newContent);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <div className="flex space-x-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => insertMarkdown("**")}
            className={darkMode ? "text-white hover:bg-gray-700" : ""}
          >
            <Bold size={16} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => insertMarkdown("*")}
            className={darkMode ? "text-white hover:bg-gray-700" : ""}
          >
            <Italic size={16} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => insertMarkdown("-")}
            className={darkMode ? "text-white hover:bg-gray-700" : ""}
          >
            <List size={16} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowEmoji(!showEmoji)}
            className={darkMode ? "text-white hover:bg-gray-700" : ""}
          >
            <Smile size={16} />
          </Button>
        </div>
      </div>

      <Textarea
        value={content}
        onChange={(e) => handleContentChange(e.target.value)}
        placeholder={placeholder}
        className={`min-h-[200px] ${darkMode ? "bg-gray-800 text-white" : ""}`}
      />

      {showEmoji && (
        <div className={`p-2 border rounded-lg ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}>
          <div className="grid grid-cols-8 gap-2">
            {["😊", "😂", "🤔", "👍", "❤️", "🎉", "✨", "🌟"].map((emoji) => (
              <button
                key={emoji}
                onClick={() => handleContentChange(content + emoji)}
                className="text-xl hover:bg-gray-100 rounded p-1"
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}