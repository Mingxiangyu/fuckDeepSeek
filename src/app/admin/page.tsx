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
  const [isPreviewWindowLoading, setIsPreviewWindowLoading] = useState(false);

  // 全局共享一个预览窗口，确保所有消息都发送到同一个窗口
  const handlePlayMessage = (message) => {
    const messageWithTimestamp = {
      ...message,
      timestamp: new Date(),
      id: Math.random().toString(36).substr(2, 9)
    };

    // 确保预览窗口存在且可用
    ensurePreviewWindowExists().then(window => {
      if (window) {
        try {
          window.postMessage(messageWithTimestamp, '*');
        } catch (e) {
          // 如果发送消息失败，重置窗口并重试
          setPreviewWindow(null);
          ensurePreviewWindowExists().then(newWindow => {
            if (newWindow) {
              newWindow.postMessage(messageWithTimestamp, '*');
            }
          });
        }
      }
    });
  };

  // 确保预览窗口存在并返回窗口对象
  const ensurePreviewWindowExists = () => {
    // 使用静态变量跟踪窗口创建状态，避免React状态更新延迟导致的多次创建
    if (!ensurePreviewWindowExists.isCreatingWindow) {
      ensurePreviewWindowExists.isCreatingWindow = false;
    }
    
    return new Promise(resolve => {
      // 如果已经在加载预览窗口，则等待加载完成
      if (isPreviewWindowLoading || ensurePreviewWindowExists.isCreatingWindow) {
        const checkInterval = setInterval(() => {
          if (!isPreviewWindowLoading && !ensurePreviewWindowExists.isCreatingWindow && previewWindow) {
            clearInterval(checkInterval);
            resolve(previewWindow);
          }
        }, 100);
        return;
      }
      
      // 检查预览窗口是否存在且未关闭
      if (!previewWindow || previewWindow.closed) {
        // 设置加载状态，防止重复创建窗口
        setIsPreviewWindowLoading(true);
        ensurePreviewWindowExists.isCreatingWindow = true;
        
        // 打开新的预览窗口，使用命名窗口以确保唯一性
        const newWindow = window.open('/preview', 'previewWindow');
        if (newWindow) {
          // 等待新窗口加载完成
          const checkWindowLoaded = () => {
            try {
              if (newWindow.document.readyState === 'complete') {
                setPreviewWindow(newWindow);
                setIsPreviewWindowLoading(false);
                ensurePreviewWindowExists.isCreatingWindow = false;
                resolve(newWindow);
              } else {
                setTimeout(checkWindowLoaded, 500);
              }
            } catch (e) {
              // 如果无法访问窗口，则重置状态
              setPreviewWindow(null);
              setIsPreviewWindowLoading(false);
              ensurePreviewWindowExists.isCreatingWindow = false;
              resolve(null);
            }
          };
          setTimeout(checkWindowLoaded, 500);
        } else {
          setIsPreviewWindowLoading(false);
          ensurePreviewWindowExists.isCreatingWindow = false;
          resolve(null);
        }
      } else {
        // 窗口已存在
        resolve(previewWindow);
      }
    });
  };
  
  // 初始化静态属性
  ensurePreviewWindowExists.isCreatingWindow = false;

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
                // 先确保预览窗口存在，然后再添加和发送消息
                ensurePreviewWindowExists().then(window => {
                  if (window) {
                    let userMsg = null;
                    let assistantMsg = null;
                    
                    // 添加用户消息到列表
                    if (userMessage.trim()) {
                      userMsg = addMessage('user', userMessage);
                    }
                    
                    // 添加AI助手回复到列表
                    if (assistantMessage.trim()) {
                      assistantMsg = addMessage('assistant', assistantMessage);
                    }
                    
                    // 窗口加载完成后，依次发送消息
                    if (userMsg) handlePlayMessage(userMsg);
                    if (assistantMsg) {
                      setTimeout(() => handlePlayMessage(assistantMsg), 100);
                    }
                  }
                });
              }}
            />
          </Card>
        </div>
      </div>
    </div>
  );
}