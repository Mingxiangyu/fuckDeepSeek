"use client";

import { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import MessageEditor from "@/components/admin/MessageEditor";
import PlaybackController from "@/components/admin/PlaybackController";

export default function AdminPage() {
  const [darkMode, setDarkMode] = useState(false);
  const [assistantMessage, setAssistantMessage] = useState('');
  const [userMessage, setUserMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [currentRole, setCurrentRole] = useState('assistant');
  const [previewWindow, setPreviewWindow] = useState(null);

  const handlePlayMessage = (message) => {
    const messageWithTimestamp = {
      ...message,
      timestamp: new Date(),
      id: Math.random().toString(36).substr(2, 9)
    };

    // 检查预览窗口是否存在且未关闭
    if (!previewWindow || previewWindow.closed) {
      // 避免重复打开窗口，先检查是否已经有窗口在打开中
      const existingWindow = window.open('/preview', '_blank');
      if (existingWindow) {
        setPreviewWindow(existingWindow);
        // 等待新窗口加载完成
        const checkWindowLoaded = () => {
          try {
            if (existingWindow.document.readyState === 'complete') {
              existingWindow.postMessage(messageWithTimestamp, '*');
            } else {
              setTimeout(checkWindowLoaded, 500);
            }
          } catch (e) {
            // 如果无法访问窗口（可能已关闭），则重置状态
            setPreviewWindow(null);
          }
        };
        setTimeout(checkWindowLoaded, 500);
      }
    } else {
      try {
        previewWindow.postMessage(messageWithTimestamp, '*');
      } catch (e) {
        // 如果发送消息失败（窗口可能已关闭），则重置状态
        setPreviewWindow(null);
      }
    }
  };

  // 添加新的消息到消息列表
  const addMessage = (role, content) => {
    if (content.trim()) {
      const newMessage = { role, content, timestamp: new Date() };
      setMessages(prev => [...prev, newMessage]);
      return newMessage;
    }
    return null;
  };

  return (
    <div className={`min-h-screen p-4 ${darkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            对话管理系统
          </h1>
          <Button
            onClick={() => setDarkMode(!darkMode)}
            variant="outline"
            className={darkMode ? 'bg-gray-800 text-white' : ''}
          >
            {darkMode ? '明亮模式' : '暗黑模式'}
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className={`p-4 ${darkMode ? 'bg-gray-800 text-white' : ''}`}>
            <h2 className="text-xl font-semibold mb-4">AI助手回复</h2>
            <MessageEditor
              title="AI助手回复"
              placeholder="请输入AI助手的回复内容..."
              onMessageChange={(content) => {
                setAssistantMessage(content);
                setCurrentRole('assistant');
              }}
              darkMode={darkMode}
            />
          </Card>

          <Card className={`p-4 ${darkMode ? 'bg-gray-800 text-white' : ''}`}>
            <h2 className="text-xl font-semibold mb-4">用户提问</h2>
            <MessageEditor
              title="用户提问"
              placeholder="请输入用户的提问内容..."
              onMessageChange={(content) => {
                setUserMessage(content);
                setCurrentRole('user');
              }}
              darkMode={darkMode}
            />
          </Card>

          <Card className={`p-4 col-span-1 md:col-span-2 ${darkMode ? 'bg-gray-800 text-white' : ''}`}>
            <h2 className="text-xl font-semibold mb-4">对话预览</h2>
            <PlaybackController
              messages={messages}
              onPlayMessage={handlePlayMessage}
              darkMode={darkMode}
              onAddMessage={() => {
                // 添加用户消息和AI助手回复，不受currentRole状态影响
                // 先添加用户消息，再添加AI助手回复
                if (userMessage.trim()) {
                  const userMsg = addMessage('user', userMessage);
                  handlePlayMessage(userMsg);
                }
                
                if (assistantMessage.trim()) {
                  const assistantMsg = addMessage('assistant', assistantMessage);
                  handlePlayMessage(assistantMsg);
                }
              }}
            />
          </Card>
        </div>
      </div>
    </div>
  );
}