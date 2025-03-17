"use client";

import { Mic, Image, Paperclip, Smile } from "lucide-react";
import { Button } from "@/components/ui/button";

interface InputToolbarProps {
  onImageUpload?: () => void;
  onVoiceInput?: () => void;
}

export default function InputToolbar({ onImageUpload, onVoiceInput }: InputToolbarProps) {
  return (
    <div className="flex items-center gap-1">
      <Button 
        type="button" 
        variant="ghost" 
        size="icon" 
        className="h-8 w-8 rounded-md text-slate-400 hover:bg-slate-100"
        onClick={onImageUpload}
      >
        <Image size={18} />
      </Button>
      <Button 
        type="button" 
        variant="ghost" 
        size="icon" 
        className="h-8 w-8 rounded-md text-slate-400 hover:bg-slate-100"
        onClick={onVoiceInput}
      >
        <Mic size={18} />
      </Button>
    </div>
  );
}