"use client";

import { useState } from "react";
import { PlusCircle, MessageSquare, Settings, ChevronDown, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SidebarProps {
  onNewChat: () => void;
}

export default function Sidebar({ onNewChat }: SidebarProps) {
  const [isHistoryOpen, setIsHistoryOpen] = useState(true);

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="p-3 border-b border-slate-200">
        <Button 
          onClick={onNewChat}
          className="w-full bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-200 flex items-center justify-center gap-2 py-2"
        >
          <PlusCircle size={16} />
          <span>下载 App</span>
        </Button>
      </div>

      {/* Chat History */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-3">
          <div 
            className="flex items-center justify-between p-2 hover:bg-slate-100 rounded-md cursor-pointer"
            onClick={() => setIsHistoryOpen(!isHistoryOpen)}
          >
            <span className="text-sm font-medium text-slate-700">历史记录</span>
            <ChevronDown 
              size={16} 
              className={`text-slate-500 transition-transform ${isHistoryOpen ? '' : '-rotate-90'}`} 
            />
          </div>

          {isHistoryOpen && (
            <div className="mt-1 space-y-1">
              <div className="flex items-center gap-2 p-2 rounded-md hover:bg-slate-100 cursor-pointer">
                <MessageSquare size={16} className="text-slate-500" />
                <span className="text-sm text-slate-700 truncate">测试效果</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-slate-200">
        <div className="flex flex-col gap-1">
          <Button variant="ghost" className="justify-start text-slate-700 hover:bg-slate-100">
            <Settings size={16} className="mr-2" />
            <span className="text-sm">设置</span>
          </Button>
          <Button variant="ghost" className="justify-start text-slate-700 hover:bg-slate-100">
            <LogOut size={16} className="mr-2" />
            <span className="text-sm">退出登录</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
