"use client";

import { useState } from "react";
import Sidebar from "@/components/sidebar/Sidebar";
import ChatContainer from "@/components/chat/ChatContainer";
import { Menu, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export default function Home() {
  const [activeChatId, setActiveChatId] = useState<string | null>(null);

  const handleNewChat = () => {
    // Reset the active chat ID to create a new conversation
    setActiveChatId(null);
  };

  return (
    <main className="flex h-screen overflow-hidden bg-white">
      {/* Mobile Sidebar */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="bg-white border-slate-200">
              <Menu className="h-4 w-4" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-72 bg-white border-r border-slate-200">
            <Sidebar onNewChat={handleNewChat} />
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden md:block w-72 border-r border-slate-200 bg-white">
        <Sidebar onNewChat={handleNewChat} />
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        {/* Header Bar */}
        <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-4 py-2 bg-white border-b border-slate-200 z-10">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="text-sm text-slate-600 hover:bg-slate-100">
              测试效果
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-md text-slate-500 hover:bg-slate-100">
              <RefreshCw size={16} />
            </Button>
          </div>
        </div>

        {/* Chat Container with padding for header */}
        <div className="pt-12 flex-1 overflow-hidden">
          <ChatContainer />
        </div>
      </div>
    </main>
  );
}
