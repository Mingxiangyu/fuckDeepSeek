"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Model {
  id: string;
  name: string;
}

export default function ModelSelector() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedModel, setSelectedModel] = useState<Model>({
    id: "deepseek-chat",
    name: "测试效果"
  });

  const models: Model[] = [
    { id: "deepseek-chat", name: "测试效果" },
    { id: "deepseek-coder", name: "DeepSeek Coder" },
    { id: "deepseek-lite", name: "DeepSeek Lite" }
  ];

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        className="text-sm text-slate-600 hover:bg-slate-100 flex items-center gap-1"
        onClick={() => setIsOpen(!isOpen)}
      >
        {selectedModel.name}
        <ChevronDown size={14} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </Button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-slate-200 rounded-md shadow-lg z-50">
          <div className="py-1">
            {models.map((model) => (
              <div
                key={model.id}
                className={`px-4 py-2 text-sm cursor-pointer hover:bg-slate-100 ${
                  selectedModel.id === model.id ? 'bg-blue-50 text-blue-600' : 'text-slate-700'
                }`}
                onClick={() => {
                  setSelectedModel(model);
                  setIsOpen(false);
                }}
              >
                {model.name}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}