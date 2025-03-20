"use client";

import { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import MessageEditor from "@/components/admin/MessageEditor";
import PlaybackController from "@/components/admin/PlaybackController";
import { Trash2, Edit, Send } from "lucide-react";

export default function AdminPage() {
  const [darkMode, setDarkMode] = useState(false);
  const [assistantMessage, setAssistantMessage] = useState('');
  const [userMessage, setUserMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [currentRole, setCurrentRole] = useState('assistant');
  const [previewWindow, setPreviewWindow] = useState(null);
  const [isPreviewWindowLoading, setIsPreviewWindowLoading] = useState(false);
  const [editingMessageId, setEditingMessageId] = useState(null);
  const [conversationHistory, setConversationHistory] = useState([]);
  const [currentConversationId, setCurrentConversationId] = useState(Date.now().toString());

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
      const newMessage = { 
        role, 
        content, 
        timestamp: new Date(),
        id: Math.random().toString(36).substr(2, 9),
        conversationId: currentConversationId
      };
      
      // 更新当前会话的消息列表
      setMessages(prev => [...prev, newMessage]);
      
      // 更新对话历史
      setConversationHistory(prev => {
        // 查找当前会话
        const conversationIndex = prev.findIndex(conv => conv.id === currentConversationId);
        
        if (conversationIndex >= 0) {
          // 更新现有会话
          const updatedHistory = [...prev];
          updatedHistory[conversationIndex] = {
            ...updatedHistory[conversationIndex],
            messages: [...updatedHistory[conversationIndex].messages, newMessage],
            lastUpdated: new Date()
          };
          return updatedHistory;
        } else {
          // 创建新会话
          return [...prev, {
            id: currentConversationId,
            title: content.substring(0, 30) + (content.length > 30 ? '...' : ''),
            messages: [newMessage],
            createdAt: new Date(),
            lastUpdated: new Date()
          }];
        }
      });
      
      return newMessage;
    }
    return null;
  };

  // 开始新的对话
  const startNewConversation = () => {
    setCurrentConversationId(Date.now().toString());
    setMessages([]);
    setUserMessage('');
    setAssistantMessage('');
    setEditingMessageId(null);
  };

  // 切换到指定的对话
  const switchConversation = (conversationId) => {
    setCurrentConversationId(conversationId);
    const conversation = conversationHistory.find(conv => conv.id === conversationId);
    if (conversation) {
      setMessages(conversation.messages);
    } else {
      setMessages([]);
    }
    setUserMessage('');
    setAssistantMessage('');
    setEditingMessageId(null);
  };

  // 删除对话
  const deleteConversation = (conversationId, e) => {
    e.stopPropagation(); // 阻止事件冒泡
    setConversationHistory(prev => prev.filter(conv => conv.id !== conversationId));
    
    // 如果删除的是当前对话，则创建新对话
    if (conversationId === currentConversationId) {
      startNewConversation();
    }
  };

  // 编辑消息
  const editMessage = (messageId) => {
    const message = messages.find(msg => msg.id === messageId);
    if (message) {
      if (message.role === 'user') {
        setUserMessage(message.content);
      } else {
        setAssistantMessage(message.content);
      }
      setCurrentRole(message.role);
      setEditingMessageId(messageId);
    }
  };

  // 更新消息
  const updateMessage = () => {
    if (editingMessageId) {
      setMessages(prev => prev.map(msg => {
        if (msg.id === editingMessageId) {
          const updatedContent = currentRole === 'user' ? userMessage : assistantMessage;
          return { ...msg, content: updatedContent };
        }
        return msg;
      }));
      
      // 更新对话历史
      setConversationHistory(prev => {
        return prev.map(conv => {
          if (conv.id === currentConversationId) {
            return {
              ...conv,
              messages: conv.messages.map(msg => {
                if (msg.id === editingMessageId) {
                  const updatedContent = currentRole === 'user' ? userMessage : assistantMessage;
                  return { ...msg, content: updatedContent };
                }
                return msg;
              }),
              lastUpdated: new Date()
            };
          }
          return conv;
        });
      });
      
      setEditingMessageId(null);
      setUserMessage('');
      setAssistantMessage('');
    }
  };

  // 取消编辑
  const cancelEdit = () => {
    setEditingMessageId(null);
    setUserMessage('');
    setAssistantMessage('');
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

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* 对话历史列表 */}
          <Card className={`p-4 ${darkMode ? 'bg-gray-800 text-white' : ''} md:col-span-1`}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">对话历史</h2>
              <Button
                onClick={startNewConversation}
                variant="outline"
                size="sm"
                className={darkMode ? 'bg-gray-700 text-white hover:bg-gray-600' : ''}
              >
                新建对话
              </Button>
            </div>
            <div className="space-y-2 max-h-[500px] overflow-y-auto">
              {conversationHistory.length === 0 ? (
                <div className={`text-center py-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  暂无对话历史
                </div>
              ) : (
                conversationHistory.map(conversation => (
                  <div 
                    key={conversation.id} 
                    onClick={() => switchConversation(conversation.id)}
                    className={`p-3 rounded-lg cursor-pointer flex justify-between items-center ${conversation.id === currentConversationId ? (darkMode ? 'bg-blue-900' : 'bg-blue-100') : (darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-white hover:bg-gray-100')}`}
                  >
                    <div className="truncate flex-1">
                      <div className="font-medium truncate">{conversation.title}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {new Date(conversation.lastUpdated).toLocaleString()}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => deleteConversation(conversation.id, e)}
                      className="h-8 w-8 ml-2"
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                ))
              )}
            </div>
          </Card>

          <div className="md:col-span-3 space-y-6">
            {/* 消息编辑区域 */}
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
                  value={assistantMessage}
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
                  value={userMessage}
                />
              </Card>
            </div>

            {/* 编辑操作按钮 */}
            <div className="flex justify-end gap-2">
              {editingMessageId ? (
                <>
                  <Button
                    onClick={cancelEdit}
                    variant="outline"
                    className={darkMode ? 'bg-gray-700 text-white' : ''}
                  >
                    取消
                  </Button>
                  <Button
                    onClick={updateMessage}
                    variant="default"
                    className={darkMode ? 'bg-blue-600 hover:bg-blue-700' : ''}
                  >
                    更新消息
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    onClick={() => {
                      if (currentRole === 'user' && userMessage.trim()) {
                        const newMessage = addMessage('user', userMessage);
                        if (newMessage) {
                          handlePlayMessage(newMessage);
                          setUserMessage('');
                        }
                      } else if (currentRole === 'assistant' && assistantMessage.trim()) {
                        const newMessage = addMessage('assistant', assistantMessage);
                        if (newMessage) {
                          handlePlayMessage(newMessage);
                          setAssistantMessage('');
                        }
                      }
                    }}
                    variant="default"
                    className={darkMode ? 'bg-blue-600 hover:bg-blue-700' : ''}
                    disabled={(currentRole === 'user' && !userMessage.trim()) || (currentRole === 'assistant' && !assistantMessage.trim())}
                  >
                    <Send size={16} className="mr-2" />
                    发送消息
                  </Button>
                </>
              )}
            </div>

            {/* 对话历史显示区域 */}
            <Card className={`p-4 ${darkMode ? 'bg-gray-800 text-white' : ''}`}>
              <h2 className="text-xl font-semibold mb-4">当前对话</h2>
              <div className="space-y-4 max-h-[400px] overflow-y-auto p-2">
                {messages.length === 0 ? (
                  <div className={`text-center py-8 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    暂无消息，请开始新的对话
                  </div>
                ) : (
                  messages.map((message) => (
                    <div 
                      key={message.id} 
                      className={`p-3 rounded-lg ${message.role === 'user' ? (darkMode ? 'bg-gray-700' : 'bg-blue-50') : (darkMode ? 'bg-gray-600' : 'bg-white border border-gray-200')}`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          {message.role === 'user' ? '用户' : 'AI助手'}
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => editMessage(message.id)}
                            className="h-6 w-6"
                          >
                            <Edit size={14} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handlePlayMessage(message)}
                            className="h-6 w-6"
                          >
                            <Send size={14} />
                          </Button>
                        </div>
                      </div>
                      <div className="whitespace-pre-wrap break-words">
                        {message.content}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                        {new Date(message.timestamp).toLocaleString()}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </Card>

            {/* 预览控制器 */}
            <Card className={`p-4 ${darkMode ? 'bg-gray-800 text-white' : ''}`}>
              <h2 className="text-xl font-semibold mb-4">预览控制</h2>
              <PlaybackController 
                messages={messages} 
                onPlayMessage={handlePlayMessage} 
                onAddMessage={() => {}}
                darkMode={darkMode}
              />
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}